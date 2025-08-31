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

import DashboardAdmin from "./pages/paginaAdministrador/dashboard/DashboardAdmin";
import NotFound from "./pages/404";
import NotAvailable from "./pages/NotAvailable";
import VistaDatosRoles from "./pages/paginaAdministrador/vistaDatos/vista_datos_roles";

import CalendarioMantenimientos from "./pages/paginaCliente/calendarioMantenimiento/CalendarioMantenimientos";
import HorasDiaView from "./pages/paginaCliente/calendarioMantenimiento/components/ModalHorasDia";
import FormularioCrearRol from "./pages/paginaAdministrador/formularios/crear_rol";

import FormularioEquipo from "./pages/paginaCliente/equiposComputo/page/formulario_equipo";
import VistaVerEquipos from "./pages/paginaCliente/equiposComputo/page/ver_equipos";
import DetalleEquipo from "./pages/paginaCliente/equiposComputo/page/detalle_equipo";
import VistaCrearActaEntrega from "./pages/paginaCliente/equiposComputo/page/crear_acta_entrega";
import VistaCrearMantenimientoEquipo from "./pages/paginaCliente/equiposComputo/page/crear_mantenimiento";

import CrearPersonalVista from "./pages/paginaCliente/personal/page/CrearPersonal";
import GestionPersonalVista from "./pages/paginaCliente/personal/page/GestionPersonal";

import CrearPedido from "./pages/paginaCliente/gestionPedidosCompras/page/CrearPedido";
import GestionPedidos from "./pages/paginaCliente/gestionPedidosCompras/page/GestionPedidos";
import PedidoDetalle from "./pages/paginaCliente/gestionPedidosCompras/page/PedidoDetalle";
import InformesPedidos from "./pages/paginaCliente/gestionPedidosCompras/page/InformesPedidos";
// rutas de admin
import RutaSoloAdmin from "./secure/RutaSoloAdmin";
import { PERMISOS } from "./secure/permisos/permisos";
import PerfilUsuario from "./pages/paginaCliente/perfil/perfil_usuario";
import AsignarPermisos from "./pages/paginaAdministrador/formularios/asignar_permisos";

// rutas administrador web
import CrearAvisoActualizacionWeb from "./pages/paginaAdministrador/formularios/crear_aviso_actualizacion_web";
import VistaActualizacionesWeb from "./pages/paginaCliente/vistasDatos/vista_actualizaciones_web";

import VerProgramados from "./pages/paginaCliente/calendarioMantenimiento/VerProgramados";

import ScrollToTop from "./hook/ScrollToTop";

import { RUTAS } from "./const/routers/routers";
import HorasDiaWrapper from "./view/HorasDiaWrapper";
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
      <ScrollToTop />

      <Routes>
        {/* Login */}
        <Route
          path={RUTAS.LOGIN}
          element={
            usuario ? (
              permisos.includes(PERMISOS.SISTEMA.INGRESAR_DASHBOARDADMIN) ? (
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

          {/* modulo de sistema */}
          <Route
            path={RUTAS.ADMIN.SISTEMA.ACTUALIZACIONES_WEB}
            element={
              permisos.includes(PERMISOS.ADMINISTRADOR_WEB.CREAR_AVISO_ACTUALIZACION) ? (
                <CrearAvisoActualizacionWeb />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          {/* modulos de roles  */}
          <Route
            path={RUTAS.ADMIN.ROLES.VISTA_DATOS}
            element={
              permisos.includes(PERMISOS.ROLES.VER_LISTADO) ? (
                <VistaDatosRoles />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.ADMIN.ROLES.CREAR_ROL}
            element={
              permisos.includes(PERMISOS.ROLES.CREAR) ? (
                <FormularioCrearRol />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.ADMIN.PERMISOS.ASIGNAR}
            element={
              permisos.includes(PERMISOS.GESTION_PERMISOS.ASIGNAR) ? (
                <AsignarPermisos />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.MANTENIMIENTO.VER_DETALLES}
            element={
              permisos.includes(PERMISOS.MANTENIMIENTOS.VER_DETALLE) ? (
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
              permisos.includes(PERMISOS.USUARIOS.VER_DATOS) ? (
                <VistaDatosUsuarios />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />


          <Route
            path={RUTAS.USER.MANTENIMIENTO.VISTA_DATOS}
            element={
              permisos.includes(PERMISOS.MANTENIMIENTOS.VER_DATOS) ? (
                <VistaDatosMantenimiento />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />


          <Route
            path={RUTAS.ADMIN.USUARIOS.CREAR_USUARIO}
            element={
              permisos.includes(PERMISOS.USUARIOS.CREAR) ? (
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
            path={RUTAS.USER.PERSONAL.CREAR_PERSONAL}
            element={
              permisos.includes(PERMISOS.GESTION_PERSONAL.CREAR) ? (
                <CrearPersonalVista />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.INVENTARIO.CREAR_INVENTARIO}
            element={
              permisos.includes(PERMISOS.INVENTARIO.VER_FORMULARIO) ? (
                <FormularioInventario />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.MANTENIMIENTO.CREAR_MANTENIMIENTO}
            element={
              permisos.includes(PERMISOS.MANTENIMIENTOS.VER_FORMULARIO) ? (
                <FormularioMantenimiento />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.EQUIPOS.CREAR_EQUIPO}
            element={
              permisos.includes(PERMISOS.GESTION_EQUIPOS.AGREGAR) ? (
                <FormularioEquipo />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.EQUIPOS.CREAR_ACTA_ENTREGA}
            element={
              permisos.includes(PERMISOS.GESTION_EQUIPOS.CREAR_ACTA) ? (
                <VistaCrearActaEntrega />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />



          <Route
            path={RUTAS.USER.EQUIPOS.CREAR_ACTA_MANTENIMIENTO}
            element={
              permisos.includes(PERMISOS.GESTION_EQUIPOS.CREAR_MANTENIMIENTO) ? (
                <VistaCrearMantenimientoEquipo />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.GESTION_COMPRAS.CREAR_PEDIDO}
            element={
              permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.CREAR_PEDIDO) ? (
                <CrearPedido />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />



          {/* vistaDatos */}

          <Route
            path={RUTAS.USER.PERSONAL.ROOT}
            element={
              permisos.includes(PERMISOS.GESTION_PERSONAL.VER) ? (
                <GestionPersonalVista />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.GESTION_COMPRAS.INFORMES}
            element={
              permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.GESTIONAR_PEDIDO) ? (
                <InformesPedidos />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.INVENTARIO.VER_INVENTARIO}
            element={
              permisos.includes(PERMISOS.INVENTARIO.VER_FORMULARIO) ? (
                <VistaDatosInventarios />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.EQUIPOS.ROOT}
            element={
              permisos.includes(PERMISOS.GESTION_EQUIPOS.VER) ? (
                <VistaVerEquipos />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.EQUIPOS.DETALLE_EQUIPO}
            element={
              permisos.includes(PERMISOS.GESTION_EQUIPOS.VER) ? (
                <DetalleEquipo />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.MANTENIMIENTO.AGENDA_MANTENIMIENTOS}
            element={
              permisos.includes(PERMISOS.AGENDAMIENTO_MANTENIMIENTOS.VER_CALENDARIO) ? (
                <CalendarioMantenimientos />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.MANTENIMIENTO.HORAS_DEL_DIA_PATH}
            element={
              permisos.includes(PERMISOS.AGENDAMIENTO_MANTENIMIENTOS.VER_CALENDARIO) ? (
                <HorasDiaWrapper />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.GESTION_COMPRAS.ROOT}
            element={
              permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.VER_PEDIDOS) ? (
                <GestionPedidos />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />


          <Route
            path={RUTAS.USER.GESTION_COMPRAS.DETALLE_PEDIDO}
            element={
              permisos.includes(PERMISOS.GESTION_COMPRA_PEDIDOS.VER_PEDIDOS) ? (
                <PedidoDetalle />
              ) : (
                <Navigate to={RUTAS.ERROR_404} replace />
              )
            }
          />

          <Route
            path={RUTAS.USER.MANTENIMIENTO.HORAS_DEL_DIA_PATH}
            element={<HorasDiaWrapper />}
          />

          <Route
            path={RUTAS.USER.SISTEMA.VER_ACTUALIZACIONES}
            element={
              <VistaActualizacionesWeb />
            }
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
