import { useLocation } from 'react-router-dom';
import {
	Laptop,
	Monitor,
	Server,
	Box,
	HardDrive,
	Cpu,
	MemoryStick,
	Network,
	Wifi,
	Headphones,
	Usb,
	Disc,
	Speaker,
	Shield,
	FileText,
	Calendar,
	User,
	Building,
	Home,
	AlertCircle,
	CheckCircle,
	XCircle,
	Clock,
	Settings,
	Printer,
	Tablet,
	Wrench,
	Sparkles,
	AlertTriangle,
	HelpCircle,
	MonitorSmartphone,
	CreditCard,
	ShieldCheck,
	ShoppingCart,
	Info,
	Layers,
	HardDriveIcon,
	Volume2,
	Keyboard,
	Mouse,
	Globe,
	Computer,
	Star,
} from 'lucide-react';
import BackPage from '../../components/BackPage';
import EstadoBadge from '../components/ver_equipos/EstadoBadge';
import TipoIcono from '../components/ver_equipos/TipoIcono';
import { URL_IMAGE } from '../../../../const/api';

const DetalleEquipo = () => {
	const location = useLocation();
	const equipo = location.state?.equipo;

	if (!equipo) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="text-center">
					<XCircle className="w-12 h-12 text-red-500 mx-auto" />
					<p className="mt-4 text-lg font-medium text-gray-700">No se encontró información del equipo</p>
					<p className="text-gray-500">Por favor, seleccione un equipo desde la lista</p>
				</div>
			</div>
		);
	}



	// Función para formatear fechas
	const formatDate = (dateString) => {
		if (!dateString) return 'No registrada';
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('es-ES', options);
	};

	// Función para mostrar valores booleanos
	const renderSiNo = (value) => {
		if (value === 'Si' || value === 'Sí' || value === 'si' || value === 'sí' || value === '1' || value === "Si") {
			return <span className="text-green-600">Sí</span>;
		}
		return <span className="text-red-600">No</span>;
	};

	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<BackPage isEdit={true} />
			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				{/* Encabezado */}
				<div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
					<div className="flex items-center justify-between">

						<div className="flex items-center">
							<TipoIcono tipo={equipo.tipo} />
							<h1 className="ml-3 text-2xl font-bold text-gray-900">
								{equipo.nombre_equipo} - {equipo.numero_inventario}
							</h1>
						</div>
						<div>
							<EstadoBadge estado={equipo.estado} />
						</div>
					</div>
					<div className="mt-2 flex items-center text-sm text-gray-500">
						<Building className="w-4 h-4 mr-1" />
						{equipo.sede_nombre} - {equipo.area_nombre}
					</div>
					{equipo.imagen_url && (
						<div className="bg-gray-100 p-4 flex justify-center">
							<img
								src={`${URL_IMAGE}${equipo.imagen_url}`}
								alt={`Imagen de ${equipo.nombre_equipo}`}
								className="max-h-72 rounded-lg shadow-md object-contain"
							/>
						</div>
					)}
				</div>

				{/* Contenido principal */}
				<div className="px-6 py-4">
					{/* Sección 1: Información básica */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						<div className="space-y-4">
							<h2 className="text-lg font-medium text-gray-900 border-b pb-2 flex items-center">
								<Info className="w-5 h-5 mr-2 text-blue-500" /> Información Básica
							</h2>
							<div>
								<p className="text-sm text-gray-500">Marca</p>
								<p className="font-medium">{equipo.marca || 'No especificado'}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Modelo</p>
								<p className="font-medium">{equipo.modelo || 'No especificado'}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Serial</p>
								<p className="font-medium">{equipo.serial || 'No especificado'}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Tipo</p>
								<div className="flex items-center">
									<TipoIcono tipo={equipo.tipo} />
									<span className="ml-2 font-medium">{equipo.tipo}</span>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h2 className="text-lg font-medium text-gray-900 border-b pb-2 flex items-center">
								<CreditCard className="w-5 h-5 mr-2 text-purple-500" /> Propiedad y Adquisición
							</h2>
							<div>
								<p className="text-sm text-gray-500">Propiedad</p>
								<p className="font-medium">{equipo.propiedad || 'No especificado'}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Forma de adquisición</p>
								<p className="font-medium">{equipo.forma_adquisicion || 'No especificado'}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Fecha de entrega</p>
								<p className="font-medium">{formatDate(equipo.fecha_entrega)}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Garantía (meses)</p>
								<p className="font-medium">{equipo.garantia_meses || '0'}</p>
							</div>
						</div>

						<div className="space-y-4">
							<h2 className="text-lg font-medium text-gray-900 border-b pb-2 flex items-center">
								<ShieldCheck className="w-5 h-5 mr-2 text-green-500" /> Seguridad y Red
							</h2>
							<div>
								<p className="text-sm text-gray-500">IP Fija</p>
								<p className="font-medium">{equipo.ip_fija || 'No asignada'}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Conexión a Internet</p>
								<p className="font-medium">{renderSiNo(equipo.internet)}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Velocidad de red</p>
								<p className="font-medium">{equipo.velocidad_red || 'No especificado'}</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Tarjeta de red</p>
								<p className="font-medium">{equipo.tarjeta_red ? renderSiNo(equipo.tarjeta_red) : 'No especificado'}</p>
							</div>
						</div>
					</div>

					{/* Sección 2: Especificaciones técnicas */}
					<div className="mb-8">
						<h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4 flex items-center">
							<Cpu className="w-5 h-5 mr-2 text-amber-500" /> Especificaciones Técnicas
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="space-y-2">
								<p className="text-sm text-gray-500 flex items-center">
									<Cpu className="w-4 h-4 mr-1" /> Procesador
								</p>
								<p className="font-medium">{equipo.procesador || 'No especificado'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500 flex items-center">
									<MemoryStick className="w-4 h-4 mr-1" /> Memoria RAM
								</p>
								<p className="font-medium">{equipo.memoria_ram || 'No especificado'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500 flex items-center">
									<HardDriveIcon className="w-4 h-4 mr-1" /> Disco duro
								</p>
								<p className="font-medium">{equipo.disco_duro || 'No especificado'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500 flex items-center">
									<Layers className="w-4 h-4 mr-1" /> Capacidad disco
								</p>
								<p className="font-medium">{equipo.capacidad_disco || 'No especificado'} GB</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500 flex items-center">
									<Monitor className="w-4 h-4 mr-1" /> Monitor
								</p>
								<p className="font-medium">{renderSiNo(equipo.monitor)}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500 flex items-center">
									<Keyboard className="w-4 h-4 mr-1" /> Teclado
								</p>
								<p className="font-medium">{renderSiNo(equipo.teclado)}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500 flex items-center">
									<Mouse className="w-4 h-4 mr-1" /> Mouse
								</p>
								<p className="font-medium">{renderSiNo(equipo.mouse)}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500 flex items-center">
									<Usb className="w-4 h-4 mr-1" /> Puertos USB
								</p>
								<p className="font-medium">{equipo.usb || 'No especificado'}</p>
							</div>
						</div>
					</div>

					{/* Sección 3: Software y periféricos */}
					<div className="mb-8">
						<h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4 flex items-center">
							<Globe className="w-5 h-5 mr-2 text-blue-500" /> Software y Periféricos
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="space-y-2">
								<p className="text-sm text-gray-500">Sistema operativo</p>
								<p className="font-medium">{equipo.windows ? renderSiNo(equipo.windows) : 'No especificado'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500">Suite Office</p>
								<p className="font-medium">{equipo.office ? renderSiNo(equipo.office) : 'No especificado'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500">Tarjeta de video</p>
								<p className="font-medium">{equipo.tarjeta_video ? renderSiNo(equipo.tarjeta_video) : 'No especificado'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500">Tarjeta de sonido</p>
								<p className="font-medium">{equipo.tarjeta_sonido ? renderSiNo(equipo.tarjeta_sonido) : 'No especificado'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500">Unidad CD/DVD</p>
								<p className="font-medium">{equipo.unidad_cd ? renderSiNo(equipo.unidad_cd) : 'No especificado'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500">Parlantes</p>
								<p className="font-medium">{equipo.parlantes ? renderSiNo(equipo.parlantes) : 'No especificado'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500">Drive</p>
								<p className="font-medium">{equipo.drive ? renderSiNo(equipo.drive) : 'No especificado'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500">Nitro</p>
								<p className="font-medium">{equipo.nitro || 'No aplica'}</p>
							</div>
						</div>
					</div>

					{/* Sección 4: Responsable y mantenimiento */}
					<div className="mb-8">
						<h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4 flex items-center">
							<User className="w-5 h-5 mr-2 text-purple-500" /> Responsable y Mantenimiento
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="space-y-2">
								<p className="text-sm text-gray-500">Responsable</p>
								<p className="font-medium">{equipo.responsable_nombre || 'Sin asignar'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500">Cargo</p>
								<p className="font-medium">{equipo.responsable_cargo || 'No especificado'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500">Número de mantenimientos</p>
								<p className="font-medium">{equipo.numero_mantenimientos || '0'}</p>
							</div>
							<div className="space-y-2">
								<p className="text-sm text-gray-500">Último mantenimiento</p>
								<p className="font-medium">{formatDate(equipo.fecha_ultimo_mantenimiento)}</p>
							</div>
						</div>
					</div>

					{/* Sección 5: Observaciones */}
					<div>
						<h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4 flex items-center">
							<FileText className="w-5 h-5 mr-2 text-green-500" /> Observaciones
						</h2>
						<div className="bg-gray-50 p-4 rounded-md">
							<p className="whitespace-pre-line">{equipo.observaciones || 'No hay observaciones registradas'}</p>
						</div>
					</div>
					<div>
						<h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4 flex items-center">
							<Wrench className="w-5 h-5 mr-2 text-violet-500" /> Repuestos Principales
						</h2>
						<div className="bg-gray-50 p-4 rounded-md">
							<p className="whitespace-pre-line">{equipo.repuestos_principales || 'No hay repuestos principales registradas'}</p>
						</div>
					</div>
					<div>
						<h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4 flex items-center">

							<Star className="w-5 h-5 mr-2 text-yellow-500" /> Recomendaciones
						</h2>
						<div className="bg-gray-50 p-4 rounded-md">
							<p className="whitespace-pre-line">{equipo.recomendaciones || 'No hay recomendaciones registradas'}</p>
						</div>
					</div>
					<div>
						<h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4 flex items-center">
							<Computer className="w-5 h-5 mr-2 text-blue-500" /> Equipos Adicionales
						</h2>
						<div className="bg-gray-50 p-4 rounded-md">
							<p className="whitespace-pre-line">{equipo.equipos_adicionales || 'No hay equipos adicionales registradas'}</p>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
};

export default DetalleEquipo;