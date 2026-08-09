import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'

export default function AdminPanel() {
  const { t, formatearNumero } = useIdioma()
  useTituloPagina('admin.panelTitulo')

  const { datos: usuarios } = useDataStore('usuarios')
  const { datos: propiedades } = useDataStore('propiedades', { filtros: { incluirTodas: true } })
  const { datos: reservas } = useDataStore('reservas')
  const { datos: incidencias } = useDataStore('incidencias')

  const listaPropiedades = propiedades || []
  const pendientes = listaPropiedades.filter((propiedad) => propiedad.estado === 'pendiente')

  return (
    <>
      <h2>{t('admin.panelTitulo')}</h2>

      <section className="panel-resumen" aria-labelledby="resumen-heading">
        <h3 id="resumen-heading">{t('admin.resumen')}</h3>
        <ul>
          <li>
            <span className="dato-destacado">{formatearNumero((usuarios || []).length)}</span>
            {t('admin.totalUsuarios')}
          </li>
          <li>
            <span className="dato-destacado">{formatearNumero(listaPropiedades.length)}</span>
            {t('admin.totalAlojamientos')}
          </li>
          <li>
            <span className="dato-destacado">{formatearNumero(pendientes.length)}</span>
            {t('admin.pendientesAprobacion')}
          </li>
          <li>
            <span className="dato-destacado">{formatearNumero((reservas || []).length)}</span>
            {t('admin.totalReservas')}
          </li>
          <li>
            <span className="dato-destacado">{formatearNumero((incidencias || []).length)}</span>
            {t('admin.incidencias')}
          </li>
        </ul>
      </section>

      <section className="panel-accesos" aria-labelledby="accesos-heading">
        <h3 id="accesos-heading">{t('admin.accesos')}</h3>
        <ul>
          <li><Link to="/admin-usuarios">{t('admin.gestionUsuarios')}</Link></li>
          <li><Link to="/admin-alojamientos">{t('admin.gestionAlojamientos')}</Link></li>
          <li><Link to="/admin-promociones">{t('admin.gestionPromociones')}</Link></li>
          <li><Link to="/admin-blog">{t('admin.gestionBlog')}</Link></li>
          <li><Link to="/admin-reservas">{t('admin.reservasPagos')}</Link></li>
          <li><Link to="/admin-reportes">{t('admin.reportes')}</Link></li>
        </ul>
      </section>
    </>
  )
}
