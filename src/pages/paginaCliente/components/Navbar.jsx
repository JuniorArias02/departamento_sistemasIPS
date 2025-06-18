import { LogOut, Menu, X, Cpu, Bell, User } from "lucide-react";
import { useApp } from "../../../store/AppContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { PERMISOS } from "../../../secure/permisos/permisos";
import { RUTAS } from "../../../const/routers/routers";
import { useState, useRef, useEffect } from "react";
import DepartamentoSistemas from "./DepartamentoSistemas";

export default function Navbar({ toggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const { usuario, logout, permisos} = useApp();
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setMostrarMenu(prev => !prev);

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMostrarMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate(RUTAS.LOGIN);
      }
    });
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-700 to-violet-800 text-white px-6 py-3 shadow-lg flex justify-between items-center border-b border-white/10">
        {/* Parte izquierda */}
        <div className="flex items-center gap-5">
          {permisos.includes(PERMISOS.INGRESAR_SIDEBAR_ADMIN) && toggleSidebar && (
            <motion.button
              onClick={toggleSidebar}
              className="z-50 p-1 rounded-lg hover:bg-white/10 transition-colors"
              title={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle sidebar"
            >
              <motion.div
                animate={{
                  rotate: sidebarOpen ? 180 : 0
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15
                }}
              >
                {sidebarOpen ? (
                  <X size={24} className="text-white/90" />
                ) : (
                  <Menu size={24} className="text-white/90" />
                )}
              </motion.div>
            </motion.button>
          )}

          <DepartamentoSistemas />
        </div>

        {/* Parte derecha */}
        <div className="flex items-center gap-4">
          {/* Notificaciones (opcional) */}
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5 text-white/90" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative" ref={menuRef}>
            {/* Click para mostrar menú */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={toggleMenu}
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-medium text-white/90">
                  {usuario?.nombre_completo || "Usuario"}
                </span>
                <span className="text-xs text-white/60">
                  {usuario?.rol || "Administrador"}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 hover:border-white/40">
                {usuario?.foto ? (
                  <img src={usuario.foto} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white/80" />
                )}
              </div>
            </div>

            {/* Menú */}
            {mostrarMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">{usuario?.nombre_completo}</div>
                  <div className="text-xs text-gray-500">{usuario?.email}</div>
                </div>
                <a
                  onClick={() => {
                    navigate(RUTAS.USER.PERFIL.ROOT);
                    setTimeout(() => setMostrarMenu(false), 150);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Mi perfil
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Configuración
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
          {/* Botón de salir - versión móvil */}
          <button
            onClick={handleLogout}
            className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-5 h-5 text-white/90" />
          </button>
        </div>
      </nav>
    </>
  );
}