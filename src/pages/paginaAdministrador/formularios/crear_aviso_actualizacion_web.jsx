import { useApp } from "../../../store/AppContext";
import { PERMISOS } from "../../../secure/permisos/permisos";
import { useState } from "react";
import { Calendar, Clock, AlertCircle, Loader2, PlusCircle, Zap, AlertTriangle, Check } from "lucide-react";
import { crearAvisoActualizacionWeb } from "../../../services/administrador_web_services";
import Swal from "sweetalert2";


export default function CrearAvisoActualizacionWeb() {
	const { usuario, permisos } = useApp();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Estado inicial del formulario
	const [formData, setFormData] = useState({
		titulo: '',
		descripcion: '',
		mostrar_desde: '',
		mostrar_hasta: '',
		fecha_actualizacion: '',
		duracion_minutos: 30,
		estado: 'pendiente',
		id_usuario: usuario.id
	});

	// Manejar cambios en los inputs
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	// Manejar envío del formulario
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const datosEnvio = {
				...formData,
				usuario_id: usuario.id
			};

			await crearAvisoActualizacionWeb(datosEnvio);

			// Mostrar alerta de éxito con SweetAlert2
			await Swal.fire({
				title: '¡Éxito!',
				text: 'El aviso se ha creado correctamente',
				icon: 'success',
				confirmButtonColor: '#2563eb',
				confirmButtonText: 'Aceptar'
			});

			// Resetear formulario después de éxito
			setFormData({
				titulo: '',
				descripcion: '',
				mostrar_desde: '',
				mostrar_hasta: '',
				fecha_actualizacion: '',
				duracion_minutos: 30,
				estado: 'pendiente'
			});
		} catch (err) {
			// Mostrar alerta de error con SweetAlert2
			await Swal.fire({
				title: 'Error',
				text: err.message || 'Error al crear el aviso',
				icon: 'error',
				confirmButtonColor: '#dc2626',
				confirmButtonText: 'Entendido'
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Verificar permisos
	const puedeCrear = permisos.includes(PERMISOS.ADMINISTRADOR_WEB.CREAR_AVISO_ACTUALIZACION);

	if (!puedeCrear) {
		return (
			<div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
				<div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg text-red-600">
					<AlertCircle className="w-5 h-5" />
					<p>No tienes permisos para crear avisos de actualización web.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-white to-[#f9f0ff] rounded-2xl shadow-2xl shadow-purple-100 mt-8 border border-purple-50">
			{/* Header con efecto neumorfismo */}
			<div className="mb-8 p-6 bg-white rounded-2xl shadow-[5px_5px_15px_rgba(0,0,0,0.05),-5px_-5px_15px_rgba(255,255,255,0.8)]">
				<h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-600 mb-2 flex items-center gap-3">
					<Zap className="w-8 h-8 text-purple-600" />
					Nuevo Aviso de Actualización
				</h1>
				<p className="text-purple-400 font-medium">Completa los detalles de la próxima actualización</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Sección 1: Información básica */}
				<div className="p-6 bg-white rounded-2xl shadow-[5px_5px_15px_rgba(0,0,0,0.03)] border border-purple-50">
					<h2 className="text-xl font-semibold text-purple-800 mb-6 flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
						Información básica
					</h2>

					<div className="grid grid-cols-1 gap-6">
						{/* Campo Título con efecto focus moderno */}
						<div className="relative">
							<label htmlFor="titulo" className="block text-sm font-semibold text-purple-700 mb-1 ml-1">
								Título del aviso *
							</label>
							<input
								type="text"
								id="titulo"
								name="titulo"
								value={formData.titulo}
								onChange={handleChange}
								required
								className="w-full px-5 py-3 border-0 bg-purple-50/50 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:bg-white focus:shadow-purple-500/10 transition-all duration-300 placeholder-purple-300 text-purple-800 font-medium"
								placeholder="¿Qué se va a actualizar?"
							/>
							<div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-100 scale-x-0 origin-left transition-transform duration-300 peer-focus:scale-x-100"></div>
						</div>

						{/* Campo Descripción con contador */}
						<div>
							<div className="flex justify-between items-center mb-1">
								<label htmlFor="descripcion" className="block text-sm font-semibold text-purple-700 ml-1">
									Descripción *
								</label>
								<span className="text-xs text-purple-400">{formData.descripcion.length}/500</span>
							</div>
							<textarea
								id="descripcion"
								name="descripcion"
								value={formData.descripcion}
								onChange={handleChange}
								required
								maxLength={500}
								rows={4}
								className="w-full px-5 py-3 border-0 bg-purple-50/50 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:bg-white focus:shadow-purple-500/10 transition-all duration-300 placeholder-purple-300 text-purple-800 font-medium"
								placeholder="Detalla los cambios, mejoras y afectaciones..."
							/>
						</div>
					</div>
				</div>

				{/* Sección 2: Configuración de tiempos */}
				<div className="p-6 bg-white rounded-2xl shadow-[5px_5px_15px_rgba(0,0,0,0.03)] border border-purple-50">
					<h2 className="text-xl font-semibold text-purple-800 mb-6 flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
						Configuración de tiempos
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Date Pickers modernos */}
						{['mostrar_desde', 'mostrar_hasta', 'fecha_actualizacion'].map((field) => (
							<div key={field} className="relative group">
								<label htmlFor={field} className="block text-sm font-semibold text-purple-700 mb-1 ml-1">
									{field === 'mostrar_desde' ? 'Mostrar desde' :
										field === 'mostrar_hasta' ? 'Mostrar hasta' : 'Fecha actualización'} *
								</label>
								<div className="relative">
									<input
										type="date"
										id={field}
										name={field}
										value={formData[field]}
										onChange={handleChange}
										required
										className="w-full px-5 py-3 pr-10 border-0 bg-purple-50/50 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:bg-white focus:shadow-purple-500/10 transition-all duration-300 appearance-none text-purple-800 font-medium"
									/>
									<Calendar className="absolute right-3 top-3.5 w-5 h-5 text-purple-400 pointer-events-none" />
								</div>
							</div>
						))}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
						{/* Slider para duración */}
						<div>
							<label htmlFor="duracion_minutos" className="block text-sm font-semibold text-purple-700 mb-3 ml-1">
								<span className="flex items-center gap-2">
									<Clock className="w-4 h-4" />
									Duración estimada: <span className="text-purple-600">{formData.duracion_minutos} minutos</span>
								</span>
							</label>
							<input
								type="range"
								id="duracion_minutos"
								name="duracion_minutos"
								min="5"
								max="240"
								step="5"
								value={formData.duracion_minutos}
								onChange={handleChange}
								className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
							/>
							<div className="flex justify-between text-xs text-purple-400 mt-1">
								<span>5 min</span>
								<span>4 hrs</span>
							</div>
						</div>

						{/* Selector de estado con estilo moderno */}
						<div>
							<label htmlFor="estado" className="block text-sm font-semibold text-purple-700 mb-1 ml-1">
								Estado inicial *
							</label>
							<div className="relative">
								<select
									id="estado"
									name="estado"
									value={formData.estado}
									onChange={handleChange}
									required
									className="w-full px-5 py-3 border-0 bg-purple-50/50 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:bg-white focus:shadow-purple-500/10 transition-all duration-300 appearance-none text-purple-800 font-medium"
								>
									<option value="pendiente">🟡 Pendiente</option>
									<option value="en progreso">🔵 En progreso</option>
									<option value="finalizado">🟢 Finalizado</option>
								</select>
								<div className="absolute right-3 top-3.5 pointer-events-none">
									<svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
									</svg>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Botón de envío con microinteracciones */}
				<div className="flex justify-end pt-2">
					<button
						type="submit"
						disabled={isSubmitting}
						className="relative overflow-hidden group px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
					>
						<span className="relative z-10 flex items-center gap-2">
							{isSubmitting ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									Creando...
								</>
							) : (
								<>
									<PlusCircle className="w-5 h-5" />
									Crear Aviso
								</>
							)}
						</span>
						<span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-fuchsia-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
					</button>
				</div>
			</form>
		</div>
	);
}