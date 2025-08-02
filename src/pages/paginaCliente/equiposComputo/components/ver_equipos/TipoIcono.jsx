import { Laptop, Monitor, MonitorSmartphone, Server, Box } from "lucide-react";

const TipoIcono = ({ tipo }) => {
  switch (tipo) {
    case "Laptop":
      return <Laptop className="w-6 h-6 text-blue-500" />;
    case "Desktop":
      return <Monitor className="w-6 h-6 text-purple-500" />;
    case "All-in-One":
      return <MonitorSmartphone className="w-6 h-6 text-indigo-500" />;
    case "Servidor":
      return <Server className="w-6 h-6 text-red-500" />;
    default:
      return <Box className="w-6 h-6 text-gray-500" />;
  }
};

export default TipoIcono;
