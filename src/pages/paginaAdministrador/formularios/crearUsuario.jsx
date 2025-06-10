// componente FormularioUsuarios.jsx
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { CrearUsuario, actualizarUsuario, obtenerUsuario } from "../../../services/usuario";
import { listarRoles } from "../../../services/rolServices";
import { useApp } from "../../../store/AppContext";
import BackPage from "../../paginaCliente/components/BackPage";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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
				navigate("/dashboard/view_usuarios");
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
		<form
			onSubmit={handleSubmit}
			className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-2xl space-y-6"
		>
			<BackPage isEdit={true} />
			<h2 className="text-2xl font-semibold text-center text-gray-800">
				{usuarioEdit ? "Editar Usuario" : "Registrar Usuario"}
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{Object.entries(formData).map(([campo, valor], i) => {
					if (campo === "rol_id" || campo === "id_usuario_editor" || campo === "id_usuario_objetivo")
						return null;
					return (
						<motion.div
							key={campo}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.05 }}
							className="flex flex-col gap-1"
						>
							<label
								htmlFor={campo}
								className="text-sm font-medium text-gray-700 capitalize"
							>
								{campo.replace(/_/g, " ")}
							</label>

							<input
								type={
									campo === "correo"
										? "email"
										: campo === "contrasena"
											? "password"
											: "text"
								}
								id={campo}
								name={campo}
								value={valor}
								onChange={handleChange}
								className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder={campo.replace(/_/g, " ")}
							/>
						</motion.div>
					);
				})}

				{/* Select para rol */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: Object.keys(formData).length * 0.05 }}
					className="flex flex-col gap-1"
				>
					<label
						htmlFor="rol_id"
						className="text-sm font-medium text-gray-700 capitalize"
					>
						Rol
					</label>

					<select
						id="rol_id"
						name="rol_id"
						value={formData.rol_id}
						onChange={handleChange}
						className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Selecciona un rol</option>
						{(rol || []).map((r) => (
							<option key={r.id} value={r.id}>
								{r.nombre}
							</option>
						))}
					</select>
				</motion.div>
			</div>

			<div className="flex justify-end">
				<button
					type="submit"
					disabled={loading}
					className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? (
						<>
							<Loader2 className="animate-spin" size={20} />
							{usuarioEdit ? "Actualizando..." : "Guardando..."}
						</>
					) : (
						<>
							<Save size={20} />
							{usuarioEdit ? "Actualizar" : "Registrar"}
						</>
					)}
				</button>
			</div>
		</form>
	);
}
