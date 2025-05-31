import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "../../paginaAdministrador/components/sidebar";
import { Outlet } from "react-router-dom";
import { useApp } from "../../../store/AppContext";
import { ADMINISTRADOR } from "../../../const/variable_entorno";
import { useState } from "react";

export default function Layout() {
  const { usuario } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR y SIDEBAR en la misma fila */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


        {/* Navbar */}
        <div className={`flex-1 transition-all duration-300`}>
          <Navbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          {/* CONTENIDO principal */}
          <div className="flex flex-1">
            <main className="flex-1 overflow-y-auto h-[calc(106.2vh-4rem-3rem)] transition-all duration-300 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
