import { Link, useLocation } from 'react-router-dom'
import { useDataStore } from '../hooks/useDataStore'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'

/** Número de comprobante legible, derivado del id de la reserva. */
function numeroComprobante(id) {
  return `SB360-${String(id).padStart(6, '0')}`
}

export default function ReservaConfirmacion() {
  const location = useLocation()
  const { t, formatearMoneda, formatearFecha } = useIdioma()
  useTituloPagina('reserva.confirmacionTitulo')

  const reservaId = location.state?.reservaId
  const { datos: reserva } = useDataStore('reserva', { id: reservaId })
  const { datos: propiedad } = useDataStore('propiedad', { id: reserva?.propiedadId })

  if (!reservaId) {
    return (
      <section aria-labelledby="confirmacion-heading">
        <h2 id="confirmacion-heading">{t('reserva.confirmacionTitulo')}</h2>
        <p>{t('reserva.sinDatos')}</p>
        <p><Link className="btn-primario" to="/catalogo">{t('propiedad.volverCatalogo')}</Link></p>
      </section>
    )
  }

  if (!reserva || !propiedad) {
    return <section><p>{t('comun.cargando')}</p></section>
  }

  return (
    <section aria-labelledby="confirmacion-heading">
      <h2 id="confirmacion-heading">{t('reserva.confirmacionTitulo')}</h2>

      <article>
        <h3>{t('reserva.comprobanteTitulo')}</h3>
        <ul>
          <li>{t('reserva.numeroConfirmacion', { numero: numeroComprobante(reserva.id) })}</li>
          <li>{t('reserva.alojamiento', {
            nombre: propiedad.nombre,
            ubicacion: propiedad.ubicacion
          })}</li>
          <li>{t('reserva.resumenEntrada', { fecha: formatearFecha(reserva.fechaEntrada) })}</li>
          <li>{t('reserva.resumenSalida', { fecha: formatearFecha(reserva.fechaSalida) })}</li>
          <li>{t('reserva.resumenHuespedes', { n: reserva.huespedes })}</li>
          <li>{t('reserva.total', { total: formatearMoneda(reserva.monto) })}</li>
          <li>{t('reserva.estadoReserva', { estado: t(`estados.${reserva.estado}`) })}</li>
        </ul>
      </article>

      <p><Link to="/mis-reservas">{t('reserva.verMisReservas')}</Link></p>
    </section>
  )
}
