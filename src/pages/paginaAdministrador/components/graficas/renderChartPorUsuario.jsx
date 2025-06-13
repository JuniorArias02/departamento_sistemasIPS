// ChartPorUsuario.jsx
import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Brush
} from "recharts";

export const ChartPorUsuario = ({ data, title }) => {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  // Función para normalizar fechas a objetos Date en zona Colombia
  const normalizarFecha = (fechaStr) => {
    const [year, month, day] = fechaStr.split('-').map(Number);
    return new Date(year, month - 1, day); // Se mantiene local
  };

  const dataFiltrada = data.filter(item => {
    const fechaItem = normalizarFecha(item.fecha);
    const fDesde = desde ? normalizarFecha(desde) : null;
    const fHasta = hasta ? normalizarFecha(hasta) : null;

    return (!fDesde || fechaItem >= fDesde) && (!fHasta || fechaItem <= fHasta);
  }).map(item => ({
    ...item,
    fecha: item.fecha,
    total: Number(item.total)
  }));

  const usuarios = [...new Set(dataFiltrada.map(d => d.nombre_completo))];

  const fechasUnicas = [...new Set(dataFiltrada.map(d => d.fecha))]
    .sort((a, b) => normalizarFecha(a) - normalizarFecha(b));

  const dataPivoteada = fechasUnicas.map(fecha => {
    const item = { fecha };
    usuarios.forEach(usuario => {
      const registro = dataFiltrada.find(d =>
        d.fecha === fecha && d.nombre_completo === usuario
      );
      item[usuario] = registro ? registro.total : null;
    });
    return item;
  });

  const colors = ["#8884d8", "#82ca9d", "#ff7300", "#ff4d6d", "#00bcd4", "#ff4081", "#4caf50"];

  return (
    <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 w-full max-w-5xl mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">{title}</h2>

      {/* Filtros de fecha responsive */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-4 mb-4 w-full max-w-md mx-auto">
        <label className="text-sm font-medium flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto">
          Desde:
          <input
            type="date"
            value={desde}
            onChange={e => setDesde(e.target.value)}
            className="border rounded px-2 py-1 mt-1 sm:mt-0 sm:ml-2 w-full sm:w-auto"
          />
        </label>
        <label className="text-sm font-medium flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto">
          Hasta:
          <input
            type="date"
            value={hasta}
            onChange={e => setHasta(e.target.value)}
            className="border rounded px-2 py-1 mt-1 sm:mt-0 sm:ml-2 w-full sm:w-auto"
          />
        </label>
      </div>

      <div className="w-full" style={{ minHeight: 300, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dataPivoteada}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="fecha"
              tickFormatter={(fecha) => {
                const [year, month, day] = fecha.split('-');
                return `${day}/${month}`;
              }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={fecha => {
                const [year, month, day] = fecha.split('-');
                return `${day}/${month}/${year}`;
              }}
              formatter={(value) => [`${value} unidades`, value]}
            />
            <Legend />
            {usuarios.map((usuario, index) => (
              <Line
                key={usuario}
                type="monotone"
                dataKey={usuario}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls
                animationDuration={1000}
              />
            ))}
            <Brush
              dataKey="fecha"
              height={30}
              stroke="#8884d8"
              tickFormatter={(fecha) => {
                const [year, month, day] = fecha.split('-');
                return `${day}/${month}`;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};