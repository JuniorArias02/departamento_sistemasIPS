import { useEffect, useState } from "react";
import {
	obtenerGraficaInventario,
	obtenerGraficaDispositivoMedico,
	obtenerGraficaEquipoBiomedico,
	obtenerGraficaMedicamento,
	obtenerGraficaReactivo,
} from "../../services/dashboardAdmin_services";
import { ChartPorUsuario } from "./components/graficas/renderChartPorUsuario";
import { formatearFechas } from "../../hook/formatearFecha";
export default function DashboardAdmin() {
	const [inventario, setInventario] = useState([]);
	const [dispositivoMedico, setDispositivoMedico] = useState([]);
	const [equipoBiomedico, setEquipoBiomedico] = useState([]);
	const [medicamento, setMedicamento] = useState([]);
	const [reactivo, setReactivo] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [
					inv,
					dis,
					eqb,
					med,
					rea
				] = await Promise.all([
					obtenerGraficaInventario(),
					obtenerGraficaDispositivoMedico(),
					obtenerGraficaEquipoBiomedico(),
					obtenerGraficaMedicamento(),
					obtenerGraficaReactivo()
				]);

				setInventario(formatearFechas(inv));
				setDispositivoMedico(formatearFechas(dis));
				setEquipoBiomedico(formatearFechas(eqb));
				setMedicamento(formatearFechas(med));
				setReactivo(formatearFechas(rea));
			} catch (error) {
				console.error("Error al cargar las gráficas", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<p className="text-gray-500 text-xl">Cargando datos...</p>
			</div>
		);
	}

	return (
		<main className="bg-gray-100 flex-1 flex flex-col items-center select-none w-full p-4">
			{/* <h1 className="text-3xl font-bold mb-6">Dashboard del Administrador</h1> */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-7xl">

				<ChartPorUsuario data={inventario} title="Inventario por Usuario" />
				<ChartPorUsuario data={dispositivoMedico} title="Dispositivos Médicos por Usuario" />
				<ChartPorUsuario data={equipoBiomedico} title="Equipos Biomédicos por Usuario" />
				<ChartPorUsuario data={medicamento} title="Medicamentos por Usuario" />
				<ChartPorUsuario data={reactivo} title="Reactivos por Usuario" />
			</div>
		</main>
	);
}
