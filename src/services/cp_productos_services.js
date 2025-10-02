import axios from "axios";
import { BUSCAR_PRODUCTO_CODIGO } from "../const/cp_productos";

export const buscarProductoPorCodigo = async (codigo) => {
	try {
		const response = await axios.get(BUSCAR_PRODUCTO_CODIGO, {
			params: { codigo }
		});
		return response.data;
	} catch (error) {
		console.error("Error al buscar producto por código:", error);
		throw error;
	}
};
