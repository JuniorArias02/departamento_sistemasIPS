import { motion } from "framer-motion";
export function NotificationBadge({ count }) {
	if (count <= 0) return null;

	return (
		<motion.span
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			transition={{ type: "spring" }}
			className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
		>
			{count > 9 ? '9+' : count}
		</motion.span>
	);
}