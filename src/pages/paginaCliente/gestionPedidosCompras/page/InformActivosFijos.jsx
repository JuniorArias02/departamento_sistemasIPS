import { useEffect, useState } from "react";
import { listarEntregasActivos, exportarInformeEntregaActivos } from "../../../../services/cp_entrega_activos_services";
import { Download, Search, Filter, User, CreditCard, Briefcase, MapPin, Calendar, FileText, BadgeDollarSign } from "lucide-react";
import { URL_IMAGE } from "../../../../const/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs"
import { RUTAS } from "../../../../const/routers/routers";
export function InformActivosFijos() {
  const navigate = useNavigate();
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [descargando, setDescargando] = useState(false);
  const [descargandoGeneral, setDescargandoGeneral] = useState(false);

  const [filters, setFilters] = useState({
    sede: "",
    cargo: ""
  });

  useEffect(() => {
    const cargarEntregas = async () => {
      setLoading(true);
      const res = await listarEntregasActivos();
      if (res.ok) {
        setEntregas(res.data);
      }
      setLoading(false);
    };
    cargarEntregas();
  }, []);

  // Filtrar entregas basado en búsqueda y filtros
  const filteredEntregas = entregas.filter(entrega => {
    const matchesSearch =
      entrega.personal_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrega.personal_cedula.includes(searchTerm) ||
      entrega.cargo_nombre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSede = filters.sede ? entrega.sede_nombre === filters.sede : true;
    const matchesCargo = filters.cargo ? entrega.cargo_nombre === filters.cargo : true;

    return matchesSearch && matchesSede && matchesCargo;
  });

  const sedesUnicas = [...new Set(entregas.map(e => e.sede_nombre))];
  const cargosUnicos = [...new Set(entregas.map(e => e.cargo_nombre))];

  const handleDownload = async (id) => {
    try {
      setDescargando(true);
      console.log("Descargando informe para ID:", id);
      // 👇 aquí sí esperas la promesa
      await exportarInformeEntregaActivos({ id });

      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: "Informe descargado correctamente",
      });

      console.log("Descargando informe para ID:", id);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo descargar el informe",
      });
      console.error(error);
    } finally {
      setDescargando(false);
    }
  };


  const descargarInformeGeneral = async () => {
    setDescargandoGeneral(true);

    // Simular descarga del informe general
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setDescargandoGeneral(false);

    Swal.fire({
      icon: "success",
      title: "¡Listo!",
      text: "Informe general descargado correctamente",
    });

    console.log("Descargando informe general...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm p-6 mb-8 border border-slate-200/70">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Acta de Entrega de Activos Fijos
            </h1>
            <p className="text-slate-500 mt-1">Gestión de entregas y asignaciones</p>
          </div>
          <button
            onClick={descargarInformeGeneral}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            disabled={descargandoGeneral}
          >
            <Download size={20} />
            <span>{descargandoGeneral ? "Descargando..." : "Descargar Informe"}</span>
          </button>

        </div>
      </header>

      {/* Filtros y Búsqueda */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm p-6 mb-8 border border-slate-200/70">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, cédula o cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-xl">
              <Filter size={18} className="text-slate-500" />
              <select
                value={filters.sede}
                onChange={(e) => setFilters({ ...filters, sede: e.target.value })}
                className="bg-transparent border-none focus:ring-0"
              >
                <option value="">Todas las sedes</option>
                {sedesUnicas.map(sede => (
                  <option key={sede} value={sede}>{sede}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-xl">
              <Filter size={18} className="text-slate-500" />
              <select
                value={filters.cargo}
                onChange={(e) => setFilters({ ...filters, cargo: e.target.value })}
                className="bg-transparent border-none focus:ring-0"
              >
                <option value="">Todos los cargos</option>
                {cargosUnicos.map(cargo => (
                  <option key={cargo} value={cargo}>{cargo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {filteredEntregas.length === 0 ? (
              <div className="text-center py-12 bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-slate-200/70">
                <FileText size={48} className="mx-auto text-slate-400 mb-4" />
                <h3 className="text-xl font-medium text-slate-700">No hay entregas registradas</h3>
                <p className="text-slate-500 mt-2">No se encontraron resultados con los filtros aplicados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntregas.map((entrega) => (
                  <div key={entrega.entrega_id} className="bg-gradient-to-br from-white to-slate-50/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                          <User size={20} className="text-blue-600" />
                          {entrega.personal_nombre}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-600 mt-1.5">
                          <CreditCard size={16} className="text-slate-500" />
                          <span className="text-sm font-medium">{entrega.personal_cedula}</span>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate(RUTAS.USER.GESTION_COMPRAS.CREAR_DESCUENTO_FIJOS, {
                            state: { entrega }
                          })}
                          className="p-2 rounded-xl bg-gradient-to-b from-blue-50 to-blue-100/50 border border-blue-200/60 text-blue-600 hover:text-blue-800 hover:from-blue-100 hover:to-blue-200/50 transition-all duration-300 shadow-sm hover:shadow-md"
                          title="Gestionar descuentos"
                        >
                          <BadgeDollarSign size={20} />
                        </button>
                        <button
                          onClick={() => handleDownload(entrega.entrega_id)}
                          className="p-2 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100/50 border border-slate-200/60 text-slate-600 hover:text-slate-800 hover:from-slate-100 hover:to-slate-200/50 transition-all duration-300 shadow-sm hover:shadow-md"
                          disabled={descargando}
                          title="Descargar documento"
                        >
                          <Download size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3.5 mb-6">
                      <div className="flex items-center gap-3 text-slate-700 p-2.5 rounded-xl bg-slate-50/50">
                        <Briefcase size={18} className="text-purple-600 flex-shrink-0" />
                        <span className="text-sm font-medium">{entrega.cargo_nombre}</span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-700 p-2.5 rounded-xl bg-slate-50/50">
                        <MapPin size={18} className="text-green-600 flex-shrink-0" />
                        <span className="text-sm font-medium">{entrega.sede_nombre}</span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-700 p-2.5 rounded-xl bg-slate-50/50">
                        <Calendar size={18} className="text-orange-600 flex-shrink-0" />


                        <span className="text-sm font-medium">
                          {dayjs(entrega.fecha_entrega).format("DD/MM/YYYY")}
                        </span>

                      </div>
                    </div>

                    <div className="pt-5 border-t border-slate-200/60">
                      <p className="text-xs font-semibold text-slate-500 mb-4 flex items-center gap-2 tracking-wide uppercase">
                        <FileText size={16} className="text-slate-400" />
                        Firmas del acuerdo
                      </p>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-2xl p-4 border border-slate-200/50 shadow-sm">
                          <div className="h-24 w-full mb-3 flex items-center justify-center bg-white rounded-xl p-2 border border-slate-200/70">
                            {entrega.firma_quien_entrega ? (
                              <img
                                src={`${URL_IMAGE}/${entrega.firma_quien_entrega.replace("public/", "")}`}
                                alt="Firma de quien entrega"
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <div className="text-slate-400 flex flex-col items-center">
                                <User size={20} />
                                <span className="text-xs mt-1.5 font-medium">Sin firma</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-600 text-center">Quien entrega</p>
                          <p className="text-xs font-medium text-slate-600 text-center">Quien entrega</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 rounded-2xl p-4 border border-slate-200/50 shadow-sm">
                          <div className="h-24 w-full mb-3 flex items-center justify-center bg-white rounded-xl p-2 border border-slate-200/70">
                            {entrega.firma_quien_recibe ? (
                              <img
                                src={`${URL_IMAGE}/${entrega.firma_quien_recibe.replace("public/", "")}`}
                                alt="Firma de quien recibe"
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <div className="text-slate-400 flex flex-col items-center">
                                <User size={20} />
                                <span className="text-xs mt-1.5 font-medium">Sin firma</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-600 text-center">Quien recibe</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}