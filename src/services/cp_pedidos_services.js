import axios from "axios";
import { EXPORTAR_INFORME_PEDIDOS, OBTENER_CONSOLIDADO_PEDIDOS, CREAR_PEDIDO, SUBIR_FIRMA, OBTENER_PEDIDOS, RECHAZAR_PEDIDO, APROBAR_PEDIDO, EXPORTAR_PEDIDO, EXPORTAR_PDF } from "../const/endpoint/cp_pedidos_endpoint";





export const obtenerConsolidadoPedidos = async () => {
	try {
	  const { data } = await axios.get(OBTENER_CONSOLIDADO_PEDIDOS);
	  return data;
	} catch (error) {
	  console.error("Error en obtenerConsolidadoPedidos:", error);
	  throw new Error(
		error?.response?.data?.error || "Error al listar los pedidos"
	  );
	}
  };
  

export const subirFirmaPedido = async (formData) => {
	try {
		const response = await axios.post(SUBIR_FIRMA, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error al subir la firma", error);
		return { status: false, message: "Fallo en la petición" };
	}
};


export const crearPedido = async (datos) => {
	try {
		const response = await axios.post(CREAR_PEDIDO, datos);
		return response.data;
	} catch (error) {
		console.error('Error al crear pedido', error);
		return [];
	}
};

export const exportarInformeFecha = async (datos) => {
	try {
		const response = await axios.post(EXPORTAR_INFORME_PEDIDOS, datos, {
			responseType: "blob",
		});


		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "consolidado_pedidos.xlsx");
		document.body.appendChild(link);
		link.click();
		link.remove();
	} catch (error) {
		console.error("Error al crear informe", error);
	}
};

export const rechazarPedido = async (datos) => {
	try {
		const response = await axios.post(RECHAZAR_PEDIDO, datos);
		return response.data;
	} catch (error) {
		console.error('Error al rechazar pedido', error);
		throw error;
	}
};

export const aprobarPedido = async (datos) => {
	try {
		const { data } = await axios.post(APROBAR_PEDIDO, datos);
		return data;
	} catch (error) {
		console.error('Error al aprobar pedido', error.response?.data || error.message);
		throw error.response?.data || error;
	}
};


export const obtenerPedidos = async (datos) => {
	try {
		const { data } = await axios.post(OBTENER_PEDIDOS, datos);
		return data;
	} catch (error) {
		console.error("Error en obtenerPedidos:", error);
		throw new Error(
			error?.response?.data?.error || "Error al listar los pedidos"
		);
	}
};


export const exportarPedido = async (pedidoId) => {
	try {
		const response = await axios.post(
			EXPORTAR_PEDIDO,
			{ id: pedidoId },
			{ responseType: "blob" }
		);
		const header = response.headers["content-disposition"];
		let fileName = "pedido.xlsx";

		if (header) {
			const match = header.match(/filename="?([^"]+)"?/);
			if (match && match[1]) {
				fileName = match[1];
			}
		}
		const blob = new Blob([response.data], {
			type:
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", fileName);
		document.body.appendChild(link);
		link.click();
		link.remove();

		window.URL.revokeObjectURL(url);
	} catch (error) {
		console.error("Error al exportar el pedido:", error);
		throw new Error(
			error?.response?.data?.mensaje || "Error al exportar el pedido"
		);
	}
};


export const exportarPedidoPdf = async (pedidoId) => {
	try {
		const response = await axios.post(
			EXPORTAR_PDF,
			{ id: pedidoId },
			{ responseType: "blob" }
		);

		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "pedido.pdf");
		document.body.appendChild(link);
		link.click();
		link.remove();

		return true;
	} catch (error) {
		console.error("Error al exportar el pedido:", error);
		throw new Error(
			error?.response?.data?.mensaje || "Error al exportar el pedido"
		);
	}
};
