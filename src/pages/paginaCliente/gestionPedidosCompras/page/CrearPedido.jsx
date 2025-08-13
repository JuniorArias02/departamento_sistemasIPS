import React, { useState, useEffect } from "react";
import {
	Calendar,
	ClipboardList,
	FilePlus,
	Plus,
	Trash2,
	Save,
	User,
	List,
	FileText,
	CheckCircle,
	XCircle
} from 'lucide-react';
import { FirmaInput } from "../../../appFirma/appFirmas";
import { crearPedido, subirFirmaPedido } from "../../../../services/cp_pedidos_services";
import AgregarFirmaModal from "../components/crearPedido/AgregarFirmaModal";
import { crearItems } from "../../../../services/cp_items_services";
import { obtenerTiposSolicitud } from "../../../../services/cp_tipo_solicitud";
import { useApp } from "../../../../store/AppContext";
import Swal from "sweetalert2";

export default function CrearPedido() {
	const { usuario } = useApp();
	const [modalOpen, setModalOpen] = useState(false);
	const [tipos, setTipos] = useState([]);
	const [form, setForm] = useState({
		fecha_solicitud: "",
		proceso_solicitante: "",
		tipo_solicitud: "",
		observacion: "",
		elaborado_por: usuario.id,
		elaborado_por_firma: "",
		creador_por: usuario.id,
	});

	useEffect(() => {
		const cargarTipos = async () => {
			const data = await obtenerTiposSolicitud();
			setTipos(data);
		};
		cargarTipos();
	}, []);

	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(false);
	const [mensaje, setMensaje] = useState({ text: "", type: "" });

	function base64ToBlob(base64) {
		const byteString = atob(base64.split(",")[1]);
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);
		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: "image/png" });
	}
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMensaje({ text: "", type: "" });

		try {
			// 1️⃣ Validación básica
			if (items.length === 0) {
				throw new Error("Debes agregar al menos un ítem");
			}
			if (!form.elaborado_por_firma) {
				throw new Error("Debes agregar tu firma");
			}

			// 2️⃣ Crear el pedido (sin mandar la firma aquí)
			const pedidoData = {
				fecha_solicitud: form.fecha_solicitud,
				proceso_solicitante: form.proceso_solicitante,
				tipo_solicitud: form.tipo_solicitud,
				observacion: form.observacion,
				elaborado_por: usuario.id,
				creador_por: usuario.id,
			};

			const responsePedido = await crearPedido(pedidoData);
			if (!responsePedido.success) throw new Error(responsePedido.error || "Error creando pedido");

			const pedidoId = responsePedido.id;

			// 3️⃣ Enviar items
			const responseItems = await crearItems(
				items.map(item => ({
					...item,
					cp_pedido: pedidoId,
				}))
			);
			if (!responseItems.status) throw new Error(responseItems.message || "Error creando items");

			// 4️⃣ Subir firma
			const blob = base64ToBlob(form.elaborado_por_firma);
			const formData = new FormData();
			formData.append("id_pedido", pedidoId);
			formData.append("tipo_firma", "elaborado_por_firma");
			formData.append("firma", blob, "firma.png");

			const resFirma = await subirFirmaPedido(formData);
			if (!resFirma.success) throw new Error(resFirma.error || "Error subiendo firma");

			// 5️⃣ Éxito
			setMensaje({ text: "¡Pedido creado con éxito!", type: "success" });
			Swal.fire({
				icon: 'success',
				title: 'Se ha creado el pedido',
				text: `el pedido ${form.proceso_solicitante} fue registrada correctamente`,
				timer: 2000,
				showConfirmButton: false
			});
			// 6️⃣ Reset form
			setForm({
				fecha_solicitud: "",
				proceso_solicitante: "",
				tipo_solicitud: "",
				observacion: "",
				elaborado_por: usuario.id,
				elaborado_por_firma: "",
				creador_por: usuario.id,
			});
			setItems([]);

		} catch (error) {
			setMensaje({ text: error.message, type: "error" });
		} finally {
			setLoading(false);
		}
	};

	const manejarConfirmacion = async (contrasena) => {
		setModalOpen(false);

		const res = await fetch("/endpoint/verificar-firma", {
			method: "POST",
			body: JSON.stringify({ contrasena }),
			headers: { "Content-Type": "application/json" }
		});

		const data = await res.json();

		if (data?.firma) {
			setForm({ ...form, elaborado_por_firma: data.firma });
		} else {
			Swal.fire({
				icon: "error",
				title: "No se ha encontrado firma",
				timer: 2000,
				showConfirmButton: false
			});
		}
	};


	const agregarItem = () => {
		setItems([...items, { nombre: "", cantidad: 1, referencia_items: "" }]);
	};

	const cambiarItem = (index, campo, valor) => {
		const nuevosItems = [...items];
		nuevosItems[index][campo] = valor;
		setItems(nuevosItems);
	};

	const borrarItem = (index) => {
		setItems(items.filter((_, i) => i !== index));
	};

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-5 mb-5">
			<h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
				<FilePlus className="text-blue-600" size={24} />
				Crear Nuevo Pedido
			</h1>

			{mensaje.text && (
				<div className={`mb-6 p-4 rounded-md ${mensaje.type === "success"
					? "bg-green-100 text-green-800"
					: "bg-red-100 text-red-800"
					} flex items-center gap-2`}>
					{mensaje.type === "success" ? (
						<CheckCircle size={20} />
					) : (
						<XCircle size={20} />
					)}
					{mensaje.text}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Fecha Solicitud */}
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
							<Calendar size={16} />
							Fecha de Solicitud
						</label>
						<input
							type="date"
							value={form.fecha_solicitud}
							onChange={(e) => setForm({ ...form, fecha_solicitud: e.target.value })}
							className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>

					{/* Proceso Solicitante */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
							<User size={16} />
							Proceso Solicitante
						</label>
						<input
							type="text"
							value={form.proceso_solicitante}
							onChange={(e) => setForm({ ...form, proceso_solicitante: e.target.value })}
							className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							required
							placeholder="Ej: Departamento de Sistemas"
						/>
					</div>

					{/* Tipo Solicitud */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
							<List size={16} />
							Tipo de Solicitud
						</label>
						<select
							value={form.tipo_solicitud}
							onChange={(e) => setForm({ ...form, tipo_solicitud: e.target.value })}
							className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							required
						>
							<option value="">Seleccione un tipo</option>
							{tipos.map((tipo) => (
								<option key={tipo.id} value={tipo.id}>
									{tipo.nombre}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Observación */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
						<FileText size={16} />
						Observaciones
					</label>
					<textarea
						value={form.observacion}
						onChange={(e) => setForm({ ...form, observacion: e.target.value })}
						className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
						placeholder="Detalles adicionales del pedido"
					/>
				</div>

				{/* Sección de Ítems */}
				<div className="border border-gray-200 rounded-lg p-4">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
							<ClipboardList size={18} />
							Ítems del Pedido
						</h3>
						<button
							type="button"
							onClick={agregarItem}
							className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
						>
							<Plus size={16} />
							Agregar Ítem
						</button>
					</div>

					{items.length === 0 ? (
						<div className="text-center py-4 text-gray-500">
							No hay ítems agregados
						</div>
					) : (
						<div className="space-y-4">
							{items.map((item, i) => (
								<div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b pb-4">
									<div className="md:col-span-5">
										<input
											placeholder="Nombre del ítem"
											value={item.nombre}
											onChange={(e) => cambiarItem(i, "nombre", e.target.value)}
											className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
											required
										/>
									</div>
									<div className="md:col-span-2">
										<input
											type="number"
											placeholder="Cantidad"
											value={item.cantidad}
											onChange={(e) => cambiarItem(i, "cantidad", e.target.value)}
											min={1}
											className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
											required
										/>
									</div>
									<div className="md:col-span-4">
										<input
											placeholder="Referencia (opcional)"
											value={item.referencia_items}
											onChange={(e) => cambiarItem(i, "referencia_items", e.target.value)}
											className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div className="md:col-span-1 flex justify-center">
										<button
											type="button"
											onClick={() => borrarItem(i)}
											className="text-red-500 hover:text-red-700 p-1"
											title="Eliminar"
										>
											<Trash2 size={18} />
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Firma */}
				<div className="border border-gray-200 rounded-lg p-4">
					<h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
						<FileText size={18} />
						Firma del Solicitante
					</h3>

					<div className="flex items-start gap-3">
						{/* Firma manual */}
						<div className="flex-1">
							<FirmaInput
								value={form.elaborado_por_firma}
								onChange={(value) => setForm({ ...form, elaborado_por_firma: value })}
								label="Firma del elaborado por"
							/>
						</div>

						{/* Firma por contraseña */}
						<button
							type="button"
							onClick={() => setModalOpen(true)}
							className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
						>
							Usar firma guardada
						</button>

						<AgregarFirmaModal
							open={modalOpen}
							onClose={() => setModalOpen(false)}
							onConfirm={manejarConfirmacion}
						/>
					</div>
				</div>


				{/* Botón de envío */}
				<div className="flex justify-end pt-4">
					<button
						type="submit"
						disabled={loading}
						className={`bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 flex items-center gap-2 px-6 py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
							} transition-colors`}
					>
						{loading ? (
							<>
								<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Procesando...
							</>
						) : (
							<>
								<Save size={18} />
								Crear Pedido
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}