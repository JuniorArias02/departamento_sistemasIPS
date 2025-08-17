import {
	FileText,
	CheckCircle,
	Clock,
	AlertCircle,
	PenTool
} from "lucide-react";

export const getEstadoIcon = (estado) => {
	switch (estado?.toLowerCase()) {
		case 'aprobado':
			return <CheckCircle size={16} className="text-green-500" />;
		case 'pendiente':
			return <Clock size={16} className="text-yellow-500" />;
		case 'rechazado':
			return <AlertCircle size={16} className="text-red-500" />;
		case 'en proceso':
			return <PenTool size={16} className="text-blue-500" />;
		default:
			return <FileText size={16} className="text-gray-500" />;
	}
};

