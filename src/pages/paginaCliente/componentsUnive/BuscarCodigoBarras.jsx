import { useState, useEffect } from "react";
import { buscarProductoServicioCodigo } from "../../../services/inventario_services";
import {
  Search,
  Loader2,
  ChevronDown,
  Check,
  Package
} from "lucide-react";

const BuscarCodigoBarras = ({
  name = "item_id",
  value,
  onChange,
  label = "Código producto",
  required = false,
  reset = false,
}) => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [manualSelection, setManualSelection] = useState(false);

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  // Reset externo
  useEffect(() => {
    if (reset) {
      setQuery("");
      setSelectedItem(null);
      setResultados([]);
      onChange({ target: { name, value: "" } });
    }
  }, [reset]);

  // Buscar productos (solo códigos)
  useEffect(() => {
    if (manualSelection) {
      setManualSelection(false);
      return;
    }

    const buscar = async () => {
      if (debouncedQuery.length < 2) {
        setResultados([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      setIsOpen(true);

      try {
        const data = await buscarProductoServicioCodigo(debouncedQuery);
        setResultados(data.slice(0, 10)); // array de códigos

      } catch (error) {
        console.error("Error buscando códigos:", error);
        setResultados([]);
      } finally {
        setLoading(false);
      }
    };

    buscar();
  }, [debouncedQuery]);

  // Seleccionar código
  const handleSelect = (codigo) => {
    onChange({
      target: { name, value: codigo }
    });

    setQuery(codigo);
    setSelectedItem(codigo);
    setResultados([]);
    setIsOpen(false);
    setManualSelection(true);
  };

  const handleInputFocus = () => {
    if (resultados.length > 0) setIsOpen(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  const clearSelection = () => {
    setQuery("");
    setSelectedItem(null);
    onChange({ target: { name, value: "" } });
    setResultados([]);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
        <Package className="h-4 w-4 text-gray-500" />
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Buscar por código..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />

        {/* Icono */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
          <Search className="h-5 w-5 text-gray-400 mb-5" />
        </div>

        {selectedItem ? (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute inset-y-0 right-0 pr-3 flex items-center mt-5 text-gray-400 hover:text-gray-600 mb-5"
          >
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">Limpiar</span>
          </button>
        ) : (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center mt-5 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border shadow-lg rounded-xl p-2">
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-5 w-5 text-indigo-600 animate-spin mr-2" />
            <span className="text-sm text-gray-600">Buscando...</span>
          </div>
        </div>
      )}

      {/* RESULTADOS */}
      {isOpen && resultados.length > 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border shadow-lg rounded-xl overflow-hidden">
          <div className="py-1">
            {resultados.map((codigo) => (
              <div
                key={codigo}
                onClick={() => handleSelect(codigo)}
                className="px-4 py-3 hover:bg-indigo-50 cursor-pointer transition flex items-center justify-between"
              >
                <div className="font-medium text-gray-900">{codigo}</div>

                {selectedItem === codigo && (
                  <Check className="h-4 w-4 text-indigo-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SIN RESULTADOS */}
      {isOpen && debouncedQuery.length >= 2 && resultados.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg p-4">
          <div className="text-center text-gray-500 py-2">
            <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm">No se encontraron códigos</p>
            <p className="text-xs">Intenta con otro valor</p>
          </div>
        </div>
      )}

      {/* SELECCIONADO */}
      {selectedItem && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm text-green-700">
              Seleccionado: <strong>{selectedItem}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuscarCodigoBarras;
