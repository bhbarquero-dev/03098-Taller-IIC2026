import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'

export default function Promociones() {
  const { t, formatearFecha } = useIdioma()
  useTituloPagina('promociones.titulo')

  const { datos: promociones, cargando } = useDataStore('promociones', { filtros: { estado: 'activa' } })
  const listado = promociones || []

  return (
    <section aria-labelledby="promociones-heading">
      <h2 id="promociones-heading">{t('promociones.titulo')}</h2>

      {cargando && <p>{t('comun.cargando')}</p>}
      {!cargando && listado.length === 0 && <p>{t('promociones.sinPromociones')}</p>}

      {listado.map((promocion) => {
        const participantes = promocion.propiedadesParticipantes || []
        const destino = participantes.length > 0
          ? `/catalogo?promocion=${promocion.id}`
          : '/catalogo'

        return (
          <article key={promocion.id} className="tarjeta-promocion">
            <h3>{promocion.titulo}</h3>
            <p>{promocion.descripcion}</p>
            <p>{promocion.beneficio}</p>
            <p>
              <time dateTime={promocion.vigenciaInicio}>
                {t('promociones.vigencia', {
                  inicio: formatearFecha(promocion.vigenciaInicio),
                  fin: formatearFecha(promocion.vigenciaFin)
                })}
              </time>
            </p>
            <Link to={destino}>
              {participantes.length > 0
                ? t('promociones.verParticipantes')
                : t('promociones.verAlojamientos')}
            </Link>
          </article>
        )
      })}
    </section>
  )
}
