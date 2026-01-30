import axios from "axios";
import { DESCARGAR_ENTREGA_ACTIVOS, OBTENER_INVENTARIO_COORDINADOR, GUARDAR_ITEMS_ENTREGA, OBTENER_ENTREGA_ACTIVOS_ID, SUBIR_ITEM_ENTREGA, SUBIR_FIRMA_ENTREGA_ACTIVOS, CREAR_ENTREGA_ACTIVOS, OBTENER_ENTREGA_ACTIVOS, ELIMINAR_ENTREGA_ACTIVOS } from "../const/endpoint/cp_entrega_activos__endpoint";

export const exportarInformeEntregaActivos = async (datos, formato = "excel") => {
	try {
		const response = await axios.get(DESCARGAR_ENTREGA_ACTIVOS, {
			params: { ...datos, formato }, // 👈 aquí van tus datos, ej: { id: 6, formato: 'excel' }
			responseType: "blob",
		});

		const extension = formato === "pdf" ? "pdf" : "xlsx";
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", `plantilla_entrega_activos_fijos.${extension}`);
		document.body.appendChild(link);
		link.click();
		link.remove();
	} catch (error) {
		console.error("Error al crear informe", error);
		throw error;
	}
};

export const listarEntregasActivos = async () => {
	try {
		const response = await axios.get(OBTENER_ENTREGA_ACTIVOS);
		return response.data;
	} catch (error) {
		console.error("Error al obtener entregas de activos", error);
		return { ok: false, data: [] };
	}
};

export const buscarInventarioEntrega = async (responsable_id, coordinador_id, dependencia_id) => {
	try {
		const data = {
			coordinador_id,
			responsable_id,
			dependencia_id
		};

		const response = await axios.post(OBTENER_INVENTARIO_COORDINADOR, data);
		return response.data;

	} catch (error) {
		console.error("Error al buscar inventario", error);
		return { success: false };
	}
};



export const subirItemsEntrega = async (data) => {
	try {
		const response = await axios.post(SUBIR_ITEM_ENTREGA, data);
		return response.data;
	} catch (error) {
		console.error("Error al subir items de entrega", error);
		return { success: false };
	}
};

export const guardarItemsEntrega = async (entrega_activos_id, items) => {
	try {
		const data = {
			entrega_activos_id,
			items,
		};

		const response = await axios.post(GUARDAR_ITEMS_ENTREGA, data);
		return response.data;
	} catch (error) {
		console.error("Error al guardar items de entrega", error);
		return { success: false };
	}
};


export const crearEntregaActivos = async (form) => {
	try {
		const response = await axios.post(CREAR_ENTREGA_ACTIVOS, form);
		return response.data;
	} catch (error) {
		console.error("Error al crear entrega", error);
		return { success: false };
	}
};

export const guardarEntregaActivos = async (form) => {
	try {
		const response = await axios.post(CREAR_ENTREGA_ACTIVOS, form);
		return response.data; // { ok, id, message }
	} catch (error) {
		console.error("Error al guardar entrega", error);
		return { ok: false, error: "No se pudo conectar con el servidor" };
	}
};

export const subirFirmaActa = async (formData) => {
	try {
		const response = await axios.post(SUBIR_FIRMA_ENTREGA_ACTIVOS, formData);
		return response.data;
	} catch (error) {
		console.error("Error al subir la firma", error);
		return { status: false, message: "Fallo en la petición" };
	}
};

export const cargarItemsEntrega = async (entrega_activos_id) => {
	try {
		const response = await axios.get(OBTENER_ENTREGA_ACTIVOS_ID, {
			params: { entrega_activos_id }
		});
		return response.data;
	} catch (error) {
		console.error("Error al cargar items de entrega", error);
		return { ok: false, data: [] };
	}
};

export const eliminarEntregaActivos = async (entrega_id) => {
	try {
		const response = await axios.post(ELIMINAR_ENTREGA_ACTIVOS, { id: entrega_id });
		return response.data;
	} catch (error) {
		console.error("Error al eliminar entrega de activos", error);
		return { ok: false, mensaje: "Error al eliminar la entrega" };
	}
};

