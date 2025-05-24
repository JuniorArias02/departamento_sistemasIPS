import { useEffect, useState } from "react";

export const useContadorAnimado = (valorFinal, duracion = 1000) => {
	const [valor, setValor] = useState(0);

	useEffect(() => {
		let inicio = 0;
		const incremento = Math.ceil(valorFinal / (duracion / 16));
		const intervalo = setInterval(() => {
			inicio += incremento;
			if (inicio >= valorFinal) {
				inicio = valorFinal;
				clearInterval(intervalo);
			}
			setValor(inicio);
		}, 26); // 60 fps aprox

		return () => clearInterval(intervalo);
	}, [valorFinal, duracion]);

	return valor;
};
