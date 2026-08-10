import { Fragment, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDataStore } from '../hooks/useDataStore'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import TarjetaPropiedad from '../components/TarjetaPropiedad'
import { SERVICIOS_FILTRO, TIPOS_ALOJAMIENTO, claveServicio, claveTipo } from '../utils/catalogos'

export default function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useIdioma()
  useTituloPagina('catalogo.titulo')

  const { datos: propiedades, cargando, cargar } = useDataStore('propiedades')
  const { datos: promociones } = useDataStore('promociones')

  const consulta = searchParams.toString()

  useEffect(() => {
    cargar({
      destino: searchParams.get('destino') || undefined,
      tipo: searchParams.get('tipo') || undefined,
      precioMin: searchParams.get('precio_min') || undefined,
      precioMax: searchParams.get('precio_max') || undefined,
      capacidad: searchParams.get('capacidad') || undefined,
      valoracionMin: searchParams.get('valoracion_min') || undefined,
      promocionId: searchParams.get('promocion') || undefined,
      servicios: searchParams.getAll('servicios')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consulta, cargar])

  function aplicarFiltros(evento) {
    evento.preventDefault()
    const campos = new FormData(evento.target)
    const parametros = new URLSearchParams()
    for (const [clave, valor] of campos.entries()) {
      if (valor) parametros.append(clave, valor)
    }
    setSearchParams(parametros)
  }

  const resultados = propiedades || []
  const serviciosActivos = searchParams.getAll('servicios')
  const promocionActiva = useMemo(() => {
    const id = searchParams.get('promocion')
    return id ? (promociones || []).find((p) => p.id === Number(id)) : null
  }, [searchParams, promociones])

  return (
    <>
      <h2>{t('catalogo.titulo')}</h2>

      {promocionActiva && (
        <p className="promocion-activa">{promocionActiva.titulo} — {promocionActiva.beneficio}</p>
      )}

      <aside className="filtro-aside" aria-labelledby="filtro-heading">
        <h3 id="filtro-heading">{t('catalogo.filtrarTitulo')}</h3>

        <form onSubmit={aplicarFiltros}>
          <fieldset>
            <legend>{t('catalogo.filtros')}</legend>

            <label htmlFor="filtro-tipo">{t('catalogo.tipo')}</label>
            <select id="filtro-tipo" name="tipo" defaultValue={searchParams.get('tipo') || ''}>
              <option value="">{t('catalogo.cualquiera')}</option>
              {TIPOS_ALOJAMIENTO.map((tipo) => (
                <option value={tipo} key={tipo}>{t(claveTipo(tipo))}</option>
              ))}
            </select>

            <label htmlFor="filtro-precio-min">{t('catalogo.precioMin')}</label>
            <input type="number" id="filtro-precio-min" name="precio_min" min="0" defaultValue={searchParams.get('precio_min') || ''} />

            <label htmlFor="filtro-precio-max">{t('catalogo.precioMax')}</label>
            <input type="number" id="filtro-precio-max" name="precio_max" min="0" defaultValue={searchParams.get('precio_max') || ''} />

            <label htmlFor="filtro-capacidad">{t('catalogo.capacidad')}</label>
            <input type="number" id="filtro-capacidad" name="capacidad" min="1" defaultValue={searchParams.get('capacidad') || ''} />

            <label htmlFor="filtro-destino">{t('catalogo.destino')}</label>
            <input type="text" id="filtro-destino" name="destino" placeholder={t('catalogo.destinoPlaceholder')} defaultValue={searchParams.get('destino') || ''} />

            <label htmlFor="filtro-promocion">{t('catalogo.promocion')}</label>
            <select id="filtro-promocion" name="promocion" defaultValue={searchParams.get('promocion') || ''}>
              <option value="">{t('catalogo.cualquiera')}</option>
              {(promociones || []).map((promocion) => (
                <option value={promocion.id} key={promocion.id}>{promocion.titulo}</option>
              ))}
            </select>

            <label htmlFor="filtro-valoracion">{t('catalogo.valoracion')}</label>
            <select id="filtro-valoracion" name="valoracion_min" defaultValue={searchParams.get('valoracion_min') || ''}>
              <option value="">{t('catalogo.cualquiera')}</option>
              <option value="4">{t('catalogo.valoracion4')}</option>
              <option value="4.5">{t('catalogo.valoracion45')}</option>
              <option value="5">{t('catalogo.valoracion5')}</option>
            </select>

            <fieldset>
              <legend>{t('catalogo.serviciosLeyenda')}</legend>

              {SERVICIOS_FILTRO.map((servicio) => (
                <Fragment key={servicio}>
                  <input
                    type="checkbox"
                    id={`filtro-${servicio}`}
                    name="servicios"
                    value={servicio}
                    defaultChecked={serviciosActivos.includes(servicio)}
                  />
                  <label htmlFor={`filtro-${servicio}`}>{t(claveServicio(servicio))}</label>
                </Fragment>
              ))}
            </fieldset>

            <button type="submit" className="btn-primario">{t('catalogo.aplicar')}</button>
            <Link className="btn-secundario" to="/catalogo">{t('catalogo.limpiar')}</Link>
          </fieldset>
        </form>
      </aside>

      <section className="resultados-lista" aria-labelledby="resultados-heading">
        <h3 id="resultados-heading">{t('catalogo.resultados')}</h3>

        {cargando && <p>{t('comun.cargando')}</p>}

        {!cargando && resultados.length === 0 && <p>{t('catalogo.sinResultados')}</p>}

        {!cargando && resultados.length > 0 && (
          <p>{t('catalogo.contador', { n: resultados.length })}</p>
        )}

        {resultados.map((propiedad) => (
          <TarjetaPropiedad propiedad={propiedad} key={propiedad.id} />
        ))}
      </section>
    </>
  )
}
