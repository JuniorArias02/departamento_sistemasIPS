import axios from "axios";
import { BUSCAR_DEPENDENCIA_SEDE } from "../const/endpoint/cp_dependencias.js";

export const buscarDependenciaSede = async (sedeId) => {
	try {
		const response = await axios.get(BUSCAR_DEPENDENCIA_SEDE, {
			params: {
				sede_id: sedeId
			}
		});
		return response.data;
	} catch (error) {
		console.error("Error al buscar dependencia por sede:", error);
		return { status: false };
	}
};
