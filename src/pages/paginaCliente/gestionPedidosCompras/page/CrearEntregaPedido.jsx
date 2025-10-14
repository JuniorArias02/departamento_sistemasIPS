import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FirmaInput } from "../../../appFirma/appFirmas";
import { Save, Calendar, FileText, ArchiveRestore, UserCheck, ArrowLeft } from "lucide-react";
import BackPage from "../../components/BackPage";
import { crearEntregaSolicitud, subirFirmaEntrega } from "../../../../services/cp_entrega_solicitud_services";
import { useApp } from "../../../../store/AppContext";
import Swal from "sweetalert2";

export default function CrearEntregaPedido() {
	const { usuario } = useApp();
	const navigate = useNavigate();
	const { state } = useLocation();
	const { pedido } = state || {};

	function base64ToBlob(base64) {
		if (!base64 || !base64.includes(",")) return null;
		const byteString = atob(base64.split(",")[1]);
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: "image/png" });
	}

	const [form, setForm] = useState({
		usuario_id: usuario.id,
		consecutivo_id: pedido?.consecutivo || "",
		estado: 0,
		fecha: new Date().toISOString().slice(0, 10),
		factura_proveedor: "",
		firma_quien_recibe: "",
		created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
	});



	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const resEntrega = await crearEntregaSolicitud({
				usuario_id: usuario.id,
				consecutivo_id: form.consecutivo_id,
				fecha: form.fecha,
				factura_proveedor: form.factura_proveedor,
			});

			if (!resEntrega.success) {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Error al crear la entrega",
				});
				return;
			}

			if (form.firma_quien_recibe) {
				const blob = base64ToBlob(form.firma_quien_recibe);
				if (!blob) {
					console.error("Firma inválida o vacía");
					Swal.fire({
						icon: "error",
						title: "Firma inválida",
						text: "No se pudo procesar la firma",
					});
					return;
				}
				const formData = new FormData();
				formData.append("usuario_id", usuario.id);
				formData.append("consecutivo_id", form.consecutivo_id);
				formData.append("firma", blob, "firma.png");

				const resFirma = await subirFirmaEntrega(formData);
				if (!resFirma.success) {
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: "Error al subir la firma",
					});
					return;
				}
			}
			Swal.fire({
				icon: "success",
				title: "¡Éxito!",
				text: "Entrega registrada correctamente",
			});
			navigate(-1);
		} catch (err) {
			console.error(err);
			Swal.fire({
				icon: "error",
				title: "Error inesperado",
				text: err.message || "Algo salió mal en el servidor",
			});
		}
	};


	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 py-8 px-4">
			<BackPage isEdit={true} />
			<div className="w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
				{/* Header con gradiente */}
				<div className="flex items-center gap-4 p-5">
					<div className="p-3 flex justify-center items-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
						<ArchiveRestore className="" size={24} />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Control de Entrega Pedido por Proceso </h1>
						<p className="text-gray-500 mt-1">Complete los detalles de la entrega</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					{/* Consecutivo */}
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
							<FileText className="mr-2" size={16} />
							Consecutivo
						</label>
						<div className="relative">
							<input
								type="text"
								value={form.consecutivo_id}
								readOnly
								className="w-full border border-gray-200 rounded-lg p-3 pl-10 bg-blue-50 text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							<FileText className="absolute left-3 top-3.5 text-blue-500" size={16} />
						</div>
						<p className="text-xs text-gray-500 mt-1">Identificador automático de la entrega</p>
					</div>

					{/* Fecha */}
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
							<Calendar className="mr-2" size={16} />
							Fecha de entrega
						</label>
						<div className="relative">
							<input
								type="date"
								value={form.fecha}
								onChange={(e) => setForm({ ...form, fecha: e.target.value })}
								className="w-full border border-gray-200 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								disabled
							/>
							<Calendar className="absolute left-3 top-3.5 text-gray-400" size={16} />
						</div>
					</div>

					{/* Factura */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Factura de compra / proveedor
						</label>
						<input
							type="text"
							value={form.factura_proveedor}
							onChange={(e) => setForm({ ...form, factura_proveedor: e.target.value })}
							placeholder="Ej: FAC-12345"
							className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* Firma */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
							<UserCheck className="mr-2" size={16} />
							Firma quien recibe
						</label>
						<FirmaInput
							value={form.firma_quien_recibe}
							onChange={(value) => setForm({ ...form, firma_quien_recibe: value })}
							label="Firma quien recibe"
						/>
					</div>

					{/* Botones de acción */}
					<div className="flex space-x-150 pt-5">
						<button
							type="button"
							className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex-1"
							onClick={() => navigate(-1)}
						>
							<ArrowLeft className="mr-2" size={18} />
							Cancelar
						</button>
						<button
							type="submit"
							className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-600 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex-1"
						>
							<Save className="mr-2" size={18} />
							Guardar Entrega
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

