import { toast } from "react-hot-toast";
import { Cpu } from "lucide-react";
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
      {/* Contenedor interactivo */}
      <div
        onClick={handleActualizarPermisos}
        className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <span className="poppins-bold text-lg bg-clip-text bg-gradient-to-r from-white to-blue-100 text-transparent">
          Departamento de Sistemas
        </span>
      </div>

      {/* Tooltip inferior */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        Click para actualizar permisos
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
}