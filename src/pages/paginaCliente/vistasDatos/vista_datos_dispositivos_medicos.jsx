import { useEffect, useState } from "react";
import {
	listarDispositivosMedicos,
	eliminarDispositivoMedico,
	exportarDispositivosMedicos,
} from "../../../services/dispositivo_medicos";
import Swal from "sweetalert2";
import BackPage from "../components/BackPage";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


export default function VistaDatosDispositivosMedicos() {
	const navigate = useNavigate();

	const [dispositivos, setDispositivos] = useState([]);
	const [loadingExport, setLoadingExport] = useState(false);
	const fetchDispositivos = async () => {
		try {
			const data = await listarDispositivosMedicos();
			setDispositivos(data);
		} catch (error) {
			console.error("Error al cargar dispositivos:", error);
		}
	};

	useEffect(() => {
		fetchDispositivos();
	}, []);

	const handleEditar = (item) => {
		navigate("/dashboard/form_dispositivo_medicos	", {
			state: { dispositivo: item },
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
					await eliminarDispositivoMedico(id);
					await fetchDispositivos();

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
			await exportarDispositivosMedicos();
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
		<div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white space-y-6">
			{/* Botón volver */}
			<BackPage />

			{/* Encabezado centrado */}
			<div className="text-center">
				<h1 className="text-2xl font-bold text-gray-800">Dispositivos Médicos</h1>
				<p className="text-gray-600">
					Aquí puedes ver los datos y gestionar los dispositivos.
				</p>
			</div>

			{/* Botón Exportar */}
			<div className="flex justify-center sm:justify-end">
				<button
					onClick={handleExportar}
					disabled={loadingExport}
					className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<Download size={20} />
					{loadingExport ? "Exportando..." : "Exportar Excel"}
				</button>
			</div>

			{/* Tabla responsive */}
			<div className="overflow-x-auto">
				<table className="min-w-full border border-gray-200 text-sm sm:text-base">
					<motion.thead
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="bg-gray-100 text-center"
					>
						<tr>
							<th className="px-4 py-2">Descripción</th>
							<th className="px-4 py-2">Marca</th>
							<th className="px-4 py-2">Serie</th>
							<th className="px-4 py-2">Registro Sanitario</th>
							<th className="px-4 py-2">Acciones</th>
						</tr>
					</motion.thead>
					<tbody className="text-center">
						{dispositivos.map((item, i) => (
							<motion.tr
								key={item.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: i * 0.05 }}
								className="border-t"
							>
								<td className="px-4 py-2">{item.descripcion}</td>
								<td className="px-4 py-2">{item.marca}</td>
								<td className="px-4 py-2">{item.serie}</td>
								<td className="px-4 py-2">{item.registro_sanitario}</td>
								<td className="px-4 py-2 space-y-1 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row justify-center">
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

						{dispositivos.length === 0 && (
							<tr>
								<td colSpan="5" className="text-center py-4 text-gray-500">
									No hay dispositivos registrados.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
