import axios from "axios";
import { CREAR_PEDIDO, SUBIR_FIRMA, OBTENER_PEDIDOS, RECHAZAR_PEDIDO, APROBAR_PEDIDO } from "../const/endpoint/cp_pedidos/cp_pedidos_endpoint";

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


export const crearPedido = async (datos) => {
	try {
		const response = await axios.post(CREAR_PEDIDO, datos);
		return response.data;
	} catch (error) {
		console.error('Error al crear pedido', error);
		return [];
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
		const { data } = await axios.post(OBTENER_PEDIDOS,datos);
		return data;
	} catch (error) {
		console.error("Error en obtenerPedidos:", error);
		throw new Error(
			error?.response?.data?.error || "Error al listar los pedidos"
		);
	}
};
