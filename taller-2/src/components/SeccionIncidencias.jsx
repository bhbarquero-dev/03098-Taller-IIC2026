import { useState } from 'react'
import { useIdioma } from '../context/IdiomaContext'
import { useDataStore } from '../hooks/useDataStore'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError, MensajeExito } from './MensajeCampo'
import { crearIncidencia } from '../utils/dataStore'
import { TIPOS_INCIDENCIA } from '../utils/dataStore/incidencias'
import { requerido, textoMaximo, validar } from '../utils/validaciones'

/**
 * Registro y listado de incidencias de una entidad concreta (cuenta,
 * alojamiento o reserva). Se repite igual en las tres pantallas de edición del
 * panel de administración.
 */
export default function SeccionIncidencias({ entidad, entidadId }) {
  const { t, formatearFecha } = useIdioma()
  const { datos: incidencias, cargar } = useDataStore('incidencias', { filtros: { entidad, entidadId } })
  const [mensaje, setMensaje] = useState(null)

  const formulario = useFormulario({
    prefijoId: 'incidencia',
    valoresIniciales: { tipo_incidencia: 'contenido', descripcion: '' },
    validarValores: (v) => validar({
      descripcion: requerido(v.descripcion) || textoMaximo(v.descripcion)
    }),
    alEnviar: (v, { setValores }) => {
      crearIncidencia({
        entidad,
        entidadId: Number(entidadId),
        tipo: v.tipo_incidencia,
        descripcion: v.descripcion.trim()
      })
      cargar({ entidad, entidadId })
      setValores({ tipo_incidencia: 'contenido', descripcion: '' })
      setMensaje(t('admin.incidenciaExito'))
    }
  })

  const { valores, errores, manejarEnvio, propsCampo } = formulario
  const listado = incidencias || []

  return (
    <section aria-labelledby="incidencias-heading">
      <h2 id="incidencias-heading">{t('admin.incidenciasTitulo')}</h2>

      <form className="panel-formulario" onSubmit={manejarEnvio} noValidate>
        <fieldset>
          <legend>{t('admin.incidenciaLeyenda')}</legend>

          <label htmlFor="incidencia-tipo_incidencia">{t('admin.incidenciaTipo')}</label>
          <select {...propsCampo('tipo_incidencia')} value={valores.tipo_incidencia}>
            {TIPOS_INCIDENCIA.map((tipo) => (
              <option value={tipo} key={tipo}>
                {t(`admin.tipo${tipo.charAt(0).toUpperCase()}${tipo.slice(1)}`)}
              </option>
            ))}
          </select>

          <label htmlFor="incidencia-descripcion">{t('admin.incidenciaDescripcion')}</label>
          <textarea {...propsCampo('descripcion')} value={valores.descripcion} rows="3" maxLength={500} required />
          <MensajeError error={errores.descripcion} id="incidencia-descripcion-error" />

          <MensajeExito mensaje={mensaje} alOcultar={() => setMensaje(null)} />

          <button type="submit" className="btn-primario">{t('admin.registrarIncidencia')}</button>
        </fieldset>
      </form>

      {listado.length === 0 ? (
        <p>{t('admin.sinIncidencias')}</p>
      ) : (
        <table className="tabla-panel">
          <thead>
            <tr>
              <th scope="col">{t('comun.fecha')}</th>
              <th scope="col">{t('comun.tipo')}</th>
              <th scope="col">{t('comun.descripcion')}</th>
            </tr>
          </thead>
          <tbody>
            {listado.map((incidencia) => (
              <tr key={incidencia.id}>
                <td>
                  <time dateTime={incidencia.fecha}>{formatearFecha(incidencia.fecha, 'medium')}</time>
                </td>
                <td>{t(`admin.tipo${incidencia.tipo.charAt(0).toUpperCase()}${incidencia.tipo.slice(1)}`)}</td>
                <td>{incidencia.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
