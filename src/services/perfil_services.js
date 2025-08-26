import axios from "axios";
import { EDITAR_PERFIL, MI_PERFIL, ACTUALIZAR_CONTRASENA, SUBIR_FIRMA } from "../const/endpoint/usuario/perfil/perfil_endpoint";




export const subirFirmaPerfil = async (formData) => {
	try {
		const response = await axios.post(SUBIR_FIRMA, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error al subir la firma", error);
		return { status: false, message: "Fallo en la petición" };
	}
};



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


export const cambiarContrasena = async (datos) => {
	try {
		// Validación básica antes de enviar la petición
		if (!datos.id || !datos.current_password) {
			throw new Error('Se requiere ID de usuario y contraseña actual');
		}

		if (datos.new_password && datos.new_password.length < 8) {
			throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
		}

		if (datos.new_password !== datos.confirm_password) {
			throw new Error('Las contraseñas nuevas no coinciden');
		}

		const { data } = await axios.post(ACTUALIZAR_CONTRASENA, {
			id: datos.id,
			current_password: datos.current_password,
			...(datos.new_password && {
				new_password: datos.new_password,
				confirm_password: datos.confirm_password
			})
		});

		if (!data.success) {
			throw new Error(data.message || 'Error al cambiar la contraseña');
		}

		return {
			success: true,
			message: data.message,
			data: data.data || null
		};

	} catch (error) {
		const errorMessage = error.response?.data?.message
			|| error.message
			|| 'Error desconocido al cambiar la contraseña';
		throw new Error(errorMessage);
	}
};