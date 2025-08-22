import axios from 'axios';
import { BUSCAR_PERIFERICO } from '../const/endpoint/pc_equipo_endpoint';

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