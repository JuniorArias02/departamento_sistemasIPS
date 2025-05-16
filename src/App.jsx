import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./store/AppContext";
import RutaPrivada from "./secure/RutaPrivada";
import FormularioLogin from "./auth/formularioLogin/FormularioLogin";
import Layout from "./pages/paginaCliente/components/Layout";
import Dashboard from "./pages/paginaCliente/Dashboard";
// formularios
import FormularioDispositivoMedicos from "./pages/paginaCliente/formularios/dispositivos_medicos";
import FormularioEquiposBiomedicos from "./pages/paginaCliente/formularios/equipos_biomedicos";
import FormularioMedicamentos from "./pages/paginaCliente/formularios/medicamento";
import FormularioReactivoVigilancia from "./pages/paginaCliente/formularios/reactivo_vigilancia";
// vistaDatos
import VistaDatosDispositivosMedicos from "./pages/paginaCliente/vistasDatos/vista_datos_dispositivos_medicos";
import VistaDatosEquiposBiomedicos from "./pages/paginaCliente/vistasDatos/vista_datos_equipos_biomedicos";
import VistaDatosMedicamentos from "./pages/paginaCliente/vistasDatos/vista_datos_medicamentos";
import VistaDatosReactivosVigilancia from "./pages/paginaCliente/vistasDatos/vista_datos_reactivos_vigilancias";
import NotFound from "./pages/404";
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
        {/* formularios */}
        <Route
          path="/dashboard/form_dispositivo_medicos"
          element={<FormularioDispositivoMedicos />}
        />
        <Route
          path="/dashboard/form_equipo_biomedicos"
          element={<FormularioEquiposBiomedicos />}
        />
        <Route
          path="/dashboard/form_medicamento"
          element={<FormularioMedicamentos />}
        />
        <Route
          path="/dashboard/form_reactivo_vigilancia"
          element={<FormularioReactivoVigilancia />}
        />
        {/* vistaDatos */}
        <Route
          path="/dashboard/view_dispositivos_medicos"
          element={<VistaDatosDispositivosMedicos />}
        />
        <Route
          path="/dashboard/view_equipos_biomedicos"
          element={<VistaDatosEquiposBiomedicos />}
        />
        <Route
          path="/dashboard/view_medicamentos"
          element={<VistaDatosMedicamentos />}
        />
        <Route
          path="/dashboard/view_reactivos_vigilancia"
          element={<VistaDatosReactivosVigilancia />}
        />
        {/* error 404 */}
      </Route>
      <Route path="/404" element={<NotFound />} />

      {/* Ruta por defecto */}
      <Route
        path="*"
        element={<Navigate to={usuario ? "/404" : "/"} replace />}
      />
    </Routes>
  );
}
export default App;
