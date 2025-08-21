import axios from "axios";
import { OBTENER_AREAS_POR_SEDE, CREAR_AREA } from "../const/endpoint/areas_endpoint";


export const obtenerAreaPorSede = async (datos) => {
	try {
		const response = await axios.post(OBTENER_AREAS_POR_SEDE, datos);
		return response.data;
	} catch (error) {
		console.error('Error al obtener areas ', error);
		return { status: false, data: [] };
	}
};

export const crearArea = async (datos) => {
	try {
		const response = await axios.post(CREAR_AREA, datos);
		return response;
	} catch (error) {
		console.error('Error al crear area', error);
		return [];
	}
};