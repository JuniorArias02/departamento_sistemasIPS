import { useState } from "react";
import { crearReporte } from "../../../../services/rf_reportes_fallas_services";
import { useApp } from "../../../../store/AppContext";
import {
  AlertTriangle,
  Plus,
  FileText,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Image as ImageIcon,
  Paperclip
} from "lucide-react";

export default function CrearReporte({ onVolver }) {
  const { usuario } = useApp();

  const [form, setForm] = useState({
    usuario_id: usuario.id,
    titulo: "",
    descripcion: "",
    prioridad: "media"
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    try {
      const data = await crearReporte(form);
      if (data.success) {
        setMensaje("éxito");
        setForm(prev => ({ ...prev, titulo: "", descripcion: "" }));
        setTimeout(() => {
          setMensaje("");
          setMostrarConfirmacion(false);
        }, 2000);
      } else {
        setMensaje(data.message);
      }
    } catch (error) {
      setMensaje(error.message || "Error al crear el reporte");
    }
    setLoading(false);
  };

  const obtenerColorPrioridad = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const obtenerIconoPrioridad = (prioridad) => {
    switch (prioridad) {
      case 'alta': return <AlertTriangle size={16} className="text-red-500" />;
      case 'media': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'baja': return <AlertTriangle size={16} className="text-blue-500" />;
      default: return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-5 mb-5 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg ">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {onVolver && (
          <button
            onClick={onVolver}
            className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="bg-blue-100 p-3 rounded-full">
          <FileText className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Crear Nuevo Reporte</h2>
          <p className="text-gray-600">Describe el problema que encontraste</p>
        </div>
      </div>

      {/* Mensaje de estado */}
      {mensaje && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${mensaje.includes("éxito")
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-red-100 text-red-800 border border-red-200"
          }`}>
          {mensaje.includes("éxito") ? (
            <CheckCircle size={20} className="text-green-500" />
          ) : (
            <XCircle size={20} className="text-red-500" />
          )}
          <span>{mensaje.includes("éxito") ? "¡Reporte creado con éxito!" : mensaje}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título del reporte
          </label>
          <div className="relative">
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-3 pl-11 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Ej: Problema con el sistema de impresión"
              required
            />
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Campo Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción detallada
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            rows={5}
            placeholder="Describe con detalle el problema que estás experimentando, incluyendo pasos para reproducirlo si es posible..."
            required
          ></textarea>
        </div>

        {/* Campo Prioridad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nivel de prioridad
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {['baja', 'media', 'alta'].map((nivel) => (
              <label
                key={nivel}
                className={`flex items-center gap-2 p-4 border-2 rounded-xl cursor-pointer transition-all ${form.prioridad === nivel
                    ? `${obtenerColorPrioridad(nivel)} border-current shadow-sm`
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <input
                  type="radio"
                  name="prioridad"
                  value={nivel}
                  checked={form.prioridad === nivel}
                  onChange={handleChange}
                  className="hidden"
                />
                {obtenerIconoPrioridad(nivel)}
                <span className="font-medium capitalize">{nivel}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sección de archivos (opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adjuntar archivos (opcional)
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
            >
              <ImageIcon size={18} />
              <span>Imágenes</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
            >
              <Paperclip size={18} />
              <span>Documentos</span>
            </button>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4">
          {onVolver && (
            <button
              type="button"
              onClick={onVolver}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creando reporte...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Crear Reporte</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Información adicional */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
          <AlertTriangle size={16} />
          Consejos para un buen reporte
        </h3>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Sé específico y describe el problema con detalle</li>
          <li>• Incluye pasos para reproducir el error si es posible</li>
          <li>• Agrega capturas de pantalla si son relevantes</li>
          <li>• Selecciona la prioridad adecuada según la urgencia</li>
        </ul>
      </div>
    </div>
  );
}