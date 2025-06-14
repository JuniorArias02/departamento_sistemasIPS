import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../store/AppContext";
import { Wrench, BellIcon, ChevronDown, ChevronUp, Bell, Menu, LogOut, Home, Users, List, FileText, PlusSquare, Eye, Shield, PlusCircle, LockKeyhole, Edit, UserPlus } from "lucide-react";
import { Tooltip } from "recharts";
import useAvatar from "../../../hook/useAvatar";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "../../../hook/useMobile";
import { PERMISOS } from "../../../secure/permisos/permisos";
import Swal from "sweetalert2";
import { mostrarAlertaSinPermiso } from "../../../hook/useError";
import { RUTAS } from "../../../const/routers/routers";
import { fetchNotificacionesPendientes } from "../../../services/mantenimiento_freezer";
import { NotificationBadge } from "./NotificationBadge";
import { SidebarCollapsible } from "./ux/SidebarCollapsible";
import { SidebarItem } from "./ux/SidebarItem";
import { SidebarSubItem } from "./ux/SidebarSubItem";
export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
	const navigate = useNavigate();
	const { usuario, permisos, logout } = useApp();
	const [menuUsuariosOpen, setMenuUsuariosOpen] = useState(false);
	const [menuFormulariosOpen, setMenuFormulariosOpen] = useState(false);
	const [menuRolesOpen, setMenuRolesOpen] = useState(false);
	const [nuevosFormularios, setNuevosFormularios] = useState(0);
	const [animarCampana, setAnimarCampana] = useState(false);
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
		if (nuevosFormularios > 0) {
			setAnimarCampana(true);
			const timeout = setTimeout(() => setAnimarCampana(false), 600);
			return () => clearTimeout(timeout);
		}
	}, [nuevosFormularios]);

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
				initial="closed"
				animate={sidebarOpen ? "open" : "closed"}
				variants={{
					open: {
						width: "18rem",
						transition: {
							type: "spring",
							damping: 25,
							stiffness: 200,
							mass: 0.5
						}
					},
					closed: {
						width: isMobile ? "0rem" : "5rem",
						transition: {
							type: "spring",
							damping: 30,
							stiffness: 200,
							mass: 0.5
						}
					}
				}}
				style={{
					willChange: "transform, width"
				}}
			>
				{/* Perfil usuario */}
				<motion.div
					className="flex items-center gap-3 mb-8 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 mx-3 mt-4"
					whileHover={{ scale: 1.02 }}
					transition={{ type: "spring", stiffness: 400 }}
				>
					<div className="relative">
						<img
							src={avatarSrc}
							alt="Avatar"
							className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
						/>
						<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-indigo-900"></div>
					</div>
					<motion.div
						animate={sidebarOpen ? "open" : "closed"}
						variants={{
							open: { opacity: 1, x: 0 },
							closed: { opacity: 0, x: -20 }
						}}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<p className="font-semibold text-white/90">{usuario?.nombre_completo || "Usuario"}</p>
						<p className="text-xs text-white/60">{usuario?.rol}</p>
					</motion.div>
				</motion.div>

				{/* Menú principal */}
				<ul className="space-y-1 px-3">
					{permisos.includes(PERMISOS.INGRESAR_SIDEBAR_ADMIN) && (
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
								onClick={() => permisos.includes(PERMISOS.MENU_ITEM_USUARIOS)
									? setMenuUsuariosOpen(!menuUsuariosOpen)
									: mostrarAlertaSinPermiso()}
								sidebarOpen={sidebarOpen}
								badge={5} // Ejemplo de notificación
							>
								<SidebarSubItem
									icon={<Eye size={16} />}
									text="Ver Usuarios"
									onClick={() => permisos.includes(PERMISOS.VER_DATOS_USUARIOS)
										? navigate(RUTAS.ADMIN.USUARIOS.ROOT)
										: mostrarAlertaSinPermiso()}
									isActive={location.pathname === RUTAS.ADMIN.USUARIOS.ROOT}
								/>
								<SidebarSubItem
									icon={<UserPlus size={16} />}
									text="Crear Usuario"
									onClick={() => permisos.includes(PERMISOS.AGREGAR_USUARIO)
										? navigate(RUTAS.ADMIN.USUARIOS.CREAR_USUARIO)
										: mostrarAlertaSinPermiso()}
								/>
							</SidebarCollapsible>

							{/* Menú Roles */}
							<SidebarCollapsible
								icon={<Shield size={20} />}
								text="Gestión de Roles"
								isOpen={menuRolesOpen}
								onClick={() => permisos.includes(PERMISOS.MENU_ITEM_ROLES)
									? setMenuRolesOpen(!menuRolesOpen)
									: mostrarAlertaSinPermiso()}
								sidebarOpen={sidebarOpen}
							>
								{permisos.includes(PERMISOS.VER_LISTADO_ROLES) && (
									<SidebarSubItem
										icon={<List size={16} />}
										text="Listado de Roles"
										onClick={() => navigate(RUTAS.ADMIN.ROLES.VISTA_DATOS)}
										isActive={location.pathname === RUTAS.ADMIN.ROLES.VISTA_DATOS}
									/>
								)}
								{permisos.includes(PERMISOS.CREAR_ROLES) && (
									<SidebarSubItem
										icon={<PlusCircle size={16} />}
										text="Crear Nuevo Rol"
										onClick={() => navigate(RUTAS.PAGINA_CONSTRUCCION)}
									/>
								)}
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
									onClick={() => navigate(RUTAS.DASHBOARD)}
								/>
								<SidebarSubItem
									icon={<PlusSquare size={16} />}
									text="Crear Formulario"
									onClick={() => navigate(RUTAS.PAGINA_CONSTRUCCION)}
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
									navigate(RUTAS.USER.MANTENIMIENTO_FREEZER.VISTA_DATOS);
									setTimeout(() => setSidebarOpen(false), 150);
								}}
								sidebarOpen={sidebarOpen}
								isActive={location.pathname.includes(RUTAS.USER.MANTENIMIENTO_FREEZER.ROOT)}
							/>
						</>
					)}

					{/* Cerrar sesión */}
					<motion.li
						className="mt-6"
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
					<div className="absolute inset-0 flex flex-col items-center pt-32 space-y-6">
						{/* Íconos solo */}
						<button
							onClick={() => setSidebarOpen(true)}
							className="p-3 rounded-full hover:bg-white/10 transition-colors"
							title="Expandir menú"
						>
							<Menu size={20} />
						</button>

						<Tooltip content="Inicio" placement="right">
							<button
								onClick={() => navigate(RUTAS.ADMIN.ROOT)}
								className="p-3 rounded-full hover:bg-white/10 transition-colors"
							>
								<Home size={20} />
							</button>
						</Tooltip>

						{/* Más íconos según permisos */}
						{permisos.includes(PERMISOS.MENU_ITEM_USUARIOS) && (
							<Tooltip content="Usuarios" placement="right">
								<button
									onClick={() => navigate(RUTAS.ADMIN.USUARIOS.ROOT)}
									className="p-3 rounded-full hover:bg-white/10 transition-colors relative"
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
