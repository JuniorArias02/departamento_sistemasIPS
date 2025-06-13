export const formatearFechas = (data) =>
  data.map(item => {
    const fechaStr = item.fecha.split("T")[0]; // solo agarra "2025-06-12"
    return {
      ...item,
      fecha: fechaStr,
    };
  });
