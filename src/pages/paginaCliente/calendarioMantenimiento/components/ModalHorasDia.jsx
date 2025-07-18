import React, { useState, useEffect, useCallback, useRef } from "react";
import ModalCrearMantenimiento from "./ModalCrearMantenimiento";
import { Clock, ArrowLeft } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getMantenimientosPorDia, listarPersonalAsignable } from "../../../../services/mantenimiento_services";
import { useApp } from "../../../../store/AppContext";

const Intervalo = React.memo(({ intervalo, ocupado, seleccionado, pasado, onMouseDown, onMouseEnter }) => {
  let clase = "relative h-5 cursor-pointer transition-colors duration-75 ease-in-out ";
  clase += intervalo.endsWith(":00")
    ? "border-t border-gray-300 "
    : "border-t border-dashed border-gray-200/80 ";
  if (seleccionado) clase += "bg-[#5D0EC0]/30 ";
  else if (ocupado) clase += "bg-blue-400/60 ";
  else if (pasado) clase += "bg-red-100 text-red-500 ";
  else clase += "hover:bg-violet-100/50 ";

  return (
    <>
      <div className="h-5 text-right pr-2">
        {intervalo.endsWith(":00") && (
          <span className="text-[11px] font-medium text-gray-400 relative -top-1.5">
            {intervalo}
          </span>
        )}
      </div>
      <div
        data-intervalo={intervalo}
        className={clase}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
      />
    </>
  );
});

const HorasDiaView = ({ fecha }) => {
  const { usuario } = useApp();
  const [personal, setPersonal] = useState([]);
  const [personalSeleccionado, setPersonalSeleccionado] = useState(null);
  const navigate = useNavigate();
  const seleccionRef = useRef(null);
  const [selectedIntervals, setSelectedIntervals] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [bloques, setBloques] = useState([]);

  const intervalosDelDia = Array.from({ length: 96 }, (_, i) => {
    const hora = String(Math.floor(i / 4)).padStart(2, "0");
    const minuto = String((i % 4) * 15).padStart(2, "0");
    return `${hora}:${minuto}`;
  });

  const cargar = useCallback(async () => {
    setBloques([]);
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
  }, [fecha, personalSeleccionado]);

  useEffect(() => {
    if (personalSeleccionado) cargar();
  }, [fecha, personalSeleccionado, cargar]);

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

  const esBloqueOcupado = useCallback(
    (intervalo) => bloques.some(({ inicio, fin }) => intervalo >= inicio && intervalo < fin),
    [bloques]
  );

  const estaEnZonaIzquierda = useCallback((x) => x < window.innerWidth / 2, []);

  const handleMouseDown = useCallback((intervalo, e) => {
    if (!personalSeleccionado || e.button === 2 || esBloqueOcupado(intervalo) || !estaEnZonaIzquierda(e.clientX)) return;
    setIsDragging(true);
    setSelectedIntervals([intervalo]);
  }, [esBloqueOcupado, estaEnZonaIzquierda, personalSeleccionado]);

  const handleMouseEnter = useCallback((intervalo) => {
    if (!isDragging || esBloqueOcupado(intervalo)) return;
    const inicio = selectedIntervals[0];
    const i1 = intervalosDelDia.indexOf(inicio);
    const i2 = intervalosDelDia.indexOf(intervalo);
    const [start, end] = i1 < i2 ? [i1, i2] : [i2, i1];
    const rango = intervalosDelDia.slice(start, end + 1);
    if (rango.some(esBloqueOcupado)) return;
    setSelectedIntervals(rango);
  }, [isDragging, esBloqueOcupado, selectedIntervals]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    if (selectedIntervals.length > 0) setIsModalOpen(true);
  }, [isDragging, selectedIntervals]);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  useEffect(() => {
    if (!isDragging) return;
    let ticking = false;
    const move = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setTooltipPos({ x: e.clientX, y: e.clientY });
          ticking = false;
        });
        ticking = true;
      }
    };
    document.addEventListener("mousemove", move);
    return () => document.removeEventListener("mousemove", move);
  }, [isDragging]);

  const esHoy = useCallback(() => {
    const hoy = new Date();
    return fecha.toDateString() === hoy.toDateString();
  }, [fecha]);

  const yaPasoIntervalo = useCallback((intervalo) => {
    if (!esHoy()) return false;
    const [h, m] = intervalo.split(":").map(Number);
    const ahora = new Date();
    return h < ahora.getHours() || (h === ahora.getHours() && m < ahora.getMinutes());
  }, [esHoy]);

  const getHoraActual = () => {
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, "0");
    const minutos = Math.floor(ahora.getMinutes() / 15) * 15;
    const minutosFormateados = minutos.toString().padStart(2, "0");
    return `${horas}:${minutosFormateados}`;
  };

  return (
    <div className="w-full h-full p-4 md:p-6 bg-white overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-[#5D0EC0] hover:text-[#4E24CE] transition-colors">
          <ArrowLeft size={20} />
          <span className="hidden md:inline">Volver</span>
        </button>
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="text-[#5D0EC0]" size={20} />
          <span> Horario del día - {fecha.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" })}</span>
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

      {isDragging && selectedIntervals.length > 0 && (
        <div
          className="fixed z-50 bg-[#5D0EC0] text-white text-xs px-3 py-1 rounded-full shadow-lg pointer-events-none"
          style={{ top: tooltipPos.y - 40, left: tooltipPos.x + 15 }}>
          Hora Inicio {selectedIntervals[0]} - Hora Fin {selectedIntervals[selectedIntervals.length - 1]}
        </div>
      )}

      <div
        ref={seleccionRef}
        className="relative grid grid-cols-[auto_1fr] gap-x-4 select-none"
        onMouseLeave={() => setIsDragging(false)}
        style={{ touchAction: 'pan-y' }}
      >
        {esHoy() && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-red-500 z-10"
            style={{
              top: `${(intervalosDelDia.indexOf(getHoraActual()) + 1) * 20}px`,
              width: '100%'
            }}
          >
            <div className="absolute -top-2 -left-1 bg-red-500 text-white text-xs px-1 rounded">Ahora</div>
          </div>
        )}

        {intervalosDelDia.map((intervalo) => (
          <Intervalo
            key={intervalo}
            intervalo={intervalo}
            ocupado={esBloqueOcupado(intervalo)}
            seleccionado={selectedIntervals.includes(intervalo)}
            pasado={yaPasoIntervalo(intervalo)}
            onMouseDown={(e) => handleMouseDown(intervalo, e)}
            onMouseEnter={() => handleMouseEnter(intervalo)}
          />
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
    </div>
  );
};

export default HorasDiaView;
