import { useState } from 'react'
import { useSesion } from '../context/SesionContext'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import { MensajeExito } from '../components/MensajeCampo'
import EtiquetaEstado from '../components/EtiquetaEstado'
import {
  aceptarReserva,
  finalizarReserva,
  obtenerPropiedad,
  obtenerUsuario,
  rechazarReserva
} from '../utils/dataStore'

export default function AnfitrionReservas() {
  const { usuario } = useSesion()
  const { t, formatearFecha, formatearMoneda } = useIdioma()
  useTituloPagina('anfitrion.reservasTitulo')

  const { datos: reservas, cargar } = useDataStore('reservas', { filtros: { anfitrionId: usuario.id } })
  const [mensaje, setMensaje] = useState(null)

  const listado = reservas || []
  const pendientes = listado.filter((reserva) => reserva.estado === 'pendiente')
  const confirmadas = listado.filter((reserva) => reserva.estado === 'confirmada')
  const historial = listado.filter((reserva) => ['finalizada', 'cancelada'].includes(reserva.estado))

  function ejecutar(accion, id, claveMensaje) {
    accion(id)
    setMensaje(t(claveMensaje))
    cargar({ anfitrionId: usuario.id })
  }

  function tarjeta(reserva, acciones) {
    const propiedad = obtenerPropiedad(reserva.propiedadId)
    const huesped = obtenerUsuario(reserva.usuarioId)

    return (
      <article className="tarjeta-panel" key={reserva.id}>
        <h4>{propiedad?.nombre || t('propiedad.noExiste')}</h4>
        <ul>
          <li>{t('anfitrion.datosReserva', {
            entrada: formatearFecha(reserva.fechaEntrada, 'medium'),
            salida: formatearFecha(reserva.fechaSalida, 'medium'),
            huespedes: reserva.huespedes,
            monto: formatearMoneda(reserva.monto)
          })}</li>
          <li>{t('anfitrion.huespedNombre', { nombre: huesped?.nombre || '—' })}</li>
          <li><EtiquetaEstado estado={reserva.estado} /></li>
        </ul>
        {acciones}
      </article>
    )
  }

  return (
    <>
      <h2>{t('anfitrion.reservasTitulo')}</h2>

      <MensajeExito mensaje={mensaje} alOcultar={() => setMensaje(null)} />

      <section aria-labelledby="pendientes-heading">
        <h3 id="pendientes-heading">{t('anfitrion.solicitudesPendientes')}</h3>

        {pendientes.length === 0 && <p>{t('anfitrion.sinSolicitudes')}</p>}

        {pendientes.map((reserva) => tarjeta(reserva, (
          <p className="acciones-fila">
            <button
              type="button"
              className="btn-exito"
              onClick={() => ejecutar(aceptarReserva, reserva.id, 'anfitrion.reservaAceptada')}
            >
              {t('anfitrion.aceptar')}
            </button>
            <button
              type="button"
              className="btn-peligro"
              onClick={() => ejecutar(rechazarReserva, reserva.id, 'anfitrion.reservaRechazada')}
            >
              {t('anfitrion.rechazar')}
            </button>
          </p>
        )))}
      </section>

      <section aria-labelledby="confirmadas-heading">
        <h3 id="confirmadas-heading">{t('anfitrion.reservasConfirmadas')}</h3>

        {confirmadas.length === 0 && <p>{t('anfitrion.sinConfirmadas')}</p>}

        {confirmadas.map((reserva) => tarjeta(reserva, (
          <p className="acciones-fila">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => ejecutar(finalizarReserva, reserva.id, 'anfitrion.reservaFinalizada')}
            >
              {t('anfitrion.finalizar')}
            </button>
          </p>
        )))}
      </section>

      <section aria-labelledby="historial-heading">
        <h3 id="historial-heading">{t('anfitrion.historial')}</h3>

        {historial.length === 0 && <p>{t('anfitrion.sinHistorial')}</p>}

        {historial.map((reserva) => tarjeta(reserva, null))}
      </section>
    </>
  )
}
