import { useState, useEffect } from "react";
import { listarSedes, listarDependenciasPorSede } from "../../../services/sedes_service";
import { Building, GitBranch, ChevronDown, Loader2, MapPin } from "lucide-react";

const BuscarDependencia = ({
	name = "proceso_id",
	value,
	onChange,
	labelSede = "Sede",
	labelDependencia = "Dependencia",
	required = false,
	reset = false,
	icon = <MapPin className="h-4 w-4 text-gray-500" />,
	formSedeId = null
}) => {
	const [sedes, setSedes] = useState([]);
	const [dependencias, setDependencias] = useState([]);
	const [sedeId, setSedeId] = useState("");
	const [loadingSedes, setLoadingSedes] = useState(false);
	const [loadingDeps, setLoadingDeps] = useState(false);
	const [isOpenSede, setIsOpenSede] = useState(false);
	const [isOpenDependencia, setIsOpenDependencia] = useState(false);

	// cargar sedes al inicio
	useEffect(() => {
		const fetchSedes = async () => {
			setLoadingSedes(true);
			try {
				const data = await listarSedes();
				setSedes(data);
			} catch (err) {
				console.error("Error cargando sedes:", err);
			} finally {
				setLoadingSedes(false);
			}
		};
		fetchSedes();
	}, []);

	// cuando cambia sede, cargar dependencias
	useEffect(() => {
		if (!sedeId) {
			setDependencias([]);
			return;
		}
		const fetchDependencias = async () => {
			setLoadingDeps(true);
			try {
				const data = await listarDependenciasPorSede(sedeId);
				console.log(data.dependencias);
				setDependencias(data.dependencias || []);
			} catch (err) {
				console.error("Error cargando dependencias:", err);
				setDependencias([]);
			} finally {
				setLoadingDeps(false);
			}
		};
		fetchDependencias();
	}, [sedeId]);

	useEffect(() => {
		const precargar = async () => {
			if (!formSedeId || !value) return;

			try {
				setLoadingDeps(true);
				setSedeId(formSedeId);

				const deps = await listarDependenciasPorSede(formSedeId);
				setDependencias(deps.dependencias || []);
			} catch (err) {
				console.error("Error precargando sede/dependencia:", err);
			} finally {
				setLoadingDeps(false);
			}
		};

		precargar();
	}, [formSedeId, value]);



	// reset
	useEffect(() => {
		if (reset) {
			setSedeId("");
			setDependencias([]);
			onChange({ target: { name: "sede_id", value: "" } });
			onChange({ target: { name, value: "" } });
		}
	}, [reset]);

	const selectedSede = sedes.find(sede => sede.id === sedeId);
	const selectedDependencia = dependencias.find(dep => dep.id === value);

	return (
		<div className="space-y-4">
			{/* Selector de sede - Diseño moderno */}
			<div className="relative">
				<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
					{icon}
					{labelSede}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>

				<div
					className={`w-full border ${isOpenSede ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 bg-white flex items-center justify-between cursor-pointer`}
					onClick={() => setIsOpenSede(!isOpenSede)}
				>
					<div className="flex items-center gap-2">
						{loadingSedes ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
								<span className="text-gray-500">Cargando sedes...</span>
							</>
						) : selectedSede ? (
							<>
								<Building className="h-4 w-4 text-indigo-600" />
								<span>{selectedSede.nombre}</span>
							</>
						) : (
							<span className="text-gray-500">Seleccione una sede</span>
						)}
					</div>
					<ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpenSede ? 'rotate-180' : ''}`} />
				</div>

				{isOpenSede && (
					<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
						{sedes.map((sede) => (
							<div
								key={sede.id}
								className={`px-4 py-3 hover:bg-indigo-50 cursor-pointer flex items-center gap-2 ${sedeId === sede.id ? 'bg-indigo-50 text-indigo-700' : ''}`}
								onClick={() => {
									const newSede = sede.id;
									setSedeId(newSede);
									onChange({ target: { name: "sede_id", value: newSede } });
									onChange({ target: { name, value: "" } }); // limpiar dependencia
									setIsOpenSede(false);
								}}
							>
								<Building className="h-4 w-4 text-indigo-600" />
								{sede.nombre}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Selector de dependencia - Diseño moderno */}
			<div className="relative">
				<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
					<GitBranch className="h-4 w-4 text-gray-500" />
					{labelDependencia}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>

				<div
					className={`w-full border ${isOpenDependencia ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 bg-white flex items-center justify-between cursor-pointer ${!sedeId || loadingDeps ? 'opacity-50 cursor-not-allowed' : ''}`}
					onClick={() => {
						if (!sedeId || loadingDeps) return;
						setIsOpenDependencia(!isOpenDependencia);
					}}
				>
					<div className="flex items-center gap-2">
						{loadingDeps ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
								<span className="text-gray-500">Cargando dependencias...</span>
							</>
						) : !sedeId ? (
							<span className="text-gray-500">Seleccione una sede primero</span>
						) : selectedDependencia ? (
							<>
								<GitBranch className="h-4 w-4 text-indigo-600" />
								<span>{selectedDependencia.nombre}</span>
							</>
						) : (
							<span className="text-gray-500">Seleccione una dependencia</span>
						)}
					</div>
					<ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpenDependencia ? 'rotate-180' : ''}`} />
				</div>

				{isOpenDependencia && dependencias.length > 0 && (
					<div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
						{dependencias.map((dep) => (
							<div
								key={dep.id}
								className={`px-4 py-3 hover:bg-indigo-50 cursor-pointer flex items-center gap-2 ${value === dep.id ? 'bg-indigo-50 text-indigo-700' : ''}`}
								onClick={() => {
									onChange({
										target: {
											name,
											value: dep.id,
										},
									});
									setIsOpenDependencia(false);
								}}
							>
								<GitBranch className="h-4 w-4 text-indigo-600" />
								{dep.nombre}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default BuscarDependencia;