import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError, MensajeExito } from '../components/MensajeCampo'
import EtiquetaEstado from '../components/EtiquetaEstado'
import SeccionIncidencias from '../components/SeccionIncidencias'
import { actualizarReserva, obtenerPropiedad, obtenerUsuario } from '../utils/dataStore'
import { numeroEnRango, requerido, textoMaximo, validar } from '../utils/validaciones'

export default function AdminReservaEditar() {
  const { id } = useParams()
  const { t, formatearFecha, formatearMoneda } = useIdioma()
  useTituloPagina('admin.reservasTitulo')

  const { datos: reserva, cargar } = useDataStore('reserva', { id })
  const [estadoPago, setEstadoPago] = useState('pendiente')
  const [mensajePago, setMensajePago] = useState(null)

  const cancelacion = useFormulario({
    prefijoId: 'cancelacion',
    valoresIniciales: { decision_cancelacion: 'aprobada', motivo_cancelacion: '' },
    validarValores: (v) => validar({
      motivo_cancelacion: requerido(v.motivo_cancelacion) || textoMaximo(v.motivo_cancelacion)
    }),
    alEnviar: (v, { setExito }) => {
      actualizarReserva(id, {
        decisionCancelacion: v.decision_cancelacion,
        motivoCancelacionAdmin: v.motivo_cancelacion.trim()
      })
      cargar()
      setExito(t('admin.cancelacionExito'))
    }
  })

  const reembolso = useFormulario({
    prefijoId: 'reembolso',
    valoresIniciales: { decision_reembolso: 'aprobado', monto_reembolso: '', motivo_reembolso: '' },
    validarValores: (v) => validar({
      monto_reembolso: v.decision_reembolso === 'aprobado'
        ? numeroEnRango(v.monto_reembolso, { min: 0, max: reserva?.monto })
        : null,
      motivo_reembolso: requerido(v.motivo_reembolso) || textoMaximo(v.motivo_reembolso)
    }),
    alEnviar: (v, { setExito }) => {
      actualizarReserva(id, {
        decisionReembolso: v.decision_reembolso,
        montoReembolso: v.decision_reembolso === 'aprobado' ? Number(v.monto_reembolso) : 0,
        motivoReembolso: v.motivo_reembolso.trim(),
        ...(v.decision_reembolso === 'aprobado' ? { estadoPago: 'reembolsado' } : {})
      })
      cargar()
      setExito(t('admin.reembolsoExito'))
    }
  })

  useEffect(() => {
    if (!reserva) return
    setEstadoPago(reserva.estadoPago || 'pendiente')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reserva?.id])

  if (!reserva) {
    return (
      <section aria-labelledby="reserva-heading">
        <h2 id="reserva-heading">{t('admin.reservasTitulo')}</h2>
        <p>{t('comun.sinDatos')}</p>
        <p><Link to="/admin-reservas">{t('comun.volver')}</Link></p>
      </section>
    )
  }

  function guardarPago(evento) {
    evento.preventDefault()
    actualizarReserva(id, { estadoPago })
    cargar()
    setMensajePago(t('admin.pagoExito'))
  }

  const propiedad = obtenerPropiedad(reserva.propiedadId)
  const huesped = obtenerUsuario(reserva.usuarioId)
  const anfitrion = obtenerUsuario(reserva.anfitrionId)

  return (
    <>
      <section aria-labelledby="reserva-heading">
        <h2 id="reserva-heading">
          {t('admin.reservaTitulo', { numero: `SB360-${String(reserva.id).padStart(6, '0')}` })}
        </h2>

        <article className="ficha-lectura">
          <h3>{t('admin.datosReserva')}</h3>
          <ul>
            <li>{t('comun.propiedad')}: {propiedad?.nombre || '—'}</li>
            <li>{t('comun.anfitrion')}: {anfitrion?.nombre || '—'}</li>
            <li>{t('comun.huesped')}: {huesped?.nombre || '—'}</li>
            <li>
              <time dateTime={reserva.fechaEntrada}>{formatearFecha(reserva.fechaEntrada)}</time>
              {' → '}
              <time dateTime={reserva.fechaSalida}>{formatearFecha(reserva.fechaSalida)}</time>
            </li>
            <li>{t('misReservas.huespedes', { n: reserva.huespedes })}</li>
            {/* El monto es informativo: no se edita desde el panel. */}
            <li>{t('misReservas.total', { total: formatearMoneda(reserva.monto) })}</li>
            <li>{t('admin.estadoReserva')}: <EtiquetaEstado estado={reserva.estado} /></li>
            <li>{t('admin.estadoPago')}: <EtiquetaEstado estado={reserva.estadoPago} /></li>
          </ul>
        </article>

        <form className="panel-formulario" onSubmit={guardarPago}>
          <fieldset>
            <legend>{t('admin.pagoLeyenda')}</legend>

            <label htmlFor="reserva-estado_pago">{t('admin.estadoPago')}</label>
            <select
              id="reserva-estado_pago"
              name="estado_pago"
              value={estadoPago}
              onChange={(evento) => setEstadoPago(evento.target.value)}
            >
              <option value="pendiente">{t('estados.pendiente')}</option>
              <option value="pagado">{t('estados.pagado')}</option>
              <option value="reembolsado">{t('estados.reembolsado')}</option>
            </select>

            <MensajeExito mensaje={mensajePago} alOcultar={() => setMensajePago(null)} />

            <button type="submit" className="btn-primario">{t('admin.guardarPago')}</button>
          </fieldset>
        </form>
      </section>

      <section aria-labelledby="cancelacion-heading">
        <h2 id="cancelacion-heading">{t('admin.cancelacionTitulo')}</h2>

        {reserva.estado === 'cancelada' ? (
          <>
            <p>{t('admin.motivoHuesped', { motivo: reserva.motivoCancelacion || '—' })}</p>

            <form className="panel-formulario" onSubmit={cancelacion.manejarEnvio} noValidate>
              <fieldset>
                <legend>{t('admin.decisionCancelacion')}</legend>

                <label htmlFor="cancelacion-decision_cancelacion">{t('admin.decisionCancelacion')}</label>
                <select
                  {...cancelacion.propsCampo('decision_cancelacion')}
                  value={cancelacion.valores.decision_cancelacion}
                >
                  <option value="aprobada">{t('admin.aprobada')}</option>
                  <option value="rechazada">{t('admin.rechazada')}</option>
                </select>

                <label htmlFor="cancelacion-motivo_cancelacion">{t('admin.motivoAdmin')}</label>
                <textarea
                  {...cancelacion.propsCampo('motivo_cancelacion')}
                  value={cancelacion.valores.motivo_cancelacion}
                  rows="3"
                  maxLength={500}
                  required
                />
                <MensajeError
                  error={cancelacion.errores.motivo_cancelacion}
                  id="cancelacion-motivo_cancelacion-error"
                />

                <MensajeExito mensaje={cancelacion.exito} alOcultar={() => cancelacion.setExito(null)} />

                <button type="submit" className="btn-primario">{t('admin.guardarCancelacion')}</button>
              </fieldset>
            </form>
          </>
        ) : (
          <p>{t('admin.sinCancelacion')}</p>
        )}
      </section>

      <section aria-labelledby="reembolso-heading">
        <h2 id="reembolso-heading">{t('admin.reembolsoTitulo')}</h2>

        <form className="panel-formulario" onSubmit={reembolso.manejarEnvio} noValidate>
          <fieldset>
            <legend>{t('admin.decisionReembolso')}</legend>

            <label htmlFor="reembolso-decision_reembolso">{t('admin.decisionReembolso')}</label>
            <select
              {...reembolso.propsCampo('decision_reembolso')}
              value={reembolso.valores.decision_reembolso}
            >
              <option value="aprobado">{t('admin.aprobada')}</option>
              <option value="rechazado">{t('admin.rechazada')}</option>
            </select>

            <label htmlFor="reembolso-monto_reembolso">{t('admin.montoReembolso')}</label>
            <input
              type="number"
              {...reembolso.propsCampo('monto_reembolso')}
              value={reembolso.valores.monto_reembolso}
              min="0"
              max={reserva.monto}
            />
            <MensajeError error={reembolso.errores.monto_reembolso} id="reembolso-monto_reembolso-error" />

            <label htmlFor="reembolso-motivo_reembolso">{t('admin.motivoAdmin')}</label>
            <textarea
              {...reembolso.propsCampo('motivo_reembolso')}
              value={reembolso.valores.motivo_reembolso}
              rows="3"
              maxLength={500}
              required
            />
            <MensajeError error={reembolso.errores.motivo_reembolso} id="reembolso-motivo_reembolso-error" />

            <MensajeExito mensaje={reembolso.exito} alOcultar={() => reembolso.setExito(null)} />

            <button type="submit" className="btn-primario">{t('admin.guardarReembolso')}</button>
          </fieldset>
        </form>
      </section>

      <SeccionIncidencias entidad="reserva" entidadId={id} />

      <p><Link to="/admin-reservas">{t('admin.reservasTitulo')}</Link></p>
    </>
  )
}
