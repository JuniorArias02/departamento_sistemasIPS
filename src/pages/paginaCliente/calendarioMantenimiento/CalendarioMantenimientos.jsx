import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { getMantenimientosPorMes, eliminarEventoMantenimiento } from '../../../services/mantenimiento_services';
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RUTAS } from '../../../const/routers/routers';
import { useNavigate } from 'react-router-dom';
import BackPage from '../components/BackPage';
import Swal from "sweetalert2";
import { useApp } from '../../../store/AppContext';
import { PERMISOS } from '../../../secure/permisos/permisos';
const CalendarioMantenimientos = () => {
  const { usuario, permisos } = useApp();
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [selectEvent, setSelectEvent] = useState(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await getMantenimientosPorMes(new Date(currentYear, currentMonth, 1), usuario.id);
      const formattedEvents = res.map(item => ({
        id: item.agenda_id,
        title: item.agenda_titulo,
        start: new Date(item.fecha_inicio),
        end: new Date(item.fecha_fin),
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        extendedProps: {
          mantenimiento_id: item.mantenimiento_id,
          status: item.esta_revisado ? 'completado' : 'pendiente',
          descripcion: item.mantenimiento_descripcion,
          asignado_a: item.asignado_a,
          mantenimiento_titulo: item.mantenimiento_titulo,
          codigo: item.codigo,
          modelo: item.modelo,
          dependencia: item.dependencia,
          sede_id: item.sede_id,
          nombre_receptor: item.nombre_receptor,
          imagen: item.imagen
        }
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.error("Error al cargar mantenimientos", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentMonth, currentYear]);

  const handleDateClick = (arg) => {
    if (!permisos.includes(PERMISOS.AGENDAMIENTO_MANTENIMIENTOS.CREAR_AGENDA)) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin permisos',
        text: 'No tienes permisos para agendar mantenimientos.',
        confirmButtonColor: '#6366F1'
      });
      return;
    }
    const fechaFormateada = arg.date.toISOString().split('T')[0];
    navigate(RUTAS.USER.MANTENIMIENTO.HORAS_DEL_DIA(fechaFormateada));
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (date) => {
    const hoy = new Date();
    return date.getDate() === hoy.getDate() &&
      date.getMonth() === hoy.getMonth() &&
      date.getFullYear() === hoy.getFullYear();
  };
  const getEstadoData = (estado) => {
    if (estado === 'pendiente') return {
      label: 'Pendiente',
      colorText: 'text-yellow-600',
      colorBar: 'bg-yellow-400'
    };
    if (estado === 'completado') return {
      label: 'Completado',
      colorText: 'text-green-600',
      colorBar: 'bg-green-500'
    };
    return {
      label: 'Desconocido',
      colorText: 'text-gray-600',
      colorBar: 'bg-gray-400'
    };
  };


  const handleDelete = async () => {
    if (!selectEvent) return;

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el evento",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await eliminarEventoMantenimiento(selectEvent.extendedProps.mantenimiento_id, usuario.id);

      await Swal.fire({
        icon: "success",
        title: "Evento eliminado con éxito",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchEvents();
      setSelectEvent(null);
    } catch (err) {
      console.error("Error al eliminar", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al eliminar el evento",
      });
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Controles de navegación */}
      <BackPage />
      <motion.div
        className="flex justify-between items-center mb-6 mt-5 p-4 bg-gradient-to-r from-[#4E24CE] to-[#5D0EC0] rounded-t-xl shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <motion.button
          onClick={handlePrevMonth}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={24} />
        </motion.button>

        <motion.h2
          className="text-2xl font-bold text-white flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Calendar size={24} />
          {new Date(currentYear, currentMonth).toLocaleDateString('es', {
            month: 'long',
            year: 'numeric',
            capitalize: true
          })}
        </motion.h2>

        <motion.button
          onClick={handleNextMonth}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </motion.div>

      {/* Calendario */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={`${currentYear}-${currentMonth}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-b-xl shadow-xl "
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            events={events}
            dateClick={handleDateClick}
            headerToolbar={false}
            height="auto"
            fixedWeekCount={false}
            dayMaxEvents={3}
            eventClick={(info) => {
              setSelectEvent(info.event);
            }}

            // Estilos mejorados
            dayHeaderClassNames="bg-gray-50 text-gray-700 font-medium py-2 border-b border-gray-200"
            dayCellClassNames="hover:bg-gray-50 transition-colors border border-gray-200 relative"

            // Contenido de días
            dayCellContent={(cell) => (
              <div className={`flex justify-center items-center h-8 w-8 rounded-full mx-auto 
                ${isToday(cell.date) ? 'bg-[#5D0EC0] text-white font-bold' : 'text-gray-800'}`}>
                {cell.dayNumberText.replace('º', '')}
              </div>
            )}

            // Contenido de eventos
            eventContent={(eventInfo) => {
              const isCompleted = eventInfo.event.extendedProps.status === 'completado';
              return (
                <div className={`flex items-center p-1 rounded text-xs truncate z-60 
                  ${isCompleted ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                    : 'bg-amber-100 text-amber-800 border-l-4 border-amber-500'}`}>
                  {isCompleted ? <CheckCircle size={12} className="mr-1" />
                    : <AlertCircle size={12} className="mr-1" />}
                  <span className="truncate">{eventInfo.event.title}</span>
                </div>
              );
            }}

            // Tooltips para eventos
            eventDidMount={(info) => {
              info.el.setAttribute('title', info.event.title);
              if (info.event.extendedProps.descripcion) {
                info.el.setAttribute('data-tooltip', info.event.extendedProps.descripcion);
              }
            }}

            // Estilo para "más eventos"
            moreLinkContent={(args) => (
              <div className="text-xs text-[#5D0EC0] hover:underline cursor-pointer pl-1">
                +{args.num} más
              </div>
            )}

            validRange={{
              start: new Date(currentYear, currentMonth, 1),
              end: new Date(currentYear, currentMonth + 1, 1)
            }}
          />

          {selectEvent && (() => {
            const estadoInfo = getEstadoData(selectEvent.extendedProps.status);
            return (
              <AnimatePresence>
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-[#0000000c] backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative border border-gray-100 overflow-hidden">
                    {/* Barra lateral según estado */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${estadoInfo.colorBar}`}></div>
                    <button
                      onClick={() => setSelectEvent(null)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Título morado */}
                    <h2 className="poppins-semibold text-2xl mb-4 text-purple-600">
                      {selectEvent.title}
                    </h2>

                    <div className="space-y-3 inter-regular">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="inter-medium text-sm text-gray-700">Inicio</p>
                          <p className="text-sm text-gray-900">{selectEvent.start.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="inter-medium text-sm text-gray-700">Fin</p>
                          <p className="text-sm text-gray-900">{selectEvent.end.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Estado con color dinámico */}
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="inter-medium text-sm text-gray-700">Estado</p>
                          <p className={`text-sm font-medium ${estadoInfo.colorText}`}>
                            {estadoInfo.label}
                          </p>

                        </div>
                      </div>

                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="inter-medium text-sm text-gray-700">Asignado A:</p>
                          <p className="text-sm text-gray-900">{selectEvent.extendedProps.asignado_a}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="inter-medium text-sm text-gray-700">Descripción</p>
                          <p className="text-sm text-gray-900">{selectEvent.extendedProps.descripcion}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        {(permisos.includes(PERMISOS.MANTENIMIENTOS.ELIMINAR) ||
                          permisos.includes(PERMISOS.MANTENIMIENTOS.EDITAR)) && (
                            <div className="flex gap-3">
                              {permisos.includes(PERMISOS.MANTENIMIENTOS.ELIMINAR) && (
                                <button
                                  onClick={handleDelete}
                                  className="mr-5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 poppins-medium cursor-pointer"
                                >
                                  Eliminar Evento
                                </button>
                              )}

                              {permisos.includes(PERMISOS.MANTENIMIENTOS.EDITAR) && (
                                <button
                                  onClick={() => {
                                    const data = selectEvent.extendedProps;
                                    navigate(RUTAS.USER.MANTENIMIENTO.CREAR_MANTENIMIENTO, {
                                      state: {
                                        mantenimiento: {
                                          titulo: data.mantenimiento_titulo,
                                          codigo: data.codigo,
                                          modelo: data.modelo,
                                          dependencia: data.dependencia,
                                          sede_id: data.sede_id,
                                          nombre_receptor: data.nombre_receptor,
                                          descripcion: data.mantenimiento_descripcion,
                                          imagen: Array.isArray(data.imagen) ? data.imagen : [],
                                        }
                                      }
                                    });
                                  }}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 poppins-medium"
                                >
                                  Ingresar Mantenimiento
                                </button>
                              )}
                            </div>
                          )}

                      </div>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gray-100 opacity-30 blur-xl"></div>
                  </div>
                </div>
              </AnimatePresence>
            );
          })()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CalendarioMantenimientos;