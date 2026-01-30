import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  ClipboardList,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Box,
  List,
  PenTool,
  ChevronRight,
  Download,
  Check,
  X,
  RefreshCw,
  Edit,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from "lucide-react";
import BackPage from "../../components/BackPage";
import { URL_PATH } from "../../../../const/api";
import { rechazarPedido, aprobarPedido, subirFirmaPedido, agregarAdjunto, actualizarFirmaPedido } from "../../../../services/cp_pedidos_services";
import { useApp } from "../../../../store/AppContext";
import Swal from "sweetalert2";
import { FirmaInput } from "../../../appFirma/appFirmas";
import { getEstadoIcon } from "../components/getEstadoIcon";
import { getEstadoColor } from "../components/getEstadoColor";
import { exportarPedido } from "../../../../services/cp_pedidos_services";
import AgregarFirmaModal from "../components/crearPedido/AgregarFirmaModal";
import { agregarFirmaPorClave } from "../../../../services/usuario_service";
import Portal from "../../components/Portal";
import { FirmaAprobacionModal } from "../components/pedidoDetalle/FirmaAprobacionModal";
import { CotizarItemModal } from "../components/pedidoDetalle/CotizarItemModal";
import { actualizarEstado } from "../../../../services/cp_items_services";
import UploadPdfAuto from "../../../appFirmasEditor/UploadPdfAuto"
import { analizarPDF } from "../../../appFirmasEditor/services/pdfAnalyzer";
import { firmarPDF } from "../../../appFirmasEditor/services/pdfSigner"
import { obtenerFirmas64 } from "../../../../services/cp_pedidos_services";
import { PERMISOS } from "../../../../secure/permisos/permisos";

export default function PedidoDetalle() {
  const { usuario, permisos } = useApp();
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [showObservacionesForm, setShowObservacionesForm] = useState(false);
  const [showFirmaAprobacionForm, setShowFirmaAprobacionForm] = useState(false);
  const [firmaAprobacion, setFirmaAprobacion] = useState(null);
  const [observacionRechazo, setObservacionRechazo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipoRechazo, setTipoRechazo] = useState("compras");
  const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState(location.state?.pedido || {});
  const [pdfFirmadoUrl, setPdfFirmadoUrl] = useState(null);


  const manejarConfirmacion = async () => {
    const res = await agregarFirmaPorClave({
      usuario_id: usuario.id,
    });

    if (res.status && res.firma) {
      const firmaBase64 = res.firma.startsWith("data:image")
        ? res.firma
        : `data:image/png;base64,${res.firma}`;

      setFirmaAprobacion(firmaBase64);
    } else {
      await Swal.fire("Error", res.message || "No se pudo traer la firma", "error");
    }
  };

  function cloneBuffer(buffer) {
    return buffer.slice(0);
  }

  const handlePreview = ({ file, arrayBuffer, url }) => {
    setPdfData({ file, arrayBuffer, url });
  };

  const handleFirmarDocumento = async () => {
    try {
      // 1. Validar Permisos y Flujo
      const isCompras = permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.SUBIR_ORDEN_COMPRA);
      const isGerente = permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.VER_PEDIDOS_ENCARGADO); // Asumiendo este permiso para Gerente

      // Si no es compras ni gerente con permisos, salir (aunque la UI debería ocultar el botón)
      if (!isCompras && !isGerente) return;

      // Regla: Gerente solo firma si Compras ya firmó (estado_compras === 'aprobado' o ya hay firma)
      // Aquí usaremos la info del objeto data.
      const firmaComprasYaExiste = data.estado_compras === "aprobado" || !!data.proceso_compra_firma;

      if (isGerente && !firmaComprasYaExiste) {
        return Swal.fire("Aviso", "El documento debe ser firmado primero por Compras.", "warning");
      }

      // 2. Obtener el PDF a firmar
      // Si ya hay adjunto, lo descargamos. Si no (caso inicial Compras), usamos pdfData local si se acaba de subir.
      let pdfArrayBuffer = null;

      if (data.tiene_adjunto === "Sí" && data.adjunto_url) {
        // Descargar el PDF actual del servidor (para firmar sobre él)
        setLoading(true);
        try {
          const response = await fetch(`${URL_PATH}/${data.adjunto_url}`);
          if (!response.ok) throw new Error("No se pudo descargar el documento actual.");
          pdfArrayBuffer = await response.arrayBuffer();
        } catch (e) {
          setLoading(false);
          return Swal.fire("Error", "No se pudo obtener el documento del servidor.", "error");
        }
      } else if (pdfData && pdfData.arrayBuffer) {
        // Usamos el que acaba de subir el usuario (flujo inicial Compras)
        pdfArrayBuffer = pdfData.arrayBuffer;
      } else {
        return Swal.fire("Atención", "No hay un documento PDF cargado para firmar.", "warning");
      }

      // 3. Obtener Firma del Usuario Actual
      // Aquí llamamos al endpoint o usamos la firma en sesión. 
      // Asumimos que "agregarFirmaPorClave" trae la firma del usuario logueado.
      const resFirma = await agregarFirmaPorClave({ usuario_id: usuario.id });
      if (!resFirma.status || !resFirma.firma) {
        return Swal.fire("Error", "No se pudo obtener tu firma digital.", "error");
      }
      const miFirma = resFirma.firma; // Base64

      setLoading(true);

      // 4. Configurar Firma según Rol
      // firmarPDF espera: (buffer, posiciones, [FirmaCompras, FirmaGerente], options)
      // Slot 0: Compras (Derecha)
      // Slot 1: Gerente (Izquierda)

      const posiciones = (await analizarPDF(pdfArrayBuffer.slice(0))).coincidencias || [];
      if (posiciones.length === 0) {
        setLoading(false);
        return Swal.fire("Error", "No se encontró el marcador 'OBSERVACION' en el PDF para ubicar la firma.", "error");
      }

      let firmasToApply = [null, null];
      let drawLayout = false;

      if (isCompras && !firmaComprasYaExiste) {
        // Compras firma por primera vez
        firmasToApply = [miFirma, null];
        drawLayout = true; // Dibuja líneas la primera vez
      } else if (isGerente) {
        // Gerente firma (segundo lugar)
        // Asumimos que Compras ya firmó y las líneas ya están (si el PDF descargado es el firmado).
        firmasToApply = [null, miFirma];
        drawLayout = false; // No redibujar líneas
        // NOTA: Si el PDF original NO tenía líneas guardadas (porque firmarPDF guarda todo rasterizado o vectorial), 
        // pdf-lib edita encima. Las líneas previas ya son parte del contenido de la página.
      } else {
        // Caso borde: Compras intenta firmar de nuevo?
        if (isCompras && firmaComprasYaExiste) {
          setLoading(false);
          return Swal.fire("Aviso", "Este documento ya fue firmado por Compras.", "info");
        }
      }

      // 5. Ejecutar Firma
      const bufferClonado = pdfArrayBuffer.slice(0);
      const pdfFirmadoBytes = await firmarPDF(bufferClonado, posiciones, firmasToApply, { drawLayout });

      // 6. Subir Resultado
      const blob = new Blob([pdfFirmadoBytes], { type: "application/pdf" });

      const formData = new FormData();
      // Usamos el mismo nombre o uno nuevo, el backend debería gestionar versión o reemplazo
      formData.append("archivo", blob, `pedido_${data.id}_signed.pdf`);
      formData.append("pedido_id", data.id);

      const subida = await agregarAdjunto(formData);

      if (subida?.ruta) {
        // 7. Registrar Firma en Base de Datos (Actualizar columnas)
        await registrarFirmaEnBaseDeDatos(isCompras, isGerente, usuario.id);

        Swal.fire("Éxito", "Documento firmado y registrado exitosamente.", "success");

        // Limpiar estado local de PDF subido
        setPdfData(null);

        // Recargar página para refrescar estado del pedido
        window.location.reload();
      } else {
        Swal.fire("Error", "No se pudo guardar el documento firmado.", "error");
      }

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Ocurrió un error inesperado al firmar.", "error");
    } finally {
      setLoading(false);
    }
  };
 
  const registrarFirmaEnBaseDeDatos = async (isCompras, isGerente, usuarioId) => {
    try {
      // Determinar tipo de firma según rol
      const tipoFirma = isGerente
        ? "responsable_aprobacion_firma"
        : "proceso_compra_firma";

      const response = await actualizarFirmaPedido({
        id_pedido: data.id,
        tipo_firma: tipoFirma,
        id_usuario: usuarioId,
      });

      if (!response || !response.success) {
        throw new Error(response?.mensaje || response?.error || "Error actualizando firma en BD");
      }

      if (!isGerente && data.estado_compras !== 'aprobado') {
        await aprobarPedido({
          id_pedido: data.id,
          id_usuario: usuarioId,
          tipo: "compra",
          observacion: "Firmado digitalmente"
        });
      }

      if (isGerente && data.estado_gerencia !== 'aprobado') {
        await aprobarPedido({
          id_pedido: data.id,
          id_usuario: usuarioId,
          tipo: "gerencia",
          observacion: "Firmado digitalmente"
        });
      }

    } catch (error) {
      console.error("Error al registrar firma en BD:", error);
      // No bloqueamos el flujo principal si falla esto, pero sería ideal notificar
      Swal.fire("Advertencia", "El documento se guardó pero hubo un error actualizando el estado del pedido.", "warning");
    }
  };



  useEffect(() => {
    const handler = (e) => {
      const { pedidoId, file, arrayBuffer } = e.detail;
      if (pedidoId !== data.id) return;
      procesarPDF(arrayBuffer, file);
    };

    window.addEventListener("pdf-selected", handler);
    return () => window.removeEventListener("pdf-selected", handler);
  }, [data.id])

  const handleCompradoChange = async (index, comprado) => {
    try {
      const compradoValue = comprado ? 1 : 0;

      await actualizarEstado({
        item_id: data.items[index].id,
        comprado: compradoValue,
        id_usuario: usuario.id
      });

      const updatedItems = [...data.items];
      updatedItems[index].comprado = compradoValue;
      setData({ ...data, items: updatedItems });

      Swal.fire(
        "Éxito",
        comprado ? "Ítem marcado como comprado" : "Ítem desmarcado como comprado",
        "success"
      );
    } catch (error) {
      console.error("Error al actualizar estado comprado:", error);
      Swal.fire("Error", "No se pudo actualizar el estado del ítem", "error");
    }
  };

  function base64ToFile(base64, filename) {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const handleAprobarPedido = async (motivoAprobacion = "") => {
    const result = await Swal.fire({
      title: "¿Aprobar pedido?",
      text: "Esta acción aprobará el pedido seleccionado.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    if (!firmaAprobacion) {
      setShowFirmaAprobacionForm(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const fileFirma = base64ToFile(firmaAprobacion, "firma.png");
      const tipoFirma =
        data.estado_compras === "aprobado"
          ? "responsable_aprobacion_firma"
          : "proceso_compra_firma";

      await subirFirmaPedido({
        id_pedido: data.id,
        tipo_firma: tipoFirma,
        firma: fileFirma,
        id_usuario: usuario.id,
        motivo_aprobacion: motivoAprobacion,
      });

      await aprobarPedido({
        id_pedido: data.id,
        id_usuario: usuario.id,
        tipo: data.estado_compras === "aprobado" ? "gerencia" : "compra",
        observacion: motivoAprobacion,
      });

      setShowFirmaAprobacionForm(false);
      await Swal.fire("Aprobado", "El pedido ha sido aprobado con éxito", "success");
    } catch (error) {
      await Swal.fire("Error", error?.mensaje || "No se pudo aprobar el pedido", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRechazarPedido = async (tipo) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción rechazará el pedido de forma definitiva.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, rechazar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        try {
          const payload = {
            id_pedido: data.id,
            id_usuario: usuario.id,
            observacion_diligenciado: observacionRechazo,
            tipo_rechazo: tipo
          };

          const respuesta = await rechazarPedido(payload);

          Swal.fire({
            icon: "success",
            title: "Rechazado",
            text: "El pedido ha sido rechazado con éxito."
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo rechazar el pedido. Intenta nuevamente."
          });
        } finally {
          setIsSubmitting(false);
          setShowObservacionesForm(false);
        }
      }
    });
  };

  const handleCotizar = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleSaveCotizacion = (cotizacion) => {
    console.log("Cotización guardada:", cotizacion);
    // aquí mandas el POST al backend 
  };


  const renderActionButtons = () => {
    switch (data.estado_compras?.toLowerCase()) {
      case 'pendiente':
        return (
          <>
            <button
              onClick={() => {
                setTipoRechazo("compras");
                setShowObservacionesForm(true);
              }}
              className="flex items-center gap-2 px-6 py-2 bg-[#F53232] text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              <X size={18} />
              Rechazar
            </button>
            <button
              onClick={() => setShowFirmaAprobacionForm(true)}
              className="flex items-center gap-2 px-6 py-2 bg-[#4CAF50] text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer"
            >
              <Check size={18} />
              Aprobar
            </button>

          </>
        );
      case 'en proceso':
        return (
          <>
            <button
              onClick={() => setShowObservacionesForm(true)}
              className="flex items-center gap-2 px-6 py-2 bg-[#F53232] text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              <X size={18} />
              Rechazar
            </button>
            <button
              className="flex items-center gap-2 px-6 py-2 bg-[#4CAF50] text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer">
              <Check size={18} />
              Aprobar
            </button>
          </>
        );
      case 'aprobado':
        return (
          <>
            {data.estado_gerencia === 'pendiente' && (
              <>
                <button
                  onClick={() => {
                    setTipoRechazo("gerencia");
                    setShowObservacionesForm(true);
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-[#F53232] text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  <X size={18} />
                  Rechazar
                </button>
                <button
                  onClick={() => setShowFirmaAprobacionForm(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-[#4CAF50] text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <Check size={18} />
                  Aprobar
                </button>
              </>
            )}
            <button
              onClick={() => exportarPedido(data.id)}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              <Download size={18} />
              Descargar Pedido
            </button>

          </>
        );
      default:
        return (
          <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            <Download size={18} />
            Exportar PDF
          </button>
        );
    }
  };


  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Encabezado */}
      <BackPage isEdit={true} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pedido #{data.consecutivo}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(data.estado_compras)} flex items-center gap-2`}>
                {getEstadoIcon(data.estado_compras)}
                Responsable Compras: {data.estado_compras || 'Sin estado'}
              </span>
              {data.estado_gerencia && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(data.estado_gerencia)} flex items-center gap-2`}>
                  {getEstadoIcon(data.estado_gerencia)}
                  Responsable Aprobacion: {data.estado_gerencia}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de información principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
        {/* Información básica */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 ">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={18} />
            Información del Pedido
          </h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-32 text-gray-500 flex items-center gap-2">
                <Calendar size={16} />
                <span>Fecha:</span>
              </div>
              <div className="font-medium">{new Date(data.fecha_solicitud + 'T00:00:00').toLocaleDateString()}</div>
            </div>

            <div className="flex items-start">
              <div className="w-32 text-gray-500 flex items-center gap-2">
                <User size={16} />
                <span>Solicitante:</span>
              </div>
              <div className="font-medium">{data.creador_nombre}</div>
            </div>

            <div className="flex items-start">
              <div className="w-32 text-gray-500">Proceso:</div>
              <div className="font-medium">{data.proceso_solicitante}</div>
            </div>

            <div className="flex items-start">
              <div className="w-32 text-gray-500">Tipo:</div>
              <div className="font-medium">{data.tipo_solicitud_nombre}</div>
            </div>

            {data.observacion && (
              <div className="flex items-start">
                <div className="w-32 text-gray-500">Observación:</div>
                <div className="bg-gray-50 p-3 rounded-lg text-gray-700 italic">
                  {data.observacion}
                </div>
              </div>
            )}
            {data.observacion_diligenciado && (
              <div className="mt-3">
                <p className="text-gray-500 mb-1">Motivo Rechazo:</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{data.observacion_diligenciado}</p>
              </div>
            )}
          </div>
        </div>

        {/* Firmas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PenTool size={18} />
            Firmas
          </h2>

          <div className="space-y-6">
            {/* Elaborado por */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Elaborado por</h3>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">{data.elaborado_por_nombre}</span>
                {data.elaborado_por_firma ? (
                  <img
                    src={`${URL_PATH}${data.elaborado_por_firma}`}
                    alt="Firma elaborado por"
                    className="h-12"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Pendiente</span>
                )}
              </div>
            </div>

            {/* Proceso compra */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Proceso compra</h3>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">{data.proceso_compra_nombre || 'No asignado'}</span>
                {data.proceso_compra_firma ? (
                  <img
                    src={`${URL_PATH}${data.proceso_compra_firma}`}
                    alt="Firma proceso compra"
                    className="h-12"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Pendiente</span>
                )}
              </div>
            </div>

            {/* Aprobación */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Aprobación</h3>
                <button
                  onClick={() => { }}
                  className="p-1 hover:bg-blue-50 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  title="Editar aprobación"
                >
                  <Edit
                    size={16}
                    className="text-blue-500 hover:text-blue-700"
                  />
                </button>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">{data.responsable_aprobacion_nombre || 'No asignado'}</span>
                {data.responsable_aprobacion_firma ? (
                  <img
                    src={`${URL_PATH}${data.responsable_aprobacion_firma}`}
                    alt="Firma aprobación"
                    className="h-12"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Pendiente</span>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Ítems del pedido */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Box size={18} />
            Ítems solicitados
          </h2>
          <span className="text-sm text-gray-500">{data.items?.length || 0} ítems</span>
        </div>

        {data.items && data.items.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {data.items.map((item, index) => (
              <li
                key={index}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">{item.nombre}</h3>
                    </div>
                    {item.referencia_items && (
                      <a
                        href={item.referencia_items}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                        title="Abrir referencia"
                      >
                        <ExternalLink className="w-5 h-5 text-blue-600" />
                      </a>
                    )}
                  </div>                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">
                      {item.cantidad} unidades
                    </span>

                    {/* Checkbox para items.comprado */}
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.comprado === 1}
                          onChange={(e) => handleCompradoChange(index, e.target.checked)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${item.comprado === 1
                          ? 'bg-green-500 border-green-500'
                          : 'bg-white border-gray-300 hover:border-green-400'
                          }`}>
                          {item.comprado === 1 && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          {item.comprado === 1 ? 'Entregado' : 'Marcar como Entregado'}
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={() => handleCotizar(item)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                      hidden
                    >
                      Cotizar
                    </button>
                    <ChevronRight className="text-gray-400" size={18} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No hay ítems registrados en este pedido
          </div>
        )}
      </div>

      {/* Acciones */}
      {showObservacionesForm && (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500" />
            Motivo del Rechazo {tipoRechazo === "gerencia" && "(Gerencia)"}
          </h3>
          <textarea
            value={observacionRechazo}
            onChange={(e) => setObservacionRechazo(e.target.value)}
            placeholder="Describe el motivo del rechazo..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            rows={4}
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setShowObservacionesForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleRechazarPedido(tipoRechazo)}
              disabled={!observacionRechazo || isSubmitting}
              className={`flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors ${(!observacionRechazo || isSubmitting) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <X size={18} />
                  Confirmar Rechazo
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        {/* Lógica para Compras: Subir y Firmar Plantilla */}
        {data.tiene_adjunto === "No" && data.estado_gerencia === "aprobado" && permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.SUBIR_ORDEN_COMPRA) && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Cargar y Firmar Orden de Compra
            </h3>

            <UploadPdfAuto
              pedidoId={data.id}
              onPreview={handlePreview}
            />

            {pdfData && (
              <button
                type="button"
                onClick={handleFirmarDocumento}
                disabled={loading}
                className={`
            mt-4 px-4 py-2 rounded-md 
            transition-all duration-200 ease-in-out
            font-medium text-white
            ${loading
                    ? "bg-gray-400 cursor-not-allowed opacity-60"
                    : "bg-[#4F39F6] hover:bg-[#4F39B6]/80"
                  }
          `}
              >
                {loading ? "Procesando..." : "Firmar y Guardar Documento"}
              </button>
            )}
          </div>
        )}

        {/* Lógica para Gerente: Firmar Documento existente */}
        {data.tiene_adjunto === "Sí" &&
          data.estado_compras === "aprobado" &&
          data.estado_gerencia === "pendiente" && // O en proceso, pero debe estar pendiente de firma gerente
          // Verificar permiso de Gerente (usando VER_PEDIDOS_ENCARGADO como proxy según analizamos, o el que corresponda)
          permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.VER_PEDIDOS_ENCARGADO) &&
          // Verificar que NO haya firmado ya (data.responsable_aprobacion_firma check)
          !data.responsable_aprobacion_firma &&
          (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Firma de Autorización (Gerencia)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                El documento ya ha sido firmado por Compras. Proceda a agregar su firma de autorización.
              </p>
              <button
                type="button"
                onClick={handleFirmarDocumento}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                <PenTool size={18} />
                {loading ? "Firmando..." : "Firmar Documento"}
              </button>
            </div>
          )
        }
      </div>

      {/* firma */}
      {showFirmaAprobacionForm && (
        <Portal>
          <FirmaAprobacionModal
            firmaAprobacion={firmaAprobacion}
            setFirmaAprobacion={setFirmaAprobacion}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            isSubmitting={isSubmitting}
            setShowFirmaAprobacionForm={setShowFirmaAprobacionForm}
            handleAprobarPedido={handleAprobarPedido}
            manejarConfirmacion={manejarConfirmacion}
          />
        </Portal>
      )}


      {data.adjunto_url && data.tiene_adjunto === "Sí" && (
        <iframe
          src={`${URL_PATH}/${data.adjunto_url}`}
          width="100%"
          height="600px"
          title="Visor PDF"
        />
      )}

      {/* modal para cotizar */}
      <CotizarItemModal
        open={open}
        onClose={() => setOpen(false)}
        item={selectedItem}
        onSave={handleSaveCotizacion}
      />


      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        {renderActionButtons()}
      </div>
    </div >
  );
}
