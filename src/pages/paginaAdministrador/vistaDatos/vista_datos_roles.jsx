import { useEffect, useState } from "react";
import { listarRoles_completo } from "../../../services/rol_services";
import Swal from "sweetalert2";
import BackPage from "../../paginaCliente/components/BackPage";
import { Edit, Trash2, Shield, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RUTAS } from "../../../const/routers/routers";
export default function VistaDatosRoles() {
	const navigate = useNavigate();
	const [roles, setRoles] = useState([]);
	const [totalRoles, setTotalRoles] = useState(0);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			// 1. Hacer la petición a la API
			const response = await listarRoles_completo();

			// 2. Verificar que la respuesta tiene el formato esperado
			if (response && response.success && Array.isArray(response.rol)) {
				// 3. Acceder a la propiedad "rol" que contiene el array de roles
				setRoles(response.rol);

				// 4. Acceder a la propiedad "count" para el total
				setTotalRoles(response.count);
			} else {
				throw new Error("Formato de datos inesperado");
			}
		} catch (error) {
			console.error("Error cargando roles", error);
			Swal.fire("Error", "No se pudieron cargar los roles", "error");
			setRoles([]);
			setTotalRoles(0);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleCrearNuevo = () => {
		navigate(RUTAS.ADMIN.ROLES.CREAR_ROL);
	};

	const handleEditar = (id) => {
		navigate(`/dashboard/roles/editar/${id}`);
	};

	const handleEliminar = async (id) => {
		Swal.fire({
			title: "¿Estás seguro?",
			text: "Esta acción eliminará el rol permanentemente",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await fetchData();
					Swal.fire("Eliminado", "El rol ha sido eliminado", "success");
				} catch (error) {
					Swal.fire("Error", error.message, "error");
				}
			}
		});
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white space-y-6 rounded-lg shadow-sm">
			<BackPage />

			<div className="text-center">
				<h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
					<Shield size={24} />
					Roles del Sistema
				</h1>
				<p className="text-gray-600 mt-1">
					Listado de todos los roles disponibles
				</p>
			</div>

			<div className="flex justify-between items-center mb-4">
				<div className="text-sm text-gray-500">
					Total roles: {totalRoles}
				</div>

				<button
					onClick={handleCrearNuevo}
					className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
				>
					<Plus size={18} />
					Nuevo Rol
				</button>
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			) : (
				<div className="overflow-x-auto rounded-lg border border-gray-200">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									ID
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Nombre del Rol
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Acciones
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{roles.map((rol) => (
								<motion.tr
									key={rol.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
									className="hover:bg-gray-50"
								>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{rol.id}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
												<Shield className="h-4 w-4 text-blue-600" />
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900 capitalize">
													{rol.nombre.toLowerCase()}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div className="flex justify-end space-x-2">
											<button
												onClick={() => handleEditar(rol.id)}
												className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
											>
												<Edit size={16} />
												<span className="hidden sm:inline">Editar</span>
											</button>
											<button
												onClick={() => handleEliminar(rol.id)}
												className="text-red-600 hover:text-red-900 flex items-center gap-1"
											>
												<Trash2 size={16} />
												<span className="hidden sm:inline">Eliminar</span>
											</button>
										</div>
									</td>
								</motion.tr>
							))}
							{roles.length === 0 && (
								<tr>
									<td colSpan="3" className="text-center py-4 text-gray-500">
										No hay roles registrados
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}