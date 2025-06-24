import { useState, useMemo, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Brush
} from "recharts";
import { motion } from "framer-motion";

export const ChartPorUsuario = ({ data = [], title = "Gráfico por Usuario", diasFiltro }) => {
  // 1. Verificación inicial de datos
  if (!Array.isArray(data)) {
    console.error("Los datos deben ser un array", data);
    return <div className="p-4 text-red-500">Error: Formato de datos incorrecto</div>;
  }

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoveredUser, setHoveredUser] = useState(null);

  // 2. Normalización de datos
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      fecha: item.fecha,
      total: Number(item.total) || 0,
      userId: item.nombre_completo.toLowerCase().replace(/\s+/g, '-')
    }));
  }, [data]);

  // 3. Filtrado por fechas
  const hoy = new Date();
  const fDesde = useMemo(() => {
    if (diasFiltro) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - diasFiltro);
      return fecha;
    }
    return desde ? new Date(desde) : null;
  }, [diasFiltro, desde]);

  const fHasta = useMemo(() => {
    return diasFiltro ? hoy : (hasta ? new Date(hasta) : null);
  }, [diasFiltro, hasta]);

  const filteredData = useMemo(() => {
    return processedData.filter(item => {
      const fechaItem = new Date(item.fecha);
      return (!fDesde || fechaItem >= fDesde) && (!fHasta || fechaItem <= fHasta);
    });
  }, [processedData, fDesde, fHasta]);

  // 4. Extracción de usuarios únicos
  const usuarios = useMemo(() => {
    const uniqueUsers = [];
    const userIds = new Set();

    filteredData.forEach(item => {
      if (!userIds.has(item.userId)) {
        userIds.add(item.userId);
        uniqueUsers.push({
          id: item.userId,
          nombre: item.nombre_completo,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nombre_completo.split(' ')[0])}&background=random`
        });
      }
    });

    return uniqueUsers;
  }, [filteredData]);

  // 5. Preparación de datos para el gráfico
  const chartData = useMemo(() => {
    const dates = [...new Set(filteredData.map(item => item.fecha))].sort((a, b) => 
      new Date(a) - new Date(b)
    );

    const userMap = {};
    usuarios.forEach(user => {
      userMap[user.id] = {};
      filteredData
        .filter(item => item.userId === user.id)
        .forEach(item => {
          userMap[user.id][item.fecha] = item.total;
        });
    });

    return dates.map(date => {
      const item = { fecha: date };
      usuarios.forEach(user => {
        item[user.id] = userMap[user.id][date] || null;
      });
      return item;
    });
  }, [filteredData, usuarios]);

  // 6. Configuración de colores
  const colors = [
    "#6366F1", "#10B981", "#F59E0B", "#EC4899", 
    "#8B5CF6", "#3B82F6", "#EF4444"
  ];

  // 7. Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-medium text-gray-800 mb-2">
          {new Date(label).toLocaleDateString('es-ES')}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            entry.value && (
              <div key={`tooltip-${index}`} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-medium">{entry.value} unidades</span>
              </div>
            )
          ))}
        </div>
      </div>
    );
  };

  // 8. Efecto de carga
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [data, diasFiltro, desde, hasta]);

  // 9. Renderizado condicional
  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="text-gray-500">No hay datos disponibles para el rango seleccionado</p>
      </div>
    );
  }

  // 10. Renderizado principal
  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {!diasFiltro && (
          <div className="flex gap-2">
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            />
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            />
          </div>
        )}
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="fecha" 
              tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Brush 
              dataKey="fecha"
              height={30}
              stroke="#6366F1"
              tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
            />
            {usuarios.map((user, index) => (
              <Line
                key={`line-${user.id}`}
                type="monotone"
                dataKey={user.id}
                name={user.nombre}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {usuarios.map((user, index) => (
          <div 
            key={`legend-${user.id}`}
            className="flex items-center px-3 py-1 rounded-full bg-gray-50 cursor-pointer"
            onMouseEnter={() => setHoveredUser(user.id)}
            onMouseLeave={() => setHoveredUser(null)}
          >
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-700">{user.nombre.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};