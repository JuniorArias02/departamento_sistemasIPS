import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { getMantenimientosPorMes } from '../../../services/mantenimiento_services';
import ModalHorasDia from './components/ModalHorasDia';
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DraggableButton } from './components/DraggableButton';

const CalendarioMantenimientos = () => {
	const calendarRef = useRef(null);
	const [events, setEvents] = useState([]);
	const [selectedDate, setSelectedDate] = useState(null);
	const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
	const [isLoading, setIsLoading] = useState(true);

	// Cargar mantenimientos
	const fetchEvents = async () => {
		setIsLoading(true);
		try {
			const res = await getMantenimientosPorMes(new Date(currentYear, currentMonth, 1));
			const formattedEvents = res.map(item => ({
				id: item.id,
				title: item.titulo,
				start: new Date(item.fecha_agendada),
				backgroundColor: item.esta_revisado ? '#10B981' : '#F59E0B',
				borderColor: 'transparent',
				extendedProps: {
					status: item.esta_revisado ? 'completado' : 'pendiente'
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
		setSelectedDate(arg.date);
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

	const monthVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.3 }
		},
		exit: { opacity: 0, y: -20 }
	};

	return (
		<div className="p-4 max-w-6xl mx-auto">
			{/* Controles de navegación */}
			<motion.div
				className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-[#4E24CE] to-[#5D0EC0] rounded-t-xl shadow-lg"
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
					variants={monthVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					className="bg-white rounded-b-xl shadow-xl overflow-hidden"
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
						dayHeaderClassNames="bg-gray-50 text-gray-700 font-medium py-2"
						dayCellClassNames="hover:bg-gray-400 transition-colors border border-gray-300"
						dayCellContent={(cell) => {
							const hoy = new Date();
							const cellDate = new Date(cell.date);
							const esHoy =
								cellDate.getDate() === hoy.getDate() &&
								cellDate.getMonth() === hoy.getMonth() &&
								cellDate.getFullYear() === hoy.getFullYear();

							return (
								<motion.div
									className={`flex justify-center items-center h-full w-full rounded-full ${esHoy ? 'bg-[#5e0ec0] text-white font-bold' : 'text-gray-800'
										}`}
								>
									<span>{cell.dayNumberText.replace('º', '')}</span>
								</motion.div>
							);
						}}

						eventContent={(eventInfo) => {
							const esCompletado = eventInfo.event.extendedProps.status === 'completado';
							const icon = esCompletado ? <CheckCircle size={14} /> : <AlertCircle size={14} />;
							const bg = esCompletado ? 'bg-green-500/90' : 'bg-yellow-400/90';
							const text = esCompletado ? 'text-white' : 'text-black';

							return (
								<motion.div
									className={`flex items-center gap-2 px-2 py-1 rounded-md shadow-sm ${bg} ${text}`}
									whileHover={{ scale: 1.05 }}
									initial={{ opacity: 0, y: -2 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -2 }}
								>
									{icon}
									<span className="truncate">{eventInfo.event.title}</span>
								</motion.div>
							);
						}}


						validRange={{
							start: new Date(currentYear, currentMonth, 1),
							end: new Date(currentYear, currentMonth + 1, 1)
						}}
						dayCellDidMount={(info) => {
							const hoy = new Date();
							const cellDate = new Date(info.date);

							if (
								cellDate.getDate() === hoy.getDate() &&
								cellDate.getMonth() === hoy.getMonth() &&
								cellDate.getFullYear() === hoy.getFullYear()
							) {
								info.el.style.backgroundColor = '#5e0ec0'; // Morado épico
								info.el.style.color = 'white';
								// info.el.style.borderRadius = '999px';
							}
						}}
					/>
				</motion.div>
			</AnimatePresence>

			{/* Modal para seleccionar hora */}
			<AnimatePresence>
				{selectedDate && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
					>
						<motion.div
							initial={{ scale: 0.95, y: 20, opacity: 0 }}
							animate={{ scale: 1, y: 0, opacity: 1 }}
							exit={{ scale: 0.95, y: 20, opacity: 0 }}
							transition={{
								type: 'spring',
								damping: 20,
								stiffness: 300
							}}
							className="w-full max-w-md mx-4"
						>
							<ModalHorasDia
								fecha={selectedDate}
								onClose={() => setSelectedDate(null)}
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Botón flotante para añadir evento */}
			<DraggableButton setSelectedDate={setSelectedDate} />
		</div>
	);
};

export default CalendarioMantenimientos;