import { useEffect, useState } from "react";
import { listarDispositivosMedicos, eliminarDispositivoMedico, exportarDispositivosMedicos } from "../../../services/dispositivo_medicos";
import Swal from 'sweetalert2';
import BackPage from "../components/BackPage";
import { Download } from "lucide-react";

export default function VistaDatosDispositivosMedicos() {
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

	const handleEliminar = async (id) => {
		Swal.fire({
			title: '¿Estás seguro?',
			text: "Esta acción no se puede deshacer",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
			confirmButtonText: 'Sí, eliminar',
			cancelButtonText: 'Cancelar'
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await eliminarDispositivoMedico(id);
					await fetchDispositivos();

					Swal.fire(
						'Eliminado',
						'El dispositivo ha sido eliminado.',
						'success'
					);
				} catch (error) {
					console.error("Error al eliminar:", error);
					Swal.fire('Error', error.message, 'error');
				}
			}
		});
	};

	const handleExportar = async () => {
		setLoadingExport(true);
		try {
			await exportarDispositivosMedicos();
			Swal.fire({
				icon: 'success',
				title: 'Exportado',
				text: 'Archivo Excel descargado correctamente',
				timer: 1500,
				showConfirmButton: false,
			});
		} catch (error) {
			Swal.fire('Error', error.message, 'error');
		} finally {
			setLoadingExport(false);
		}
	};



	return (
		<div className="max-w-6xl mx-auto p-6 bg-white space-y-6">
			{/* Botón volver */}
			<BackPage />
			{/* Encabezado */}
			<div>
				<h1 className="text-2xl font-bold text-gray-800">Dispositivos Médicos</h1>
				<p className="text-gray-600">Aquí puedes ver los datos y gestionar los dispositivos.</p>
			</div>

			{/* Botón Exportar arriba a la derecha */}
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
					<thead className="bg-gray-100">
						<tr>
							<th className="px-4 py-2">Descripción</th>
							<th className="px-4 py-2">Marca</th>
							<th className="px-4 py-2">Serie</th>
							<th className="px-4 py-2">Registro Sanitario</th>
							<th className="px-4 py-2">Acciones</th>
						</tr>
					</thead>
					<tbody>
						{dispositivos.map((item) => (
							<tr key={item.id} className="border-t">
								<td className="px-4 py-2">{item.descripcion}</td>
								<td className="px-4 py-2">{item.marca}</td>
								<td className="px-4 py-2">{item.serie}</td>
								<td className="px-4 py-2">{item.registro_sanitario}</td>
								<td className="px-4 py-2 space-x-2">
									<button className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm">Editar</button>
									<button
										onClick={() => handleEliminar(item.id)}
										className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
									>
										Eliminar
									</button>
								</td>
							</tr>
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
