import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './layout/Layout'
import RutaProtegida from './components/RutaProtegida'
import { SesionProvider } from './context/SesionContext'
import { IdiomaProvider } from './context/IdiomaContext'
import { inicializarDatosEjemplo } from './utils/dataStore'

// Bloque A — público / institucional
import Index from './pages/Index'
import SobreNosotros from './pages/SobreNosotros'
import PoliticasPrivacidad from './pages/PoliticasPrivacidad'
import TerminosUso from './pages/TerminosUso'
import Ayuda from './pages/Ayuda'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Promociones from './pages/Promociones'

// Bloque B — catálogo, detalle y reserva
import Catalogo from './pages/Catalogo'
import PropiedadDetalle from './pages/PropiedadDetalle'
import Reserva from './pages/Reserva'
import ReservaResumen from './pages/ReservaResumen'
import ReservaConfirmacion from './pages/ReservaConfirmacion'

// Bloque C — autenticación y cuenta
import Registro from './pages/Registro'
import InicioSesion from './pages/InicioSesion'
import Perfil from './pages/Perfil'
import MisReservas from './pages/MisReservas'
import PublicarPropiedad from './pages/PublicarPropiedad'

// Bloque D — panel de anfitrión
import AnfitrionPanel from './pages/AnfitrionPanel'
import AnfitrionPropiedades from './pages/AnfitrionPropiedades'
import AnfitrionPropiedadEditar from './pages/AnfitrionPropiedadEditar'
import AnfitrionReservas from './pages/AnfitrionReservas'
import AnfitrionConsultas from './pages/AnfitrionConsultas'
import AnfitrionConsultaResponder from './pages/AnfitrionConsultaResponder'
import AnfitrionPropiedadResenas from './pages/AnfitrionPropiedadResenas'
import AnfitrionResenaResponder from './pages/AnfitrionResenaResponder'

// Bloque E — panel de administración
import AdminPanel from './pages/AdminPanel'
import AdminUsuarios from './pages/AdminUsuarios'
import AdminUsuarioEditar from './pages/AdminUsuarioEditar'
import AdminAlojamientos from './pages/AdminAlojamientos'
import AdminAlojamientoEditar from './pages/AdminAlojamientoEditar'
import AdminReservas from './pages/AdminReservas'
import AdminReservaEditar from './pages/AdminReservaEditar'
import AdminPromociones from './pages/AdminPromociones'
import AdminPromocionEditar from './pages/AdminPromocionEditar'
import AdminBlog from './pages/AdminBlog'
import AdminBlogPostEditar from './pages/AdminBlogPostEditar'
import AdminReportes from './pages/AdminReportes'

import NoEncontrada from './pages/NoEncontrada'

import './styles/variables.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/header.css'
import './styles/footer.css'
import './styles/formularios.css'
import './styles/componentes.css'
import './styles/inicio.css'
import './styles/catalogo.css'
import './styles/propiedad.css'
import './styles/institucional.css'
import './styles/blog.css'
import './styles/promociones.css'
import './styles/reserva.css'
import './styles/cuenta.css'
import './styles/perfil.css'
import './styles/propiedad-formulario.css'
import './styles/panel.css'

const ROLES_ANFITRION = ['anfitrion', 'administrador']
const ROLES_ADMIN = ['administrador']

/** Envuelve un elemento en la comprobación de rol correspondiente. */
function protegida(elemento, roles) {
  return <RutaProtegida roles={roles}>{elemento}</RutaProtegida>
}

function App() {
  useEffect(() => {
    // Siembra localStorage con los datos de ejemplo si aún no existen.
    inicializarDatosEjemplo()
  }, [])

  return (
    <SesionProvider>
      <IdiomaProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {/* Bloque A — público / institucional */}
              <Route path="/" element={<Index />} />
              <Route path="/sobre-nosotros" element={<SobreNosotros />} />
              <Route path="/politicas-privacidad" element={<PoliticasPrivacidad />} />
              <Route path="/terminos-uso" element={<TerminosUso />} />
              <Route path="/ayuda" element={<Ayuda />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
              <Route path="/promociones" element={<Promociones />} />

              {/* Bloque B — catálogo, detalle y reserva */}
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/propiedades/:id" element={<PropiedadDetalle />} />
              <Route path="/reserva/:propiedadId" element={protegida(<Reserva />)} />
              <Route path="/reserva-resumen" element={protegida(<ReservaResumen />)} />
              <Route path="/reserva-confirmacion" element={protegida(<ReservaConfirmacion />)} />

              {/* Bloque C — autenticación y cuenta */}
              <Route path="/registro" element={<Registro />} />
              <Route path="/inicio-sesion" element={<InicioSesion />} />
              <Route path="/perfil" element={protegida(<Perfil />)} />
              <Route path="/mis-reservas" element={protegida(<MisReservas />)} />
              <Route path="/publicar-propiedad" element={protegida(<PublicarPropiedad />)} />

              {/* Bloque D — panel de anfitrión */}
              <Route path="/anfitrion-panel" element={protegida(<AnfitrionPanel />, ROLES_ANFITRION)} />
              <Route path="/anfitrion-propiedades" element={protegida(<AnfitrionPropiedades />, ROLES_ANFITRION)} />
              <Route path="/anfitrion-propiedad-editar/:id" element={protegida(<AnfitrionPropiedadEditar />, ROLES_ANFITRION)} />
              <Route path="/anfitrion-reservas" element={protegida(<AnfitrionReservas />, ROLES_ANFITRION)} />
              <Route path="/anfitrion-consultas" element={protegida(<AnfitrionConsultas />, ROLES_ANFITRION)} />
              <Route path="/anfitrion-consulta-responder/:id" element={protegida(<AnfitrionConsultaResponder />, ROLES_ANFITRION)} />
              <Route path="/anfitrion-propiedad-resenas/:id" element={protegida(<AnfitrionPropiedadResenas />, ROLES_ANFITRION)} />
              <Route path="/anfitrion-resena-responder/:id" element={protegida(<AnfitrionResenaResponder />, ROLES_ANFITRION)} />

              {/* Bloque E — panel de administración */}
              <Route path="/admin-panel" element={protegida(<AdminPanel />, ROLES_ADMIN)} />
              <Route path="/admin-usuarios" element={protegida(<AdminUsuarios />, ROLES_ADMIN)} />
              <Route path="/admin-usuario-editar/:id" element={protegida(<AdminUsuarioEditar />, ROLES_ADMIN)} />
              <Route path="/admin-alojamientos" element={protegida(<AdminAlojamientos />, ROLES_ADMIN)} />
              <Route path="/admin-alojamiento-editar/:id" element={protegida(<AdminAlojamientoEditar />, ROLES_ADMIN)} />
              <Route path="/admin-reservas" element={protegida(<AdminReservas />, ROLES_ADMIN)} />
              <Route path="/admin-reserva-editar/:id" element={protegida(<AdminReservaEditar />, ROLES_ADMIN)} />
              <Route path="/admin-promociones" element={protegida(<AdminPromociones />, ROLES_ADMIN)} />
              <Route path="/admin-promocion-editar/:id" element={protegida(<AdminPromocionEditar />, ROLES_ADMIN)} />
              <Route path="/admin-blog" element={protegida(<AdminBlog />, ROLES_ADMIN)} />
              <Route path="/admin-blog-post-editar/:id" element={protegida(<AdminBlogPostEditar />, ROLES_ADMIN)} />
              <Route path="/admin-reportes" element={protegida(<AdminReportes />, ROLES_ADMIN)} />

              <Route path="*" element={<NoEncontrada />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </IdiomaProvider>
    </SesionProvider>
  )
}

export default App
