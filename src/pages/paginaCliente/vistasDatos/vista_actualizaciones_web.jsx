import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Zap,
  CircleEllipsis,
  TrendingUp,
  Info,
  Rocket
} from 'lucide-react';
import { listarAvisosACtualizacionesWeb } from '../../../services/administrador_web_services';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function VistaActualizacionesWeb() {
  const [actualizaciones, setActualizaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerActualizaciones = async () => {
      try {
        setCargando(true);
        const respuesta = await listarAvisosACtualizacionesWeb();
        setActualizaciones(respuesta.data);
      } catch (err) {
        setError(err.message);
        await Swal.fire({
          title: 'Error',
          text: err.message,
          icon: 'error',
          confirmButtonColor: '#7e22ce',
          background: '#fff',
          backdrop: 'rgba(0,0,0,0.1)'
        });
      } finally {
        setCargando(false);
      }
    };
    obtenerActualizaciones();
  }, []);

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Mejora: Colores más modernos y accesibles
  const obtenerColorEstado = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'en progreso': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'finalizado': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const obtenerIconoEstado = (estado) => {
    switch (estado.toLowerCase()) {
      case 'pendiente': return <AlertCircle className="w-4 h-4" />;
      case 'en progreso': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'finalizado': return <CheckCircle className="w-4 h-4" />;
      default: return <CircleEllipsis className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header mejorado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Volver atrás</span>
        </button>

        <div className="text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-3">
            <Zap className="w-8 h-8 text-purple-600" />
            Próximas Actualizaciones
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Descubre las mejoras que estamos preparando para ti
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="space-y-8">
        {cargando ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <RefreshCw className="w-10 h-10 text-purple-600 animate-spin" />
            <p className="text-gray-600">Cargando actualizaciones...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-red-600 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-8 h-8" />
            <p className="font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : actualizaciones.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-inner">
            <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h3 className="text-2xl font-medium text-gray-700 mb-2">No hay actualizaciones programadas</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Estamos trabajando en nuevas funcionalidades. ¡Vuelve pronto para descubrirlas!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"> {/* ¡items-stretch es clave! */}
            {actualizaciones.map(actualizacion => (
              <div
                key={actualizacion.id}
                className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header con gradiente */}
                <div className={`p-5 bg-gradient-to-r ${actualizacion.estado === 'pendiente' ? 'from-amber-50 to-amber-100' : actualizacion.estado === 'en progreso' ? 'from-blue-50 to-blue-100' : 'from-emerald-50 to-emerald-100'} border-b border-gray-100`}>
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="text-xl poppins-semibold  text-gray-900">{actualizacion.titulo}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${obtenerColorEstado(actualizacion.estado)}`}>
                      {obtenerIconoEstado(actualizacion.estado)}
                      {actualizacion.estado}
                    </span>
                  </div>
                </div>

                {/* Cuerpo */}
                <div className="p-6">
                  <p className="text-gray-700 mb-5 leading-relaxed inter-medium">{actualizacion.descripcion}</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">FECHA DE ACTUALIZACIÓN</p>
                        <p className="text-gray-900">{formatearFecha(actualizacion.fecha_actualizacion)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">DURACIÓN ESTIMADA</p>
                        <p className="text-gray-900">{actualizacion.duracion_minutos} minutos</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">VISIBLE EN EL SISTEMA</p>
                        <p className="text-gray-900">
                          {formatearFecha(actualizacion.mostrar_desde)} - {formatearFecha(actualizacion.mostrar_hasta)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100 poppins-semibold">
                  <p>Publicado el {new Date(actualizacion.creado_en).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Elemento decorativo */}
      <div className="mt-16 text-center">
        <p className="text-gray-400 text-sm">
          ¿Tienes preguntas sobre estas actualizaciones? <a href="#" className="text-purple-600 hover:underline">Contáctanos</a>
        </p>
      </div>
    </div>
  );
}