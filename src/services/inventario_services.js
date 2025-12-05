import axios from "axios";
import {
  CREAR_INVENTARIO,
  ELIMINAR_INVENTARIO,
  LISTAR_INVENTARIO,
  EXPORTAR_INVENTARIO,
  BUSCAR_INVENTARIO,
  EXPORTAR_INVENTARIO_JSON,
  GRAFICA_INVENTARIO,
  CONTAR_INVENTARIO,
  BUSCAR_INVENTARIO_ITEM,
  SUBIR_ADJUNTO,
  BUSCAR_PRODUCTO_SERVICIO,
  BUSCAR_PRODUCTO_CODIGO

} from "../const/endpoint/inventario_endpoint";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const subirAdjunto = async (inventarioId, archivo) => {
  try {
    const formData = new FormData();
    formData.append("inventario_id", inventarioId);
    formData.append("archivo", archivo);

    const response = await axios.post(SUBIR_ADJUNTO, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al subir adjunto:", error);
    throw new Error(
      error?.response?.data?.message || "Error al subir el adjunto"
    );
  }
};

export const buscarItemInventario = async (termino) => {
  try {
    const response = await axios.get(BUSCAR_INVENTARIO_ITEM, {
      params: { q: termino }
    });
    return response.data;
  } catch (error) {
    console.error("Error al buscar inventario:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al buscar el inventario"
    );
  }
};

export async function buscarProductoServicio(query) {
  try {
    const res = await axios.get(`${BUSCAR_PRODUCTO_SERVICIO}?query=${encodeURIComponent(query)}`);

    if (res.data.success && Array.isArray(res.data.resultados)) {
      return res.data.resultados;
    }

    return [];

  } catch (error) {
    console.error("Error buscando producto:", error);
    return [];
  }
}


export async function buscarProductoServicioCodigo(query) {
  try {
    const res = await axios.get(
      `${BUSCAR_PRODUCTO_CODIGO}?q=${encodeURIComponent(query)}`
    );

    if (res.data.success && Array.isArray(res.data.data)) {
      return res.data.data; 
    }

    return [];

  } catch (error) {
    console.error("Error buscando producto:", error);
    return [];
  }
}




export const crearInventario = async (datos) => {
  try {
    const response = await axios.post(CREAR_INVENTARIO, datos);
    return response.data;
  } catch (error) {
    console.error("Error al crear inventario:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el inventario",
    );
  }
};

export const actualizarInventario = async (id, datos) => {
  try {
    const response = await axios.post(CREAR_INVENTARIO, { id, ...datos });
    return response.data;
  } catch (error) {
    console.error("Error al crear inventario:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al crear el inventario",
    );
  }
};

export const listarInventarios = async (usuarioId) => {
  try {
    const response = await axios.post(LISTAR_INVENTARIO, {
      creado_por: usuarioId
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Error al listar los inventario"
    );
  }
};


export const buscarInventario = async (filtros) => {
  try {
    const response = await axios.post(BUSCAR_INVENTARIO, filtros);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.error || "Error al buscar el inventario"
    );
  }
};

export const eliminarInventario = async (id_inventario, id_usuario) => {
  try {
    const response = await axios.post(ELIMINAR_INVENTARIO, {
      id: id_inventario,
      creado_por: id_usuario
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Error al eliminar el inventario"
    );
  }
};


export const obtenerGraficaInventario = async (id) => {
  const res = await axios.post(GRAFICA_INVENTARIO, {
    id_usuario: id
  });
  return res.data;
};


export const obtenerTotalInventario = async () => {
  const res = await axios.get(CONTAR_INVENTARIO);
  return res.data.total;
};


export const exportarInventarios = async () => {
  try {
    const response = await axios.get(EXPORTAR_INVENTARIO, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "inventarios.xlsx"); // nombre del archivo
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true; // o lo que quieras devolver
  } catch (error) {
    console.error("Error al exportar los inventario:", error);
    throw new Error(
      error?.response?.data?.mensaje || "Error al exportar los inventario",
    );
  }
};

// json_exportar_inventario.php
export const exportarInventariosCliente = async () => {
  try {
    const response = await axios.get(EXPORTAR_INVENTARIO_JSON);
    const inventarios = response.data;

    const calcularAnchos = (data) => {
      const anchos = [];
      data.forEach(row => {
        Object.values(row).forEach((valor, i) => {
          const len = valor ? valor.toString().length : 10;
          anchos[i] = Math.max(anchos[i] || 10, len);
        });
      });
      return anchos.map(w => ({ wch: w + 2 }));
    };

    // Luego en tu función exportar:
    const datosFormateados = inventarios.map(item => ({
      "ID": item.id,
      "Codigo": item.codigo,
      "Nombre": item.nombre,
      "Dependencia": item.dependencia,
      "Responsable": item.responsable,
      "Marca": item.marca,
      "Modelo": item.modelo,
      "Serial": item.serial,
      "Sede": item.sede,
      "Creado Por": item.creado_por,
      "Fecha Creacion": item.fecha_creacion
    }));

    const hoja = XLSX.utils.json_to_sheet(datosFormateados);
    hoja['!cols'] = calcularAnchos(datosFormateados);

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Inventario");

    const buffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "inventario.xlsx");

    console.log("Excel exportado correctamente.");
  } catch (error) {
    console.error("Error exportando desde el cliente:", error);
  }
};
