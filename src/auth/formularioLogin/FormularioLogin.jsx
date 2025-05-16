import { useState } from 'react';
import { loginUsuario } from '../../services/authService';
import { useApp } from '../../store/AppContext';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FormularioLogin() {
	const navigate = useNavigate();
	const { login } = useApp();
	const [formData, setFormData] = useState({ usuario: '', contrasena: '' });
	const [verContrasena, setVerContrasena] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return;

		setLoading(true);

		try {
			const data = await loginUsuario(formData);
			login(data);
			Swal.fire({
				icon: 'success',
				title: '¡Bienvenido!',
				text: 'Has iniciado sesión correctamente',
				timer: 1500,
				showConfirmButton: false,
			}).then(() => {
				navigate('/dashboard');
			});
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: typeof error === 'string' ? error : error.message || 'Error en el inicio de sesión',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-4">
			<form
				onSubmit={handleSubmit}
				className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md space-y-6 animate-fade-in"
			>
				<h2 className="text-3xl font-bold text-center text-blue-800">Iniciar Sesión</h2>

				<div>
					<label className="block mb-1 text-gray-700 font-medium">Usuario</label>
					<input
						type="text"
						name="usuario"
						value={formData.usuario}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
						placeholder="Ingresa tu usuario"
						required
						disabled={loading}
					/>
				</div>

				<div className="relative">
					<label className="block mb-1 text-gray-700 font-medium">Contraseña</label>
					<input
						type={verContrasena ? 'text' : 'password'}
						name="contrasena"
						value={formData.contrasena}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
						placeholder="********"
						required
						disabled={loading}
					/>
					<button
						type="button"
						onClick={() => setVerContrasena(!verContrasena)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
						disabled={loading}
					>
						{verContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? 'Cargando...' : 'Entrar'}
				</button>
			</form>
		</div>
	);
}
