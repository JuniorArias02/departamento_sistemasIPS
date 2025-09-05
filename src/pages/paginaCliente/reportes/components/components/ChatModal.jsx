import { useEffect, useState, useRef } from "react";
import {
	X,
	Send,
	Paperclip,
	Smile,
	Image,
	FileText,
	User,
	Clock,
	AlertCircle,
	CheckCircle2,
	Calendar,
	MapPin,
	Move
} from "lucide-react";
import { getSocket } from "../../../../../services/socket";
import { useWebSocket } from "../../../../../hook/useWebSocket";
import { crearComentario } from "../../../../../services/rf_reportes_comentarios_services";
export default function ChatModal({ reporte, usuario, onClose, comentariosIniciales }) {
	const [comentarios, setComentarios] = useState(comentariosIniciales || []);
	const [nuevoComentario, setNuevoComentario] = useState("");
	const [estaEnviando, setEstaEnviando] = useState(false);
	const [posicion, setPosicion] = useState({ x: 0, y: 0 });
	const [arrastrando, setArrastrando] = useState(false);
	const [offset, setOffset] = useState({ x: 0, y: 0 });

	const mensajesEndRef = useRef(null);
	const fileInputRef = useRef(null);
	const modalRef = useRef(null);

	useEffect(() => {
		setComentarios(comentariosIniciales);
	}, [comentariosIniciales]);

	useWebSocket({
		reporteId: reporte.id,
		onMessage: (data) => {
			setComentarios((prev) => [...prev, data]);
		},
	});

	useEffect(() => {
		scrollToBottom();

		// Centrar el modal al abrir
		if (modalRef.current) {
			const modalWidth = modalRef.current.offsetWidth;
			const modalHeight = modalRef.current.offsetHeight;
			const x = (window.innerWidth - modalWidth) / 2;
			const y = (window.innerHeight - modalHeight) / 2;
			setPosicion({ x, y });
		}
	}, [comentarios]);

	const scrollToBottom = () => {
		mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleMouseDown = (e) => {
		// Solo iniciar arrastre si se hace clic en el header o en el icono de mover
		if (e.target.closest('.modal-header') || e.target.closest('.drag-handle')) {
			setArrastrando(true);
			const rect = modalRef.current.getBoundingClientRect();
			setOffset({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top
			});
		}
	};

	const handleMouseMove = (e) => {
		if (arrastrando) {
			e.preventDefault();
			setPosicion({
				x: e.clientX - offset.x,
				y: e.clientY - offset.y
			});
		}
	};

	const handleMouseUp = () => {
		setArrastrando(false);
	};

	// Agregar event listeners para el arrastre
	useEffect(() => {
		if (arrastrando) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
			document.body.style.userSelect = 'none'; // Prevenir selección de texto durante el arrastre
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			document.body.style.userSelect = '';
		};
	}, [arrastrando, offset]);

	const handleEnviar = async () => {
		if (!nuevoComentario.trim()) return;
		setEstaEnviando(true);

		try {
			// primero guardamos en la BD
			const res = await crearComentario({
				usuario_id: usuario.id,
				reporte_id: reporte.id,
				comentario: nuevoComentario,
			});

			if (res.success) {
				const comentarioGuardado = {
					...res.comentario,
					usuario_nombre: usuario.nombre_completo,
				};

				getSocket().emit("enviar_mensaje", comentarioGuardado);
			}

			setNuevoComentario("");
		} catch (err) {
			console.error("Error guardando comentario:", err);
		} finally {
			setEstaEnviando(false);
		}
	};



	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleEnviar();
		}
	};

	const obtenerEstadoColor = (estado) => {
		switch (estado?.toLowerCase()) {
			case 'pendiente': return 'bg-amber-100 text-amber-800';
			case 'en progreso': return 'bg-blue-100 text-blue-800';
			case 'resuelto': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const obtenerIconoEstado = (estado) => {
		switch (estado?.toLowerCase()) {
			case 'pendiente': return <AlertCircle size={16} className="text-amber-500" />;
			case 'en progreso': return <Clock size={16} className="text-blue-500" />;
			case 'resuelto': return <CheckCircle2 size={16} className="text-green-500" />;
			default: return <AlertCircle size={16} className="text-gray-500" />;
		}
	};

	const formatearFecha = (fecha) => {
		return new Date(fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	};

	return (
		<div className="fixed inset-0 bg-opacity-60 z-50 p-4">
			<div
				ref={modalRef}
				className="bg-white rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden absolute"
				style={{
					left: `${posicion.x}px`,
					top: `${posicion.y}px`,
					width: 'max(400px, 40%)',
					maxWidth: '800px',
					cursor: arrastrando ? 'grabbing' : 'default'
				}}
			>
				{/* Header con información del reporte - Área de arrastre */}
				<div
					className="modal-header flex justify-between items-start p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-move"
					onMouseDown={handleMouseDown}
				>
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<Move size={18} className="text-gray-400 drag-handle" />
							<h2 className="text-xl font-bold text-gray-800">{reporte.titulo}</h2>
							<span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${obtenerEstadoColor(reporte.estado)}`}>
								{obtenerIconoEstado(reporte.estado)}
								{reporte.estado}
							</span>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
							<div className="flex items-center gap-1">
								<User size={14} />
								<span>Reportado por: {reporte.usuario_nombre}</span>
							</div>

							<div className="flex items-center gap-1">
								<Calendar size={14} />
								<span>Creado: {new Date(reporte.fecha_reporte).toLocaleDateString()}</span>
							</div>

							{reporte.ubicacion && (
								<div className="flex items-center gap-1">
									<MapPin size={14} />
									<span>{reporte.ubicacion}</span>
								</div>
							)}
						</div>
					</div>

					<button
						onClick={onClose}
						className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 ml-4"
						style={{ cursor: 'pointer' }}
					>
						<X size={24} />
					</button>
				</div>

				{/* Área de mensajes */}
				<div className="flex-1 p-4 overflow-y-auto bg-gray-50">
					{comentarios.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-gray-400">
							<div className="bg-white p-4 rounded-full shadow-sm mb-3">
								<Send size={24} />
							</div>
							<p className="text-center">No hay mensajes aún.<br />Sé el primero en comentar.</p>
						</div>
					) : (
						<div className="space-y-3">
							{comentarios.map((c, index) => {
								const esUsuarioActual = c.usuario_id === usuario.id;
								const mostrarNombre = !esUsuarioActual &&
									(index === 0 || comentarios[index - 1].usuario_id !== c.usuario_id);

								return (
									<div
										key={c.id}
										className={`flex ${esUsuarioActual ? "justify-end" : "justify-start"}`}
									>
										<div
											className={`max-w-[75%] rounded-2xl p-3 ${esUsuarioActual
												? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none"
												: "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
												}`}
										>
											{mostrarNombre && !esUsuarioActual && (
												<div className="text-xs font-semibold mb-1 flex items-center gap-1">
													<User size={12} />
													{c.usuario_nombre}
												</div>
											)}

											<div className="text-sm">{c.comentario}</div>

											<div className={`text-xs mt-1 flex justify-end ${esUsuarioActual ? "text-blue-100" : "text-gray-500"}`}>
												{formatearFecha(c.fecha_creacion || new Date())}
											</div>
										</div>
									</div>
								);
							})}
							<div ref={mensajesEndRef} />
						</div>
					)}
				</div>

				{/* Área de entrada de mensaje */}
				<div className="p-4 border-t border-gray-200 bg-white">
					<div className="flex items-end gap-2">
						<div className="flex gap-1 mb-2">
							<button
								className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
								onClick={() => fileInputRef.current?.click()}
							>
								<Paperclip size={20} />
							</button>
							<button className="p-2 text-gray-500 hover:text-yellow-500 rounded-full hover:bg-yellow-50 transition-colors">
								<Smile size={20} />
							</button>
						</div>

						<div className="flex-1 relative">
							<textarea
								className="w-full border border-gray-300 rounded-2xl py-3 px-4 pr-12 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								value={nuevoComentario}
								onChange={e => setNuevoComentario(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Escribe un mensaje..."
								rows="1"
								style={{ minHeight: '44px', maxHeight: '120px' }}
							/>

							<button
								className={`absolute right-3 bottom-3 p-1 rounded-full transition-colors ${nuevoComentario.trim()
									? "bg-blue-500 text-white hover:bg-blue-600"
									: "text-gray-400 bg-gray-100"
									}`}
								onClick={handleEnviar}
								disabled={!nuevoComentario.trim() || estaEnviando}
							>
								{estaEnviando ? (
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
								) : (
									<Send size={16} />
								)}
							</button>
						</div>
					</div>

					<input type="file" ref={fileInputRef} className="hidden" multiple />
				</div>
			</div>
		</div>
	);
}