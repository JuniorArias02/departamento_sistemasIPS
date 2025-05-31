export const formatearFechas = (data) =>
  data.map(item => ({
    ...item,
    fecha: new Date(item.fecha).toISOString().split("T")[0], // 🔥 Formato: YYYY-MM-DD
  }));
