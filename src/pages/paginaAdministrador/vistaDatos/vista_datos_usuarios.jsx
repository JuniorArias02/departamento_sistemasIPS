import { useApp } from "../../../store/AppContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarUsuariosAdmin, eliminarUsuario } from "../../../services/usuario";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import BackPage from "../../paginaCliente/components/BackPage";
import { RUTAS } from "../../../const/routers/routers";
import { UserPlus, Pencil, Trash2, Eye, Search, Filter, Download, UserX, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, User } from "lucide-react";
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
			transition={{ duration: 0.4 }}
			className="p-4 sm:p-6 max-w-7xl mx-auto"
		>
			{/* Encabezado mejorado */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
				<div className="flex items-center gap-4">
					<BackPage rol={usuarioContext?.rol} className="text-indigo-600 hover:text-indigo-800" />
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-800 bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent">
							Gestión de Usuarios
						</h1>
						<p className="text-sm text-gray-500 mt-1">
							Administra los usuarios registrados en el sistema
						</p>
					</div>
				</div>

				<button
					onClick={() => navigate(RUTAS.ADMIN.USUARIOS.CREAR_USUARIO)}
					className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium px-5 py-3 rounded-xl shadow-lg hover:shadow-indigo-200 transition-all duration-300 flex items-center gap-2 w-full md:w-auto"
				>
					<UserPlus size={18} />
					<span>Nuevo usuario</span>
				</button>
			</div>

			{/* Tarjeta contenedora moderna */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
				{/* Barra de herramientas */}
				<div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
					<div className="relative w-full sm:w-64">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar usuarios..."
							className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					<div className="flex items-center gap-2">
						<button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
							<Filter size={18} className="text-gray-600" />
						</button>
						<button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
							<Download size={18} className="text-gray-600" />
						</button>
					</div>
				</div>

				{/* Tabla rediseñada */}
				<div className="overflow-x-auto">
					<table className="w-full text-left">
						<thead className="bg-gradient-to-r from-indigo-50 to-violet-50 text-gray-600">
							<tr>
								<th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Usuario</th>
								<th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Rol</th>
								<th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider">Estado</th>
								<th className="px-6 py-4 font-semibold text-sm uppercase tracking-wider text-right">Acciones</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{usuarios.map((u) => (
								<motion.tr
									key={u.id}
									initial={{ opacity: 0, y: 5 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.2 }}
									className="hover:bg-gray-50/80 transition-colors"
								>
									<td className="px-6 py-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
												{u.foto ? (
													<img src={u.foto} alt={u.nombre_completo} className="w-full h-full rounded-full object-cover" />
												) : (
													<User className="w-5 h-5 text-indigo-600" />
												)}
											</div>
											<div>
												<div className="font-medium text-gray-800">{u.nombre_completo}</div>
												<div className="text-sm text-gray-500">{u.usuario}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<span className={`px-2.5 py-1 rounded-full text-xs font-medium ${u.rol === 'admin'
											? 'bg-indigo-100 text-indigo-800'
											: u.rol === 'editor'
												? 'bg-purple-100 text-purple-800'
												: 'bg-gray-100 text-gray-800'
											}`}>
											{u.rol}
										</span>
									</td>
									<td className="px-6 py-4">
										<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
											}`}>
											{u.activo ? (
												<>
													<span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
													Activo
												</>
											) : (
												<>
													<span className="w-2 h-2 rounded-full bg-gray-500 mr-1.5"></span>
													Inactivo
												</>
											)}
										</span>
									</td>
									<td className="px-6 py-4 text-right">
										<div className="flex justify-end gap-2">
											<button
												onClick={() => handleEditar(u)}
												className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
												title="Editar"
											>
												<Pencil size={16} />
											</button>
											<button
												onClick={() => handleEliminar(u.id)}
												className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
												title="Eliminar"
											>
												<Trash2 size={16} />
											</button>
										</div>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Paginación mejorada */}
				<div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
					<div className="text-sm text-gray-500">
						Mostrando <span className="font-medium">1-10</span> de <span className="font-medium">25</span> usuarios
					</div>
					<div className="flex gap-1">
						<button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors">
							<ChevronsLeft size={16} />
						</button>
						<button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors">
							<ChevronLeft size={16} />
						</button>
						<button className="w-10 h-10 rounded-lg bg-indigo-600 text-white font-medium">
							1
						</button>
						<button className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
							2
						</button>
						<button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors">
							<ChevronRight size={16} />
						</button>
						<button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 transition-colors">
							<ChevronsRight size={16} />
						</button>
					</div>
				</div>
			</div>

			{/* Estado vacío (opcional) */}
			{usuarios.length === 0 && (
				<div className="mt-12 text-center">
					<div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
						<UserX size={40} className="text-indigo-400" />
					</div>
					<h3 className="text-lg font-medium text-gray-800">No hay usuarios registrados</h3>
					<p className="text-gray-500 mt-1 mb-4">Crea tu primer usuario para comenzar</p>
					<button
						onClick={() => navigate(RUTAS.ADMIN.USUARIOS.CREAR_USUARIO)}
						className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition-all duration-300 inline-flex items-center gap-2"
					>
						<UserPlus size={16} />
						<span>Agregar usuario</span>
					</button>
				</div>
			)}
		</motion.div>
	);
}
