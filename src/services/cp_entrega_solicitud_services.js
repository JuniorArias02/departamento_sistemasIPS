import axios from "axios";
import {
	CREAR_ENTREGA_SOLICITUD,
	SUBIR_FIRMA,
	OBTENER_ENTREGA_SOLICITUD,
	EXPORTAR_INFORME_ENTREGA_SOLICITUD
} from "../const/endpoint/cp_entrega_solicitud_endpoint.js";

export const crearEntregaSolicitud = async (form) => {
	try {
		const response = await axios.post(CREAR_ENTREGA_SOLICITUD, form);
		return response.data;
	} catch (error) {
		console.error("Error al crear entrega", error);
		return { success: false };
	}
};


export const subirFirmaEntrega = async (formData) => {
	try {
		const response = await axios.post(SUBIR_FIRMA, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return response.data;
	} catch (error) {
		console.error("Error al subir firma", error);
		return { success: false };
	}
};

export const obtenerEntregaSolicitud = async () => {
	try {
		const response = await axios.get(OBTENER_ENTREGA_SOLICITUD);
		return response.data;
	} catch (error) {
		console.error("Error al obtener entregas:", error);
		return { success: false, error: error.message };
	}
};

export const exportarInformeEntregaSolicitudes = async (datos) => {
	try {
		const response = await axios.post(EXPORTAR_INFORME_ENTREGA_SOLICITUD, datos, {
			responseType: "blob",
		});


		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "control_entrega_solicitudes_pedidos.xlsx");
		document.body.appendChild(link);
		link.click();
		link.remove();
	} catch (error) {
		console.error("Error al crear informe", error);
	}
};
