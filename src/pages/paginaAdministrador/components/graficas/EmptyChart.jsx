import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

export default function EmptyState() {
	// Datos para el gráfico de ejemplo
	const sampleData = [
		{ name: 'Sem 1', value: 35 },
		{ name: 'Sem 2', value: 45 },
		{ name: 'Sem 3', value: 25 },
		{ name: 'Sem 4', value: 55 },
	];

	// Animación de aparición
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2
			}
		}
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: { opacity: 1, y: 0 }
	};

	return (
		<motion.div
			className="w-full h-full flex flex-col"
			initial="hidden"
			animate="visible"
			variants={containerVariants}
		>
			{/* Gráfico de placeholder */}
			<div className="w-full flex-1 min-h-[300px]">
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={sampleData}
						margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
					>
						<defs>
							<linearGradient id="colorEmpty" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#E5E7EB" stopOpacity={0.4} />
								<stop offset="95%" stopColor="#E5E7EB" stopOpacity={0.1} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="#F3F4F6"
							vertical={false}
						/>
						<XAxis
							dataKey="name"
							axisLine={false}
							tickLine={false}
							tick={{ fill: '#9CA3AF', fontSize: 12 }}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fill: '#9CA3AF', fontSize: 12 }}
							width={30}
						/>
						<Area
							type="monotone"
							dataKey="value"
							stroke="#D1D5DB"
							strokeWidth={2}
							fill="url(#colorEmpty)"
							fillOpacity={1}
							animationDuration={2000}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>

			{/* Mensaje */}
			<motion.div
				className="text-center pb-6 px-4"
				variants={itemVariants}
			>
				<h3 className="text-lg font-medium text-gray-600 mb-2">
					No hay más gráficas disponibles
				</h3>
				<motion.p
					className="text-gray-400 text-sm max-w-md mx-auto"
					variants={itemVariants}
				>
					Estamos trabajando en nuevas visualizaciones de datos para ti.
				</motion.p>
			</motion.div>
		</motion.div>
	);
}