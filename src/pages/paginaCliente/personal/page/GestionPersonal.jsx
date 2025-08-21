import { useEffect, useState } from "react";
import { obtenerPersonal } from "../../../../services/personal_services";
import { User, Phone, IdCard, Briefcase, Edit3, Trash2, Plus, UserPlus } from "lucide-react";

export default function GestionPersonalVista() {
	const [personal, setPersonal] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const cargarDatos = async () => {
			const data = await obtenerPersonal();
			setPersonal(data);
			setLoading(false);
		};
		cargarDatos();
	}, []);

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
				<p className="text-gray-600">Cargando personal...</p>
			</div>
		);
	}

	return (
		<div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">


			<div className="flex justify-between items-center mb-6">
				<div className="flex items-center gap-3 mb-8">
					<div className="p-3 rounded-lg bg-blue-100 text-blue-600">
						<UserPlus size={24} />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-800">Gestión de Personal</h1>
						<p className="text-gray-600">Registra nuevo personal en el sistema</p>
					</div>
				</div>
				<button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
					<Plus size={20} className="mr-2" />
					Agregar Personal
				</button>
			</div>

			{personal.length === 0 ? (
				<div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-md">
					<User size={64} className="text-gray-400 mb-4" />
					<p className="text-gray-500 text-lg">No hay personal registrado</p>
					<button className="mt-4 flex items-center text-blue-600 hover:text-blue-800">
						<Plus size={16} className="mr-1" />
						Agregar el primer empleado
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{personal.map((p) => (
						<div key={p.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
							<div className="p-6">
								<div className="flex items-center mb-4">
									<div className="bg-blue-100 p-3 rounded-full mr-4">
										<User size={24} className="text-blue-600" />
									</div>
									<div>
										<h2 className="text-xl font-semibold text-gray-800">{p.nombre}</h2>
										<p className="text-gray-600">{p.cargo}</p>
									</div>
								</div>

								<div className="space-y-3">
									<div className="flex items-center text-gray-600">
										<IdCard size={18} className="mr-3" />
										<span>{p.cedula}</span>
									</div>

									<div className="flex items-center text-gray-600">
										<Phone size={18} className="mr-3" />
										<span>{p.telefono}</span>
									</div>

									<div className="flex items-center text-gray-600">
										<Briefcase size={18} className="mr-3" />
										<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{p.cargo}</span>
									</div>
								</div>

								<div className="flex justify-end mt-6 space-x-2">
									<button className="flex items-center text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
										<Edit3 size={18} className="mr-1" />
										Editar
									</button>
									<button className="flex items-center text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors">
										<Trash2 size={18} className="mr-1" />
										Eliminar
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}