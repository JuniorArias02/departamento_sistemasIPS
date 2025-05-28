import axios from "axios";
import { LISTAR_ROL } from "../const/url";

export const listarRoles = async () => {
  try {
    const response = await axios.get(LISTAR_ROL);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.mensaje ||
        "Error al listar  las roles",
    );
  }
};