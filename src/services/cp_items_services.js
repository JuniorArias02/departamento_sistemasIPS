import axios from "axios";
import { CREAR_ITEMS } from "../const/endpoint/cp_items_endpoint";


export const crearItems = async (items) => {
  try {
    const response = await axios.post(CREAR_ITEMS, items);
    return response.data;
  } catch (error) {
    console.error('Error al crear pedido', error);
    return {status: false, message: 'Error en la conexión'};
  }
};