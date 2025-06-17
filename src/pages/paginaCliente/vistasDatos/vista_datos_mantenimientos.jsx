import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import BackPage from "../components/BackPage";
import { listarMantenimientos,actualizarEstadoMantenimiento } from "../../../services/mantenimiento_services";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../../../store/AppContext";
import { RUTAS } from "../../../const/routers/routers";
import {
	Eye,
	Edit,
	Calendar,
	User,
	Warehouse,
	CheckCircle,
	Clock
} from 'lucide-react';

export default function VistaDatosMantenimiento() {
	const navigate = useNavigate();
	const { usuario } = useApp();
	const [mantenimientos, setMantenimientos] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await listarMantenimientos(usuario.id);
			setMantenimientos(response.data);
		} catch (error) {
			console.error("Error cargando mantenimientos", error);
			Swal.fire("Error", error.message, "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [usuario.id]);

	const handleVerDetalle = (mantenimiento) => {
		navigate(RUTAS.USER.MANTENIMIENTO.VER_DETALLES, {
			state: { mantenimientos: mantenimiento }
		});
	};

	const handleToggleRevisado = async (id, estaRevisadoActual) => {
		const nuevoEstado = !estaRevisadoActual;
		const estadoTexto = nuevoEstado ? "revisado" : "pendiente";
		const { isConfirmed } = await Swal.fire({
			title: `¿Marcar como ${estadoTexto}?`,
			text: `Estás a punto de cambiar el estado a ${estadoTexto}`,
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: `Sí, marcar como ${estadoTexto}`,
			cancelButtonText: 'Cancelar'
		});

		if (!isConfirmed) return;

		try {
			// Mostrar loader mientras se procesa
			Swal.fire({
				title: 'Actualizando estado...',
				allowOutsideClick: false,
				didOpen: () => {
					Swal.showLoading();
				}
			});

			await actualizarEstadoMantenimiento(id, {
				esta_revisado: nuevoEstado ? 1 : 0,
				usuario_id: usuario.id
			});

			// Actualizar estado local optimizado
			setMantenimientos(prev => prev.map(item =>
				item.id === id ? {
					...item,
					esta_revisado: nuevoEstado,
					revisado_por: nuevoEstado ? usuario.id : null,
					fecha_revisado: nuevoEstado ? new Date().toISOString() : null,
					nombre_revisor: nuevoEstado ? usuario.nombre_completo : null
				} : item
			));

			// Notificación de éxito
			Swal.fire(
				'¡Actualizado!',
				`El estado se cambió a ${estadoTexto} correctamente.`,
				'success'
			);
		} catch (error) {
			console.error('Error:', error);
			Swal.fire(
				'Error',
				error.response?.data?.message ||
				'Ocurrió un error al actualizar el estado',
				'error'
			);
		}
	};
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
			<BackPage />

			{/* Encabezado mejorado */}
			<header className="text-center space-y-3">
				<h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
					IPS CLINICAL HOUSE
				</h1>
				<p className="text-lg text-gray-600">
					Listado de mantenimientos registrados
				</p>
				<div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-teal-300 mx-auto rounded-full"></div>
			</header>

			{/* Estado vacío */}
			{mantenimientos.length === 0 ? (
				<div className="text-center py-16 bg-gray-50 rounded-xl">
					<ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
					<h3 className="mt-4 text-lg font-medium text-gray-900">
						No hay mantenimientos registrados
					</h3>
					<p className="mt-1 text-gray-500">
						Cuando registres mantenimientos aparecerán aquí
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{mantenimientos.map((item) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							whileHover={{ y: -5 }}
							transition={{ duration: 0.3 }}
							className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 relative border-t-4 ${item.esta_revisado
									? 'border-green-500'
									: 'border-yellow-500'
								}`}
						>
							<div className="p-6">
								{/* Encabezado de tarjeta */}
								<div className="flex justify-between items-start">
									<h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
										{item.titulo}
									</h3>
									<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.esta_revisado
											? 'bg-green-100 text-green-800'
											: 'bg-yellow-100 text-yellow-800'
										}`}>
										{item.esta_revisado ? '✓ Revisado' : '⌛ Pendiente'}
									</span>
								</div>

								{/* Descripción */}
								<p className="mt-3 text-gray-600 line-clamp-3">
									{item.descripcion}
								</p>

								{/* Metadatos */}
								<div className="mt-4 space-y-3">
									<div className="flex items-start">
										<Warehouse className="flex-shrink-0 h-4 w-4 text-gray-400 mt-0.5 mr-2" />
										<span className="text-sm text-gray-600">
											{item.nombre_sede || 'Sede no especificada'}
										</span>
									</div>
									<div className="flex items-start">
										<User className="flex-shrink-0 h-4 w-4 text-gray-400 mt-0.5 mr-2" />
										<span className="text-sm text-gray-600">
											{item.nombre_receptor_completo || 'Receptor no asignado'}
										</span>
									</div>
									<div className="flex items-start">
										<Calendar className="flex-shrink-0 h-4 w-4 text-gray-400 mt-0.5 mr-2" />
										<span className="text-sm text-gray-600">
											{new Date(item.fecha_creacion).toLocaleDateString('es-ES', {
												day: 'numeric',
												month: 'long',
												year: 'numeric'
											})}
										</span>
									</div>
								</div>

								{/* Acciones */}
								<div className="mt-6 flex justify-between space-x-3">
									<button
										onClick={() => handleVerDetalle(item)}
										className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
										aria-label={`Ver detalles de ${item.titulo}`}
									>
										<Eye className="mr-1.5 h-4 w-4" />
										Detalles
									</button>

									<button
										onClick={() => handleToggleRevisado(item.id, item.esta_revisado)}
										className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${item.esta_revisado
												? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:ring-yellow-500"
												: "text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500"
											}`}
									>
										{item.esta_revisado ? (
											<>
												<Clock className="mr-1.5 h-4 w-4" />
												Pendiente
											</>
										) : (
											<>
												<CheckCircle className="mr-1.5 h-4 w-4" />
												Revisado
											</>
										)}
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			)}
		</div>
	);
}