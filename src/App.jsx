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
import FormularioInventario from "./pages/paginaCliente/formularios/inventario";
import FormularioMantenimientoFreezer from "./pages/paginaCliente/formularios/mantenimiento_freezer";
// vistaDatos
import VistaDatosDispositivosMedicos from "./pages/paginaCliente/vistasDatos/vista_datos_dispositivos_medicos";
import VistaDatosEquiposBiomedicos from "./pages/paginaCliente/vistasDatos/vista_datos_equipos_biomedicos";
import VistaDatosMedicamentos from "./pages/paginaCliente/vistasDatos/vista_datos_medicamentos";
import VistaDatosReactivosVigilancia from "./pages/paginaCliente/vistasDatos/vista_datos_reactivos_vigilancias";
import VistaDatosInventarios from "./pages/paginaCliente/vistasDatos/vista_datos_inventario";
import VistaDatosMantenimientoFreezer from "./pages/paginaCliente/vistasDatos/vista_datos_mantenimientos_freezer";
// VISTA ADMINISTRADOR
import VistaDatosUsuarios from "./pages/paginaAdministrador/vistaDatos/vista_datos_usuarios";
import { ADMINISTRADOR } from "./const/variable_entorno";
import FormularioUsuarios from "./pages/paginaAdministrador/formularios/crearUsuario";
import DashboardAdmin from "./pages/paginaAdministrador/DashboardAdmin";
import NotFound from "./pages/404";
import NotAvailable from "./pages/NotAvailable";
import VistaDatosRoles from "./pages/paginaAdministrador/vistaDatos/vista_datos_roles";

// rutas de admin
import RutaSoloAdmin from "./secure/RutaSoloAdmin";
import { PERMISOS } from "./secure/permisos/permisos";

function App() {
  const { usuario, permisos } = useApp();

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/"
        element={
          usuario ? (
            permisos.includes(PERMISOS.INGRESAR_DASHBOARDADMIN) ? (
              <Navigate to="/dashboardAdmin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <FormularioLogin />
          )
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
        <Route
          path="/dashboardAdmin"
          element={
            <RutaSoloAdmin>
              <DashboardAdmin />
            </RutaSoloAdmin>
          }
        />

        <Route path="/dashboardAdmin/crear_formulario" element={
          <RutaSoloAdmin>
            <NotAvailable />
          </RutaSoloAdmin>
        } />

        {/* modulos de roles  */}
       <Route path="/dashboardAdmin/roles/view_vista_datos_roles" element={
          <RutaSoloAdmin>
            <VistaDatosRoles />
          </RutaSoloAdmin>
        } />



        <Route path="/dashboard" element={<Dashboard />} />

        {/* Rutas SOLO para administrador */}
        <Route
          path="/dashboard/view_usuarios"
          element={
            <RutaSoloAdmin>
              <VistaDatosUsuarios />
            </RutaSoloAdmin>
          }
        />

        <Route
          path="/dashboard/view_mantenimiento_freezer"
          element={
            <RutaSoloAdmin>
              <VistaDatosMantenimientoFreezer />
            </RutaSoloAdmin>
          }
        />


        <Route
          path="/dashboard/form_usuarios"
          element={
            <RutaSoloAdmin>
              <FormularioUsuarios />
            </RutaSoloAdmin>
          }
        />

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

        <Route
          path="/dashboard/form_inventario"
          element={<FormularioInventario />}
        />

        <Route
          path="/dashboard/form_mantenimiento_freezer"
          element={<FormularioMantenimientoFreezer />}
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
        <Route
          path="/dashboard/view_inventarios"
          element={<VistaDatosInventarios />}
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
