import { useEffect, useState } from "react";
import { obtenerPedidos } from "../../../../services/cp_pedidos_services";
import {
	ClipboardList,
	Clock,
	CheckCircle,
	XCircle,
	FileText,
	User,
	Calendar,
	Search,
	ChevronDown,
	ChevronUp,
	Filter,
	ExternalLink,
	Download,
	Loader2,
	X
} from 'lucide-react';
import { URL_IMAGE2 } from "../../../../const/api";
import { useNavigate } from "react-router-dom";
import { RUTAS } from "../../../../const/routers/routers";
import { useApp } from "../../../../store/AppContext";
import { PERMISOS } from "../../../../secure/permisos/permisos";
import { obtenerTiposSolicitud } from "../../../../services/cp_tipo_solicitud";
import { getEstadoIcon } from "../components/getEstadoIcon";
import { getEstadoColor } from "../components/getEstadoColor";
import { exportarPedido } from "../../../../services/cp_pedidos_services";
import Swal from "sweetalert2";

export default function GestionPedidos() {
	const { usuario, permisos } = useApp();
	const navigate = useNavigate();
	const [pedidos, setPedidos] = useState([]);
	const [tipos, setTipos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingExport, setLoadingExport] = useState(false);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedPedido, setExpandedPedido] = useState(null);
	const [filters, setFilters] = useState({
		estado: "todos",
		tipo: "todos"
	});


	useEffect(() => {
		const cargarTipos = async () => {
			const data = await obtenerTiposSolicitud();
			setTipos(data);
		};
		cargarTipos();
	}, []);


	useEffect(() => {
		const fetchPedidos = async () => {
			let data; // se define aquí para usarla en todo el scope
			try {
				data = await obtenerPedidos({ usuarioId: usuario.id });
				if (data.success) {
					setPedidos(data.data);
				} else {
					setError("No se pudieron cargar los pedidos");
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
				setTimeout(() => {
					if (data?.data?.length > 0) {
						setExpandedPedido(data.data[0].id);
					}
				}, 300);
			}
		};
		fetchPedidos();
	}, []);

	const toggleExpandPedido = (id) => {
		setExpandedPedido(expandedPedido === id ? null : id);
	};

	const filteredPedidos = pedidos.filter(pedido => {
		// Normalizar valores a string seguro
		const consecutivo = String(pedido.consecutivo ?? "").toLowerCase();
		const solicitante = String(pedido.proceso_solicitante ?? "").toLowerCase();
		const elaborado = String(pedido.elaborado_por_nombre ?? "").toLowerCase();
		const observacion = String(pedido.observacion ?? "").toLowerCase();

		// Filtro por búsqueda
		const matchesSearch =
			consecutivo.includes(searchTerm.toLowerCase()) ||
			solicitante.includes(searchTerm.toLowerCase()) ||
			elaborado.includes(searchTerm.toLowerCase()) ||
			observacion.includes(searchTerm.toLowerCase());

		// Filtro por estado
		const matchesEstado =
			filters.estado === "todos" ||
			String(pedido.estado_compras ?? "").toLowerCase() === filters.estado.toLowerCase();

		// Filtro por tipo
		const matchesTipo =
			filters.tipo === "todos" ||
			String(pedido.tipo_solicitud ?? "") === filters.tipo;

		return matchesSearch && matchesEstado && matchesTipo;
	});

	const handleExportarPedido = async (idpedido) => {
		try {
			setLoadingExport(true);
			await exportarPedido(idpedido);

			Swal.fire({
				icon: "success",
				title: "Exportación exitosa",
				text: "El pedido se exportó correctamente",
				timer: 2000,
				showConfirmButton: false,
			});
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "No se pudo exportar el pedido. Intenta nuevamente.",
			});
		} finally {
			setLoadingExport(false); // 🔹 cuando termina quita el loading
		}
	};

	if (loading) return (
		<div className="flex justify-center items-center h-64">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
		</div>
	);

	if (error) return (
		<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
			<p className="font-bold">Error</p>
			<p>{error}</p>
		</div>
	);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
					<ClipboardList className="text-blue-600" size={24} />
					Gestión de Pedidos
				</h1>

				<div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
					{/* Barra de búsqueda */}
					<div className="relative flex-grow">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Search className="text-gray-400" size={18} />
						</div>
						<input
							type="text"
							placeholder="Buscar pedidos..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					{/* Filtros */}
					{/* Filtros modernos */}
					<div className="flex flex-col sm:flex-row gap-3">
						{/* Filtro de Estado */}
						<div className="relative flex-1 min-w-[180px]">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Filter size={16} className="text-gray-400" />
							</div>
							<select
								value={filters.estado}
								onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
								className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer"
							>
								<option value="todos">Todos los estados</option>
								<option value="pendiente">Pendiente</option>
								<option value="aprobado">Aprobado</option>
								<option value="rechazado">Rechazado</option>
								<option value="en proceso">En proceso</option>
							</select>
							<div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
								<ChevronDown size={16} className="text-gray-400" />
							</div>
						</div>

						{/* Filtro de Tipo */}
						<div className="relative flex-1 min-w-[180px]">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Filter size={16} className="text-gray-400" />
							</div>
							<select
								value={filters.tipo}
								onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
								className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl bg-white text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer"
							>
								<option value="todos">Todos los tipos</option>
								{tipos.map((tipo) => (
									<option key={tipo.id} value={tipo.id}>
										{tipo.nombre}
									</option>
								))}
							</select>
							<div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
								<ChevronDown size={16} className="text-gray-400" />
							</div>
						</div>

						{/* Botón para limpiar filtros (opcional) */}
						{(filters.estado !== 'todos' || filters.tipo !== 'todos') && (
							<button
								onClick={() => setFilters({ estado: 'todos', tipo: 'todos' })}
								className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
							>
								<X size={16} />
								Limpiar
							</button>
						)}
					</div>
				</div>
			</div>

			{filteredPedidos.length === 0 ? (
				<div className="bg-white rounded-lg shadow p-8 text-center">
					<p className="text-gray-500">No se encontraron pedidos</p>
				</div>
			) : (
				<div className="space-y-4">
					{filteredPedidos.map((pedido) => (
						<div
							key={pedido.id}
							className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
						>
							{/* Encabezado de la carta */}
							<div
								className={`p-4 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${expandedPedido === pedido.id ? 'border-b border-gray-200' : ''}`}
								onClick={() => toggleExpandPedido(pedido.id)}
							>
								<div className="flex items-center gap-3">
									<div
										className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(
											permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.VER_PEDIDOS_ENCARGADO)
												? pedido.estado_gerencia
												: pedido.estado_compras
										)
											} flex items-center gap-2`}
									>
										{getEstadoIcon(
											permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.VER_PEDIDOS_ENCARGADO)
												? pedido.estado_gerencia
												: pedido.estado_compras
										)}
										{permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.VER_PEDIDOS_ENCARGADO)
											? pedido.estado_gerencia
											: pedido.estado_compras || 'Sin estado'}
									</div>
									<div>
										<h3 className="font-medium text-gray-800">
											Pedido #{pedido.consecutivo || pedido.id}
										</h3>
										<p className="text-sm text-gray-500">
											{pedido.proceso_solicitante}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-4">
									<div className="hidden sm:block text-sm text-gray-500">
										<span className="font-medium">Solicitante:</span> {pedido.elaborado_por_nombre}
									</div>
									<div className="text-sm text-gray-500 flex items-center gap-1">
										<Calendar size={14} />
										{new Date(pedido.fecha_solicitud).toLocaleDateString()}
									</div>
									<button className="text-blue-500 hover:text-blue-700">
										{expandedPedido === pedido.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
									</button>
								</div>
							</div>

							{/* Contenido expandible */}
							{expandedPedido === pedido.id && (
								<div className="p-4 border-t border-gray-100">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
										{/* Detalles del pedido */}
										<div>
											<h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
												<FileText size={16} />
												Detalles del Pedido
											</h4>
											<div className="space-y-2">
												<div className="flex justify-between">
													<span className="text-gray-500">Tipo de solicitud:</span>
													<span className="font-medium">
														{pedido.tipo_solicitud_nombre || 'No especificado'}
													</span>

												</div>
												<div className="flex justify-between">
													<span className="text-gray-500">Fecha solicitud:</span>
													<span className="font-medium">
														{new Date(pedido.fecha_solicitud).toLocaleDateString()}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-gray-500">Proceso solicitante:</span>
													<span className="font-medium">{pedido.proceso_solicitante}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-gray-500">Elaborado por:</span>
													<span className="font-medium">{pedido.elaborado_por_nombre}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-gray-500">Sede</span>
													<span className="font-medium">{pedido.sede_nombre}</span>
												</div>
												{pedido.observacion && (
													<div className="mt-3">
														<p className="text-gray-500 mb-1">Observaciones:</p>
														<p className="text-gray-700 bg-gray-50 p-3 rounded">{pedido.observacion}</p>
													</div>
												)}
											</div>
										</div>

										{/* Firmas */}
										<div>
											<h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
												<User size={16} />
												Firmas
											</h4>
											<div className="space-y-4">
												<div>
													<p className="text-sm text-gray-500 mb-1">Elaborado por:</p>
													{pedido.elaborado_por_firma ? (
														<img
															src={`${URL_IMAGE2}${pedido.elaborado_por_firma}`}
															alt="Firma elaborado por"
															className="h-16 border rounded"
														/>
													) : (
														<p className="text-sm text-gray-400">Sin firma</p>
													)}
												</div>

												{pedido.proceso_compra_firma && (
													<div>
														<p className="text-sm text-gray-500 mb-1">Proceso compra:</p>
														<img
															src={`${URL_IMAGE2}${pedido.proceso_compra_firma}`}
															alt="Firma proceso compra"
															className="h-16 border rounded"
														/>
														<p className="text-sm text-gray-500 mt-1">{pedido.proceso_compra_nombre}</p>
													</div>
												)}

												{pedido.responsable_aprobacion_firma && (
													<div>
														<p className="text-sm text-gray-500 mb-1">Aprobación:</p>
														<img
															src={`${URL_IMAGE2}${pedido.responsable_aprobacion_firma}`}
															alt="Firma responsable aprobación"
															className="h-16 border rounded"
														/>
														<p className="text-sm text-gray-500 mt-1">{pedido.responsable_aprobacion_nombre}</p>
													</div>
												)}
											</div>
										</div>
									</div>

									{/* Items del pedido */}
									<div className="mt-6">
										<h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
											<ClipboardList size={16} />
											Ítems solicitados
										</h4>
										<div className="overflow-x-auto">
											<table className="min-w-full divide-y divide-gray-200">
												<thead className="bg-gray-50">
													<tr>
														<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
														<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
														<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referencia</th>
													</tr>
												</thead>
												<tbody className="bg-white divide-y divide-gray-200">
													{pedido.items?.map((item, index) => (
														<tr key={index}>
															<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.nombre}</td>
															<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.cantidad}</td>
															<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
																{item.referencia_items ? `Referencia ${index + 1}` : "-"}
																{item.referencia_items && (
																	<button
																		onClick={() => window.open(item.referencia_items, "_blank")}
																		className="p-1 rounded hover:bg-gray-100"
																		title={item.referencia_items}
																	>
																		<ExternalLink size={16} className="text-blue-500" />
																	</button>
																)}
															</td>


														</tr>
													))}
												</tbody>
											</table>
										</div>

										{pedido.observacion_diligenciado && (
											<div className="mt-3">
												<p className="text-gray-500 mb-1">Motivo Rechazo
													:</p>
												<p className="text-gray-700 bg-gray-50 p-3 rounded">{pedido.observacion_diligenciado}</p>
											</div>
										)}
									</div>

									{/* Acciones */}
									<div className="mt-6 flex justify-end gap-3">
										<button
											onClick={() => handleExportarPedido(pedido.id)}
											disabled={loadingExport}
											className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${loading
												? "bg-gray-200 text-gray-400 cursor-not-allowed"
												: "text-gray-700 hover:bg-gray-50"
												}`}
										>
											{loadingExport ? (
												<>
													<Loader2 size={16} className="animate-spin" />
													Exportando...
												</>
											) : (
												<>
													<Download size={16} />
													Exportar
												</>
											)}
										</button>
										{permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.GESTIONAR_PEDIDO) && (
											<button
												className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
												onClick={() => {
													navigate(RUTAS.USER.GESTION_COMPRAS.DETALLE_PEDIDO, { state: { pedido } })
												}}
											>
												Gestionar
											</button>
										)}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}