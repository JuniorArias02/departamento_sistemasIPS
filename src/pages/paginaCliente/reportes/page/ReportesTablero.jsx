import { useState } from "react";
import ReportesNuevos from "../components/ReportesTableroTab/ReportesNuevos";
import ReportesAsignados from "../components/ReportesTableroTab/ReportesAsignados";
import { useApp } from "../../../../store/AppContext";

// Definir tabs como constante
const TABS = [
	{ key: "nuevos", label: "Nuevos reportes", component: ReportesNuevos },
	{ key: "asignados", label: "Mis reportes", component: ReportesAsignados },
];

export default function ReportesTablero() {
	const { usuario } = useApp();
	const [activeTab, setActiveTab] = useState(TABS[0].key);

	const ActiveComponent = TABS.find(tab => tab.key === activeTab)?.component;

	return (

		<div className="p-4">
			{/* Tabs */}
			<div className="flex mb-4 border-b">
				{TABS.map(tab => (
					<button
						key={tab.key}
						className={`px-4 py-2 ${activeTab === tab.key ? "border-b-2 border-blue-500 font-bold" : ""}`}
						onClick={() => setActiveTab(tab.key)}
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Contenido según tab */}
			{ActiveComponent && <ActiveComponent usuario={usuario} />}
			
		</div>
	);
}
