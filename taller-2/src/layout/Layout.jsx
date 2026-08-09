import { useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import { useIdioma } from '../context/IdiomaContext'
import { useEfectoMenu } from '../hooks/useEfectoMenu'
import { MensajeError, MensajeExito } from '../components/MensajeCampo'
import { correoValido } from '../utils/validaciones'

export default function Layout() {
  const { usuario, estaAutenticado, cerrarSesion } = useSesion()
  const { t, idioma, cambiarIdioma, moneda, cambiarMoneda } = useIdioma()
  const navigate = useNavigate()

  // Referencia al nodo real del menú: sobre él se registran los escuchadores
  // nativos mouseover/mouseout que pide el enunciado.
  const refNav = useRef(null)
  useEfectoMenu(refNav)

  const [correoBoletin, setCorreoBoletin] = useState('')
  const [errorBoletin, setErrorBoletin] = useState(null)
  const [exitoBoletin, setExitoBoletin] = useState(null)
  const refBoletin = useRef(null)

  function manejarBoletin(evento) {
    evento.preventDefault()
    setExitoBoletin(null)

    const error = correoValido(correoBoletin)
    setErrorBoletin(error)
    if (error) {
      refBoletin.current?.focus()
      return
    }

    setExitoBoletin(t('footer.boletinExito', { correo: correoBoletin }))
    setCorreoBoletin('')
  }

  function manejarCerrarSesion() {
    cerrarSesion()
    navigate('/')
  }

  return (
    <>
      <header>
        <h1>{t('header.titulo')}</h1>
        <nav ref={refNav} aria-label={t('header.navegacion')}>
          <ul>
            {estaAutenticado ? (
              <>
                <li className="saludo-usuario">{t('header.saludo', { nombre: usuario.nombre })}</li>
                <li><NavLink to="/perfil">{t('header.perfil')}</NavLink></li>
                <li><NavLink to="/mis-reservas">{t('header.misReservas')}</NavLink></li>
                <li>
                  <button type="button" className="btn-enlace" onClick={manejarCerrarSesion}>
                    {t('header.cerrarSesion')}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><NavLink to="/registro">{t('header.registrate')}</NavLink></li>
                <li><NavLink to="/inicio-sesion">{t('header.iniciarSesion')}</NavLink></li>
              </>
            )}
          </ul>

          <ul>
            <li><NavLink to="/">{t('header.inicio')}</NavLink></li>
            <li><NavLink to="/catalogo">{t('header.explorar')}</NavLink></li>
            <li><NavLink to="/promociones">{t('header.promociones')}</NavLink></li>
            <li><NavLink to="/blog">{t('header.blog')}</NavLink></li>
            <li><NavLink to="/ayuda">{t('header.ayuda')}</NavLink></li>
          </ul>

          <select
            aria-label={t('header.idioma')}
            value={idioma}
            onChange={(evento) => cambiarIdioma(evento.target.value)}
          >
            <option value="es" lang="es">ES</option>
            <option value="en" lang="en">EN</option>
          </select>

          <select
            aria-label={t('header.moneda')}
            value={moneda}
            onChange={(evento) => cambiarMoneda(evento.target.value)}
          >
            <option value="crc">{t('header.monedaCrc')}</option>
            <option value="usd">{t('header.monedaUsd')}</option>
          </select>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <nav className="footer-seccion footer-compania" aria-labelledby="compania-heading">
          <h2 id="compania-heading">{t('footer.compania')}</h2>
          <ul>
            <li><Link to="/politicas-privacidad">{t('footer.politicas')}</Link></li>
            <li><Link to="/terminos-uso">{t('footer.terminos')}</Link></li>
            <li><Link to="/ayuda">{t('footer.ayudaFaq')}</Link></li>
            <li><Link to="/sobre-nosotros">{t('footer.sobreNosotros')}</Link></li>
          </ul>
        </nav>

        <section className="footer-seccion footer-redes" aria-labelledby="redes-heading">
          <h2 id="redes-heading">{t('footer.redes')}</h2>
          <ul>
            <li><a href="https://facebook.com/staybooker360" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://instagram.com/staybooker360" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://x.com/staybooker360" rel="noopener noreferrer">X</a></li>
            <li><a href="https://linkedin.com/company/staybooker360" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </section>

        <section className="footer-seccion footer-boletin" aria-labelledby="boletin-heading">
          <h2 id="boletin-heading">{t('footer.boletin')}</h2>
          <form onSubmit={manejarBoletin} noValidate>
            <label htmlFor="correo-boletin">{t('footer.correoBoletin')}</label>
            <input
              type="email"
              id="correo-boletin"
              name="correo"
              value={correoBoletin}
              onChange={(evento) => setCorreoBoletin(evento.target.value)}
              ref={refBoletin}
              className={errorBoletin ? 'campo-invalido' : undefined}
              aria-describedby={errorBoletin ? 'correo-boletin-error' : undefined}
              required
            />
            <MensajeError error={errorBoletin} id="correo-boletin-error" />
            <MensajeExito mensaje={exitoBoletin} alOcultar={() => setExitoBoletin(null)} />
            <button type="submit">{t('footer.suscribirse')}</button>
          </form>
        </section>

        <address>
          <p>{t('footer.contactoCorreo')}</p>
          <p>{t('footer.contactoTelefono')}</p>
          <p>{t('footer.contactoDireccion')}</p>
        </address>

        <p className="footer-copyright">{t('footer.copyright')}</p>
      </footer>
    </>
  )
}
