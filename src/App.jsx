import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./store/AppContext";
import { Toaster } from "react-hot-toast";
import RutaPrivada from "./secure/RutaPrivada";
import FormularioLogin from "./auth/formularioLogin/FormularioLogin";
import Layout from "./pages/paginaCliente/components/Layout";
import Dashboard from "./pages/paginaCliente/Dashboard";
// formularios
import FormularioInventario from "./pages/paginaCliente/formularios/inventario";
import VistaDatosInventarios from "./pages/paginaCliente/vistasDatos/vista_datos_inventario";

import VistaDatosMantenimiento from "./pages/paginaCliente/vistasDatos/vista_datos_mantenimientos";
import FormularioMantenimiento from "./pages/paginaCliente/formularios/mantenimiento";
import DetalleMantenimiento from "./pages/paginaCliente/vistasDatos/matenimiento/ver_detalles_mantenimiento";

import VistaDatosUsuarios from "./pages/paginaAdministrador/vistaDatos/vista_datos_usuarios";
import FormularioUsuarios from "./pages/paginaAdministrador/formularios/crearUsuario";

import DashboardAdmin from "./pages/paginaAdministrador/vistaDatos/DashboardAdmin";
import NotFound from "./pages/404";
import NotAvailable from "./pages/NotAvailable";
import VistaDatosRoles from "./pages/paginaAdministrador/vistaDatos/vista_datos_roles";

// rutas de admin
import RutaSoloAdmin from "./secure/RutaSoloAdmin";
import { PERMISOS } from "./secure/permisos/permisos";
import PerfilUsuario from "./pages/paginaCliente/perfil/perfil_usuario";

import AsignarPermisos from "./pages/paginaAdministrador/formularios/asignar_permisos";

import { RUTAS } from "./const/routers/routers";
function App() {
  const { usuario, permisos } = useApp();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
          },
          error: {
            style: {
              background: '#7f1d1d',
              border: '1px solid #b91c1c'
            }
          }
        }}
      />

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
          <Route
            path={RUTAS.ADMIN.ROLES.VISTA_DATOS}
            element={
              permisos.includes(PERMISOS.VER_LISTADO_ROLES) ? (
                <VistaDatosRoles />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.ADMIN.PERMISOS.ASIGNAR}
            element={
              permisos.includes(PERMISOS.ASIGNAR_PERMISO) ? (
                <AsignarPermisos />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.MANTENIMIENTO.VER_DETALLES}
            element={
              permisos.includes(PERMISOS.VER_DETALLE_MANTENIMIENTO) ? (
                <DetalleMantenimiento />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route path={RUTAS.PAGINA_CONSTRUCCION} element={
            <NotAvailable />
          } />

          <Route path={RUTAS.DASHBOARD} element={<Dashboard />} />

          {/* Rutas SOLO para administrador */}
          <Route
            path={RUTAS.ADMIN.USUARIOS.ROOT}
            element={
              permisos.includes(PERMISOS.VER_DATOS_USUARIOS) ? (
                <VistaDatosUsuarios />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />


          <Route
            path={RUTAS.USER.MANTENIMIENTO.VISTA_DATOS}
            element={
              permisos.includes(PERMISOS.VER_DATOS_MANTENIMIENTOS) ? (
                <VistaDatosMantenimiento />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />


          <Route
            path={RUTAS.ADMIN.USUARIOS.CREAR_USUARIO}
            element={
              permisos.includes(PERMISOS.AGREGAR_USUARIO) ? (
                <FormularioUsuarios />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
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
            path={RUTAS.USER.MANTENIMIENTO.CREAR_MANTENIMIENTO}
            element={<FormularioMantenimiento />}
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
    </>
  );
}
export default App;
