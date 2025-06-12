import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	obtenerTotalInventario
} from "../../services/dashboard_services";
import { obtenerTotalMantenimientoFreezer } from "../../services/mantenimiento_freezer";
import { Database, Microscope, Pill, FlaskConical, Eye, ClipboardList, Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { useContadorAnimado } from "../../hook/useContadorAnimado";
import { RUTAS } from "../../const/routers/routers";

export default function Dashboard() {
	const navigate = useNavigate();

	const [totales, setTotales] = useState({
		inventario: 0,
		mantenimientoFreezer: 0
	});

	useEffect(() => {
		const cargarTotales = async () => {
			try {
				const [inventario, mantenimientoFreezer] = await Promise.all([
					obtenerTotalInventario(),
					obtenerTotalMantenimientoFreezer()
				]);

				setTotales({
					inventario: inventario,
					mantenimientoFreezer: mantenimientoFreezer

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
			titulo: "Inventarios Generales",
			ruta: RUTAS.USER.INVENTARIO.CREAR_INVENTARIO,
			verRuta: RUTAS.USER.INVENTARIO.VER_INVENTARIO,
			total: totales.inventario,
		},
		{
			titulo: "Mantenimiento Freezer",
			ruta: RUTAS.USER.MANTENIMIENTO_FREEZER.CREAR_MANTENIMIENTO,
			verRuta: RUTAS.USER.MANTENIMIENTO_FREEZER.VISTA_DATOS,
			total: totales.mantenimientoFreezer,
		}
	];

	const iconos = [
		<ClipboardList className="h-10 w-10 text-yellow-600" />,
		<Wrench className="h-10 w-10 text-red-600" />
	];

	// Aquí usas el hook para animar el total de cada opción
	const opcionesConAnimacion = opciones.map(op => ({
		...op,
		totalAnimado: useContadorAnimado(op.total, 1000)
	}));

	return (
		<motion.div
			className="min-h-screen bg-gray-100 flex items-center justify-center p-6 pt-20"
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl w-full">
				{opcionesConAnimacion.map((op, i) => (
					<motion.div
						key={i}
						className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border hover:border-blue-300 transition-all duration-200 cursor-pointer group"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.1, duration: 0.4 }}
					>
						<button
							onClick={(e) => {
								e.stopPropagation();
								navigate(op.verRuta);
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
								{op.totalAnimado}
							</p>
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	);
}
