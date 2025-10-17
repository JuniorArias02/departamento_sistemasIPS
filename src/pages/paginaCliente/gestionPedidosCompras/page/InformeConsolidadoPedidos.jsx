import { useEffect, useState } from "react";
import { obtenerConsolidadoPedidos, exportarConsolidadoPedidos, agregarObservaciones } from "../../../../services/cp_pedidos_services";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Calendar,
  Building,
  FileText,
  ShoppingCart,
  CheckCircle,
  Clock,
  AlertCircle,
  Pencil,
  Loader2,
  X
} from "lucide-react";
import { useApp } from "../../../../store/AppContext";
import Swal from "sweetalert2";

export function InformeConsolidadoPedidos() {
  const { usuario } = useApp();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("FECHA_SOLICITUD");
  const [sortDirection, setSortDirection] = useState("desc");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loadingExport, setLoadingExport] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [observacion, setObservacion] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (pedido) => {
    setSelectedPedido(pedido);
    setObservacion(pedido.OBSERVACIONES_PEDIDOS || "");
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPedido(null);
    setObservacion("");
  };

  const handleOpenObservation = (observaciones) => {
    setSelectedObservation(observaciones);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedObservation(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPedido) return;
    setSaving(true);

    try {
      const datos = {
        pedido_id: selectedPedido.ID,
        observacion: observacion,
        usuario_id: usuario.id,
      };

      const response = await agregarObservaciones(datos);

      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "¡Observación guardada!",
          text: "La observación se registró correctamente.",
          timer: 2000,
          showConfirmButton: false,
        });
        setPedidos(prev =>
          prev.map(p =>
            p.ID === selectedPedido.ID
              ? { ...p, OBSERVACIONES_PEDIDOS: observacion }
              : p
          )
        );
        handleClose();
      } else {
        Swal.fire({
          icon: "warning",
          title: "Atención",
          text: response.message || "No se pudo guardar la observación.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar la observación.",
      });
    } finally {
      setSaving(false);
    }
  };


  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await obtenerConsolidadoPedidos();
        setPedidos(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  // Filtrar y ordenar pedidos
  const filteredPedidos = pedidos
    .filter(pedido =>
      Object.values(pedido).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getEstadoIcon = (estado) => {
    const estadoLower = estado?.toLowerCase() || "";
    if (estadoLower.includes("aprob") || estadoLower.includes("complet")) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (estadoLower.includes("pendiente") || estadoLower.includes("espera")) {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };


  async function handleExport() {
    try {
      setLoadingExport(true);

      const datos = {
        fecha_inicio: fechaInicio || null,
        fecha_fin: fechaFin || null,
      };

      await exportarConsolidadoPedidos(datos);
    } catch (err) {
      console.error(err);
      alert("Error al exportar el consolidado ");
    } finally {
      setLoadingExport(false);
    }
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      const tableContainer = document.querySelector('.overflow-x-auto');
      if (!tableContainer) return;

      if (e.ctrlKey && e.key === 'ArrowRight') {
        tableContainer.scrollLeft += 200;
      } else if (e.ctrlKey && e.key === 'ArrowLeft') {
        tableContainer.scrollLeft -= 200;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 opacity-50" />;
    return sortDirection === "asc" ?
      <ChevronUp className="w-4 h-4" /> :
      <ChevronDown className="w-4 h-4" />;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center text-red-800">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span className="font-medium">Error: {error}</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="w-8xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Informe Consolidado de Pedidos Por Procesos
          </h1>
          <p className="text-gray-600">
            Gestión y seguimiento de todos los pedidos del sistema
          </p>
        </div>

        {/* Toolbar */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">

            {/* 🔍 Buscador + Fechas */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar en pedidos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 🗓 Fecha inicio */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 🗓 Fecha fin */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* ⚙️ Botones */}
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
              <button
                onClick={handleExport}
                disabled={loadingExport}
                className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg transition-colors 
        ${loadingExport ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"}`}
              >
                {loadingExport ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Exportar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}


        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("FECHA_SOLICITUD")}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Fecha Solicitud
                      <SortIcon field="FECHA_SOLICITUD" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("PROCESO")}
                  >
                    Proceso
                    <SortIcon field="PROCESO" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("SEDE")}
                  >
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      Sede
                      <SortIcon field="SEDE" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("CONSECUTIVO")}
                  >
                    Consecutivo
                    <SortIcon field="CONSECUTIVO" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      Descripción
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("TIPO_COMPRA")}
                  >
                    <div className="flex items-center gap-1">
                      <ShoppingCart className="w-4 h-4" />
                      Tipo Compra
                      <SortIcon field="TIPO_COMPRA" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("APROBACION")}
                  >
                    Estado
                    <SortIcon field="APROBACION" />
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort("OBSERVACIONES_PEDIDOS")}
                  >
                    Observaciones
                    <SortIcon field="OBSERVACIONES_PEDIDOS" />
                  </th>


                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPedidos.map((pedido) => (
                  <tr
                    key={pedido.CONSECUTIVO}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.FECHA_SOLICITUD}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.PROCESO}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.SEDE}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {pedido.CONSECUTIVO}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate"
                      title={pedido.DESCRIPCION}
                    >
                      {pedido.DESCRIPCION}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.TIPO_COMPRA}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getEstadoIcon(pedido.APROBACION)}
                        <span className="text-sm text-gray-900">{pedido.APROBACION}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div
                        onClick={() => handleOpenObservation(pedido.OBSERVACIONES_PEDIDOS)}
                        className="truncate cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        {pedido.OBSERVACIONES_PEDIDOS?.length > 50
                          ? `${pedido.OBSERVACIONES_PEDIDOS.substring(0, 50)}...`
                          : pedido.OBSERVACIONES_PEDIDOS
                        }
                      </div>
                    </td>
                    {/* 🆕 Celda del lápiz */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => handleEdit(pedido)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {/* Empty State */}
          {filteredPedidos.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No se encontraron pedidos</p>
              {searchTerm && (
                <p className="text-gray-400 mt-2">
                  No hay resultados para "<span className="font-medium">{searchTerm}</span>"
                </p>
              )}
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black/30 bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                {/* Cerrar */}
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  agregar observaciones
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observaciones
                    </label>
                    <textarea
                      value={observacion}
                      onChange={(e) => setObservacion(e.target.value)}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Escribe tus observaciones aquí..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Aceptar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal de Observaciones */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/15 bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Observaciones</h3>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedObservation || "No hay observaciones"}
                  </p>
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Mostrando <span className="font-medium">{filteredPedidos.length}</span> de{" "}
                <span className="font-medium">{pedidos.length}</span> pedidos
              </p>
              <div className="flex items-center gap-4">
                <button className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
                  Anterior
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}