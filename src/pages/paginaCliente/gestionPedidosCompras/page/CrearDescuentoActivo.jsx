import React, { useState, useEffect } from 'react';
import {
	User, FileText, Calendar, DollarSign,
	ClipboardList, PenTool, BadgeCheck,
	FileCheck, Send, Building, Users,
	Signature, Calculator, Clock
} from 'lucide-react';
import { FirmaInput } from '../../../appFirma/appFirmas';
import BuscarResponsable from '../../componentsUnive/BuscarResponsable';
import { crear_descuento, subirFirmaDescuento } from '../../../../services/cp_solicitud_descuento_services';
import { useLocation, useNavigate } from 'react-router-dom';
import BackPage from '../../components/BackPage';
import Swal from "sweetalert2";
import { useApp } from '../../../../store/AppContext';
import { IMAGEN_URL } from '../../../../const/endpoint/mantenimiento_endpoint';
const CrearDescuentoActivo = () => {
	const { usuario } = useApp();
	const navigate = useNavigate();
	const [currentDate, setCurrentDate] = useState("");
	const { state } = useLocation();
	const data = state?.entrega || state?.d || {};

	const formatFirma = (firma) => firma ? `${IMAGEN_URL}${firma}` : null;

	const [formData, setFormData] = useState({
		id: data?.id || "",
		usuario_id: usuario.id,
		entrega_fijos_id: data?.entrega_id || data?.entrega_fijos_id || "",
		consecutivo: data?.consecutivo || "1",
		fecha_solicitud: data?.fecha_solicitud || "",
		trabajador_id: data?.personal_id || data?.trabajador_id || "",
		tipo_contrato: data?.tipo_contrato || "",
		motivo_solicitud: data?.motivo_solicitud || "",
		valor_total_descontar: data?.valor_total_descontar || "",
		numero_cuotas: data?.numero_cuotas || "",
		numero_cuotas_aprobadas: data?.numero_cuotas_aprobadas || "",
		personal_responsable_aprobacion: data?.personal_responsable_aprobacion || "",
		jefe_inmediato_id: data?.jefe_inmediato_id || "",
		personal_facturacion: data?.personal_facturacion || "",
		personal_gestion_financiera: data?.personal_gestion_financiera || "",
		personal_talento_humano: data?.personal_talento_humano || "",
		observaciones: data?.observaciones || "",

		firma_trabajador: formatFirma(data?.firma_trabajador),
		firma_responsable_aprobacion: formatFirma(data?.firma_responsable_aprobacion),
		firma_jefe_inmediato: formatFirma(data?.firma_jefe_inmediato),
		firma_facturacion: formatFirma(data?.firma_facturacion),
		firma_gestion_financiera: formatFirma(data?.firma_gestion_financiera),
		firma_talento_humano: formatFirma(data?.firma_talento_humano),
	});

	function base64ToBlob(base64) {
		const byteString = atob(base64.split(",")[1]);
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: "image/png" });
	}


	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		setCurrentDate(today);
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Función helper: convierte "" a null o a número válido
			const sanitizeNumber = (val) => val === "" || val === null ? null : Number(val);

			const payload = {
				...formData,
				fecha_solicitud: currentDate,
				valor_total_descontar: sanitizeNumber(formData.valor_total_descontar),
				numero_cuotas: sanitizeNumber(formData.numero_cuotas),
				numero_cuotas_aprobadas: sanitizeNumber(formData.numero_cuotas_aprobadas),
				personal_responsable_aprobacion: sanitizeNumber(formData.personal_responsable_aprobacion),
				jefe_inmediato_id: sanitizeNumber(formData.jefe_inmediato_id),
				personal_facturacion: sanitizeNumber(formData.personal_facturacion),
				personal_gestion_financiera: sanitizeNumber(formData.personal_gestion_financiera),
				personal_talento_humano: sanitizeNumber(formData.personal_talento_humano),
			};
			// console.log(payload)
			const res = await crear_descuento(payload);
			if (!res?.id) {
				Swal.fire("Error", "Error al crear la solicitud", "error");
				return;
			}

			const firmas = [
				{ field: "firma_trabajador", file: formData.firma_trabajador },
				{ field: "firma_jefe_inmediato", file: formData.firma_jefe_inmediato },
				{ field: "firma_responsable_aprobacion", file: formData.firma_responsable_aprobacion },
				{ field: "firma_facturacion", file: formData.firma_facturacion },
				{ field: "firma_gestion_financiera", file: formData.firma_gestion_financiera },
				{ field: "firma_talento_humano", file: formData.firma_talento_humano },
			];

			for (const f of firmas) {
				if (f.file) {
					// Si la firma empieza por "http" asumimos que ya está en servidor
					if (typeof f.file === "string" && f.file.startsWith("http")) {
						continue; // 👈 no la vuelves a subir
					}

					// Caso normal: base64 recién creada
					const blob = base64ToBlob(f.file);
					const fd = new FormData();
					fd.append("usuario_id", formData.usuario_id);
					fd.append("id_solicitud", res.id);
					fd.append("tipo_firma", f.field);
					fd.append("firma", blob, `${f.field}.png`);

					await subirFirmaDescuento(fd);
				}
			}


			Swal.fire({
				title: "¡Éxito!",
				text: "Solicitud creada correctamente ✅",
				icon: "success",
				confirmButtonText: "Ok",
			}).then(() => {
				navigate(-1);
			});

		} catch (error) {
			console.error("Error al enviar solicitud:", error);

			const mensaje =
				error.response?.data?.message || "Ocurrió un error inesperado";

			Swal.fire("Error", mensaje, "error");
		}
	};


	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
			<BackPage isEdit={true} />
			<div className="w-2/3 mx-auto">
				{/* Header */}
				<div className="mb-10 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
					<div className="flex items-start gap-4">
						<div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-md flex-shrink-0">
							<FileText className="h-12 w-12 text-white" />
						</div>

						<div className="flex-1">
							<h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
								Solicitud de Descuento por Daños y Pérdidas
							</h1>
							<p className="text-slate-600 mb-3">
								Complete la información requerida para procesar su solicitud
							</p>
							<div className="inline-flex items-center gap-2 text-slate-500 bg-slate-100 px-3 py-2 rounded-lg">
								<Calendar className="h-4 w-4" />
								<span className="text-sm font-medium">{currentDate}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="mb-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
					<div className="flex flex-col md:flex-row gap-5">
						<div className="flex justify-center md:justify-start">
							<div className="bg-blue-50 p-4 rounded-xl h-fit">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
						</div>

						<div className="flex-1">
							<p className="text-slate-700 text-justify leading-relaxed">
								Por medio del presente documento, solicito comedidamente la aprobación de
								<span className="font-semibold text-blue-700"> crédito y/o descuento </span>
								de acuerdo a la modalidad de contratación, destinado a cubrir los
								<span className="font-semibold"> daños o pérdida de activos fijos </span>
								suministrados para realizar mi labor en la
								<span className="font-semibold text-indigo-700"> IPS CLINICAL HOUSE</span>,
								detallando a continuación:
							</p>

							<div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-sm text-slate-500">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<span>Esta solicitud será revisada y procesada según los lineamientos establecidos</span>
							</div>
						</div>
					</div>
				</div>


				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Sección 1: Datos del Trabajador */}
					<div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
						<h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center">
							<span className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
								<User className="h-5 w-5" />
							</span>
							Información del Trabajador
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Trabajador</label>
								<div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
									<User className="h-4 w-4 text-slate-500" />
									<span className="text-slate-800">
										{data?.personal_nombre || data?.trabajador_nombre || "—"}
									</span>

								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">Número de Documento</label>
								<div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
									<FileText className="h-4 w-4 text-slate-500" />
									<span className="text-slate-800">{data?.personal_cedula || data?.trabajador_cedula || "-"}</span>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1">
									Fecha de Solicitud
								</label>
								<div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
									<Calendar className="h-4 w-4 text-slate-500" />
									<input
										type="date"
										value={currentDate}
										readOnly
										className="bg-slate-50 text-slate-800 border-none focus:ring-0 p-0"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
									<ClipboardList className="h-4 w-4" />
									Tipo de Contrato *
								</label>
								<div className="relative">
									<select
										name="tipo_contrato"
										value={formData.tipo_contrato}
										onChange={handleChange}
										className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
									>
										<option value="">Seleccione una opción</option>
										<option value="NOMINA">NÓMINA</option>
										<option value="OPS">OPS</option>
									</select>
									<ClipboardList className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
								</div>
							</div>
						</div>
					</div>

					{/* Sección 2: Solicitud de Descuento */}
					<div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
						<h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center">
							<span className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
								<DollarSign className="h-5 w-5" />
							</span>
							Detalles de la Solicitud
						</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
									<PenTool className="h-4 w-4" />
									Motivo de la Solicitud *
								</label>
								<textarea
									name="motivo_solicitud"
									value={formData.motivo_solicitud}
									onChange={handleChange}
									rows={3}
									className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Describa el motivo de la solicitud de descuento..."

								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
										<DollarSign className="h-4 w-4" />
										Valor Total a Descontar *
									</label>
									<div className="relative">
										<DollarSign className="absolute left-3 top-3 text-slate-500 h-5 w-5" />
										<input
											type="number"
											name="valor_total_descontar"
											value={formData.valor_total_descontar}
											onChange={handleChange}
											className="w-full pl-10 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
											placeholder="0.00"
											min="0"
											step="0.01"

										/>
									</div>
								</div>
							</div>

						</div>
						<div className="bg-blue-50 rounded-xl p-5 border border-blue-200 mt-6">
							<div className="flex items-start gap-3">
								<div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
									</svg>
								</div>
								<div>
									<h3 className="font-medium text-blue-800 mb-2">Autorización de Descuento</h3>
									<p className="text-sm text-blue-700 leading-relaxed">
										AUTORIZO A LA IPS PARA QUE PUEDA DESCONTAR DE MIS PRESTACIONES SOCIALES Y DEMÁS PAGOS
										LABORALES DEL MONTO DE LO QUE LLEGUE A ADEUDAR AL MOMENTO DE LA TERMINACIÓN DE LA
										RELACIÓN LABORAL O FINALIZACIÓN DE CONTRATO DE PRESTACIÓN DE SERVICIOS.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Sección 3: Firmas Trabajador y Jefe */}
					<div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
						<h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center">
							<span className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
								<Signature className="h-5 w-5" />
							</span>
							Autorizaciones
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<FirmaInput
									value={formData.firma_trabajador}
									onChange={(value) => setFormData({ ...formData, firma_trabajador: value })}
									label="Firma del Trabajador *"
									icon={<User className="h-4 w-4" />}
								/>
							</div>

							<div>
								<FirmaInput
									value={formData.firma_jefe_inmediato}
									onChange={(value) => setFormData({ ...formData, firma_jefe_inmediato: value })}
									label="Firma del Jefe Inmediato *"
									icon={<Users className="h-4 w-4" />}
								/>
							</div>
						</div>

						<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
									<Calculator className="h-4 w-4" />
									Número de Cuotas Solicitadas *
								</label>
								<input
									type="number"
									name="numero_cuotas"
									value={formData.numero_cuotas}
									onChange={handleChange}
									className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Ej: 12"
									min="1"

								/>
							</div>
							<div>
								<BuscarResponsable
									name="jefe_inmediato_id"
									value={formData.jefe_inmediato_id}
									onChange={handleChange}
									label="Jefe Inmediato"
								/>
							</div>
						</div>
					</div>

					{/* Sección 4: Aprobación */}
					<div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
						<h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center">
							<span className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
								<BadgeCheck className="h-5 w-5" />
							</span>
							Aprobación
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
									<Calculator className="h-4 w-4" />
									Número de Cuotas Aprobadas *
								</label>
								<input
									type="number"
									name="numero_cuotas_aprobadas"
									value={formData.numero_cuotas_aprobadas}
									onChange={handleChange}
									className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="Ej: 10"
									min="1"

								/>
							</div>

							<div>
								<BuscarResponsable
									name="personal_responsable_aprobacion"
									value={formData.personal_responsable_aprobacion}
									onChange={handleChange}
									label="Responsable"
								/>
							</div>
						</div>

						<div className="mt-6">
							<FirmaInput
								value={formData.firma_responsable_aprobacion}
								onChange={(value) => setFormData({ ...formData, firma_responsable_aprobacion: value })}
								label="Firma de Aprobación *"
								icon={<Signature className="h-4 w-4" />}
							/>
						</div>
					</div>

					{/* Sección 5: Procesamiento Posterior */}
					<div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
						<h2 className="text-xl font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200 flex items-center">
							<span className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
								<FileCheck className="h-5 w-5" />
							</span>
							Procesamiento Posterior
						</h2>

						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<FirmaInput
										value={formData.firma_facturacion}
										onChange={(value) => setFormData({ ...formData, firma_facturacion: value })}
										label="Firma de Facturación"
										icon={<Building className="h-4 w-4" />}
									/>
									<BuscarResponsable
										name="personal_facturacion"
										value={formData.personal_facturacion}
										onChange={handleChange}
										label="Facturador"
									/>
								</div>

								<div>
									<FirmaInput
										value={formData.firma_gestion_financiera}
										onChange={(value) => setFormData({ ...formData, firma_gestion_financiera: value })}
										label="Firma de Gestión Financiera"
										icon={<DollarSign className="h-4 w-4" />}
									/>
									<BuscarResponsable
										name="personal_gestion_financiera"
										value={formData.personal_gestion_financiera}
										onChange={handleChange}
										label="Gestion Financiera"
									/>
								</div>
							</div>

							<div>
								<FirmaInput
									value={formData.firma_talento_humano}
									onChange={(value) => setFormData({ ...formData, firma_talento_humano: value })}
									label="Firma de Talento Humano"
									icon={<Users className="h-4 w-4" />}
								/>
								<BuscarResponsable
									name="personal_talento_humano"
									value={formData.personal_talento_humano}
									onChange={handleChange}
									label="Talento Humano"
								/>
							</div>
						</div>
						<div className="mt-6">
							<label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
								</svg>
								Observaciones
							</label>

							<p className="text-xs text-slate-500 mt-1">Opcional: Agregue información adicional que considere relevante</p>
						</div>
					</div>

					{/* Botón de envío */}
					<div className="flex justify-center mt-8">
						<button
							type="submit"
							className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2"
						>
							<Send className="h-5 w-5" />
							Enviar Solicitud de Descuento
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CrearDescuentoActivo;