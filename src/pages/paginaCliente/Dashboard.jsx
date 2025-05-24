import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	obtenerTotalDispositivoMedicoc,
	obtenerTotalEquipoBiomedico,
	obtenerTotalMedicamentos,
	obtenerTotalReactivosVigilancia,
	obtenerTotalInventario
} from "../../services/dashboard_services";
import { Database, Microscope, Pill, FlaskConical, Eye,ClipboardList } from "lucide-react";
import { motion } from "framer-motion";


export default function Dashboard() {
	const navigate = useNavigate();

	const iconos = [
		<Database className="h-10 w-10 text-blue-600" />,
		<Microscope className="h-10 w-10 text-green-600" />,
		<Pill className="h-10 w-10 text-purple-600" />,
		<FlaskConical className="h-10 w-10 text-pink-600" />,
		<ClipboardList className="h-10 w-10 text-yellow-600" />,
	];

	const [totales, setTotales] = useState({
		dispositivos: 0,
		equipos: 0,
		medicamentos: 0,
		reactivos: 0,
		inventario:0,
	});

	useEffect(() => {
		const cargarTotales = async () => {
			try {
				const [dispo, equipo, medi, reactivo,inventario] = await Promise.all([
					obtenerTotalDispositivoMedicoc(),
					obtenerTotalEquipoBiomedico(),
					obtenerTotalMedicamentos(),
					obtenerTotalReactivosVigilancia(),
					obtenerTotalInventario(),
					
				]);

				setTotales({
					dispositivos: dispo,
					equipos: equipo,
					medicamentos: medi,
					reactivos: reactivo,
					inventario: inventario,
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
			verRuta: "/dashboard/view_dispositivos_medicos",
			total: totales.dispositivos,
		},
		{
			titulo: "Equipos Biomédicos",
			ruta: "/dashboard/form_equipo_biomedicos",
			verRuta: "/dashboard/view_equipos_biomedicos",
			total: totales.equipos,
		},
		{
			titulo: "Medicamentos",
			ruta: "/dashboard/form_medicamento",
			verRuta: "/dashboard/view_medicamentos",
			total: totales.medicamentos,
		},
		{
			titulo: "Reactivos y Vigilancia",
			ruta: "/dashboard/form_reactivo_vigilancia",
			verRuta: "/dashboard/view_reactivos_vigilancia",
			total: totales.reactivos,
		},
		{
			titulo: "Inventarios Generales",
			ruta: "/dashboard/form_inventario",
			verRuta: "/dashboard/view_inventarios",
			total: totales.inventario,
		}
	];

	return (
		<motion.div
			className="min-h-screen bg-gray-100 flex items-center justify-center p-6 pt-20"
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl w-full">
				{opciones.map((op, i) => (
					<motion.div
						key={i}
						className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border hover:border-blue-300 transition-all duration-200 cursor-pointer group"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.1, duration: 0.4 }}
					>
						{/* Botón "Ver" top right */}
						<button
							onClick={(e) => {
								e.stopPropagation();
								navigate(op.verRuta); // ← ahora va a la ruta de ver datos
							}}
							className="absolute top-4 right-4 flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-semibold text-sm bg-blue-100 px-3 py-1 rounded-full shadow-sm transition cursor-pointer"
						>
							<Eye className="h-4 w-4" />
							<span>Ver Datos</span>
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
					</motion.div>
				))}
			</div>
		</motion.div>
	);
}
