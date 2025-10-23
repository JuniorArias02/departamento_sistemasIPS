import axios from "axios";
import { LISTAR_CENTROS_COSTO } from "../const/endpoint/cp_centro_costo.js";

export const listarCentrosCosto = async () => {
	try {
		const response = await axios.get(LISTAR_CENTROS_COSTO);
		return response.data;
	} catch (error) {
		console.error("Error al listar centros de costo:", error);
		return { status: false };
	}
};
