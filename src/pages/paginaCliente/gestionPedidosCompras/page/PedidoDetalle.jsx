import { useEffect, useState } from "react";
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
  ChevronUp
} from "lucide-react";
import BackPage from "../../components/BackPage";
import { URL_IMAGE2 } from "../../../../const/api";
import { rechazarPedido, aprobarPedido, subirFirmaPedido } from "../../../../services/cp_pedidos_services";
import { useApp } from "../../../../store/AppContext";
import Swal from "sweetalert2";
import { FirmaInput } from "../../../appFirma/appFirmas";
import { getEstadoIcon } from "../components/getEstadoIcon";
import { getEstadoColor } from "../components/getEstadoColor";
import { exportarPedido } from "../../../../services/cp_pedidos_services";

export default function PedidoDetalle() {
  const { usuario } = useApp();
  const location = useLocation();
  const [showObservacionesForm, setShowObservacionesForm] = useState(false);
  const [showFirmaAprobacionForm, setShowFirmaAprobacionForm] = useState(false);
  const [firmaAprobacion, setFirmaAprobacion] = useState(null);
  const [observacionRechazo, setObservacionRechazo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const data = location.state?.pedido || {};
  const [tipoRechazo, setTipoRechazo] = useState("compras");


  useEffect(() => {
    console.log(data);
  }, []);




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

  const handleAprobarPedido = async () => {
    Swal.fire({
      title: "¿Aprobar pedido?",
      text: "Esta acción aprobará el pedido seleccionado.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        if (!firmaAprobacion) {
          Swal.fire("Error", "Debes agregar tu firma antes de aprobar", "error");
          return;
        }

        const fileFirma = base64ToFile(firmaAprobacion, "firma.png");

        const tipoFirma =
          data.estado_compras === "aprobado"
            ? "responsable_aprobacion_firma"
            : "proceso_compra_firma";

        // Subir firma
        await subirFirmaPedido({
          id_pedido: data.id,
          tipo_firma: tipoFirma,
          firma: fileFirma,
          id_usuario: usuario.id
        });

        // Aprobar pedido
        const respuesta = await aprobarPedido({
          id_pedido: data.id,
          id_usuario: usuario.id,
          tipo: data.estado_compras === "aprobado" ? "gerencia" : "compra"
        });


        Swal.fire("Aprobado", "El pedido ha sido aprobado con éxito", "success");
        setShowFirmaAprobacionForm(false);
        console.log(respuesta);

      } catch (error) {
        Swal.fire("Error", error?.mensaje || "No se pudo aprobar el pedido", "error");
      }
    });
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
          console.log("Pedido rechazado:", respuesta);

          Swal.fire({
            icon: "success",
            title: "Rechazado",
            text: "El pedido ha sido rechazado con éxito."
          });
        } catch (error) {
          console.error("Error al rechazar pedido:", error);
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
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              <X size={18} />
              Rechazar
            </button>
            <button
              onClick={() => setShowFirmaAprobacionForm(true)}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer"
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
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              <X size={18} />
              Rechazar
            </button>
            <button
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer">
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
                  className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  <X size={18} />
                  Rechazar
                </button>
                <button
                  onClick={() => setShowFirmaAprobacionForm(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
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
                {data.estado_compras || 'Sin estado'}
              </span>
              {data.estado_gerencia && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(data.estado_gerencia)} flex items-center gap-2`}>
                  {getEstadoIcon(data.estado_gerencia)}
                  Gerencia: {data.estado_gerencia}
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
              <div className="font-medium">{data.fecha_solicitud}</div>
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
                    src={`${URL_IMAGE2}${data.elaborado_por_firma}`}
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
                    src={`${URL_IMAGE2}${data.proceso_compra_firma}`}
                    alt="Firma proceso compra"
                    className="h-12"
                  />
                ) : (
                  <span className="text-sm text-gray-400">Pendiente</span>
                )}
              </div>
            </div>

            {/* Aprobación */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Aprobación</h3>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="font-medium">{data.responsable_aprobacion_nombre || 'No asignado'}</span>
                {data.responsable_aprobacion_firma ? (
                  <img
                    src={`${URL_IMAGE2}${data.responsable_aprobacion_firma}`}
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
              <li key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.nombre}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Referencia: {item.referencia_items || 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">
                      {item.cantidad} unidades
                    </span>
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


      {/* firma */}
      {showFirmaAprobacionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00000050] bg-opacity-80 ">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl  overflow-hidden">
            {/* Encabezado */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PenTool size={24} className="text-blue-200" />
                  <h3 className="text-xl font-semibold">Firma de Aprobación</h3>
                </div>
                <button
                  onClick={() => setShowFirmaAprobacionForm(false)}
                  className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="mt-2 text-blue-100 text-sm">
                Por favor firma en el recuadro para aprobar el pedido
              </p>
            </div>

            {/* Contenido */}
            <div className="p-6">
              <div className="mb-6">
                <FirmaInput
                  value={firmaAprobacion}
                  onChange={setFirmaAprobacion}
                  label=""
                  canvasHeight={150}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowFirmaAprobacionForm(false);
                    setFirmaAprobacion("");
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <X size={18} />
                  Cancelar
                </button>
                <button
                  onClick={handleAprobarPedido}
                  disabled={!firmaAprobacion || isSubmitting}
                  className={`flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:opacity-90 transition-all ${!firmaAprobacion ? 'opacity-70 cursor-not-allowed' : ''
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
                      <Check size={18} />
                      Confirmar Aprobación
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        {renderActionButtons()}
      </div>
    </div >
  );
}