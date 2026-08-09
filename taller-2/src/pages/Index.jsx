import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDataStore } from '../hooks/useDataStore'
import { useSesion } from '../context/SesionContext'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import TarjetaPropiedad from '../components/TarjetaPropiedad'
import { MensajeError } from '../components/MensajeCampo'
import { TIPOS_DESTACADOS, claveTipo, claveTipoDescripcion } from '../utils/catalogos'
import { fechaNoPasada, fechaPosterior } from '../utils/validaciones'

export default function Index() {
  const navigate = useNavigate()
  const { t } = useIdioma()
  const { usuario } = useSesion()
  useTituloPagina('inicio.heroTitulo')

  const { datos: propiedades } = useDataStore('propiedades')
  const { datos: promociones } = useDataStore('promociones', { filtros: { estado: 'activa' } })

  const [errores, setErrores] = useState({})
  const refEntrada = useRef(null)
  const refSalida = useRef(null)

  const destacadas = (propiedades || []).slice(0, 4)
  const recomendadas = (propiedades || []).slice(4, 8)

  function buscar(evento) {
    evento.preventDefault()
    const campos = new FormData(evento.target)
    const entrada = campos.get('entrada')
    const salida = campos.get('salida')

    // Solo se validan las fechas si el usuario las escribió: el buscador
    // funciona igual con una búsqueda únicamente por destino.
    const erroresEncontrados = {}
    if (entrada) erroresEncontrados.entrada = fechaNoPasada(entrada)
    if (salida) erroresEncontrados.salida = fechaPosterior(entrada, salida)

    const limpios = Object.fromEntries(
      Object.entries(erroresEncontrados).filter(([, error]) => error)
    )
    setErrores(limpios)

    if (limpios.entrada) return refEntrada.current?.focus()
    if (limpios.salida) return refSalida.current?.focus()

    const parametros = new URLSearchParams()
    for (const [clave, valor] of campos.entries()) {
      if (valor) parametros.set(clave, valor)
    }
    navigate(`/catalogo?${parametros.toString()}`)
  }

  return (
    <>
      <section aria-labelledby="hero-heading">
        <h2 id="hero-heading">{t('inicio.heroTitulo')}</h2>
        <p>{t('inicio.heroTexto')}</p>

        <form className="formulario-busqueda" onSubmit={buscar} noValidate>
          <fieldset>
            <legend>{t('inicio.buscarLeyenda')}</legend>

            <label htmlFor="busqueda-destino">{t('inicio.destino')}</label>
            <input
              type="text"
              id="busqueda-destino"
              name="destino"
              placeholder={t('inicio.destinoPlaceholder')}
            />

            <label htmlFor="busqueda-entrada">{t('inicio.entrada')}</label>
            <input
              type="date"
              id="busqueda-entrada"
              name="entrada"
              ref={refEntrada}
              className={errores.entrada ? 'campo-invalido' : undefined}
              aria-describedby={errores.entrada ? 'busqueda-entrada-error' : undefined}
            />
            <MensajeError error={errores.entrada} id="busqueda-entrada-error" />

            <label htmlFor="busqueda-salida">{t('inicio.salida')}</label>
            <input
              type="date"
              id="busqueda-salida"
              name="salida"
              ref={refSalida}
              className={errores.salida ? 'campo-invalido' : undefined}
              aria-describedby={errores.salida ? 'busqueda-salida-error' : undefined}
            />
            <MensajeError error={errores.salida} id="busqueda-salida-error" />

            <label htmlFor="busqueda-huespedes">{t('inicio.huespedes')}</label>
            <input type="number" id="busqueda-huespedes" name="huespedes" min="1" />

            <button type="submit">{t('inicio.buscar')}</button>
          </fieldset>
        </form>
      </section>

      <section className="destacados" aria-labelledby="destacados-heading">
        <h2 id="destacados-heading">{t('inicio.destacadosTitulo')}</h2>

        <h3>{t('inicio.propiedades')}</h3>

        {destacadas.map((propiedad) => (
          <TarjetaPropiedad propiedad={propiedad} key={propiedad.id} />
        ))}

        <h3>{t('inicio.promociones')}</h3>

        {(promociones || []).map((promocion) => (
          <article className="tarjeta-promocion" key={promocion.id}>
            <p className="tarjeta-promocion-badge">
              {promocion.descuento > 0 ? `-${promocion.descuento}%` : t('inicio.promocionNueva')}
            </p>
            <h4>{promocion.titulo}</h4>
            <p>{promocion.descripcion}</p>
          </article>
        ))}
      </section>

      <section className="tipos-lista" aria-labelledby="tipos-heading">
        <h2 id="tipos-heading">{t('inicio.tiposTitulo')}</h2>
        {TIPOS_DESTACADOS.map((tipo) => (
          <article className="tarjeta-tipo" key={tipo}>
            <h3><Link to={`/catalogo?tipo=${tipo}`}>{t(claveTipo(tipo))}</Link></h3>
            <p>{t(claveTipoDescripcion(tipo))}</p>
          </article>
        ))}
      </section>

      <section className="banner-anfitrion" aria-labelledby="anfitrion-heading">
        <h2 id="anfitrion-heading">{t('inicio.anfitrionTitulo')}</h2>
        <p>{t('inicio.anfitrionTexto')}</p>
        <Link className="btn-primario" to="/publicar-propiedad">{t('inicio.anfitrionBoton')}</Link>
      </section>

      <section className="recomendaciones" aria-labelledby="recos-heading">
        <h2 id="recos-heading">{t('inicio.recomendadosTitulo')}</h2>

        {usuario && <p>{t('inicio.saludoRegresa', { nombre: usuario.nombre })}</p>}

        {recomendadas.map((propiedad) => (
          <TarjetaPropiedad propiedad={propiedad} key={propiedad.id} />
        ))}
      </section>
    </>
  )
}
