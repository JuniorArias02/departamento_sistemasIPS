import getVersion from "../../../../version";

export default function Footer() {
  const { version, releaseDate } = getVersion();
  
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 py-4 px-4 sm:py-5 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Contenido reorganizado según lo pedido */}
        <div className="flex flex-col items-center sm:flex-row sm:justify-between gap-3 sm:gap-4">
          {/* Parte derecha en desktop (izquierda en móvil) - Nombre clínica */}
          <div className="order-2 sm:order-1 flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white shadow-xs border border-gray-100">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm sm:text-[15px] text-gray-800 font-semibold">IPS CLINICAL HOUSE</p>
              <p className="text-[0.6rem] xs:text-xs text-gray-500">Departamento de Sistemas</p>
            </div>
          </div>

          {/* Parte izquierda en desktop (derecha en móvil) - Versión y estado */}
          <div className="order-1 sm:order-2 flex flex-col xs:flex-row items-center gap-2 sm:gap-3">
            {/* Estado del sistema */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-white rounded-full shadow-xs border border-gray-100">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600">Sistema operativo</span>
            </div>

            {/* Versión compacta */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white sm:bg-transparent px-2.5 py-1 sm:px-0 sm:py-0 rounded-full sm:rounded-none shadow-xs sm:shadow-none border sm:border-none border-gray-100">
              <div className="flex flex-col items-end">
                <span className="text-[0.65rem] sm:text-xs font-medium text-gray-500">v{version}</span>
                <span className="text-[0.55rem] sm:text-[0.65rem] text-gray-400">{releaseDate}</span>
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-blue-50 flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}