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
	Clipboard
} from 'lucide-react';
import BackPage from '../../components/BackPage';
import { useNavigate } from 'react-router-dom';
import { URL_PATH } from '../../../../const/api';
export default function DetalleMantenimientoFreezer() {
	const { state } = useLocation();
	const navigate = useNavigate();
	const item = state?.mantenimientos;

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
		<div className="max-w-6xl mx-auto p-6">
			<div className="mb-6">
				<BackPage
					variant="ghost"
					onClick={() => navigate(-1)}
					className="flex items-center gap-2"
				>
					<ArrowLeft size={18} />
					Volver atrás
				</BackPage>
			</div>

			<div className="bg-white rounded-xl shadow-lg overflow-hidden">
				{/* Header */}
				<div className="bg-[#013459] px-6 py-4">
					<div className="flex justify-between items-center">
						<h1 className="text-2xl font-bold text-white">{item.titulo}</h1>
						<span className={`px-3 py-1 rounded-full text-sm font-medium ${item.esta_revisado
							? 'bg-green-100 text-green-800'
							: 'bg-yellow-100 text-yellow-800'
							}`}>
							{item.esta_revisado ? 'Revisado' : 'Pendiente'}
						</span>
					</div>
					<p className="text-blue-100 mt-1">Código: {item.codigo || 'No especificado'}</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
					{/* Columna izquierda - Información principal */}
					<div className="lg:col-span-2 space-y-6">
						{/* Imagen con controles */}
						<div className="border rounded-lg overflow-hidden">
							<div className="bg-gray-100 p-4">
								<h2 className="flex items-center gap-2 font-semibold text-lg mb-3">
									<Clipboard className="text-blue-600" />
									Documentación adjunta
								</h2>
								{item.imagen ? (
									<div className="relative aspect-video max-h-96 bg-black rounded-md overflow-hidden">
										<img
											src={`${URL_PATH}${item.imagen}`}
											alt={`Mantenimiento ${item.titulo}`}
											className="object-contain w-full h-full"
										/>
										<div className="absolute bottom-4 right-4 flex gap-2">
											<button
												onClick={() => window.open(`${URL_PATH}${item.imagen}`, '_blank')}
												className="bg-gray-100 text-gray-800 px-3 py-1 text-sm rounded-md hover:bg-gray-200 transition-colors"
											>
												Ver en tamaño completo
											</button>

										</div>

									</div>
								) : (
									<div className="flex items-center justify-center h-32 bg-gray-50 rounded border border-dashed">
										<p className="text-gray-400">No hay imagen adjunta</p>
									</div>
								)}
							</div>
						</div>

						{/* Descripción */}
						<div className="bg-gray-50 p-5 rounded-lg">
							<h2 className="flex items-center gap-2 font-semibold text-lg mb-3">
								<FileText className="text-blue-600" />
								Descripción detallada
							</h2>
							<p className="text-gray-700 whitespace-pre-line">
								{item.descripcion || 'No se proporcionó descripción.'}
							</p>
						</div>
					</div>

					{/* Columna derecha - Metadatos */}
					<div className="space-y-6">
						{/* Tarjeta de información básica */}
						<div className="bg-gray-50 p-5 rounded-lg border">
							<h2 className="flex items-center gap-2 font-semibold text-lg mb-4">
								<HardDrive className="text-blue-600" />
								Especificaciones
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-500">Modelo:</span>
									<span className="font-medium">{item.modelo || 'No especificado'}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500">Dependencia:</span>
									<span className="font-medium">{item.dependencia || 'No especificado'}</span>
								</div>
							</div>
						</div>

						{/* Tarjeta de ubicación */}
						<div className="bg-gray-50 p-5 rounded-lg border">
							<h2 className="flex items-center gap-2 font-semibold text-lg mb-4">
								<Building className="text-blue-600" />
								Ubicación
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-500">Sede:</span>
									<span className="font-medium">{item.nombre_sede || 'No especificado'}</span>
								</div>
							</div>
						</div>

						{/* Tarjeta de fechas */}
						<div className="bg-gray-50 p-5 rounded-lg border">
							<h2 className="flex items-center gap-2 font-semibold text-lg mb-4">
								<Calendar className="text-blue-600" />
								Fechas
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-500">Creación:</span>
									<span className="font-medium">{formatDate(item.fecha_creacion)}</span>
								</div>
								{item.fecha_revisado && (
									<div className="flex justify-between">
										<span className="text-gray-500">Revisión:</span>
										<span className="font-medium">{formatDate(item.fecha_revisado)}</span>
									</div>
								)}
							</div>
						</div>

						{/* Tarjeta de responsables */}
						<div className="bg-gray-50 p-5 rounded-lg border">
							<h2 className="flex items-center gap-2 font-semibold text-lg mb-4">
								<User className="text-blue-600" />
								Responsables
							</h2>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-500">Creado por:</span>
									<span className="font-medium text-right">{item.nombre_creador}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-500">Receptor:</span>
									<span className="font-medium">{item.nombre_receptor_completo}</span>
								</div>
								{item.nombre_revisor && (
									<div className="flex justify-between">
										<span className="text-gray-500">Revisor:</span>
										<span className="font-medium">{item.nombre_revisor}</span>
									</div>
								)}
							</div>
						</div>

						{/* Estado */}
						<div className={`p-5 rounded-lg border ${item.esta_revisado
							? 'bg-green-50 border-green-200'
							: 'bg-yellow-50 border-yellow-200'
							}`}>
							<h2 className="flex items-center gap-2 font-semibold text-lg mb-2">
								{item.esta_revisado ? (
									<CheckCircle className="text-green-600" />
								) : (
									<Clock className="text-yellow-600" />
								)}
								Estado actual
							</h2>
							<p className="text-sm text-gray-600">
								{item.esta_revisado
									? 'Este mantenimiento ha sido revisado y aprobado.'
									: 'Este mantenimiento está pendiente de revisión.'}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}