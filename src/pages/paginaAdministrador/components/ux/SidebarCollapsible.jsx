import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from 'lucide-react';

export const SidebarCollapsible = ({ icon, text, isOpen, onClick, children, sidebarOpen, badge }) => (
	<li>
		<button
			onClick={onClick}
			className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isOpen ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
				}`}
		>
			<div className="relative">
				{icon}
				{badge && (
					<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center inter-bold">
						{badge}
					</span>
				)}
			</div>
			{sidebarOpen && (
				<>
					<motion.span
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						className="poppins-semibold flex-1 text-left whitespace-nowrap text-[15px]"
					>
						{text}
					</motion.span>
					<motion.div
						animate={{ rotate: isOpen ? 180 : 0 }}
						transition={{ duration: 0.2 }}
					>
						<ChevronDown size={18} />
					</motion.div>
				</>
			)}
		</button>

		<AnimatePresence>
			{isOpen && sidebarOpen && (
				<motion.ul
					initial="hidden"
					animate="visible"
					exit="hidden"
					variants={{
						hidden: { opacity: 0, height: 0 },
						visible: {
							opacity: 1,
							height: 'auto',
							transition: {
								staggerChildren: 0.05
							}
						}
					}}
					className="ml-2 pl-2 border-l-2 border-white/10 mt-1 space-y-1"
				>
					{children}
				</motion.ul>
			)}
		</AnimatePresence>
	</li>
);