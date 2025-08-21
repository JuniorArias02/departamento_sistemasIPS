import axios from "axios";
import { LISTAR_SEDES } from "../const/endpoint/sede_endpoint";

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