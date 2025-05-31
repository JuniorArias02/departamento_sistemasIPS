import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../store/AppContext";
import { ADMINISTRADOR } from "../../../const/variable_entorno";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import useAvatar from "../../../hook/useAvatar";
import { motion } from "framer-motion";
import { useIsMobile } from "../../../hook/useMobile";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {

	const navigate = useNavigate();
	const { usuario, logout } = useApp();
	const [menuUsuariosOpen, setMenuUsuariosOpen] = useState(false);
	const [menuFormulariosOpen, setMenuFormulariosOpen] = useState(false);
	const avatarSrc = useAvatar(usuario?.nombre_completo, usuario?.avatar);

	const isMobile = useIsMobile();

	const variants = {
		open: { x: 0, pointerEvents: "auto", transition: { type: "spring", stiffness: 300, damping: 30 } },
		closed: { x: "-100%", pointerEvents: "none", transition: { type: "spring", stiffness: 300, damping: 30 } },
	};

	const handleLogout = () => {
		logout();
		setSidebarOpen(false);
		navigate("/");
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
    bg-custom-blue-1 text-white h-screen shadow-md z-40 transition-all duration-100 ease-in-out overflow-hidden
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
				<div className="flex items-center space-x-3 mb-6 p-2 rounded bg-[#085286] transition cursor-context-menu">
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
					{usuario?.rol === ADMINISTRADOR && (
						<>
							<li>
								<button
									onClick={() => setMenuUsuariosOpen(!menuUsuariosOpen)}
									className="w-full flex justify-between items-center text-left px-3 py-2 rounded hover:bg-blue-600 transition"
								>
									Usuarios
									{menuUsuariosOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
								</button>

								{menuUsuariosOpen && (
									<ul className="ml-4 mt-2 space-y-2 text-sm">
										<li>
											<button
												onClick={() => navigate("/dashboard/view_usuarios")}
												className="w-full text-left px-2 py-1 rounded hover:bg-blue-700"
											>
												Ver Usuarios
											</button>
										</li>

									</ul>
								)}
							</li>

							<li>
								<button
									onClick={() => setMenuFormulariosOpen(!menuFormulariosOpen)}
									className="w-full flex justify-between items-center text-left px-3 py-2 rounded hover:bg-blue-600 transition"
								>
									Formularios
									{menuFormulariosOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
								</button>

								{menuFormulariosOpen && (
									<ul className="ml-4 mt-2 space-y-2 text-sm">
										<li>
											<button className="w-full text-left px-2 py-1 rounded hover:bg-blue-700">
												Ver Formularios
											</button>
										</li>
										<li>
											<button className="w-full text-left px-2 py-1 rounded hover:bg-blue-700">
												Crear Formulario
											</button>
										</li>
									</ul>
								)}
							</li>
						</>
					)}

					<li>
						<button
							onClick={handleLogout}
							className="w-full flex items-center space-x-2 px-3 py-2 rounded hover:bg-red-600 transition text-left"
							title="Cerrar sesión"
						>
							<LogOut size={18} />
							<span>Cerrar Sesión</span>
						</button>
					</li>
				</ul>

			</motion.aside >
		</>
	);
}
