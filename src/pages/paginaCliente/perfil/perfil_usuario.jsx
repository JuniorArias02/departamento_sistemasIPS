import { useEffect, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { User, Mail, Edit, Save, Lock, Phone } from 'lucide-react';
import { obtenerMiPerfil, editarMiPerfil } from '../../../services/usuario';
import { useApp } from '../../../store/AppContext';
import Swal from 'sweetalert2';

export default function PerfilUsuario(props) {
	const { usuario } = useApp();
	const [userData, setUserData] = useState({
		nombre_completo: '',
		usuario: '',
		correo: '',
		telefono: '',
		rol_id: ''
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const { onSave } = props;
	const [showPasswordModal, setShowPasswordModal] = useState(false);
	const [passwordData, setPasswordData] = useState({
		current: '',
		new: '',
		confirm: ''
	});
	useEffect(() => {
		const cargarPerfil = async () => {
			try {
				setLoading(true);
				const idUsuario = usuario.id;
				const datosUsuario = await obtenerMiPerfil(idUsuario);
				setUserData(datosUsuario);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		cargarPerfil();
	}, []);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setUserData(userData);
		setIsEditing(false);
	};

	const handleSave = async () => {
		try {
			await editarMiPerfil(userData);

			Swal.fire({
				icon: 'success',
				title: '¡Perfil actualizado!',
				text: 'Tus datos se guardaron correctamente.',
				timer: 2000,
				showConfirmButton: false
			});

			setIsEditing(false);
		} catch (err) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: err.message || 'Error al guardar cambios'
			});
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData(prev => ({ ...prev, [name]: value }));
	};

	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswordData(prev => ({ ...prev, [name]: value }));
	};

	const handlePasswordSubmit = () => {
		// Validar que las contraseñas coincidan
		if (passwordData.new !== passwordData.confirm) {
			alert('Las contraseñas no coinciden');
			return;
		}

		// Aquí iría la llamada a la API para cambiar la contraseña
		console.log('Cambiando contraseña:', passwordData);
		setShowPasswordModal(false);
		setPasswordData({ current: '', new: '', confirm: '' });
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2
			}
		}
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				stiffness: 100
			}
		}
	};
	const dragControls = useDragControls();
	return (
		<motion.div
			className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			<motion.div
				className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl relative"
				variants={itemVariants}
				drag={window.innerWidth > 768} // Solo habilita drag en PC
				dragControls={dragControls}
				dragConstraints={{
					top: -50,
					left: -50,
					right: 50,
					bottom: 50,
				}}
				dragElastic={0.1}
				whileDrag={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
				// Estilos condicionales para móvil
				style={{
					transform: window.innerWidth <= 768 ? "translateX(0)" : undefined
				}}
			>
				{window.innerWidth > 768 && (
					<div
						className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-300 rounded-full cursor-move"
						onPointerDown={(e) => dragControls.start(e)}
					/>
				)}

				{/* Modal para cambiar contraseña */}
				{showPasswordModal && (
					<motion.div
						className="fixed inset-0 bg-[#0000002c] bg-opacity-50 flex items-center justify-center z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
					>
						<motion.div
							className="bg-white rounded-xl p-6 w-full max-w-md"
							initial={{ scale: 0.9 }}
							animate={{ scale: 1 }}
						>
							<h3 className="text-lg font-semibold mb-4 flex items-center">
								<Lock className="mr-2" />
								Cambiar contraseña
							</h3>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-500">Contraseña actual</label>
									<input
										type="password"
										name="current"
										value={passwordData.current}
										onChange={handlePasswordChange}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-500">Nueva contraseña</label>
									<input
										type="password"
										name="new"
										value={passwordData.new}
										onChange={handlePasswordChange}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-500">Confirmar nueva contraseña</label>
									<input
										type="password"
										name="confirm"
										value={passwordData.confirm}
										onChange={handlePasswordChange}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									/>
								</div>
							</div>

							<div className="mt-6 flex justify-end space-x-3">
								<button
									onClick={() => setShowPasswordModal(false)}
									className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
								>
									Cancelar
								</button>
								<button
									onClick={handlePasswordSubmit}
									className="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700"
								>
									Guardar contraseña
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}

				<div className="max-w-3xl mx-auto">
					<motion.div
						className="bg-white rounded-2xl shadow-xl overflow-hidden"
						variants={itemVariants}
					>
						{/* Header del perfil */}
						<div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
							<div className="flex items-center space-x-4">
								<div className="relative">
									<div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
										<User size={40} />
									</div>
								</div>
								<div>
									<h1 className="text-xl font-bold">{userData.nombre_completo}</h1>
									<p className="text-white/90">{userData.usuario}</p>
								</div>
							</div>
						</div>

						{/* Contenido del perfil */}
						<div className="p-6">
							<motion.div
								className="grid grid-cols-1 md:grid-cols-2 gap-6"
								variants={containerVariants}
							>
								{/* Sección de información básica */}
								<motion.div variants={itemVariants}>
									<h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
										<User className="mr-2" size={18} />
										Información básica
									</h2>

									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-500">Nombre completo</label>
											{isEditing ? (
												<input
													type="text"
													name="nombre_completo"
													value={userData.nombre_completo}
													onChange={handleChange}
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
													required
												/>
											) : (
												<p className="mt-1 text-gray-800">{userData.nombre_completo}</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-500">Nombre de usuario</label>
											{isEditing ? (
												<input
													type="text"
													name="usuario"
													value={userData.usuario}
													onChange={handleChange}
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
													required
												/>
											) : (
												<p className="mt-1 text-gray-800">{userData.usuario}</p>
											)}
										</div>
									</div>
								</motion.div>

								{/* Sección de contacto */}
								<motion.div variants={itemVariants}>
									<h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
										<Mail className="mr-2" size={18} />
										Contacto
									</h2>

									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-500 flex items-center">
												<Mail className="mr-1" size={14} />
												Correo electrónico
											</label>
											{isEditing ? (
												<input
													type="email"
													name="correo"
													value={userData.correo}
													onChange={handleChange}
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
													required
												/>
											) : (
												<p className="mt-1 text-gray-800">{userData.correo}</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-500 flex items-center">
												<Phone className="mr-1" size={14} />
												Teléfono (opcional)
											</label>
											{isEditing ? (
												<input
													type="tel"
													name="telefono"
													value={userData.telefono || ''}
													onChange={handleChange}
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
												/>
											) : (
												<p className="mt-1 text-gray-800">{userData.telefono || 'No especificado'}</p>
											)}
										</div>
									</div>
								</motion.div>
							</motion.div>

							{/* Sección de contraseña */}
							<motion.div
								className="mt-8 pt-6 border-t border-gray-200"
								variants={itemVariants}
							>
								<h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
									<Lock className="mr-2" size={18} />
									Seguridad
								</h2>
								<button
									onClick={() => setShowPasswordModal(true)}
									className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center cursor-pointer"
								>
									<Lock className="mr-1" size={14} />
									Cambiar contraseña
								</button>
							</motion.div>

							{/* Botones de acción */}
							<motion.div
								className="mt-8 flex justify-end space-x-3"
								variants={itemVariants}
							>
								{isEditing ? (
									<>
										<button
											onClick={handleCancel}
											className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 cursor-pointer"
										>
											Cancelar
										</button>
										<button
											onClick={handleSave}
											className="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 flex items-center cursor-pointer"
										>
											<Save className="mr-1" size={16} />
											Guardar cambios
										</button>
									</>
								) : (
									<button
										onClick={handleEdit}
										className="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 flex items-center cursor-pointer"
									>
										<Edit className="mr-1" size={16} />
										Editar perfil
									</button>
								)}
							</motion.div>
						</div>
					</motion.div>
				</div>
			</motion.div>
		</motion.div>
	);
};
