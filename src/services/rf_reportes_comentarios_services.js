import axios from "axios";
import { CREAR_COMENTARIO, OBTENER_COMENTARIO } from "../const/endpoint/rf_reportes_comentarios_endpoint";

export const crearComentario = async (datos) => {
	try {
		const response = await axios.post(CREAR_COMENTARIO, datos);
		return response.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message || "Error al crear nuevo comentario"
		);
	}
};


export const obtenerComentarios = async (datos) => {
	try {
		const response = await axios.post(OBTENER_COMENTARIO, datos);
		return response.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.message || "Error al obtener los comentarios"
		);
	}
};
