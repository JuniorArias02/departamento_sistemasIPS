import { useEffect, useState, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { User, Mail, Edit, Save, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { obtenerMiPerfil, editarMiPerfil, cambiarContrasena, subirFirmaPerfil } from '../../../services/perfil_services';
import { useApp } from '../../../store/AppContext';
import Swal from 'sweetalert2';
import BackPage from '../components/BackPage';
import { FirmaInput } from '../../appFirma/appFirmas';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function PerfilUsuario(props) {
	const { usuario } = useApp();
	const [userData, setUserData] = useState({
		nombre_completo: '',
		usuario: '',
		correo: '',
		telefono: '',
		rol_id: '',
		firma_digital: ''
	});



	const [firmaPreview, setFirmaPreview] = useState(null);
	const [openCrop, setOpenCrop] = useState(false);
	const cropperRef = useRef(null);

	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);

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



	const calculatePasswordStrength = (password) => {
		let strength = 0;
		if (password.length > 0) strength += 1;
		if (password.length >= 8) strength += 1;
		if (/[A-Z]/.test(password)) strength += 1;
		if (/[0-9]/.test(password)) strength += 1;
		if (/[^A-Za-z0-9]/.test(password)) strength += 1;
		return Math.min(strength, 4); // Máximo 4 niveles
	};

	// Modifica tu handlePasswordChange para incluir:
	const handlePasswordChange = (e) => {
		const { name, value } = e.target;
		setPasswordData(prev => ({
			...prev,
			[name]: value
		}));

		if (name === 'new') {
			setPasswordStrength(calculatePasswordStrength(value));
		}
	};

	const isPasswordValid = () => {
		return (
			passwordData.current &&
			passwordData.new &&
			passwordData.confirm &&
			passwordData.new === passwordData.confirm &&
			passwordStrength >= 2 // Requiere al menos fortaleza moderada
		);
	};
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

	function base64ToFile(base64Data, filename) {
		// Separa metadata y contenido
		const arr = base64Data.split(',');
		const mime = arr[0].match(/:(.*?);/)[1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new File([u8arr], filename, { type: mime });
	}


	const handleSave = async () => {
		try {
			// 1️⃣ Subir firma si está en base64
			if (userData.firma_digital && userData.firma_digital.startsWith("data:image")) {
				const fileFirma = base64ToFile(userData.firma_digital, "firma.png");
				const formData = new FormData();
				formData.append("usuario_id", userData.id);
				formData.append("firma_digital", fileFirma);

				await subirFirmaPerfil(formData);

				const resp = await subirFirmaPerfil(formData);

				if (!resp.status) {
					Swal.fire("Error", resp.message || "No se pudo subir la firma", "error");
					return;
				}
				// Actualiza la firma en el state con lo que devuelva el backend (ej: ruta o url)
				setUserData((prev) => ({
					...prev,
					firma_digital: resp.path || prev.firma_digital,
				}));
			}

			// 2️⃣ Guardar datos de perfil
			await editarMiPerfil(userData);

			Swal.fire({
				icon: "success",
				title: "¡Perfil actualizado!",
				text: "Tus datos se guardaron correctamente.",
				timer: 2000,
				showConfirmButton: false,
			});

			setIsEditing(false);
		} catch (err) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: err.message || "Error al guardar cambios",
			});
		}
	};


	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserData(prev => ({ ...prev, [name]: value }));
	};


	const handlePasswordSubmit = async () => {
		try {
			// Validación básica en el cliente con SweetAlert
			if (!passwordData.current) {
				await Swal.fire({
					icon: 'warning',
					title: 'Oops...',
					text: 'Por favor ingresa tu contraseña actual',
					confirmButtonColor: '#6366f1', // Color indigo
				});
				return;
			}

			if (passwordData.new && passwordData.new.length < 8) {
				await Swal.fire({
					icon: 'error',
					title: 'Contraseña muy corta',
					text: 'La nueva contraseña debe tener al menos 8 caracteres',
					confirmButtonColor: '#6366f1',
				});
				return;
			}

			if (passwordData.new !== passwordData.confirm) {
				await Swal.fire({
					icon: 'error',
					title: 'Las contraseñas no coinciden',
					text: 'Por favor verifica que ambas contraseñas sean iguales',
					confirmButtonColor: '#6366f1',
				});
				return;
			}

			const userId = usuario?.id;
			if (!userId) {
				throw new Error('No se pudo obtener el ID del usuario');
			}

			// Mostrar loader mientras se procesa
			Swal.fire({
				title: 'Procesando...',
				html: 'Estamos actualizando tu contraseña',
				allowOutsideClick: false,
				didOpen: () => {
					Swal.showLoading();
				}
			});

			// Llamar al servicio
			const resultado = await cambiarContrasena({
				id: userId,
				current_password: passwordData.current,
				new_password: passwordData.new,
				confirm_password: passwordData.confirm
			});

			// Cerrar modal y resetear formulario
			setShowPasswordModal(false);
			setPasswordData({ current: '', new: '', confirm: '' });

			// Mostrar confirmación con SweetAlert
			await Swal.fire({
				icon: 'success',
				title: '¡Éxito!',
				text: resultado.message || 'Contraseña cambiada exitosamente',
				confirmButtonColor: '#6366f1',
				timer: 3000,
				timerProgressBar: true,
			});

		} catch (error) {
			console.error('Error al cambiar contraseña:', error);

			// Cerrar cualquier alerta previa
			Swal.close();

			// Mostrar error con SweetAlert
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: error.message || 'Ocurrió un error al cambiar la contraseña',
				confirmButtonColor: '#6366f1',
			});

			// Mantener solo la contraseña actual
			setPasswordData(prev => ({
				current: prev.current,
				new: '',
				confirm: ''
			}));
		}
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


	const handleSeleccionFirma = (file) => {
		const reader = new FileReader();
		reader.onload = () => {
			setFirmaPreview(reader.result);
			setOpenCrop(true);
		};
		reader.readAsDataURL(file);
	};

	// 2. Al aceptar recorte, generar firma recortada y subir
	const handleRecortarFirma = async () => {
		const cropper = cropperRef.current.cropper;
		const canvas = cropper.getCroppedCanvas({
			width: 450,
			height: 200,
		});
		canvas.toBlob(async (blob) => {
			if (!blob) return;

			const file = new File([blob], "firma.png", { type: "image/png" });

			// --- SUBIR AL BACKEND ---
			const formData = new FormData();
			formData.append("usuario_id", userData.id);
			formData.append("firma_digital", file);

			const resp = await subirFirmaPerfil(formData);

			if (resp.status) {
				// guardar preview en el state del usuario
				const reader = new FileReader();
				reader.onloadend = () => {
					setUserData({
						...userData,
						firma_digital: reader.result,
					});
				};
				reader.readAsDataURL(file);

				setOpenCrop(false); // cerrar modal
			} else {
				alert("Error al subir firma: " + resp.message);
			}
		}, "image/png");
	};
	return (
		<motion.div
			className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
		// initial="hidden"
		// animate="visible"
		// variants={containerVariants}
		>
			<BackPage />
			<motion.div
				className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl relative"
				variants={itemVariants}

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
								{/* Contraseña actual */}
								<div>
									<label className="block text-sm font-medium text-gray-500 mb-1">Contraseña actual</label>
									<div className="relative">
										<input
											type={showCurrentPassword ? "text" : "password"}
											name="current"
											value={passwordData.current}
											onChange={handlePasswordChange}
											className="mt-1 block w-full pl-3 pr-10 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										/>
										<button
											type="button"
											className="absolute right-3 top-2 text-gray-500 hover:text-indigo-600"
											onClick={() => setShowCurrentPassword(!showCurrentPassword)}
										>
											{showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
										</button>
									</div>
								</div>

								{/* Nueva contraseña */}
								<div>
									<label className="block text-sm font-medium text-gray-500 mb-1">Nueva contraseña</label>
									<div className="relative">
										<input
											type={showNewPassword ? "text" : "password"}
											name="new"
											value={passwordData.new}
											onChange={handlePasswordChange}
											className="mt-1 block w-full pl-3 pr-10 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										/>
										<button
											type="button"
											className="absolute right-3 top-2 text-gray-500 hover:text-indigo-600"
											onClick={() => setShowNewPassword(!showNewPassword)}
										>
											{showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
										</button>
									</div>
									{/* Indicador de fuerza */}
									<div className="mt-2">
										<div className="flex gap-1 h-1.5 mb-1">
											{[1, 2, 3, 4].map((i) => (
												<div
													key={i}
													className={`flex-1 rounded-full ${i <= passwordStrength
														? passwordStrength < 2
															? 'bg-red-400'
															: passwordStrength < 4
																? 'bg-yellow-400'
																: 'bg-green-500'
														: 'bg-gray-200'
														}`}
												/>
											))}
										</div>
										<p className="text-xs text-gray-500">
											Fortaleza: {passwordStrength === 0 ? 'Ninguna' :
												passwordStrength < 2 ? 'Débil' :
													passwordStrength < 4 ? 'Moderada' : 'Fuerte'}
										</p>
									</div>
								</div>

								{/* Confirmar nueva contraseña */}
								<div>
									<label className="block text-sm font-medium text-gray-500 mb-1">Confirmar nueva contraseña</label>
									<div className="relative">
										<input
											type={showConfirmPassword ? "text" : "password"}
											name="confirm"
											value={passwordData.confirm}
											onChange={handlePasswordChange}
											className="mt-1 block w-full pl-3 pr-10 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
										/>
										<button
											type="button"
											className="absolute right-3 top-2 text-gray-500 hover:text-indigo-600"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										>
											{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
										</button>
									</div>
									{passwordData.new && passwordData.confirm && (
										<p className={`text-xs mt-1 ${passwordData.new === passwordData.confirm
											? 'text-green-600'
											: 'text-red-600'
											}`}>
											{passwordData.new === passwordData.confirm
												? '✓ Las contraseñas coinciden'
												: '✗ Las contraseñas no coinciden'}
										</p>
									)}
								</div>
							</div>



							<div className="mt-6 flex justify-end space-x-3">
								<button
									onClick={() => setShowPasswordModal(false)}
									className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
								>
									Cancelar
								</button>
								<button
									onClick={handlePasswordSubmit}
									disabled={!isPasswordValid()}
									className={`px-4 py-2 rounded-md text-white transition-colors ${!isPasswordValid()
										? 'bg-gray-400 cursor-not-allowed'
										: 'bg-indigo-600 hover:bg-indigo-700'
										}`}
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
										<div>
											<FirmaInput
												value={userData.firma_digital}
												onChange={(value) =>
													setUserData((prev) => ({ ...prev, firma_digital: value }))
												}
												label="Firma del elaborado por"
											/>

										</div>
										{/* seccion de subir firma */}
										<div className="space-y-4">
											<label className="block text-sm font-medium text-gray-500">
												Subir firma (PNG)
											</label>
											<input
												type="file"
												accept="image/png"
												onChange={(e) => {
													const file = e.target.files[0];
													if (file) {
														handleSeleccionFirma(file);
													}
												}}
												className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
											/>

											{/* Modal simple con Tailwind */}
											{openCrop && (
												<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50 z-50">
													<div className="bg-white border-2 border-gray-200 rounded-lg p-4 w-full max-w-lg space-y-4 shadow-lg">
														<h2 className="text-lg font-semibold">Recortar firma</h2>

														{firmaPreview && (
															<Cropper
																src={firmaPreview}
																style={{ height: 300, width: "100%" }}
																aspectRatio={450 / 200} // firma rectangular
																guides={false}
																ref={cropperRef}
																viewMode={1}
																background={false}
															/>
														)}

														<div className="flex justify-end space-x-2">
															<button
																className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
																onClick={() => setOpenCrop(false)}
															>
																Cancelar
															</button>
															<button
																className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
																onClick={handleRecortarFirma}
															>
																Aceptar
															</button>
														</div>
													</div>
												</div>
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
