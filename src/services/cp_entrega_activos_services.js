import axios from "axios";
import { DESCARGAR_ENTREGA_ACTIVOS, OBTENER_INVENTARIO_COORDINADOR, GUARDAR_ITEMS_ENTREGA, OBTENER_ENTREGA_ACTIVOS_ID, SUBIR_ITEM_ENTREGA, SUBIR_FIRMA_ENTREGA_ACTIVOS, CREAR_ENTREGA_ACTIVOS, OBTENER_ENTREGA_ACTIVOS } from "../const/endpoint/cp_entrega_activos__endpoint";

export const exportarInformeEntregaActivos = async (datos) => {
	try {
		const response = await axios.get(DESCARGAR_ENTREGA_ACTIVOS, {
			params: datos, // 👈 aquí van tus datos, ej: { id: 6 }
			responseType: "blob",
		});

		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "plantilla_entrega_activos_fijos.xlsx");
		document.body.appendChild(link);
		link.click();
		link.remove();
	} catch (error) {
		console.error("Error al crear informe", error);
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

export const buscarInventarioEntrega = async (coordinador_id, sede_id, dependencia_id) => {
	try {
		const data = {
			coordinador_id,
			sede_id,
			dependencia_id
		};
		const response = await axios.post(OBTENER_INVENTARIO_COORDINADOR, data);
		console.log("buscar invnetairo por3 filtros" , response);
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


