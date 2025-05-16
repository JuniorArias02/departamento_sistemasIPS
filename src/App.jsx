import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./store/AppContext";
import RutaPrivada from "./secure/RutaPrivada";
import FormularioLogin from "./auth/formularioLogin/FormularioLogin";
import Layout from "./pages/paginaCliente/components/Layout";
import Dashboard from "./pages/paginaCliente/Dashboard";
import FormularioDispositivoMedicos from "./pages/formularios/dispositivos_medicos";
import FormularioEquiposBiomedicos from "./pages/formularios/equipos_biomedicos";
import FormularioMedicamentos from "./pages/formularios/medicamento";
import FormularioReactivoVigilancia from "./pages/formularios/reactivo_vigilancia";

function App() {
  const { usuario } = useApp();

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/"
        element={
          usuario ? <Navigate to="/dashboard" replace /> : <FormularioLogin />
        }
      />

      {/* Rutas protegidas */}
      <Route
        element={
          <RutaPrivada>
            <Layout />
          </RutaPrivada>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/form_dispositivo_medicos" element={<FormularioDispositivoMedicos />} />
        <Route path="/dashboard/form_equipo_biomedicos" element={<FormularioEquiposBiomedicos />} />
        <Route path="/dashboard/form_medicamento" element={<FormularioMedicamentos />} />
        <Route path="/dashboard/form_reactivo_vigilancia" element={<FormularioReactivoVigilancia />} />
      </Route>

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to={usuario ? "/dashboard" : "/"} replace />} />
    </Routes>

  );
}
export default App;