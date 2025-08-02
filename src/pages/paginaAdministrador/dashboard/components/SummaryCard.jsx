import { CalendarDays, ChevronDown, RefreshCw, Package2, Users, ClipboardList, PlusCircle, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
const SummaryCard = ({
	title,
	value,
	change,
	onNavigate,
	icon,
	color,
	isLoading = false
}) => {
	const colorClasses = {
		blue: 'from-blue-50 to-blue-100 text-blue-600',
		green: 'from-green-50 to-green-100 text-green-600',
		orange: 'from-orange-50 to-orange-100 text-orange-600',
		red: 'from-red-50 to-red-100 text-red-600',
		indigo: 'from-indigo-50 to-indigo-100 text-indigo-600'
	};

	return (
		<div
			className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 cursor-pointer hover:shadow-md transition-all duration-300 group hover:border-indigo-100"
			onClick={onNavigate}
		>
			<div className="flex justify-between items-start">
				<div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
					{icon}
				</div>

				{change && (
					<span className="text-xs font-medium text-indigo-600 flex items-center gap-1.5 hover:text-indigo-800 transition-colors px-2 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100">
						{change === "ver" ? (
							<>
								Ver más
								<ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
							</>
						) : (
							change
						)}
					</span>
				)}
			</div>

			<h3 className="text-sm text-gray-500 mt-5 mb-1 font-medium">{title}</h3>

			{isLoading ? (
				<div className="h-8 w-3/4 bg-gray-100 rounded-md animate-pulse mt-2"></div>
			) : (
				<p className="text-2xl font-semibold mt-1 text-gray-800">
					{value}
				</p>
			)}
		</div>
	);
};

export default SummaryCard;