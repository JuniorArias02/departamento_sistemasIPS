import axios from "axios";
import { OBTENER_TOTAL_MANTENIMIENTO } from "../const/endpoint/pc_equipos/pc_equipo_endpoint";


export const obtenerTotalMantenimiento = async () => {
	try {
		const response = await axios.post(OBTENER_TOTAL_MANTENIMIENTO);
		return response.data;
	} catch (error) {
		console.error('Error al obtener total mantenimiento', error);
		return { status: false, total: 0 };
	}
};