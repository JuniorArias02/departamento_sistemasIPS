// componente FormularioUsuarios.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { User, Mail, Lock, Shield, ChevronDown, Loader2, Save, UserPlus, UserCircle, Eye, Info, ShieldUser, LockKeyhole, EyeOff, ShieldCheck,PenTool } from "lucide-react";
import { motion } from "framer-motion";
import { CrearUsuario, actualizarUsuario, obtenerUsuario, subirFirmaUsuario } from "../../../services/usuario_service";
import { listarRoles } from "../../../services/rol_services";
import { useApp } from "../../../store/AppContext";
import BackPage from "../../paginaCliente/components/BackPage";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { RUTAS } from "../../../const/routers/routers";
import { PERMISOS } from "../../../secure/permisos/permisos";
import { FirmaInput } from "../../appFirma/appFirmas";

export default function FormularioUsuarios() {
	const { usuario: usuarioContext, permisos } = useApp();
	const navigate = useNavigate();
	const [rol, setRol] = useState([]);
	const location = useLocation();
	const usuarioEdit = location.state?.usuarios;
	const [showPassword, setShowPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [formData, setFormData] = useState({
		nombre_completo: "",
		usuario: "",
		contrasena: "",
		rol_id: "",
		estado: "", // Por defecto activo
		id_usuario_editor: usuarioContext.id,
		id_usuario_objetivo: usuarioEdit?.id || "",
	});

	const [loading, setLoading] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
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
			if (usuarioEdit && usuarioContext?.id) {
				try {
					const data = await obtenerUsuario(usuarioContext.id, usuarioEdit.id);
					setFormData({
						nombre_completo: data.nombre_completo,
						usuario: data.usuario,
						contrasena: "",
						estado: data.estado,
						rol_id: data.rol_id,
						id_usuario_editor: usuarioContext.id,
						id_usuario_objetivo: usuarioEdit.id,
					});
				} catch (error) {
					console.error("Error al cargar datos para edición:", error.message);
					Swal.fire({
						icon: "error",
						title: "Error",
						text: "No se pudieron cargar los datos del usuario",
					});
				}
			}
		};
		fetchUsuario();
	}, [usuarioEdit, usuarioContext.id]);

	const calculatePasswordStrength = (password) => {
		let strength = 0;
		if (password.length > 0) strength += 1;
		if (password.length >= 8) strength += 1;
		if (/[A-Z]/.test(password)) strength += 1;
		if (/[0-9]/.test(password)) strength += 1;
		if (/[^A-Za-z0-9]/.test(password)) strength += 1;
		return strength;
	};


	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));

		if (name === 'contrasena') {
			setPasswordStrength(calculatePasswordStrength(value));
		}
	};

	const base64ToFile = (base64, filename) => {
		const arr = base64.split(",");
		const mime = arr[0].match(/:(.*?);/)[1];
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
		if (loading) return;

		setLoading(true);

		if (!formData.nombre_completo.trim() || !formData.usuario.trim() || !formData.rol_id || !formData.estado) {
			Swal.fire({
				icon: "warning",
				title: "Campos incompletos",
				text: "Por favor, completa todos los campos obligatorios.",
			});
			setLoading(false);
			return;
		}

		try {
			let usuarioCreado;

			if (usuarioEdit) {
				await actualizarUsuario({
					...formData,
					id_usuario_editor: usuarioContext.id,
					id_usuario_objetivo: usuarioEdit.id,
				});
				usuarioCreado = { id: usuarioEdit.id };
				Swal.fire({
					icon: "success",
					title: "¡Usuario actualizado!",
					text: "Los cambios se guardaron correctamente",
					timer: 2000,
					showConfirmButton: false,
				});
			} else {
				// primero creas usuario
				const res = await CrearUsuario({
					...formData,
					id_usuario_creador: usuarioContext.id,
				});
				usuarioCreado = res; // asumiendo que el backend te devuelve el usuario creado con su ID

				Swal.fire({
					icon: "success",
					title: "¡Usuario creado!",
					text: "El usuario se registró correctamente",
					timer: 2000,
					showConfirmButton: false,
				});
			}

			// si hay firma, la subimos
			if (formData.firma_personal_cargo) {
				const file = base64ToFile(formData.firma_personal_cargo, "firma.png");
				const fd = new FormData();
				fd.append("usuario_id", usuarioCreado.id); // ID del usuario
				fd.append("firma_digital", file);

				await subirFirmaUsuario(fd);
			}

			// reset form
			setFormData({
				nombre_completo: "",
				usuario: "",
				contrasena: "",
				rol_id: "",
				estado: "",
				firma_personal_cargo: "", // limpiar firma también
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
		<div className="min-h-[calc(100vh-80px)] p-4 bg-gradient-to-br from-gray-50/50 to-indigo-50/20">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4 }}
				className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
			>
				{/* Tarjeta de Información Principal */}
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1, duration: 0.4 }}
					className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-gray-200/70 overflow-hidden"
				>
					<div className="p-6 space-y-6">
						{/* Encabezado con efecto gradiente */}
						<div className="relative">
							<BackPage
								isEdit={true}
								className="text-indigo-600 hover:text-indigo-800 transition-colors mb-4"
							/>
							<div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-indigo-100/30 blur-xl z-0"></div>
							<div className="relative z-10">
								<h2 className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent">
									{usuarioEdit ? "Editar Usuario" : "Nuevo Usuario"}
								</h2>
								<p className="text-gray-500 mt-1 text-sm">
									{usuarioEdit ? "Actualiza la información" : "Registra un nuevo usuario"}
								</p>
							</div>
						</div>

						{/* Campos del formulario */}
						<div className="space-y-4">
							{/* Campo Nombre */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<User size={16} className="text-indigo-500" />
									Nombre Completo
								</label>
								<div className="relative">
									<input
										type="text"
										name="nombre_completo"
										value={formData.nombre_completo}
										onChange={handleChange}
										className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-gray-400"
										placeholder="Ej: Juan Pérez"
										required
									/>
									<User size={16} className="absolute left-3 top-3 text-gray-400" />
								</div>
							</div>

							{/* Campo Usuario */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<ShieldUser size={16} className="text-indigo-500" />
									Nombre de Usuario
								</label>
								<div className="relative">
									<input
										type="text"
										name="usuario"
										value={formData.usuario}
										onChange={handleChange}
										className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-gray-400"
										placeholder="Ej: juan.perez"
										required
									/>
									<ShieldUser size={16} className="absolute left-3 top-3 text-gray-400" />
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.15, duration: 0.4 }}
					className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-gray-200/70 overflow-hidden"
				>
					<div className="p-6">
						<div className="relative">
							<div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-violet-100/30 blur-xl z-0"></div>
							<div className="relative z-10">
								<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
									<PenTool size={18} className="text-violet-500" />
									Firma Personal
								</h3>
							</div>
						</div>
						<FirmaInput
							value={formData.firma_personal_cargo}
							onChange={(value) =>
								setFormData({ ...formData, firma_personal_cargo: value })
							}
							label="Firma personal/cargo"
						/>
					</div>
				</motion.div>

				{/* Tarjeta de Seguridad y Rol */}
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-gray-200/70 overflow-hidden"
				>
					<div className="p-6 space-y-6">
						{/* Encabezado */}
						<div className="relative">
							<div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-violet-100/30 blur-xl z-0"></div>
							<div className="relative z-10">
								<h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
									<LockKeyhole size={18} className="text-violet-500" />
									Seguridad y Permisos
								</h3>
							</div>
						</div>

						{/* Campos */}
						<div className="space-y-4">
							{/* Campo Contraseña */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<Lock size={16} className="text-indigo-500" />
									Contraseña
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										name="contrasena"
										value={formData.contrasena}
										onChange={handleChange}
										className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-gray-400"
										placeholder={usuarioEdit ? "Dejar en blanco para no cambiar" : "Mínimo 8 caracteres"}
									/>
									<div className="mt-2">
										<div className="flex gap-1 h-1">
											{[1, 2, 3, 4, 5].map((i) => (
												<div
													key={i}
													className={`flex-1 rounded-full ${i <= passwordStrength
														? passwordStrength < 3
															? 'bg-red-400'
															: passwordStrength < 5
																? 'bg-yellow-400'
																: 'bg-green-500'
														: 'bg-gray-200'
														}`}
												/>
											))}
										</div>
										<p className="text-xs mt-1 text-gray-500">
											{passwordStrength === 0 ? 'Ninguna' :
												passwordStrength < 3 ? 'Débil' :
													passwordStrength < 5 ? 'Moderada' : 'Fuerte'}
										</p>
									</div>

									<Lock size={16} className="absolute left-3 top-3 text-gray-400" />
									<button
										type="button"
										className="absolute right-3 top-3 text-gray-400 hover:text-indigo-600 transition-colors"
										onClick={togglePasswordVisibility}
									>
										{showPassword ? (
											<EyeOff size={16} />
										) : (
											<Eye size={16} />
										)}
									</button>
								</div>
							</div>

							{/* Selector de Rol */}
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<Shield size={16} className="text-indigo-500" />
									Rol del Usuario
								</label>
								<div className="relative">
									<select
										name="rol_id"
										value={formData.rol_id}
										onChange={handleChange}
										className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent appearance-none transition-all"

									>
										<option value="">Selecciona un rol</option>
										{(rol || []).map((r) => (
											<option key={r.id} value={r.id}>
												{r.nombre}
											</option>
										))}
									</select>
									<Shield size={16} className="absolute left-3 top-3 text-gray-400" />
									<ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
								</div>
							</div>
							<div className="space-y-2">
								<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
									<ShieldCheck size={16} className="text-indigo-500" />
									Estado del Usuario
								</label>
								<div className="relative">
									<select
										name="estado"
										value={formData.estado}
										onChange={handleChange}
										className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent appearance-none transition-all"
									>
										<option value="">Selecciona un estado</option>
										<option value="1">Activo</option>
										<option value="0">Inactivo</option>
									</select>
									<ShieldCheck size={16} className="absolute left-3 top-3 text-gray-400" />
									<ChevronDown size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
								</div>
							</div>

						</div>
					</div>
				</motion.div>

				{/* Tarjeta de Acción (ocupa todo el ancho) */}
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.4 }}
					className="md:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-gray-200/70 overflow-hidden"
				>
					<div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
						<div className="text-sm text-gray-500">
							{usuarioEdit ? "Actualiza los datos del usuario" : "Completa todos los campos requeridos"}
						</div>
						{((usuarioEdit && permisos.includes(PERMISOS.USUARIOS.EDITAR)) ||
							(!usuarioEdit && permisos.includes(PERMISOS.USUARIOS.CREAR))) && (
								<motion.button
									type="submit"
									onClick={handleSubmit}
									disabled={loading}
									whileHover={!loading ? { scale: 1.03 } : {}}
									whileTap={!loading ? { scale: 0.97 } : {}}
									className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-lg shadow-md hover:shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-70"
								>
									{loading ? (
										<>
											<Loader2 size={18} className="animate-spin" />
											Procesando...
										</>
									) : usuarioEdit ? (
										<>
											<Save size={18} />
											Guardar Cambios
										</>
									) : (
										<>
											<UserPlus size={18} />
											Registrar Usuario
										</>
									)}
								</motion.button>
							)}
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}
