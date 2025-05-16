import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackPage({ to = "/dashboard", texto = "Volver" }) {
	const navigate = useNavigate();
	const handleBack = () => navigate(to);

	return (
		<button
			type="button" // ✅ Esto evita que se dispare el submit del form
			onClick={handleBack}
			className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-lg transition cursor-pointer"
		>
			<ArrowLeft size={20} />
			{texto}
		</button>

	);
}
