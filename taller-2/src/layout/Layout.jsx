import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header>
        <h1>StayBooker 360</h1>
        <nav aria-label="Navegación del sitio">
          <ul>
            <li><NavLink to="/registro">Regístrate</NavLink></li>
            <li><NavLink to="/inicio-sesion">Iniciar sesión</NavLink></li>
            <li><NavLink to="/perfil">Perfil</NavLink></li>
            <li><NavLink to="/mis-reservas">Mis reservas</NavLink></li>
          </ul>

          <ul>
            <li><NavLink to="/">Inicio</NavLink></li>
            <li><NavLink to="/catalogo">Explorar</NavLink></li>
            <li><NavLink to="/promociones">Promociones</NavLink></li>
            <li><NavLink to="/blog">Blog</NavLink></li>
            <li><NavLink to="/ayuda">Ayuda</NavLink></li>
          </ul>

          <ul>
            <li><a href="#es" hrefLang="es">ES</a></li>
            <li><a href="#en" hrefLang="en">EN</a></li>
            <li><a href="#fr" hrefLang="fr">FR</a></li>
            <li><a href="#crc">CRC</a></li>
            <li><a href="#usd">USD</a></li>
          </ul>
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
