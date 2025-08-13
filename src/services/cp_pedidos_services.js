import axios from "axios";
import { CREAR_PEDIDO, SUBIR_FIRMA, OBTENER_PEDIDOS } from "../const/endpoint/cp_pedidos/cp_pedidos_endpoint";

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

export const obtenerPedidos = async () => {
	try {
		const { data } = await axios.get(OBTENER_PEDIDOS);
		return data;
	} catch (error) {
		console.error("Error en obtenerPedidos:", error);
		throw new Error(
			error?.response?.data?.error || "Error al listar los pedidos"
		);
	}
};
