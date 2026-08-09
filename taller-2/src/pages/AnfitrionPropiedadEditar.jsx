import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import { useFormulario } from '../hooks/useFormulario'
import FormularioPropiedad from '../components/FormularioPropiedad'
import { MensajeError, MensajeExito } from '../components/MensajeCampo'
import {
  actualizarPropiedad,
  cambiarDisponibilidad,
  obtenerPromociones,
  obtenerReservas
} from '../utils/dataStore'
import { fechaPosterior, requerido, validar } from '../utils/validaciones'
import { diasSemana, generarCalendario, nombresMeses } from '../utils/calendario'
import {
  propiedadDesdeValores,
  validarPropiedad,
  valoresDesdePropiedad
} from '../utils/validarPropiedad'

const ESTADOS_EDITABLES = ['publicada', 'inactiva']

export default function AnfitrionPropiedadEditar() {
  const { id } = useParams()
  const { t, locale } = useIdioma()
  useTituloPagina('anfitrion.editarTitulo')

  const { datos: propiedad, cargar: recargarPropiedad } = useDataStore('propiedad', { id })
  const promociones = obtenerPromociones()

  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth() + 1)
  const [anio, setAnio] = useState(hoy.getFullYear())
  const [mensajeDisponibilidad, setMensajeDisponibilidad] = useState(null)
  const [erroresFechas, setErroresFechas] = useState({})
  const [estado, setEstado] = useState('')
  const [promocionId, setPromocionId] = useState('')

  const formulario = useFormulario({
    prefijoId: 'propiedad',
    valoresIniciales: valoresDesdePropiedad(null),
    validarValores: validarPropiedad,
    alEnviar: (valores, { setExito }) => {
      actualizarPropiedad(id, {
        ...propiedadDesdeValores(valores, propiedad),
        // El estado solo se puede tocar cuando la propiedad ya fue aprobada.
        ...(ESTADOS_EDITABLES.includes(propiedad.estado) ? { estado } : {}),
        promocionId: promocionId ? Number(promocionId) : undefined
      })
      recargarPropiedad()
      setExito(t('anfitrion.guardadoExito'))
    }
  })

  // Cuando llegan los datos de la propiedad se precarga el formulario.
  useEffect(() => {
    if (!propiedad) return
    formulario.setValores(valoresDesdePropiedad(propiedad))
    setEstado(propiedad.estado)
    setPromocionId(propiedad.promocionId ? String(propiedad.promocionId) : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propiedad?.id])

  if (!propiedad) {
    return (
      <section aria-labelledby="propiedad-heading">
        <h2 id="propiedad-heading">{t('propiedad.noExiste')}</h2>
        <p><Link to="/anfitrion-propiedades">{t('anfitrion.misPropiedades')}</Link></p>
      </section>
    )
  }

  function verMes(evento) {
    evento.preventDefault()
    const campos = new FormData(evento.target)
    setMes(Number(campos.get('mes')))
    setAnio(Number(campos.get('anio')))
  }

  function aplicarDisponibilidad(evento) {
    evento.preventDefault()
    const campos = new FormData(evento.target)
    const inicio = campos.get('fecha_inicio')
    const fin = campos.get('fecha_fin')

    const errores = validar({
      fecha_inicio: requerido(inicio),
      fecha_fin: requerido(fin) || fechaPosterior(inicio, fin, 'validacion.fechaVigencia')
    })
    setErroresFechas(errores)
    if (Object.keys(errores).length > 0) return

    cambiarDisponibilidad(id, inicio, fin, campos.get('accion'))
    recargarPropiedad()
    setMensajeDisponibilidad(t('anfitrion.disponibilidadExito'))
  }

  const reservas = obtenerReservas({ propiedadId: propiedad.id })
  const meses = nombresMeses(locale)
  const dias = diasSemana(locale)
  const semanas = generarCalendario(mes, anio, reservas, propiedad.fechasBloqueadas || [])
  const puedeEditarEstado = ESTADOS_EDITABLES.includes(propiedad.estado)

  return (
    <>
      <section aria-labelledby="propiedad-heading">
        <h2 id="propiedad-heading">{t('anfitrion.editarTitulo')}: {propiedad.nombre}</h2>

        <form onSubmit={formulario.manejarEnvio} noValidate>
          <FormularioPropiedad formulario={formulario} />

          <fieldset>
            <legend>{t('anfitrion.promocionLeyenda')}</legend>

            <label htmlFor="propiedad-promocion">{t('anfitrion.promocion')}</label>
            <select
              id="propiedad-promocion"
              name="promocion"
              value={promocionId}
              onChange={(evento) => setPromocionId(evento.target.value)}
            >
              <option value="">{t('anfitrion.sinPromocion')}</option>
              {promociones.map((promocion) => (
                <option value={promocion.id} key={promocion.id}>{promocion.titulo}</option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <legend>{t('anfitrion.estadoLeyenda')}</legend>

            {puedeEditarEstado ? (
              <>
                <label htmlFor="propiedad-estado">{t('anfitrion.estadoEditable')}</label>
                <select
                  id="propiedad-estado"
                  name="estado"
                  value={estado}
                  onChange={(evento) => setEstado(evento.target.value)}
                >
                  {ESTADOS_EDITABLES.map((valor) => (
                    <option value={valor} key={valor}>{t(`estados.${valor}`)}</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <p>{t('anfitrion.estadoPropiedad', { estado: t(`estados.${propiedad.estado}`) })}</p>
                <p>{t('anfitrion.estadoInformativo')}</p>
                {propiedad.motivoRechazo && (
                  <p>{t('anfitrion.motivoRechazo', { motivo: propiedad.motivoRechazo })}</p>
                )}
              </>
            )}
          </fieldset>

          <MensajeExito mensaje={formulario.exito} alOcultar={() => formulario.setExito(null)} />

          <button type="submit" className="btn-primario">{t('comun.guardar')}</button>
        </form>
      </section>

      <section aria-labelledby="disponibilidad-heading">
        <h2 id="disponibilidad-heading">{t('anfitrion.disponibilidadTitulo')}</h2>

        <form onSubmit={verMes}>
          <label htmlFor="disponibilidad-mes">{t('propiedad.mes')}</label>
          <select id="disponibilidad-mes" name="mes" defaultValue={String(mes)}>
            {meses.map((nombreMes, indice) => (
              <option value={indice + 1} key={nombreMes}>{nombreMes}</option>
            ))}
          </select>

          <label htmlFor="disponibilidad-anio">{t('propiedad.anio')}</label>
          <select id="disponibilidad-anio" name="anio" defaultValue={String(anio)}>
            <option value={hoy.getFullYear()}>{hoy.getFullYear()}</option>
            <option value={hoy.getFullYear() + 1}>{hoy.getFullYear() + 1}</option>
          </select>

          <button type="submit">{t('propiedad.verMes')}</button>
        </form>

        <table className="calendario-disponibilidad calendario-gestion">
          <caption>{t('propiedad.calendarioTitulo', { mes: meses[mes - 1], anio })}</caption>
          <thead>
            <tr>
              {dias.map((dia) => <th scope="col" key={dia}>{dia}</th>)}
            </tr>
          </thead>
          <tbody>
            {semanas.map((semana, indiceSemana) => (
              <tr key={indiceSemana}>
                {semana.map((dia, indiceDia) => {
                  const clase = dia?.reservado
                    ? 'dia-reservado'
                    : dia?.bloqueado ? 'dia-bloqueado' : undefined
                  return (
                    <td key={indiceDia} className={clase}>
                      {dia && (
                        <>
                          <time dateTime={dia.fechaISO}>{dia.numero}</time>
                          {dia.reservado && <span className="sr-only"> — {t('propiedad.reservado')}</span>}
                          {!dia.reservado && dia.bloqueado && (
                            <span className="sr-only"> — {t('propiedad.bloqueado')}</span>
                          )}
                        </>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="leyenda-calendario">
          <span className="muestra-reservado"></span> {t('propiedad.reservado')}
          <span className="muestra-bloqueado"></span> {t('propiedad.bloqueado')}
        </p>

        <form className="panel-formulario" onSubmit={aplicarDisponibilidad} noValidate>
          <fieldset>
            <legend>{t('anfitrion.bloquearLeyenda')}</legend>

            <label htmlFor="fecha-inicio">{t('anfitrion.fechaInicio')}</label>
            <input
              type="date"
              id="fecha-inicio"
              name="fecha_inicio"
              className={erroresFechas.fecha_inicio ? 'campo-invalido' : undefined}
              required
            />
            <MensajeError error={erroresFechas.fecha_inicio} id="fecha-inicio-error" />

            <label htmlFor="fecha-fin">{t('anfitrion.fechaFin')}</label>
            <input
              type="date"
              id="fecha-fin"
              name="fecha_fin"
              className={erroresFechas.fecha_fin ? 'campo-invalido' : undefined}
              required
            />
            <MensajeError error={erroresFechas.fecha_fin} id="fecha-fin-error" />

            <label htmlFor="accion-disponibilidad">{t('anfitrion.accion')}</label>
            <select id="accion-disponibilidad" name="accion" defaultValue="bloquear">
              <option value="bloquear">{t('anfitrion.bloquear')}</option>
              <option value="habilitar">{t('anfitrion.habilitar')}</option>
            </select>

            <MensajeExito
              mensaje={mensajeDisponibilidad}
              alOcultar={() => setMensajeDisponibilidad(null)}
            />

            <button type="submit" className="btn-primario">{t('anfitrion.aplicarAccion')}</button>
          </fieldset>
        </form>

        <p><Link to="/anfitrion-propiedades">{t('anfitrion.misPropiedades')}</Link></p>
      </section>
    </>
  )
}
