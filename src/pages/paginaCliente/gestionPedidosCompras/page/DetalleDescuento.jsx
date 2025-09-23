import { useState } from "react";
import { useLocation } from "react-router-dom";
import { IMAGEN_URL } from "../../../../const/endpoint/mantenimiento_endpoint";
import {
	User,
	CreditCard,
	Phone,
	FileText,
	Calendar,
	DollarSign,
	ClipboardList,
	CheckCircle,
	Clock,
	Download,
	Printer,
	Mail,
	Signature,
	Package,
	Building,
	UserCheck,
	BarChart3,
	Users,
	FileCheck,
	ArrowLeft,
	Loader2
} from "lucide-react";
import BackPage from "../../components/BackPage";
import { exportarDescuento } from "../../../../services/cp_solicitud_descuento_services";
import Swal from "sweetalert2";
export function DetalleDescuento() {
	const { state } = useLocation();
	const descuento = state?.d;
	const [loading, setLoading] = useState(false);
	if (!descuento) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-md">
					<FileText className="mx-auto text-rose-500 mb-4" size={48} />
					<h2 className="text-xl font-semibold text-slate-800 mb-2">Información no disponible</h2>
					<p className="text-slate-500">No se encontró la información del descuento</p>
					<button
						onClick={() => window.history.back()}
						className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-2 mx-auto transition-colors"
					>
						<ArrowLeft size={18} />
						Volver atrás
					</button>
				</div>
			</div>
		);
	}

	// Helper para mostrar firma si existe
	const FirmaCard = ({ label, src, icon: Icon }) => (
		<div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-4 border border-slate-200 shadow-sm">
			<div className="flex items-center gap-2 mb-3">
				<Icon size={18} className="text-blue-600" />
				<h3 className="font-medium text-slate-800">{label}</h3>
			</div>
			{src ? (
				<div className="flex flex-col items-center">
					<img
						src={`${IMAGEN_URL}/${src}`}
						alt={`Firma ${label}`}
						className="h-24 border border-slate-200 rounded-lg bg-white p-2 object-contain"
					/>
				</div>
			) : (
				<div className="h-24 flex items-center justify-center bg-slate-100 rounded-lg border border-dashed border-slate-300">
					<span className="text-slate-400 text-sm">Firma no disponible</span>
				</div>
			)}
		</div>
	);

	const handleExportar = async () => {
		try {
			if (!descuento?.id) {
				Swal.fire({
					icon: "warning",
					title: "Ups...",
					text: "No hay un ID de descuento para exportar",
				});
				return;
			}

			setLoading(true); // 👉 activa loader
			await exportarDescuento(descuento.id);

			Swal.fire({
				icon: "success",
				title: "Exportación completa",
				text: "El archivo se exportó correctamente",
			});
		} catch (error) {
			console.error("Error exportando:", error);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Hubo un problema al exportar el descuento",
			});
		} finally {
			setLoading(false); // 👉 desactiva loader
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 py-8 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<BackPage isEdit={true} />
				<div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-slate-200">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div>
							<div className="flex items-center gap-3 mb-2">
								<div className="p-2 bg-blue-100 rounded-lg">
									<FileText size={24} className="text-blue-600" />
								</div>
								<h1 className="text-2xl font-bold text-slate-900">
									Descuento #{descuento.consecutivo}
								</h1>
							</div>
							<p className="text-slate-500">Detalles completos de la solicitud de descuento</p>
						</div>

						<div className="flex gap-2">
							<button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-colors">
								<Printer size={18} />
								Imprimir
							</button>
							<button
								onClick={handleExportar}
								disabled={loading}
								className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors 
		${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
							>
								{loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
								{loading ? "Exportando..." : "Exportar"}
							</button>

						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Información general */}
					<div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
						<div className="flex items-center gap-2 mb-5">
							<ClipboardList size={20} className="text-blue-600" />
							<h2 className="text-xl font-semibold text-slate-800">Información General</h2>
						</div>

						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<Calendar size={18} className="text-slate-400 flex-shrink-0" />
								<div>
									<p className="text-sm text-slate-500">Fecha de solicitud</p>
									<p className="font-medium text-slate-900">{descuento.fecha_solicitud}</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<User size={18} className="text-slate-400 flex-shrink-0" />
								<div>
									<p className="text-sm text-slate-500">Trabajador</p>
									<p className="font-medium text-slate-900">{descuento.trabajador_nombre}</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<CreditCard size={18} className="text-slate-400 flex-shrink-0" />
								<div>
									<p className="text-sm text-slate-500">Cédula</p>
									<p className="font-medium text-slate-900">{descuento.trabajador_cedula}</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<Phone size={18} className="text-slate-400 flex-shrink-0" />
								<div>
									<p className="text-sm text-slate-500">Teléfono</p>
									<p className="font-medium text-slate-900">{descuento.trabajador_telefono}</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<FileText size={18} className="text-slate-400 flex-shrink-0" />
								<div>
									<p className="text-sm text-slate-500">Tipo de contrato</p>
									<p className="font-medium text-slate-900">{descuento.tipo_contrato}</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<ClipboardList size={18} className="text-slate-400 flex-shrink-0" />
								<div>
									<p className="text-sm text-slate-500">Motivo</p>
									<p className="font-medium text-slate-900">{descuento.motivo_solicitud}</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<DollarSign size={18} className="text-slate-400 flex-shrink-0" />
								<div>
									<p className="text-sm text-slate-500">Valor Total</p>
									<p className="font-medium text-slate-900">
										{descuento.valor_total_descontar.toLocaleString("es-CO", {
											style: "currency",
											currency: "COP",
											minimumFractionDigits: 0
										})}
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="flex-shrink-0">
									{descuento.numero_cuotas_aprobadas === descuento.numero_cuotas ? (
										<CheckCircle size={18} className="text-green-500" />
									) : (
										<Clock size={18} className="text-amber-500" />
									)}
								</div>
								<div>
									<p className="text-sm text-slate-500">Estado de cuotas</p>
									<p className="font-medium text-slate-900">
										{descuento.numero_cuotas_aprobadas} de {descuento.numero_cuotas} aprobadas
									</p>
								</div>
							</div>

							{descuento.observaciones && (
								<div className="flex items-start gap-3 pt-3 border-t border-slate-100">
									<FileText size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
									<div>
										<p className="text-sm text-slate-500">Observaciones</p>
										<p className="font-medium text-slate-900">{descuento.observaciones}</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Firmas */}
					<div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
						<div className="flex items-center gap-2 mb-5">
							<Signature size={20} className="text-blue-600" />
							<h2 className="text-xl font-semibold text-slate-800">Firmas del documento</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FirmaCard label="Trabajador" src={descuento.firma_trabajador} icon={User} />
							<FirmaCard label="Responsable de aprobación" src={descuento.firma_responsable_aprobacion} icon={UserCheck} />
							<FirmaCard label="Jefe inmediato" src={descuento.firma_jefe_inmediato} icon={Users} />
							<FirmaCard label="Facturación" src={descuento.firma_facturacion} icon={BarChart3} />
							<FirmaCard label="Gestión financiera" src={descuento.firma_gestion_financiera} icon={DollarSign} />
							<FirmaCard label="Talento humano" src={descuento.firma_talento_humano} icon={FileCheck} />
						</div>
					</div>
				</div>

				{/* Entrega asociada */}
				{descuento.entrega ? (
					<div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mt-6">
						<div className="flex items-center gap-2 mb-5">
							<Package size={20} className="text-blue-600" />
							<h2 className="text-xl font-semibold text-slate-800">Entrega asociada</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
							<div className="flex items-center gap-3">
								<Calendar size={18} className="text-slate-400 flex-shrink-0" />
								<div>
									<p className="text-sm text-slate-500">Fecha de entrega</p>
									<p className="font-medium text-slate-900">{descuento.entrega.fecha_entrega}</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<Building size={18} className="text-slate-400 flex-shrink-0" />
								<div>
									<p className="text-sm text-slate-500">Sede</p>
									<p className="font-medium text-slate-900">{descuento.entrega.sede_nombre}</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<User size={18} className="text-slate-400 flex-shrink-0" />
								<div>
									<p className="text-sm text-slate-500">Entregado por</p>
									<p className="font-medium text-slate-900">{descuento.entrega.personal_nombre}</p>
								</div>
							</div>
						</div>

						<div>
							<h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
								<Package size={18} className="text-slate-400" />
								Ítems entregados
							</h3>

							{descuento.entrega.items?.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{descuento.entrega.items.map((item) => (
										<div key={item.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
											<p className="font-medium text-slate-900 mb-1">{item.nombre_item}</p>
											{item.es_accesorio && (
												<p className="text-sm text-slate-500">
													Accesorio: {item.accesorio_descripcion || "N/A"}
												</p>
											)}
										</div>
									))}
								</div>
							) : (
								<div className="bg-slate-50 rounded-xl p-4 text-center border border-dashed border-slate-300">
									<p className="text-slate-500">No hay ítems registrados en esta entrega</p>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 mt-6">
						<div className="flex items-center gap-2 mb-2">
							<Package size={20} className="text-slate-400" />
							<h2 className="text-xl font-semibold text-slate-800">Entrega asociada</h2>
						</div>
						<p className="text-slate-500">No hay entrega asociada a este descuento</p>
					</div>
				)}
			</div>
		</div>
	);
}