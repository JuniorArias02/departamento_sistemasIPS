import axios from "axios";
import { LISTAR_COORDINADORES,ACTIVIDADES_RECIENTES } from "../const/endpoint/utils/utils_endpoint";

export const listarCoordinadores = async () => {
	try {
		const response = await axios.get(LISTAR_COORDINADORES);
		return response.data;
	} catch (error) {
		throw new Error(
			error?.response?.data?.mensaje ||
			"Error al listar los coordinadores",
		);
	}
};

export const obtenerActividadesRecientes = async () => {
	const res = await axios.get(ACTIVIDADES_RECIENTES);
	return res.data;
};