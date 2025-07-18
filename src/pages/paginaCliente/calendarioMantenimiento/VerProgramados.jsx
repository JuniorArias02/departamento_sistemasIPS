
import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { getMantenimientosPorMes } from '../../../services/mantenimiento_services';
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RUTAS } from '../../../const/routers/routers';
import { useNavigate } from 'react-router-dom';
import BackPage from '../components/BackPage';


const VerProgramados = () => {
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
			const res = await getMantenimientosPorMes(new Date(currentYear, currentMonth, 1));
			const formattedEvents = res.map(item => ({
				id: item.id,
				title: item.titulo,
				start: new Date(item.fecha_inicio),
				end: new Date(item.fecha_fin),
				backgroundColor: 'transparent',
				borderColor: 'transparent',
				extendedProps: {
					status: item.esta_revisado ? 'completado' : 'pendiente',
					descripcion: item.descripcion,
					asignado_a: item.asignado_a
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

	return (
		<div className="p-4 max-w-6xl mx-auto">
			<BackPage />
			{/* Encabezado con mes y año */}
			<motion.div className="flex justify-between items-center mb-6 mt-5 p-4 bg-gradient-to-r from-[#4E24CE] to-[#5D0EC0] rounded-t-xl shadow-lg"
				initial={{ y: -50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, type: 'spring' }}
			>
				<motion.button onClick={handlePrevMonth}
					className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<ChevronLeft size={24} />
				</motion.button>

				<motion.h2 className="text-2xl font-bold text-white flex items-center gap-2">
					<Calendar size={24} />
					{new Date(currentYear, currentMonth).toLocaleDateString('es', { month: 'long', year: 'numeric' })}
				</motion.h2>

				<motion.button onClick={handleNextMonth}
					className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<ChevronRight size={24} />
				</motion.button>
			</motion.div>

			{/* Calendario */}
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
					headerToolbar={false}
					height="auto"
					fixedWeekCount={false}
					dayMaxEvents={3}
					eventClick={(info) => setSelectEvent(info.event)}
					dayHeaderClassNames="bg-gray-50 text-gray-700 font-medium py-2 border-b border-gray-200"
					dayCellClassNames="hover:bg-gray-50 transition-colors border border-gray-200 relative"
					dayCellContent={(cell) => (
						<div className={`flex justify-center items-center h-8 w-8 rounded-full mx-auto 
							${isToday(cell.date) ? 'bg-[#5D0EC0] text-white font-bold' : 'text-gray-800'}`}>
							{cell.dayNumberText.replace('º', '')}
						</div>
					)}
					eventContent={(eventInfo) => {
						const isCompleted = eventInfo.event.extendedProps.status === 'completado';
						return (
							<div className={`flex items-center p-1 rounded text-xs truncate 
								${isCompleted ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
									: 'bg-amber-100 text-amber-800 border-l-4 border-amber-500'}`}>
								{isCompleted ? <CheckCircle size={12} className="mr-1" />
									: <AlertCircle size={12} className="mr-1" />}
								<span className="truncate">{eventInfo.event.title}</span>
							</div>
						);
					}}
					eventDidMount={(info) => {
						info.el.setAttribute('title', info.event.title);
						if (info.event.extendedProps.descripcion) {
							info.el.setAttribute('data-tooltip', info.event.extendedProps.descripcion);
						}
					}}
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

				{/* Modal de detalles del evento */}
				{selectEvent && (() => {
					const estadoInfo = getEstadoData(selectEvent.extendedProps.status);
					return (
						<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000000c] backdrop-blur-sm">
							<div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative border border-gray-100 overflow-hidden">
								<div className={`absolute top-0 left-0 w-1 h-full ${estadoInfo.colorBar}`}></div>
								<button onClick={() => setSelectEvent(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
								<h2 className="poppins-semibold text-2xl mb-4 text-purple-600">{selectEvent.title}</h2>
								<div className="space-y-3 inter-regular">
									<p><strong>Inicio:</strong> {selectEvent.start.toLocaleString()}</p>
									<p><strong>Fin:</strong> {selectEvent.end.toLocaleString()}</p>
									<p><strong>Estado:</strong> <span className={estadoInfo.colorText}>{estadoInfo.label}</span></p>
									<p><strong>Asignado A:</strong> {selectEvent.extendedProps.asignado_a}</p>
									<p><strong>Descripción:</strong> {selectEvent.extendedProps.descripcion}</p>
								</div>
							</div>
						</div>
					);
				})()}
			</motion.div>
		</div>
	);
};

export default VerProgramados;
