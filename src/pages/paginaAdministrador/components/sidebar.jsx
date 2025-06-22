import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../store/AppContext";
import { Wrench, BellIcon, ChevronDown, ChevronUp, Bell, Menu, LogOut, Home, Users, List, FileText, PlusSquare, Eye, Shield, PlusCircle, LockKeyhole, Edit, UserPlus, KeyRound, ShieldPlus, UserCog } from "lucide-react";
import { Tooltip } from "recharts";
import useAvatar from "../../../hook/useAvatar";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "../../../hook/useMobile";
import { PERMISOS } from "../../../secure/permisos/permisos";
import Swal from "sweetalert2";
import { mostrarAlertaSinPermiso } from "../../../hook/useError";
import { RUTAS } from "../../../const/routers/routers";
import { fetchNotificacionesPendientes } from "../../../services/mantenimiento_services";
import { SidebarCollapsible } from "./ux/SidebarCollapsible";
import { SidebarItem } from "./ux/SidebarItem";
import { SidebarSubItem } from "./ux/SidebarSubItem";


export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
	const navigate = useNavigate();
	const { usuario, permisos, logout } = useApp();
	const [menuUsuariosOpen, setMenuUsuariosOpen] = useState(false);
	const [menuFormulariosOpen, setMenuFormulariosOpen] = useState(false);
	const [menuRolesOpen, setMenuRolesOpen] = useState(false);
	const [menuPermisosOpen, setMenuPermisosOpen] = useState(false);
	const [nuevosFormularios, setNuevosFormularios] = useState(0);
	const [animarCampana, setAnimarCampana] = useState(false);
	const avatarSrc = useAvatar(usuario?.nombre_completo, usuario?.avatar);
	const isMobile = useIsMobile();


	useEffect(() => {
		if (nuevosFormularios > 0) {
			setAnimarCampana(true);
			const timeout = setTimeout(() => setAnimarCampana(false), 10000);
			return () => clearTimeout(timeout);
		}
	}, [nuevosFormularios]);

	useEffect(() => {
		if (!sidebarOpen) {
			setMenuUsuariosOpen(false);
			setMenuRolesOpen(false);
			setMenuFormulariosOpen(false);
		}
	}, [sidebarOpen]);

	useEffect(() => {
		const fetchNuevosFormularios = async () => {
			if (usuario?.id) {
				try {
					const pendientes = await fetchNotificacionesPendientes(usuario.id);
					setNuevosFormularios(pendientes);
				} catch (error) {
					console.error("Error al obtener nuevos formularios:", error);
					setNuevosFormularios(0);
				}
			}
		};
		fetchNuevosFormularios();
		const interval = setInterval(fetchNuevosFormularios, 3000);
		return () => clearInterval(interval);
	}, [usuario?.id]);

	const handleLogout = () => {
		logout();
		setSidebarOpen(false);
		navigate(RUTAS.LOGIN);
	};

	return (
		<>
			{isMobile && sidebarOpen && (
				<motion.div
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			<motion.aside
				className={`
    bg-gradient-to-b from-indigo-900 to-violet-900 text-white h-screen shadow-xl z-40 overflow-hidden
    ${isMobile ? "fixed top-0 left-0 w-72" : "relative"}
  `}
				initial={isMobile ? { x: "-100%" } : "closed"}
				animate={isMobile
					? sidebarOpen ? { x: 0 } : { x: "-100%" }
					: sidebarOpen ? "open" : "closed"
				}
				variants={!isMobile ? {
					open: {
						width: "18rem",
						transition: {
							type: "spring",
							damping: 25,
							stiffness: 200,
							mass: 0.5,
							delayChildren: 0.1,
							staggerChildren: 0.05,
						},
					},
					closed: {
						width: "5rem",
						transition: {
							type: "spring",
							damping: 30,
							stiffness: 200,
							mass: 0.5,
							staggerChildren: 0.02,
							staggerDirection: -1,
						},
					},
				} : undefined}
				transition={{ type: "spring", damping: 25, stiffness: 200 }}
				style={{ willChange: "transform, width" }}
			>
				{/* Perfil usuario - Versión optimizada */}
				<motion.div
					className="flex items-center gap-3 mb-8 p-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 mx-3 mt-4"
					whileHover={{ scale: 1.02 }}
					transition={{ type: "spring", stiffness: 200 }}
				>
					<div className="relative flex-shrink-0">
						<img
							src={avatarSrc}
							alt="Avatar"
							className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
						/>
						<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-indigo-900"></div>
					</div>

					<AnimatePresence>
						{sidebarOpen && (
							<motion.div
								key="profile-text"
								initial={{ opacity: 0, x: -10 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { delay: 0.15, duration: 0.2 }
								}}
								exit={{
									opacity: 0,
									x: -10,
									transition: { duration: 0.1 }
								}}
								className="overflow-hidden"
							>
								<p className="font-semibold text-white/90 truncate max-w-[180px]">
									{usuario?.nombre_completo || "Usuario"}
								</p>
								<p className="text-xs text-white/60 truncate max-w-[180px]">
									{usuario?.rol}
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Menú principal */}
				<ul className="space-y-1 px-3">
					{permisos.includes(PERMISOS.SISTEMA.INGRESAR_SIDEBAR_ADMIN) && (
						<>
							{/* Ítems del menú */}
							<SidebarItem
								icon={<Home size={20} />}
								text="Inicio"
								onClick={() => {
									navigate(RUTAS.ADMIN.ROOT);
									setTimeout(() => setSidebarOpen(false), 150);
								}}
								sidebarOpen={sidebarOpen}
								isActive={location.pathname === RUTAS.ADMIN.ROOT}
							/>

							{/* Menú Usuarios */}
							<SidebarCollapsible
								icon={<Users size={20} />}
								text="Usuarios"
								isOpen={menuUsuariosOpen}
								onClick={() => permisos.includes(PERMISOS.USUARIOS.MENU_ITEM)
									? setMenuUsuariosOpen(!menuUsuariosOpen)
									: mostrarAlertaSinPermiso()}
								sidebarOpen={sidebarOpen}
							>
								<SidebarSubItem
									icon={<Eye size={16} />}
									text="Ver Usuarios"
									onClick={() => {
										if (permisos.includes(PERMISOS.USUARIOS.VER_DATOS)) {
											navigate(RUTAS.ADMIN.USUARIOS.ROOT);
											setTimeout(() => setSidebarOpen(false), 150);
										} else {
											mostrarAlertaSinPermiso();
										}
									}}
									isActive={location.pathname === RUTAS.ADMIN.USUARIOS.ROOT}
									sidebarOpen={sidebarOpen}
									delay={0.1}
								/>
								<SidebarSubItem
									icon={<UserPlus size={16} />}
									text="Crear Usuario"
									onClick={() =>
										permisos.includes(PERMISOS.USUARIOS.CREAR)
											? navigate(RUTAS.ADMIN.USUARIOS.CREAR_USUARIO)
											: mostrarAlertaSinPermiso()}
									sidebarOpen={sidebarOpen}
									delay={0.2}
								/>
							</SidebarCollapsible>


							{/* Menú Roles */}
							<SidebarCollapsible
								icon={<Shield size={20} />}
								text="Gestión de Roles"
								isOpen={menuRolesOpen}
								onClick={() =>
									permisos.includes(PERMISOS.ROLES.MENU_ITEM)
										? setMenuRolesOpen(!menuRolesOpen)
										: mostrarAlertaSinPermiso()
								}
								sidebarOpen={sidebarOpen}
							>
								{permisos.includes(PERMISOS.ROLES.VER_LISTADO) && (
									<SidebarSubItem
										icon={<List size={16} />}
										text="Listado de Roles"
										onClick={() => navigate(RUTAS.ADMIN.ROLES.VISTA_DATOS)}
										isActive={location.pathname === RUTAS.ADMIN.ROLES.VISTA_DATOS}
										sidebarOpen={sidebarOpen}
										delay={0.1}
									/>
								)}
								{permisos.includes(PERMISOS.ROLES.CREAR) && (
									<SidebarSubItem
										icon={<PlusCircle size={16} />}
										text="Crear Nuevo Rol"
										onClick={() => navigate(RUTAS.PAGINA_CONSTRUCCION)}
										sidebarOpen={sidebarOpen}
										delay={0.2}
									/>
								)}
							</SidebarCollapsible>

							{/* Gestión de Permisos */}
							<SidebarCollapsible
								icon={<KeyRound size={20} />}
								text="Gestión de Permisos"
								isOpen={menuPermisosOpen}
								onClick={() =>
									permisos.includes(PERMISOS.GESTION_PERMISOS.MENU_ITEM)
										? setMenuPermisosOpen(!menuPermisosOpen)
										: mostrarAlertaSinPermiso()
								}
								sidebarOpen={sidebarOpen}
							>
								<SidebarSubItem
									icon={<ShieldPlus size={16} />}
									text="Crear Permiso"
									onClick={() => {
										if (permisos.includes(PERMISOS.GESTION_PERMISOS.CREAR)) {
											navigate(RUTAS.CREAR_PERMISO);
											setTimeout(() => setSidebarOpen(false), 150);
										} else {
											mostrarAlertaSinPermiso();
										}
									}}
									sidebarOpen={sidebarOpen}
									delay={0.1}
								/>
								<SidebarSubItem
									icon={<UserCog size={16} />}
									text="Asignar Permisos"
									onClick={() => {
										if (permisos.includes(PERMISOS.GESTION_PERMISOS.ASIGNAR)) {
											navigate(RUTAS.ADMIN.PERMISOS.ASIGNAR);
										} else {
											mostrarAlertaSinPermiso();
										}
									}}
									sidebarOpen={sidebarOpen}
									delay={0.2}
								/>
							</SidebarCollapsible>

							{/* Menú Formularios */}
							<SidebarCollapsible
								icon={<FileText size={20} />}
								text="Formularios"
								isOpen={menuFormulariosOpen}
								onClick={() => setMenuFormulariosOpen(!menuFormulariosOpen)}
								sidebarOpen={sidebarOpen}
							>
								<SidebarSubItem
									icon={<List size={16} />}
									text="Ver Formularios"
									onClick={() => {
										navigate(RUTAS.DASHBOARD);
										setTimeout(() => setSidebarOpen(false), 150);
									}}
									sidebarOpen={sidebarOpen}
									delay={0.1}
								/>
								<SidebarSubItem
									icon={<PlusSquare size={16} />}
									text="Crear Formulario"
									onClick={() => navigate(RUTAS.PAGINA_CONSTRUCCION)}
									sidebarOpen={sidebarOpen}
									delay={0.2}
								/>
							</SidebarCollapsible>


							{/* Ítem con notificación */}
							<SidebarItem
								icon={
									<div className={`relative ${animarCampana ? "animate-bell" : ""}`}>
										<Bell size={20} />
										{nuevosFormularios > 0 && (
											<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
												{nuevosFormularios}
											</span>
										)}
									</div>
								}
								text="Mantenimientos IPS"
								onClick={() => {
									navigate(RUTAS.USER.MANTENIMIENTO.VISTA_DATOS);
									setTimeout(() => setSidebarOpen(false), 150);
								}}
								sidebarOpen={sidebarOpen}
								isActive={location.pathname.includes(RUTAS.USER.MANTENIMIENTO.ROOT)}
								delay={0.3}
							/>

						</>
					)}

					{/* Cerrar sesión */}
					<motion.li
						className="mt-6"
						initial="hidden"
						animate={sidebarOpen ? "visible" : "hidden"}
						variants={{
							hidden: { opacity: 0, x: -10 },
							visible: { opacity: 1, x: 0 }
						}}
						transition={{ duration: 0.2, delay: 0.4 }} // Ajusta el delay como quieras
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<button
							onClick={handleLogout}
							className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-red-600/30 text-red-400 hover:text-red-200 transition-colors group"
							title="Cerrar sesión"
						>
							<LogOut size={20} className="group-hover:rotate-180 transition-transform" />
							{sidebarOpen && (
								<motion.span
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.45 }} // Para que el texto entre un poco después del ícono
									className="font-medium"
								>
									Cerrar Sesión
								</motion.span>
							)}
						</button>
					</motion.li>
				</ul>
				{/* Versión colapsada (mini sidebar) */}
				{!sidebarOpen && !isMobile && (
					<div className="flex flex-col items-center space-y-6">
						<Tooltip content="Inicio" placement="right">
							<button
								onClick={() => navigate(RUTAS.ADMIN.ROOT)}
								className="p-3 rounded-full hover:bg-white/10 transition-colors"
							>
								<Home size={20} />
							</button>
						</Tooltip>

						{permisos.includes(PERMISOS.USUARIOS.MENU_ITEM) && (
							<Tooltip content="Usuarios" placement="right">
								<button
									onClick={() => navigate(RUTAS.ADMIN.USUARIOS.ROOT)}
									className="p-3 rounded-full hover:bg-white/10 transition-colors relative cursor-pointer"
								>
									<Users size={20} />
									{nuevosFormularios > 0 && (
										<span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
									)}
								</button>
							</Tooltip>
						)}
					</div>
				)}
			</motion.aside>
		</>
	);
}
