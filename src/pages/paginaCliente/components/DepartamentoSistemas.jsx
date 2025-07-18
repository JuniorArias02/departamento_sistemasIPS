import { toast } from "react-hot-toast";
import { Cpu, RefreshCw } from "lucide-react";
import { useApp } from "../../../store/AppContext";
import { useState } from "react";

export default function DepartamentoSistemas() {
  const { actualizarPermisos } = useApp();
  const [actualizando, setActualizando] = useState(false);

  const handleActualizarPermisos = async () => {
    setActualizando(true);
    try {
      await actualizarPermisos();
      toast.success("Permisos sincronizados", {
        position: "top-right",
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #334155",
        },
      });
    } catch (error) {
      toast.error("Error al sincronizar", {
        position: "top-right",
        style: {
          background: "#7f1d1d",
          color: "#fff",
          border: "1px solid #b91c1c",
        },
      });
    } finally {
      setActualizando(false);
    }
  };

  return (
    <div className="relative group">
      {/* Contenedor más compacto */}
      <div
        onClick={handleActualizarPermisos}
        className="flex items-center gap-1.5 sm:gap-2 cursor-pointer px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Actualizar permisos"
      >
        <div className="relative bg-white/10 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm">
          <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          {actualizando && (
            <RefreshCw className="absolute inset-0 m-auto w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" />
          )}
        </div>

        {/* Texto responsive */}
        <span className="hidden xs:inline poppins-bold text-sm sm:text-lg bg-clip-text bg-gradient-to-r from-white to-blue-100 text-transparent">
          Depto. Sistemas
        </span>

        {/* Solo icono en móvil muy pequeño */}
        <span className="xs:hidden poppins-bold text-xs bg-clip-text bg-gradient-to-r from-white to-blue-100 text-transparent">
          Sistemas
        </span>
      </div>

      {/* Tooltip optimizado */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[0.65rem] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        Actualizar permisos
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
}