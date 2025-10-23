import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Search } from "lucide-react";
import { listarCentrosCosto } from "../../../../services/cp_centro_costo_services";

export default function CentroCostoInput({ value, onChange }) {
	const [centrosCosto, setCentrosCosto] = useState([]);
	const [search, setSearch] = useState("");
	const [filtered, setFiltered] = useState([]);
	const [showList, setShowList] = useState(false);

	useEffect(() => {
		const fetchCentrosCosto = async () => {
			try {
				const res = await listarCentrosCosto();
				const lista = Array.isArray(res?.data) ? res.data : [];
				setCentrosCosto(lista);
				setFiltered(lista);
			} catch (error) {
				console.error("Error al cargar los centros de costo:", error);
			}
		};
		fetchCentrosCosto();
	}, []);

	useEffect(() => {
		if (!search) {
			setFiltered(centrosCosto);
		} else {
			setFiltered(
				centrosCosto.filter(
					(c) =>
						String(c.nombre || "")
							.toLowerCase()
							.includes(search.toLowerCase()) ||
						String(c.codigo || "")
							.toLowerCase()
							.includes(search.toLowerCase())
				)
			);
		}
	}, [search, centrosCosto]);


	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-1 relative"
		>
			<label className="text-sm font-medium text-gray-700 flex items-center gap-1">
				<CreditCard size={18} className="text-gray-400" />
				<span>Centro de Costo</span>
			</label>

			<div className="relative">
				<input
					type="text"
					value={search || value || ""}
					onChange={(e) => {
						setSearch(e.target.value);
						setShowList(true);
					}}
					onFocus={() => setShowList(true)}
					onBlur={() => setTimeout(() => setShowList(false), 200)}
					className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
					placeholder="Buscar centro de costo..."
				/>
				<Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
			</div>

			{showList && filtered.length > 0 && (
				<ul className="absolute z-10 bg-white border border-gray-200 rounded-xl shadow-md mt-1 w-full max-h-48 overflow-y-auto">
					{filtered.map((item) => (
						<li
							key={item.id}
							className="px-3 py-2 hover:bg-indigo-50 cursor-pointer text-sm flex justify-between"
							onMouseDown={() => {
								setSearch(`${item.codigo} - ${item.nombre}`);
								const fakeEvent = {
									target: {
										name: "centro_costo",
										value: String(item.codigo),
									},
								};

								onChange(fakeEvent);
								setShowList(false);
							}}

						>
							<span>{item.nombre}</span>
							<span className="text-gray-400 text-xs">{item.codigo}</span>
						</li>
					))}
				</ul>
			)}
		</motion.div>
	);
}
