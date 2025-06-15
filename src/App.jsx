import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./store/AppContext";
import RutaPrivada from "./secure/RutaPrivada";
import FormularioLogin from "./auth/formularioLogin/FormularioLogin";
import Layout from "./pages/paginaCliente/components/Layout";
import Dashboard from "./pages/paginaCliente/Dashboard";
// formularios
import FormularioInventario from "./pages/paginaCliente/formularios/inventario";
import FormularioMantenimientoFreezer from "./pages/paginaCliente/formularios/mantenimiento_freezer";
// vistaDatos
import VistaDatosInventarios from "./pages/paginaCliente/vistasDatos/vista_datos_inventario";
import VistaDatosMantenimientoFreezer from "./pages/paginaCliente/vistasDatos/vista_datos_mantenimientos_freezer";
// VISTA ADMINISTRADOR
import VistaDatosUsuarios from "./pages/paginaAdministrador/vistaDatos/vista_datos_usuarios";
import FormularioUsuarios from "./pages/paginaAdministrador/formularios/crearUsuario";
import DashboardAdmin from "./pages/paginaAdministrador/vistaDatos/DashboardAdmin";
import NotFound from "./pages/404";
import NotAvailable from "./pages/NotAvailable";
import VistaDatosRoles from "./pages/paginaAdministrador/vistaDatos/vista_datos_roles";
import DetalleMantenimientoFreezer from "./pages/paginaCliente/vistasDatos/matenimiento_freezer/ver_detalles_mantenimiento";

// rutas de admin
import RutaSoloAdmin from "./secure/RutaSoloAdmin";
import { PERMISOS } from "./secure/permisos/permisos";
import PerfilUsuario from "./pages/paginaCliente/perfil/perfil_usuario";

import { RUTAS } from "./const/routers/routers";
function App() {
  const { usuario, permisos } = useApp();

  return (
    <Routes>
      {/* Login */}
      <Route
        path={RUTAS.LOGIN}
        element={
          usuario ? (
            permisos.includes(PERMISOS.INGRESAR_DASHBOARDADMIN) ? (
              <Navigate to={RUTAS.ADMIN.ROOT} replace />
            ) : (
              <Navigate to={RUTAS.DASHBOARD} replace />
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
          path={RUTAS.ADMIN.ROOT}
          element={
            <RutaSoloAdmin>
              <DashboardAdmin />
            </RutaSoloAdmin>
          }
        />

        {/* modulos de roles  */}
        <Route path={RUTAS.ADMIN.ROLES.VISTA_DATOS} element={
          <RutaSoloAdmin>
            <VistaDatosRoles />
          </RutaSoloAdmin>
        } />

        <Route path={RUTAS.USER.MANTENIMIENTO_FREEZER.VER_DETALLES} element={
          <RutaSoloAdmin>
            <DetalleMantenimientoFreezer />
          </RutaSoloAdmin>
        } />

        <Route path={RUTAS.PAGINA_CONSTRUCCION} element={
          <RutaSoloAdmin>
            <NotAvailable />
          </RutaSoloAdmin>
        } />

        <Route path={RUTAS.DASHBOARD} element={<Dashboard />} />

        {/* Rutas SOLO para administrador */}
        <Route
          path={RUTAS.ADMIN.USUARIOS.ROOT}
          element={
            <RutaSoloAdmin>
              <VistaDatosUsuarios />
            </RutaSoloAdmin>
          }
        />

        <Route
          path={RUTAS.USER.MANTENIMIENTO_FREEZER.VISTA_DATOS}
          element={
            <RutaSoloAdmin>
              <VistaDatosMantenimientoFreezer />
            </RutaSoloAdmin>
          }
        />


        <Route
          path={RUTAS.ADMIN.USUARIOS.CREAR_USUARIO}
          element={
            <RutaSoloAdmin>
              <FormularioUsuarios />
            </RutaSoloAdmin>
          }
        />

        {/* VISTA DE PERFIL */}
        <Route
          path={RUTAS.USER.PERFIL.ROOT}
          element={
            <RutaPrivada>
              <PerfilUsuario />
            </RutaPrivada>
          }
        />
        {/* formularios */}
        <Route
          path={RUTAS.USER.INVENTARIO.CREAR_INVENTARIO}
          element={<FormularioInventario />}
        />

        <Route
          path={RUTAS.USER.MANTENIMIENTO_FREEZER.CREAR_MANTENIMIENTO}
          element={<FormularioMantenimientoFreezer />}
        />

        {/* vistaDatos */}
        <Route
          path={RUTAS.USER.INVENTARIO.VER_INVENTARIO}
          element={<VistaDatosInventarios />}
        />

      </Route>

      {/* RUTAS DE ERROES DE PAGINA */}
      <Route path={RUTAS.ERROR_404} element={<NotFound />} />



      {/* Ruta por defecto */}

      <Route
        path="*"
        element={<Navigate to={usuario ? RUTAS.ERROR_404 : RUTAS.LOGIN} replace />}
      />
    </Routes>
  );
}
export default App;
