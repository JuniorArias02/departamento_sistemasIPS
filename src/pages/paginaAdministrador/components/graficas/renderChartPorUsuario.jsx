import { useState, useMemo, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Brush
} from "recharts";

export const ChartPorUsuario = ({ data, title, diasFiltro }) => {
  const [brushIndex, setBrushIndex] = useState(null);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [loading, setLoading] = useState(true);

  const normalizarFecha = (fechaStr) => {
    const [year, month, day] = fechaStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const hoy = new Date();
  const fDesde = useMemo(() => {
    if (diasFiltro) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - diasFiltro);
      return fecha;
    }
    return desde ? normalizarFecha(desde) : null;
  }, [diasFiltro, desde]);

  const fHasta = useMemo(() => {
    return diasFiltro ? hoy : (hasta ? normalizarFecha(hasta) : null);
  }, [diasFiltro, hasta]);

  const dataFiltrada = useMemo(() => {
    return data
      .filter(item => {
        const fechaItem = normalizarFecha(item.fecha);
        return (!fDesde || fechaItem >= fDesde) && (!fHasta || fechaItem <= fHasta);
      })
      .map(item => ({
        ...item,
        fecha: item.fecha,
        total: Number(item.total),
      }));
  }, [data, fDesde, fHasta]);

  const usuarios = useMemo(() => [...new Set(dataFiltrada.map(d => d.nombre_completo))], [dataFiltrada]);

  const fechasUnicas = useMemo(() => {
    return [...new Set(dataFiltrada.map(d => d.fecha))].sort((a, b) => normalizarFecha(a) - normalizarFecha(b));
  }, [dataFiltrada]);

  const dataPorFechaYUsuario = useMemo(() => {
    const map = {};
    dataFiltrada.forEach(d => {
      if (!map[d.fecha]) map[d.fecha] = {};
      map[d.fecha][d.nombre_completo] = d.total;
    });
    return map;
  }, [dataFiltrada]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 300); // Espera 300ms mientras procesa (puedes ajustar el tiempo)

    return () => clearTimeout(timeout);
  }, [diasFiltro, desde, hasta]);


  const dataPivoteada = useMemo(() => {
    return fechasUnicas.map(fecha => {
      const item = { fecha };
      usuarios.forEach(usuario => {
        item[usuario] = dataPorFechaYUsuario[fecha]?.[usuario] ?? null;
      });
      return item;
    });
  }, [fechasUnicas, usuarios, dataPorFechaYUsuario]);

  const colors = ["#8884d8", "#82ca9d", "#ff7300", "#ff4d6d", "#00bcd4", "#ff4081", "#4caf50"];

  return (
    <section className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 w-full max-w-5xl mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">{title}</h2>

      {!diasFiltro && (
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
      )}

      <div className="w-full" style={{ minHeight: 300, height: 300 }}>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={dataPivoteada} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" tickFormatter={f => f.split('-').slice(1).reverse().join('/')} />
              <YAxis />
              <Tooltip
                labelFormatter={f => f.split('-').reverse().join('/')}
                formatter={v => [`${v} unidades`, v]}
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
                  animationDuration={500}
                />
              ))}
              <Brush
                dataKey="fecha"
                height={30}
                stroke="#8884d8"
                tickFormatter={f => f.split('-').slice(1).reverse().join('/')}
              />
            </LineChart>
          </ResponsiveContainer>
        )}


      </div>
    </section>
  );
};
