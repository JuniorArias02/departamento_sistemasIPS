import { useEffect, useState } from "react";
import { listarInventarios, eliminarInventario, buscarInventario, exportarInventarios } from "../../../services/inventario_services";
import Swal from "sweetalert2";
import BackPage from "../components/BackPage";
import { Download, Search, Pencil, Trash2, User, Building2, PackageSearch, CheckCircle2, AlertTriangle, RefreshCw, ChevronsRight, ChevronsLeft, XCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RUTAS } from "../../../const/routers/routers";

export default function VistaDatosInventarios() {
	const navigate = useNavigate();
	const [inventarios, setInventarios] = useState([]);
	const [loadingExport, setLoadingExport] = useState(false);
	const [filtroTexto, setFiltroTexto] = useState("");
	const [filtroSede, setFiltroSede] = useState("");
	const [paginaActual, setPaginaActual] = useState(1);
	const itemsPorPagina = 20; // cuantos mostrar por página
	const indexUltimo = paginaActual * itemsPorPagina;
	const indexPrimero = indexUltimo - itemsPorPagina;
	const inventariosPagina = inventarios.slice(indexPrimero, indexUltimo);
	const totalPaginas = Math.ceil(inventarios.length / itemsPorPagina);

	const fetchData = async () => {
		try {
			const data = await listarInventarios();
			setInventarios(data);
		} catch (err) {
			console.error("Error cargando inventarios", err);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleEditar = (item) => {
		navigate(RUTAS.USER.INVENTARIO.ACTUALIZAR_INVENTARIO, {
			state: { inventario: item },
		});
	};

	const handleEliminar = async (id) => {
		Swal.fire({
			title: "¿Estás seguro?",
			text: "Esta acción no se puede deshacer",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await eliminarInventario(id);
					await fetchData();
					Swal.fire(
						"Eliminado",
						"El inventario ha sido eliminado.",
						"success",
					);
				} catch (error) {
					console.error("Error al eliminar:", error);
					Swal.fire("Error", error.message, "error");
				}
			}
		});
	};

	const handleExportar = async (e) => {
		setLoadingExport(true);
		if (e?.preventDefault) e.preventDefault(); // 💥 evita recargar

		try {
			await exportarInventarios();
			Swal.fire({
				icon: "success",
				title: "Exportado",
				text: "Archivo Excel descargado correctamente",
				timer: 1500,
				showConfirmButton: false,
			});
		} catch (error) {
			Swal.fire("Error", error.message, "error");
		} finally {
			setLoadingExport(false);
		}
	};


	useEffect(() => {
		const delay = setTimeout(() => {
			handleBuscar(); // ejecuta la búsqueda después de 1.5s sin escribir
		}, 1000);

		return () => clearTimeout(delay); // limpia el timeout si sigue escribiendo antes de 1.5s
	}, [filtroTexto, filtroSede]);

	const handleBuscar = async () => {
		try {
			const filtros = {};

			if (filtroTexto) {
				filtros.filtroTexto = filtroTexto;
			}
			if (filtroSede) {
				filtros.sede_nombre = filtroSede;
			}
			let data;
			// Si no hay filtros, cargar todo
			if (Object.keys(filtros).length === 0) {
				data = await buscarInventario(); // sin filtros, carga todo
			} else {
				data = await buscarInventario(filtros);
			}
			setInventarios(data);
		} catch (err) {
			console.error("Error al buscar inventario", err);
		}
	};


	return (
		<div className="w-full max-w-none mx-auto p-6 bg-white rounded-2xl shadow-sm space-y-6">
			{/* Header superior */}
			<div className="flex justify-between items-center mb-6">
				<BackPage className="text-neutral-600 hover:text-indigo-600 transition-colors" />
				<div className="flex gap-3">
					<button
						onClick={handleExportar}
						disabled={loadingExport}
						className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 text-white font-medium py-2 px-4 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
					>
						{loadingExport ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							<Download size={20} />
						)}
						<span>Exportar Excel</span>
					</button>
				</div>
			</div>

			{/* Encabezado */}
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold text-neutral-800 bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent">
					Gestión de Inventarios
				</h1>
				<p className="text-neutral-500 mt-2">
					Visualiza y administra todos los activos tecnológicos de la organización
				</p>
			</div>

			{/* Filtros avanzados */}
			<div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-3.5 w-4 h-4 text-neutral-400" />
						<input
							type="text"
							placeholder="Buscar por código, serial..."
							className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
							value={filtroTexto}
							onChange={(e) => setFiltroTexto(e.target.value)}
						/>
					</div>

					<div className="relative">
						<Building2 className="absolute left-3 top-3.5 w-4 h-4 text-neutral-400" />
						<input
							type="text"
							placeholder="Filtrar por sede"
							className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
							value={filtroSede}
							onChange={(e) => setFiltroSede(e.target.value)}
						/>
					</div>

					<select className="px-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white">
						<option>Filtrar por dependencia</option>
						{/* Opciones aquí */}
					</select>

					<button
						onClick={handleBuscar}
						className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md cursor-pointer"
					>
						<Search size={18} />
						<span>Buscar</span>
					</button>
				</div>
			</div>

			{/* Tabla moderna */}
			<div className="overflow-hidden rounded-xl border border-neutral-200 shadow-xs">
				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead className="bg-gradient-to-r from-indigo-50 to-violet-50 text-neutral-700">
							<tr>
								<th className="px-6 py-4 font-semibold">Código</th>
								<th className="px-6 py-4 font-semibold">Nombre</th>
								<th className="px-6 py-4 font-semibold">Dependencia</th>
								<th className="px-6 py-4 font-semibold">Responsable</th>
								<th className="px-6 py-4 font-semibold">Marca/Modelo</th>
								<th className="px-6 py-4 font-semibold">Serial</th>
								<th className="px-6 py-4 font-semibold">Calibrado</th>
								<th className="px-6 py-4 font-semibold">Sede</th>
								<th className="px-6 py-4 font-semibold text-right">Acciones</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-neutral-200">
							{inventariosPagina.map((item, i) => {
								// Determinar el estado de calibrado
								const hoy = new Date();
								const fechaCalibrado = item.calibrado ? new Date(item.calibrado) : null;
								let calibradoEstado = 'no-calibrado';
								let calibradoIcon = <XCircle size={18} className="text-red-500" />;
								let calibradoTooltip = 'No calibrado';

								if (fechaCalibrado) {
									const diffTime = hoy - fechaCalibrado;
									const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

									if (diffDays < 30) {
										calibradoEstado = 'reciente';
										calibradoIcon = <CheckCircle2 size={18} className="text-green-500" />;
										calibradoTooltip = 'Calibrado recientemente';
									} else if (diffDays < 90) {
										calibradoEstado = 'proximo';
										calibradoIcon = <AlertCircle size={18} className="text-amber-500" />;
										calibradoTooltip = 'Próximo a calibrar';
									} else {
										calibradoEstado = 'vencido';
										calibradoIcon = <AlertTriangle size={18} className="text-red-500" />;
										calibradoTooltip = 'Calibración vencida';
									}
								}

								return (
									<motion.tr
										key={item.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: i * 0.03 }}
										className="hover:bg-neutral-50/80 transition-colors"
									>
										<td className="px-6 py-4 font-medium text-indigo-600">{item.codigo}</td>
										<td className="px-6 py-4">{item.nombre}</td>
										<td className="px-6 py-4 text-neutral-600">{item.dependencia}</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2">
												<div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
													<User size={16} />
												</div>
												<span>{item.responsable}</span>
											</div>
										</td>
										<td className="px-6 py-4">
											<div>
												<div className="font-medium">{item.marca}</div>
												<div className="text-sm text-neutral-500">{item.modelo}</div>
											</div>
										</td>
										<td className="px-6 py-4 font-mono text-sm">{item.serial}</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-2" title={calibradoTooltip}>
												{calibradoIcon}
												{item.calibrado && (
													<span className="text-sm text-neutral-500">
														{new Date(item.calibrado).toLocaleDateString()}
													</span>
												)}
											</div>
										</td>
										<td className="px-6 py-4">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800">
												{item.sede_nombre}
											</span>
										</td>
										<td className="px-6 py-4 text-right">
											<div className="flex justify-end gap-2">
												<button
													onClick={() => handleEditar(item)}
													className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors cursor-pointer"
													title="Editar"
												>
													<Pencil size={18} />
												</button>
												<button
													onClick={() => handleEliminar(item.id)}
													className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors cursor-pointer"
													title="Eliminar"
												>
													<Trash2 size={18} />
												</button>
											</div>
										</td>
									</motion.tr>
								);
							})}

							{inventarios.length === 0 && (
								<tr>
									<td colSpan="9" className="px-6 py-12 text-center">
										<div className="flex flex-col items-center justify-center gap-3 text-neutral-400">
											<PackageSearch size={48} strokeWidth={1} />
											<div className="text-lg">No se encontraron inventarios</div>
											<button
												className="mt-3 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
												onClick={() => window.location.reload()}
											>
												<RefreshCw size={16} />
												<span>Recargar datos</span>
											</button>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Paginación mejorada */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
				<div className="text-sm text-neutral-500">
					Mostrando <span className="font-medium">{inventariosPagina.length}</span> de{' '}
					<span className="font-medium">{inventarios.length}</span> resultados
				</div>

				<div className="flex gap-1">
					<button
						disabled={paginaActual === 1}
						onClick={() => setPaginaActual(1)}
						className="p-2 rounded-lg border border-neutral-200 disabled:opacity-40 hover:bg-neutral-100 transition-colors cursor-pointer"
					>
						<ChevronsLeft size={18} />
					</button>

					<button
						disabled={paginaActual === 1}
						onClick={() => setPaginaActual(paginaActual - 1)}
						className="p-2 rounded-lg border border-neutral-200 disabled:opacity-40 hover:bg-neutral-100 transition-colors cursor-pointer"
					>
						<ChevronLeft size={18} />
					</button>

					{Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
						let pageNum;
						if (totalPaginas <= 5) {
							pageNum = i + 1;
						} else if (paginaActual <= 3) {
							pageNum = i + 1;
						} else if (paginaActual >= totalPaginas - 2) {
							pageNum = totalPaginas - 4 + i;
						} else {
							pageNum = paginaActual - 2 + i;
						}

						return (
							<button
								key={pageNum}
								onClick={() => setPaginaActual(pageNum)}
								className={`w-10 h-10 rounded-lg cursor-pointer ${paginaActual === pageNum ? 'bg-indigo-600 text-white' : 'border border-neutral-200 hover:bg-neutral-100'} transition-colors`}
							>
								{pageNum}
							</button>
						);
					})}

					<button
						disabled={paginaActual === totalPaginas}
						onClick={() => setPaginaActual(paginaActual + 1)}
						className="p-2 rounded-lg border border-neutral-200 disabled:opacity-40 hover:bg-neutral-100 transition-colors cursor-pointer"
					>
						<ChevronRight size={18} />
					</button>

					<button
						disabled={paginaActual === totalPaginas}
						onClick={() => setPaginaActual(totalPaginas)}
						className="p-2 rounded-lg border border-neutral-200 disabled:opacity-40 hover:bg-neutral-100 transition-colors cursor-pointer"
					>
						<ChevronsRight size={18} />
					</button>
				</div>
			</div>
		</div>
	);
}
