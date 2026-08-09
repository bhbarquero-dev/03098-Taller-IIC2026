import { Link } from 'react-router-dom'
import { useSesion } from '../context/SesionContext'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'

export default function AnfitrionPanel() {
  const { usuario } = useSesion()
  const { t, formatearNumero } = useIdioma()
  useTituloPagina('anfitrion.panelTitulo')

  const { datos: propiedades } = useDataStore('propiedades', {
    filtros: { incluirTodas: true, anfitrionId: usuario.id }
  })
  const { datos: reservas } = useDataStore('reservas', { filtros: { anfitrionId: usuario.id } })
  const { datos: consultas } = useDataStore('consultas', {
    filtros: { anfitrionId: usuario.id, estado: 'pendiente' }
  })

  const listaPropiedades = propiedades || []
  const valoraciones = listaPropiedades.filter((propiedad) => propiedad.valoracion > 0)
  const promedio = valoraciones.length > 0
    ? (valoraciones.reduce((suma, propiedad) => suma + propiedad.valoracion, 0) / valoraciones.length).toFixed(1)
    : '—'

  return (
    <>
      <h2>{t('anfitrion.panelTitulo')}</h2>

      <section className="panel-resumen" aria-labelledby="resumen-heading">
        <h3 id="resumen-heading">{t('anfitrion.resumen')}</h3>
        <ul>
          <li>
            <span className="dato-destacado">{formatearNumero(listaPropiedades.length)}</span>
            {t('anfitrion.totalPropiedades')}
          </li>
          <li>
            <span className="dato-destacado">{formatearNumero((reservas || []).length)}</span>
            {t('anfitrion.reservasRecibidas')}
          </li>
          <li>
            <span className="dato-destacado">{formatearNumero((consultas || []).length)}</span>
            {t('anfitrion.consultasPendientes')}
          </li>
          <li>
            <span className="dato-destacado">{promedio}</span>
            {t('anfitrion.valoracionPromedio')}
          </li>
        </ul>
      </section>

      <section className="panel-accesos" aria-labelledby="accesos-heading">
        <h3 id="accesos-heading">{t('anfitrion.accesos')}</h3>
        <ul>
          <li><Link to="/anfitrion-propiedades">{t('anfitrion.misPropiedades')}</Link></li>
          <li><Link to="/anfitrion-reservas">{t('anfitrion.reservasTitulo')}</Link></li>
          <li><Link to="/anfitrion-consultas">{t('anfitrion.consultasHuespedes')}</Link></li>
        </ul>
      </section>
    </>
  )
}
