import { useState, useEffect } from "react";
import { FirmaInput } from "../../../appFirma/appFirmas";
import { subirFirmaMantenimientoPC, crearMantenimientoPC } from "../../../../services/pc_mantenimientos_services";
import { useApp } from "../../../../store/AppContext";
import { buscarEquipo } from "../../../../services/pc_equipos_services";
import Swal from "sweetalert2";
import { obtenerDatosEmpresa } from "../../../../services/datos_empresa";

import { Wrench, Search, ChevronDown, Calendar, Building, Package, DollarSign, Save } from 'lucide-react';
const VistaCrearMantenimientoEquipo = () => {
	const { usuario } = useApp();
	const [empresas, setEmpresas] = useState([]);
	const [form, setForm] = useState({
		equipo_id: "",
		tipo_mantenimiento: "preventivo",
		descripcion: "",
		fecha: "",
		empresa_responsable_id: "",
		repuesto: false,
		cantidad_repuesto: "",
		costo_repuesto: "",
		nombre_repuesto: "",
		responsable_mantenimiento: usuario.id,
		usuario_id: usuario.id,
		firma_personal_cargo: "",
		firma_sistemas: "",
	});

	const [busquedaEquipo, setBusquedaEquipo] = useState("");
	const [resultadosEquipos, setResultadosEquipos] = useState([]);
	const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setForm({
			...form,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	useEffect(() => {
		const fetchEmpresas = async () => {
			try {
				const data = await obtenerDatosEmpresa();
				// si tu endpoint devuelve solo una empresa, conviértelo en array
				setEmpresas(Array.isArray(data) ? data : [data]);
			} catch (error) {
				console.error("Error cargando empresas:", error);
			}
		};
		fetchEmpresas();
	}, []);


	const base64ToFile = (base64, filename) => {
		const arr = base64.split(",");
		const mime = arr[0].match(/:(.*?);/)[1]; // "image/png"
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	};




	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Crear mantenimiento primero
			const res = await crearMantenimientoPC({
				usuario_id: usuario.id,
				equipo_id: form.equipo_id,
				tipo_mantenimiento: form.tipo_mantenimiento,
				descripcion: form.descripcion,
				fecha: form.fecha,
				empresa_responsable_id: form.empresa_responsable_id,
				repuesto: form.repuesto ? 1 : 0,
				cantidad_repuesto: form.cantidad_repuesto,
				costo_repuesto: form.costo_repuesto,
				nombre_repuesto: form.nombre_repuesto,
				responsable_mantenimiento: usuario.id,
			});

			if (!res.status) {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: res.message || "Hubo un problema al crear el mantenimiento",
				});
				return;
			}

			const mantenimientoId = res.mantenimiento_id;

			// --- SUBIR FIRMAS ---
			const formData = new FormData();
			formData.append("mantenimiento_id", mantenimientoId);

			// Firma de sistemas (OBLIGATORIA)
			if (form.firma_sistemas) {
				const firmaSistemasFile = base64ToFile(form.firma_sistemas, "firma_sistemas.png");
				formData.append("firma_sistemas", firmaSistemasFile);
			} else {
				Swal.fire({
					icon: "error",
					title: "Falta la firma de sistemas",
					text: "Debes anexar la firma de sistemas obligatoriamente",
				});
				return;
			}

			// Firma del personal a cargo (OPCIONAL)
			if (form.firma_personal_cargo) {
				const firmaCargoFile = base64ToFile(form.firma_personal_cargo, "firma_personal.png");
				formData.append("firma_personal_cargo", firmaCargoFile);
			}

			// Subir al endpoint
			const resFirmas = await subirFirmaMantenimientoPC(formData);
			// console.log("Respuesta de subir firmas:", resFirmas);

			Swal.fire({
				icon: "success",
				title: "¡Mantenimiento creado!",
				text: "El mantenimiento se registró correctamente ✅",
				timer: 2000,
				showConfirmButton: false,
			});
			setForm({
				equipo_id: "",
				tipo_mantenimiento: "",
				descripcion: "",
				fecha: "",
				empresa_responsable_id: "",
				repuesto: false,
				cantidad_repuesto: "",
				costo_repuesto: "",
				nombre_repuesto: "",
				firma_sistemas: null,
				firma_personal_cargo: null,
			});
			setBusquedaEquipo("");
			setEquipoSeleccionado("");
		} catch (error) {
			console.error(error);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Error en el flujo de creación",
			});
		}
	};


	return (
		<div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
			<div className="flex items-center justify-center mb-8">
				<Wrench className="h-8 w-8 text-indigo-600 mr-3" />
				<h1 className="text-3xl font-bold text-gray-800">Acta de Mantenimiento</h1>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* 🔍 Buscador de equipo mejorado */}
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700 flex items-center">
						<Search className="h-4 w-4 mr-1" />
						Buscar equipo
					</label>
					<div className="relative">
						<input
							type="text"
							value={busquedaEquipo}
							onChange={async (e) => {
								setBusquedaEquipo(e.target.value);
								if (e.target.value.length >= 2) {
									const res = await buscarEquipo(e.target.value);
									setResultadosEquipos(res);
								} else {
									setResultadosEquipos([]);
								}
							}}
							placeholder="Ingrese serial o número de inventario..."
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
						/>
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
					</div>

					{resultadosEquipos.length > 0 && (
						<div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
							<select
								value={equipoSeleccionado?.id || ""}
								onChange={(e) => {
									const eq = resultadosEquipos.find(
										(eqp) => eqp.id == e.target.value
									);
									if (eq) {
										setEquipoSeleccionado(eq);
										setForm({ ...form, equipo_id: eq.id });
									}
								}}
								className="w-full p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
							>
								<option value="">-- Selecciona un equipo --</option>
								{resultadosEquipos.map((eq) => (
									<option key={eq.id} value={eq.id}>
										{eq.nombre_equipo} - {eq.marca} {eq.modelo} - {eq.serial}
									</option>
								))}
							</select>
						</div>
					)}
				</div>

				{/* Selector de tipo de mantenimiento */}
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">
						Tipo de mantenimiento
					</label>
					<div className="relative">
						<select
							name="tipo_mantenimiento"
							value={form.tipo_mantenimiento}
							onChange={handleChange}
							className="w-full pl-3 pr-10 py-3 appearance-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
						>
							<option value="preventivo">Preventivo</option>
							<option value="correctivo">Correctivo</option>
						</select>
						<ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
					</div>
				</div>

				{/* Descripción */}
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">
						Descripción del mantenimiento
					</label>
					<textarea
						name="descripcion"
						value={form.descripcion}
						onChange={handleChange}
						placeholder="Detalle las actividades realizadas durante el mantenimiento..."
						rows={4}
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
					/>
				</div>

				{/* Fecha */}
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">
						Fecha de mantenimiento
					</label>
					<div className="relative">
						<Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							type="date"
							name="fecha"
							value={form.fecha}
							onChange={handleChange}
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
				</div>

				{/* Empresa responsable */}
				<div className="space-y-2">
					<label className="block text-sm font-medium text-gray-700">
						Empresa responsable
					</label>
					<div className="relative">
						<select
							name="empresa_responsable_id"
							value={form.empresa_responsable_id}
							onChange={handleChange}
							className="w-full pl-3 pr-10 py-3 appearance-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
						>
							<option value="">Seleccione una empresa</option>
							{empresas.map((empresa) => (
								<option key={empresa.id} value={empresa.id}>
									{empresa.nombre} - {empresa.nit}
								</option>
							))}
						</select>

					</div>
				</div>

				{/* Checkbox repuesto */}
				<div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
					<label className="flex items-center gap-3 cursor-pointer">
						<div className="relative">
							<input
								type="checkbox"
								name="repuesto"
								checked={form.repuesto}
								onChange={handleChange}
								className="sr-only"
							/>
							<div className={`block w-10 h-6 rounded-full transition-colors ${form.repuesto ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
							<div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${form.repuesto ? 'transform translate-x-4' : ''}`}></div>
						</div>
						<span className="text-gray-700 font-medium">¿Usó repuesto?</span>
					</label>
				</div>

				{form.repuesto && (
					<div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
						<h3 className="font-medium text-gray-700 flex items-center">
							<Package className="h-5 w-5 mr-2 text-indigo-600" />
							Información de repuestos
						</h3>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Nombre del repuesto
								</label>
								<input
									type="text"
									name="nombre_repuesto"
									value={form.nombre_repuesto}
									onChange={handleChange}
									placeholder="Ej: Disco duro SSD"
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Cantidad
								</label>
								<input
									type="number"
									name="cantidad_repuesto"
									value={form.cantidad_repuesto}
									onChange={handleChange}
									placeholder="0"
									min="0"
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Costo del repuesto
							</label>
							<div className="relative">
								<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type="number"
									name="costo_repuesto"
									value={form.costo_repuesto}
									onChange={handleChange}
									placeholder="0.00"
									min="0"
									step="0.01"
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
								/>
							</div>
						</div>
					</div>
				)}

				{/* Firmas */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="p-4 border border-gray-200 rounded-lg">
						<FirmaInput
							value={form.firma_personal_cargo}
							onChange={(value) =>
								setForm({ ...form, firma_personal_cargo: value })
							}
							label="Firma personal/cargo"
						/>
					</div>

					<div className="p-4 border border-gray-200 rounded-lg">
						<FirmaInput
							value={form.firma_sistemas}
							onChange={(value) => setForm({ ...form, firma_sistemas: value })}
							label="Firma sistemas"
						/>
					</div>
				</div>

				{/* Botón de envío */}
				<button
					type="submit"
					className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center"
				>
					<Save className="h-5 w-5 mr-2" />
					Guardar Acta
				</button>
			</form>
		</div>
	);
};

export default VistaCrearMantenimientoEquipo;
