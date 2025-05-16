import { useState } from "react";
import Swal from "sweetalert2";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { useApp } from "../../store/AppContext";
import { crearReactivoVigilancia } from "../../services/reactivo_vigilancia";
import { useNavigate } from "react-router-dom";

export default function FormularioReactivoVigilancia() {
	const { usuario } = useApp();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		nombre: "",
		marca: "",
		presentacion_comercial: "",
		registro_sanitario: "",
		clasificacion_riesgo: "",
		vida_util: "",
		fecha_vencimiento: "",
		lote: "",
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return; // evita doble click si ya está cargando

		setLoading(true);
		const datosConUsuario = {
			...formData,
			creado_por: usuario?.id,
		};

		try {
			await crearReactivoVigilancia(datosConUsuario);
			Swal.fire({
				icon: "success",
				title: "¡Éxito!",
				text: "Reactivo registrado correctamente",
				timer: 2000,
				showConfirmButton: false,
			});
			setFormData({
				nombre: "",
				marca: "",
				presentacion_comercial: "",
				registro_sanitario: "",
				clasificacion_riesgo: "",
				vida_util: "",
				fecha_vencimiento: "",
				lote: "",
			});
		} catch (err) {
			console.error(err);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: err.message || "No se pudo registrar el reactivo",
			});
		} finally {
			setLoading(false);
		}
	};
	const handleBack = () => {
		navigate("/dashboard");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 bg-white rounded-2xl space-y-6"
		>
			<h2 className="text-2xl font-semibold text-center text-gray-800">
				Registrar Reactivo de Vigilancia
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{Object.keys(formData).map((campo) => (
					<div key={campo} className="flex flex-col gap-1">
						<label
							htmlFor={campo}
							className="text-sm font-medium text-gray-700 capitalize"
						>
							{campo.replace(/_/g, " ")}
						</label>

						<input
							type={campo === "fecha_vencimiento" ? "date" : "text"}
							id={campo}
							name={campo}
							value={formData[campo]}
							onChange={handleChange}
							className="bg-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder={campo.replace(/_/g, " ")}
						/>
					</div>
				))}
			</div>

			<div className="flex justify-between">
				<button
					type="button"
					onClick={handleBack}
					className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
				>
					<ArrowLeft size={20} />
					Volver
				</button>

				<button
					type="submit"
					disabled={loading}
					className={`w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2`}
				>
					{loading ? (
						<>
							<Loader2 className="animate-spin" size={20} />
							Guardando...
						</>
					) : (
						<>
							<Save size={20} />
							Guardar
						</>
					)}
				</button>
			</div>
		</form>
	);
}
