import { useApp } from "../../../store/AppContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarUsuariosAdmin, eliminarUsuario } from "../../../services/usuario";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import BackPage from "../../paginaCliente/components/BackPage";
import { RUTAS } from "../../../const/routers/routers";
export default function VistaDatosUsuarios() {
	const [usuarios, setUsuarios] = useState([]);
	const navigate = useNavigate();
	const { usuario: usuarioContext } = useApp();

	useEffect(() => {
		if (!usuarioContext?.id) return;

		const fetchUsuarios = async () => {
			try {
				const data = await listarUsuariosAdmin(usuarioContext.id);
				setUsuarios(data);
			} catch (error) {
				console.error("Error al cargar usuarios:", error);
			}
		};

		fetchUsuarios();
	}, [usuarioContext?.id]);

	const handleEditar = (item) => {
		navigate(RUTAS.ADMIN.USUARIOS.CREAR_USUARIO, {
			state: { usuarios: item },
		});
	};


	const handleEliminar = async (id) => {
		const result = await Swal.fire({
			title: "¿Seguro que quieres eliminar este usuario?",
			text: "¡No podrás revertir esto!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
		});
		if (result.isConfirmed) {
			try {
				await eliminarUsuario(usuarioContext.id, id);
				setUsuarios((prev) => prev.filter((u) => u.id !== id));
				Swal.fire("Eliminado!", "El usuario fue eliminado.", "success");
			} catch (error) {
				console.error(error);
				Swal.fire("Error", "No se pudo eliminar el usuario", "error");
			}
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="p-4 sm:p-6 max-w-7xl mx-auto"
		>
			{/* Encabezado */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
				<BackPage rol={usuarioContext?.rol} />
				<h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center sm:text-left flex-1">
					Usuarios registrados
				</h1>
				<button
					onClick={() => navigate(RUTAS.ADMIN.USUARIOS.CREAR_USUARIO)}
					className="bg-[#5a8aad] hover:bg-[#013459] text-white font-medium px-4 py-2.5 rounded-lg shadow transition duration-200 w-full sm:w-auto"
					style={{ minWidth: '150px' }} // que no sea muy chiquito en móvil
				>
					+ Nuevo usuario
				</button>
			</div>

			{/* Tabla */}
			<div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 bg-white">
				<table className="min-w-full text-sm text-left text-gray-700">
					<thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
						<tr>
							<th className="px-4 py-3 border-b">Nombre</th>
							<th className="px-4 py-3 border-b">Usuario</th>
							<th className="px-4 py-3 border-b">Rol</th>
							<th className="px-4 py-3 border-b text-center">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{usuarios.map((u) => (
							<tr
								key={u.id}
								className="hover:bg-gray-50 transition duration-150"
							>
								<td className="px-4 py-3 border-b">{u.nombre_completo}</td>
								<td className="px-4 py-3 border-b">{u.usuario}</td>
								<td className="px-4 py-3 border-b capitalize">{u.rol}</td>
								<td className="px-4 py-3 border-b">
									<div className="flex flex-wrap justify-center gap-2 sm:justify-start">
										<button
											onClick={() => handleEditar(u)}
											className="text-blue-600 hover:text-blue-800 font-semibold whitespace-nowrap"
										>
											Editar
										</button>
										<button
											onClick={() => handleEliminar(u.id)}
											className="text-red-600 hover:text-red-800 font-semibold whitespace-nowrap"
										>
											Eliminar
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>

	);
}
