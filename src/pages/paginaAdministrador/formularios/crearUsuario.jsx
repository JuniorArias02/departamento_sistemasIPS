// componente FormularioUsuarios.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { User, Mail, Lock, Shield, ChevronDown, Loader2, Save, UserPlus, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { CrearUsuario, actualizarUsuario, obtenerUsuario } from "../../../services/usuario_service";
import { listarRoles } from "../../../services/rol_services";
import { useApp } from "../../../store/AppContext";
import BackPage from "../../paginaCliente/components/BackPage";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RUTAS } from "../../../const/routers/routers";

export default function FormularioUsuarios() {
	const { usuario: usuarioContext } = useApp();
	const navigate = useNavigate();
	const [rol, setRol] = useState([]);
	const location = useLocation();
	const usuarioEdit = location.state?.usuarios;
	const [formData, setFormData] = useState({
		nombre_completo: "",
		usuario: "",
		contrasena: "",
		rol_id: "",
		id_usuario_editor: usuarioContext.id,
		id_usuario_objetivo: usuarioEdit?.id || "",
	});

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const data = await listarRoles();
				setRol(data);
			} catch (error) {
				console.error("Error al cargar los roles:", error);
			}
		};

		fetchRoles();
	}, []);

	useEffect(() => {
		const fetchUsuario = async () => {
			if (usuarioEdit) {
				try {
					const data = await obtenerUsuario(usuarioContext.id, usuarioEdit.id);
					// console.log("Datos del usuario a editar:", data);
					setFormData({
						nombre_completo: data.nombre_completo,
						usuario: data.usuario,
						contrasena: "",
						rol_id: data.rol_id,
						id_usuario_editor: usuarioContext.id,
						id_usuario_objetivo: usuarioEdit.id,
					});
				} catch (error) {
					console.error("Error al cargar datos para edición:", error.message);
				}
			}
		};
		fetchUsuario();
	}, [usuarioEdit, usuarioContext.id]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return;

		setLoading(true);

		try {
			if (usuarioEdit) {
				await actualizarUsuario({
					...formData,
					id_usuario_editor: usuarioContext.id,
					id_usuario_objetivo: usuarioEdit.id,
				});
				Swal.fire({
					icon: "success",
					title: "¡Usuario actualizado!",
					text: "Los cambios se guardaron correctamente",
					timer: 2000,
					showConfirmButton: false,
				});
				navigate(RUTAS.ADMIN.USUARIOS.ROOT);
			} else {
				await CrearUsuario({
					...formData,
					id_usuario_creador: usuarioContext.id,
				});
				Swal.fire({
					icon: "success",
					title: "¡Usuario creado!",
					text: "El usuario se registró correctamente",
					timer: 2000,
					showConfirmButton: false,
				});
			}
			setFormData({
				nombre_completo: "",
				usuario: "",
				contrasena: "",
				rol_id: "",
				id_usuario_editor: usuarioContext.id,
				id_usuario_objetivo: "",
			});
		} catch (err) {
			console.error(err);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: err.message || "No se pudo completar la acción",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
			<motion.form
				onSubmit={handleSubmit}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className="max-w-md mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 space-y-8"
			>
				{/* Encabezado */}
				<div className="space-y-2">
					<BackPage
						isEdit={true}
						className="text-indigo-600 hover:text-indigo-800 transition-colors"
					/>
					<h2 className="text-3xl font-bold bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent text-center">
						{usuarioEdit ? "Editar Usuario" : "Nuevo Usuario"}
					</h2>
					<p className="text-gray-500 text-center">
						{usuarioEdit ? "Actualiza la información del usuario" : "Completa los datos para registrar un nuevo usuario"}
					</p>
				</div>

				{/* Campos del formulario */}
				<div className="space-y-5">
					{/* Campo Nombre */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="space-y-1"
					>
						<label htmlFor="nombre" className="text-sm font-medium text-gray-700 flex items-center gap-2">
							<User size={16} className="text-gray-400" />
							Nombre Completo
						</label>
						<div className="relative">
							<input
								type="text"
								id="nombre"
								name="nombre"
								value={formData.nombre_completo}
								onChange={handleChange}
								className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
								placeholder="Ej: Juan Pérez"
							/>
						</div>
					</motion.div>

					{/* Campo Correo */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="space-y-1"
					>
						<label htmlFor="correo" className="text-sm font-medium text-gray-700 flex items-center gap-2">
							<UserCircle size={16} className="text-gray-400" />
							usuario
						</label>
						<div className="relative">
							<input
								type="email"
								id="correo"
								name="correo"
								value={formData.usuario}
								onChange={handleChange}
								className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
								placeholder="Ej: usuario@dominio.com"
							/>
						</div>
					</motion.div>

					{/* Campo Contraseña */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="space-y-1"
					>
						<label htmlFor="contrasena" className="text-sm font-medium text-gray-700 flex items-center gap-2">
							<Lock size={16} className="text-gray-400" />
							Contraseña
						</label>
						<div className="relative">
							<input
								type="password"
								id="contrasena"
								name="contrasena"
								value={formData.contrasena}
								onChange={handleChange}
								className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
								placeholder={usuarioEdit ? "Dejar en blanco para no cambiar" : "Mínimo 8 caracteres"}
							/>
						</div>
					</motion.div>

					{/* Selector de Rol */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="space-y-1"
					>
						<label htmlFor="rol_id" className="text-sm font-medium text-gray-700 flex items-center gap-2">
							<Shield size={16} className="text-gray-400" />
							Rol del Usuario
						</label>
						<div className="relative">
							<select
								id="rol_id"
								name="rol_id"
								value={formData.rol_id}
								onChange={handleChange}
								className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all"
							>
								<option value="">Selecciona un rol</option>
								{(rol || []).map((r) => (
									<option key={r.id} value={r.id}>
										{r.nombre}
									</option>
								))}
							</select>
							<Shield size={16} className="absolute left-3 top-3.5 text-gray-400" />
							<ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
						</div>
					</motion.div>
				</div>

				{/* Botón de acción */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="pt-4"
				>
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:shadow-indigo-200 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
					>
						{loading ? (
							<>
								<Loader2 size={20} className="animate-spin" />
								<span>Procesando...</span>
							</>
						) : usuarioEdit ? (
							<>
								<Save size={20} />
								<span>Actualizar Usuario</span>
							</>
						) : (
							<>
								<UserPlus size={20} />
								<span>Registrar Usuario</span>
							</>
						)}
					</button>
				</motion.div>
			</motion.form>
		</div>
	);
}
