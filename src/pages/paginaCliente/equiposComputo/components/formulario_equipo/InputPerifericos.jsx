
import { useState, useEffect } from "react";
import { buscarPerifericoCodigo } from "../../../../../services/pc_equipos_services";
import { Search, X, Monitor, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function InputPerifericos({ label, tipo, id, onSelect }) {
    const [codigo, setCodigo] = useState("");
    const [periferico, setPeriferico] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Efecto para cargar datos iniciales en modo edición
    useEffect(() => {
        // Si hay un ID externo y es diferente al que tenemos seleccionado actualmente
        // (Evita pisar el "Código" visual con el "ID" numérico cuando seleccionamos)
        if (id && (!periferico || periferico.id !== id)) {
            setCodigo(String(id || ""));
            handleBuscar(String(id || ""));
        }
    }, [id]);

    // Debounce para búsqueda automática
    useEffect(() => {
        const timer = setTimeout(() => {
            if (codigo && String(codigo).trim()) {
                handleBuscar(codigo);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [codigo]);

    const handleBuscar = async (codigoBuscar) => {
        const cod = String(codigoBuscar || codigo || "");
        if (!cod || !cod.trim()) return;

        setLoading(true);
        setError(null);
        // No limpiamos periferico inmediatamente para evitar "parpadeo" visual

        try {
            const response = await buscarPerifericoCodigo(cod);

            // La API devuelve: { status: true, data: { ... } }
            if (response.status && response.data) {
                setPeriferico(response.data);
                // Pasamos el objeto completo, quien lo reciba debe sacar el ID si lo necesita
                if (onSelect) onSelect(tipo, response.data);
            } else {
                setPeriferico(null);
                if (onSelect) onSelect(tipo, null);
            }
        } catch (err) {
            console.error("Error buscando periférico:", err);
            if (onSelect) onSelect(tipo, null);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setCodigo("");
        setPeriferico(null);
        setError(null);
        if (onSelect) onSelect(tipo, null);
    };

    const handleKeyDown = (e) => {
        // Permitimos buscar inmediatamente con Enter sin esperar el debounce
        if (e.key === 'Enter') {
            e.preventDefault();
            handleBuscar();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
        >
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1 capitalize">
                {label}
            </label>

            <div className="relative">
                <div className="flex gap-2">
                    <div className="relative flex-1 group">
                        <input
                            type="text"
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading || !!periferico} // Deshabilitar si ya hay uno seleccionado? O dejar editar? Mejor permitir limpiar.
                            className={`w-full bg-gray-50/70 backdrop-blur-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 border shadow-sm transition-all duration-200 
                                ${error
                                    ? 'border-red-300 focus:ring-red-200'
                                    : periferico
                                        ? 'border-green-300 focus:ring-green-200 bg-green-50/30 text-green-700'
                                        : 'border-gray-200/80 focus:ring-blue-500/50 hover:border-blue-300'
                                }`}
                            placeholder={`Código del ${label.toLowerCase()}...`}
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            {tipo === 'monitor' ? <Monitor className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                        </div>

                        {/* Botón de Limpiar (X) si hay texto o resultado */}
                        {(codigo || periferico) && !loading && (
                            <button
                                onClick={handleClear}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                type="button"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBuscar()}
                        disabled={loading || !codigo.trim() || !!periferico}
                        className={`px-4 py-2 rounded-xl text-white font-medium shadow-lg transition-all flex items-center gap-2
                            ${loading || !codigo.trim() || !!periferico
                                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/30'
                            }`}
                        type="button"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        <span className="hidden sm:inline">Buscar</span>
                    </motion.button>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs text-red-500 mt-1 ml-1"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Resultado de la búsqueda - Tarjeta Mini */}
            <AnimatePresence>
                {periferico && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="bg-green-50/50 border border-green-200 rounded-xl p-3 flex items-center justify-between shadow-sm backdrop-blur-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm border border-green-100">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">
                                    {periferico.nombre || periferico.marca + ' ' + periferico.modelo}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Serial: {periferico.serial || 'S/N'} | Código: {periferico.codigo}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
