import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Save, Loader2, Hash, Tag, Building2, User, Cpu, Settings, Barcode, MapPin, ChevronDown, UploadCloud, PlusCircle, Image, Layers, Activity, DollarSign, TrendingDown, Shield, Calendar, ShoppingCart, Info, Truck, CreditCard, FileText, CalendarCheck, Paperclip } from "lucide-react";
import { useApp } from "../../../store/AppContext";
import { crearInventario, actualizarInventario } from "../../../services/inventario_services";
import BackPage from "../components/BackPage";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { listarSedes } from "../../../services/sedes_service";
import { PERMISOS } from "../../../secure/permisos/permisos";
export default function FormularioInventario() {
	const { usuario, permisos } = useApp();
	const location = useLocation();
	const inventarioEdit = location.state?.inventario;
	const [sedes, setSedes] = useState([]);
	const [formData, setFormData] = useState({
		codigo: "",
		nombre: "",
		dependencia: "",
		responsable: "",
		marca: "",
		modelo: "",
		serial: "",
		sede_id: "",
		codigo_barras: "",
		grupo: "",
		vida_util: "",
		vida_util_niff: "",
		centro_costo: "",
		ubicacion: "",
		proveedor: "",
		fecha_compra: "",
		soporte: "",
		descripcion: "",
		estado: "",
		escritura: "",
		matricula: "",
		valor_compra: "",
		salvamenta: "",
		depreciacion: "",
		depreciacion_niif: "",
		meses: "",
		meses_niif: "",
		tipo_adquisicion: "",
		calibrado: "",
		observaciones: ""
	});

	const puedeGuardar = inventarioEdit
		? permisos.includes(PERMISOS.INVENTARIO.EDITAR)
		: permisos.includes(PERMISOS.INVENTARIO.CREAR);

	const [loading, setLoading] = useState(false);

	function formatDateForInput(dateString) {
		if (!dateString) return "";
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return "";

		// Asegurar que el mes y día tengan 2 dígitos
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}
	useEffect(() => {
		if (inventarioEdit) {
			setFormData({
				codigo: inventarioEdit.codigo || "",
				nombre: inventarioEdit.nombre || "",
				dependencia: inventarioEdit.dependencia || "",
				responsable: inventarioEdit.responsable || "",
				marca: inventarioEdit.marca || "",
				modelo: inventarioEdit.modelo || "",
				serial: inventarioEdit.serial || "",
				sede_id: inventarioEdit.sede_id || "",
				// Nuevas variables
				codigo_barras: inventarioEdit.codigo_barras || "",
				grupo: inventarioEdit.grupo || "",
				vida_util: inventarioEdit.vida_util ? formatDateForInput(inventarioEdit.vida_util) : "",
				vida_util_niff: inventarioEdit.vida_util_niff ? formatDateForInput(inventarioEdit.vida_util_niff) : "",
				centro_costo: inventarioEdit.centro_costo || "",
				ubicacion: inventarioEdit.ubicacion || "",
				proveedor: inventarioEdit.proveedor || "",
				fecha_compra: inventarioEdit.fecha_compra ? formatDateForInput(inventarioEdit.fecha_compra) : "",
				soporte: inventarioEdit.soporte || "",
				descripcion: inventarioEdit.descripcion || "",
				estado: inventarioEdit.estado || "",
				escritura: inventarioEdit.escritura || "",
				matricula: inventarioEdit.matricula || "",
				valor_compra: inventarioEdit.valor_compra || "",
				salvamenta: inventarioEdit.salvamenta || "",
				depreciacion: inventarioEdit.depreciacion || "",
				depreciacion_niif: inventarioEdit.depreciacion_niif || "",
				meses: inventarioEdit.meses || "",
				meses_niif: inventarioEdit.meses_niif || "",
				tipo_adquisicion: inventarioEdit.tipo_adquisicion || "",
				calibrado: inventarioEdit.calibrado ? formatDateForInput(inventarioEdit.calibrado) : "",
				observaciones: inventarioEdit.observaciones || ""
			});
		} else {
			// Estado inicial para nuevo registro
			setFormData({
				codigo: "",
				nombre: "",
				dependencia: "",
				responsable: "",
				marca: "",
				modelo: "",
				serial: "",
				sede_id: "",
				codigo_barras: "",
				grupo: "",
				vida_util: "",
				vida_util_niff: "",
				centro_costo: "",
				ubicacion: "",
				proveedor: "",
				fecha_compra: "",
				soporte: "",
				descripcion: "",
				estado: "",
				escritura: "",
				matricula: "",
				valor_compra: "",
				salvamenta: "",
				depreciacion: "",
				depreciacion_niif: "",
				meses: "",
				meses_niif: "",
				tipo_adquisicion: "",
				calibrado: "",
				observaciones: ""
			});
		}
	}, [inventarioEdit]);

	useEffect(() => {
		const fetchSedes = async () => {
			try {
				const data = await listarSedes();
				setSedes(data);
			} catch (error) {
				console.error("Error al cargar las sedes:", error);
			}
		};

		fetchSedes();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value.toUpperCase() });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return;

		setLoading(true);

		const datosConUsuario = {
			...formData,
			creado_por: usuario?.id || usuario?.nombre || "desconocido",
		};

		try {
			if (inventarioEdit?.id) {
				await actualizarInventario(inventarioEdit.id, datosConUsuario);
				Swal.fire({
					icon: "success",
					title: "¡Actualizado!",
					text: "Inventario actualizado correctamente",
					timer: 2000,
					showConfirmButton: false,
				});
			} else {
				await crearInventario(datosConUsuario);
				Swal.fire({
					icon: "success",
					title: "¡Éxito!",
					text: "Inventario registrado correctamente",
					timer: 2000,
					showConfirmButton: false,
				});
				setFormData({
					codigo: "",
					nombre: "",
					dependencia: "",
					responsable: "",
					marca: "",
					modelo: "",
					serial: "",
					sede_id: "",
					codigo_barras: "",
					grupo: "",
					vida_util: "",
					vida_util_niff: "",
					centro_costo: "",
					ubicacion: "",
					proveedor: "",
					fecha_compra: "",
					soporte: "",
					descripcion: "",
					estado: "",
					escritura: "",
					matricula: "",
					valor_compra: "",
					salvamenta: "",
					depreciacion: "",
					depreciacion_niif: "",
					meses: "",
					meses_niif: "",
					tipo_adquisicion: "",
					calibrado: "",
					observaciones: ""
				});
			}
		} catch (err) {
			console.error(err);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: err.message || "No se pudo registrar el inventario",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.form
			onSubmit={(e) => {
				if (!puedeGuardar) {
					e.preventDefault();
					Swal.fire({
						icon: 'warning',
						title: 'Sin permisos',
						text: 'No tienes permisos para guardar este activo.',
						confirmButtonColor: '#6366F1'
					});
					return;
				}
				handleSubmit(e);
			}}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="max-w-3xl mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 space-y-8"
		>
			{/* Encabezado con gradiente */}
			<div className="text-center">
				<h2 className="text-3xl font-bold bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent">
					{inventarioEdit ? "Editar Activo" : "Nuevo Activo inventario"}
				</h2>
				<p className="text-gray-500 mt-2">
					{inventarioEdit ? "Actualiza los datos del activo" : "Registra un nuevo activo en el inventario"}
				</p>
			</div>

			{/* Campos del formulario */}
			<div className="space-y-8">
				{/* Sección 1: Información básica */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{[
						{ name: "codigo", label: "Código", icon: <Hash size={18} className="text-gray-400" /> },
						{ name: "nombre", label: "Nombre del Activo", icon: <Tag size={18} className="text-gray-400" /> },
						{ name: "dependencia", label: "Dependencia", icon: <Building2 size={18} className="text-gray-400" /> },
						{ name: "responsable", label: "Responsable", icon: <User size={18} className="text-gray-400" /> },
						{ name: "marca", label: "Marca", icon: <Cpu size={18} className="text-gray-400" /> },
						{ name: "modelo", label: "Modelo", icon: <Settings size={18} className="text-gray-400" /> },
						{ name: "serial", label: "Número de Serie", icon: <Barcode size={18} className="text-gray-400" /> },
						{ name: "codigo_barras", label: "Código de Barras", icon: <Barcode size={18} className="text-gray-400" /> },
						{ name: "grupo", label: "Grupo", icon: <Layers size={18} className="text-gray-400" /> },
						{ name: "estado", label: "Estado", icon: <Activity size={18} className="text-gray-400" /> },
					].map(({ name, label, icon }, index) => (
						<motion.div
							key={name}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
							className="space-y-1"
						>
							<label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center gap-1">
								{icon}
								<span>{label}</span>
							</label>
							<div className="relative">
								<input
									type="text"
									id={name}
									name={name}
									value={formData[name] || ''}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
									placeholder={`Ingrese ${label.toLowerCase()}`}
								/>
								<div className="absolute left-3 top-3.5">
									{icon}
								</div>
							</div>
						</motion.div>
					))}

					{/* Selector de sede */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="space-y-1"
					>
						<label htmlFor="sede_id" className="text-sm font-medium text-gray-700 flex items-center gap-1">
							<MapPin size={18} className="text-gray-400" />
							<span>Sede/Localización</span>
						</label>
						<div className="relative">
							<select
								id="sede_id"
								name="sede_id"
								value={formData.sede_id}
								onChange={handleChange}
								className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all"
							>
								<option value="">Seleccione una sede</option>
								{sedes.map((s) => (
									<option key={s.id} value={s.id}>
										{s.nombre}
									</option>
								))}
							</select>
							<MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
							<ChevronDown size={18} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
						</div>
					</motion.div>

					{/* Selector de ubicación */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="space-y-1"
					>
						<label htmlFor="ubicacion" className="text-sm font-medium text-gray-700 flex items-center gap-1">
							<MapPin size={18} className="text-gray-400" />
							<span>Ubicación específica</span>
						</label>
						<div className="relative">
							<input
								type="text"
								id="ubicacion"
								name="ubicacion"
								value={formData.ubicacion || ''}
								onChange={handleChange}
								className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
								placeholder="Ingrese la ubicación"
							/>
							<MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
						</div>
					</motion.div>
				</div>

				{/* Sección 2: Información financiera y depreciación */}
				<div className="bg-gray-50 p-6 rounded-xl">
					<h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
						<DollarSign size={18} />
						Información Financiera
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{[
							{ name: "valor_compra", label: "Valor de Compra", type: "number", icon: <DollarSign size={18} className="text-gray-400" /> },
							{ name: "depreciacion", label: "Depreciación", type: "number", icon: <TrendingDown size={18} className="text-gray-400" /> },
							{ name: "depreciacion_niif", label: "Depreciación NIIF", type: "number", icon: <TrendingDown size={18} className="text-gray-400" /> },
							{ name: "salvamenta", label: "Valor Salvamento", icon: <Shield size={18} className="text-gray-400" /> },
						].map(({ name, label, type = "text", icon }, index) => (
							<motion.div
								key={name}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
								className="space-y-1"
							>
								<label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center gap-1">
									{icon}
									<span>{label}</span>
								</label>
								<div className="relative">
									<input
										type={type}
										id={name}
										name={name}
										value={formData[name] || ''}
										onChange={handleChange}
										className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
										placeholder={`Ingrese ${label.toLowerCase()}`}
										step={type === "number" ? "0.01" : undefined}
									/>
									<div className="absolute left-3 top-3.5">
										{icon}
									</div>
								</div>
							</motion.div>
						))}

						{/* Campos de fecha financieros */}
						{[
							{ name: "fecha_compra", label: "Fecha de Compra", icon: <Calendar size={18} className="text-gray-400" /> },
							{ name: "vida_util", label: "Vida Útil", icon: <Calendar size={18} className="text-gray-400" /> },
							{ name: "vida_util_niff", label: "Vida Útil NIIF", icon: <Calendar size={18} className="text-gray-400" /> },
						].map(({ name, label, icon }, index) => (
							<motion.div
								key={name}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
								className="space-y-1"
							>
								<label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center gap-1">
									{icon}
									<span>{label}</span>
								</label>
								<div className="relative">
									<input
										type="date"
										id={name}
										name={name}
										value={formData[name] || ''}
										onChange={handleChange}
										className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
									/>
									<div className="absolute left-3 top-3.5">
										{icon}
									</div>
								</div>
							</motion.div>
						))}

						{/* Selector de tipo de adquisición */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="space-y-1"
						>
							<label htmlFor="tipo_adquisicion" className="text-sm font-medium text-gray-700 flex items-center gap-1">
								<ShoppingCart size={18} className="text-gray-400" />
								<span>Tipo de Adquisición</span>
							</label>
							<div className="relative">
								<select
									id="tipo_adquisicion"
									name="tipo_adquisicion"
									value={formData.tipo_adquisicion || ''}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all"
								>
									<option value="">Seleccione tipo</option>
									<option value="INVENTARIO_INICIAL">Inventario Inicial</option>
								</select>
								<ShoppingCart size={18} className="absolute left-3 top-3.5 text-gray-400" />
								<ChevronDown size={18} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
							</div>
						</motion.div>
					</div>
				</div>

				{/* Sección 3: Información adicional */}
				<div className="bg-gray-50 p-6 rounded-xl">
					<h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
						<Info size={18} />
						Información Adicional
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{[
							{ name: "proveedor", label: "Proveedor", icon: <Truck size={18} className="text-gray-400" /> },
							{ name: "centro_costo", label: "Centro de Costo", icon: <CreditCard size={18} className="text-gray-400" /> },
							{ name: "matricula", label: "Matrícula", icon: <FileText size={18} className="text-gray-400" /> },
							{ name: "escritura", label: "Escritura", icon: <FileText size={18} className="text-gray-400" /> },
							{ name: "meses", label: "Meses Depreciación", icon: <Calendar size={18} className="text-gray-400" /> },
							{ name: "meses_niif", label: "Meses Dep. NIIF", icon: <Calendar size={18} className="text-gray-400" /> },
						].map(({ name, label, icon }, index) => (
							<motion.div
								key={name}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.05 }}
								className="space-y-1"
							>
								<label htmlFor={name} className="text-sm font-medium text-gray-700 flex items-center gap-1">
									{icon}
									<span>{label}</span>
								</label>
								<div className="relative">
									<input
										type="text"
										id={name}
										name={name}
										value={formData[name] || ''}
										onChange={handleChange}
										className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
										placeholder={`Ingrese ${label.toLowerCase()}`}
									/>
									<div className="absolute left-3 top-3.5">
										{icon}
									</div>
								</div>
							</motion.div>
						))}

						{/* Campo de fecha de calibrado */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="space-y-1"
						>
							<label htmlFor="calibrado" className="text-sm font-medium text-gray-700 flex items-center gap-1">
								<CalendarCheck size={18} className="text-gray-400" />
								<span>Fecha de Calibrado</span>
							</label>
							<div className="relative">
								<input
									type="date"
									id="calibrado"
									name="calibrado"
									value={formData.calibrado || ''}
									onChange={handleChange}
									className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
								/>
								<CalendarCheck size={18} className="absolute left-3 top-3.5 text-gray-400" />
							</div>
						</motion.div>
					</div>

					{/* Campo de texto largo para observaciones */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="mt-6 space-y-1"
					>
						<label htmlFor="observaciones" className="text-sm font-medium text-gray-700 flex items-center gap-1">
							<FileText size={18} className="text-gray-400" />
							<span>Observaciones</span>
						</label>
						<textarea
							id="observaciones"
							name="observaciones"
							value={formData.observaciones || ''}
							onChange={handleChange}
							rows={3}
							className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
							placeholder="Ingrese observaciones relevantes"
						/>
					</motion.div>

					{/* Campo para soporte/documentación */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
						className="mt-6 space-y-1"
					>
						<label htmlFor="soporte" className="text-sm font-medium text-gray-700 flex items-center gap-1">
							<Paperclip size={18} className="text-gray-400" />
							<span>Soporte/Documentación</span>
						</label>
						<input
							type="text"
							id="soporte"
							name="soporte"
							value={formData.soporte || ''}
							onChange={handleChange}
							className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
							placeholder="Referencia de soporte/documentación"
						/>
						<Paperclip size={18} className="absolute left-3 top-3.5 text-gray-400" />
					</motion.div>
				</div>
			</div>

			{/* Botones de acción */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-4"
			>
				<BackPage
					isEdit={!!inventarioEdit}
					className="px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
				/>

				<button
					type="submit"
					disabled={loading || !puedeGuardar}
					className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-indigo-200 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
				>
					{loading ? (
						<>
							<Loader2 size={20} className="animate-spin" />
							<span>Procesando...</span>
						</>
					) : (
						<>
							{inventarioEdit ? (
								<>
									<Save size={20} />
									<span>Actualizar Activo</span>
								</>
							) : (
								<>
									<PlusCircle size={20} />
									<span>Registrar Activo</span>
								</>
							)}
						</>
					)}
				</button>
			</motion.div>
		</motion.form>
	);
}
