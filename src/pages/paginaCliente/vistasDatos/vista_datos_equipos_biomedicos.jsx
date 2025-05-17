import { useEffect, useState } from "react";
import {
	listarEquiposBiomedicos,
	eliminarEquipoBiomedico,
	exportarEquiposBiomedicos,
} from "../../../services/equipo_biomedico";
import Swal from "sweetalert2";
import BackPage from "../components/BackPage";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


export default function VistaDatosEquiposBiomedicos() {
	const navigate = useNavigate();
	const [equipos, setEquipos] = useState([]);
	const [loadingExport, setLoadingExport] = useState(false);
	const fetchData = async () => {
		try {
			const data = await listarEquiposBiomedicos();
			setEquipos(data);
		} catch (err) {
			console.error("Error cargando equipos", err);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleEditar = (item) => {
		navigate("/dashboard/form_equipo_biomedicos", {
			state: { equipoBiomedico: item },
		});
	};

	const handleEliminar = async (id) => {
		Swal.fire({
			title: "¿Estás seguro?",
			text: "Esta acción no se puede deshacer",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await eliminarEquipoBiomedico(id);
					await fetchData();

					Swal.fire(
						"Eliminado",
						"El dispositivo ha sido eliminado.",
						"success",
					);
				} catch (error) {
					console.error("Error al eliminar:", error);
					Swal.fire("Error", error.message, "error");
				}
			}
		});
	};

	const handleExportar = async () => {
		setLoadingExport(true);
		try {
			await exportarEquiposBiomedicos();
			Swal.fire({
				icon: "success",
				title: "Exportado",
				text: "Archivo Excel descargado correctamente",
				timer: 1500,
				showConfirmButton: false,
			});
		} catch (error) {
			Swal.fire("Error", error.message, "error");
		} finally {
			setLoadingExport(false);
		}
	};

	return (
		<div className="max-w-6xl mx-auto p-6 bg-white space-y-6">
			{/* Botón volver */}
			<BackPage />

			{/* Encabezado */}
			<div className="text-center">
				<h1 className="text-2xl font-bold text-gray-800">Equipos Biomédicos</h1>
				<p className="text-gray-600">
					Aquí puedes ver los datos y gestionar los equipos biomédicos.
				</p>
			</div>

			{/* Botón Exportar */}
			<div className="flex justify-end mb-2">
				<button
					onClick={handleExportar}
					disabled={loadingExport}
					className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
				>
					<Download size={20} />
					{loadingExport ? "Exportando..." : "Exportar Excel"}
				</button>
			</div>

			{/* Tabla */}
			<div className="overflow-x-auto">
				<table className="min-w-full border border-gray-200 text-sm sm:text-base">
					<motion.thead
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="bg-gray-100 text-center"
					>
						<tr>
							<th className="px-4 py-2">Nombre</th>
							<th className="px-4 py-2">Marca</th>
							<th className="px-4 py-2">Modelo</th>
							<th className="px-4 py-2">Serie</th>
							<th className="px-4 py-2">Registro Sanitario</th>
							<th className="px-4 py-2">Clas. Riesgo</th>
							<th className="px-4 py-2">Acciones</th>
						</tr>
					</motion.thead>

					<tbody className="text-center">
						{equipos.map((item, i) => (
							<motion.tr
								key={item.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: i * 0.05 }}
								className="border-t"
							>
								<td className="px-4 py-2">{item.nombre_equipo}</td>
								<td className="px-4 py-2">{item.marca}</td>
								<td className="px-4 py-2">{item.modelo}</td>
								<td className="px-4 py-2">{item.serie}</td>
								<td className="px-4 py-2">{item.registro_sanitario}</td>
								<td className="px-4 py-2">{item.clasificacion_riesgo}</td>
								<td className="px-4 py-2 flex flex-col sm:flex-row sm:space-x-2 justify-center items-center space-y-2 sm:space-y-0">
									<button
										onClick={() => handleEditar(item)}
										className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
									>
										Editar
									</button>
									<button
										onClick={() => handleEliminar(item.id)}
										className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
									>
										Eliminar
									</button>
								</td>
							</motion.tr>
						))}

						{equipos.length === 0 && (
							<tr>
								<td colSpan="7" className="text-center py-4 text-gray-500">
									No hay equipos registrados.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>

	);
}
