import { motion } from "framer-motion";

export const SidebarSubItem = ({ icon, text, onClick, isActive = false, sidebarOpen, delay = 0 }) => (
	<motion.li
		variants={{
			hidden: { opacity: 0, x: -10 },
			visible: { opacity: 1, x: 0 }
		}}
		transition={{ duration: 0.15, delay }} 
		className="list-none"
	>
		<button
			onClick={onClick}
			className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors ${isActive
					? 'bg-white/10 text-white'
					: 'text-white/60 hover:bg-white/5 hover:text-white/90'
				}`}
		>
			<div className="w-4 flex justify-center">
				{icon}
			</div>
			{sidebarOpen && (
				<span className="poppins-regular"> 
					{text}
				</span>
			)}
		</button>
	</motion.li>
);