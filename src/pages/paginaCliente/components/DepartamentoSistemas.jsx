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
      {/* Contenedor más prominente */}
      <div
        onClick={handleActualizarPermisos}
        className="flex items-center gap-3 cursor-pointer px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Actualizar permisos"
      >
        <div className="relative bg-white/10 p-3 rounded-lg backdrop-blur-sm">
          {actualizando ? (
            <RefreshCw className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Cpu className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Texto completo en todas las pantallas */}
        <span className="poppins-bold text-xl bg-clip-text bg-gradient-to-r from-white to-blue-100 text-transparent">
          
        </span>
      </div>

      {/* Tooltip más grande */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
        Click para actualizar permisos
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1.5 w-3 h-3 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
}