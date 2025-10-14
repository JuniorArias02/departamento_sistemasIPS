import { useEffect, useState } from "react";
import { obtenerConsolidadoPedidos } from "../../../../services/cp_pedidos_services";
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
  AlertCircle
} from "lucide-react";

export function InformeConsolidadoPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("FECHA_SOLICITUD");
  const [sortDirection, setSortDirection] = useState("desc");

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
            
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Exportar
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
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
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
    </div>
  );
}