import { useEffect, useState } from "react";
import { obtenerPersonal } from "../../../../services/personal_services";
import { 
  User, Phone, IdCard, Briefcase, Edit3, Trash2, Plus, 
  UserPlus, Search, Filter, ChevronLeft, ChevronRight
} from "lucide-react";

export default function GestionPersonalVista() {
  const [personal, setPersonal] = useState([]);
  const [personalFiltrado, setPersonalFiltrado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(20);

  useEffect(() => {
    const cargarDatos = async () => {
      const data = await obtenerPersonal();
      setPersonal(data.data);
      setPersonalFiltrado(data.data);
      setLoading(false);
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    filtrarPersonal();
  }, [busqueda, personal]);

  const filtrarPersonal = () => {
    let resultado = personal;
    
    // Filtrar por búsqueda
    if (busqueda) {
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (p.cargo && p.cargo.toLowerCase().includes(busqueda.toLowerCase())) ||
        (p.proceso && p.proceso.toLowerCase().includes(busqueda.toLowerCase())) ||
        p.cedula.includes(busqueda)
      );
    }
    
    setPersonalFiltrado(resultado);
    setPaginaActual(1); // Reiniciar a la primera página al buscar/filtrar
  };

  // Obtener items actuales para paginación
  const indexOfLastItem = paginaActual * itemsPorPagina;
  const indexOfFirstItem = indexOfLastItem - itemsPorPagina;
  const itemsActuales = personalFiltrado.slice(indexOfFirstItem, indexOfLastItem);
  const totalPaginas = Math.ceil(personalFiltrado.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Cargando personal...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-white shadow-sm text-blue-600 border border-blue-100">
            <UserPlus size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestión de Personal</h1>
            <p className="text-gray-600">Administra el personal registrado en el sistema</p>
          </div>
        </div>
        <button className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl transition-all shadow-md hover:shadow-lg">
          <Plus size={20} className="mr-2" />
          Agregar Personal
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, cédula, cargo o proceso..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50">
            <Filter size={18} className="mr-2" />
            Filtros
          </button>
        </div>
      </div>

      {/* Información de resultados */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          Mostrando {itemsActuales.length} de {personalFiltrado.length} empleados
        </p>
        {personalFiltrado.length > itemsPorPagina && (
          <div className="flex items-center text-sm text-gray-500">
            <span>Página {paginaActual} de {totalPaginas}</span>
          </div>
        )}
      </div>

      {itemsActuales.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <User size={80} className="text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No se encontró personal</p>
          <p className="text-gray-400 text-sm mb-6">Intenta ajustar la búsqueda o agregar nuevo personal</p>
          <button className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all">
            <Plus size={16} className="mr-2" />
            Agregar Personal
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {itemsActuales.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center w-full">
                      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2.5 rounded-xl mr-3 flex-shrink-0">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1"> {/* Esto permite que el texto se ajuste correctamente */}
                        <h2 className="text-lg font-semibold text-gray-800 break-words"> {/* break-words para nombres largos */}
                          {p.nombre}
                        </h2>
                        {p.cargo && (
                          <p className="text-gray-600 text-sm truncate">{p.cargo}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center text-gray-600">
                      <IdCard size={14} className="mr-2 text-blue-500 flex-shrink-0" />
                      <span className="text-sm break-all">{p.cedula}</span> {/* break-all para cédulas largas */}
                    </div>

                    {p.telefono && (
                      <div className="flex items-center text-gray-600">
                        <Phone size={14} className="mr-2 text-blue-500 flex-shrink-0" />
                        <span className="text-sm">{p.telefono}</span>
                      </div>
                    )}
                    
                    {p.proceso && (
                      <div className="flex items-center text-gray-600">
                        <Briefcase size={14} className="mr-2 text-blue-500 flex-shrink-0" />
                        <span className="text-sm break-words">{p.proceso}</span> {/* break-words para procesos largos */}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-3 border-t border-gray-100">
                    <div className="flex space-x-1">
                      <button className="flex items-center justify-center w-8 h-8 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Paginación */}
          {personalFiltrado.length > itemsPorPagina && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-1 bg-white rounded-xl shadow-sm p-2 border border-gray-100">
                <button 
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
                  <button
                    key={numero}
                    className={`px-3 py-1.5 rounded-lg text-sm ${paginaActual === numero ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                    onClick={() => cambiarPagina(numero)}
                  >
                    {numero}
                  </button>
                ))}
                
                <button 
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}