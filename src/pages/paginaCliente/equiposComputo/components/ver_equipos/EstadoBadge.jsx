import { Sparkles, CheckCircle, AlertTriangle, Wrench, HelpCircle } from "lucide-react";

const EstadoBadge = ({ estado }) => {
  switch (estado) {
    case "Nuevo":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Sparkles className="w-4 h-4 mr-1" /> {estado}
        </span>
      );
    case "Usado":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" /> {estado}
        </span>
      );
    case "Dañado":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-4 h-4 mr-1" /> {estado}
        </span>
      );
    case "En Reparacion":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Wrench className="w-4 h-4 mr-1" /> {estado}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <HelpCircle className="w-4 h-4 mr-1" /> {estado}
        </span>
      );
  }
};

export default EstadoBadge;
