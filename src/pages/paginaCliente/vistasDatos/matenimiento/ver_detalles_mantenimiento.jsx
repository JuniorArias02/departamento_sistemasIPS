import { useLocation } from 'react-router-dom';
import {
	ArrowLeft,
	Calendar,
	User,
	CheckCircle,
	Clock,
	HardDrive,
	Building,
	FileText,
	AlertCircle,
	Clipboard,
	Hash,
	Maximize2, Users,

} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import BackPage from '../../components/BackPage';
import { useNavigate } from 'react-router-dom';
import { URL_PATH } from '../../../../const/api';
import { actualizarEstadoMantenimiento } from '../../../../services/mantenimiento_services';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { useApp } from '../../../../store/AppContext';
import { PERMISOS } from '../../../../secure/permisos/permisos';

export default function DetalleMantenimiento() {
	const { state } = useLocation();
	const { usuario, permisos } = useApp();
	const navigate = useNavigate();
	const [mantenimiento, setMantenimiento] = useState(state?.mantenimientos);

	const item = mantenimiento;


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

			setMantenimiento(prev => ({
				...prev,
				esta_revisado: nuevoEstado,
				revisado_por: nuevoEstado ? usuario.id : null,
				fecha_revisado: nuevoEstado ? new Date().toISOString() : null,
				nombre_revisor: nuevoEstado ? usuario.nombre_completo : null
			}));
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


	if (!item) {
		return (
			<div className="flex justify-center items-center h-64">
				<p className="text-gray-500">No se encontraron datos del mantenimiento</p>
			</div>
		);
	}
	// Formatear fechas
	const formatDate = (dateString) => {
		if (!dateString) return 'No aplica';
		const options = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		};
		return new Date(dateString).toLocaleDateString('es-ES', options);
	};

	return (
		<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
			{/* Botón de volver futurista */}
			<div className="mb-8">
				<button
					onClick={() => navigate(-1)}
					className="group flex items-center gap-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300"
				>
					<div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm group-hover:shadow-md transition-shadow">
						<ArrowLeft size={16} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
					</div>
					<span className="hidden sm:inline">Volver al listado</span>
				</button>
			</div>

			{/* Contenedor principal con efecto neumorfismo */}
			<div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-90 border border-white border-opacity-30">
				{/* Header con gradiente animado */}
				<div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-6 overflow-hidden">
					<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-30"></div>
					<div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<h1 className="text-3xl font-bold text-white drop-shadow-md">{item.titulo}</h1>
							<p className="text-blue-100 mt-1 flex items-center gap-2">
								<Hash size={16} className="opacity-70" />
								<span>{item.codigo || 'Sin código especificado'}</span>
							</p>
						</div>
						<div className={`px-4 py-2 rounded-full backdrop-blur-sm bg-white/10 border border-white/20 flex items-center gap-2 ${item.esta_revisado ? 'text-green-100' : 'text-yellow-100'}`}>
							{item.esta_revisado ? (
								<>
									<CheckCircle size={18} className="shrink-0" />
									<span>Revisado</span>
								</>
							) : (
								<>
									<Clock size={18} className="shrink-0" />
									<span>Pendiente</span>
								</>
							)}
						</div>
					</div>
				</div>

				{/* Contenido principal con layout mejorado */}
				<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 p-8">
					{/* Columna izquierda - Contenido principal */}
					<div className="space-y-8">
						{/* Galería de documentos con diseño moderno */}
						<div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
							<div className="bg-gradient-to-b from-gray-50 to-gray-100 p-6">
								<h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-4">
									<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600">
										<Clipboard size={20} />
									</div>
									<span>Documentación adjunta</span>
								</h2>

								{item.imagen ? (
									<div className="relative group">
										<div className="aspect-video bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
											<img
												src={`${URL_PATH}${item.imagen}`}
												alt={`Mantenimiento ${item.titulo}`}
												className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
											/>
										</div>
										<div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											<button
												onClick={() => window.open(`${URL_PATH}${item.imagen}`, '_blank')}
												className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-full shadow-md hover:bg-gray-50 transition-all"
											>
												<Maximize2 size={16} />
												<span>Expandir</span>
											</button>
										</div>
									</div>
								) : (
									<div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
										<Image className="text-gray-300 mb-3" size={40} />
										<p className="text-gray-400">No hay documentos adjuntos</p>
									</div>
								)}
							</div>
						</div>

						{/* Descripción con markdown y animación */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
						>
							<h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-4">
								<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600">
									<FileText size={20} />
								</div>
								<span>Descripción detallada</span>
							</h2>
							<div className="prose prose-sm max-w-none text-gray-600">
								{item.descripcion ? (
									<ReactMarkdown>{item.descripcion}</ReactMarkdown>
								) : (
									<p className="text-gray-400 italic">No se proporcionó descripción detallada</p>
								)}
							</div>
						</motion.div>
					</div>

					{/* Columna derecha - Metadatos en cards glassmorphism */}
					<div className="space-y-6">
						{/* Card de especificaciones */}
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
							<h2 className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
								<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-100 text-cyan-600">
									<HardDrive size={18} />
								</div>
								<span>Especificaciones</span>
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
									<span className="text-sm text-gray-500">Modelo:</span>
									<span className="text-sm font-medium text-right">{item.modelo || '—'}</span>
								</div>
								<div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
									<span className="text-sm text-gray-500">Dependencia:</span>
									<span className="text-sm font-medium text-right">{item.dependencia || '—'}</span>
								</div>
							</div>
						</div>

						{/* Card de ubicación */}
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
							<h2 className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
								<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-100 text-orange-600">
									<Building size={18} />
								</div>
								<span>Ubicación</span>
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
									<span className="text-sm text-gray-500">Sede:</span>
									<span className="text-sm font-medium text-right">{item.nombre_sede || '—'}</span>
								</div>
							</div>
						</div>

						{/* Card de fechas */}
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
							<h2 className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
								<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600">
									<Calendar size={18} />
								</div>
								<span>Fechas</span>
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
									<span className="text-sm text-gray-500">Creación:</span>
									<span className="text-sm font-medium text-right">
										{new Date(item.fecha_creacion).toLocaleDateString('es-ES', {
											day: '2-digit',
											month: 'short',
											year: 'numeric'
										})}
									</span>
								</div>
								{item.fecha_revisado && (
									<div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
										<span className="text-sm text-gray-500">Revisión:</span>
										<span className="text-sm font-medium text-right">
											{new Date(item.fecha_revisado).toLocaleDateString('es-ES', {
												day: '2-digit',
												month: 'short',
												year: 'numeric'
											})}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Card de responsables */}
						<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
							<h2 className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4">
								<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-pink-100 text-pink-600">
									<Users size={18} />
								</div>
								<span>Responsables</span>
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
									<span className="text-sm text-gray-500">Creado por:</span>
									<span className="text-sm font-medium text-right">{item.nombre_creador || '—'}</span>
								</div>
								<div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
									<span className="text-sm text-gray-500">Receptor:</span>
									<span className="text-sm font-medium text-right">{item.nombre_receptor_completo || '—'}</span>
								</div>
								{item.nombre_revisor && (
									<div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
										<span className="text-sm text-gray-500">Revisor:</span>
										<span className="text-sm font-medium text-right">{item.nombre_revisor}</span>
									</div>
								)}
							</div>
						</div>

						{/* Estado con micro-interacción */}
						<motion.div
							whileHover={{ scale: 1.02 }}
							className={`rounded-2xl p-6 shadow-sm border ${item.esta_revisado ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
								}`}
						>
							<h2 className="flex items-center gap-3 text-lg font-semibold mb-2">
								{item.esta_revisado ? (
									<CheckCircle className="text-green-600" size={20} />
								) : (
									<Clock className="text-yellow-600" size={20} />
								)}
								<span>Estado actual</span>
							</h2>

							<p className="text-sm text-gray-600">
								{item.esta_revisado
									? 'Este mantenimiento ha sido revisado y completado.'
									: 'Este mantenimiento está pendiente de revisión.'}
							</p>

							{!item.esta_revisado && permisos.includes(PERMISOS.MARCAR_REVISADO_MANTENIMIENTO) && (
								<button
									onClick={() => handleToggleRevisado(item.id, item.esta_revisado)}
									className="mt-4 w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
								>
									Marcar como revisado
								</button>
							)}
						</motion.div>

					</div>
				</div>
			</div>
		</div>
	);
}