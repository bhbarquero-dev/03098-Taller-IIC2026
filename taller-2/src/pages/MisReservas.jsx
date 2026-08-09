import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDataStore } from '../hooks/useDataStore'
import { useSesion } from '../context/SesionContext'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { MensajeExito } from '../components/MensajeCampo'
import { cancelarReserva, crearResena, obtenerPropiedad, obtenerResenas } from '../utils/dataStore'
import { CALIFICACIONES } from '../utils/catalogos'

const ESTADOS_PROXIMOS = ['pendiente', 'confirmada']

export default function MisReservas() {
  const { usuario } = useSesion()
  const { t, formatearFecha, formatearMoneda } = useIdioma()
  useTituloPagina('header.misReservas')

  const { datos: reservas, cargar } = useDataStore('reservas', { filtros: { usuarioId: usuario.id } })
  const [confirmando, setConfirmando] = useState(null)
  const [mensaje, setMensaje] = useState(null)

  const listado = reservas || []
  const proximas = listado.filter((reserva) => ESTADOS_PROXIMOS.includes(reserva.estado))
  const historial = listado.filter((reserva) => !ESTADOS_PROXIMOS.includes(reserva.estado))

  function confirmarCancelacion(id) {
    cancelarReserva(id, 'Cancelada por el huésped')
    setConfirmando(null)
    setMensaje(t('misReservas.canceladaExito'))
    cargar({ usuarioId: usuario.id })
  }

  function enviarResena(evento, reserva) {
    evento.preventDefault()
    const campos = new FormData(evento.target)
    crearResena({
      propiedadId: reserva.propiedadId,
      reservaId: reserva.id,
      usuarioId: usuario.id,
      autor: usuario.nombre,
      valoracion: Number(campos.get('calificacion')),
      comentario: campos.get('comentario')
    })
    setMensaje(t('misReservas.resenaExito'))
    cargar({ usuarioId: usuario.id })
  }

  function detallesReserva(reserva) {
    const propiedad = obtenerPropiedad(reserva.propiedadId)
    return (
      <>
        <h3>{propiedad ? `${propiedad.nombre} — ${propiedad.ubicacion}` : t('propiedad.noExiste')}</h3>
        <ul>
          <li>{t('misReservas.fechas', {
            entrada: formatearFecha(reserva.fechaEntrada),
            salida: formatearFecha(reserva.fechaSalida)
          })}</li>
          <li>{t('misReservas.huespedes', { n: reserva.huespedes })}</li>
          <li>{t('misReservas.total', { total: formatearMoneda(reserva.monto) })}</li>
          <li>{t('misReservas.estado', { estado: t(`estados.${reserva.estado}`) })}</li>
        </ul>
      </>
    )
  }

  return (
    <>
      <MensajeExito mensaje={mensaje} alOcultar={() => setMensaje(null)} />

      <section aria-labelledby="proximas-heading">
        <h2 id="proximas-heading">{t('misReservas.proximasTitulo')}</h2>

        {proximas.length === 0 && <p>{t('misReservas.sinProximas')}</p>}

        {proximas.map((reserva) => (
          <article className="tarjeta-reserva" key={reserva.id}>
            {detallesReserva(reserva)}
            <p>
              <Link to={`/propiedades/${reserva.propiedadId}`}>{t('misReservas.verDetalle')}</Link>
              {' · '}
              <Link to={`/reserva/${reserva.propiedadId}`}>{t('misReservas.modificar')}</Link>
            </p>

            {confirmando === reserva.id ? (
              <p className="confirmacion" role="alert">
                {t('misReservas.confirmarCancelar')}
                <span className="grupo-botones">
                  <button
                    type="button"
                    className="btn-peligro"
                    onClick={() => confirmarCancelacion(reserva.id)}
                  >
                    {t('comun.seguroSi')}
                  </button>
                  <button type="button" className="btn-secundario" onClick={() => setConfirmando(null)}>
                    {t('comun.seguroNo')}
                  </button>
                </span>
              </p>
            ) : (
              <p>
                <button type="button" className="btn-peligro" onClick={() => setConfirmando(reserva.id)}>
                  {t('misReservas.cancelar')}
                </button>
              </p>
            )}
          </article>
        ))}
      </section>

      <section aria-labelledby="historial-heading">
        <h2 id="historial-heading">{t('misReservas.historialTitulo')}</h2>

        {historial.length === 0 && <p>{t('misReservas.sinHistorial')}</p>}

        {historial.map((reserva) => {
          const resenaExistente = obtenerResenas({ reservaId: reserva.id, incluirBloqueadas: true })[0]

          return (
            <article className="tarjeta-reserva" key={reserva.id}>
              {detallesReserva(reserva)}
              <p><Link to={`/propiedades/${reserva.propiedadId}`}>{t('misReservas.verDetalle')}</Link></p>

              {reserva.estado === 'finalizada' && (
                resenaExistente ? (
                  <p>{t('misReservas.resenaPublicada', { comentario: resenaExistente.comentario })}</p>
                ) : (
                  <form onSubmit={(evento) => enviarResena(evento, reserva)}>
                    <fieldset>
                      <legend>{t('misReservas.resenaLeyenda')}</legend>

                      <label htmlFor={`resena-calificacion-${reserva.id}`}>{t('misReservas.calificacion')}</label>
                      <select id={`resena-calificacion-${reserva.id}`} name="calificacion" defaultValue="5">
                        {CALIFICACIONES.map((valor) => (
                          <option value={valor} key={valor}>{t(`misReservas.calificacion${valor}`)}</option>
                        ))}
                      </select>

                      <label htmlFor={`resena-comentario-${reserva.id}`}>{t('misReservas.comentario')}</label>
                      <textarea
                        id={`resena-comentario-${reserva.id}`}
                        name="comentario"
                        rows="3"
                        maxLength={500}
                        required
                      />

                      <button type="submit" className="btn-primario">{t('misReservas.enviarResena')}</button>
                    </fieldset>
                  </form>
                )
              )}
            </article>
          )
        })}
      </section>
    </>
  )
}
