import { buscarPerifericos } from "../../../services/pc_perifericos_services";
import { useState, useEffect } from "react";
import { ChevronDown, Loader2, Check, Mouse } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const BuscarPerifericos = ({ onSelect }) => {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (search.length < 2) {
                setLista([]);
                return;
            }

            setLoading(true);
            try {
                const data = await buscarPerifericos(search);
                setLista(data.resultados || []);
            } finally {
                setLoading(false);
            }
        };

        const delay = setTimeout(fetchData, 300);
        return () => clearTimeout(delay);
    }, [search]);

    const handleSelect = (item) => {
        if (onSelect) onSelect(item);
        setSelected(null);
        setSearch("");
        setLista([]);
        setIsOpen(false);
    };


    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Mouse className="h-4 w-4 text-gray-500" />
                Seleccionar Periférico
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center border border-gray-300 rounded-xl px-4 py-3 bg-white"
            >
                <span className="text-gray-700 text-sm truncate">
                    {selected
                        ? `${selected.nombre} – Serial: ${selected.serial}`
                        : "Buscar periférico..."}
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
                            lista.map((p) => (
                                <div
                                    key={p.inventario_id}
                                    onClick={() => handleSelect(p)}
                                    className="px-3 py-2 cursor-pointer rounded-lg hover:bg-indigo-50 transition-colors"
                                >
                                    <div className="font-medium text-gray-900">{p.nombre}</div>
                                    <div className="text-sm text-gray-600">
                                        Serial: {p.serial} | Inv: {p.inventario_id}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-3 text-sm text-gray-500">
                                No se encontraron periféricos
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BuscarPerifericos;
