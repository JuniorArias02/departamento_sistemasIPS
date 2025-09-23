import axios from "axios";
import { LISTAR_SEDES, LISTAR_DEPENDENCIAS_SEDES } from "../const/endpoint/sede_endpoint";

export const listarSedes = async () => {
  try {
    const response = await axios.get(LISTAR_SEDES);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje ||
      "Error al listar  las Sedes",
    );
  }
};

export const listarDependenciasPorSede = async (sedeId) => {
  try {
    const response = await axios.get(`${LISTAR_DEPENDENCIAS_SEDES}?sede_id=${sedeId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.msg || "Error al listar las dependencias de la sede"
    );
  }
};
