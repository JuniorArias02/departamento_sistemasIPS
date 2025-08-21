import axios from "axios";
import { OBTENER_TIPO_SOLICITUD } from "../const/endpoint/cp_tipo_solicitud";

export const obtenerTiposSolicitud = async () => {
	try {
		const response = await axios.get(OBTENER_TIPO_SOLICITUD);
		return response.data;
	} catch (error) {
		console.error('Error al obtener tipos de solicitud', error);
		return [];
	}
};
