import { Navigate } from "react-router-dom";
import { useApp } from "../store/AppContext";

export default function RutaPrivada({ children }) {
	const { usuario, cargando } = useApp();

	if (cargando) {
		// Puedes meter un spinner bonito aquí si quieres
		return <div className="text-center mt-10">Cargando...</div>;
	}

	if (!usuario) {
		return <Navigate to="/" replace />;
	}

	return children;
}
