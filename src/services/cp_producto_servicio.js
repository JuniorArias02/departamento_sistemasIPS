import { CREAR_PRODUCTO_SERVICIO } from "../const/endpoint/cp_productos_servicios";
import axios from "axios";


export const crearProductoServicio = async (data) => {
    try {
        const response = await axios.post(CREAR_PRODUCTO_SERVICIO, data);
        return response.data;
    } catch (error) {
        console.error("Error al crear producto/servicio:", error);
        if (error.response?.data) {
            return error.response.data;
        }

        return {
            success: false,
            error: error.message || "Error al crear el producto/servicio"
        };
    }
};