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

export default function PedidoDetalle() {
  const location = useLocation();
  const [showObservacionesForm, setShowObservacionesForm] = useState(false);
  const [observacionRechazo, setObservacionRechazo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const data = location.state?.pedido || {};

  useEffect(() => {
    console.log(data);
  }, []);

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'aprobado':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      case 'en proceso':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'aprobado':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pendiente':
        return <Clock size={16} className="text-yellow-500" />;
      case 'rechazado':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'en proceso':
        return <PenTool size={16} className="text-blue-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  const handleRechazarPedido = async () => {
    setIsSubmitting(true);
    try {
      // Aquí iría tu llamada API para rechazar el pedido
      // await rechazarPedido(data.id, observacionRechazo);
      console.log("Pedido rechazado con observación:", observacionRechazo);
      // Actualizar el estado local o recargar datos
    } catch (error) {
      console.error("Error al rechazar pedido:", error);
    } finally {
      setIsSubmitting(false);
      setShowObservacionesForm(false);
    }
  };

  const renderActionButtons = () => {
    switch (data.estado_compras?.toLowerCase()) {
      case 'pendiente':
        return (
          <>
            <button
              onClick={() => setShowObservacionesForm(true)}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <X size={18} />
              Rechazar
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              <RefreshCw size={18} />
              En Proceso
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
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
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <X size={18} />
              Rechazar
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              <Check size={18} />
              Aprobar
            </button>
          </>
        );
      case 'aprobado':
        return (
          <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            <Download size={18} />
            Exportar PDF
          </button>
        );
      case 'rechazado':
        return (
          <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            <Edit size={18} />
            Editar Pedido
          </button>
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
    <div className="max-w-4xl mx-auto p-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Información básica */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
                    src={`/${data.proceso_compra_firma}`}
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
                    src={`/${data.responsable_aprobacion_firma}`}
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
            Motivo del Rechazo
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
              onClick={handleRechazarPedido}
              disabled={!observacionRechazo || isSubmitting}
              className={`flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors ${(!observacionRechazo || isSubmitting) ? 'opacity-70 cursor-not-allowed' : ''}`}
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

      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        {renderActionButtons()}
      </div>
    </div >
  );
}