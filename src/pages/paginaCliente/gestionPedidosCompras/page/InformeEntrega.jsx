import { useEffect, useState } from "react";
import { obtenerEntregaSolicitud, exportarInformeEntregaSolicitudes } from "../../../../services/cp_entrega_solicitud_services";
import {
	FileText,
	Download,
	Search,
	Filter,
	ChevronDown,
	ChevronUp,
	Calendar,
	User,
	FileDigit,
	ClipboardList,
	MessageSquare,
	Signature,
	Receipt,
	Loader2
} from "lucide-react";
import { URL_IMAGE } from "../../../../const/api";
import Swal from "sweetalert2";

export function InformeEntrega() {
	const [entregas, setEntregas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [exporting, setExporting] = useState(false);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await obtenerEntregaSolicitud();
				setEntregas(data.data);
			} catch (error) {
				console.error("Error al cargar entregas:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Filtrar entregas basado en el término de búsqueda
	const filteredEntregas = entregas.filter(entrega =>
		Object.values(entrega).some(value =>
			value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	// Ordenar entregas
	const sortedEntregas = [...filteredEntregas].sort((a, b) => {
		if (!sortConfig.key) return 0;

		if (a[sortConfig.key] < b[sortConfig.key]) {
			return sortConfig.direction === 'ascending' ? -1 : 1;
		}
		if (a[sortConfig.key] > b[sortConfig.key]) {
			return sortConfig.direction === 'ascending' ? 1 : -1;
		}
		return 0;
	});

	// Paginación
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentEntregas = sortedEntregas.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(sortedEntregas.length / itemsPerPage);

	const handleSort = (key) => {
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	};

	const handleExport = async () => {
		setExporting(true);
		try {
			await exportarInformeEntregaSolicitudes({});
			Swal.fire({
				icon: "success",
				title: "Exportación completada",
				text: "El informe fue exportado correctamente 🚀",
				timer: 2000,
				showConfirmButton: false,
			});
		} catch (err) {
			console.error("Error al exportar:", err);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Ocurrió un error al exportar el informe 😢",
			});
		} finally {
			setExporting(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Cargando entregas...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="mx-auto">
				<div className="bg-white rounded-xl shadow-sm p-6 mb-6">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-gray-100">
						<div className="flex items-start gap-4">
							<div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
								<FileText className="h-7 w-7 text-blue-600" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-800">
									Control de entrega de Solicitudes de Pedidos
								</h1>
								<div className="flex items-center gap-2 mt-2">
									<span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
										{entregas.length}
									</span>
									<span className="text-gray-500 text-sm">
										{entregas.length === 1 ? 'entrega registrada' : 'entregas registradas'}
									</span>
								</div>
							</div>
						</div>

						<button
							onClick={handleExport}
							disabled={exporting}
							className="flex items-center px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg min-w-[120px] justify-center"
						>
							{exporting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Exportando...
								</>
							) : (
								<>
									<Download className="h-4 w-4 mr-2" />
									Exportar
								</>
							)}
						</button>
					</div>
					<div className="flex flex-col sm:flex-row gap-4 mb-6">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<input
								type="text"
								placeholder="Buscar en todas las entregas..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>

						<div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hidden">
							<Filter className="h-4 w-4 mr-2" />
							<span>Filtros</span>
						</div>
					</div>

					<div className="overflow-x-auto rounded-lg border border-gray-200">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
										onClick={() => handleSort('consecutivo')}
									>
										<div className="flex items-center">
											<FileDigit className="h-4 w-4 mr-1" />
											Consecutivo
											{sortConfig.key === 'consecutivo' && (
												sortConfig.direction === 'ascending' ?
													<ChevronUp className="h-4 w-4 ml-1" /> :
													<ChevronDown className="h-4 w-4 ml-1" />
											)}
										</div>
									</th>
									<th
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
										onClick={() => handleSort('proceso_solicitante')}
									>
										<div className="flex items-center">
											<User className="h-4 w-4 mr-1" />
											Proceso Solicitante
											{sortConfig.key === 'proceso_solicitante' && (
												sortConfig.direction === 'ascending' ?
													<ChevronUp className="h-4 w-4 ml-1" /> :
													<ChevronDown className="h-4 w-4 ml-1" />
											)}
										</div>
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										<div className="flex items-center">
											<MessageSquare className="h-4 w-4 mr-1" />
											Observación
										</div>
									</th>
									<th
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
										onClick={() => handleSort('total_items')}
									>
										<div className="flex items-center">
											<ClipboardList className="h-4 w-4 mr-1" />
											Total Items
											{sortConfig.key === 'total_items' && (
												sortConfig.direction === 'ascending' ?
													<ChevronUp className="h-4 w-4 ml-1" /> :
													<ChevronDown className="h-4 w-4 ml-1" />
											)}
										</div>
									</th>
									<th
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
										onClick={() => handleSort('fecha_entrega')}
									>
										<div className="flex items-center">
											<Calendar className="h-4 w-4 mr-1" />
											Fecha Entrega
											{sortConfig.key === 'fecha_entrega' && (
												sortConfig.direction === 'ascending' ?
													<ChevronUp className="h-4 w-4 ml-1" /> :
													<ChevronDown className="h-4 w-4 ml-1" />
											)}
										</div>
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										<div className="flex items-center">
											<Signature className="h-4 w-4 mr-1" />
											Firma
										</div>
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										<div className="flex items-center">
											<Receipt className="h-4 w-4 mr-1" />
											Factura Proveedor
										</div>
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{currentEntregas.length > 0 ? (
									currentEntregas.map((entrega, idx) => (
										<tr key={idx} className="hover:bg-gray-50 transition-colors">
											<td className="px-6 py-4 whitespace-nowrap">
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
													{entrega.consecutivo}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												{entrega.proceso_solicitante}
											</td>
											<td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
												{entrega.observacion || <span className="text-gray-400">Sin observación</span>}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 font-medium">
													{entrega.total_items}
												</span>
											</td>
											<td className="px-4 py-2">
												{(() => {
													const [year, month, day] = entrega.fecha_entrega.split("-");
													return `${day}/${month}/${year}`;
												})()}
											</td>
											<td className="px-4 py-2">
												{entrega.firma_quien_recibe ? (
													<img
														src={`${URL_IMAGE}/${entrega.firma_quien_recibe.replace("public/", "")}`}
														alt="Firma"
														className="h-16 object-contain"
													/>
												) : (
													<span>Sin firma</span>
												)}
											</td>

											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												{entrega.factura_proveedor || <span className="text-gray-400">No registrada</span>}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="7" className="px-6 py-12 text-center">
											<div className="flex flex-col items-center justify-center text-gray-400">
												<FileText className="h-12 w-12 mb-2 opacity-50" />
												<p className="text-lg font-medium">No se encontraron entregas</p>
												<p className="text-sm">
													{searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay entregas disponibles'}
												</p>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Paginación */}
					{sortedEntregas.length > itemsPerPage && (
						<div className="flex items-center justify-between mt-6">
							<div className="text-sm text-gray-700">
								Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, sortedEntregas.length)} de {sortedEntregas.length} resultados
							</div>
							<div className="flex space-x-2">
								<button
									onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
									disabled={currentPage === 1}
									className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
								>
									Anterior
								</button>

								{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
									<button
										key={page}
										onClick={() => setCurrentPage(page)}
										className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
									>
										{page}
									</button>
								))}

								<button
									onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
									disabled={currentPage === totalPages}
									className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
								>
									Siguiente
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}