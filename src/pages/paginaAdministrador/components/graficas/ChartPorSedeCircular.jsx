import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
} from "recharts";
import { useState, useEffect } from "react";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ff7300",
  "#00bcd4",
  "#ff4d6d",
  "#ff4081",
  "#4caf50",
  "#ffd700",
];

export const ChartPorSedeCircular = ({ data, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  // Animación al cargar datos (resetea la animación)
  useEffect(() => {
    setAnimate(false);
    const timeout = setTimeout(() => setAnimate(true), 10);
    return () => clearTimeout(timeout);
  }, [data]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(0);
  };

  const total = data.reduce((acc, item) => acc + item.value, 0);

  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      midAngle,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);

    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;

    return (
      <>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={0}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ transition: "all 0.3s ease" }}
        />
        {/* Línea con flecha */}
        <path d={`M${sx},${sy} L${mx},${my} L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={cos >= 0 ? "start" : "end"}
          dominantBaseline="central"
          style={{ fontSize: 14, fontWeight: "600", fill: "#333" }}
        >
          {`${payload.name}: ${value} (${(percent * 100).toFixed(1)}%)`}
        </text>
      </>
    );
  };

  return (
    <section
      className="bg-white p-6 rounded-2xl shadow-xl mb-10 w-full max-w-4xl mx-auto select-none"
      style={{ userSelect: "none" }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{title}</h2>

      <div style={{ width: "100%", height: 340, cursor: "default" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={0}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              isAnimationActive={animate}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{
                    transition: "all 0.3s ease",
                    transform:
                      activeIndex === index ? "scale(1.05)" : "scale(1)",
                    filter:
                      activeIndex === index
                        ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                        : "none",
                  }}
                />
              ))}
            </Pie>

            {/* Texto en el centro con total */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 20, fontWeight: "700", fill: "#555" }}
            >
              Total: {total}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
