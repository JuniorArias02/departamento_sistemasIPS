import axios from "axios";
import { EDITAR_PERFIL, MI_PERFIL } from "../const/endpoint/usuario/perfil/perfil_endpoint";

export const obtenerMiPerfil = async (id) => {
	try {
		const { data } = await axios.post(MI_PERFIL, { id });

		if (!data.success) {
			throw new Error(data.message || 'Error al obtener el perfil');
		}

		return data.data;
	} catch (error) {
		const errorMessage = error.response?.data?.message
			|| error.message
			|| 'Error desconocido al obtener el perfil';

		throw new Error(errorMessage);
	}
};

export const editarMiPerfil = async (datos) => {
	try {
		const { data } = await axios.post(EDITAR_PERFIL, datos);

		if (!data.success) {
			throw new Error(data.message || 'Error al editar el perfil');
		}

		return data.message;
	} catch (error) {
		const errorMessage = error.response?.data?.message
			|| error.message
			|| 'Error desconocido al editar el perfil';

		throw new Error(errorMessage);
	}
};
