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
	Pencil
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
		<div className="p-4 bg-gray-50 min-h-screen">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
						<FileText className="w-7 h-7 text-blue-600" />
						Actas de Entrega
					</h1>
					<p className="text-gray-600">
						Visualiza y gestiona todas las actas de entrega de equipos
					</p>
				</div>

				{/* Loading */}
				{loading && (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
						<p className="text-gray-600">Cargando actas...</p>
					</div>
				)}

				{/* Sin resultados */}
				{!loading && actas.length === 0 && (
					<div className="text-center py-12 bg-white rounded-xl border">
						<FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
						<h3 className="text-lg font-semibold text-gray-700 mb-1">
							No hay actas registradas
						</h3>
						<p className="text-gray-500">
							No se encontraron actas de entrega en el sistema.
						</p>
					</div>
				)}

				{/* Grid de Cartas - SOLO 2 COLUMNAS */}
				{!loading && actas.length > 0 && (
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{actas.map((acta) => (
							<div
								key={acta.id}
								className="bg-white rounded-xl border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200"
							>
								{/* Header compacto */}
								<div className="p-4 border-b bg-gray-50">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className={`px-2 py-1 rounded text-xs font-medium ${acta.devuelto ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
												{acta.devuelto ? 'DEVUELTO' : 'ACTIVO'}
											</div>
											<span className="text-sm text-gray-500">ID: {acta.id}</span>
										</div>
										<Package className="w-5 h-5 text-gray-400" />
									</div>
									<h3 className="font-bold text-gray-800 mt-2">
										{acta.nombre_equipo}
									</h3>
								</div>

								{/* Contenido principal */}
								<div className="p-4">
									{/* Información básica en 2 columnas */}
									<div className="grid grid-cols-2 gap-4 mb-4">
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<User className="w-4 h-4 text-gray-500" />
												<span className="text-sm font-medium text-gray-700">Funcionario</span>
											</div>
											<div className="ml-6">
												<p className="text-sm text-gray-800">{acta.funcionario_nombre}</p>
												<p className="text-xs text-gray-500">CC: {acta.funcionario_cedula}</p>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<Laptop className="w-4 h-4 text-gray-500" />
												<span className="text-sm font-medium text-gray-700">Equipo</span>
											</div>
											<div className="ml-6">
												<p className="text-sm text-gray-800">
													{acta.equipo_marca} {acta.equipo_modelo}
												</p>
												<p className="text-xs text-gray-500">Serial: {acta.equipo_serial}</p>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<Calendar className="w-4 h-4 text-gray-500" />
												<span className="text-sm font-medium text-gray-700">Fecha</span>
											</div>
											<div className="ml-6">
												<p className="text-sm text-gray-800">{formatFecha(acta.fecha_entrega)}</p>
											</div>
										</div>

										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<Hash className="w-4 h-4 text-gray-500" />
												<span className="text-sm font-medium text-gray-700">Inventario</span>
											</div>
											<div className="ml-6">
												<p className="text-sm text-gray-800">{acta.inventario_equipo}</p>
											</div>
										</div>
									</div>

									{/* Periféricos compactos */}
									{acta.perifericos && acta.perifericos.length > 0 && (
										<div className="mb-4 p-3 bg-gray-50 rounded-lg">
											<div className="flex items-center gap-2 mb-2">
												<Package className="w-4 h-4 text-gray-500" />
												<span className="text-sm font-medium text-gray-700">Periféricos</span>
												<span className="text-xs text-gray-500 ml-auto">
													({acta.perifericos.length})
												</span>
											</div>
											<div className="flex flex-wrap gap-2">
												{acta.perifericos.slice(0, 3).map((periferico, idx) => (
													<span
														key={idx}
														className="text-xs bg-white px-2 py-1 rounded border"
													>
														{periferico.nombre} x{periferico.cantidad}
													</span>
												))}
												{acta.perifericos.length > 3 && (
													<span className="text-xs text-gray-500">
														+{acta.perifericos.length - 3} más
													</span>
												)}
											</div>
										</div>
									)}

									{/* Firmas simplificadas */}
									<div className="mb-4">
										<div className="flex items-center gap-2 mb-3">
											<Fingerprint className="w-4 h-4 text-gray-500" />
											<span className="text-sm font-medium text-gray-700">Firmas</span>
										</div>

										<div className="grid grid-cols-2 gap-3">

											{/* Firma Entrega */}
											<div className="border rounded-lg p-3">
												<div className="flex items-center justify-between mb-2">
													<div className="flex items-center gap-1">
														<Signature className="w-3 h-3 text-blue-600" />
														<span className="text-xs font-medium text-gray-700">Entrega</span>
													</div>
													{acta.firma_entrega ? (
														<CheckCircle className="w-4 h-4 text-green-500" />
													) : (
														<XCircle className="w-4 h-4 text-gray-400" />
													)}
												</div>

												{editandoFirma.id === acta.id && editandoFirma.tipo === "entrega" ? (
													<div className="space-y-2">
														<FirmaInput
															value={acta.firma_entrega || ""}
															onChange={(value) => handleFirmaChange(acta.id, "entrega", value)}
															label=""
															size="small"
														/>
														<div className="flex gap-2">
															<button
																onClick={finalizarEdicionFirma}
																className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700"
															>
																Guardar
															</button>
															<button
																onClick={() => setEditandoFirma({ id: null, tipo: null })}
																className="flex-1 bg-gray-200 text-gray-800 py-1 px-2 rounded text-xs hover:bg-gray-300"
															>
																Cancelar
															</button>
														</div>
													</div>
												) : (
													<div className="text-center">
														{acta.firma_entrega ? (
															<div className="mb-2">
																<img
																	src={`${IMAGEN_URL}${acta.firma_entrega}`}
																	alt="Firma entrega"
																	className="max-w-full h-12 mx-auto border rounded"
																/>
															</div>
														) : (
															<div className="text-gray-400 py-2">
																<Signature className="w-6 h-6 mx-auto mb-1" />
																<p className="text-xs">Sin firma</p>
															</div>
														)}
														<button
															onClick={() => iniciarEdicionFirma(acta.id, "entrega")}
															className="text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 w-full"
														>
															<Edit className="w-3 h-3" />
															{acta.firma_entrega ? "Cambiar" : "Agregar"}
														</button>
													</div>
												)}
											</div>

											{/* Firma Recibe */}
											<div className="border rounded-lg p-3">
												<div className="flex items-center justify-between mb-2">
													<div className="flex items-center gap-1">
														<Signature className="w-3 h-3 text-green-600" />
														<span className="text-xs font-medium text-gray-700">Recibe</span>
													</div>
													{acta.firma_recibe ? (
														<CheckCircle className="w-4 h-4 text-green-500" />
													) : (
														<XCircle className="w-4 h-4 text-gray-400" />
													)}
												</div>

												{editandoFirma.id === acta.id && editandoFirma.tipo === "recibe" ? (
													<div className="space-y-2">
														<FirmaInput
															value={acta.firma_recibe || ""}
															onChange={(value) => handleFirmaChange(acta.id, "recibe", value)}
															label=""
															size="small"
														/>
														<div className="flex gap-2">
															<button
																onClick={finalizarEdicionFirma}
																className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-xs hover:bg-green-700"
															>
																Guardar
															</button>
															<button
																onClick={() => setEditandoFirma({ id: null, tipo: null })}
																className="flex-1 bg-gray-200 text-gray-800 py-1 px-2 rounded text-xs hover:bg-gray-300"
															>
																Cancelar
															</button>
														</div>
													</div>
												) : (
													<div className="text-center">
														{acta.firma_recibe ? (
															<div className="mb-2">
																<img
																	src={`${IMAGEN_URL}${acta.firma_recibe}`}
																	alt="Firma recibe"
																	className="max-w-full h-12 mx-auto border rounded"
																/>
															</div>
														) : (
															<div className="text-gray-400 py-2">
																<Signature className="w-6 h-6 mx-auto mb-1" />
																<p className="text-xs">Sin firma</p>
															</div>
														)}
														<button
															onClick={() => iniciarEdicionFirma(acta.id, "recibe")}
															className="text-xs text-green-600 hover:text-green-800 flex items-center justify-center gap-1 w-full"
														>
															{acta.firma_recibe ? (
																<Pencil className="w-3 h-3 mr-1" />
															) : (
																<Plus className="w-3 h-3 mr-1" />
															)}
															{acta.firma_recibe ? "Cambiar" : "Agregar"}
														</button>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Acciones al fondo - siempre visibles */}
								<div className="p-3 border-t bg-gray-50">
									<div className="flex gap-2">
										<button
											onClick={() => verDetalles(acta)}
											className="flex items-center justify-center p-2 bg-white text-gray-700 rounded-lg border hover:bg-gray-50"
											title="Ver detalles"
										>
											<Eye className="w-4 h-4" />
										</button>
										<button
											onClick={() => descargarActa(acta)}
											className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
											title="Descargar PDF"
										>
											<Download className="w-4 h-4" />
										</button>
										<button
											onClick={() => imprimirActa(acta)}
											className="flex items-center justify-center p-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
											title="Imprimir"
										>
											<Printer className="w-4 h-4" />
										</button>
									</div>
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