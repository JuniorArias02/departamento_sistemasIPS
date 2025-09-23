import { useEffect, useState } from "react";
import { obtenerListadoDescuento } from "../../../../services/cp_solicitud_descuento_services";
import {
	User,
	CreditCard,
	FileText,
	Calendar,
	DollarSign,
	Edit3,
	MoreVertical,
	TrendingDown,
	CheckCircle,
	Clock,
	Search,
	Filter,
	Download,
	ChevronDown
} from "lucide-react";
import { formatearFecha } from "../../../../hook/Date";
import { RUTAS } from "../../../../const/routers/routers";
import { useNavigate } from "react-router-dom";
export function InformeDescuento() {
	const navigate = useNavigate();
	const [descuentos, setDescuentos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("todos");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await obtenerListadoDescuento();
				if (res.success) {
					setDescuentos(res.data);
				}
			} catch (error) {
				console.error("Error cargando descuentos", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	// Filtrar descuentos según búsqueda y filtro
	const filteredDescuentos = descuentos.filter(d => {
		const matchesSearch = d.trabajador_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
			d.trabajador_cedula.includes(searchTerm);

		if (filterStatus === "todos") return matchesSearch;
		if (filterStatus === "completos") return matchesSearch && d.numero_cuotas_aprobadas === d.numero_cuotas;
		if (filterStatus === "pendientes") return matchesSearch && d.numero_cuotas_aprobadas < d.numero_cuotas;

		return matchesSearch;
	});

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-pulse flex flex-col items-center">
					<div className="rounded-full bg-slate-200 h-12 w-12 mb-4"></div>
					<div className="h-4 bg-slate-200 rounded w-32"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
				<div>
					<h1 className="text-3xl font-bold text-slate-900 mb-2">Informe de Descuentos</h1>
					<p className="text-slate-500">Gestiona y revisa todos los descuentos aplicados</p>
				</div>

				<button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 transition-colors shadow-md hover:shadow-lg">
					<Download size={18} />
					Exportar reporte
				</button>
			</div>

			{/* Filtros y búsqueda */}
			<div className="bg-white rounded-2xl p-4 shadow-sm mb-6 border border-slate-100">
				<div className="flex flex-col md:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
						<input
							type="text"
							placeholder="Buscar por nombre o cédula..."
							className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<div className="flex gap-2">
						<div className="relative">
							<select
								className="appearance-none pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
								value={filterStatus}
								onChange={(e) => setFilterStatus(e.target.value)}
							>
								<option value="todos">Todos los estados</option>
								<option value="completos">Completados</option>
								<option value="pendientes">Pendientes</option>
							</select>
							<Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
							<ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
						</div>
					</div>
				</div>
			</div>

			{/* Cards de descuentos */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{filteredDescuentos.length > 0 ? (
					filteredDescuentos.map((d) => (
						<div key={d.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
							{/* Header */}
							<div className="flex justify-between items-start mb-4">
								<div className="flex items-center gap-2">
									<div className={`p-2 rounded-lg ${d.numero_cuotas_aprobadas === d.numero_cuotas ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
										<TrendingDown size={18} />
									</div>
									<span className="text-sm font-medium text-slate-500">#{d.consecutivo}</span>
								</div>

								<div className="flex gap-1">
									<button
										onClick={() => navigate(RUTAS.USER.GESTION_COMPRAS.CREAR_DESCUENTO_FIJOS, {
											state: { d }
										})}
										className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
										<Edit3 size={16} />
									</button>
									<button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
										<MoreVertical size={16} />
									</button>
								</div>
							</div>

							{/* Información del trabajador */}
							<div className="mb-5">
								<div className="flex items-center gap-3 mb-2">
									<div className="p-2 bg-slate-100 rounded-lg">
										<User size={16} className="text-slate-600" />
									</div>
									<div>
										<h3 className="font-semibold text-slate-900">{d.trabajador_nombre}</h3>
										<div className="flex items-center gap-1 text-slate-500 text-sm">
											<CreditCard size={14} />
											<span>{d.trabajador_cedula}</span>
										</div>
									</div>
								</div>

								<div className="flex items-center gap-2 text-slate-600 text-sm mt-3">
									<FileText size={14} className="text-slate-400" />
									<span>{d.tipo_contrato}</span>
								</div>
							</div>

							{/* Detalles del descuento */}
							<div className="bg-slate-50 rounded-xl p-4 mb-5">
								<div className="grid grid-cols-2 gap-3">
									<div>
										<p className="text-xs text-slate-500 mb-1">Valor total</p>
										<p className="font-semibold text-slate-900">
											{(d.valor_total_descontar ?? 0).toLocaleString("es-CO", {
												style: "currency",
												currency: "COP",
												minimumFractionDigits: 0
											})}
										</p>

									</div>

									<div>
										<p className="text-xs text-slate-500 mb-1">Motivo</p>
										<p className="font-medium text-slate-900 text-sm truncate" title={d.motivo_solicitud}>
											{d.motivo_solicitud}
										</p>
									</div>
								</div>

								<div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200">
									<div>
										<p className="text-xs text-slate-500 mb-1">Cuotas</p>
										<p className="font-medium text-slate-900">{d.numero_cuotas_aprobadas}/{d.numero_cuotas}</p>
									</div>

									<div className={`flex items-center gap-1 ${d.numero_cuotas_aprobadas === d.numero_cuotas ? 'text-green-600' : 'text-amber-600'}`}>
										{d.numero_cuotas_aprobadas === d.numero_cuotas ? (
											<CheckCircle size={14} />
										) : (
											<Clock size={14} />
										)}
										<span className="text-xs font-medium">
											{d.numero_cuotas_aprobadas === d.numero_cuotas ? 'Completado' : 'Pendiente'}
										</span>
									</div>
								</div>
							</div>

							{/* Footer */}
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-1 text-slate-500 text-sm">
									<Calendar size={14} />
									<span>{formatearFecha(d.fecha_solicitud)}</span>
								</div>

								<button
									onClick={() => navigate(RUTAS.USER.GESTION_COMPRAS.INFORME_DESCUENTO_DETALLES, {
										state: { d }
									})}
									className="text-sm font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
									Ver detalles
								</button>
							</div>
						</div>
					))
				) : (
					<div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
						<FileText className="mx-auto text-slate-300 mb-3" size={40} />
						<h3 className="text-lg font-medium text-slate-500 mb-1">No hay descuentos registrados</h3>
						<p className="text-slate-400">No se encontraron resultados para tu búsqueda</p>
					</div>
				)}
			</div>
		</div>
	);
}