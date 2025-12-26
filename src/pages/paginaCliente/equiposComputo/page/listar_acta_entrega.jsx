import { useEffect, useState } from "react";
import { listarActaEntrega, exportActaEntrega, actualizar_firmas } from "../../../../services/pc_equipos_services";
import {
	Loader2,
	User,
	Laptop,
	Calendar,
	FileText,
	Download,
	Edit,
	CheckCircle,
	XCircle,
	Package,
	Hash,
	Fingerprint,
	Signature,
	Printer,
	Eye,
	Plus,
	Pencil,
	RotateCcw
} from "lucide-react";
import { FirmaInput } from "../../../appFirma/appFirmas";
import { IMAGEN_URL } from "../../../../const/endpoint/mantenimiento_endpoint";

const VistaActasEntrega = () => {
	const [actas, setActas] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editandoFirma, setEditandoFirma] = useState({
		id: null,
		tipo: null
	});

	const cargarActas = async () => {
		setLoading(true);
		const res = await listarActaEntrega();
		if (res.success) {
			setActas(res.data);
		} else {
			setActas([]);
		}
		setLoading(false);
	};

	useEffect(() => {
		cargarActas();
	}, []);

	const handleFirmaChange = (actaId, tipo, valor) => {
		setActas(prev => prev.map(acta =>
			acta.id === actaId
				? { ...acta, [`firma_${tipo}`]: valor }
				: acta
		));
	};

	const iniciarEdicionFirma = (actaId, tipo) => {
		setEditandoFirma({ id: actaId, tipo });
	};

	const base64ToFile = (base64) => {
		const arr = base64.split(',');
		const mime = arr[0].match(/:(.*?);/)[1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) u8arr[n] = bstr.charCodeAt(n);

		return new File([u8arr], 'firma.png', { type: mime });
	};


	const finalizarEdicionFirma = async () => {
		if (!editandoFirma.id || !editandoFirma.tipo) return;

		const acta = actas.find(a => a.id === editandoFirma.id);
		if (!acta) return;

		const formData = new FormData();
		formData.append("id", acta.id);

		if (editandoFirma.tipo === "entrega") {
			const file = base64ToFile(acta.firma_entrega);
			formData.append("firma_entrega", file);
		} else {
			const file = base64ToFile(acta.firma_recibe);
			formData.append("firma_recibe", file);
		}

		try {
			const res = await actualizar_firmas(formData);

			setActas(prev =>
				prev.map(a =>
					a.id === acta.id
						? {
							...a,
							firma_entrega: res.firma_entrega,
							firma_recibe: res.firma_recibe
						}
						: a
				)
			);

			setEditandoFirma({ id: null, tipo: null });
		} catch (e) {
			console.error(e);
			alert("Error guardando firma");
		}
	};



	const descargarActa = (acta) => {
		exportActaEntrega(acta.id);
	};


	const imprimirActa = (acta) => {
		window.print();
	};

	const verDetalles = (acta) => {
		console.log("Ver detalles acta:", acta.id);
	};

	// Formatear fecha
	const formatFecha = (fecha) => {
		if (!fecha) return "Sin fecha";
		return new Date(fecha).toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric"
		});
	};

	return (
		<div className="min-h-screen bg-slate-50/50 p-6 md:p-8 font-sans">
			<div className="max-w-7xl mx-auto">
				{/* Header Moderno */}
				<div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
							<div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
								<FileText className="w-6 h-6 text-white" />
							</div>
							Actas de Entrega
						</h1>
						<p className="text-slate-500 mt-2 text-lg font-light">
							Gestión centralizada de entregas y devoluciones de equipos
						</p>
					</div>

					{/* Stats o Filtros podrían ir aquí */}
				</div>

				{/* Loading State Refinado */}
				{loading && (
					<div className="flex flex-col items-center justify-center py-24">
						<div className="relative">
							<div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-2 h-2 bg-blue-600 rounded-full"></div>
							</div>
						</div>
						<p className="mt-4 text-slate-500 font-medium animate-pulse">Cargando información...</p>
					</div>
				)}

				{/* Empty State Moderno */}
				{!loading && actas.length === 0 && (
					<div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
						<div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
							<FileText className="w-10 h-10 text-slate-400" />
						</div>
						<h3 className="text-xl font-bold text-slate-900 mb-2">
							No se encontraron registros
						</h3>
						<p className="text-slate-500 max-w-sm mx-auto">
							Actualmente no hay actas de entrega registradas en el sistema.
						</p>
					</div>
				)}

				{/* Grid de Cards Premium */}
				{!loading && actas.length > 0 && (
					<div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
						{actas.map((acta) => (
							<div
								key={acta.id}
								className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 border border-slate-100 overflow-hidden relative"
							>
								{/* Decoración Top */}
								<div className={`absolute top-0 left-0 right-0 h-1 ${acta.devuelto ? 'bg-emerald-500' : 'bg-blue-500'}`} />

								{/* Header Card */}
								<div className="p-6 pb-4">
									<div className="flex items-start justify-between mb-4">
										<div>
											<div className="flex items-center gap-3 mb-2">
												<span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase flex items-center gap-1.5 ${acta.devuelto
														? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
														: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
													}`}>
													<span className={`w-1.5 h-1.5 rounded-full ${acta.devuelto ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
													{acta.devuelto ? 'Devuelto' : 'Activo'}
												</span>
												<span className="text-xs text-slate-400 font-mono">#{acta.id.toString().padStart(4, '0')}</span>
											</div>
											<h3 className="text-xl font-bold text-slate-800 leading-tight">
												{acta.nombre_equipo}
											</h3>
										</div>
										<div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
											<Package className="w-5 h-5 text-slate-400" />
										</div>
									</div>

									{/* Grid de Información */}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mt-6">
										{/* Columna Izquierda */}
										<div className="space-y-4">
											<div className="flex gap-3 items-start">
												<div className="mt-0.5 bg-indigo-50 p-1.5 rounded-lg shrink-0">
													<User className="w-4 h-4 text-indigo-500" />
												</div>
												<div>
													<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Funcionario</p>
													<p className="text-sm font-medium text-slate-900">{acta.funcionario_nombre}</p>
													<p className="text-xs text-slate-500 mt-0.5">CC: {acta.funcionario_cedula}</p>
												</div>
											</div>

											<div className="flex gap-3 items-start">
												<div className="mt-0.5 bg-violet-50 p-1.5 rounded-lg shrink-0">
													<Laptop className="w-4 h-4 text-violet-500" />
												</div>
												<div>
													<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Detalles Equipo</p>
													<p className="text-sm font-medium text-slate-900">{acta.equipo_marca} {acta.equipo_modelo}</p>
													<p className="text-xs text-slate-500 mt-0.5 font-mono">SN: {acta.equipo_serial}</p>
												</div>
											</div>
										</div>

										{/* Columna Derecha */}
										<div className="space-y-4">
											<div className="flex gap-3 items-start">
												<div className="mt-0.5 bg-amber-50 p-1.5 rounded-lg shrink-0">
													<Calendar className="w-4 h-4 text-amber-500" />
												</div>
												<div>
													<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Fecha Entrega</p>
													<p className="text-sm font-medium text-slate-900">{formatFecha(acta.fecha_entrega)}</p>
												</div>
											</div>

											<div className="flex gap-3 items-start">
												<div className="mt-0.5 bg-cyan-50 p-1.5 rounded-lg shrink-0">
													<Hash className="w-4 h-4 text-cyan-500" />
												</div>
												<div>
													<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Inventario</p>
													<p className="text-sm font-medium text-slate-900 font-mono">{acta.inventario_equipo}</p>
												</div>
											</div>
										</div>
									</div>

									{/* Periféricos Modernos */}
									{acta.perifericos && acta.perifericos.length > 0 && (
										<div className="mt-6 pt-4 border-t border-slate-100">
											<p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
												Periféricos Incluidos
												<span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{acta.perifericos.length}</span>
											</p>
											<div className="flex flex-wrap gap-2">
												{acta.perifericos.map((periferico, idx) => (
													<span
														key={idx}
														className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-600 border border-slate-100"
													>
														<span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
														{periferico.nombre}
														<span className="text-slate-400 ml-0.5 text-[10px]">x{periferico.cantidad}</span>
													</span>
												))}
											</div>
										</div>
									)}

									{/* Sección de Firmas Refinada */}
									<div className="mt-6">
										<div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
											<div className="grid grid-cols-2 gap-4">
												{/* Firma Entrega */}
												<div className="relative group/firma">
													<div className="flex items-center justify-between mb-2">
														<span className="text-xs font-semibold text-slate-400 uppercase">Firma Entrega</span>
														{acta.firma_entrega && <CheckCircle className="w-3 h-3 text-emerald-500" />}
													</div>

													{editandoFirma.id === acta.id && editandoFirma.tipo === "entrega" ? (
														<div className="bg-white p-2 rounded-lg shadow-lg border border-slate-200 absolute bottom-0 left-0 right-0 z-10 animate-in fade-in zoom-in-95 duration-200">
															<FirmaInput
																value={acta.firma_entrega || ""}
																onChange={(value) => handleFirmaChange(acta.id, "entrega", value)}
																label=""
																size="small"
															/>
															<div className="flex gap-2 mt-2">
																<button
																	onClick={finalizarEdicionFirma}
																	className="flex-1 bg-slate-900 text-white py-1.5 rounded-md text-xs font-medium hover:bg-slate-800"
																>
																	Guardar
																</button>
																<button
																	onClick={() => setEditandoFirma({ id: null, tipo: null })}
																	className="flex-1 bg-slate-100 text-slate-600 py-1.5 rounded-md text-xs font-medium hover:bg-slate-200"
																>
																	Cancelar
																</button>
															</div>
														</div>
													) : (
														<div
															className="bg-white rounded-lg border border-slate-200 h-16 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all relative overflow-hidden group-hover/card:bg-white"
															onClick={() => iniciarEdicionFirma(acta.id, "entrega")}
														>
															{acta.firma_entrega ? (
																<img
																	src={`${IMAGEN_URL}${acta.firma_entrega}`}
																	alt="Firma entrega"
																	className="h-full w-auto object-contain mix-blend-multiply opacity-90"
																/>
															) : (
																<div className="flex flex-col items-center gap-1 text-slate-300 group-hover/firma:text-blue-400 transition-colors">
																	<Plus className="w-5 h-5" />
																	<span className="text-[10px] font-medium">Agregar</span>
																</div>
															)}
														</div>
													)}
												</div>

												{/* Firma Recibe */}
												<div className="relative group/firma">
													<div className="flex items-center justify-between mb-2">
														<span className="text-xs font-semibold text-slate-400 uppercase">Firma Recibe</span>
														{acta.firma_recibe && <CheckCircle className="w-3 h-3 text-emerald-500" />}
													</div>

													{editandoFirma.id === acta.id && editandoFirma.tipo === "recibe" ? (
														<div className="bg-white p-2 rounded-lg shadow-lg border border-slate-200 absolute bottom-0 left-0 right-0 z-10 animate-in fade-in zoom-in-95 duration-200">
															<FirmaInput
																value={acta.firma_recibe || ""}
																onChange={(value) => handleFirmaChange(acta.id, "recibe", value)}
																label=""
																size="small"
															/>
															<div className="flex gap-2 mt-2">
																<button
																	onClick={finalizarEdicionFirma}
																	className="flex-1 bg-slate-900 text-white py-1.5 rounded-md text-xs font-medium hover:bg-slate-800"
																>
																	Guardar
																</button>
																<button
																	onClick={() => setEditandoFirma({ id: null, tipo: null })}
																	className="flex-1 bg-slate-100 text-slate-600 py-1.5 rounded-md text-xs font-medium hover:bg-slate-200"
																>
																	Cancelar
																</button>
															</div>
														</div>
													) : (
														<div
															className="bg-white rounded-lg border border-slate-200 h-16 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all relative overflow-hidden"
															onClick={() => iniciarEdicionFirma(acta.id, "recibe")}
														>
															{acta.firma_recibe ? (
																<img
																	src={`${IMAGEN_URL}${acta.firma_recibe}`}
																	alt="Firma recibe"
																	className="h-full w-auto object-contain mix-blend-multiply opacity-90"
																/>
															) : (
																<div className="flex flex-col items-center gap-1 text-slate-300 group-hover/firma:text-blue-400 transition-colors">
																	<Plus className="w-5 h-5" />
																	<span className="text-[10px] font-medium">Agregar</span>
																</div>
															)}
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Footer de Acciones Premium */}
								<div className="bg-slate-50/50 p-4 border-t border-slate-100 flex flex-wrap gap-3 items-center justify-between">
									<div className="flex gap-2">
										<button
											onClick={() => verDetalles(acta)}
											className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
											title="Ver detalles"
										>
											<Eye className="w-4 h-4" />
										</button>
										<button
											onClick={() => descargarActa(acta)}
											className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
											title="Descargar PDF"
										>
											<Download className="w-4 h-4" />
										</button>
										<button
											onClick={() => imprimirActa(acta)}
											className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
											title="Imprimir"
										>
											<Printer className="w-4 h-4" />
										</button>
									</div>

									<button
										onClick={() => alert("Funcionalidad en desarrollo")}
										className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-rose-600 text-white rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-medium text-sm group/btn"
									>
										<RotateCcw className="w-4 h-4 group-hover/btn:-rotate-180 transition-transform duration-500" />
										<span>Devolver Equipo</span>
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default VistaActasEntrega;