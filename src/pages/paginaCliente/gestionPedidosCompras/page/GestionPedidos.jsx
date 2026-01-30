import { useEffect, useState, useRef } from "react";
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
	X,
	Edit,
	Check,
	FileSpreadsheet

} from 'lucide-react';
import { URL_IMAGE2 } from "../../../../const/api";
import { useNavigate } from "react-router-dom";
import { RUTAS } from "../../../../const/routers/routers";
import { useApp } from "../../../../store/AppContext";
import { PERMISOS } from "../../../../secure/permisos/permisos";
import { obtenerTiposSolicitud } from "../../../../services/cp_tipo_solicitud";
import { getEstadoIcon } from "../components/getEstadoIcon";
import { getEstadoColor } from "../components/getEstadoColor";
import { exportarPedido, obtenerAdjunto } from "../../../../services/cp_pedidos_services";
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
	const expandedPedidoRef = useRef(null);
	const [filters, setFilters] = useState({
		estado: "pendiente",
		tipo: "todos"
	});
	const [dropdownOpen, setDropdownOpen] = useState(null); // Para controlar qué dropdown está abierto

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(30);


	useEffect(() => {
		const cargarTipos = async () => {
			const data = await obtenerTiposSolicitud();
			setTipos(data);
		};
		cargarTipos();
	}, []);
	useEffect(() => {
		if (expandedPedidoRef.current) {
			expandedPedidoRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'nearest'
			});
		}
	}, [expandedPedido]);

	useEffect(() => {
		const fetchPedidos = async () => {
			let data;
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

	// Cerrar dropdown al hacer clic fuera
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownOpen && !event.target.closest('.dropdown-export')) {
				setDropdownOpen(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [dropdownOpen]);

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

	// Pagination Logic
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredPedidos.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	// Reset page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, filters, itemsPerPage]);

	const handleExportarPedido = async (idpedido, formato = "excel") => {
		try {
			setLoadingExport(true);
			setDropdownOpen(null); // Cerrar el dropdown

			// Ahora solo llamamos a exportarPedido con el formato
			await exportarPedido(idpedido, formato);

			Swal.fire({
				icon: "success",
				title: "Exportación exitosa",
				text: `El pedido se exportó correctamente en formato ${formato === "pdf" ? "PDF" : "Excel"}`,
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
			setLoadingExport(false);
		}
	};

	const handleDescargarAdjunto = async (id) => {
		try {
			await obtenerAdjunto(id);
		} catch (err) {
			console.error("Error descargando adjunto:", err);
			Swal.fire("Error", "Ocurrió un error al descargar el adjunto.", "error");
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
					<div className="flex flex-col sm:flex-row gap-3">
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
				<>
					{/* Paginación - Top */}
					<div className="flex justify-between items-center mb-4 text-sm text-gray-600">

						{/* Selector de filas por página */}
						<div className="flex items-center gap-2">
							<span className="text-gray-500">Mostrar filas:</span>
							<select
								value={itemsPerPage}
								onChange={(e) => setItemsPerPage(Number(e.target.value))}
								className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value={10}>10</option>
								<option value={30}>30</option>
								<option value={50}>50</option>
								<option value={100}>100</option>
							</select>
						</div>

						<div className="flex items-center gap-4">
							<span className="mr-0">
								{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPedidos.length)} de {filteredPedidos.length}
							</span>
							<div className="flex gap-1">
								<button
									onClick={() => paginate(currentPage - 1)}
									disabled={currentPage === 1}
									className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
									title="Anterior"
								>
									<ChevronDown className="rotate-90" size={20} />
								</button>
								<button
									onClick={() => paginate(currentPage + 1)}
									disabled={currentPage === totalPages}
									className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
									title="Siguiente"
								>
									<ChevronDown className="rotate-270" size={20} />
								</button>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						{currentItems.map((pedido) => (
							<div
								key={pedido.id}
								ref={expandedPedido === pedido.id ? expandedPedidoRef : null}
								className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 relative" // Agregamos relative aquí
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
												? `Proceso Responsable : ${pedido.estado_gerencia}`
												: `Proceso Compras : ${pedido.estado_compras}` || 'error'}


										</div>
										<div className="flex flex-col gap-2">
											{permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.CREAR_ENTREGA_SOLICITUD) &&
												pedido.estado_compras === "aprobado" &&
												pedido.estado_entrega !== 1 && (
													<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
														<svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
														</svg>
														Falta entrega
													</span>
												)}

											{permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.SUBIR_ORDEN_COMPRA) &&
												pedido.tiene_adjunto === "No" &&
												pedido.estado_gerencia === "aprobado" && (
													<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
														<svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
														</svg>
														Falta Adjunto
													</span>
												)}
										</div>

										<div>
											<h3 className="font-medium text-gray-800">
												Consecutivo #{pedido.consecutivo || pedido.id}
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
											{new Date(pedido.fecha_solicitud + 'T00:00:00').toLocaleDateString()}
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
															{new Date(pedido.fecha_solicitud + 'T00:00:00').toLocaleDateString()}
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

													{pedido.motivo_aprobacion && (
														<div className="mt-3">
															<p className="text-gray-500 mb-1">Motivo Aprobación:</p>
															<p className="text-gray-700 bg-gray-50 p-3 rounded">{pedido.motivo_aprobacion}</p>
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
																className="h-16  rounded"
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
																className="h-16  rounded"
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
															<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">codigo</th>
															<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
															<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
															<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad de medida</th>
															<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referencia</th>
															<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprado</th>
														</tr>
													</thead>
													<tbody className="bg-white divide-y divide-gray-200">
														{pedido.items?.map((item, index) => (
															<tr key={index}>
																<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.codigo_producto}</td>
																<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.nombre}</td>
																<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.cantidad}</td>
																<td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.unidad_medida}</td>
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
																<td className="px-4 py-2 whitespace-nowrap text-sm">
																	{/* Estado de comprado */}
																	<div className="flex items-center gap-2">
																		<div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.comprado === 1
																			? 'bg-green-100 text-green-800'
																			: 'bg-gray-100 text-gray-800'
																			}`}>
																			{item.comprado === 1 ? (
																				<>
																					<Check size={12} className="mr-1" />
																					Entregado
																				</>
																			) : (
																				<>
																					<X size={12} className="mr-1" />
																					No Entregado
																				</>
																			)}
																		</div>
																	</div>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>

											{pedido.observacion_diligenciado && (
												<div className="mt-3">
													<p className="text-gray-500 mb-1">Motivo Rechazo:</p>
													<p className="text-gray-700 bg-gray-50 p-3 rounded">{pedido.observacion_diligenciado}</p>
												</div>
											)}
										</div>

										{/* Acciones */}
										<div className="mt-6 flex justify-end gap-3">
											<div className="relative dropdown-export">
												<button
													onClick={() => setDropdownOpen(dropdownOpen === pedido.id ? null : pedido.id)}
													disabled={loadingExport}
													className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${loadingExport
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
															<ChevronDown size={14} className={`transition-transform ${dropdownOpen === pedido.id ? 'rotate-180' : ''}`} />
														</>
													)}
												</button>

												{/* Dropdown Menu */}
												{dropdownOpen === pedido.id && !loadingExport && (
													<div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
														<button
															onClick={() => handleExportarPedido(pedido.id, "excel")}
															className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 transition-colors text-slate-700 hover:text-green-700"
														>
															<FileSpreadsheet size={18} className="text-green-600" />
															<span className="text-sm font-medium">Descargar Excel</span>
														</button>
														<button
															onClick={() => handleExportarPedido(pedido.id, "pdf")}
															className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors text-slate-700 hover:text-red-700 border-t border-slate-100"
														>
															<FileText size={18} className="text-red-600" />
															<span className="text-sm font-medium">Descargar PDF</span>
														</button>
													</div>
												)}
											</div>
											{pedido.tiene_adjunto === "Sí" ? (
												<button
													onClick={() => handleDescargarAdjunto(pedido.id)}
													className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
												>
													<Download size={16} />
													Descargar adjunto
												</button>
											) : (
												<span className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-400">
													<FileText size={16} />
													Adjunto no subido
												</span>
											)}
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

											{permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.CREAR_ENTREGA_SOLICITUD) &&
												pedido.estado_compras === "aprobado" &&
												(pedido.estado_entrega === 1 ? (
													<span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
														<CheckCircle className="w-4 h-4 mr-1" />
														Entrega realizada
													</span>
												) : (
													<button
														className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
														onClick={() => {
															navigate(RUTAS.USER.GESTION_COMPRAS.CREAR_ENTREGA_SOLICITUD, {
																state: { pedido }
															})
														}}
													>
														<FileText className="w-4 h-4 mr-2" />
														Realizar Acta de entrega
													</button>
												))
											}
										</div>
									</div>
								)}
							</div>
						))}
					</div>
					{/* Paginación - Bottom (Opcional, pero recomendado para listas largas) */}
					<div className="flex justify-end items-center mt-6 text-sm text-gray-600">
						<span className="mr-4">
							{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPedidos.length)} de {filteredPedidos.length}
						</span>
						<div className="flex gap-1">
							<button
								onClick={() => paginate(currentPage - 1)}
								disabled={currentPage === 1}
								className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
								title="Anterior"
							>
								<ChevronDown className="rotate-90" size={20} />
							</button>
							<button
								onClick={() => paginate(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
								title="Siguiente"
							>
								<ChevronDown className="rotate-270" size={20} />
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}