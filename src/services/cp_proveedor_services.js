import axios from "axios";
import {
  CREAR_PROVEEDOR,
  EDITAR_PROVEEDOR,
  LISTAR_PROVEEDORES,
  BUSCAR_PROVEEDOR,
  ELIMINAR_PROVEEDOR
} from "../const/endpoint/cp_proveedor_endpoint";


export const eliminarProveedor = async (id) => {
  try {
    const response = await axios.delete(ELIMINAR_PROVEEDOR, {
      data: { id } 
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar proveedor", error);
    return { success: false };
  }
};


export const obtenerProveedores = async () => {
  try {
    const response = await axios.get(LISTAR_PROVEEDORES);
    return response.data;
  } catch (error) {
    console.error("Error al obtener proveedores", error);
    return [];
  }
};

export const crearProveedor = async (form) => {
  try {
    const response = await axios.post(CREAR_PROVEEDOR, form);
    return response.data;
  } catch (error) {
    console.error("Error al crear proveedor", error);
    return { success: false };
  }
};


export const editarProveedor = async (form) => {
  try {
    const response = await axios.put(EDITAR_PROVEEDOR, form);
    return response.data;
  } catch (error) {
    console.error("Error al editar proveedor", error);
    return { success: false };
  }
};


export const buscarProveedor = async (search) => {
  try {
    const res = await axios.post(BUSCAR_PROVEEDOR, {
      search 
    });

    if (res.data.success) {
      return res.data.data;
    } else {
      console.warn(res.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error al buscar proveedor:", error);
    return [];
  }
};