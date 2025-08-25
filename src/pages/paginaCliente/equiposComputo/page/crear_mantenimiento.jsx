import { useState, useEffect } from "react";
import { FirmaInput } from "../../../appFirma/appFirmas";
import { subirFirmaMantenimientoPC, crearMantenimientoPC } from "../../../../services/pc_mantenimientos_services";
import { useApp } from "../../../../store/AppContext";
import { buscarEquipo } from "../../../../services/pc_equipos_services";
import Swal from "sweetalert2";
import {obtenerDatosEmpresa} from "../../../../services/datos_empresa";
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
		responsable_mantenimiento: "",
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
		// setForm({ ...form, [e.target.name]: e.target.value });
		try {
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
				responsable_mantenimiento: form.responsable_mantenimiento,
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

			if (form.firma_personal_cargo && form.firma_sistemas) {
				const formData = new FormData();
				formData.append("mantenimiento_id", mantenimientoId);

				// Convertir base64 → File
				const firmaCargoFile = base64ToFile(form.firma_personal_cargo, "firma_personal.png");
				const firmaSistemasFile = base64ToFile(form.firma_sistemas, "firma_sistemas.png");

				formData.append("firma_personal_cargo", firmaCargoFile);
				formData.append("firma_sistemas", firmaSistemasFile);

				const resFirmas = await subirFirmaMantenimientoPC(formData);
				// console.log("Respuesta de subir firmas:", resFirmas);
			}

			Swal.fire({
				icon: "success",
				title: "¡Mantenimiento creado!",
				text: "El mantenimiento se registró correctamente ✅",
				timer: 2000,
				showConfirmButton: false,
			});
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
		<div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
			<h1 className="text-2xl font-bold mb-6">Acta de Mantenimiento</h1>
			<form onSubmit={handleSubmit} className="grid gap-4">

				{/* 🔍 Buscador de equipo */}
				<div>
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
						placeholder="Buscar equipo por serial o inventario"
						className="border pl-2 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>

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
						className="mt-2 border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					>
						<option value="">-- Selecciona un equipo --</option>
						{resultadosEquipos.map((eq) => (
							<option key={eq.id} value={eq.id}>
								{eq.nombre_equipo} - {eq.marca} {eq.modelo} - {eq.serial}
							</option>
						))}
					</select>
				</div>

				{/* resto del formulario */}
				<select
					name="tipo_mantenimiento"
					value={form.tipo_mantenimiento}
					onChange={handleChange}
					className="border p-2 rounded"
				>
					<option value="preventivo">Preventivo</option>
					<option value="correctivo">Correctivo</option>
				</select>

				<textarea
					name="descripcion"
					value={form.descripcion}
					onChange={handleChange}
					placeholder="Descripción del mantenimiento"
					className="border p-2 rounded"
				/>

				<input
					type="date"
					name="fecha"
					value={form.fecha}
					onChange={handleChange}
					className="border p-2 rounded"
				/>

				<select
					name="empresa_responsable_id"
					value={form.empresa_responsable_id}
					onChange={handleChange}
					className="border p-2 rounded w-full"
				>
					<option value="">Seleccione una empresa</option>
					{empresas.map((empresa) => (
						<option key={empresa.id} value={empresa.id}>
							{empresa.nombre} - {empresa.nit}
						</option>
					))}
				</select>

				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						name="repuesto"
						checked={form.repuesto}
						onChange={handleChange}
					/>
					¿Usó repuesto?
				</label>

				{form.repuesto && (
					<>
						<input
							type="number"
							name="cantidad_repuesto"
							value={form.cantidad_repuesto}
							onChange={handleChange}
							placeholder="Cantidad de repuestos"
							className="border p-2 rounded"
						/>
						<input
							type="number"
							name="costo_repuesto"
							value={form.costo_repuesto}
							onChange={handleChange}
							placeholder="Costo de repuesto"
							className="border p-2 rounded"
						/>
						<input
							type="text"
							name="nombre_repuesto"
							value={form.nombre_repuesto}
							onChange={handleChange}
							placeholder="Nombre del repuesto"
							className="border p-2 rounded"
						/>
					</>
				)}

				<input
					type="text"
					name="responsable_mantenimiento"
					value={form.responsable_mantenimiento}
					onChange={handleChange}
					placeholder="Responsable del mantenimiento"
					className="border p-2 rounded"
				/>

				{/* firmas */}
				<FirmaInput
					value={form.firma_personal_cargo}
					onChange={(value) =>
						setForm({ ...form, firma_personal_cargo: value })
					}
					label="Firma personal/cargo"
				/>

				<FirmaInput
					value={form.firma_sistemas}
					onChange={(value) => setForm({ ...form, firma_sistemas: value })}
					label="Firma sistemas"
				/>

				<button
					type="submit"
					className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
				>
					Guardar Acta
				</button>
			</form>
		</div>
	);
};

export default VistaCrearMantenimientoEquipo;
