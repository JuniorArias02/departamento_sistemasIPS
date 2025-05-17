import { useEffect, useState } from "react";
import {
	listarReactivosVigilancia,
	eliminarReactivoVigilancia,
	exportarReactivosVigilancias,
} from "../../../services/reactivo_vigilancia";
import Swal from "sweetalert2";
import BackPage from "../components/BackPage";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function VistaDatosReactivosVigilancia() {
	const navigate = useNavigate();
	const [reactivos, setReactivos] = useState([]);
	const [loadingExport, setLoadingExport] = useState(false);
	const fetchReactivos = async () => {
		try {
			const data = await listarReactivosVigilancia();
			setReactivos(data);
		} catch (error) {
			console.error("Error al cargar los reactivos:", error);
		}
	};
	useEffect(() => {
		fetchReactivos();
	}, []);

	const handleEditar = (item) => {
		navigate("/dashboard/form_medicamento", {
			state: { reactivoVigilancia: item },
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
					await eliminarReactivoVigilancia(id);
					await fetchReactivos();

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
			await exportarReactivosVigilancias();
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
			{/* Botón de volver */}
			<BackPage />
			{/* Encabezado */}
			<div>
				<h1 className="text-2xl font-bold text-gray-800">
					Reactivos y Vigilancia
				</h1>
				<p className="text-gray-600">
					Aquí puedes ver los datos y gestionar los reactivos.
				</p>
			</div>

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
				<table className="w-full text-left border border-gray-200">
					<motion.thead
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="bg-gray-100 text-center"
					>
						<tr>
							<th className="px-4 py-2">Nombre</th>
							<th className="px-4 py-2">Marca</th>
							<th className="px-4 py-2">Presentación</th>
							<th className="px-4 py-2">Registro Sanitario</th>
							<th className="px-4 py-2">Clasificación Riesgo</th>
							<th className="px-4 py-2">Vida Útil</th>
							<th className="px-4 py-2">Fecha Vencimiento</th>
							<th className="px-4 py-2">Lote</th>
							<th className="px-4 py-2 whitespace-nowrap">Acciones</th>

						</tr>
					</motion.thead>
					<tbody>
						{reactivos.map((item, i) => (
							<motion.tr
								key={item.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: i * 0.05 }}
								className="border-t"
							>
								<td className="px-4 py-2">{item.nombre}</td>
								<td className="px-4 py-2">{item.marca}</td>
								<td className="px-4 py-2">{item.presentacion_comercial}</td>
								<td className="px-4 py-2">{item.registro_sanitario}</td>
								<td className="px-4 py-2">{item.clasificacion_riesgo}</td>
								<td className="px-4 py-2">{item.vida_util}</td>
								<td className="px-4 py-2">{item.fecha_vencimiento}</td>
								<td className="px-4 py-2">{item.lote}</td>
								<td className="px-4 py-2 space-x-2 whitespace-nowrap">

									<button
										onClick={() => handleEditar(item)}
										className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
									>
										Editar
									</button>
									<button
										onClick={() => handleEliminar(item.id)}
										className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
									>
										Eliminar
									</button>
								</td>
							</motion.tr>
						))}
						{reactivos.length === 0 && (
							<tr>
								<td colSpan="9" className="text-center py-4 text-gray-500">
									No hay reactivos registrados.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
