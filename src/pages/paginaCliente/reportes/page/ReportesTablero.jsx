import { useState } from "react";
import ReportesNuevos from "../components/ReportesTableroTab/ReportesNuevos";
import ReportesAsignados from "../components/ReportesTableroTab/ReportesAsignados";
import { useApp } from "../../../../store/AppContext";
import { FileText, FolderOpen, User, Sparkles, MessageSquareWarning } from "lucide-react";

// Definir tabs como constante
const TABS = [
  { 
    key: "nuevos", 
    label: "Nuevos reportes", 
    component: ReportesNuevos,
    icon: <FileText size={18} />
  },
  { 
    key: "asignados", 
    label: "Mis reportes", 
    component: ReportesAsignados,
    icon: <FolderOpen size={18} />
  },
];

export default function ReportesTablero() {
  const { usuario } = useApp();
  const [activeTab, setActiveTab] = useState(TABS[0].key);

  const ActiveComponent = TABS.find(tab => tab.key === activeTab)?.component;

  return (
    <div className="p-6 bg-gradient-to-br from-purple-10 to-blue-50 min-h-screen">
      {/* Header con información del usuario */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
		  <MessageSquareWarning className="mr-2 text-purple-500" />
            Panel de Reportes
          </h1>
          <p className="text-gray-600">Gestiona y revisa todos los reportes del sistema</p>
        </div>
      </div>

      {/* Tabs con diseño mejorado */}
      <div className="bg-white rounded-xl shadow-sm p-1 mb-6 flex w-max">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`flex items-center px-5 py-3 rounded-lg transition-all duration-300 ${
              activeTab === tab.key 
                ? "bg-gradient-to-b from-indigo-900 to-violet-900  text-white shadow-md" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido según tab */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {ActiveComponent && <ActiveComponent usuario={usuario} />}
      </div>
    </div>
  );
}