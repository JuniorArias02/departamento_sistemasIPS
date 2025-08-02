import { useEffect, useState } from "react";
import { obtenerGraficaInventario } from "../../../services/inventario_services";
import { obtenerGraficaMantenimiento } from "../../../services/mantenimiento_services";
import { ChartPorUsuario } from "../components/graficas/renderChartPorUsuario";
import { formatearFechas } from "../../../hook/formatearFecha";
import { CalendarDays, ChevronDown, RefreshCw, Package2, Users, ClipboardList, PlusCircle, ChevronLeft, ChevronRight, ArrowRight,Laptop, Plus, ClipboardSignature, Wrench, ListTodo  } from "lucide-react";
import { PieChart } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { obtenerTotalInventario } from "../../../services/inventario_services";
import { obtenerTotalMantenimiento } from "../../../services/mantenimiento_services";
import { obtenerTotalUsuarios } from "../../../services/usuario_service";
import RecentActivities from "../components/ux/RecentActivities";
import { useNavigate } from "react-router-dom";
import { RUTAS } from "../../../const/routers/routers";
import EmptyState from "../components/graficas/EmptyChart";
import Swal from "sweetalert2";
import SeccionEquiposComputo from "./components/sectionEquiposComputo";
import SummaryCard from "./components/SummaryCard";

export default function DashboardAdmin() {
	const [inventario, setInventario] = useState([]);
	const [mantenimiento, setMantenimiento] = useState([]);
	const [loading, setLoading] = useState(true);
	const [graficaIndex, setGraficaIndex] = useState(0);
	const navigate = useNavigate();
	const [diasFiltro, setDiasFiltro] = useState(30);


	const [totales, setTotales] = useState({
		inventario: 0,
		usuarios: 0,
		mantenimiento: 0
	});

	useEffect(() => {
		refrescarTodo(); // se ejecuta solo una vez al montar
	}, []);


	const cargarTotales = async () => {
		try {
			const [inventario, usuarios, mantenimiento] = await Promise.all([
				obtenerTotalInventario(),
				obtenerTotalUsuarios(),
				obtenerTotalMantenimiento()
			]);

			setTotales({
				inventario,
				usuarios,
				mantenimiento
			});
		} catch (error) {
			console.error("Error al cargar totales", error);
		}
	};


	const cargarGraficas = async () => {
		setLoading(true);
		try {
			const [inv, man] = await Promise.all([
				obtenerGraficaInventario(),
				obtenerGraficaMantenimiento()
			]);

			setInventario(formatearFechas(inv));
			setMantenimiento(formatearFechas(man));
		} catch (error) {
			console.error("Error al cargar gráficas", error);
		} finally {
			setLoading(false);
		}
	};

	const refrescarTodo = async () => {
		setLoading(true);
		await Promise.all([
			cargarTotales(),
			cargarGraficas()
		]);
		setLoading(false);
	};


	if (loading) {
		return (
			<div className="min-h-screen flex flex-col justify-center items-center gap-6 bg-gray-50">
				<div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin drop-shadow-lg"></div>
				<p className="text-gray-700 text-lg font-semibold animate-pulse">Cargando datos...</p>
			</div>
		);
	}

	

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
							<button className="flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all duration-200 group">
								<CalendarDays className="w-5 h-5 text-indigo-500" />
								<input
									type="number"
									min="1"
									max="365"
									value={isNaN(diasFiltro) ? "" : diasFiltro}
									onChange={(e) => {
										const valor = parseInt(e.target.value);
										setDiasFiltro(isNaN(valor) ? "" : valor);
									}}
									className="w-16 px-2 py-1 text-center text-sm font-medium text-gray-700 bg-gray-50 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-200"
								/>

								<span className="text-sm text-gray-500">días</span>
								<ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
							</button>
						</div>
						<button
							onClick={refrescarTodo}
							className="p-2 rounded-xl bg-white border border-gray-200 shadow-xs hover:shadow-sm transition-all disabled:opacity-50"
							disabled={loading}
						>
							{loading ? (
								<RefreshCw className="w-5 h-5 animate-spin text-gray-400" />
							) : (
								<RefreshCw className="w-5 h-5 text-gray-600" />
							)}
						</button>

					</div>
				</div>
			</header>

			{/* Grid principal */}
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
				{/* Tarjetas de resumen */}
				<div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<SummaryCard
						title="Inventario Total"
						value={totales.inventario}
						change="ver"
						onNavigate={() => navigate(RUTAS.USER.INVENTARIO.VER_INVENTARIO)}
						icon={<Package2 className="w-6 h-6" />}
						color="blue"
					/>
					<SummaryCard
						title="Usuarios Activos"
						value={totales.usuarios}
						change="ver"
						onNavigate={() => navigate(RUTAS.ADMIN.USUARIOS.ROOT)}
						icon={<Users className="w-6 h-6" />}
						color="green"
					/>
					<SummaryCard
						title="Mantenimientos"
						value={totales.mantenimiento}
						change="ver"
						onNavigate={() => navigate(RUTAS.USER.MANTENIMIENTO.VISTA_DATOS)}
						icon={<ClipboardList className="w-6 h-6" />}
						color="orange"
					/>
					<SummaryCard
						title="Agregar widget"
						value=""
						change=""
						icon={<PlusCircle className="w-6 h-6" />}
						color="green"
						onNavigate={() => {
							Swal.fire({
								icon: 'info',
								title: 'Oops...',
								text: 'No hay widgets disponibles para agregar',
								confirmButtonColor: '#6366f1'
							});
						}}
					/>

				</div>

				<div className="lg:col-span-2">
					<div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-4 md:p-6 h-full flex flex-col">
						{/* Header */}
						<div className="flex justify-between items-center mb-4 md:mb-6">
							<h2 className="text-lg font-semibold text-gray-800">
								{["Inventario", "Mantenimiento", "Próximamente"][graficaIndex]}
							</h2>

							<div className="flex items-center gap-1 md:gap-2">
								<button
									onClick={() => setGraficaIndex((prev) => (prev - 1 + 3) % 3)}
									className="p-1 md:p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
									aria-label="Gráfica anterior"
								>
									<ChevronLeft size={16} />
								</button>
								<button
									onClick={() => setGraficaIndex((prev) => (prev + 1) % 3)}
									className="p-1 md:p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
									aria-label="Gráfica siguiente"
								>
									<ChevronRight size={16} />
								</button>
							</div>
						</div>

						{/* Contenedor principal */}
						<div className="flex-1 relative min-h-[400px]">
							{loading ? (
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="w-full h-full animate-pulse bg-gray-100 rounded-xl" />
								</div>
							) : (
								<AnimatePresence mode="wait">
									<motion.div
										key={graficaIndex}
										initial={{ opacity: 0, x: graficaIndex > 1 ? 50 : -50 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: graficaIndex > 1 ? -50 : 50 }}
										transition={{ duration: 0.3 }}
										className="absolute inset-0"
									>
										{graficaIndex === 0 ? (
											<ChartPorUsuario
												data={inventario}
												diasFiltro={diasFiltro}
												title=""
											/>
										) : graficaIndex === 1 ? (
											<ChartPorUsuario
												data={mantenimiento}
												diasFiltro={diasFiltro}
												title=""
											/>
										) : (
											<EmptyState />
										)}
									</motion.div>
								</AnimatePresence>
							)}
						</div>
					</div>
				</div>
				{/* Sidebar de actividad */}
				<div className="space-y-6">
					<div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6">
						<RecentActivities />
					</div>

					<div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-6">
						<h2 className="text-lg font-semibold mb-4">Distribución por Sede</h2>
						<div className="h-64">
							<PieChart data={distribucionSedes} />
						</div>
					</div>
				</div>
			</div>
				<div>

				<SeccionEquiposComputo />
				</div>
		</main>
	);
}
