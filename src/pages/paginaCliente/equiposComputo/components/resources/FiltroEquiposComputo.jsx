import { Laptop, Monitor, MonitorSmartphone, Server, Box } from "lucide-react";
import { useState } from "react";

const FiltroEquiposComputo = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState("Todos");

  const handleFilterClick = (type) => {
    setActiveFilter(type);
    onFilterChange(type);
  };

  const filterOptions = [
    {
      type: "Todos",
      icon: <Box className="w-5 h-5" />,
      label: "Todos",
      color: "gray"
    },
    {
      type: "Laptop",
      icon: <Laptop className="w-5 h-5 text-blue-500" />,
      label: "Laptops",
      color: "blue"
    },
    {
      type: "Desktop",
      icon: <Monitor className="w-5 h-5 text-purple-500" />,
      label: "Desktops",
      color: "violet"
    },
    {
      type: "All-in-One",
      icon: <MonitorSmartphone className="w-5 h-5 text-indigo-500" />,
      label: "All-in-One",
      color: "indigo"
    },
    {
      type: "Servidor",
      icon: <Server className="w-5 h-5 text-red-500" />,
      label: "Servidores",
      color: "red"
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg mb-5">
      {filterOptions.map((option) => (
        <button
          key={option.type}
          onClick={() => handleFilterClick(option.type)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors
    ${activeFilter === option.type
              ? `bg-${option.color}-100 text-${option.color}-600`
              : `hover:bg-${option.color}-100 hover:text-${option.color}-600`
            }`}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>

      ))}
    </div>
  );
};

export default FiltroEquiposComputo;
