import axios from "axios";
import { CREAR_ACTA_ENTREGA, OBTENER_TOTAL_ENTREGA, ACTUALIZAR_FIRMAS, DEVOLVER_EQUIPO } from "../const/endpoint/pc_equipo_endpoint";


export const crearActaEntrega = async (formData) => {
	try {
		const response = await axios.post(CREAR_ACTA_ENTREGA, formData, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error al crear acta de entrega", error);
		return { status: false, message: "Fallo en la petición" };
	}
};


export const obtenerTotalEntrega = async () => {
	try {
		const response = await axios.post(OBTENER_TOTAL_ENTREGA);
		return response.data;
	} catch (error) {
		console.error('Error al obtener total de entrega', error);
		return { status: false, total: 0 }; 
	}
};

export const devolverEquipo = async (formData) => {
	try {
		const response = await axios.post(DEVOLVER_EQUIPO, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error al devolver equipo", error);
		return {
			ok: false,
			message: error?.response?.data?.error || "Fallo en la petición",
		};
	}
};
