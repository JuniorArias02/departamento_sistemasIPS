import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../store/AppContext";
import {
	CalendarRange,
	Store,
	Bug,
	CalendarDays,
	Newspaper,
	ClipboardEdit,
	Download,
	FileSearch,
	ScrollText,
	CalendarClock,
	Wrench,
	BellIcon,
	ChevronDown,
	ChevronUp,
	Bell,
	Menu,
	ServerCog,
	LogOut,
	Home,
	Users,
	List,
	FileText,
	PlusSquare,
	Eye,
	Shield,
	PlusCircle,
	LockKeyhole,
	Edit,
	UserPlus,
	KeyRound,
	ShieldPlus,
	UserCog,
	Laptop,
	Plus,
	ClipboardSignature,
	ListTodo,
	Package,
	BarChart2,
	Truck
} from "lucide-react";

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
	const [menuSistemaOpen, setMenuSistemaOpen] = useState(false);
	const [nuevosFormularios, setNuevosFormularios] = useState(0);
	const [menuAgendamientoMantenimientoOpen, setMenuAgendamientoMantenimientoOpen] = useState(false);
	const [menuGestionComprasOpen, setMenuGestionComprasOpen] = useState(false);
	const [animarCampana, setAnimarCampana] = useState(false);
	const avatarSrc = useAvatar(usuario?.nombre_completo, usuario?.avatar);
	const isMobile = useIsMobile();
	const [menuReportesOpen, setMenuReportesOpen] = useState(false);
	const [menuEquiposOpen, setMenuEquiposOpen] = useState(false);
	const [menuComplementosOpen, setMenuComplementosOpen] = useState(false);
	const [menuPersonalOpen, setMenuPersonalOpen] = useState(false);

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
			if (
				usuario?.id &&
				(permisos.includes(PERMISOS.MANTENIMIENTOS.CONTAR_TODOS_PENDIENTES) ||
					permisos.includes(PERMISOS.MANTENIMIENTOS.CONTAR_PROPIOS_PENDIENTES))
			) {
				try {
					const pendientes = await fetchNotificacionesPendientes(usuario.id);
					setNuevosFormularios(pendientes);
				} catch (error) {
					console.error("Error al obtener nuevos formularios:", error);
					setNuevosFormularios(0);
				}
			} else {
				setNuevosFormularios(0);
			}
		};

		fetchNuevosFormularios();

	}, [usuario?.id, permisos]);



	const handleLogout = () => {
		logout();
		setSidebarOpen(false);
		navigate(RUTAS.LOGIN);
	};

	const containerVariants = {
		open: {
			width: "18rem",
			transition: {
				type: "spring",
				damping: 25,
				stiffness: 200,
				when: "beforeChildren",
				staggerChildren: 0.05
			}
		},
		closed: {
			width: "4.5rem",
			transition: {
				type: "spring",
				damping: 30,
				stiffness: 200,
				when: "afterChildren",
				staggerChildren: 0.02,
				staggerDirection: -1
			}
		}
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
				className="fixed md:relative bg-gradient-to-b from-indigo-900 to-violet-900 text-white h-screen shadow-xl z-40 overflow-y-auto scrollbar-hide"
				initial={isMobile ? { x: "-100%" } : { width: "4.5rem" }}
				animate={
					isMobile
						? sidebarOpen
							? { x: 0 }
							: { x: "-100%" }
						: sidebarOpen
							? "open"
							: "closed"
				}
				variants={!isMobile ? containerVariants : undefined}
				transition={{ duration: 0.3 }}
			>
				{/* Perfil usuario - Versión optimizada */}
				<motion.div
					className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 mx-2 mt-3"
					whileHover={{ scale: 1.02 }}
					transition={{ type: "spring", stiffness: 200 }}
				>
					<div className="relative flex-shrink-0">
						<img
							src={avatarSrc}
							alt="Avatar"
							className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
						/>
						<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-indigo-900"></div>
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
								<p className="font-medium poppins-medium text-sm text-white/90 truncate max-w-[160px]">
									{usuario?.nombre_completo || "Usuario"}
								</p>
								<p className="text-[11px] inter-regular text-white/60 truncate max-w-[160px]">
									{usuario?.rol}
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>


				{/* Menú principal */}
				<ul className="space-y-2 px-4 overflow-y-auto" >
					{permisos.includes(PERMISOS.SISTEMA.INGRESAR_SIDEBAR_ADMIN) && (
						<>
							{/* Ítems del menú */}
							{permisos.includes(PERMISOS.SISTEMA.INGRESAR_DASHBOARDADMIN) && (
								<SidebarItem
									icon={<Home size={18} />}
									text="Inicio"
									onClick={() => {
										navigate(RUTAS.ADMIN.ROOT);
										// setTimeout(() => setSidebarOpen(false), 150);
									}}
									sidebarOpen={sidebarOpen}
									isActive={location.pathname === RUTAS.ADMIN.ROOT}
								/>
							)}

							{/* Menú Sistema */}
							{permisos.includes(PERMISOS.ADMINISTRADOR_WEB.MENU_ITEM) && (
								<SidebarCollapsible
									icon={<ServerCog size={18} />} // o algún ícono como <Settings size={18} />
									text="Sistema"
									isOpen={menuSistemaOpen}
									onClick={() =>
										permisos.includes(PERMISOS.ADMINISTRADOR_WEB.MENU_ITEM)
											? setMenuSistemaOpen(!menuSistemaOpen)
											: mostrarAlertaSinPermiso()}
									sidebarOpen={sidebarOpen}
								>
									<SidebarSubItem
										icon={<Bell size={16} />}
										text="Avisos Web"
										onClick={() => {
											if (permisos.includes(PERMISOS.ADMINISTRADOR_WEB.CREAR_AVISO_ACTUALIZACION)) {
												navigate(RUTAS.ADMIN.SISTEMA.ACTUALIZACIONES_WEB);
												// setTimeout(() => setSidebarOpen(false), 150);
											} else {
												mostrarAlertaSinPermiso();
											}
										}}
										isActive={location.pathname === RUTAS.ADMIN.SISTEMA.ACTUALIZACIONES_WEB}
										sidebarOpen={sidebarOpen}
										delay={0.1}
									/>
								</SidebarCollapsible>
							)}

							{/* Menú Usuarios */}
							{permisos.includes(PERMISOS.USUARIOS.MENU_ITEM) && (
								<SidebarCollapsible
									icon={<Users size={18} />}
									text="Usuarios"
									isOpen={menuUsuariosOpen}
									onClick={() =>
										permisos.includes(PERMISOS.USUARIOS.MENU_ITEM)
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
										isActive={location.pathname === RUTAS.ADMIN.USUARIOS.CREAR_USUARIO}
										sidebarOpen={sidebarOpen}
										delay={0.2}
									/>
								</SidebarCollapsible>
							)}


							{/* Menú Roles */}
							{permisos.includes(PERMISOS.ROLES.MENU_ITEM) && (
								<SidebarCollapsible
									icon={<Shield size={18} />}
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
											onClick={() => navigate(RUTAS.ADMIN.ROLES.CREAR_ROL)}
											isActive={location.pathname === RUTAS.ADMIN.ROLES.CREAR_ROL}
											sidebarOpen={sidebarOpen}
											delay={0.2}
										/>
									)}
								</SidebarCollapsible>
							)}

							{/* Gestión de Permisos */}
							{permisos.includes(PERMISOS.GESTION_PERMISOS.MENU_ITEM) && (
								<SidebarCollapsible
									icon={<KeyRound size={18} />}
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
										isActive={location.pathname === RUTAS.CREAR_PERMISO}
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
										isActive={location.pathname === RUTAS.ADMIN.PERMISOS.ASIGNAR}
										sidebarOpen={sidebarOpen}
										delay={0.2}
									/>
								</SidebarCollapsible>
							)}


							{/* Menú Formularios */}
							<SidebarCollapsible
								icon={<FileText size={18} />}
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
										// setTimeout(() => setSidebarOpen(false), 150);
									}}
									isActive={location.pathname === RUTAS.DASHBOARD}
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
							{permisos.includes(PERMISOS.MANTENIMIENTOS.VER_DATOS) && (
								<SidebarItem
									icon={
										<div className={`relative ${animarCampana ? "animate-bell" : ""}`}>
											<Bell size={18} />
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
										// setTimeout(() => setSidebarOpen(false), 150);
									}}
									sidebarOpen={sidebarOpen}
									isActive={location.pathname.includes(RUTAS.USER.MANTENIMIENTO.ROOT)}
									delay={0.3}
								/>
							)}

							{/* MENU DE AGENDAMIENTO DE MANTENIMIENTOS */}
							{permisos.includes(PERMISOS.AGENDAMIENTO_MANTENIMIENTOS.MENU_ITEM) && (
								<SidebarCollapsible
									icon={<CalendarRange size={18} />}
									text="Agendar Mantenimiento"
									isOpen={menuAgendamientoMantenimientoOpen}
									onClick={() =>
										permisos.includes(PERMISOS.AGENDAMIENTO_MANTENIMIENTOS.MENU_ITEM)
											? setMenuAgendamientoMantenimientoOpen(!menuAgendamientoMantenimientoOpen)
											: mostrarAlertaSinPermiso()
									}
									sidebarOpen={sidebarOpen}
								>
									{permisos.includes(PERMISOS.AGENDAMIENTO_MANTENIMIENTOS.VER_CALENDARIO) && (
										<SidebarSubItem
											icon={<CalendarDays size={16} />}
											text="Ver Calendario"
											onClick={() => {
												navigate(RUTAS.USER.MANTENIMIENTO.AGENDA_MANTENIMIENTOS);
												// setTimeout(() => setSidebarOpen(false), 150);
											}}
											isActive={location.pathname === RUTAS.USER.MANTENIMIENTO.AGENDA_MANTENIMIENTOS}
											sidebarOpen={sidebarOpen}
											delay={0.1}
										/>
									)}
								</SidebarCollapsible>
							)}

							{/* gestion compras  */}
							{permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.MENU_ITEM) && (
								<SidebarCollapsible
									icon={<Store size={18} />}
									text="Gestion de pedidos"
									isOpen={menuGestionComprasOpen}
									onClick={() =>
										permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.MENU_ITEM)
											? setMenuGestionComprasOpen(!menuGestionComprasOpen)
											: mostrarAlertaSinPermiso()
									}
									sidebarOpen={sidebarOpen}
								>
									{permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.CREAR_PEDIDO) && (
										<SidebarSubItem
											icon={<Newspaper size={16} />}
											text="Crear Pedido"
											onClick={() => {
												navigate(RUTAS.USER.GESTION_COMPRAS.CREAR_PEDIDO);
												// se	tTimeout(() => setSidebarOpen(false), 150);
											}}
											isActive={location.pathname === RUTAS.USER.GESTION_COMPRAS.CREAR_PEDIDO}
											sidebarOpen={sidebarOpen}
											delay={0.1}
										/>
									)}

									{permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.VER_PEDIDOS) && (
										<SidebarSubItem
											icon={<ScrollText size={16} />}
											text="Gestionar Pedidos"
											onClick={() => {
												navigate(RUTAS.USER.GESTION_COMPRAS.ROOT);
												// setTimeout(() => setSidebarOpen(false), 150);
											}}
											isActive={location.pathname === RUTAS.USER.GESTION_COMPRAS.ROOT}
											sidebarOpen={sidebarOpen}
											delay={0.1}
										/>
									)}

									{permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.VER_PEDIDOS) && (
										<SidebarSubItem
											icon={<BarChart2 size={16} />}
											text="informes de Compras"
											onClick={() => {
												navigate(RUTAS.USER.GESTION_COMPRAS.INFORMES);
												// setTimeout(() => setSidebarOpen(false), 150);
											}}
											isActive={location.pathname === RUTAS.USER.GESTION_COMPRAS.INFORMES}
											sidebarOpen={sidebarOpen}
											delay={0.1}
										/>
									)}

									{permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.VER_PEDIDOS) && (
										<SidebarSubItem
											icon={<Truck size={16} />}
											text="Proveedor"
											onClick={() => {
												navigate(RUTAS.USER.GESTION_COMPRAS.PROVEEDOR);
												// setTimeout(() => setSidebarOpen(false), 150);
											}}
											isActive={location.pathname === RUTAS.USER.GESTION_COMPRAS.PROVEEDOR}
											sidebarOpen={sidebarOpen}
											delay={0.1}
										/>
									)}
								</SidebarCollapsible>
							)}

							{/* equipos de computo */}
							{permisos.includes(PERMISOS.GESTION_EQUIPOS.MENU_ITEM) && (
								<SidebarCollapsible
									icon={<Laptop size={18} />}
									text="Equipos de Cómputo"
									isOpen={menuEquiposOpen}
									onClick={() =>
										permisos.includes(PERMISOS.GESTION_EQUIPOS.MENU_ITEM)
											? setMenuEquiposOpen(!menuEquiposOpen)
											: mostrarAlertaSinPermiso()
									}
									sidebarOpen={sidebarOpen}
								>
									{/* Subitem 1: Agregar Equipo */}
									<SidebarSubItem
										icon={<Plus size={16} />}  // Icono simple de "+"
										text="Agregar Equipo"
										onClick={() => {
											if (permisos.includes(PERMISOS.GESTION_EQUIPOS.AGREGAR)) {
												navigate(RUTAS.USER.EQUIPOS.CREAR_EQUIPO);
												// setTimeout(() => setSidebarOpen(false), 150);
											} else {
												mostrarAlertaSinPermiso();
											}
										}}
										isActive={location.pathname === RUTAS.USER.EQUIPOS.CREAR_EQUIPO}
										sidebarOpen={sidebarOpen}
										delay={0.1}
									/>

									{/* Subitem 2: Crear Acta de Entrega */}
									<SidebarSubItem
										icon={<ClipboardSignature size={16} />}
										text="Crear Acta de Entrega"
										onClick={() => {
											if (permisos.includes(PERMISOS.GESTION_EQUIPOS.CREAR_ACTA)) {
												navigate(RUTAS.USER.EQUIPOS.CREAR_ACTA_ENTREGA);
											} else {
												mostrarAlertaSinPermiso();
											}
										}}
										isActive={location.pathname === RUTAS.USER.EQUIPOS.CREAR_ACTA_ENTREGA}
										sidebarOpen={sidebarOpen}
										delay={0.2}
									/>

									{/* Subitem 3: Crear Mantenimiento */}
									<SidebarSubItem
										icon={<Wrench size={16} />}
										text="Crear Mantenimiento"
										onClick={() => {
											if (permisos.includes(PERMISOS.GESTION_EQUIPOS.CREAR_MANTENIMIENTO)) {
												navigate(RUTAS.USER.EQUIPOS.CREAR_ACTA_MANTENIMIENTO);
											} else {
												mostrarAlertaSinPermiso();
											}
										}}
										isActive={location.pathname === RUTAS.USER.EQUIPOS.CREAR_ACTA_MANTENIMIENTO}
										sidebarOpen={sidebarOpen}
										delay={0.3}
									/>

									{/* Subitem 4: Ver Equipos */}
									<SidebarSubItem
										icon={<ListTodo size={16} />}
										text="Ver Equipos de Cómputo"
										onClick={() => {
											if (permisos.includes(PERMISOS.GESTION_EQUIPOS.VER)) {
												navigate(RUTAS.USER.EQUIPOS.ROOT);
											} else {
												mostrarAlertaSinPermiso();
											}
										}}
										isActive={location.pathname === RUTAS.USER.EQUIPOS.ROOT}
										sidebarOpen={sidebarOpen}
										delay={0.4}
									/>
								</SidebarCollapsible>
							)}
							{/* reporte */}
							<SidebarCollapsible
								icon={<Bug size={18} />}
								text="Reportes"
								isOpen={menuReportesOpen}
								onClick={() => setMenuReportesOpen(!menuReportesOpen)}
								sidebarOpen={sidebarOpen}
								isBeta={false}
							>

								<SidebarSubItem
									icon={<FileSearch size={16} />}
									text="Ver Reportes"
									onClick={() => {
										navigate(RUTAS.USER.REPORTES.ROOT);
										// setTimeout(() => setSidebarOpen(false), 150);
									}}
									isActive={location.pathname === RUTAS.USER.REPORTES.ROOT}
									sidebarOpen={sidebarOpen}
									delay={0.2}
								/>

								<SidebarSubItem
									icon={<ClipboardEdit size={16} />}
									text="Reportar Problema"
									onClick={() => {
										navigate(RUTAS.USER.REPORTES.CREAR_REPORTE);
										// setTimeout(() => setSidebarOpen(false), 150);
									}}
									isActive={location.pathname === RUTAS.USER.REPORTES.CREAR_REPORTE}
									sidebarOpen={sidebarOpen}
									delay={0.1}
								/>

							</SidebarCollapsible>

							{permisos.includes(PERMISOS.GESTION_PERSONAL.MENU_ITEM) && (
								<SidebarCollapsible
									icon={<Users size={18} />}
									text="Personal"
									isOpen={menuPersonalOpen}
									onClick={() => setMenuPersonalOpen(!menuPersonalOpen)}
									sidebarOpen={sidebarOpen}
									isBeta={false}
								>
									<SidebarSubItem
										icon={<ClipboardEdit size={16} />}
										text="Crear Personal"
										onClick={() => {
											navigate(RUTAS.USER.PERSONAL.CREAR_PERSONAL);
											// setTimeout(() => setSidebarOpen(false), 150);
										}}
										isActive={location.pathname === RUTAS.USER.PERSONAL.CREAR_PERSONAL}
										sidebarOpen={sidebarOpen}
										delay={0.1}
									/>

									<SidebarSubItem
										icon={<FileSearch size={16} />}
										text="Gestionar Personal"
										onClick={() => {
											navigate(RUTAS.USER.PERSONAL.ROOT);
											// setTimeout(() => setSidebarOpen(false), 150);
										}}
										isActive={location.pathname === RUTAS.USER.PERSONAL.ROOT}
										sidebarOpen={sidebarOpen}
										delay={0.2}
									/>
								</SidebarCollapsible>

							)}
						</>
					)}

					{/* Menú Complementos */}
					<SidebarCollapsible
						icon={<Package size={18} />}
						text="Complementos"
						isOpen={menuComplementosOpen}
						onClick={() => setMenuComplementosOpen(!menuComplementosOpen)}
						sidebarOpen={sidebarOpen}
					>
						<SidebarSubItem
							icon={<Download size={16} />}
							text="Descargar Hosts"
							onClick={() => {
								const link = document.createElement('a');
								link.href = '/hosts';
								link.download = 'hosts';
								link.click();
							}}
							sidebarOpen={sidebarOpen}
							delay={0.1}
						/>
						<SidebarSubItem
							icon={<Download size={16} />}
							text="Descargar Imagen"
							onClick={() => {
								const link = document.createElement('a');
								link.href = '/septiembre.png';
								link.download = 'img';
								link.click();
							}}
							sidebarOpen={sidebarOpen}
							delay={0.1}
						/>
					</SidebarCollapsible>

					{/* Cerrar sesión */}
					<motion.li
						className="mt-6"
						initial="hidden"
						animate={sidebarOpen ? "visible" : "hidden"}
						variants={{
							hidden: { opacity: 0, x: -10 },
							visible: { opacity: 1, x: 0 }
						}}
						transition={{ duration: 0.2, delay: 0.4 }}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<button
							onClick={handleLogout}
							className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-red-600/30 text-red-400 hover:text-red-200 transition-colors group"
							title="Cerrar sesión"
						>
							<LogOut size={18} className="group-hover:rotate-180 transition-transform" />
							{sidebarOpen && (
								<motion.span
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.45 }}
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
								<Home size={18} />
							</button>
						</Tooltip>

						{permisos.includes(PERMISOS.USUARIOS.MENU_ITEM) && (
							<Tooltip content="Usuarios" placement="right">
								<button
									onClick={() => navigate(RUTAS.ADMIN.USUARIOS.ROOT)}
									className="p-3 rounded-full hover:bg-white/10 transition-colors relative cursor-pointer"
								>
									<Users size={18} />
									{nuevosFormularios > 0 && (
										<span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
									)}
								</button>
							</Tooltip>
						)}
					</div>
				)}
			</motion.aside >
		</>
	);
}
