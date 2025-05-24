import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Save, Loader2 } from "lucide-react";
import { useApp } from "../../../store/AppContext";
import { crearInventario, actualizarInventario } from "../../../services/inventario";
import BackPage from "../components/BackPage";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { listarSedes } from "../../../services/sedes";

export default function FormularioInventario() {
	const { usuario } = useApp();
	const location = useLocation();
	const inventarioEdit = location.state?.inventario;
	const [sedes, setSedes] = useState([]);
	const [formData, setFormData] = useState({
		codigo: "",
		nombre: "",
		dependencia: "",
		responsable: "",
		marca: "",
		modelo: "",
		serial: "",
		sede_id: "",
	});

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (inventarioEdit) {
			setFormData({
				codigo: inventarioEdit.codigo || "",
				nombre: inventarioEdit.nombre || "",
				dependencia: inventarioEdit.dependencia || "",
				responsable: inventarioEdit.responsable || "",
				marca: inventarioEdit.marca || "",
				modelo: inventarioEdit.modelo || "",
				serial: inventarioEdit.serial || "",
				sede_id: inventarioEdit.sede_id || "",
			});
		}
	}, [inventarioEdit]);

	useEffect(() => {
		const fetchSedes = async () => {
			try {
				const data = await listarSedes();
				setSedes(data);
			} catch (error) {
				console.error("Error al cargar las sedes:", error);
			}
		};

		fetchSedes();
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return;

		setLoading(true);

		const datosConUsuario = {
			...formData,
			creado_por: usuario?.id || usuario?.nombre || "desconocido",
		};

		try {
			if (inventarioEdit?.id) {
				await actualizarInventario(inventarioEdit.id, datosConUsuario);
				Swal.fire({
					icon: "success",
					title: "¡Actualizado!",
					text: "Inventario actualizado correctamente",
					timer: 2000,
					showConfirmButton: false,
				});
			} else {
				await crearInventario(datosConUsuario);
				Swal.fire({
					icon: "success",
					title: "¡Éxito!",
					text: "Inventario registrado correctamente",
					timer: 2000,
					showConfirmButton: false,
				});
				setFormData({
					codigo: "",
					nombre: "",
					dependencia: "",
					responsable: "",
					marca: "",
					modelo: "",
					serial: "",
					sede_id: "",
				});
			}
		} catch (err) {
			console.error(err);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: err.message || "No se pudo registrar el inventario",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.form
			onSubmit={handleSubmit}
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-2xl space-y-6"
		>
			<h2 className="text-2xl font-semibold text-center text-gray-800">
				{inventarioEdit ? "Editar Inventario" : "Registrar Inventario"}
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* Campos de texto */}
				{[
					{ name: "codigo", label: "Código" },
					{ name: "nombre", label: "Nombre" },
					{ name: "dependencia", label: "Dependencia" },
					{ name: "responsable", label: "Responsable" },
					{ name: "marca", label: "Marca" },
					{ name: "modelo", label: "Modelo" },
					{ name: "serial", label: "Serial" },
				].map(({ name, label }) => (
					<motion.div
						key={name}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col gap-1"
					>
						<label htmlFor={name} className="text-sm font-medium text-gray-700">
							{label}
						</label>
						<input
							type="text"
							id={name}
							name={name}
							value={formData[name]}
							onChange={handleChange}
							className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder={label}
						/>
					</motion.div>
				))}

				{/* Select sede */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="flex flex-col gap-1"
				>
					<label htmlFor="sede_id" className="text-sm font-medium text-gray-700">
						Sede
					</label>
					<select
						id="sede_id"
						name="sede_id"
						value={formData.sede_id}
						onChange={handleChange}
						className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Seleccione una sede</option>
						{sedes.map((s) => (
							<option key={s.id} value={s.id}>
								{s.nombre}
							</option>
						))}
					</select>
				</motion.div>
			</div>

			<div className="flex justify-between">
				<BackPage isEdit={!!inventarioEdit} />
				<button
					type="submit"
					disabled={loading}
					className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? (
						<>
							<Loader2 className="animate-spin" size={20} />
							Guardando...
						</>
					) : (
						<>
							<Save size={20} />
							{inventarioEdit ? "Actualizar" : "Registrar"}
						</>
					)}
				</button>
			</div>
		</motion.form>
	);
}
