import axios from 'axios';
import { OBTENER_PERMISOS } from '../const/endpoint/rol/permisos/permisos_endpoint';

export const obtenerPermisos = async (usuarioId) => {
	try {
		const response = await axios.post(OBTENER_PERMISOS, {
			usuario_id: usuarioId,
		});
		console.log('Permisos obtenidos:', response.data);
		const permisos = response.data.permisos;
		return permisos;
	} catch (error) {
		console.error('Error al obtener permisos', error);
		return [];
	}
};
