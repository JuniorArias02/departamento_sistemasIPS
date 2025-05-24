import { useEffect, useState } from "react";
import { listarInventarios, eliminarInventario, exportarInventarios, buscarInventario } from "../../../services/inventario";
import Swal from "sweetalert2";
import BackPage from "../components/BackPage";
import { Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function VistaDatosInventarios() {
	const navigate = useNavigate();
	const [inventarios, setInventarios] = useState([]);
	const [loadingExport, setLoadingExport] = useState(false);
	const [filtroTexto, setFiltroTexto] = useState("");
	const [filtroSede, setFiltroSede] = useState("");
	const [paginaActual, setPaginaActual] = useState(1);
	const itemsPorPagina = 20; // cuantos mostrar por página
	const indexUltimo = paginaActual * itemsPorPagina;
	const indexPrimero = indexUltimo - itemsPorPagina;
	const inventariosPagina = inventarios.slice(indexPrimero, indexUltimo);
	const totalPaginas = Math.ceil(inventarios.length / itemsPorPagina);

	const fetchData = async () => {
		try {
			const data = await listarInventarios();
			setInventarios(data);
		} catch (err) {
			console.error("Error cargando inventarios", err);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleEditar = (item) => {
		navigate("/dashboard/form_inventario", {
			state: { inventario: item },
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
					await eliminarInventario(id);
					await fetchData();
					Swal.fire(
						"Eliminado",
						"El inventario ha sido eliminado.",
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
			await exportarInventarios();
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

	useEffect(() => {
		const delay = setTimeout(() => {
			handleBuscar(); // ejecuta la búsqueda después de 1.5s sin escribir
		}, 1000);

		return () => clearTimeout(delay); // limpia el timeout si sigue escribiendo antes de 1.5s
	}, [filtroTexto, filtroSede]);

	const handleBuscar = async () => {
		try {
			const filtros = {};

			if (filtroTexto) {
				if (filtroTexto.length > 3) {
					filtros.codigo = filtroTexto;
					filtros.serial = filtroTexto;
				} else {
					filtros.codigo = filtroTexto;
				}
			}

			if (filtroSede) {
				filtros.sede_nombre = filtroSede;
			}

			let data;
			// Si no hay filtros, cargar todo
			if (Object.keys(filtros).length === 0) {
				data = await buscarInventario(); // sin filtros, carga todo
			} else {
				data = await buscarInventario(filtros);
			}
			setInventarios(data);
		} catch (err) {
			console.error("Error al buscar inventario", err);
		}
	};


	return (
		<div className="w-full max-w-none mx-auto p-6 bg-white space-y-6">
			{/* Botón volver */}
			<BackPage />

			{/* Encabezado */}
			<div className="text-center">
				<h1 className="text-2xl font-bold text-gray-800">Inventarios</h1>
				<p className="text-gray-600">
					Aquí puedes ver los datos y gestionar los inventarios.
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
				{/* Buscador */}
				<div className="flex flex-col sm:flex-row gap-4 mb-4">
					<input
						type="text"
						placeholder="Código o Serial"
						className="border px-3 py-2 rounded w-full sm:w-1/3"
						value={filtroTexto}
						onChange={(e) => setFiltroTexto(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Nombre de sede"
						className="border px-3 py-2 rounded w-full sm:w-1/3"
						value={filtroSede}
						onChange={(e) => setFiltroSede(e.target.value)}
					/>

					<button
						onClick={handleBuscar}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					>
						Buscar
					</button>
				</div>

				<div className="overflow-x-auto w-full">
					<table className="min-w-[900px] w-full text-sm sm:text-base">
						<motion.thead
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4 }}
							className="bg-gray-100 text-center"
						>
							<tr>
								<th className="px-4 py-2">Código</th>
								<th className="px-4 py-2">Nombre</th>
								<th className="px-4 py-2">Dependencia</th>
								<th className="px-4 py-2">Responsable</th>
								<th className="px-4 py-2">Marca</th>
								<th className="px-4 py-2">Modelo</th>
								<th className="px-4 py-2">Serial</th>
								<th className="px-4 py-2">Sede</th>
								<th className="px-4 py-2">Acciones</th>
							</tr>
						</motion.thead>

						<tbody className="text-center">
							{inventariosPagina.map((item, i) => (
								<motion.tr
									key={item.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: i * 0.05 }}
									className="border-t hover:bg-gray-100 cursor-pointer transition-colors duration-300"
								>
									<td className="px-4 py-2">{item.codigo}</td>
									<td className="px-4 py-2">{item.nombre}</td>
									<td className="px-4 py-2">{item.dependencia}</td>
									<td className="px-4 py-2">{item.responsable}</td>
									<td className="px-4 py-2">{item.marca}</td>
									<td className="px-4 py-2">{item.modelo}</td>
									<td className="px-4 py-2">{item.serial}</td>
									<td className="px-4 py-2">{item.sede_nombre || item.sede_nombre}</td>
									<td className="px-4 py-2 flex flex-col sm:flex-row sm:space-x-2 justify-center items-center space-y-2 sm:space-y-0">
										<button
											onClick={() => handleEditar(item)}
											className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
										>
											Editar
										</button>
										<button
											onClick={() => handleEliminar(item.id)}
											className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
										>
											Eliminar
										</button>
									</td>
								</motion.tr>
							))}

							{inventarios.length === 0 && (
								<tr>
									<td colSpan="9" className="text-center py-4 text-gray-500">
										No hay inventarios registrados.
									</td>
								</tr>
							)}
						</tbody>
					</table>

				</div>
				<div className="flex justify-center gap-2 mt-4 flex-wrap">
					<button
						disabled={paginaActual === 1}
						onClick={() => setPaginaActual(1)}
						className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
					>
						« Primero
					</button>

					<button
						disabled={paginaActual === 1}
						onClick={() => setPaginaActual(paginaActual - 1)}
						className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
					>
						‹ Anterior
					</button>

					{/* Mostrar botón 1 si no está cerca */}
					{paginaActual > 3 && (
						<>
							<button
								onClick={() => setPaginaActual(1)}
								className="px-3 py-1 rounded bg-gray-200"
							>
								1
							</button>
							{paginaActual > 4 && <span className="px-2">...</span>}
						</>
					)}

					{/* Botones alrededor de la página actual */}
					{[paginaActual - 1, paginaActual, paginaActual + 1].map(
						(num) =>
							num > 0 && num <= totalPaginas && (
								<button
									key={num}
									onClick={() => setPaginaActual(num)}
									className={`px-3 py-1 rounded ${paginaActual === num ? "bg-blue-600 text-white" : "bg-gray-200"
										}`}
								>
									{num}
								</button>
							)
					)}

					{/* Mostrar último botón si no está cerca */}
					{paginaActual < totalPaginas - 2 && (
						<>
							{paginaActual < totalPaginas - 3 && <span className="px-2">...</span>}
							<button
								onClick={() => setPaginaActual(totalPaginas)}
								className="px-3 py-1 rounded bg-gray-200"
							>
								{totalPaginas}
							</button>
						</>
					)}

					<button
						disabled={paginaActual === totalPaginas}
						onClick={() => setPaginaActual(paginaActual + 1)}
						className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
					>
						Siguiente ›
					</button>

					<button
						disabled={paginaActual === totalPaginas}
						onClick={() => setPaginaActual(totalPaginas)}
						className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
					>
						Último »
					</button>
				</div>
			</div>
		</div>
	);
}
