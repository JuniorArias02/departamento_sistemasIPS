// ChartPorUsuario.jsx
import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Brush
} from "recharts";

export const ChartPorUsuario = ({ data, title }) => {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const dataFiltrada = data.filter(item => {
    if (!desde && !hasta) return true;
    const fecha = new Date(item.fecha);
    const fDesde = desde ? new Date(desde) : null;
    const fHasta = hasta ? new Date(hasta) : null;
    return (!fDesde || fecha >= fDesde) && (!fHasta || fecha <= fHasta);
  }).map(item => ({
    ...item,
    fecha: new Date(item.fecha).toISOString().split("T")[0],
  }));

  const usuarios = [...new Set(dataFiltrada.map(d => d.nombre_completo))];
  const fechasUnicas = [...new Set(dataFiltrada.map(d => d.fecha))].sort();

  const dataPivoteada = fechasUnicas.map(fecha => {
    const item = { fecha };
    usuarios.forEach(usuario => {
      const registro = dataFiltrada.find(d => d.fecha === fecha && d.nombre_completo === usuario);
      item[usuario] = registro ? registro.total : null;
    });
    return item;
  });

  const colors = ["#8884d8", "#82ca9d", "#ff7300", "#ff4d6d", "#00bcd4", "#ff4081", "#4caf50"];

  return (
    <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 w-full max-w-5xl mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">{title}</h2>

      {/* Filtros de fecha responsive */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-4 mb-4 w-full">
        <label className="text-sm font-medium flex flex-col sm:flex-row items-start sm:items-center">
          Desde:
          <input
            type="date"
            value={desde}
            onChange={e => setDesde(e.target.value)}
            className="border rounded px-2 py-1 mt-1 sm:mt-0 sm:ml-2"
          />
        </label>
        <label className="text-sm font-medium flex flex-col sm:flex-row items-start sm:items-center">
          Hasta:
          <input
            type="date"
            value={hasta}
            onChange={e => setHasta(e.target.value)}
            className="border rounded px-2 py-1 mt-1 sm:mt-0 sm:ml-2"
          />
        </label>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dataPivoteada} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" type="category" />
          <YAxis />
          <Tooltip
            labelFormatter={label =>
              new Date(label).toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            }
          />
          <Legend />
          {usuarios.map((usuario, index) => (
            <Line
              key={usuario}
              type="monotone"
              dataKey={usuario}
              stroke={colors[index % colors.length]}
              dot={false}
              connectNulls
              animationDuration={1500}
            />
          ))}
          <Brush dataKey="fecha" height={30} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
};
