import { LogOut, Menu, X } from "lucide-react";
import { useApp } from "../../../store/AppContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { PERMISOS } from "../../../secure/permisos/permisos";
export default function Navbar({ toggleSidebar, sidebarOpen }) {
  const navigate = useNavigate();
  const { usuario, logout, permisos } = useApp();
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
        navigate("/");
      }
    });
  };

  return (
    <>
      <nav className="bg-custom-blue-1 text-white px-4 py-3 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {permisos.includes(PERMISOS.INGRESAR_SIDEBAR_ADMIN) && toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="transition-transform duration-300 z-50"
              title={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            >

              <div
                className={`transform transition-transform duration-300 ${sidebarOpen ? "rotate-180" : "rotate-0"
                  }`}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </div>
            </button>

          )}

          <div className="font-bold text-lg sm:text-xl">
            Departamento De Sistemas 💻
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-6">
          {/* Solo mostrar nombre usuario si el sidebar está cerrado */}
          <AnimatePresence>
            {!sidebarOpen && (
              <motion.span
                className="capitalize"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                {usuario?.nombre_completo || "Usuario"}
              </motion.span>
            )}
          </AnimatePresence>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 hover:bg-blue-600 px-2 py-1 rounded transition"
            title="Cerrar sesión"
          >
            <LogOut size={20} />
            <span>Salir</span>
          </button>
        </div>
      </nav>
    </>
  );
}