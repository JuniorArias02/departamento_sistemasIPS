import axios from "axios";
import { CREAR_ACTA_ENTREGA, OBTENER_TOTAL_ENTREGA } from "../const/endpoint/pc_equipo_endpoint";


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