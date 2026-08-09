import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError, MensajeExito } from '../components/MensajeCampo'
import { actualizarPromocion, obtenerPropiedades, obtenerUsuario } from '../utils/dataStore'
import { ESTADOS_PROMOCION } from '../utils/dataStore/promociones'
import { fechaPosterior, requerido, textoMaximo, validar } from '../utils/validaciones'

export default function AdminPromocionEditar() {
  const { id } = useParams()
  const { t } = useIdioma()
  useTituloPagina('admin.promocionesTitulo')

  const { datos: promocion, cargar } = useDataStore('promocion', { id })

  const formulario = useFormulario({
    prefijoId: 'promocion',
    valoresIniciales: {
      titulo: '', descripcion: '', beneficio: '', vigencia_inicio: '', vigencia_fin: '', estado: 'activa'
    },
    validarValores: (v) => validar({
      titulo: requerido(v.titulo),
      descripcion: requerido(v.descripcion) || textoMaximo(v.descripcion),
      beneficio: requerido(v.beneficio),
      vigencia_inicio: requerido(v.vigencia_inicio),
      vigencia_fin: requerido(v.vigencia_fin) ||
        fechaPosterior(v.vigencia_inicio, v.vigencia_fin, 'validacion.fechaVigencia')
    }),
    alEnviar: (v, { setExito }) => {
      actualizarPromocion(id, {
        titulo: v.titulo.trim(),
        descripcion: v.descripcion.trim(),
        beneficio: v.beneficio.trim(),
        vigenciaInicio: v.vigencia_inicio,
        vigenciaFin: v.vigencia_fin,
        estado: v.estado
      })
      cargar()
      setExito(t('admin.promocionExito'))
    }
  })

  useEffect(() => {
    if (!promocion) return
    formulario.setValores({
      titulo: promocion.titulo || '',
      descripcion: promocion.descripcion || '',
      beneficio: promocion.beneficio || '',
      vigencia_inicio: promocion.vigenciaInicio || '',
      vigencia_fin: promocion.vigenciaFin || '',
      estado: promocion.estado || 'activa'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promocion?.id])

  if (!promocion) {
    return (
      <section aria-labelledby="promocion-heading">
        <h2 id="promocion-heading">{t('admin.promocionesTitulo')}</h2>
        <p>{t('comun.sinDatos')}</p>
        <p><Link to="/admin-promociones">{t('comun.volver')}</Link></p>
      </section>
    )
  }

  const participantes = obtenerPropiedades({ incluirTodas: true })
    .filter((propiedad) => (promocion.propiedadesParticipantes || []).includes(propiedad.id))

  const { valores, errores, exito, setExito, manejarEnvio, propsCampo } = formulario

  return (
    <>
      <section aria-labelledby="promocion-heading">
        <h2 id="promocion-heading">{t('admin.promocionTitulo', { titulo: promocion.titulo })}</h2>

        <form className="panel-formulario" onSubmit={manejarEnvio} noValidate>
          <fieldset>
            <legend>{t('admin.datosPromocion')}</legend>

            <label htmlFor="promocion-titulo">{t('comun.titulo')}</label>
            <input type="text" {...propsCampo('titulo')} value={valores.titulo} required />
            <MensajeError error={errores.titulo} id="promocion-titulo-error" />

            <label htmlFor="promocion-descripcion">{t('comun.descripcion')}</label>
            <textarea {...propsCampo('descripcion')} value={valores.descripcion} rows="3" maxLength={500} required />
            <MensajeError error={errores.descripcion} id="promocion-descripcion-error" />

            <label htmlFor="promocion-beneficio">{t('admin.beneficio')}</label>
            <input type="text" {...propsCampo('beneficio')} value={valores.beneficio} required />
            <MensajeError error={errores.beneficio} id="promocion-beneficio-error" />

            <label htmlFor="promocion-vigencia_inicio">{t('admin.vigenciaDesde')}</label>
            <input type="date" {...propsCampo('vigencia_inicio')} value={valores.vigencia_inicio} required />
            <MensajeError error={errores.vigencia_inicio} id="promocion-vigencia_inicio-error" />

            <label htmlFor="promocion-vigencia_fin">{t('admin.vigenciaHasta')}</label>
            <input type="date" {...propsCampo('vigencia_fin')} value={valores.vigencia_fin} required />
            <MensajeError error={errores.vigencia_fin} id="promocion-vigencia_fin-error" />

            <label htmlFor="promocion-estado">{t('comun.estado')}</label>
            <select {...propsCampo('estado')} value={valores.estado}>
              {ESTADOS_PROMOCION.map((estado) => (
                <option value={estado} key={estado}>{t(`estados.${estado}`)}</option>
              ))}
            </select>

            <MensajeExito mensaje={exito} alOcultar={() => setExito(null)} />

            <button type="submit" className="btn-primario">{t('comun.guardar')}</button>
          </fieldset>
        </form>
      </section>

      <section aria-labelledby="participantes-heading">
        <h2 id="participantes-heading">{t('admin.participantes')}</h2>

        {participantes.length === 0 ? (
          <p>{t('admin.sinParticipantes')}</p>
        ) : (
          <table className="tabla-panel">
            <thead>
              <tr>
                <th scope="col">{t('comun.propiedad')}</th>
                <th scope="col">{t('comun.anfitrion')}</th>
              </tr>
            </thead>
            <tbody>
              {participantes.map((propiedad) => (
                <tr key={propiedad.id}>
                  <td>{propiedad.nombre}</td>
                  <td>{obtenerUsuario(propiedad.anfitrionId)?.nombre || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p><Link to="/admin-promociones">{t('admin.promocionesTitulo')}</Link></p>
      </section>
    </>
  )
}
