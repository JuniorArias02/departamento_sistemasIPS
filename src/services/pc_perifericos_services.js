import axios from 'axios';
import { BUSCAR_PERIFERICOS } from '../const/endpoint/pc_equipo_endpoint';

export const buscarPerifericoo = async (termino) => {
	try {
		const response = await axios.get(BUSCAR_PERIFERICO, {
			params: { buscar: termino }
		});
		return response.data.data;
	} catch (error) {
		console.error('Error al encontrar periférico', error);
		return [];
	}
};

export const buscarPerifericos = async (query) => {
	if (!query || query.trim().length < 2) {
		return { success: true, resultados: [] };
	}
	try {
		const res = await axios.get(`${BUSCAR_PERIFERICOS}?query=${encodeURIComponent(query)}`);
		return res.data;
	} catch (error) {
		console.error("Error al buscar equipo:", error);
		return { success: false, resultados: [] };
	}
};

