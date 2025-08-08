import Swal from "sweetalert2";
import SummaryCard from "./SummaryCard"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RUTAS } from "../../../../const/routers/routers";
import {
	Laptop,
	Wrench,
	ClipboardSignature,
	PlusCircle,
	BrushCleaning
} from "lucide-react";
import { obtenerTotalEquipos } from "../../../../services/pc_equipos_services";
import { useEffect } from "react";
import { obtenerTotalEntrega } from "../../../../services/pc_entregas_services";
import { obtenerTotalMantenimiento } from "../../../../services/pc_mantenimientos_services";
export default function SeccionEquiposComputo() {
	const navigate = useNavigate();
	const [totales, setTotales] = useState({
		equipos: 0,
		entrega: 0,
		mantenimiento: 0
	});

	useEffect(() => {
		cargarTotales();
	}, []);


	const cargarTotales = async () => {
		try {
			const [equipos, entrega, mantenimiento] = await Promise.all([
				obtenerTotalEquipos(),
				obtenerTotalEntrega(),
				obtenerTotalMantenimiento()

			]);
			setTotales({ equipos: equipos.total, entrega: entrega.total, mantenimiento: mantenimiento.total });
		} catch (error) {
			console.error("Error al cargar totales", error);
		}
	};



	return (

		<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* Tarjetas de resumen */}
			<div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<SummaryCard
					title="Equipos de Cómputo"
					value={totales.equipos}
					change="ver"
					onNavigate={() => navigate(RUTAS.USER.EQUIPOS.ROOT)}
					icon={<Laptop className="w-6 h-6" />}
					color="blue"
				/>
				<SummaryCard
					title="Acta de Entrega"
					value={totales.entrega}
					change="ver"
					onNavigate={() => navigate(RUTAS.USER.EQUIPOS.ROOT)}
					icon={<ClipboardSignature className="w-6 h-6" />}
					color="orange"
				/>
				<SummaryCard
					title="Acta de Mantenimientos"
					value={totales.mantenimiento}
					change="ver"
					onNavigate={() => navigate(RUTAS.USER.EQUIPOS.ROOT)}
					icon={<BrushCleaning className="w-6 h-6" />}
					color="red"
				/>
			</div>
		</div>
	)
}