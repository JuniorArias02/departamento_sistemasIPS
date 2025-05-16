import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	obtenerTotalDispositivoMedicoc,
	obtenerTotalEquipoBiomedico,
	obtenerTotalMedicamentos,
	obtenerTotalReactivosVigilancia,
} from "../../services/dashboard_services";
import { Database, Microscope, Pill, FlaskConical, Eye } from "lucide-react";



export default function Dashboard() {
	const navigate = useNavigate();


	const iconos = [
		<Database className="h-10 w-10 text-blue-600" />,
		<Microscope className="h-10 w-10 text-green-600" />,
		<Pill className="h-10 w-10 text-purple-600" />,
		<FlaskConical className="h-10 w-10 text-pink-600" />,
	];

	const [totales, setTotales] = useState({
		dispositivos: 0,
		equipos: 0,
		medicamentos: 0,
		reactivos: 0,
	});


	useEffect(() => {
		const cargarTotales = async () => {
			try {
				const [dispo, equipo, medi, reactivo] = await Promise.all([
					obtenerTotalDispositivoMedicoc(),
					obtenerTotalEquipoBiomedico(),
					obtenerTotalMedicamentos(),
					obtenerTotalReactivosVigilancia(),
				]);

				setTotales({
					dispositivos: dispo,
					equipos: equipo,
					medicamentos: medi,
					reactivos: reactivo,
				});
			} catch (error) {
				console.error("Error al cargar totales", error);
			}
		};

		cargarTotales();

		const intervalo = setInterval(cargarTotales, 10000);

		return () => clearInterval(intervalo);
	}, []);


	const opciones = [
		{
			titulo: "Dispositivos Médicos",
			ruta: "/dashboard/form_dispositivo_medicos",
			total: totales.dispositivos,
		},
		{
			titulo: "Equipos Biomédicos",
			ruta: "/dashboard/form_equipo_biomedicos",
			total: totales.equipos,
		},
		{
			titulo: "Medicamentos",
			ruta: "/dashboard/form_medicamento",
			total: totales.medicamentos,
		},
		{
			titulo: "Reactivos y Vigilancia",
			ruta: "/dashboard/form_reactivo_vigilancia",
			total: totales.reactivos,
		},
	];


	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 pt-20">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl w-full">
				{opciones.map((op, i) => (
					<div
						key={i}
						className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border hover:border-blue-300 transition-all duration-200 cursor-pointer group"
					>
						{/* Botón "Ver" top right */}
						<button
							onClick={(e) => {
								e.stopPropagation(); // para que no dispare el onClick del card
								navigate(op.ruta);
							}}
							className="absolute top-4 right-4 flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-full shadow-sm transition cursor-pointer"
						>
							<Eye className="h-4 w-4" />
							<span>Ver</span>
						</button>

						<div
							onClick={() => navigate(op.ruta)}
							className="flex flex-col items-center justify-center space-y-3"
						>
							<div className="bg-blue-50 p-4 rounded-full group-hover:scale-110 transition">
								{iconos[i]}
							</div>
							<h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-700">
								{op.titulo}
							</h2>
							<p className="text-sm text-gray-500">Total registrados:</p>
							<p className="text-3xl font-extrabold text-blue-600 bg-blue-100 px-4 py-2 rounded-full shadow-sm">
								{op.total}
							</p>
						</div>
					</div>
				))}

			</div>
		</div>

	);
}
