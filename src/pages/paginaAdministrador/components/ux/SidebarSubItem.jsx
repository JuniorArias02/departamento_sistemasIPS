import { motion } from "framer-motion";
export const SidebarSubItem = ({ icon, text, onClick, isActive = false }) => (
	<motion.li
		variants={{
			hidden: { opacity: 0, x: -10 },
			visible: { opacity: 1, x: 0 }
		}}
	>
		<button
			onClick={onClick}
			className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
					? 'bg-white/10 text-white'
					: 'text-white/60 hover:bg-white/5 hover:text-white/90'
				}`}
		>
			<div className="w-5 flex justify-center">{icon}</div>
			<span>{text}</span>
		</button>
	</motion.li>
);