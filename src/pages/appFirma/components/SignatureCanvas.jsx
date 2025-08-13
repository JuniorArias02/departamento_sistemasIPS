import { useRef, useEffect, useState } from 'react';

const SignatureCanvas = ({ brushSize = 8, onChange, color = '#000000' }) => {
	const canvasRef = useRef(null);
	const [drawing, setDrawing] = useState(false);
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	// Manejar responsive
	useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Configurar canvas
	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.strokeStyle = color;
		ctx.lineWidth = brushSize;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvas.width, canvas.height); // Fondo blanco inicial
	}, [brushSize, color]);

	const startDrawing = (e) => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const rect = canvas.getBoundingClientRect();
		const x = (e.touches?.[0]?.clientX || e.clientX) - rect.left;
		const y = (e.touches?.[0]?.clientY || e.clientY) - rect.top;

		ctx.beginPath();
		ctx.moveTo(x, y);
		setDrawing(true);
	};

	const endDrawing = () => {
		setDrawing(false);
		onChange?.(canvasRef.current.toDataURL('image/png'));
	};

	const draw = (e) => {
		if (!drawing) return;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const rect = canvas.getBoundingClientRect();
		const x = (e.touches?.[0]?.clientX || e.clientX) - rect.left;
		const y = (e.touches?.[0]?.clientY || e.clientY) - rect.top;

		ctx.lineTo(x, y);
		ctx.stroke();
		onChange?.(canvas.toDataURL('image/png'));
	};

	// Tamaño responsive
	const canvasWidth = windowSize.width < 768 ? windowSize.width - 40 : 500;
	const canvasHeight = windowSize.width < 768 ? 300 : 400;

	return (
		<div style={{
			position: 'relative',
			border: '1px solid #e0e0e0',
			borderRadius: '12px',
			overflow: 'hidden',
			boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
			margin: '20px 0',
			background: '#fff',
		}}>
			<canvas
				ref={canvasRef}
				width={canvasWidth}
				height={canvasHeight}
				style={{
					display: 'block',
					cursor: drawing ? 'grabbing' : 'crosshair',
					touchAction: 'none', // Mejor soporte para móviles
				}}
				onMouseDown={startDrawing}
				onMouseUp={endDrawing}
				onMouseLeave={endDrawing}
				onMouseMove={draw}
				onTouchStart={startDrawing}
				onTouchEnd={endDrawing}
				onTouchMove={draw}
			/>

			{/* Indicador de firma (placeholder) */}
			{!drawing && (
				<div style={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					color: '#ccc',
					fontSize: '18px',
					pointerEvents: 'none',
				}}>
					Dibuja tu firma aquí ✍️
				</div>
			)}
		</div>
	);
};

export default SignatureCanvas;