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
	XCircle,
	Warehouse,
	MapPin,
	ChevronDown,
	AlertCircle
} from 'lucide-react';
import { FirmaInput } from "../../../appFirma/appFirmas";
import { crearPedido, subirFirmaPedido } from "../../../../services/cp_pedidos_services";
import AgregarFirmaModal from "../components/crearPedido/AgregarFirmaModal";
import { crearItems } from "../../../../services/cp_items_services";
import { obtenerTiposSolicitud } from "../../../../services/cp_tipo_solicitud";
import { useApp } from "../../../../store/AppContext";
import { agregarFirmaPorClave } from "../../../../services/usuario_service";
import { listarSedes } from "../../../../services/sedes_service";
import BuscarDependencia from "../../componentsUnive/BuscarDependencia";
import { buscarProductoPorCodigo } from "../../../../services/cp_productos_services";

import Swal from "sweetalert2";

export default function CrearPedido() {
	const { usuario } = useApp();
	const [modalOpen, setModalOpen] = useState(false);
	const [tipos, setTipos] = useState([]);
	const [productos, setProductos] = useState([]);
	const [firmaAprobacion, setFirmaAprobacion] = useState(null);
	const [sedes, setSedes] = useState([]);
	const [form, setForm] = useState({
		fecha_solicitud: new Date().toISOString().split('T')[0],
		proceso_solicitante: "",
		tipo_solicitud: "",
		sede_id: "",
		observacion: "",
		elaborado_por: usuario.id,
		elaborado_por_firma: "",
		creador_por: usuario.id,
	});

	const buscarYAsignarProducto = async (index) => {
		const codigo = items[index].codigo;
		if (!codigo) return;

		try {
			const res = await buscarProductoPorCodigo(codigo);
			if (res.success && res.producto) {
				cambiarItem(index, "producto_id", res.producto.id);
				cambiarItem(index, "nombre", res.producto.nombre);

				Swal.fire({
					icon: "success",
					title: "Producto encontrado",
					text: `Se cargó: ${res.producto.nombre}`,
					timer: 2000,
					showConfirmButton: false
				});
			} else {
				cambiarItem(index, "producto_id", "");
				Swal.fire({
					icon: "warning",
					title: "Producto no encontrado",
					text: "Puedes escribir el nombre manualmente.",
					confirmButtonText: "Entendido",
					confirmButtonColor: "#3b82f6"
				});
			}
		} catch (error) {
			console.error("Error al buscar producto:", error);
			Swal.fire({
				icon: "error",
				title: "Error en la búsqueda",
				text: "Hubo un problema al buscar el producto. Intenta nuevamente.",
				confirmButtonText: "Cerrar",
				confirmButtonColor: "#ef4444"
			});
		}
	};


	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	};


	useEffect(() => {
		const cargarTipos = async () => {
			const data = await obtenerTiposSolicitud();
			setTipos(data);
		};
		const cargarSedes = async () => {
			const data = await listarSedes();
			setSedes(data);
		}

		cargarTipos();
		cargarSedes();
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
				sede_id: form.sede_id,
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
					nombre: item.nombre,
					cantidad: item.cantidad,
					unidad_medida: item.unidad_medida,
					referencia_items: item.referencia_items,
					cp_pedido: pedidoId,
					productos_id: item.producto_id || null
				}))
			);

			if (!responseItems.status) throw new Error(responseItems.message || "Error creando items");

			// 4️⃣ Subir firma
			const blob = base64ToBlob(form.elaborado_por_firma);
			const formData = new FormData();
			formData.append("id_pedido", pedidoId);
			formData.append("tipo_firma", "elaborado_por_firma");
			formData.append("firma", blob, "firma.png");
			formData.append("id_usuario", usuario.id);
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
				fecha_solicitud: new Date().toISOString().split('T')[0],
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
		const res = await agregarFirmaPorClave({
			usuario_id: usuario.id,
			contrasena,
		});

		if (res.status && res.firma) {
			const firmaBase64 = res.firma.startsWith("data:image")
				? res.firma
				: `data:image/png;base64,${res.firma}`;

			// aquí la montas en el input del form
			setForm((prev) => ({ ...prev, elaborado_por_firma: firmaBase64 }));

			setModalOpen(false);
		} else {
			await Swal.fire("Error", res.message || "No se pudo traer la firma", "error");
		}
	};

	const agregarItem = () => {
		setItems([
			...items,
			{
				codigo: "",
				producto_id: "",
				nombre: "",
				cantidad: 1,
				unidad_medida: "",
				referencia_items: ""
			}
		]);
	};

	const cambiarItem = (index, field, value) => {
		setItems(prev =>
			prev.map((item, i) =>
				i === index ? { ...item, [field]: value } : item
			)
		);
	};

	const borrarItem = (index) => {
		setItems(items.filter((_, i) => i !== index));
	};

	return (
		<div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md mt-5 mb-5">
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
						<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<div className="p-1.5 bg-green-100 rounded-md">
								<Calendar size={16} className="text-green-600" />
							</div>
							Fecha de Solicitud
							<span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<input
								type="date"
								value={form.fecha_solicitud}
								onChange={(e) => setForm({ ...form, fecha_solicitud: e.target.value })}
								min={new Date().toISOString().split('T')[0]}
								max={new Date().toISOString().split('T')[0]}
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
								disabled
							/>
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none mt-1">
								<Calendar size={16} className="text-gray-400" />
							</div>
						</div>
						{form.fecha_solicitud && (
							<p className="mt-2 text-xs text-green-600 flex items-center gap-1">
								<CheckCircle size={12} />
								Fecha: {new Date(form.fecha_solicitud + 'T00:00:00').toLocaleDateString('es-ES', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</p>
						)}
					</div>

					{/* Campo de Proceso Solicitante */}
					<div className="relative">
						<BuscarDependencia
							name="proceso_solicitante"
							value={form.proceso_solicitante}
							onChange={handleChange}
							labelSede="Seleccione una sede"
							labelDependencia="Seleccione el proceso solicitante"
							required
							icon={
								<div className="p-1.5 bg-indigo-100 rounded-md">
									<User size={16} className="text-indigo-600" />
								</div>
							}
						/>
					</div>


					{/* Tipo Solicitud */}
					<div className="relative">
						<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
							<div className="p-1.5 bg-blue-100 rounded-md">
								<List size={16} className="text-blue-600" />
							</div>
							Tipo de Solicitud
							<span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<select
								value={form.tipo_solicitud}
								onChange={(e) => setForm({ ...form, tipo_solicitud: e.target.value })}
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white cursor-pointer"
								required
							>
								<option value="">Seleccione un tipo</option>
								{tipos.map((tipo) => (
									<option key={tipo.id} value={tipo.id}>
										{tipo.nombre}
									</option>
								))}
							</select>
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none mt-5">
								<ChevronDown size={16} className="text-gray-400" />
							</div>
						</div>
						{form.tipo_solicitud && (
							<p className="mt-2 text-xs text-gray-500">
								{form.tipo_solicitud === "prioritaria"
									? "Prioritaria: Respuesta en 5 horas o 3-4 días si requiere compra externa"
									: "Recurrente: Respuesta entre 1-5 días hábiles"}
							</p>
						)}
					</div>
				</div>

				{/* seccion items  */}
				<div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
							<div className="p-2 bg-blue-100 rounded-lg">
								<ClipboardList size={20} className="text-blue-600" />
							</div>
							Ítems del Pedido
						</h3>
						<span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
							{items.length} {items.length === 1 ? 'ítem' : 'ítems'}
						</span>
					</div>

					{items.length === 0 ? (
						<div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
							<ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
							<p className="text-gray-500 mb-4">No hay ítems agregados al pedido</p>
							<button
								type="button"
								onClick={agregarItem}
								className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
							>
								<Plus size={16} />
								Agregar primer ítem
							</button>
						</div>
					) : (
						<div className="space-y-4">
							{/* Encabezados de la tabla (solo visible en desktop) */}
							<div className="hidden md:grid md:grid-cols-12 gap-4 text-sm text-gray-500 font-medium pb-2 border-b">
								<div className="md:col-span-5">Codigo del Producto</div>
								<div className="md:col-span-5">Nombre del Producto</div>
								<div className="md:col-span-2">Cantidad</div>
								<div className="md:col-span-2">Unidad de medida</div>
								<div className="md:col-span-2">Referencia</div>
								<div className="md:col-span-1 text-center">Acción</div>
							</div>

							{items.map((item, i) => (
								<div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 rounded-lg even:bg-gray-50/50 hover:bg-blue-50/30 transition-colors">
									<div className="md:col-span-2">
										<label className="text-sm text-gray-500 block mb-1 md:hidden">codigo</label>
										<input
											placeholder="Código (opcional)"
											value={item.codigo}
											onChange={(e) => cambiarItem(i, "codigo", e.target.value)}
											onBlur={() => {
												if (items[i].codigo) buscarYAsignarProducto(i);
											}}
											className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div className="md:col-span-4">
										<label className="text-sm text-gray-500 block mb-1 md:hidden">Nombre</label>
										<input
											placeholder="Nombre del producto"
											value={item.nombre}
											onChange={(e) => cambiarItem(i, "nombre", e.target.value)}
											className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div className="md:col-span-1">
										<label className="text-sm text-gray-500 block mb-1 md:hidden">Cantidad</label>
										<input
											type="number"
											placeholder="0"
											value={item.cantidad}
											onChange={(e) => cambiarItem(i, "cantidad", e.target.value)}
											min={1}
											className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
											required
										/>
									</div>
									<div className="md:col-span-2">
										<label className="text-sm text-gray-500 block mb-1 md:hidden">Unidad</label>
										<select
											className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
											value={item.unidad_medida}
											onChange={(e) => cambiarItem(i, "unidad_medida", e.target.value)}
											required
										>
											<option value="Unidades">Unidad</option>
											<option value="Paquetes">Paquete</option>
										</select>
									</div>
									<div className="md:col-span-2">
										<label className="text-sm text-gray-500 block mb-1 md:hidden">Referencia (opcional)</label>
										<input
											placeholder="enlace del producto"
											value={item.referencia_items}
											onChange={(e) => cambiarItem(i, "referencia_items", e.target.value)}
											className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
										/>
									</div>
									<div className="md:col-span-1 flex justify-center pt-1 md:pt-0">
										<button
											type="button"
											onClick={() => borrarItem(i)}
											className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
											title="Eliminar ítem"
										>
											<Trash2 size={18} />
										</button>
									</div>
								</div>
							))}
						</div>
					)}

					<div className="mt-6 flex justify-between items-center">
						<div className="text-sm text-gray-500">
							{items.length > 0 ? '¿Necesitas agregar más ítems?' : ''}
						</div>
						<button
							type="button"
							onClick={agregarItem}
							className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm"
						>
							<Plus size={16} />
							Agregar Ítem
						</button>
					</div>
				</div>

				{/* Observación */}
				<div className="relative">
					<label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
						<div className="p-1.5 bg-amber-100 rounded-md">
							<FileText size={16} className="text-amber-600" />
						</div>
						Observaciones
					</label>

					<div className="relative">
						<textarea
							value={form.observacion}
							onChange={(e) => setForm({ ...form, observacion: e.target.value })}
							className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
							placeholder="Justifique para que se requiere esta compra "
							rows={4}
						/>
						<div className="absolute top-3 left-3 pointer-events-none">
							<FileText size={16} className="text-gray-400" />
						</div>
					</div>

					<div className="flex justify-between items-center mt-2">
						<p className="text-xs text-gray-500">
							Ej: Se requiere con urgencia..., Se realiza esta solicitud ya que no contamos con... etc.
						</p>
						<span className={`text-xs ${form.observacion.length > 200 ? 'text-amber-600' : 'text-gray-500'}`}>
							{form.observacion.length}/250
						</span>
					</div>

					{form.observacion.length > 200 && (
						<div className="flex items-center gap-1 mt-1 text-amber-600 text-xs">
							<AlertCircle size={12} />
							{form.observacion.length > 250 ?
								'Límite de caracteres excedido' :
								'Estás cerca del límite de caracteres'}
						</div>
					)}
				</div>


				<div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
					<h3 className="text-lg font-semibold text-gray-800 mb-3">Información sobre solicitudes</h3>
					<div className="space-y-4 text-gray-700">
						<div>
							<h4 className="font-medium text-gray-800 mb-1">Unidad de medida:</h4>
							<p>Puede representarse en <strong>unidad</strong> o <strong>paquete</strong> según aplique.</p>
						</div>

						<div>
							<h4 className="font-medium text-gray-800 mb-1">Tipo de solicitud:</h4>

							<div className="ml-2 mt-2">
								<div className="mb-3">
									<span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded">
										Prioritaria
									</span>
									<ul className="mt-2 pl-5 list-disc space-y-1">
										<li>Para el proceso de farmacia se recibe la solicitud del pedido y se dará respuesta en un tiempo no mayor a 5 horas.</li>
										<li>En los casos que requiera compra en otra ciudad se dará respuesta en un tiempo de 3 a 4 días hábiles.</li>
										<li>Para los demás procesos se dará respuesta en 2 días hábiles.</li>
									</ul>
								</div>

								<div className="mb-3">
									<span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">
										Recurrente
									</span>
									<ul className="mt-2 pl-5 list-disc space-y-1">
										<li>Para el proceso de farmacia el pedido mensual se recibe la solicitud del pedido y se dará respuesta de 1 a 5 días.</li>
										<li>Para los demás procesos se reciben los 5 primeros días del mes para dar respuesta en un tiempo de 1 a 4 días hábiles.</li>
									</ul>
								</div>

								<div className="bg-yellow-50 p-3 rounded-md border border-yellow-100 mt-4">
									<p className="text-sm text-yellow-800">
										<span className="font-medium">Nota:</span> En caso que el pedido requiera elaboración se dará respuesta en el tiempo que se determine con el proveedor para entrega de la compra previamente informado al proceso solicitante.
									</p>
								</div>
							</div>
						</div>
					</div>
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