import { useState, useEffect } from "react";
import { Home, ArrowLeft, Wrench, Clock } from "lucide-react";

export default function NotAvailableTemp() {
	const [dots, setDots] = useState("");

	useEffect(() => {
		const interval = setInterval(() => {
			setDots(prev => {
				if (prev.length === 3) return "";
				return prev + ".";
			});
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="min-h-screen relative overflow-hidden">
			{/* Imagen de fondo a pantalla completa */}
			<div className="absolute inset-0 z-0">
			
				{/* Overlay para mejorar legibilidad */}
				<div className="absolute inset-0 bg-black/50"></div>
			</div>

			{/* Contenido */}
			<div className="relative z-10 min-h-screen flex items-center justify-center p-6">
				<div className="text-center max-w-3xl mx-auto">
					{/* Icono */}
					<div className="mb-8 flex justify-center">
						<div className="bg-white/20 p-5 rounded-full backdrop-blur-sm">
							<Wrench size={60} className="text-white" />
						</div>
					</div>

					{/* Título */}
					<h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
						Sección en <span className="text-blue-300">Mantenimiento</span>
					</h1>

					{/* Mensaje */}
					<p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto leading-relaxed">
						Estamos trabajando en mejorar esta sección para ofrecerte una experiencia excepcional.
					</p>

					{/* Contador regresivo */}
					<div className="flex items-center justify-center text-blue-200 font-medium mb-10 text-lg">
						<Clock size={24} className="mr-3" />
						<span>Volveremos muy pronto{dots}</span>
					</div>

					{/* Botones */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={() => window.history.back()}
							className="px-8 py-4 bg-white/10 text-white rounded-xl flex items-center justify-center gap-3 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40 text-lg font-medium"
						>
							<ArrowLeft size={24} />
							Volver atrás
						</button>

						<button
							onClick={() => window.location.href = "/"}
							className="px-8 py-4 bg-white text-blue-900 rounded-xl flex items-center justify-center gap-3 hover:bg-blue-50 transition-all duration-300 text-lg font-semibold"
						>
							<Home size={24} />
							Ir al inicio
						</button>
					</div>

					{/* Mensaje adicional */}
					<div className="mt-16 pt-6 border-t border-white/20">
						<p className="text-blue-200">
							Gracias por tu paciencia mientras realizamos mejoras
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}