import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const opciones = [
    { titulo: "Dispositivos Médicos", ruta: "/dashboard/form_dispositivo_medicos" },
    { titulo: "Equipos Biomédicos", ruta: "/dashboard/form_equipo_biomedicos" },
    { titulo: "Medicamentos", ruta: "/dashboard/form_medicamento" },
    { titulo: "Reactivos y Vigilancia", ruta: "/dashboard/form_reactivo_vigilancia" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-black">
        Entrar al Formulario
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {opciones.map((op, i) => (
          <div
            key={i}
            onClick={() => navigate(op.ruta)}
            className="bg-white p-8 rounded-2xl shadow hover:shadow-lg cursor-pointer text-center text-lg font-semibold text-blue-800 hover:bg-blue-50 transition"
          >
            {op.titulo}
          </div>
        ))}
      </div>
    </div>
  );
}
