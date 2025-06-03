import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "../../paginaAdministrador/components/sidebar";
import { Outlet } from "react-router-dom";
import { useApp } from "../../../store/AppContext";
import { ADMINISTRADOR } from "../../../const/variable_entorno";
import { useState } from "react";

export default function Layout() {
  const { usuario } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  return (
    <div className="min-h-screen flex">
      {/* Sidebar fijo a la izquierda */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Navbar fijo arriba */}
        <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        {/* Main con scroll solo aquí */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
          <Outlet />
        </main>

        {/* Footer fijo abajo */}
        <Footer />
      </div>
    </div>
  );

}
