import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Building,
	X
} from "lucide-react";

export const ProveedorModal = ({ proveedor, onClose, onSave }) => {
	const [formData, setFormData] = useState({
		proveedor_id: proveedor?.id || null,
		nombre: proveedor?.nombre || "",
		nit: proveedor?.nit || "",
		telefono: proveedor?.telefono || "",
		correo: proveedor?.correo || "",
		direccion: proveedor?.direccion || ""
	});
	
	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(formData);
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className="bg-white rounded-2xl shadow-xl w-full max-w-md"
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative">
					<button
						onClick={onClose}
						className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
					>
						<X size={20} className="text-white" />
					</button>

					<div className="flex items-center gap-3">
						<div className="p-2 bg-white/10 rounded-lg">
							<Building size={24} className="text-white" />
						</div>
						<div>
							<h2 className="text-xl font-semibold text-white">
								{proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
							</h2>
							<p className="text-blue-100 text-sm mt-1">
								{proveedor ? 'Actualiza la información' : 'Agrega un nuevo proveedor'}
							</p>
						</div>
					</div>
				</div>

				{/* Formulario */}
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Nombre de la empresa *
						</label>
						<input
							type="text"
							name="nombre"
							value={formData.nombre}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Ej: TecnoSuministros S.A.S."
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							NIT *
						</label>
						<input
							type="text"
							name="nit"
							value={formData.nit}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Ej: 900123456-7"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Teléfono *
						</label>
						<input
							type="tel"
							name="telefono"
							value={formData.telefono}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Ej: +57 1 2345678"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Correo electrónico *
						</label>
						<input
							type="email"
							name="correo"
							value={formData.correo}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Ej: contacto@empresa.com"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Dirección *
						</label>
						<textarea
							name="direccion"
							value={formData.direccion}
							onChange={handleChange}
							required
							rows={3}
							className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Ej: Carrera 45 # 26-85, Bogotá"
						/>
					</div>

					<div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
						>
							{proveedor ? 'Actualizar' : 'Crear'} Proveedor
						</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};