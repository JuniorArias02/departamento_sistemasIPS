import getVersion from "../../../../version";
export default function Footer() {
  const { version, releaseDate } = getVersion();
  return (
 	<footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Contenido principal del footer */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					{/* Logo y nombre */}
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100">
							<svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
							</svg>
						</div>
						<div>
							<p className="text-gray-800 font-semibold">IPS CLINICAL HOUSE</p>
							<p className="text-xs text-gray-500">Departamento de Sistemas</p>
						</div>
					</div>

					{/* Versión y estado */}
					<div className="flex items-center gap-4">
						<div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-sm border border-gray-100">
							<div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
							<span className="text-xs font-medium text-gray-600">Sistema operativo</span>
						</div>

						<div className="flex items-center gap-2">
							<div className="flex flex-col items-end">
								<span className="text-xs font-medium text-gray-500">Versión {version}</span>
								<span className="text-[0.65rem] text-gray-400">Actualizado: {releaseDate}</span>
							</div>
							<div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
								<svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
						</div>
					</div>
				</div>

				{/* Línea divisora */}
				{/* <div className="my-4 border-t border-gray-200 border-dashed"></div> */}

				{/* Menú inferior */}
				{/* <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
					<p className="text-xs text-gray-500">
						© {new Date().getFullYear()} IPS Clinical House. Todos los derechos reservados.
					</p>

					<div className="flex items-center gap-4">
						<a href="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">Términos</a>
						<a href="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">Privacidad</a>
						<a href="#" className="text-xs text-gray-500 hover:text-blue-600 transition-colors">Soporte</a>
					</div>
				</div> */}
			</div>
		</footer>
  );
}
