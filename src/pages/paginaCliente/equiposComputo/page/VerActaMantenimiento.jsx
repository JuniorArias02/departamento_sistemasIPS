import { useEffect, useState } from "react";
import { listarMantenimiento, subirFirmaMantenimientoPC, eliminarMantenimientoId } from "../../../../services/pc_mantenimientos_services";
import { URL_IMAGE } from "../../../../const/api";
import { useNavigate } from "react-router-dom";
import {
	Calendar,
	Wrench,
	User,
	FileText,
	MoreVertical,
	CheckCircle,
	Trash2,
	Download,
	Filter,
	Search,
	Clock,
	AlertCircle,
	Plus
} from "lucide-react";
import { FirmaInput } from "../../../appFirma/appFirmas";
import Swal from "sweetalert2";
import { RUTAS } from "../../../../const/routers/routers";
import { useApp } from "../../../../store/AppContext";
export function VerActaMantenimiento() {
	const navigate = useNavigate();
	const { usuario } = useApp();
	const [mantenimientos, setMantenimientos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("all"); // all, completed, pending
	const [showModal, setShowModal] = useState(false);
	const [selectedActa, setSelectedActa] = useState(null);
	const [form, setForm] = useState({
		firma_personal_cargo: null,
	});
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await listarMantenimiento();
				if (res?.status === "success") {
					setMantenimientos(res.data);
				}
			} catch (err) {
				console.error("Error al cargar mantenimientos:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const base64ToFile = (base64, filename) => {
		const arr = base64.split(",");
		const mime = arr[0].match(/:(.*?);/)[1]; // "image/png"
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	};

	const handleFinalize = (id) => {
		setSelectedActa(id);
		setShowModal(true);
	};

	const handleConfirmFinalize = async () => {
		if (!form.firma_personal_cargo) {
			Swal.fire("Falta la firma", "Debes agregar la firma del personal a cargo ✍️", "warning");
			return;
		}

		const formData = new FormData();
		formData.append("mantenimiento_id", selectedActa);

		const firmaCargoFile = base64ToFile(form.firma_personal_cargo, "firma_personal.png");
		formData.append("firma_personal_cargo", firmaCargoFile);

		try {
			const res = await subirFirmaMantenimientoPC(formData);

			if (res.status) {
				const data = await listarMantenimiento();
				if (data?.status === "success") {
					setMantenimientos(data.data);
				}

				Swal.fire("¡Firmado!", "La firma se guardó correctamente ✅", "success");
			} else {
				Swal.fire("Error", res.message || "No se pudo guardar la firma ⚠️", "error");
			}
		} catch (err) {
			console.error("Error al guardar firmas:", err);
			Swal.fire("Error", "Ocurrió un problema al guardar la firma ❌", "error");
		}

		setShowModal(false);
		setForm({ firma_personal_cargo: null });
	};

	const handleDelete = async (id) => {
		Swal.fire({
			title: "¿Estás seguro?",
			text: "No podrás revertir esta acción",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const res = await eliminarMantenimientoId(id, usuario.id);

					if (res.status) {
						// 🔥 Quitar del state sin refrescar todo
						setMantenimientos((prev) => prev.filter((acta) => acta.id !== id));

						Swal.fire("Eliminado", "El acta fue eliminada correctamente ✅", "success");
					} else {
						Swal.fire("Error", res.message || "No se pudo eliminar el acta ⚠️", "error");
					}
				} catch (error) {
					console.error("Error eliminando acta:", error);
					Swal.fire("Error", "Ocurrió un error al eliminar el acta ❌", "error");
				}
			}
		});
	};

	const filteredMantenimientos = mantenimientos
		.filter(m => {
			const matchesSearch = m.nombre_equipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				m.tipo_mantenimiento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				m.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());

			if (filterStatus === "all") return matchesSearch;
			if (filterStatus === "completed") return matchesSearch && m.estado === "completado";
			if (filterStatus === "pending") return matchesSearch && m.estado !== "completado";

			return matchesSearch;
		});

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 mb-8">
				<div className="flex flex-col md:flex-row md:items-center justify-between">
					<div className="flex items-center">
						<div className="bg-indigo-100 p-3 rounded-xl mr-4">
							<FileText className="h-8 w-8 text-indigo-600" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-gray-900 flex items-center">
								Actas de Mantenimiento
								<span className="ml-3 bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
									{mantenimientos.length}
								</span>
							</h1>
							<p className="text-gray-600 mt-2 flex items-center">
								<span className="flex items-center mr-3">
									<CheckCircle className="h-4 w-4 text-green-500 mr-1" />
									<span className="text-sm">Gestiona y revisa todas las actas de mantenimiento registradas</span>
								</span>
							</p>
						</div>
					</div>

					<div className="mt-4 md:mt-0">
						<button
							onClick={() => navigate(RUTAS.USER.EQUIPOS.CREAR_ACTA_MANTENIMIENTO)}
							className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
							<FileText className="h-5 w-5 mr-2" />
							Nueva Acta
							<Plus className="h-4 w-4 ml-1" />
						</button>
					</div>
				</div>

				{/* Estadísticas rápidas */}
				<div className="flex flex-wrap gap-4 mt-6 pt-5 border-t border-indigo-100">
					<div className="flex items-center">
						<div className="bg-blue-100 p-2 rounded-lg mr-2">
							<CheckCircle className="h-4 w-4 text-blue-600" />
						</div>
						<div>
							<span className="text-sm text-gray-500">Completadas</span>
							<p className="font-semibold text-gray-800">
								{mantenimientos.filter(m => m.estado === "completado").length}
							</p>
						</div>
					</div>

					<div className="flex items-center">
						<div className="bg-amber-100 p-2 rounded-lg mr-2">
							<Clock className="h-4 w-4 text-amber-600" />
						</div>
						<div>
							<span className="text-sm text-gray-500">Pendientes</span>
							<p className="font-semibold text-gray-800">
								{mantenimientos.filter(m => m.estado !== "completado").length}
							</p>
						</div>
					</div>

					<div className="flex items-center">
						<div className="bg-purple-100 p-2 rounded-lg mr-2">
							<Wrench className="h-4 w-4 text-purple-600" />
						</div>
						<div>
							<span className="text-sm text-gray-500">Preventivos</span>
							<p className="font-semibold text-gray-800">
								{mantenimientos.filter(m => m.tipo_mantenimiento === "preventivo").length}
							</p>
						</div>
					</div>

					<div className="flex items-center">
						<div className="bg-rose-100 p-2 rounded-lg mr-2">
							<AlertCircle className="h-4 w-4 text-rose-600" />
						</div>
						<div>
							<span className="text-sm text-gray-500">Correctivos</span>
							<p className="font-semibold text-gray-800">
								{mantenimientos.filter(m => m.tipo_mantenimiento === "correctivo").length}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Filtros y búsqueda */}
			<div className="bg-white rounded-xl shadow-sm p-4 mb-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar actas..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>

					<div className="flex space-x-2">
						<button
							onClick={() => setFilterStatus("all")}
							className={`px-4 py-2 rounded-lg flex items-center ${filterStatus === "all" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"}`}
						>
							<Filter className="h-4 w-4 mr-1" />
							Todos
						</button>
						<button
							onClick={() => setFilterStatus("completed")}
							className={`px-4 py-2 rounded-lg flex items-center ${filterStatus === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
						>
							<CheckCircle className="h-4 w-4 mr-1" />
							Completados
						</button>
						<button
							onClick={() => setFilterStatus("pending")}
							className={`px-4 py-2 rounded-lg flex items-center ${filterStatus === "pending" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}
						>
							<Clock className="h-4 w-4 mr-1" />
							Pendientes
						</button>
					</div>

					<div className="text-right text-gray-500">
						{filteredMantenimientos.length} de {mantenimientos.length} actas
					</div>
				</div>
			</div>

			{mantenimientos.length === 0 ? (
				<div className="bg-white rounded-xl shadow-sm p-8 text-center">
					<FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
					<h3 className="text-xl font-medium text-gray-700 mb-2">No hay actas de mantenimiento</h3>
					<p className="text-gray-500">Comienza creando tu primera acta de mantenimiento</p>
				</div>
			) : filteredMantenimientos.length === 0 ? (
				<div className="bg-white rounded-xl shadow-sm p-8 text-center">
					<Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
					<h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron resultados</h3>
					<p className="text-gray-500">Intenta con otros términos de búsqueda o filtros</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredMantenimientos.map((m) => (
						<div key={m.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
							<div className="p-5 border-b border-gray-100">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-lg font-semibold text-gray-900 truncate">{m.nombre_equipo}</h3>
										<div className="flex items-center mt-1">
											<span className={`px-2 py-1 rounded-full text-xs font-medium ${m.tipo_mantenimiento === "preventivo"
												? "bg-blue-100 text-blue-800"
												: "bg-amber-100 text-amber-800"
												}`}>
												{m.tipo_mantenimiento}
											</span>
											<span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${m.estado === "completado"
												? "bg-green-100 text-green-800"
												: "bg-gray-100 text-gray-800"
												}`}>
												{m.estado === "completado" ? "Completado" : "Pendiente"}
											</span>
										</div>
									</div>

									<div className="relative">
										<button className="text-gray-400 hover:text-gray-600 p-1 rounded">
											<MoreVertical className="h-5 w-5" />
										</button>
									</div>
								</div>

								<p className="text-gray-600 mt-3 line-clamp-2">{m.descripcion}</p>
							</div>

							<div className="p-5">
								<div className="flex items-center text-sm text-gray-500 mb-2">
									<Calendar className="h-4 w-4 mr-2" />
									{(() => {
										const d = new Date(m.fecha);
										const dia = String(d.getUTCDate()).padStart(2, "0");
										const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
										const anio = d.getUTCFullYear();
										return `${dia}/${mes}/${anio}`;
									})()}
								</div>


								<div className="flex items-center text-sm text-gray-500 mb-4">
									<User className="h-4 w-4 mr-2" />
									{m.responsable_nombre || "Sin responsable asignado"}
								</div>

								<div className="flex justify-between items-center mt-4">
									<div className="flex space-x-2">
										{m.firma_personal_cargo && m.firma_personal_cargo !== "" && (
											<img
												src={`${URL_IMAGE}/${m.firma_personal_cargo.replace("public/", "")}`}
												alt="Firma personal"
												className="h-8 object-contain border rounded"
											/>
										)}
										{m.firma_sistemas && m.firma_sistemas !== "" && (
											<img
												src={`${URL_IMAGE}/${m.firma_sistemas.replace("public/", "")}`}
												alt="Firma sistemas"
												className="h-8 object-contain border rounded"
											/>
										)}
									</div>

									<div className="flex space-x-2">
										<button
											onClick={() => handleFinalize(m.id)}
											disabled={m.estado === "completado"}
											className={`p-2 rounded-lg ${m.estado === "completado"
												? "bg-green-100 text-green-600 cursor-not-allowed"
												: "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600"}`}
											title={m.estado === "completado" ? "Acta ya finalizada" : "Finalizar acta"}
										>
											<CheckCircle className="h-4 w-4" />
										</button>

										<button
											onClick={() => handleDelete(m.id)}
											className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
											title="Eliminar acta"
										>
											<Trash2 className="h-4 w-4" />
										</button>

										<button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600" title="Descargar acta">
											<Download className="h-4 w-4" />
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* modal de firam */}
			{showModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black/20 bg-opacity-50 z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
						<h2 className="text-xl font-bold mb-4">Firmar Acta</h2>

						<FirmaInput
							value={form.firma_personal_cargo}
							onChange={(value) => setForm({ ...form, firma_personal_cargo: value })}
							label="Firma del elaborado por"
						/>

						<div className="flex justify-end mt-4 space-x-2">
							<button
								className="px-4 py-2 bg-gray-200 rounded-lg"
								onClick={() => setShowModal(false)}
							>
								Cancelar
							</button>
							<button
								className="px-4 py-2 bg-green-600 text-white rounded-lg"
								onClick={handleConfirmFinalize}
							>
								Confirmar
							</button>
						</div>
					</div>
				</div>
			)}

		</div>
	);
}