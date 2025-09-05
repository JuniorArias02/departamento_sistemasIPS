import { useState, useEffect } from "react";
import {
	Plus,
	Search,
	Filter,
	Edit,
	Trash2,
	Eye,
	Building,
	Phone,
	Mail,
	MapPin,
	FileText,
	Download,
	Upload,
	Users,
	ChevronLeft,
	ChevronRight,
	X,
	Handshake
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { obtenerProveedores, crearProveedor, editarProveedor } from "../../../../services/cp_proveedor_services";
import { ProveedorModal } from "../components/GestionProveedor/ProveedorModal";

export default function GestionProveedor() {
	const [proveedores, setProveedores] = useState([]);
	const [filteredProveedores, setFilteredProveedores] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [editingProveedor, setEditingProveedor] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(8);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProveedores = async () => {
			setLoading(true);
			const data = await obtenerProveedores();

			if (data.success) {
				setProveedores(data.data);
				setFilteredProveedores(data.data);
			} else {
				setProveedores([]);
				setFilteredProveedores([]);
			}

			setLoading(false);
		};

		fetchProveedores();
	}, []);


	// Filtrar proveedores
	useEffect(() => {
		const filtered = proveedores.filter(proveedor =>
			proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
			proveedor.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
			proveedor.correo.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredProveedores(filtered);
		setCurrentPage(1);
	}, [searchTerm, proveedores]);

	// Paginación
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredProveedores.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredProveedores.length / itemsPerPage);

	const handleDelete = (id) => {
		setProveedores(proveedores.filter(p => p.id !== id));
	};

	const handleEdit = (proveedor) => {
		setEditingProveedor(proveedor);
		setShowModal(true);
	};

	const handleAddNew = () => {
		setEditingProveedor(null);
		setShowModal(true);
	};

	const handleSave = async (proveedorData) => {
		try {
			if (editingProveedor) {
				const response = await editarProveedor(proveedorData);
				if (response.success) {
					setProveedores((prev) =>
						prev.map((p) =>
							p.id === editingProveedor.id ? { ...p, ...proveedorData } : p
						)
					);
				}
			} else {
				const response = await crearProveedor(proveedorData);

				if (response.success) {
					setProveedores((prev) => [...prev, response.data]);
				}
			}
		} catch (error) {
			console.error("Error al guardar proveedor:", error);
		} finally {
			setShowModal(false);
			setEditingProveedor(null);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6 p-5">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
				<div className="flex items-center gap-4">
					<div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
						<Handshake size={24} />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Gestión de Proveedores</h1>
						<p className="text-gray-500 mt-1">Administra los proveedores de la empresa</p>
					</div>
				</div>

				<div className="flex items-center gap-3 flex-wrap">
					<button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
						<Download size={16} />
						<span>Exportar</span>
					</button>

					<button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
						<Upload size={16} />
						<span>Importar</span>
					</button>

					<button
						onClick={handleAddNew}
						className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
					>
						<Plus size={16} />
						<span>Nuevo Proveedor</span>
					</button>
				</div>
			</div>

			{/* Filtros y Búsqueda */}
			<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
						<input
							type="text"
							placeholder="Buscar por nombre, NIT o correo..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
						<Filter size={16} />
						<span>Filtros</span>
					</button>
				</div>
			</div>

			{/* Tarjetas de Proveedores */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{currentItems.map((proveedor) => (
					<motion.div
						key={proveedor.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
					>
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
								<Building size={24} className="text-blue-600" />
							</div>
							<div className="flex items-center gap-2">
								<button
									onClick={() => handleEdit(proveedor)}
									className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
								>
									<Edit size={16} />
								</button>
								<button
									onClick={() => handleDelete(proveedor.id)}
									className="p-1 text-red-600 hover:text-red-800 transition-colors"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>

						<h3 className="font-semibold text-gray-900 text-lg mb-2">
							{proveedor.nombre}
						</h3>

						<div className="space-y-2 text-sm text-gray-600">
							<div className="flex items-center gap-2">
								<FileText size={14} className="text-gray-400" />
								<span>NIT: {proveedor.nit}</span>
							</div>

							<div className="flex items-center gap-2">
								<Phone size={14} className="text-gray-400" />
								<span>{proveedor.telefono}</span>
							</div>

							<div className="flex items-center gap-2">
								<Mail size={14} className="text-gray-400" />
								<span className="truncate">{proveedor.correo}</span>
							</div>

							<div className="flex items-center gap-2">
								<MapPin size={14} className="text-gray-400" />
								<span className="truncate">{proveedor.direccion}</span>
							</div>
						</div>

						<div className="mt-4 pt-4 border-t border-gray-100">
							<button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
								<Eye size={14} />
								<span>Ver detalles</span>
							</button>
						</div>
					</motion.div>
				))}
			</div>

			{/* Paginación */}
			{filteredProveedores.length > 0 && (
				<div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
					<div className="flex items-center justify-between">
						<p className="text-sm text-gray-600">
							Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredProveedores.length)} de {filteredProveedores.length} proveedores
						</p>

						<div className="flex items-center gap-2">
							<button
								onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
								disabled={currentPage === 1}
								className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronLeft size={16} />
							</button>

							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								const page = i + 1;
								return (
									<button
										key={page}
										onClick={() => setCurrentPage(page)}
										className={`w-8 h-8 rounded-lg text-sm ${currentPage === page
											? 'bg-blue-600 text-white'
											: 'border border-gray-200 text-gray-700 hover:bg-gray-50'
											}`}
									>
										{page}
									</button>
								);
							})}

							{totalPages > 5 && (
								<span className="px-2 text-gray-500">...</span>
							)}

							<button
								onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
								disabled={currentPage === totalPages}
								className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<ChevronRight size={16} />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal para agregar/editar */}
			<AnimatePresence>
				{showModal && (
					<ProveedorModal
						proveedor={editingProveedor}
						onClose={() => setShowModal(false)}
						onSave={handleSave}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
