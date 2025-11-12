import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buscarPersonalCoord } from "../../../services/personal_services";
import { User, ChevronDown, Check, Loader2 } from "lucide-react";

const BuscarCoordinador = ({
	name = "coordinador_id",
	value,
	onChange,
	label = "Coordinador",
	required = false,
	reset = false,
}) => {
	const [lista, setLista] = useState([]);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState(null);

	useEffect(() => {
		const fetchLista = async () => {
			setLoading(true);
			try {
				const data = await buscarPersonalCoord(""); // obtiene todos
				setLista(data);
			} catch (err) {
				console.error("Error al cargar coordinadores:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchLista();
	}, []);

	useEffect(() => {
		if (reset) {
			setSelected(null);
			onChange({ target: { name, value: "" } });
		}
	}, [reset]);

	// ✅ NUEVO: precargar cuando `value` tenga un ID (editar)
	useEffect(() => {
		if (value && lista.length > 0 && !selected) {
			const persona = lista.find((p) => p.id === parseInt(value));
			if (persona) {
				setSelected(persona);
			}
		}
	}, [value, lista]);

	const handleSelect = (persona) => {
		setSelected(persona);
		setIsOpen(false);
		onChange({ target: { name, value: persona.id } });
	};

	return (
		<div className="relative">
			<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
				<User className="h-4 w-4 text-gray-500" />
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</label>

			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className="w-full flex justify-between items-center border border-gray-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
			>
				<span className="text-gray-700 text-sm truncate">
					{selected ? `${selected.nombre_completo} (${selected.rol})` : "Seleccionar coordinador..."}
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
						className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto"
					>
						{loading ? (
							<div className="flex items-center justify-center py-4">
								<Loader2 className="h-5 w-5 text-indigo-600 animate-spin mr-2" />
								<span className="text-sm text-gray-500">Cargando...</span>
							</div>
						) : lista.length > 0 ? (
							lista.map((persona) => (
								<div
									key={persona.id}
									onClick={() => handleSelect(persona)}
									className={`px-4 py-3 cursor-pointer hover:bg-indigo-50 transition-colors flex justify-between items-center ${
										selected?.id === persona.id ? "bg-indigo-50" : ""
									}`}
								>
									<div>
										<div className="font-medium text-gray-900">{persona.nombre_completo}</div>
										<div className="text-sm text-gray-500">{persona.rol || "Sin cargo"}</div>
									</div>
									{selected?.id === persona.id && <Check className="h-4 w-4 text-indigo-600" />}
								</div>
							))
						) : (
							<div className="text-center py-3 text-sm text-gray-500">No hay coordinadores</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			{selected && (
				<div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
					<div className="flex items-center">
						<Check className="h-4 w-4 text-green-600 mr-2" />
						<span className="text-sm text-green-700">
							Seleccionado: <strong>{selected.nombre_completo}</strong>
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default BuscarCoordinador;
