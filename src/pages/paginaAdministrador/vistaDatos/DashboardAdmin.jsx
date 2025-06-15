import { useEffect, useState } from "react";
import {
	obtenerGraficaInventario,
} from "../../../services/dashboardAdmin_services";
import { ChartPorUsuario } from "../components/graficas/renderChartPorUsuario";
import { formatearFechas } from "../../../hook/formatearFecha";
import { CalendarDays, ChevronDown, RefreshCw, Package2, Users, ClipboardList, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { PieChart } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { obtenerTotalInventario } from "../../../services/dashboard_services";
import { obtenerTotalMantenimientoFreezer } from "../../../services/mantenimiento_freezer";
import { obtenerTotalUsuarios } from "../../../services/dashboardAdmin_services";
export default function DashboardAdmin() {
	const [inventario, setInventario] = useState([]);
	const [loading, setLoading] = useState(true);
	const [graficaIndex, setGraficaIndex] = useState(0);



	const [totales, setTotales] = useState({
		inventario: 0,
		usuarios: 0,
		mantenimientoFreezer: 0
	});

	useEffect(() => {
		const cargarTotales = async () => {
			try {
				const [inventario, usuarios, mantenimientoFreezer] = await Promise.all([
					obtenerTotalInventario(),
					obtenerTotalUsuarios(),
					obtenerTotalMantenimientoFreezer()
				]);

				setTotales({
					inventario: inventario,
					usuarios: usuarios,
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


	useEffect(() => {
		const fetchData = async () => {
			try {
				const [
					inv
				] = await Promise.all([
					obtenerGraficaInventario(),
				]);

				setInventario(formatearFechas(inv));
			} catch (error) {
				console.error("Error al cargar las gráficas", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);
	if (loading) {
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-6 bg-gray-50">
				<div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin drop-shadow-lg"></div>
				<p className="text-gray-700 text-lg font-semibold animate-pulse">Cargando datos...</p>
			</div>
		);
	}

	const SummaryCard = ({ title, value, change, icon, color }) => {
		const colorClasses = {
			blue: 'bg-blue-50 text-blue-600',
			green: 'bg-green-50 text-green-600',
			orange: 'bg-orange-50 text-orange-600',
			red: 'bg-red-50 text-red-600'
		};

		return (
			<div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-5">
				<div className="flex justify-between">
					<div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
						{icon}
					</div>
					<span className={`text-xs font-medium ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'
						}`}>
						{change}
					</span>
				</div>
				<h3 className="text-sm text-gray-500 mt-4">{title}</h3>
				<p className="text-2xl font-semibold mt-1">{value}</p>
			</div>
		);
	};

	// Componente de item de actividad (ActivityItem)
	const ActivityItem = ({ user, action, time, icon }) => (
		<div className="flex gap-3">
			<div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
				{icon}
			</div>
			<div>
				<p className="text-sm font-medium">{user}</p>
				<p className="text-xs text-gray-500">{action}</p>
				<p className="text-xs text-gray-400 mt-1">{time}</p>
			</div>
		</div>
	);

	const actividadesRecientes = [
		{
			user: "Junior Arias",
			action: "Actualizó el inventario",
			time: "Hace 15 minutos",
			icon: <Package2 className="w-4 h-4 text-gray-600" />
		},
		{
			user: "Jeferson Arevalo",
			action: "Registró nuevo mantenimiento",
			time: "Hace 2 horas",
			icon: <ClipboardList className="w-4 h-4 text-gray-600" />
		},
	];

	const distribucionSedes = [
		{ name: "Sede Norte", value: 35 },
		{ name: "Sede Sur", value: 25 },
		{ name: "Sede Central", value: 40 }
	];
	return (
		<main className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full p-4 sm:p-6 lg:p-8 select-none">
			{/* Header del dashboard */}
			<header className="max-w-7xl mx-auto mb-8">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
						<p className="text-gray-500 mt-1">Visión general del sistema</p>
					</div>
					<div className="flex items-center gap-3">
						<div className="relative">
							<button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-xs hover:shadow-sm transition-all">
								<CalendarDays className="w-5 h-5 text-gray-600" />
								<span className="text-sm font-medium">Últimos 30 días</span>
								<ChevronDown className="w-4 h-4 text-gray-400" />
							</button>
						</div>
						<button className="p-2 rounded-xl bg-white border border-gray-200 shadow-xs hover:shadow-sm transition-all">
							<RefreshCw className="w-5 h-5 text-gray-600" />
						</button>
					</div>
				</div>
			</header>

			{/* Grid principal */}
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Tarjetas de resumen */}
				<div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<SummaryCard
						title="Inventario Total"
						value={totales.inventario}
						change=""
						icon={<Package2 className="w-6 h-6" />}
						color="blue"
					/>
					<SummaryCard
						title="Usuarios Activos"
						value={totales.usuarios}
						change=""
						icon={<Users className="w-6 h-6" />}
						color="green"
					/>
					<SummaryCard
						title="Mantenimientos"
						value={totales.mantenimientoFreezer}
						change=""
						icon={<ClipboardList className="w-6 h-6" />}
						color="orange"
					/>
					<SummaryCard
						title="Alertas"
						value="8"
						change=""
						icon={<AlertCircle className="w-6 h-6" />}
						color="red"
					/>
				</div>

				<div className="lg:col-span-2">
					<div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6 h-full">
						{/* Header con título y botones */}
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-lg font-semibold">
								{["Inventario por Usuario", "Otra gráfica", "Otra más"][graficaIndex]}
							</h2>

							<div className="flex items-center gap-2">
								<button
									onClick={() => setGraficaIndex((prev) => (prev - 1 + 3) % 3)}
									className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
									aria-label="Gráfica anterior"
								>
									<ChevronLeft size={16} />
								</button>
								<button
									onClick={() => setGraficaIndex((prev) => (prev + 1) % 3)}
									className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
									aria-label="Gráfica siguiente"
								>
									<ChevronRight size={16} />
								</button>
							</div>
						</div>

						{/* Contenedor de la gráfica con animación */}
						<div className="h-100 relative overflow-hidden">
							<AnimatePresence mode="wait">
								<motion.div
									key={graficaIndex}
									initial={{ opacity: 0, x: 100 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -100 }}
									transition={{ duration: 0.4 }}
									className="absolute w-full h-full"
								>
									{[<ChartPorUsuario data={inventario} />,
									<ChartPorUsuario data={inventario} />,
									<ChartPorUsuario data={inventario} />][graficaIndex]}
								</motion.div>
							</AnimatePresence>
						</div>
					</div>
				</div>


				{/* Sidebar de actividad */}
				<div className="space-y-6">
					<div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6">
						<h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
						<div className="space-y-4">
							{actividadesRecientes.map((actividad, index) => (
								<ActivityItem
									key={index}
									user={actividad.user}
									action={actividad.action}
									time={actividad.time}
									icon={actividad.icon}
								/>
							))}
						</div>
					</div>

					<div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6">
						<h2 className="text-lg font-semibold mb-4">Distribución por Sede</h2>
						<div className="h-64">
							<PieChart data={distribucionSedes} />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
