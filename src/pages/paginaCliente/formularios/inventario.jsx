import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Save, Loader2, Hash, Tag, Building2, User, Cpu, Settings,
  Barcode, MapPin, ChevronDown, ScrollText, FileText,
  CalendarCheck, DollarSign, Calendar, ShoppingCart,
  Info, Paperclip, TrendingDown, Shield, PlusCircle
} from "lucide-react";
import { useApp } from "../../../store/AppContext";
import { crearInventario, actualizarInventario, subirAdjunto } from "../../../services/inventario_services";
import BackPage from "../components/BackPage";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { listarSedes } from "../../../services/sedes_service";
import { PERMISOS } from "../../../secure/permisos/permisos";
import CentroCostoInput from "../inventario/components/centroCostoInput";
import { buscarDependenciaSede } from "../../../services/cp_dependencia_services";
import CamposInputs from "../inventario/components/inventario/camposInputs";
import renderDependenciaSelect from "../inventario/components/inventario/renderDependenciaSelect";
import renderSedeSelect from "../inventario/components/inventario/renderSedeSelect";
import renderSelectField from "../inventario/components/inventario/renderSelectField";
import renderInputField from "../inventario/components/inventario/renderInputField";
import BuscarResponsable from "../componentsUnive/BuscarResponsable";
import BuscarDependencia from "../componentsUnive/BuscarDependencia";
import BuscarProductoServicio from "../componentsUnive/BuscarProductoServicio";
import BuscarCodigoBarras from "../componentsUnive/BuscarCodigoBarras";
// Configuración de campos del formulario


const OPCIONES_SELECT = {
  grupo: ["EC", "ME", "MAQ", "IMC"],
  estado: ["NUEVO", "BUEN ESTADO"],
  tipoBien: ["mueble", "inmueble"],
  tipoAdquisicion: ["03"],
  tieneAccesorio: ["Si", "No"],
  vidaUtil: [11, 60, 120],
  vidaUtilNiff: [11, 60, 120]
};

export default function FormularioInventario() {
  const { usuario, permisos } = useApp();
  const location = useLocation();
  const inventarioEdit = location.state?.inventario;

  const [sedes, setSedes] = useState([]);
  const [dependencias, setDependencias] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(obtenerEstadoInicial());



  const puedeGuardar = inventarioEdit
    ? permisos.includes(PERMISOS.INVENTARIO.EDITAR)
    : permisos.includes(PERMISOS.INVENTARIO.CREAR);

  // Helpers
  function formatDateForInput(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function obtenerEstadoInicial() {
    return {
      codigo: "", nombre: "", dependencia: "", responsable: "", responsable_id: "", marca: "", modelo: "", serial: "", sede_id: "",
      codigo_barras: "", grupo: "", vida_util: "", vida_util_niff: "", centro_costo: "", ubicacion: "", proveedor: "",
      fecha_compra: "", soporte: "", descripcion: "", estado: "", escritura: "", matricula: "", valor_compra: "",
      salvamenta: "", depreciacion: "", depreciacion_niif: "", meses: "", meses_niif: "", tipo_adquisicion: "",
      calibrado: "", observaciones: "", tipo_bien: "", soporte_adjunto: "", coordinador_id: ""
    };
  }

  // Effects
  useEffect(() => {
    if (inventarioEdit) {
      setFormData(prev => ({
        ...prev,
        codigo: inventarioEdit.codigo || "",
        nombre: inventarioEdit.nombre || "",
        dependencia: inventarioEdit.dependencia || "",
        responsable: inventarioEdit.responsable || "",
        responsable_id: inventarioEdit.responsable_id || "",
        marca: inventarioEdit.marca || "",
        modelo: inventarioEdit.modelo || "",
        serial: inventarioEdit.serial || "",
        proceso_id: inventarioEdit.proceso_id || "",
        sede_id: inventarioEdit.sede_id || "",
        codigo_barras: inventarioEdit.codigo_barras || "",
        grupo: inventarioEdit.grupo || "",
        vida_util: inventarioEdit.vida_util ? inventarioEdit.vida_util : "",
        vida_util_niff: inventarioEdit.vida_util_niff ? inventarioEdit.vida_util_niff : "",
        centro_costo: inventarioEdit.centro_costo || "",
        ubicacion: inventarioEdit.ubicacion || "",
        proveedor: inventarioEdit.proveedor || "",
        fecha_compra: inventarioEdit.fecha_compra ? formatDateForInput(inventarioEdit.fecha_compra) : "",
        soporte: inventarioEdit.soporte || "",
        soporte_adjunto: inventarioEdit.soporte_adjunto || "",
        descripcion: inventarioEdit.descripcion || "",
        num_factu: inventarioEdit.num_factu || "",
        estado: inventarioEdit.estado || "",
        escritura: inventarioEdit.escritura || "",
        matricula: inventarioEdit.matricula || "",
        valor_compra: inventarioEdit.valor_compra || "",
        salvamenta: inventarioEdit.salvamenta || "",
        depreciacion: inventarioEdit.depreciacion || "",
        depreciacion_niif: inventarioEdit.depreciacion_niif || "",
        meses: inventarioEdit.meses || "",
        meses_niif: inventarioEdit.meses_niif || "",
        tipo_adquisicion: inventarioEdit.tipo_adquisicion || "",
        calibrado: inventarioEdit.calibrado ? formatDateForInput(inventarioEdit.calibrado) : "",
        observaciones: inventarioEdit.observaciones || "",
        tipo_bien: inventarioEdit.tipo_bien || "",
        coordinador_id: inventarioEdit.coordinador_id || "",
        proceso_solicitante: inventarioEdit.proceso_solicitante || "",
        tiene_accesorio: inventarioEdit.tiene_accesorio || "",
        descripcion_accesorio: inventarioEdit.descripcion_accesorio || "",
      }));
    }
  }, [inventarioEdit]);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const data = await listarSedes();
        setSedes(data);
      } catch (error) {
        console.error("Error al cargar las sedes:", error);
      }
    };
    fetchSedes();
  }, []);

  // Handlers
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "sede_id") {
      if (value) {
        const res = await buscarDependenciaSede(value);
        setDependencias(res.data || []);
      } else {
        setDependencias([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const datosConUsuario = {
      ...formData,
      creado_por: usuario?.id || usuario?.nombre || "desconocido",
    };

    let inventarioId = inventarioEdit?.id;

    try {
      if (inventarioEdit?.id) {
        await actualizarInventario(inventarioEdit.id, datosConUsuario);
      } else {
        const res = await crearInventario(datosConUsuario);
        inventarioId = res.id;
      }

      if (formData.soporte_adjunto instanceof File && inventarioId) {
        await subirAdjunto(inventarioId, formData.soporte_adjunto);
      }


      Swal.fire({
        icon: "success",
        title: inventarioEdit?.id ? "¡Actualizado!" : "¡Éxito!",
        text: inventarioEdit?.id ? "Inventario actualizado correctamente" : "Inventario registrado correctamente",
        timer: 2000,
        showConfirmButton: false,
      });

      if (!inventarioEdit?.id) {
        setFormData(obtenerEstadoInicial());
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo registrar el inventario",
      });
    } finally {
      setLoading(false);
    }
  };

  const CAMPOS_FORMULARIO = {
    informacionBasica: [
      { name: "codigo", label: "Serial de Inventario", icon: <Hash size={18} className="text-gray-400" />, type: "text", formData, handleChange }
    ],

    informacionBasica2: [
      { name: "marca", label: "Marca", icon: <Cpu size={18} className="text-gray-400" />, type: "text", formData, handleChange },
      { name: "modelo", label: "Modelo", icon: <Settings size={18} className="text-gray-400" />, type: "text", formData, handleChange },
      { name: "serial", label: "Serial", icon: <Barcode size={18} className="text-gray-400" />, type: "text", formData, handleChange },
      { name: "proveedor", label: "Proveedor", icon: <Building2 size={18} className="text-gray-400" />, type: "text", formData, handleChange },
      { name: "num_factu", label: "N facturas", icon: <Barcode size={18} className="text-gray-400" />, type: "text", formData, handleChange },
    ],
    informacionFinanciera: [
      { name: "fecha_compra", label: "Fecha de Compra", icon: <Calendar size={18} className="text-gray-400" />, type: "date", formData, handleChange },
      { name: "valor_compra", label: "Valor de Compra", icon: <DollarSign size={18} className="text-gray-400" />, type: "number", formData, handleChange },
    ],
    depreciacion: [
      { name: "depreciacion", label: "Depreciación", type: "number", icon: <TrendingDown size={18} className="text-gray-400" />, formData, handleChange },
      { name: "depreciacion_niif", label: "Depreciación NIIF", type: "number", icon: <TrendingDown size={18} className="text-gray-400" />, formData, handleChange },
      { name: "meses", label: "Meses Depreciación", type: "number", icon: <Calendar size={18} className="text-gray-400" />, formData, handleChange },
      { name: "meses_niif", label: "Meses Dep. NIIF", type: "number", icon: <Calendar size={18} className="text-gray-400" />, formData, handleChange },
    ],
    informacionAdicional: [
      { name: "escritura", label: "Escritura", icon: <FileText size={18} className="text-gray-400" />, type: "text", formData, handleChange },
      { name: "matricula", label: "Matrícula", icon: <FileText size={18} className="text-gray-400" />, type: "text", formData, handleChange },
      { name: "salvamenta", label: "Valor Salvamento", icon: <Shield size={18} className="text-gray-400" />, type: "text", formData, handleChange },
    ]
  };


  return (
    <motion.form
      onSubmit={(e) => {
        if (!puedeGuardar) {
          e.preventDefault();
          Swal.fire({
            icon: 'warning',
            title: 'Sin permisos',
            text: 'No tienes permisos para guardar este activo.',
            confirmButtonColor: '#6366F1'
          });
          return;
        }
        handleSubmit(e);
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-3xl mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 space-y-8"
    >
      {/* Encabezado */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent">
          {inventarioEdit ? "Editar Activo" : "Nuevo Activo inventario"}
        </h2>
        <p className="text-gray-500 mt-2">
          {inventarioEdit ? "Actualiza los datos del activo" : "Registra un nuevo activo en el inventario"}
        </p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">



          {CAMPOS_FORMULARIO.informacionBasica.map(renderInputField)}

          <BuscarProductoServicio
            label="Nombre del Activo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />

          {CAMPOS_FORMULARIO.informacionBasica2.map(renderInputField)}

          {renderSelectField({
            name: "grupo",
            label: "Grupo",
            icon: <Tag size={18} className="text-gray-400" />,
            options: OPCIONES_SELECT.grupo,
            formData,
            handleChange
          })}

          {renderSelectField({
            name: "estado",
            label: "Estado",
            icon: <Settings size={18} className="text-gray-400" />,
            options: OPCIONES_SELECT.estado,
            formData,
            handleChange
          })}

          {renderSelectField({
            name: "tiene_accesorio",
            label: "tiene accesorio",
            icon: <ScrollText size={18} className="text-gray-400" />,
            options: OPCIONES_SELECT.tieneAccesorio,
            formData,
            handleChange
          })}



          <CamposInputs
            name="descripcion_accesorio"
            label="descripcion Accesorios"
            type="text"
            icon={<ScrollText size={18} className="text-gray-400" />}
            formData={formData}
            handleChange={handleChange}
          />

          <BuscarResponsable
            name="responsable_id"
            value={formData.responsable_id}
            onChange={handleChange}
            label="Responsable"
          />

          <BuscarResponsable
            name="coordinador_id"
            value={formData.coordinador_id}
            onChange={handleChange}
            label="Coordinador"
          />

          <BuscarDependencia
            name="proceso_id"
            formSedeId={formData.sede_id}
            value={formData.proceso_id}
            onChange={handleChange}
            labelSede="Seleccione una sede"
            labelDependencia="Seleccione el proceso solicitante"
            required
            icon={
              <div className="p-1.5 bg-indigo-100 rounded-md">
                <User size={16} className="text-indigo-600" />
              </div>
            }
          />

          {/* Observaciones */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2 space-y-1"
          >
            <label htmlFor="observaciones" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <FileText size={18} className="text-gray-400" />
              <span>Observaciones</span>
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Ingrese observaciones relevantes"
            />
          </motion.div>

        </div>

        {/* Sección 2: Información financiera y depreciación */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign size={18} />
            Información Financiera
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAMPOS_FORMULARIO.informacionFinanciera.map(renderInputField)}

            {renderSelectField({
              name: "vida_util",
              label: "vida_util",
              icon: <ScrollText size={18} className="text-gray-400" />,
              options: OPCIONES_SELECT.vidaUtil,
              formData,
              handleChange
            })}

            {renderSelectField({
              name: "vida_util_niff",
              label: "vida_util_niff",
              icon: <ScrollText size={18} className="text-gray-400" />,
              options: OPCIONES_SELECT.vidaUtilNiff,
              formData,
              handleChange
            })}

            {renderDependenciaSelect({ formData, handleChange, dependencias })}

            <CentroCostoInput
              value={formData.centro_costo}
              onChange={handleChange}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-1"
            >
              <label htmlFor="ubicacion" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <MapPin size={18} className="text-gray-400" />
                <span>Ubicación específica</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="ubicacion"
                  name="ubicacion"
                  value={formData.ubicacion || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Ingrese la ubicación"
                />
                <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </motion.div>

            {/* Tipo de Bien */}
            {renderSelectField({
              name: "tipo_bien",
              label: "Tipo de Bien",
              icon: <ShoppingCart size={18} className="text-gray-400" />,
              options: OPCIONES_SELECT.tipoBien,
              formData,
              handleChange
            })}

            {CAMPOS_FORMULARIO.informacionAdicional.map(renderInputField)}
            {CAMPOS_FORMULARIO.depreciacion.map(renderInputField)}

            {/* Tipo de Adquisición */}
            {renderSelectField({
              name: "tipo_adquisicion",
              label: "Tipo de Adquisición",
              icon: <ShoppingCart size={18} className="text-gray-400" />,
              options: OPCIONES_SELECT.tipoAdquisicion,
              formData,
              handleChange
            })}



            {/* Fecha de calibrado */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-1"
            >
              <label htmlFor="calibrado" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <CalendarCheck size={18} className="text-gray-400" />
                <span>Fecha de Calibrado</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="calibrado"
                  name="calibrado"
                  value={formData.calibrado || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <CalendarCheck size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </motion.div>

          </div>
        </div>

        {/* Sección 3: Información adicional */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <Info size={18} />
            Información Adicional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Soporte/Documentación */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-1"
            >
              <label htmlFor="soporte" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Paperclip size={18} className="text-gray-400" />
                <span>Soporte/Documentación</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="soporte"
                  name="soporte"
                  value={formData.soporte || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Referencia de soporte/documentación"
                />
                <Paperclip size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </motion.div>

            {/* Adjuntar soporte */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-1"
            >
              <label htmlFor="soporte_adjunto" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Paperclip size={18} className="text-gray-400" />
                <span>Adjuntar soporte</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="soporte_adjunto"
                  name="soporte_adjunto"
                  onChange={(e) => setFormData({ ...formData, soporte_adjunto: e.target.files[0] })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <Paperclip size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-4"
      >
        <BackPage
          isEdit={!!inventarioEdit}
          className="px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
        />

        <button
          type="submit"
          disabled={loading || !puedeGuardar}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-indigo-200 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Procesando...</span>
            </>
          ) : (
            <>
              {inventarioEdit ? (
                <>
                  <Save size={20} />
                  <span>Actualizar Activo</span>
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  <span>Registrar Activo</span>
                </>
              )}
            </>
          )}
        </button>
      </motion.div>
    </motion.form>
  );
}