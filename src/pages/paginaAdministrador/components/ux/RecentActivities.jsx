import { useState, useEffect, useRef } from "react";
import { obtenerActividadesRecientes } from "../../../../services/utils_service";
import {
  PlusCircle,
  RefreshCw,
  Activity,
  Snowflake,
  ClipboardList,
  Package2
} from "lucide-react";

export default function RecentActivities() {
  const [actividades, setActividades] = useState([]);
  const scrollContainerRef = useRef(null);

  // Función para calcular el tiempo transcurrido
  const calcularTiempoTranscurrido = (fecha) => {
    const ahora = new Date();
    const fechaActividad = new Date(fecha);
    const diff = ahora - fechaActividad;
    
    const minutos = Math.floor(diff / 60000);
    if (minutos < 60) return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    
    const dias = Math.floor(horas / 24);
    return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
  };

  useEffect(() => {
    const fetchData = () => {
      obtenerActividadesRecientes()
        .then(data => {
          if (Array.isArray(data)) {
            // Procesar datos: ordenar y formatear tiempo
            const processedData = data
              .map(item => ({
                ...item,
                // Asegurarse que cada item tenga fecha (usar fecha actual como fallback)
                formattedTime: calcularTiempoTranscurrido(item.fecha || new Date())
              }))
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .slice(0, 20); // Limitar a 20 registros
            
            setActividades(processedData);
          } else {
            setActividades([]);
          }
        })
        .catch(error => {
          console.error("Error al obtener actividades:", error);
          setActividades([]);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    
    // Actualizar tiempos cada minuto para que se refresquen
    const timeUpdateId = setInterval(() => {
      setActividades(prev => prev.map(item => ({
        ...item,
        formattedTime: calcularTiempoTranscurrido(item.fecha)
      })));
    }, 60000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timeUpdateId);
    };
  }, []);

  const getIcon = (action) => {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes('freezer')) {
      return <Snowflake className="w-4 h-4 text-blue-500" />;
    }
    if (actionLower.includes('mantenimiento')) {
      return <ClipboardList className="w-4 h-4 text-green-500" />;
    }
    if (actionLower.includes('inventario')) {
      return <Package2 className="w-4 h-4 text-orange-500" />;
    }
    if (actionLower.includes('creó') || actionLower.includes('registró')) {
      return <PlusCircle className="w-4 h-4 text-purple-500" />;
    }
    if (actionLower.includes('actualizó') || actionLower.includes('modificó')) {
      return <RefreshCw className="w-4 h-4 text-yellow-500" />;
    }
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
      
      <div 
        ref={scrollContainerRef}
        className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar"
      >
        {actividades.map((actividad) => (
          <div 
            key={`${actividad.id}-${actividad.fecha}`}
            className="flex items-start group animate-fade-in"
          >
            <div className="flex-shrink-0 mt-1 p-1 rounded-full group-hover:bg-gray-100 transition-colors">
              {getIcon(actividad.action)}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {actividad.user}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {actividad.action}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {actividad.formattedTime}
              </p>
            </div>
          </div>
        ))}
        
        {actividades.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No hay actividades recientes
          </p>
        )}
      </div>
      
      {actividades.length >= 20 && (
        <p className="text-xs text-gray-400 mt-2 text-center">
          Mostrando los 20 registros más recientes
        </p>
      )}
    </>
  );
}