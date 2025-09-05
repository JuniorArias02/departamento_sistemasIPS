import { useState, useEffect } from "react";
import ChatModal from "../components/ChatModal";
import { obtenerReportesAsignados, obtenerMisReportesCreados } from "../../../../../services/rf_reportes_fallas_services";
import { crearComentario, obtenerComentarios } from "../../../../../services/rf_reportes_comentarios_services";
import {
  MessageSquare,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Circle,
  Search,
  Filter,
  Plus,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function ReportesAsignados({ usuario }) {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comentarios, setComentarios] = useState({});
  const [modalAbierto, setModalAbierto] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [orden, setOrden] = useState("recientes");
  const [reporteExpandido, setReporteExpandido] = useState(null);

  useEffect(() => {
    const fetchReportes = async () => {
      setLoading(true);
      try {
        const asignados = await obtenerReportesAsignados({ usuario_id: usuario.id });
        const creados = await obtenerMisReportesCreados({ usuario_id: usuario.id });
        const combinados = [...(asignados.reportes || []), ...(creados.reportes || [])];
        const uniqueReportes = Array.from(new Map(combinados.map(r => [r.id, r])).values());
        setReportes(uniqueReportes);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchReportes();
  }, [usuario.id]);

  const abrirChat = async (reporteId) => {
    if (!comentarios[reporteId]) {
      const data = await obtenerComentarios({ reporte_id: reporteId });
      setComentarios(prev => ({ ...prev, [reporteId]: data.comentarios || [] }));
    }
    setModalAbierto(reporteId);
  };

  const enviarComentario = async (reporteId, texto) => {
    const data = await crearComentario({
      usuario_id: usuario.id,
      reporte_id: reporteId,
      comentario: texto,
    });
    const comentarioConNombre = { ...data.comentario, usuario_nombre: usuario.nombre_completo || "Desconocido" };
    setComentarios(prev => ({
      ...prev,
      [reporteId]: [...(prev[reporteId] || []), comentarioConNombre]
    }));
    return comentarioConNombre;
  };

  const toggleExpandirReporte = (reporteId) => {
    if (reporteExpandido === reporteId) {
      setReporteExpandido(null);
    } else {
      setReporteExpandido(reporteId);
    }
  };

  const obtenerIconoEstado = (estado) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return <AlertCircle className="text-amber-500" size={18} />;
      case "resuelto":
        return <CheckCircle className="text-green-500" size={18} />;
      case "en progreso":
        return <Clock className="text-blue-500" size={18} />;
      default:
        return <Circle className="text-gray-400" size={18} />;
    }
  };

  // Filtrar y ordenar reportes
  const reportesFiltrados = reportes
    .filter(reporte => {
      const coincideBusqueda = reporte.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        reporte.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const coincideEstado = filtroEstado === "todos" || reporte.estado.toLowerCase() === filtroEstado;
      return coincideBusqueda && coincideEstado;
    })
    .sort((a, b) => {
      if (orden === "recientes") {
        return new Date(b.fecha_creacion || 0) - new Date(a.fecha_creacion || 0);
      } else {
        return new Date(a.fecha_creacion || 0) - new Date(b.fecha_creacion || 0);
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className="ml-2 text-gray-600">Cargando reportes...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Reportes</h1>
        <p className="text-gray-600">Gestiona tus reportes asignados y creados</p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar reportes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select
                className="appearance-none bg-white pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en progreso">En progreso</option>
                <option value="resuelto">Resuelto</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-white pl-3 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="antiguos">Más antiguos</option>
              </select>
              {orden === "recientes" ?
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} /> :
                <ChevronUp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              }
            </div>
          </div>
        </div>
      </div>

      {reportesFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <FileText className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay reportes</h3>
          <p className="text-gray-500">
            {busqueda || filtroEstado !== "todos"
              ? "No se encontraron reportes con los filtros aplicados"
              : "No tienes reportes asignados o creados"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reportesFiltrados.map(r => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleExpandirReporte(r.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {obtenerIconoEstado(r.estado)}
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${r.estado.toLowerCase() === 'pendiente' ? 'bg-amber-100 text-amber-800' : r.estado.toLowerCase() === 'en progreso' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {r.estado}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{r.titulo}</h3>
                    <p className="text-gray-600 line-clamp-2">{r.descripcion}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      className="flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirChat(r.id);
                      }}
                    >
                      <MessageSquare size={18} />
                      <span>Chat</span>
                    </button>

                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <User size={14} />
                      <span>{r.usuario_nombre}</span>
                    </div>
                  </div>
                </div>
              </div>

              {reporteExpandido === r.id && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Descripción completa:</h4>
                    <p className="text-gray-600">{r.descripcion}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Creado: {new Date(r.fecha_creacion).toLocaleDateString()}</span>
                    </div>
                    {r.fecha_actualizacion && (
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Actualizado: {new Date(r.fecha_actualizacion).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modalAbierto && (
        <ChatModal
          reporte={reportes.find(r => r.id === modalAbierto)}
          usuario={usuario}
          comentariosIniciales={comentarios[modalAbierto]}
          onClose={() => setModalAbierto(null)}
          enviarComentario={enviarComentario}
        />
      )}
    </div>
  );
}