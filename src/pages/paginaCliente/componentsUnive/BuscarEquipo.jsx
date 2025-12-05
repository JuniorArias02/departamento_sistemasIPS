import { useState, useEffect } from "react";
import { buscarEquipos } from "../../../services/pc_equipos_services";
import { ChevronDown, Loader2, Check, Laptop } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const BuscarEquipo = ({
    name = "equipo_id",
    value,
    onChange,
    label = "Equipo",
    required = false,
    reset = false,
}) => {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchEquipos = async () => {
            if (search.length < 2) {
                setLista([]);
                return;
            }

            setLoading(true);
            try {
                const data = await buscarEquipos(search);
                setLista(data.resultados || []);
            } catch (err) {
                console.error("Error al buscar equipos:", err);
            } finally {
                setLoading(false);
            }
        };

        const delay = setTimeout(fetchEquipos, 300);
        return () => clearTimeout(delay);
    }, [search]);

    useEffect(() => {
        if (reset) {
            setSelected(null);
            onChange({ target: { name, value: "" } });
        }
    }, [reset]);

    const handleSelect = (equipo) => {
        setSelected(equipo);
        setIsOpen(false);
        onChange({ target: { name, value: equipo.id } });
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Laptop className="h-4 w-4 text-gray-500" />
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* INPUT */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center border border-gray-300 rounded-xl px-4 py-3 bg-white"
            >
                <span className="text-gray-700 text-sm truncate">
                    {selected
                        ? `${selected.nombre_equipo} – ${selected.serial} – Inv: ${selected.numero_inventario}`
                        : "Buscar equipo..."}
                </span>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto p-2"
                    >
                        {/* Campo de búsqueda */}
                        <input
                            type="text"
                            placeholder="Escribe para buscar..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 text-sm"
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {loading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-indigo-600 mr-2" />
                                <span className="text-sm text-gray-500">Buscando...</span>
                            </div>
                        ) : lista.length > 0 ? (
                            lista.map((eq) => (
                                <div
                                    key={eq.id}
                                    onClick={() => handleSelect(eq)}
                                    className={`px-3 py-2 cursor-pointer rounded-lg hover:bg-indigo-50 transition-colors ${
                                        selected?.id === eq.id ? "bg-indigo-50" : ""
                                    }`}
                                >
                                    <div className="font-medium text-gray-900">{eq.nombre_equipo}</div>
                                    <div className="text-sm text-gray-600">
                                        Serial: {eq.serial} | Inv: {eq.numero_inventario}
                                    </div>

                                    {selected?.id === eq.id && (
                                        <Check className="h-4 w-4 text-indigo-600 absolute right-4 top-4" />
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-3 text-sm text-gray-500">
                                No se encontraron equipos
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BuscarEquipo;
