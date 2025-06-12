import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import BackPage from "../components/BackPage";
import { listarMantenimientosFreezer } from "../../../services/mantenimiento_freezer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../../../store/AppContext";
import {
	Eye,
	Edit,
	Calendar,
	User,
	Warehouse,
	CheckCircle,
	Clock
} from 'lucide-react';


export default function VistaDatosMantenimientoFreezer() {
	const navigate = useNavigate();
	const { usuario } = useApp();
	const [mantenimientos, setMantenimientos] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchData = async () => {
		try {
			setLoading(true);
			const response = await listarMantenimientosFreezer(usuario.id);
			setMantenimientos(response.data);
		} catch (error) {
			console.error("Error cargando mantenimientos", error);
			Swal.fire("Error", error.message, "error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [usuario.id]);

	const handleVerDetalle = (id) => {
		navigate(`/dashboard/mantenimiento-freezer/detalle/${id}`);
	};

	const handleEditar = (id) => {
		navigate(`/dashboard/mantenimiento-freezer/editar/${id}`);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-6">
			<BackPage />

			<div className="text-center">
				<h1 className="text-3xl font-bold text-gray-800">
					IPS CLINICAL HOUSE
				</h1>
				<p className="text-gray-600 mt-2">
					Listado de todos los mantenimientos registrados
				</p>
			</div>

			{mantenimientos.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">No hay mantenimientos registrados</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{mantenimientos.map((item) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
						>
							<div className={`p-5 ${item.esta_revisado ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'}`}>
								<div className="flex justify-between items-start">
									<h3 className="text-xl font-semibold text-gray-800 truncate">{item.titulo}</h3>
									<span className={`px-2 py-1 text-xs rounded-full ${item.esta_revisado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
										{item.esta_revisado ? 'Revisado' : 'Pendiente'}
									</span>
								</div>
								<p className="text-gray-600 mt-2 line-clamp-2">{item.descripcion}</p>
								<div className="mt-4 space-y-2">
									<div className="flex items-center text-sm text-gray-500">
										<Warehouse className="mr-2" />
										<span>{item.nombre_sede || 'Sin sede'}</span>
									</div>
									<div className="flex items-center text-sm text-gray-500">
										<User className="mr-2" />
										<span>{item.nombre_receptor_completo || 'Sin receptor'}</span>
									</div>
									<div className="flex items-center text-sm text-gray-500">
										<Calendar className="mr-2" />
										<span>{new Date(item.fecha_creacion).toLocaleDateString()}</span>
									</div>
								</div>
								<div className="mt-6 flex justify-between">
									<button
										onClick={() => handleVerDetalle(item.id)}
										className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors flex items-center cursor-pointer"
									>
										<Eye className="mr-1" /> Ver
									</button>
									<button
										onClick={() => handleEditar(item.id)}
										className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors flex items-center cursor-pointer"
									>
										<Edit className="mr-1" /> Editar
									</button>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			)}
		</div>
	);
}