import { Outlet, NavLink } from 'react-router-dom'
import { useSesion } from '../hooks/useDataStore'

export default function Layout() {
  const { estaAutenticado } = useSesion()

  return (
    <>
      <header>
        <h1>StayBooker 360</h1>
        <nav aria-label="Navegación del sitio">
          <ul>
            {estaAutenticado ? (
              <>
                <li><NavLink to="/perfil">Perfil</NavLink></li>
                <li><NavLink to="/mis-reservas">Mis reservas</NavLink></li>
              </>
            ) : (
              <>
                <li><NavLink to="/registro">Regístrate</NavLink></li>
                <li><NavLink to="/inicio-sesion">Iniciar sesión</NavLink></li>
              </>
            )}
          </ul>

          <ul>
            <li><NavLink to="/">Inicio</NavLink></li>
            <li><NavLink to="/catalogo">Explorar</NavLink></li>
            <li><NavLink to="/promociones">Promociones</NavLink></li>
            <li><NavLink to="/blog">Blog</NavLink></li>
            <li><NavLink to="/ayuda">Ayuda</NavLink></li>
          </ul>

          <select aria-label="Idioma" defaultValue="es">
            <option value="es" lang="es">ES</option>
            <option value="en" lang="en">EN</option>
            <option value="fr" lang="fr">FR</option>
          </select>

          <select aria-label="Moneda" defaultValue="crc">
            <option value="crc">Colones (CRC)</option>
            <option value="usd">Dólares (USD)</option>
          </select>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <nav className="footer-seccion footer-compania" aria-labelledby="compania-heading">
          <h2 id="compania-heading">Compañía</h2>
          <ul>
            <li><a href="/politicas-privacidad">Políticas de privacidad</a></li>
            <li><a href="/terminos-uso">Términos de uso</a></li>
            <li><a href="/ayuda">Ayuda y preguntas frecuentes</a></li>
            <li><a href="/sobre-nosotros">Sobre nosotros</a></li>
          </ul>
        </nav>

        <section className="footer-seccion footer-redes" aria-labelledby="redes-heading">
          <h2 id="redes-heading">Redes sociales</h2>
          <ul>
            <li><a href="https://facebook.com/staybooker360">Facebook</a></li>
            <li><a href="https://instagram.com/staybooker360">Instagram</a></li>
            <li><a href="https://x.com/staybooker360">X</a></li>
            <li><a href="https://linkedin.com/company/staybooker360">LinkedIn</a></li>
          </ul>
        </section>

        <section className="footer-seccion footer-boletin" aria-labelledby="boletin-heading">
          <h2 id="boletin-heading">Boletín informativo</h2>
          <form>
            <label htmlFor="correo-boletin">Correo electrónico</label>
            <input type="email" id="correo-boletin" name="correo" required />
            <button type="submit">Suscribirse</button>
          </form>
        </section>

        <div className="footer-seccion footer-contacto" aria-labelledby="contacto-heading">
          <h2 id="contacto-heading">Contacto</h2>
          <address>
            <p>Correo: contacto@staybooker360.com</p>
            <p>Teléfono: +506 0000-0000</p>
            <p>San José, Costa Rica</p>
          </address>
        </div>

        <p className="footer-copyright">&copy; 2026 StayBooker 360. Todos los derechos reservados.</p>
      </footer>
    </>
  )
}
