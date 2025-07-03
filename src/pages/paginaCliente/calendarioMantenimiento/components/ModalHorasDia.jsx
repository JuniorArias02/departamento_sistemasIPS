import React, { useState, useEffect, useCallback, useRef } from "react";
import ModalCrearMantenimiento from "./ModalCrearMantenimiento";
import { Clock, ArrowLeft } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getMantenimientosPorDia, listarPersonalAsignable } from "../../../../services/mantenimiento_services";
import { useApp } from "../../../../store/AppContext";
import GuiaSeleccion from "./GuiaSeleccion"; // importa al inicio

const HorasDiaView = ({ fecha }) => {
  const { usuario } = useApp();
  // const [mostrarGuia, setMostrarGuia] = useState(true);
  const [personal, setPersonal] = useState([]);
  const [personalSeleccionado, setPersonalSeleccionado] = useState(null);

  const navigate = useNavigate();

  // Refs y States principales
  const seleccionRef = useRef(null);
  const [selectedIntervals, setSelectedIntervals] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [bloques, setBloques] = useState([]);
  const [touchTimeout, setTouchTimeout] = useState(null);

  //Generar los intervalos del día (96 bloques de 15min)
  const intervalosDelDia = Array.from({ length: 24 * 4 }, (_, i) => {
    const hora = Math.floor(i / 4);
    const minuto = (i % 4) * 15;
    return `${hora.toString().padStart(2, "0")}:${minuto.toString().padStart(2, "0")}`;
  });

  // ESTO SE USA DESPUES
  // useEffect(() => {
  //   const isMobile = window.innerWidth <= 768;
  //   const alreadyShown = localStorage.getItem('guiaMostrada');

  //   if (isMobile && !alreadyShown) {
  //     setMostrarGuia(true);
  //     localStorage.setItem('guiaMostrada', 'true');
  //   }
  // }, []);
  // Cargar mantenimientos existentes
  const cargar = async () => {
    try {
      const res = await getMantenimientosPorDia(fecha, personalSeleccionado.id);
      const convertidos = res.map(item => ({
        inicio: item.fecha_inicio.slice(11, 16),
        fin: item.fecha_fin.slice(11, 16),
        estado: item.esta_revisado ? 'completado' : 'pendiente',
      }));
      setBloques(convertidos);
    } catch (err) {
      console.error('Error al cargar bloques del día', err);
    }
  };
  useEffect(() => {
    if (!personalSeleccionado) return;
    cargar();
  }, [fecha, personalSeleccionado]);


  useEffect(() => {
    const cargarPersonal = async () => {
      try {
        const res = await listarPersonalAsignable(usuario.id);
        setPersonal(res);
      } catch (error) {
        console.error("Error al listar personal asignable", error);
      }
    };

    cargarPersonal();
  }, [usuario]);

  // Verifica si el bloque ya está ocupado
  const esBloqueOcupado = (intervalo) =>
    bloques.some(({ inicio, fin }) => intervalo >= inicio && intervalo < fin);

  // Detecta si el puntero está en la mitad izquierda de la pantalla
  const estaEnZonaIzquierda = (x) => x < window.innerWidth / 2;

  // Mouse: Inicia selección
  const handleMouseDown = (intervalo, e) => {
    if (e.button === 2 || esBloqueOcupado(intervalo)) return;
    if (!estaEnZonaIzquierda(e.clientX)) return;
    setIsDragging(true);
    setSelectedIntervals([intervalo]);
  };

  // Mouse: Continúa selección
  const handleMouseEnter = (intervalo) => {
    if (!isDragging || esBloqueOcupado(intervalo)) return;

    setSelectedIntervals((prev) => {
      const all = [...prev, intervalo].sort();
      const i1 = intervalosDelDia.indexOf(all[0]);
      const i2 = intervalosDelDia.indexOf(all[all.length - 1]);
      const rango = intervalosDelDia.slice(i1, i2 + 1);
      return rango.some(esBloqueOcupado) ? prev : rango;
    });
  };

  //  Mouse: Finaliza selección
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (selectedIntervals.length > 0) setIsModalOpen(true);
  }, [isDragging, selectedIntervals]);

  // Touch: Inicia desde zona izquierda
  useEffect(() => {
    const el = seleccionRef.current;
    const handleTouchStartReal = (e) => {
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      const intervalo = target?.dataset?.intervalo;

      if (!intervalo || esBloqueOcupado(intervalo)) return;
      if (!estaEnZonaIzquierda(touch.clientX)) return;

      e.preventDefault(); // bloquea scroll
      setIsDragging(true);
      setSelectedIntervals([intervalo]);
    };
    el?.addEventListener("touchstart", handleTouchStartReal, { passive: false });
    return () => el?.removeEventListener("touchstart", handleTouchStartReal);
  }, []);

  //  Touch: Movimiento y selección
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    if (!estaEnZonaIzquierda(touch.clientX)) return;

    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target?.dataset?.intervalo) {
      handleMouseEnter(target.dataset.intervalo);
    }
  };

  //  Touch: Finaliza selección
  const handleTouchEnd = () => {
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      setTouchTimeout(null);
    }

    if (isDragging && selectedIntervals.length > 0) {
      setIsModalOpen(true);
    }

    setIsDragging(false);
  };

  // Escuchar eventos globales
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  useEffect(() => {
    if (!isDragging) return;
    const move = (e) => setTooltipPos({ x: e.clientX, y: e.clientY });
    document.addEventListener("mousemove", move);
    return () => document.removeEventListener("mousemove", move);
  }, [isDragging]);

  useEffect(() => {
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  // deteectar dia de hoy 
  const esHoy = () => {
    const hoy = new Date();
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  };

  const yaPasoIntervalo = (intervalo) => {
    if (!esHoy()) return false;

    const [h, m] = intervalo.split(":").map(Number);
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutoActual = ahora.getMinutes();

    return h < horaActual || (h === horaActual && m < minutoActual);
  };


  const getHoraActual = () => {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, "0");
    const minutos = Math.floor(ahora.getMinutes() / 15) * 15;
    const minutosFormateados = minutos.toString().padStart(2, "0");
    return `${horas}:${minutosFormateados}`;
  };

  const esFechaPasada = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const diaSeleccionado = new Date(fecha);
    diaSeleccionado.setHours(0, 0, 0, 0);

    return diaSeleccionado < hoy;
  };


  return (
    <div className="w-full h-full p-4 md:p-6 bg-white overflow-y-auto">
      {/* ... tu cabecera ... */}
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[#5D0EC0] hover:text-[#4E24CE] transition-colors">
          <ArrowLeft size={20} />
          <span className="hidden md:inline">Volver</span>
        </button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="text-[#5D0EC0]" size={20} />
          <span> Horario del día - {fecha.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long", })}</span>
        </h2>
      </div>
      {personal.length > 0 && (
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Selecciona el personal</label>
          <select
            value={personalSeleccionado?.id || ''}
            onChange={(e) => {
              const encontrado = personal.find(p => p.id === parseInt(e.target.value));
              setPersonalSeleccionado(encontrado);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 text-sm focus:outline-none focus:ring focus:ring-violet-500"
          >
            <option value="">-- Seleccionar --</option>
            {personal.map(p => (
              <option key={p.id} value={p.id}>{p.nombre_completo}</option>
            ))}
          </select>
        </div>
      )}
      {/* Tooltip */}
      {isDragging && selectedIntervals.length > 0 && (
        <div className="fixed z-50 bg-[#5D0EC0] text-white text-xs px-3 py-1 rounded-full shadow-lg pointer-events-none"
          style={{ top: tooltipPos.y - 40, left: tooltipPos.x + 15 }}>
          Hora Inicio {selectedIntervals[0]} - Hora Fin {selectedIntervals[selectedIntervals.length - 1]}
        </div>
      )}

      {/* Timeline */}
      <div ref={seleccionRef} className="relative grid grid-cols-[auto_1fr] gap-x-4 select-none"
        onMouseLeave={() => setIsDragging(false)} style={{ touchAction: 'pan-y' }}>
        {esHoy() && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
            style={{
              top: `${(intervalosDelDia.indexOf(getHoraActual()) + 1) * 20}px`,
              width: '100%'
            }}
          >
            <div className="absolute -top-2 -left-1 bg-red-500 text-white text-xs px-1 rounded">
              Ahora
            </div>
          </div>
        )}

        {intervalosDelDia.map((intervalo) => (
          <React.Fragment key={intervalo}>
            <div className="h-5 text-right pr-2">
              {intervalo.endsWith(":00") && (
                <span className="text-[11px] font-medium text-gray-400 relative -top-1.5">
                  {intervalo}
                </span>
              )}
            </div>
            <div
              data-intervalo={intervalo}
              className={`relative h-5 cursor-pointer transition-colors duration-75 ease-in-out
    ${intervalo.endsWith(":00") ? "border-t border-gray-300" : "border-t border-dashed border-gray-200/80"}
    ${selectedIntervals.includes(intervalo)
                  ? "bg-[#5D0EC0]/30"
                  : esBloqueOcupado(intervalo)
                    ? "bg-blue-400/60"
                    : esFechaPasada()
                      ? "bg-red-100 text-red-500"
                      : yaPasoIntervalo(intervalo)
                        ? "bg-red-100 text-red-500"
                        : "hover:bg-violet-100/50"
                }`}
              onMouseDown={(e) => handleMouseDown(intervalo, e)}
              onMouseEnter={() => handleMouseEnter(intervalo)}

            />
          </React.Fragment>
        ))}

      </div>

      <AnimatePresence>
        {isModalOpen && (
          <ModalCrearMantenimiento
            fecha={fecha}
            horaInicio={selectedIntervals[0]}
            horaFin={selectedIntervals[selectedIntervals.length - 1]}
            personal={personalSeleccionado}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedIntervals([]);
              cargar();
            }}
          />
        )}
      </AnimatePresence>
      {/* {mostrarGuia && <GuiaSeleccion onClose={() => setMostrarGuia(false)} />} */}
    </div>

  );
};

export default HorasDiaView;