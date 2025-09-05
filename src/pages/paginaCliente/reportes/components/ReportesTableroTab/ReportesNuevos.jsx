import { useState, useEffect } from "react";
import { obtenerReportesNuevos, tomarReporte } from "../../../../../services/rf_reportes_fallas_services";
import { 
  Clock, 
  User, 
  AlertCircle, 
  ChevronRight, 
  Loader2, 
  Calendar,
  MapPin,
  Zap,
  Bell,
  Search,
  Filter
} from "lucide-react";

export default function ReportesNuevos({ usuario, onReporteTomado }) {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtrando, setFiltrando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroUrgencia, setFiltroUrgencia] = useState("todos");

  useEffect(() => {
    const fetchReportes = async () => {
      setLoading(true);
      try {
        const data = await obtenerReportesNuevos({ usuario_id: usuario.id });
        setReportes(data.reportes || []);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchReportes();
    
    // Actualizar cada 30 segundos para nuevos reportes
    const interval = setInterval(fetchReportes, 30000);
    return () => clearInterval(interval);
  }, [usuario.id]);

  const handleTomarReporte = async (reporteId) => {
    try {
      await tomarReporte({ usuario_id: usuario.id, reporte_id: reporteId });
      const reporteTomado = reportes.find(r => r.id === reporteId);
      setReportes(reportes.filter(r => r.id !== reporteId));
      
      // Notificar al componente padre si existe la prop
      if (onReporteTomado) {
        onReporteTomado(reporteTomado);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const obtenerColorUrgencia = (nivel) => {
    switch(nivel?.toLowerCase()) {
      case 'crítico': return 'bg-red-100 text-red-800 border-red-200';
      case 'alto': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'bajo': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const obtenerIconoUrgencia = (nivel) => {
    switch(nivel?.toLowerCase()) {
      case 'crítico': return <AlertCircle className="text-red-500" size={16} />;
      case 'alto': return <AlertCircle className="text-orange-500" size={16} />;
      case 'medio': return <AlertCircle className="text-yellow-500" size={16} />;
      case 'bajo': return <AlertCircle className="text-blue-500" size={16} />;
      default: return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  // Filtrar reportes según búsqueda y filtros
  const reportesFiltrados = reportes.filter(reporte => {
    const coincideBusqueda = reporte.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
                            reporte.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideUrgencia = filtroUrgencia === "todos" || 
                            (reporte.urgencia || '').toLowerCase() === filtroUrgencia;
    return coincideBusqueda && coincideUrgencia;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
        <p className="text-gray-600">Buscando reportes nuevos...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="text-blue-500" size={24} />
            Reportes Nuevos
            {reportes.length > 0 && (
              <span className="bg-blue-500 text-white text-sm font-medium px-2 py-1 rounded-full">
                {reportes.length} disponibles
              </span>
            )}
          </h2>
          
          <button 
            onClick={() => setFiltrando(!filtrando)}
            className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Filter size={18} />
            <span>Filtrar</span>
          </button>
        </div>

        {filtrando && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar reportes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de urgencia</label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filtroUrgencia}
                onChange={(e) => setFiltroUrgencia(e.target.value)}
              >
                <option value="todos">Todos los niveles</option>
                <option value="crítico">Crítico</option>
                <option value="alto">Alto</option>
                <option value="medio">Medio</option>
                <option value="bajo">Bajo</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {reportesFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Bell className="text-gray-400" size={28} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {busqueda || filtroUrgencia !== "todos" ? "No hay coincidencias" : "No hay reportes nuevos"}
          </h3>
          <p className="text-gray-500">
            {busqueda || filtroUrgencia !== "todos" 
              ? "Intenta ajustar los filtros de búsqueda" 
              : "Los nuevos reportes aparecerán aquí automáticamente"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reportesFiltrados.map(reporte => (
            <div key={reporte.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {obtenerIconoUrgencia(reporte.urgencia)}
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${obtenerColorUrgencia(reporte.urgencia)}`}>
                        {reporte.urgencia || 'Sin especificar'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{reporte.titulo}</h3>
                    <p className="text-gray-600 line-clamp-2">{reporte.descripcion}</p>
                  </div>
                  
                  <button
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors ml-4"
                    onClick={() => handleTomarReporte(reporte.id)}
                  >
                    <Zap size={18} />
                    <span>Tomar</span>
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>{reporte.usuario_nombre || 'Usuario anónimo'}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{new Date(reporte.fecha_creacion).toLocaleDateString()}</span>
                  </div>
                  
                  {reporte.ubicacion && (
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{reporte.ubicacion}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}