import { useState, useEffect } from 'react';
import { obtenerEquiposComputo } from "../../../../services/pc_equipos_services";
import {
	Laptop,
	Monitor,
	Mouse,
	Keyboard,
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
	Box,
	AlertTriangle,
	HelpCircle,
	Server,
	MonitorSmartphone,
	Wrench,
	Sparkles
} from 'lucide-react';
import EstadoBadge from '../components/ver_equipos/EstadoBadge';
import TipoIcono from '../components/ver_equipos/TipoIcono';
import { useNavigate } from 'react-router-dom';
import { RUTAS } from '../../../../const/routers/routers';
import { PERMISOS } from '../../../../secure/permisos/permisos';
import { useApp } from '../../../../store/AppContext';
import Swal from 'sweetalert2';
import FiltroEquiposComputo from '../components/resources/FiltroEquiposComputo';

const VistaVerEquipos = () => {
	const { permisos } = useApp();
	const navigate = useNavigate();
	const [equipos, setEquipos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [filtroTipo, setFiltroTipo] = useState("Todos");

	useEffect(() => {
		const fetchEquipos = async () => {
			try {
				const response = await obtenerEquiposComputo();
				console.log(response);
				if (response.status) {
					setEquipos(response.data);
				} else {
					setError('No se pudieron cargar los equipos');
				}
			} catch (err) {
				setError('Error al conectar con el servidor', err);
			} finally {
				setLoading(false);
			}
		};

		fetchEquipos();
	}, []);


	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-red-50 border-l-4 border-red-500 p-4">
				<div className="flex">
					<div className="flex-shrink-0">
						<XCircle className="h-5 w-5 text-red-500" />
					</div>
					<div className="ml-3">
						<p className="text-sm text-red-700">{error}</p>
					</div>
				</div>
			</div>
		);
	}

	const handleAgregarEquipo = () => {
		if (permisos.includes(PERMISOS.GESTION_EQUIPOS.AGREGAR)) {
			navigate(RUTAS.USER.EQUIPOS.CREAR_EQUIPO);
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Acceso Denegado',
				text: 'No tienes permisos para agregar equipos.',
			});
		}
	}

	const handleEditarEquipo = () => {
		if (permisos.includes(PERMISOS.GESTION_EQUIPOS.EDITAR)) {
			navigate(RUTAS.USER.EQUIPOS.CREAR_EQUIPO, { state: { equipos } });
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Acceso Denegado',
				text: 'No tienes permisos para editar equipos.'
			});
		}
	};

	const handleFilterChange = (tipo) => {
		setFiltroTipo(tipo);
	};

	const equiposFiltrados = filtroTipo === "Todos"
		? equipos
		: equipos.filter((equipo) => equipo.tipo === filtroTipo);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Inventario de Equipos</h1>
				<div className="flex space-x-4">
					<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						onClick={handleAgregarEquipo}
					>
						Agregar Equipo
					</button>
					<button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
						Filtros
					</button>
				</div>
			</div>
			<div>
				<FiltroEquiposComputo onFilterChange={handleFilterChange} />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{equiposFiltrados.map((equipo) => (
					<div
						key={equipo.id}
						className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-auto"
					>
						{/* Contenido principal de la tarjeta */}
						<div className="p-6 flex-1">
							{/* Encabezado con nombre y estado */}
							<div className="flex justify-between items-start">
								<div className="flex items-center">
									<TipoIcono tipo={equipo.tipo} />
									<h2 className="ml-2 text-xl font-semibold text-gray-800 line-clamp-1" title={equipo.nombre_equipo}>
										{equipo.nombre_equipo}
									</h2>
								</div>
								<EstadoBadge estado={equipo.estado} />
							</div>

							{/* Ubicación y responsable */}
							<div className="mt-4 space-y-2">
								<div className="flex items-center text-sm text-gray-500">
									<Building className="w-4 h-4 mr-1 flex-shrink-0" />
									<span className="line-clamp-1">{equipo.sede_nombre} - {equipo.area_nombre}</span>
								</div>
								<div className="flex items-center text-sm text-gray-500">
									<User className="w-4 h-4 mr-1 flex-shrink-0" />
									<span className="line-clamp-1">{equipo.responsable_nombre || 'Sin asignar'}</span>
								</div>
							</div>

							{/* Especificaciones técnicas */}
							<div className="mt-4 grid grid-cols-2 gap-2">
								<div className="flex items-center text-sm">
									<Cpu className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
									<span className="line-clamp-1" title={equipo.procesador}>{equipo.procesador}</span>
								</div>
								<div className="flex items-center text-sm">
									<MemoryStick className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
									<span>{equipo.memoria_ram} GB RAM</span>
								</div>
								<div className="flex items-center text-sm">
									<HardDrive className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
									<span>{equipo.capacidad_disco} GB</span>
								</div>
								<div className="flex items-center text-sm">
									<Network className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
									<span className="line-clamp-1" title={equipo.ip_fija}>{equipo.ip_fija || 'Sin IP'}</span>
								</div>
							</div>

							{/* Etiquetas de características */}
							<div className="mt-4 pt-4 border-t border-gray-200">
								<h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
									<Settings className="w-4 h-4 mr-1" /> Especificaciones
								</h3>
								<div className="flex flex-wrap gap-1">
									{equipo.windows === 'Si' && (
										<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
											Windows
										</span>
									)}
									{equipo.office === 'Si' && (
										<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
											Office
										</span>
									)}
									{equipo.internet === 'Si' && (
										<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
											Internet
										</span>
									)}
									{equipo.tarjeta_video === 'Si' && (
										<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
											GPU
										</span>
									)}
									{equipo.unidad_cd === 'Si' && (
										<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
											CD/DVD
										</span>
									)}
								</div>
							</div>

							{/* Información de mantenimiento y fechas */}
							<div className="mt-4 space-y-3">
								{/* Tarjeta de mantenimiento */}
								<div className={`flex items-center p-2 rounded-lg ${equipo.dias_restantes <= 7 ? 'bg-red-50 text-red-700' :
									equipo.dias_restantes <= 30 ? 'bg-amber-50 text-amber-700' :
										'bg-emerald-50 text-emerald-700'
									}`}>
									<div className={`p-1.5 rounded-full mr-2 ${equipo.dias_restantes <= 7 ? 'bg-red-100 text-red-600' :
										equipo.dias_restantes <= 30 ? 'bg-amber-100 text-amber-600' :
											'bg-emerald-100 text-emerald-600'
										}`}>
										<Calendar className="w-4 h-4" />
									</div>
									<div>
										<p className="font-medium text-xs">Mantenimiento</p>
										<p className="font-semibold text-sm">
											{equipo.dias_restantes <= 0 ?
												'¡Vencido!' :
												`En ${equipo.dias_restantes} días`}
										</p>
									</div>
								</div>

								{/* Fecha de entrega e inventario */}
								<div className="flex justify-between items-center text-sm text-gray-500">
									<div className="flex items-center">
										<Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
										<span>Entregado: {new Date(equipo.fecha_entrega).toLocaleDateString()}</span>
									</div>
									<div className="text-right">
										<span className="font-medium bg-gray-100 px-2 py-0.5 rounded-md text-sm">
											Inv: {equipo.numero_inventario}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Pie de tarjeta con acciones */}
						<div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t border-gray-200">
							<button
								className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
								onClick={() => { navigate(RUTAS.USER.EQUIPOS.DETALLE_EQUIPO, { state: { equipo } }) }}
							>
								Detalles
							</button>
							<button
								className="text-sm text-gray-600 hover:text-gray-800 font-medium"
								onClick={() => { navigate(RUTAS.USER.EQUIPOS.CREAR_EQUIPO, { state: { equipo } }) }}
							>
								Editar
							</button>
							<button className="text-sm text-red-600 hover:text-red-800 font-medium">
								Eliminar
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default VistaVerEquipos;