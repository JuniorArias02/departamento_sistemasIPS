import axios from "axios";
import { EXPORTAR_INFORME_PEDIDOS, DESCARGAR_ADJUNTO, SUBIR_ADJUNTO, EXPORTAR_CONSOLIDADO_PEDIDOS, OBTENER_FIRMAS, OBTENER_CONSOLIDADO_PEDIDOS, AGREGAR_OBSERVACIONES, CREAR_PEDIDO, SUBIR_FIRMA, OBTENER_PEDIDOS, RECHAZAR_PEDIDO, APROBAR_PEDIDO, EXPORTAR_PEDIDO, EXPORTAR_PDF, ACTUALIZAR_FIRMA_PEDIDO } from "../const/endpoint/cp_pedidos_endpoint";


export const obtenerAdjunto = async (id) => {
	try {
		const response = await axios.get(`${DESCARGAR_ADJUNTO}?id=${id}`, {
			responseType: "blob", // importante
		});

		const blob = new Blob([response.data], { type: "application/pdf" });
		const url = window.URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = `pedido_${id}.pdf`;
		a.click();

		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Error al descargar el adjunto:", error);
	}
};


export const agregarAdjunto = async (datos) => {
	try {
		const response = await axios.post(SUBIR_ADJUNTO, datos, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	} catch (error) {
		console.error("Error al agregar adjunto:", error);
		return { status: false, message: "Error al conectar con el servidor" };
	}
};

export const obtenerFirmas64 = async (pedidoId) => {
	try {
		const response = await axios.post(OBTENER_FIRMAS, { pedido_id: pedidoId });
		const data = response.data;

		if (data.success && data.firmas) {
			return data.firmas;
		}

		return { responsable: null, compra: null };
	} catch (error) {
		console.error("Error al obtener firmas:", error);
		return { responsable: null, compra: null };
	}
};



export const agregarObservaciones = async (datos) => {
	try {
		const response = await axios.post(AGREGAR_OBSERVACIONES, datos);
		return response.data;
	} catch (error) {
		console.error("Error al agregar observaciones:", error);
		return { status: false, message: "Error al conectar con el servidor" };
	}
};


export const obtenerConsolidadoPedidos = async () => {
	try {
		const { data } = await axios.get(OBTENER_CONSOLIDADO_PEDIDOS);
		return data;
	} catch (error) {
		console.error("Error en obtenerConsolidadoPedidos:", error);
		throw new Error(
			error?.response?.data?.error || "Error al listar los pedidos"
		);
	}
};


export const subirFirmaPedido = async (formData) => {
	try {
		const response = await axios.post(SUBIR_FIRMA, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error al subir la firma", error);
		return { status: false, message: "Fallo en la petición" };
	}
};

export const actualizarFirmaPedido = async (datos) => {
	try {
		const response = await axios.post(ACTUALIZAR_FIRMA_PEDIDO, datos, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error al actualizar la firma del pedido", error);
		return { status: false, message: "Fallo en la petición" };
	}
};


export const crearPedido = async (datos) => {
	try {
		const response = await axios.post(CREAR_PEDIDO, datos);
		return response.data;
	} catch (error) {
		console.error('Error al crear pedido', error);
		return [];
	}
};

export const exportarInformeFecha = async (datos) => {
	try {
		const response = await axios.post(EXPORTAR_INFORME_PEDIDOS, datos, {
			responseType: "blob",
		});


		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "consolidado_pedidos.xlsx");
		document.body.appendChild(link);
		link.click();
		link.remove();
	} catch (error) {
		console.error("Error al crear informe", error);
	}
};

export const rechazarPedido = async (datos) => {
	try {
		const response = await axios.post(RECHAZAR_PEDIDO, datos);
		return response.data;
	} catch (error) {
		console.error('Error al rechazar pedido', error);
		throw error;
	}
};

export const aprobarPedido = async (datos) => {
	try {
		const { data } = await axios.post(APROBAR_PEDIDO, datos);
		return data;
	} catch (error) {
		console.error('Error al aprobar pedido', error.response?.data || error.message);
		throw error.response?.data || error;
	}
};


export const obtenerPedidos = async (datos) => {
	try {
		const { data } = await axios.post(OBTENER_PEDIDOS, datos);
		return data;
	} catch (error) {
		console.error("Error en obtenerPedidos:", error);
		throw new Error(
			error?.response?.data?.error || "Error al listar los pedidos"
		);
	}
};

export const exportarConsolidadoPedidos = async (datos) => {
	try {
		const response = await axios.post(
			EXPORTAR_CONSOLIDADO_PEDIDOS,
			datos,
			{ responseType: "blob" }
		);
		const header = response.headers["content-disposition"];
		let fileName = "pedido.xlsx";

		if (header) {
			const match = header.match(/filename="?([^"]+)"?/);
			if (match && match[1]) {
				fileName = match[1];
			}
		}
		const blob = new Blob([response.data], {
			type:
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", fileName);
		document.body.appendChild(link);
		link.click();
		link.remove();

		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Error al exportar el pedido:", error);
		throw new Error(
			error?.response?.data?.mensaje || "Error al exportar el pedido"
		);
	}
};


export const exportarPedido = async (pedidoId, formato = "excel") => {
	try {
		const response = await axios.post(
			EXPORTAR_PEDIDO,
			{ id: pedidoId, formato }, // Enviamos el formato al backend
			{ responseType: "blob" }
		);

		const header = response.headers["content-disposition"];
		const extension = formato === "pdf" ? "pdf" : "xlsx";
		let fileName = `pedido.${extension}`;

		if (header) {
			const match = header.match(/filename="?([^"]+)"?/);
			if (match && match[1]) {
				fileName = match[1];
			}
		}

		// Determinar el tipo MIME según el formato
		const mimeType = formato === "pdf"
			? "application/pdf"
			: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

		const blob = new Blob([response.data], { type: mimeType });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", fileName);
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Error al exportar el pedido:", error);
		throw new Error(
			error?.response?.data?.mensaje || "Error al exportar el pedido"
		);
	}
};

// Mantener esta función por compatibilidad, pero ahora llama a exportarPedido
export const exportarPedidoPdf = async (pedidoId) => {
	return exportarPedido(pedidoId, "pdf");
};
