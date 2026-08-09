import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDataStore } from '../hooks/useDataStore'
import { useSesion } from '../context/SesionContext'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { crearReserva, obtenerPromocion } from '../utils/dataStore'

export default function ReservaResumen() {
  const location = useLocation()
  const navigate = useNavigate()
  const { usuario } = useSesion()
  const { t, formatearMoneda, formatearFecha } = useIdioma()
  useTituloPagina('reserva.resumenTitulo')

  const datosReserva = location.state?.reserva
  const { datos: propiedad } = useDataStore('propiedad', { id: datosReserva?.propiedadId })

  // Entrar directo a la URL sin haber pasado por el formulario no tiene sentido.
  if (!datosReserva) {
    return (
      <section aria-labelledby="resumen-heading">
        <h2 id="resumen-heading">{t('reserva.resumenTitulo')}</h2>
        <p>{t('reserva.sinDatos')}</p>
        <p><Link className="btn-primario" to="/catalogo">{t('propiedad.volverCatalogo')}</Link></p>
      </section>
    )
  }

  if (!propiedad) {
    return <section><p>{t('comun.cargando')}</p></section>
  }

  const promocion = propiedad.promocionId ? obtenerPromocion(propiedad.promocionId) : null
  const descuento = promocion && promocion.estado === 'activa' ? promocion.descuento : 0
  const subtotal = datosReserva.noches * propiedad.precioNoche
  const total = Math.round(subtotal * (1 - descuento / 100))

  function confirmar(evento) {
    evento.preventDefault()

    const reserva = crearReserva({
      propiedadId: propiedad.id,
      anfitrionId: propiedad.anfitrionId,
      usuarioId: usuario.id,
      fechaEntrada: datosReserva.entrada,
      fechaSalida: datosReserva.salida,
      huespedes: datosReserva.huespedes,
      monto: total,
      estado: 'pendiente',
      estadoPago: 'pendiente'
    })

    navigate('/reserva-confirmacion', { state: { reservaId: reserva.id } })
  }

  return (
    <section aria-labelledby="resumen-heading">
      <h2 id="resumen-heading">{t('reserva.resumenTitulo')}</h2>

      <article>
        <h3>{propiedad.nombre} — {propiedad.ubicacion}</h3>
        <ul>
          <li>{t('reserva.resumenEntrada', { fecha: formatearFecha(datosReserva.entrada) })}</li>
          <li>{t('reserva.resumenSalida', { fecha: formatearFecha(datosReserva.salida) })}</li>
          <li>{t('reserva.resumenHuespedes', { n: datosReserva.huespedes })}</li>
          <li>{t('reserva.resumenNoches', {
            noches: datosReserva.noches,
            precio: formatearMoneda(propiedad.precioNoche)
          })}</li>
          {descuento > 0 && (
            <li>{t('reserva.resumenDescuento', { titulo: promocion.titulo, descuento })}</li>
          )}
          <li>{t('reserva.resumenTotal', { total: formatearMoneda(total) })}</li>
          <li>{t('reserva.resumenPago', { digitos: datosReserva.ultimosDigitos })}</li>
          <li>{t('reserva.resumenCancelacion', { politica: propiedad.politicaCancelacion })}</li>
        </ul>
      </article>

      <p>
        <Link to={`/reserva/${propiedad.id}`} state={{ reserva: datosReserva }}>
          {t('reserva.modificar')}
        </Link>
      </p>

      <form onSubmit={confirmar}>
        <button type="submit" className="btn-primario">{t('reserva.confirmar')}</button>
      </form>
    </section>
  )
}
