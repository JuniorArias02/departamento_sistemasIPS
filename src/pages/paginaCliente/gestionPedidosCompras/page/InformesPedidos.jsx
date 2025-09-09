import { useState } from 'react';
import {
	BarChart3,
	Download,
	Filter,
	Calendar,
	TrendingUp,
	PieChart,
	FileText,
	CheckCircle,
	Clock,
	XCircle,
	RefreshCw,
	DollarSign,
	Package
} from 'lucide-react';
import Swal from 'sweetalert2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	PointElement,
	LineElement
} from 'chart.js';
import { exportarInformeFecha } from '../../../../services/cp_pedidos_services';

import { Bar, Doughnut, Line } from 'react-chartjs-2';


ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
	PointElement,
	LineElement
);

export default function InformesPedidos() {
	const [form, setForm] = useState({
		fecha_inicio: '',
		fecha_fin: '',
	});
	const [filtros, setFiltros] = useState({
		fechaInicio: '',
		fechaFin: '',
		estado: 'todos',
		tipoSolicitud: 'todos'
	});

	const [reporteData, setReporteData] = useState(null);
	const [cargando, setCargando] = useState(false);
	const [cargandoConsolidado, setCargandoConsolidado] = useState(false);

	const generarConsolidado = async () => {
		if (!form.fecha_inicio || !form.fecha_fin) {
		  Swal.fire({
			icon: "warning",
			title: "Fechas requeridas",
			text: "Por favor selecciona ambas fechas",
			confirmButtonColor: "#3B82F6",
		  });
		  return; 
		}
		setCargandoConsolidado(true);
		try {
		  await exportarInformeFecha(form);
		} finally {
			setCargandoConsolidado(false);
		}
	  };
	  
	const generarReporte = async () => {
		if (!form.fechaInicio || !form.fechaFin) {
			const rest = await exportarInformeFecha(form);
			Swal.fire({
				icon: 'warning',
				title: 'Fechas requeridas',
				text: 'Por favor selecciona ambas fechas',
				confirmButtonColor: '#3B82F6'
			});
			return;
		}

		setCargando(true);


		setTimeout(() => {
			const datosSimulados = {
				resumen: {
					totalPedidos: 45,
					aprobados: 28,
					pendientes: 12,
					rechazados: 5,
					montoTotal: 1250000,
					promedioTiempo: '3.5 días'
				},
				graficas: {
					porEstado: [
						{ estado: 'Aprobado', cantidad: 28, color: '#10B981' },
						{ estado: 'Pendiente', cantidad: 12, color: '#F59E0B' },
						{ estado: 'Rechazado', cantidad: 5, color: '#EF4444' }
					],
					porTipo: [
						{ tipo: 'Recurrente', cantidad: 32, color: '#3B82F6' },
						{ tipo: 'Prioritaria', cantidad: 13, color: '#8B5CF6' }
					],
					tendenciaMensual: [
						{ mes: 'Ene', pedidos: 8, monto: 20000 },
						{ mes: 'Feb', pedidos: 12, monto: 350000 },
						{ mes: 'Mar', pedidos: 15, monto: 450000 },
						{ mes: 'Abr', pedidos: 10, monto: 250000 }
					]
				},
				detalle: Array.from({ length: 15 }, (_, i) => ({
					id: i + 1,
					consecutivo: `PED-2023-${1000 + i}`,
					fecha: '2023-04-' + (10 + i),
					solicitante: `Departamento ${i % 3 === 0 ? 'Sistemas' : i % 3 === 1 ? 'Contabilidad' : 'Recursos Humanos'}`,
					tipo: i % 4 === 0 ? 'Prioritaria' : 'Recurrente',
					estado: i % 5 === 0 ? 'Rechazado' : i % 5 === 1 ? 'Pendiente' : 'Aprobado',
					monto: (500000 + i * 100000).toLocaleString(),
					items: (i % 3) + 2
				}))
			};

			setReporteData(datosSimulados);
			setCargando(false);

			Swal.fire({
				icon: 'success',
				title: 'Reporte generado',
				text: 'Los datos se han cargado correctamente',
				confirmButtonColor: '#10B981',
				timer: 2000
			});
		}, 1500);
	};

	const descargarReporte = (formato) => {
		Swal.fire({
			icon: 'info',
			title: `Descargando en ${formato.toUpperCase()}`,
			text: 'El reporte se está preparando para descargar...',
			confirmButtonColor: '#3B82F6',
			timer: 1500
		});
	};

	const getEstadoIcon = (estado) => {
		switch (estado) {
			case 'Aprobado': return <CheckCircle size={16} className="text-green-500" />;
			case 'Pendiente': return <Clock size={16} className="text-yellow-500" />;
			case 'Rechazado': return <XCircle size={16} className="text-red-500" />;
			default: return <Clock size={16} className="text-gray-500" />;
		}
	};

	const tendenciaMensualData = {
		labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
		datasets: [
			{
				label: 'Pedidos',
				data: [12, 19, 8, 15, 22, 18],
				backgroundColor: 'rgba(59, 130, 246, 0.8)',
				borderColor: 'rgb(59, 130, 246)',
				borderWidth: 2,
				borderRadius: 6,
			},
			{
				label: 'Compras Aprobadas',
				data: [8, 15, 5, 12, 18, 14],
				backgroundColor: 'rgba(16, 185, 129, 0.8)',
				borderColor: 'rgb(16, 185, 129)',
				borderWidth: 2,
				borderRadius: 6,
			}
		]
	};

	const tendenciaMensualOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Evolución Mensual de Pedidos'
			}
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: 'rgba(0, 0, 0, 0.1)'
				}
			},
			x: {
				grid: {
					color: 'rgba(0, 0, 0, 0.1)'
				}
			}
		}
	};

	// Configuración para gráfica circular de estados
	const distribucionEstadosData = {
		labels: ['Aprobados', 'Pendientes', 'Rechazados', 'En Proceso'],
		datasets: [
			{
				data: [28, 12, 5, 8],
				backgroundColor: [
					'rgba(16, 185, 129, 0.8)',
					'rgba(245, 158, 11, 0.8)',
					'rgba(239, 68, 68, 0.8)',
					'rgba(59, 130, 246, 0.8)'
				],
				borderColor: [
					'rgb(16, 185, 129)',
					'rgb(245, 158, 11)',
					'rgb(239, 68, 68)',
					'rgb(59, 130, 246)'
				],
				borderWidth: 2,
				hoverOffset: 12
			}
		]
	};

	const distribucionEstadosOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom',
			},
			title: {
				display: true,
				text: 'Distribución por Estado'
			}
		},
		cutout: '40%'
	};

	// Configuración para gráfica de línea de montos
	const montosMensualesData = {
		labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
		datasets: [
			{
				label: 'Monto Total ($)',
				data: [25000000, 35000000, 45000000, 30000000, 55000000, 40000000],
				borderColor: 'rgb(139, 92, 246)',
				backgroundColor: 'rgba(139, 92, 246, 0.1)',
				borderWidth: 3,
				fill: true,
				tension: 0.4,
				pointBackgroundColor: 'rgb(139, 92, 246)',
				pointBorderColor: '#fff',
				pointBorderWidth: 2,
				pointRadius: 6
			}
		]
	};

	const montosMensualesOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Evolución de Montos Mensuales'
			}
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: 'rgba(0, 0, 0, 0.1)'
				},
				ticks: {
					callback: function (value) {
						return '$' + (value / 1000000) + 'M';
					}
				}
			},
			x: {
				grid: {
					color: 'rgba(0, 0, 0, 0.1)'
				}
			}
		}
	};


	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-3">
						<div className="p-3 rounded-lg bg-blue-100 text-blue-600">
							<BarChart3 size={24} />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-800">Informes de Pedidos</h1>
							<p className="text-gray-600">Genera reportes detallados de compras y pedidos</p>
						</div>
					</div>
				</div>

				{/* Panel de Filtros */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
					<h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
						<Filter size={18} />
						Filtros del Reporte
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
						{/* Fecha Inicio */}
						<div className="relative">
							<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
								<Calendar size={16} />
								Fecha Inicio
							</label>
							<input
								type="date"
								value={form.fecha_inicio}
								onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						{/* Fecha Fin */}
						<div className="relative">
							<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
								<Calendar size={16} />
								Fecha Fin
							</label>
							<input
								type="date"
								value={form.fecha_fin}
								onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						{/* Estado */}
						<div className="relative">
							<label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
							<select
								value={filtros.estado}
								onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="todos">Todos los estados</option>
								<option value="aprobado">Aprobado</option>
								<option value="pendiente">Pendiente</option>
								<option value="rechazado">Rechazado</option>
								<option value="en proceso">En proceso</option>
							</select>
						</div>

						{/* Tipo Solicitud */}
						<div className="relative">
							<label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Solicitud</label>
							<select
								value={filtros.tipoSolicitud}
								onChange={(e) => setFiltros({ ...filtros, tipoSolicitud: e.target.value })}
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="todos">Todos los tipos</option>
								<option value="1">Recurrente</option>
								<option value="2">Prioritaria</option>
							</select>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<button
							onClick={generarReporte}
							disabled={cargando}
							className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
						>
							{cargando ? (
								<>
									<RefreshCw size={18} className="animate-spin" />
									Generando...
								</>
							) : (
								<>
									<TrendingUp size={18} />
									Generar Reporte
								</>
							)}
						</button>

						<button
							onClick={generarConsolidado}
							disabled={cargandoConsolidado}
							className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
						>
							{cargandoConsolidado ? (
								<>
									<RefreshCw size={18} className="animate-spin" />
									Generando...
								</>
							) : (
								<>
									<TrendingUp size={18} />
									Descargando consolidado
								</>
							)}
						</button>
					</div>
				</div>

				{reporteData && (
					<>
						{/* Resumen General */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Total Pedidos</p>
										<p className="text-2xl font-bold text-gray-800">{reporteData.resumen.totalPedidos}</p>
									</div>
									<div className="p-3 rounded-lg bg-blue-100 text-blue-600">
										<FileText size={20} />
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Monto Total</p>
										<p className="text-2xl font-bold text-gray-800">${reporteData.resumen.montoTotal.toLocaleString()}</p>
									</div>
									<div className="p-3 rounded-lg bg-green-100 text-green-600">
										<DollarSign size={20} />
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Tiempo Promedio</p>
										<p className="text-2xl font-bold text-gray-800">{reporteData.resumen.promedioTiempo}</p>
									</div>
									<div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
										<Clock size={20} />
									</div>
								</div>
							</div>

							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm text-gray-600">Items Totales</p>
										<p className="text-2xl font-bold text-gray-800">+150</p>
									</div>
									<div className="p-3 rounded-lg bg-purple-100 text-purple-600">
										<Package size={20} />
									</div>
								</div>
							</div>
						</div>

						{/* Gráficas y Descargas */}
						{/* Gráficas */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
							{/* Gráfica de Tendencia Mensual */}
							<div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
								<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
									<BarChart3 size={18} />
									Tendencia Mensual
								</h3>
								<div className="h-64">
									<Bar
										data={tendenciaMensualData}
										options={tendenciaMensualOptions}
									/>
								</div>
							</div>

							{/* Gráfica Circular de Estados */}
							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
								<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
									<PieChart size={18} />
									Distribución por Estado
								</h3>
								<div className="h-64">
									<Doughnut
										data={distribucionEstadosData}
										options={distribucionEstadosOptions}
									/>
								</div>
							</div>
						</div>

						{/* Segunda fila de gráficas */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
							{/* Gráfica de Línea - Montos */}
							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
								<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
									<TrendingUp size={18} />
									Evolución de Montos
								</h3>
								<div className="h-64">
									<Line
										data={montosMensualesData}
										options={montosMensualesOptions}
									/>
								</div>
							</div>

							{/* Gráfica de Barras - Tipos de Solicitud */}
							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
								<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
									<FileText size={18} />
									Por Tipo de Solicitud
								</h3>
								<div className="h-64">
									<Bar
										data={{
											labels: ['Recurrentes', 'Prioritarias'],
											datasets: [
												{
													label: 'Cantidad',
													data: [32, 13],
													backgroundColor: [
														'rgba(59, 130, 246, 0.8)',
														'rgba(139, 92, 246, 0.8)'
													],
													borderColor: [
														'rgb(59, 130, 246)',
														'rgb(139, 92, 246)'
													],
													borderWidth: 2,
													borderRadius: 6,
												}
											]
										}}
										options={{
											responsive: true,
											maintainAspectRatio: false,
											plugins: {
												legend: {
													display: false
												}
											}
										}}
									/>
								</div>
							</div>
						</div>
						{/* Tabla de Detalles */}
						<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
							<div className="flex items-center justify-between p-6 border-b border-gray-200">
								<h3 className="text-lg font-semibold text-gray-800">Detalle de Pedidos</h3>
								<div className="flex gap-2">
									<button
										onClick={() => descargarReporte('pdf')}
										className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
									>
										<Download size={16} />
										PDF
									</button>
									<button
										onClick={() => descargarReporte('excel')}
										className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
									>
										<Download size={16} />
										Excel
									</button>
								</div>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{reporteData.detalle.slice(0, 5).map((pedido) => (
											<tr key={pedido.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pedido.consecutivo}</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.fecha}</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.solicitante}</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.tipo}</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${pedido.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
														pedido.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
															'bg-red-100 text-red-800'
														}`}>
														{getEstadoIcon(pedido.estado)}
														{pedido.estado}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${pedido.monto}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}