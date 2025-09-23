import { useState, useEffect } from 'react';
import {
	Key,
	Users,
	Save,
	CheckCircle2,
	XCircle,
	Loader2,
	ChevronDown,
	Check,
	FileSearch,
	CheckCircle
} from 'lucide-react';
import { listarRoles, asignarPermisos, obtenerPermisosRol } from '../../../services/rol_services';
import Swal from 'sweetalert2';
import BackPage from '../../paginaCliente/components/BackPage';
import { useApp } from '../../../store/AppContext';
import { PERMISOS } from '../../../secure/permisos/permisos';

export default function AsignarPermisos() {
	const { usuario: usuarioContext, permisos: permisosUser } = useApp();
	const [roles, setRoles] = useState([]);
	const [selectedRolId, setSelectedRolId] = useState('');
	const [permisos, setPermisos] = useState([]);
	const [selectedPermisos, setSelectedPermisos] = useState(new Set());
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(false);
	// Cargar roles al montar el componente
	useEffect(() => {
		const fetchRoles = async () => {
			try {
				setLoading(true);
				const data = await listarRoles();
				setRoles(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchRoles();
	}, []);

	// Cargar permisos cuando se selecciona un rol
	useEffect(() => {
		if (!selectedRolId) return;

		const fetchPermisos = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await obtenerPermisosRol(selectedRolId);
				setPermisos(data);

				const inicialSeleccionados = new Set(
					data.filter(p => p.asignado).map(p => p.id)
				);
				setSelectedPermisos(inicialSeleccionados);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPermisos();
	}, [selectedRolId]);

	// Manejar selección/deselección de permisos
	const handlePermisoChange = (permisoId, isChecked) => {
		const nuevosPermisos = new Set(selectedPermisos);
		if (isChecked) {
			nuevosPermisos.add(permisoId);
		} else {
			nuevosPermisos.delete(permisoId);
		}
		setSelectedPermisos(nuevosPermisos);
	};

	// Guardar cambios - Versión CENTRAL 2025
	const handleSubmit = async () => {
		try {
			setLoading(true);

			// Loader básico
			Swal.fire({
				title: 'Procesando...',
				allowOutsideClick: false,
				didOpen: () => {
					Swal.showLoading();
				}
			});

			await asignarPermisos(usuarioContext.id, selectedRolId, Array.from(selectedPermisos));

			// Éxito simple
			Swal.fire({
				icon: 'success',
				title: '¡Listo!',
				text: 'Permisos actualizados correctamente',
				confirmButtonColor: '#3085d6',
			});

		} catch (err) {
			// Error simple
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: err.message,
				confirmButtonColor: '#d33',
			});
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="max-w-7xl mx-auto p-6 space-y-6">
			{/* Header con gradiente y efecto glassmorphism */}
			<div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 backdrop-blur-lg bg-opacity-90 shadow-xl">
				<div className="flex items-center gap-3">
					{/* Botón de retroceso */}
					<BackPage />

					{/* Ícono de permisos */}
					<div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
						<Key className="w-8 h-8 text-white" />
					</div>

					{/* Título y subtítulo */}
					<div>
						<h1 className="text-3xl font-bold text-white drop-shadow-md">
							Gestión de Permisos
						</h1>
						<span className="block text-sm font-normal text-blue-100 mt-1">
							Control de accesos y privilegios
						</span>
					</div>
				</div>
			</div>

			{/* Notificaciones flotantes modernas */}
			{error && (
				<div className="animate-fade-in-down bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-start gap-3">
					<XCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
					<div>
						<p className="font-medium">Error en operación</p>
						<p className="text-sm">{error}</p>
					</div>
				</div>
			)}

			{success && (
				<div className="animate-fade-in-down bg-green-50/80 backdrop-blur-sm border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg flex items-start gap-3">
					<CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-500" />
					<div>
						<p className="font-medium">¡Operación exitosa!</p>
						<p className="text-sm">Los permisos se actualizaron correctamente</p>
					</div>
				</div>
			)}

			{/* Paneles con efecto neumorphism y transiciones */}
			<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
				{/* Panel de Rol - Efecto vidrio */}
				<div className="xl:col-span-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_32px_rgba(31,38,135,0.05)] border border-white/20 h-fit">
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 bg-blue-100/50 rounded-lg">
							<Users className="w-5 h-5 text-blue-600" />
						</div>
						<h2 className="text-xl font-semibold text-gray-800">Selección de Rol</h2>
					</div>

					<div className="relative mb-4">
						<select
							value={selectedRolId}
							onChange={(e) => setSelectedRolId(e.target.value)}
							disabled={loading}
							className="w-full p-3 pl-10 bg-white/70 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 disabled:opacity-50 appearance-none shadow-sm"
						>
							<option value="">-- Seleccione un rol --</option>
							{roles.map((rol) => (
								<option key={rol.id} value={rol.id}>
									{rol.nombre}
								</option>
							))}
						</select>
						<ChevronDown className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
					</div>

					{/* Información del rol seleccionado */}
					{selectedRolId && (
						<div className="mt-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
							<h3 className="font-medium text-blue-800 mb-2">Información del Rol</h3>
							{roles.find(r => r.id === selectedRolId)?.descripcion && (
								<p className="text-sm text-blue-600">
									{roles.find(r => r.id === selectedRolId)?.descripcion}
								</p>
							)}
							<div className="mt-3 flex items-center text-sm text-blue-500">
								<CheckCircle className="w-4 h-4 mr-1" />
								<span>{selectedPermisos.size} permisos seleccionados</span>
							</div>
						</div>
					)}
				</div>

				{/* Panel de Permisos - Lista interactiva MEJORADA */}
				<div className="xl:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_32px_rgba(31,38,135,0.05)] border border-white/20">
					<div className="flex justify-between items-center mb-6">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-blue-100/50 rounded-lg">
								<Key className="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<h2 className="text-xl font-semibold text-gray-800">Permisos Disponibles</h2>
								<p className="text-sm text-gray-500 mt-1">
									Selecciona los permisos que deseas asignar al rol
								</p>
							</div>
						</div>
						<div className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
							{selectedPermisos.size} seleccionados
						</div>
					</div>

					{loading ? (
						<div className="flex flex-col items-center justify-center py-12">
							<Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-3" />
							<p className="text-gray-500">Cargando permisos...</p>
						</div>
					) : permisos.length > 0 ? (
						<div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
							{permisos.map((permiso) => (
								<label
									key={permiso.id}
									className={`flex items-start p-4 rounded-xl cursor-pointer transition-all duration-200 border ${selectedPermisos.has(permiso.id)
										? 'bg-blue-50/70 border-blue-200 shadow-sm'
										: 'bg-gray-50/30 border-gray-100 hover:bg-gray-50/70'
										}`}
								>
									<div className="relative mt-0.5 mr-3 flex-shrink-0">
										<input
											type="checkbox"
											checked={selectedPermisos.has(permiso.id)}
											onChange={(e) => handlePermisoChange(permiso.id, e.target.checked)}
											className="sr-only peer"
										/>
										<div className="w-5 h-5 rounded border border-gray-300 bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition-colors">
											<Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="text-gray-800 font-medium">{permiso.nombre}</div>
												<div className="text-gray-500 text-sm mt-2 leading-relaxed">
													{permiso.descripcion}
												</div>
											</div>
											{selectedPermisos.has(permiso.id) && (
												<div className="ml-3 flex-shrink-0">
													<CheckCircle className="w-5 h-5 text-blue-500" />
												</div>
											)}
										</div>
										{permiso.categoria && (
											<div className="mt-2">
												<span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
													{permiso.categoria}
												</span>
											</div>
										)}
									</div>
								</label>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<FileSearch className="w-16 h-16 mx-auto text-gray-300 mb-4" />
							<h3 className="text-lg font-medium text-gray-500 mb-2">
								{selectedRolId ? "No se encontraron permisos" : "Seleccione un rol para comenzar"}
							</h3>
							<p className="text-gray-400 text-sm">
								{selectedRolId
									? "Intenta con otro rol o verifica la conexión"
									: "Elija un rol de la lista para visualizar sus permisos disponibles"}
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Botón flotante moderno */}
			<div className="sticky bottom-6 flex justify-end">
				{permisosUser.includes(PERMISOS.GESTION_PERMISOS.ASIGNAR) && (
					<button
						onClick={handleSubmit}
						disabled={!selectedRolId || loading}
						className={`px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 shadow-lg ${!selectedRolId || loading
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5"
							}`}
					>
						{loading ? (
							<>
								<Loader2 className="animate-spin h-5 w-5" />
								<span className="animate-pulse">Procesando...</span>
							</>
						) : (
							<>
								<Save className="w-5 h-5" />
								<span>Guardar Cambios</span>
							</>
						)}
					</button>
				)}
			</div>
		</div>
	);
};

