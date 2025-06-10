import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { useApp } from "../../../store/AppContext";
import BackPage from "../components/BackPage";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { crearMantenimientoFreezer, actualizarMantenimientoFreezer, listarCoordinadores } from "../../../services/mantenimiento_freezer";
import { listarSedes } from "../../../services/sedes";
export default function FormularioMantenimientoFreezer() {
	const { usuario } = useApp();
	const location = useLocation();
	const mantenimientoEdit = location.state?.mantenimiento;
	const [coordinadores, setCoordinadores] = useState([]);
	const [loadingCoordinadores, setLoadingCoordinadores] = useState(false);
	const [sedes, setSedes] = useState([]);
	const [loadingSedes, setLoadingSedes] = useState(false);
	useEffect(() => {
		if (mantenimientoEdit) {
			setFormData(mantenimientoEdit);
		}
	}, [mantenimientoEdit]);

	const handleRemoveImage = () => {
		setFormData({ ...formData, imagen: "" });
		// Limpiar el input file para permitir nueva selección
		const fileInput = document.getElementById('imagen');
		if (fileInput) fileInput.value = '';
	};
	useEffect(() => {
		const cargarCoordinadores = async () => {
			setLoadingCoordinadores(true);
			try {
				const data = await listarCoordinadores();
				setCoordinadores(data);
			} catch (error) {
				console.error("Error al cargar coordinadores:", error);
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "No se pudieron cargar los coordinadores",
				});
			} finally {
				setLoadingCoordinadores(false);
			}
		};

		cargarCoordinadores();
	}, []);
	useEffect(() => {
		const cargarSedes = async () => {
			setLoadingSedes(true);
			try {
				const data = await listarSedes();
				setSedes(data);
			} catch (error) {
				console.error("Error al cargar sedes:", error);
				Swal.fire({
					icon: "error",
					title: "Error",
					text: "No se pudieron cargar las sedes",
				});
			} finally {
				setLoadingSedes(false);
			}
		};

		cargarSedes();
	}, []);
	const [formData, setFormData] = useState({
		titulo: "",
		codigo: "",
		modelo: "",
		dependencia: "",
		sede_id: "",
		nombre_receptor: "",
		imagen: "",
		descripcion: "",
	});

	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setFormData({ ...formData, imagen: reader.result });
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return;

		setLoading(true);

		const datosConUsuario = {
			...formData,
			creado_por: usuario?.id,
		};

		try {
			if (mantenimientoEdit?.id) {
				await actualizarMantenimientoFreezer(mantenimientoEdit.id, datosConUsuario);
				Swal.fire({
					icon: "success",
					title: "¡Actualizado!",
					text: "Mantenimiento actualizado correctamente",
					timer: 2000,
					showConfirmButton: false,
				});
			} else {
				await crearMantenimientoFreezer(datosConUsuario);
				Swal.fire({
					icon: "success",
					title: "¡Éxito!",
					text: "Mantenimiento registrado correctamente",
					timer: 2000,
					showConfirmButton: false,
				});

				// Limpieza completa de todos los campos
				setFormData({
					titulo: "",
					codigo: "",
					modelo: "",
					dependencia: "",
					sede_id: "",
					nombre_receptor: "",
					imagen: "",
					descripcion: "",
				});

				// Limpiar también el input de archivo (necesario para permitir subir la misma imagen otra vez)
				const fileInput = document.getElementById('imagen');
				if (fileInput) {
					fileInput.value = '';
				}
			}
		} catch (err) {
			console.error(err);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: err.message || "No se pudo registrar el mantenimiento",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-2xl space-y-6"
		>
			<h2 className="text-2xl font-semibold text-center text-gray-800">
				{mantenimientoEdit ? "Editar" : "Registrar"} Mantenimiento de Freezer
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* Campos básicos */}
				{["titulo", "codigo", "modelo", "dependencia"].map((campo, i) => (
					<motion.div
						key={campo}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.05 }}
						className="flex flex-col gap-1"
					>
						<label
							htmlFor={campo}
							className="text-sm font-medium text-gray-700 capitalize"
						>
							{campo.replace(/_/g, " ")}
						</label>
						<input
							type="text"
							id={campo}
							name={campo}
							value={formData[campo]}
							onChange={handleChange}
							className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder={campo.replace(/_/g, " ")}
							required
						/>
					</motion.div>
				))}

				{/* Selector de sede (vacío como solicitaste) */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="flex flex-col gap-1"
				>
					<label htmlFor="sede_id" className="text-sm font-medium text-gray-700">
						Sede  <span className="text-red-500">*</span>
					</label>
					{loadingSedes ? (
						<div className="bg-gray-100 rounded-lg px-4 py-2 animate-pulse">Cargando sedes...</div>
					) : (
						<select
							id="sede_id"
							name="sede_id"
							value={formData.sede_id}
							onChange={handleChange}
							className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
							disabled={loadingSedes}
						>
							<option value="">Seleccionar sede</option>
							{sedes.map((sede) => (
								<option key={sede.id} value={sede.id}>
									{sede.nombre}
								</option>
							))}
						</select>
					)}
				</motion.div>

				{/* Selector de receptor (vacío como solicitaste) */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.25 }}
					className="flex flex-col gap-1"
				>
					<label htmlFor="nombre_receptor" className="text-sm font-medium text-gray-700">
						Receptor  <span className="text-red-500">*</span>
					</label>
					{loadingCoordinadores ? (
						<div className="bg-gray-100 rounded-lg px-4 py-2 animate-pulse">Cargando coordinadores...</div>
					) : (
						<select
							id="nombre_receptor"
							name="nombre_receptor"
							value={formData.nombre_receptor}
							onChange={handleChange}
							className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
							disabled={loadingCoordinadores}
						>
							<option value="">Seleccionar receptor</option>
							{coordinadores.map((coordinador) => (
								<option key={coordinador.id} value={coordinador.id}>
									{coordinador.nombre_completo}
								</option>
							))}
						</select>
					)}
				</motion.div>

				{/* Campo de imagen */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="flex flex-col gap-1 sm:col-span-2"
				>
					<label htmlFor="imagen" className="text-sm font-medium text-gray-700">
						Imagen <span className="text-red-500">*</span>
					</label>
					<input
						type="file"
						id="imagen"
						name="imagen"
						accept="image/*"
						onChange={handleImageChange}
						className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>

					{formData.imagen && (
						<motion.div
							className="mt-2 relative"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.2 }}
						>
							<img
								src={formData.imagen}
								alt="Vista previa"
								className="h-20 object-cover rounded-lg border border-gray-200"
							/>
							<button
								type="button"
								onClick={handleRemoveImage}
								className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-md"
								title="Eliminar imagen"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</button>
						</motion.div>
					)}
				</motion.div>

				{/* Campo de descripción (textarea) */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.35 }}
					className="flex flex-col gap-1 sm:col-span-2"
				>
					<label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
						Descripción
					</label>
					<textarea
						id="descripcion"
						name="descripcion"
						value={formData.descripcion}
						onChange={handleChange}
						rows={4}
						className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Ingrese una descripción del mantenimiento"
					/>
				</motion.div>
			</div>

			<div className="flex justify-between">
				<BackPage isEdit={mantenimientoEdit} />
				<button
					type="submit"
					disabled={loading}
					className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					{loading ? (
						<>
							<Loader2 className="animate-spin" size={20} />
							Guardando...
						</>
					) : (
						<>
							<Save size={20} />
							{mantenimientoEdit ? "Actualizar" : "Registrar"}
						</>
					)}
				</button>
			</div>
		</form>
	);
}