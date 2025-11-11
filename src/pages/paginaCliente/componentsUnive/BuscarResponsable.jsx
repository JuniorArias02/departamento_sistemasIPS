import { useState, useEffect } from "react";
import { buscarPersonal, buscarPersonalId } from "../../../services/personal_services";
import {
	Search,
	User,
	IdCard,
	Loader2,
	ChevronDown,
	Check,
	AlertCircle
} from "lucide-react";

const BuscarResponsable = ({
	name = "responsable_id",
	value,
	onChange,
	label = "Responsable",
	required = false,
	reset = false,
}) => {
	const [query, setQuery] = useState("");
	const [resultados, setResultados] = useState([]);
	const [loading, setLoading] = useState(false);
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [selectedPerson, setSelectedPerson] = useState(null);
	const [manualSelection, setManualSelection] = useState(false);

	// 🔹 Debounce input
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(query);
		}, 500);
		return () => clearTimeout(handler);
	}, [query]);

	// 🔹 Reset desde afuera
	useEffect(() => {
		if (reset) {
			setQuery("");
			setSelectedPerson(null);
			setResultados([]);
			onChange({ target: { name, value: "" } });
		}
	}, [reset]);

	// 🔹 Buscar por texto
	useEffect(() => {
		if (manualSelection) {
			setManualSelection(false);
			return;
		}

		// 👇 si ya tengo un seleccionado y el query coincide con él, no busques
		if (selectedPerson && query.includes(selectedPerson.cedula)) {
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
				const data = await buscarPersonal(debouncedQuery);
				setResultados(data.slice(0, 10));
			} catch (error) {
				console.error("Error buscando personal:", error);
				setResultados([]);
			} finally {
				setLoading(false);
			}
		};
		buscar();
	}, [debouncedQuery]);


	// 🔹 Precargar cuando `value` tenga un ID
	useEffect(() => {
		let cancelado = false;

		const precargar = async () => {
			if (!value || selectedPerson?.id === value) return;

			try {
				const persona = await buscarPersonalId(value);
				if (persona && !cancelado) {
					setSelectedPerson(persona);
					setQuery(`${persona.nombre} (${persona.cedula})`);
				}
			} catch (err) {
				console.error("Error precargando persona:", err);
			}
		};

		precargar();
		return () => {
			cancelado = true;
		};
	}, [value]);


	const handleSelect = (persona) => {
		onChange({
			target: { name, value: persona.id },
		});
		setQuery(`${persona.nombre} (${persona.cedula})`);
		setSelectedPerson(persona);
		setResultados([]);
		setIsOpen(false);
		setManualSelection(true);
	};

	const handleInputFocus = () => {
		if (resultados.length > 0) {
			setIsOpen(true);
		}
	};

	const handleInputBlur = () => {
		setTimeout(() => setIsOpen(false), 200);
	};

	const clearSelection = () => {
		setQuery("");
		setSelectedPerson(null);
		onChange({
			target: { name, value: "" },
		});
		setResultados([]);
	};

	return (
		<div className="relative">
			<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
				<User className="h-4 w-4 text-gray-500" />
				{label}
				{required && <span className="text-red-500 ml-1">*</span>}
			</label>

			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-5">
					<Search className="h-5 w-5 text-gray-400 mb-5" />
				</div>

				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={handleInputFocus}
					onBlur={handleInputBlur}
					placeholder="Buscar por nombre o cédula..."
					className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
				/>

				{selectedPerson ? (
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

			{loading && (
				<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-2">
					<div className="flex items-center justify-center py-2">
						<Loader2 className="h-5 w-5 text-indigo-600 animate-spin mr-2" />
						<span className="text-sm text-gray-600">Buscando...</span>
					</div>
				</div>
			)}

			{isOpen && resultados.length > 0 && !loading && (
				<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
					<div className="py-1">
						{resultados.length === 10 && (
							<div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
								<AlertCircle className="h-4 w-4 text-amber-600" />
								<span className="text-xs text-amber-700">
									Mostrando los primeros 10 resultados
								</span>
							</div>
						)}

						{resultados.map((persona) => (
							<div
								key={persona.id}
								onClick={() => handleSelect(persona)}
								className="px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors flex items-center justify-between"
							>
								<div>
									<div className="font-medium text-gray-900">{persona.nombre}</div>
									<div className="text-sm text-gray-500 flex items-center mt-1">
										<IdCard className="h-3 w-3 mr-1" />
										{persona.cedula}
									</div>
								</div>
								{selectedPerson?.id === persona.id && (
									<Check className="h-4 w-4 text-indigo-600" />
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{isOpen && debouncedQuery.length >= 2 && resultados.length === 0 && !loading && (
				<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
					<div className="text-center text-gray-500 py-2">
						<User className="h-8 w-8 text-gray-300 mx-auto mb-2" />
						<p className="text-sm">No se encontraron resultados</p>
						<p className="text-xs">Intenta con otro nombre o cédula</p>
					</div>
				</div>
			)}

			{selectedPerson && (
				<div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
					<div className="flex items-center">
						<Check className="h-4 w-4 text-green-600 mr-2" />
						<span className="text-sm text-green-700">
							Seleccionado: <strong>{selectedPerson.nombre}</strong> (C.C. {selectedPerson.cedula})
						</span>
					</div>
				</div>
			)}
		</div>
	);
};

export default BuscarResponsable;
