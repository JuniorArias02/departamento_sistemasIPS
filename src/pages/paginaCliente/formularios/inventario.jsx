import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Save, Loader2, Hash, Tag, Building2, User, Cpu, Settings, Barcode, MapPin, ChevronDown, UploadCloud, PlusCircle, Image } from "lucide-react";
import { useApp } from "../../../store/AppContext";
import { crearInventario, actualizarInventario } from "../../../services/inventario_services";
import BackPage from "../components/BackPage";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { listarSedes } from "../../../services/sedes_service";

export default function FormularioInventario() {
	const { usuario } = useApp();
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
	});

	const [loading, setLoading] = useState(false);

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
			onSubmit={handleSubmit}
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
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{[
					{ name: "codigo", label: "Código", icon: <Hash size={18} className="text-gray-400" /> },
					{ name: "nombre", label: "Nombre del Activo", icon: <Tag size={18} className="text-gray-400" /> },
					{ name: "dependencia", label: "Dependencia", icon: <Building2 size={18} className="text-gray-400" /> },
					{ name: "responsable", label: "Responsable", icon: <User size={18} className="text-gray-400" /> },
					{ name: "marca", label: "Marca", icon: <Cpu size={18} className="text-gray-400" /> },
					{ name: "modelo", label: "Modelo", icon: <Settings size={18} className="text-gray-400" /> },
					{ name: "serial", label: "Número de Serie", icon: <Barcode size={18} className="text-gray-400" /> },
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
								value={formData[name]}
								onChange={handleChange}
								className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
								placeholder={`Ingrese ${label.toLowerCase()}`}
							/>
							<div className="absolute left-3 top-3.5">

							</div>
						</div>
					</motion.div>
				))}

				{/* Selector de sede con icono */}
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

				{/* Campo adicional para imagen/QR (opcional) */}

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
					disabled={loading}
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
