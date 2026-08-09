import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError, MensajeExito } from '../components/MensajeCampo'
import EtiquetaEstado from '../components/EtiquetaEstado'
import SeccionIncidencias from '../components/SeccionIncidencias'
import { actualizarPropiedad, actualizarResena, obtenerUsuario } from '../utils/dataStore'
import { requerido, textoMaximo, validar } from '../utils/validaciones'
import { claveServicio, claveTipo } from '../utils/catalogos'

export default function AdminAlojamientoEditar() {
  const { id } = useParams()
  const { t, formatearMoneda } = useIdioma()
  useTituloPagina('admin.alojamientosTitulo')

  const { datos: propiedad, cargar: recargarPropiedad } = useDataStore('propiedad', { id })
  const { datos: resenas, cargar: recargarResenas } = useDataStore('resenas', {
    filtros: { propiedadId: id, incluirBloqueadas: true }
  })

  const [orden, setOrden] = useState('valoracion')
  const [mensajeResena, setMensajeResena] = useState(null)

  const decision = useFormulario({
    prefijoId: 'decision',
    valoresIniciales: { decision: 'aprobar', motivo: '' },
    validarValores: (v) => validar({
      // El motivo solo es obligatorio cuando se rechaza la publicación.
      motivo: v.decision === 'rechazar'
        ? (requerido(v.motivo) || textoMaximo(v.motivo))
        : textoMaximo(v.motivo)
    }),
    alEnviar: (v, { setExito }) => {
      actualizarPropiedad(id, v.decision === 'aprobar'
        ? { estado: 'publicada', motivoRechazo: '' }
        : { estado: 'rechazada', motivoRechazo: v.motivo.trim() })
      recargarPropiedad()
      setExito(t('admin.decisionExito'))
    }
  })

  if (!propiedad) {
    return (
      <section aria-labelledby="alojamiento-heading">
        <h2 id="alojamiento-heading">{t('admin.alojamientosTitulo')}</h2>
        <p>{t('comun.sinDatos')}</p>
        <p><Link to="/admin-alojamientos">{t('comun.volver')}</Link></p>
      </section>
    )
  }

  function alternarBloqueo(resena) {
    actualizarResena(resena.id, { bloqueada: !resena.bloqueada })
    recargarResenas({ propiedadId: id, incluirBloqueadas: true })
    setMensajeResena(t(resena.bloqueada ? 'admin.resenaHabilitada' : 'admin.resenaBloqueada'))
  }

  const anfitrion = obtenerUsuario(propiedad.anfitrionId)
  const resenasOrdenadas = [...(resenas || [])].sort((a, b) => {
    if (orden === 'valoracion') return b.valoracion - a.valoracion
    if (orden === 'recientes') return new Date(b.fecha) - new Date(a.fecha)
    return new Date(a.fecha) - new Date(b.fecha)
  })

  return (
    <>
      <section aria-labelledby="alojamiento-heading">
        <h2 id="alojamiento-heading">{t('admin.alojamientoTitulo', { nombre: propiedad.nombre })}</h2>

        <article className="ficha-lectura">
          <h3>{t('admin.datosPropiedad')}</h3>
          <ul>
            <li>{t('anfitrion.consultaPropiedad', { propiedad: propiedad.nombre })}</li>
            <li>{t('comun.anfitrion')}: {anfitrion?.nombre || '—'}</li>
            <li>{t('propiedad.caracteristicaTipo', { tipo: t(claveTipo(propiedad.tipo)) })}</li>
            <li>{t('propiedad.caracteristicaUbicacion', { ubicacion: propiedad.ubicacion })}</li>
            <li>{t('propiedad.caracteristicaCapacidad', { n: propiedad.capacidad })}</li>
            <li>{t('comun.desde')} {formatearMoneda(propiedad.precioNoche)} {t('comun.porNoche')}</li>
            <li>{t('propiedad.serviciosTitulo')}: {propiedad.servicios.map((s) => t(claveServicio(s))).join(', ')}</li>
            <li>{t('comun.estado')}: <EtiquetaEstado estado={propiedad.estado} /></li>
            {propiedad.motivoRechazo && (
              <li>{t('anfitrion.motivoRechazo', { motivo: propiedad.motivoRechazo })}</li>
            )}
          </ul>
        </article>

        <form className="panel-formulario" onSubmit={decision.manejarEnvio} noValidate>
          <fieldset>
            <legend>{t('admin.decisionLeyenda')}</legend>

            <label htmlFor="decision-decision">{t('admin.decision')}</label>
            <select {...decision.propsCampo('decision')} value={decision.valores.decision}>
              <option value="aprobar">{t('admin.aprobar')}</option>
              <option value="rechazar">{t('admin.rechazar')}</option>
            </select>

            <label htmlFor="decision-motivo">{t('admin.motivo')}</label>
            <textarea
              {...decision.propsCampo('motivo')}
              value={decision.valores.motivo}
              rows="3"
              maxLength={500}
            />
            <MensajeError error={decision.errores.motivo} id="decision-motivo-error" />

            <MensajeExito mensaje={decision.exito} alOcultar={() => decision.setExito(null)} />

            <button type="submit" className="btn-primario">{t('admin.guardarDecision')}</button>
          </fieldset>
        </form>
      </section>

      <section aria-labelledby="resenas-heading">
        <h2 id="resenas-heading">{t('admin.resenasPropiedad')}</h2>

        <MensajeExito mensaje={mensajeResena} alOcultar={() => setMensajeResena(null)} />

        <form onSubmit={(evento) => { evento.preventDefault(); setOrden(new FormData(evento.target).get('orden')) }}>
          <label htmlFor="resenas-orden">{t('propiedad.ordenarPor')}</label>
          <select id="resenas-orden" name="orden" defaultValue={orden}>
            <option value="valoracion">{t('propiedad.ordenValoracion')}</option>
            <option value="recientes">{t('propiedad.ordenRecientes')}</option>
            <option value="antiguas">{t('propiedad.ordenAntiguas')}</option>
          </select>
          <button type="submit">{t('propiedad.ordenar')}</button>
        </form>

        {resenasOrdenadas.length === 0 ? (
          <p>{t('anfitrion.sinResenasPropiedad')}</p>
        ) : (
          <table className="tabla-panel">
            <thead>
              <tr>
                <th scope="col">{t('comun.huesped')}</th>
                <th scope="col">{t('anfitrion.resenaTexto')}</th>
                <th scope="col">{t('comun.valoracion')}</th>
                <th scope="col">{t('comun.acciones')}</th>
              </tr>
            </thead>
            <tbody>
              {resenasOrdenadas.map((resena) => (
                <tr key={resena.id}>
                  <td>{resena.autor}</td>
                  <td>{resena.comentario}</td>
                  <td>{t('comun.valoracionDe', { valor: resena.valoracion })}</td>
                  <td>
                    <button type="button" className="btn-peligro" onClick={() => alternarBloqueo(resena)}>
                      {t(resena.bloqueada ? 'admin.desbloquearResena' : 'admin.bloquearResena')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <SeccionIncidencias entidad="alojamiento" entidadId={id} />

      <p><Link to="/admin-alojamientos">{t('admin.alojamientosTitulo')}</Link></p>
    </>
  )
}
