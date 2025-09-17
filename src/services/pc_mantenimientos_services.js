import axios from "axios";
import { ELIMINAR_ACTA_MANTENIMIENTO, OBTENER_TOTAL_MANTENIMIENTO, SUBIR_FIRMA_MANTENIMIENTO, CREAR_MANTENIMIENTO_PC, LISTAR_MANTENIMIENTO } from "../const/endpoint/pc_equipo_endpoint";


export const eliminarMantenimientoId = async (id, usuario_id) => {
	try {
		const response = await axios.delete(ELIMINAR_ACTA_MANTENIMIENTO, {
			data: { id, usuario_id },
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error al eliminar mantenimiento:", error);
		return { status: false, message: "Fallo en la petición" };
	}
};


export const listarMantenimiento = async () => {
	try {
		const response = await axios.get(LISTAR_MANTENIMIENTO);
		return response.data;
	} catch (error) {
		console.error(error)
		return { status: "error" };
	}
}

export const obtenerTotalMantenimiento = async () => {
	try {
		const response = await axios.post(OBTENER_TOTAL_MANTENIMIENTO);
		return response.data;
	} catch (error) {
		console.error('Error al obtener total mantenimiento', error);
		return { status: false, total: 0 };
	}
};


export const subirFirmaMantenimientoPC = async (formData) => {
	try {
		const response = await axios.post(SUBIR_FIRMA_MANTENIMIENTO, formData, {
			headers: {
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error al subir la firma", error);
		return { status: false, message: "Fallo en la petición" };
	}
};


export const crearMantenimientoPC = async (data) => {
	try {
		const response = await axios.post(CREAR_MANTENIMIENTO_PC, data, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error al crear mantenimiento", error);
		return { status: false, message: "Fallo en la petición" };
	}
};