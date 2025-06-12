import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../store/AppContext";
import { Wrench, ChevronDown, ChevronUp, LogOut, Home, Users, List, FileText, PlusSquare, Eye, Shield, PlusCircle, LockKeyhole, Edit, UserPlus } from "lucide-react";
import useAvatar from "../../../hook/useAvatar";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "../../../hook/useMobile";
import { PERMISOS } from "../../../secure/permisos/permisos";
import Swal from "sweetalert2";
import { mostrarAlertaSinPermiso } from "../../../hook/useError";
import { RUTAS } from "../../../const/routers/routers";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
	const navigate = useNavigate();
	const { usuario, permisos, logout } = useApp();
	const [menuUsuariosOpen, setMenuUsuariosOpen] = useState(false);
	const [menuFormulariosOpen, setMenuFormulariosOpen] = useState(false);
	const [menuRolesOpen, setMenuRolesOpen] = useState(false);
	const [nuevosFormularios, setNuevosFormularios] = useState(0);
	const avatarSrc = useAvatar(usuario?.nombre_completo, usuario?.avatar);
	const isMobile = useIsMobile();
	const variants = {
		open: {
			x: 0,
			pointerEvents: "auto",
			transition: { type: "spring", stiffness: 300, damping: 30 },
		},
		closed: {
			x: "-100%",
			pointerEvents: "none",
			transition: { type: "spring", stiffness: 300, damping: 30 },
		},
	};

	const subMenuVariants = {
		hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
		visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
	};


	useEffect(() => {
		const fetchNuevosFormularios = async () => {
			setNuevosFormularios(3);
		};

		fetchNuevosFormularios();
	}, []);


	const handleLogout = () => {
		logout();
		setSidebarOpen(false);
		navigate(RUTAS.LOGIN);
	};

	return (
		<>
			{isMobile && sidebarOpen && (
				<div
					className="fixed inset-0 bg-[#05050529] bg-opacity-50 z-30"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
			<motion.aside
				className={`
          bg-[#013459] text-white h-screen shadow-md z-40 transition-all duration-100 ease-in-out overflow-hidden
          ${isMobile
						? "fixed top-0 left-0 w-64 p-4"
						: sidebarOpen
							? "relative w-64 p-4"
							: "relative w-0 p-0"
					}
        `}
				initial="closed"
				animate={sidebarOpen ? "open" : "closed"}
				variants={variants}
			>
				{/* Perfil usuario */}
				<div className="flex items-center space-x-3 mb-6 p-2 rounded bg-[#085286] transition cursor-context-menu ">
					<img
						src={avatarSrc}
						alt="Avatar"
						className="w-12 h-12 rounded-full object-cover"
					/>
					<div>
						<p className="font-semibold">{usuario?.nombre_completo || "Usuario"}</p>
						<p className="text-sm text-gray-300">{usuario?.rol}</p>
					</div>
				</div>

				<h2 className="text-lg font-semibold mb-4 text-center">Menú</h2>
				<ul className="space-y-4">
					{permisos.includes(PERMISOS.INGRESAR_SIDEBAR_ADMIN) && (
						<>
							<li>
								<button
									onClick={() => navigate(RUTAS.ADMIN.ROOT)}
									className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
								>
									<Home size={18} />
									Inicio
								</button>
							</li>

							<li>
								<button
									onClick={() => {
										if (permisos.includes(PERMISOS.MENU_ITEM_USUARIOS)) {
											setMenuUsuariosOpen(!menuUsuariosOpen);
										} else {
											mostrarAlertaSinPermiso();
										}
									}}
									className="w-full flex justify-between items-center text-left px-3 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
								>
									<Users size={18} />
									Usuarios
									{menuUsuariosOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
								</button>

								<AnimatePresence>
									{menuUsuariosOpen && permisos.includes(PERMISOS.ACCESO_MODULO_USUARIO) && (
										<motion.ul
											className="ml-4 mt-2 space-y-2 text-sm overflow-hidden"
											initial="hidden"
											animate="visible"
											exit="hidden"
											variants={subMenuVariants}
										>
											<li>
												<button
													onClick={() => {
														if (permisos.includes(PERMISOS.VER_DATOS_USUARIOS)) {
															navigate(RUTAS.ADMIN.USUARIOS.ROOT);
														} else {
															mostrarAlertaSinPermiso();
														}
													}}
													className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2"
												>
													<Eye size={16} />
													Ver Usuarios
												</button>
											</li>
											<li>
												<button
													onClick={() => {
														if (permisos.includes(PERMISOS.AGREGAR_USUARIO)) {
															navigate(RUTAS.ADMIN.USUARIOS.CREAR_USUARIO);
														} else {
															mostrarAlertaSinPermiso();
														}
													}}
													className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2"
												>
													<UserPlus size={16} />
													Crear Usuario
												</button>
											</li>

										</motion.ul>
									)}
								</AnimatePresence>
							</li>
							<li>
								<button
									onClick={() => {
										if (permisos.includes(PERMISOS.MENU_ITEM_ROLES)) {
											setMenuRolesOpen(!menuRolesOpen);
										} else {
											mostrarAlertaSinPermiso();
										}
									}}
									className="w-full flex justify-between items-center text-left px-3 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
								>
									<Shield size={18} />
									Gestión de Roles
									{menuRolesOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
								</button>

								<AnimatePresence>
									{menuRolesOpen && permisos.includes(PERMISOS.ACCESO_MODULO_ROLES) && (
										<motion.ul
											className="ml-4 mt-2 space-y-2 text-sm overflow-hidden"
											initial="hidden"
											animate="visible"
											exit="hidden"
											variants={subMenuVariants}
										>
											{permisos.includes(PERMISOS.VER_LISTADO_ROLES) && (
												<li>
													<button
														onClick={() => navigate(RUTAS.ADMIN.ROLES.VISTA_DATOS)}
														className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2"
													>
														<List size={16} />
														Listado de Roles
													</button>
												</li>
											)}

											{permisos.includes(PERMISOS.CREAR_ROLES) && (
												<li>
													<button
														onClick={() => navigate(RUTAS.PAGINA_CONSTRUCCION)}
														className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2"
													>
														<PlusCircle size={16} />
														Crear Nuevo Rol
													</button>
												</li>
											)}

											{permisos.includes(PERMISOS.ASIGNAR_PERMISOS) && (
												<li>
													<button
														onClick={() => navigate(RUTAS.PAGINA_CONSTRUCCION)}
														className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2"
													>
														<LockKeyhole size={16} />
														Asignar Permisos
													</button>
												</li>
											)}

											{permisos.includes(PERMISOS.EDITAR_ROLES) && (
												<li>
													<button
														onClick={() => navigate(RUTAS.PAGINA_CONSTRUCCION)}
														className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2"
													>
														<Edit size={16} />
														Editar Roles
													</button>
												</li>
											)}
										</motion.ul>
									)}
								</AnimatePresence>
							</li>

							<li>
								<button
									onClick={() => setMenuFormulariosOpen(!menuFormulariosOpen)}
									className="w-full flex justify-between items-center text-left px-3 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
								>
									<FileText size={18} />
									Formularios
									{menuFormulariosOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
								</button>

								<AnimatePresence>
									{menuFormulariosOpen && (
										<motion.ul
											className="ml-4 mt-2 space-y-2 text-sm overflow-hidden"
											initial="hidden"
											animate="visible"
											exit="hidden"
											variants={subMenuVariants}
										>
											<li>
												<button
													onClick={() => navigate(RUTAS.DASHBOARD)}
													className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2"
												>
													<List size={16} />
													<span>Ver Formularios</span>
												</button>

											</li>
											<li>
												<button
													onClick={() => navigate(RUTAS.PAGINA_CONSTRUCCION)}
													className="w-full text-left px-2 py-1 rounded hover:bg-blue-700 cursor-pointer flex items-center gap-2">
													<PlusSquare size={16} />
													Crear Formulario
												</button>

											</li>
										</motion.ul>
									)}
								</AnimatePresence>
							</li>

							<li>
								<button
									onClick={() => navigate(RUTAS.USER.MANTENIMIENTO_FREEZER.VISTA_DATOS)}
									className="w-full flex justify-between items-center text-left px-3 py-2 rounded hover:bg-blue-600 transition cursor-pointer group"
								>
									<div className="flex items-center gap-2">
										<Wrench size={18} className="group-hover:text-white" />
										<span className="group-hover:text-white">Mantenimientos IPS</span>
									</div>

									{/* Notificación dinámica */}
									{nuevosFormularios > 0 && (
										<span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
											{nuevosFormularios}
										</span>
									)}
								</button>
							</li>
						</>
					)}

					<li>
						<button
							onClick={handleLogout}
							className="w-full flex items-center space-x-2 px-3 py-2 rounded hover:bg-red-600 transition text-left cursor-pointer"
							title="Cerrar sesión"
						>
							<LogOut size={18} />
							<span>Cerrar Sesión</span>
						</button>
					</li>
				</ul>
			</motion.aside>
		</>
	);
}
