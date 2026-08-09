import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDataStore } from '../hooks/useDataStore'
import { useSesion } from '../context/SesionContext'
import { useIdioma } from '../context/IdiomaContext'
import { useFormulario } from '../hooks/useFormulario'
import { MensajeError, MensajeExito } from '../components/MensajeCampo'
import { crearConsulta, registrarConsultaPropiedad } from '../utils/dataStore'
import { correoValido, requerido, textoMaximo, validar } from '../utils/validaciones'
import { claveServicio, claveTipo } from '../utils/catalogos'
import { diasSemana, generarCalendario, nombresMeses } from '../utils/calendario'

const PIES_IMAGEN = {
  'sala.jpg': 'Sala de estar',
  'cocina.jpg': 'Cocina equipada',
  'cuarto.jpg': 'Habitación',
  'playa.jpg': 'Vista a la playa',
  'montaña.jpg': 'Vista a la montaña'
}

export default function PropiedadDetalle() {
  const { id } = useParams()
  const propiedadId = Number(id)
  const { usuario } = useSesion()
  const { t, locale, formatearMoneda } = useIdioma()

  const { datos: propiedad, cargando } = useDataStore('propiedad', { id })
  const { datos: resenas, cargar: cargarResenas } = useDataStore('resenas')
  const { datos: reservas, cargar: cargarReservas } = useDataStore('reservas')
  const {
    datos: usuarioCompleto,
    actualizar: actualizarUsuario
  } = useDataStore('usuario', { id: usuario?.id })

  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth() + 1)
  const [anio, setAnio] = useState(hoy.getFullYear())
  const [orden, setOrden] = useState('valoracion')

  useEffect(() => {
    cargarResenas({ propiedadId })
    cargarReservas({ propiedadId })
  }, [propiedadId, cargarResenas, cargarReservas])

  // Cada visita a la ficha alimenta el reporte de alojamientos más consultados.
  useEffect(() => {
    if (propiedadId) registrarConsultaPropiedad(propiedadId)
  }, [propiedadId])

  const consulta = useFormulario({
    prefijoId: 'consulta',
    valoresIniciales: { nombre: '', correo: '', asunto: '', mensaje: '' },
    validarValores: (valores) => validar({
      nombre: requerido(valores.nombre),
      correo: correoValido(valores.correo),
      asunto: requerido(valores.asunto),
      mensaje: requerido(valores.mensaje) || textoMaximo(valores.mensaje)
    }),
    alEnviar: (valores, { setExito, setValores }) => {
      crearConsulta({
        propiedadId,
        anfitrionId: propiedad?.anfitrionId,
        usuarioId: usuario?.id,
        huespedNombre: valores.nombre,
        huespedCorreo: valores.correo,
        asunto: valores.asunto,
        mensaje: valores.mensaje
      })
      setExito(t('propiedad.consultaExito'))
      setValores({ nombre: '', correo: '', asunto: '', mensaje: '' })
    }
  })

  if (cargando) {
    return <section><p>{t('comun.cargando')}</p></section>
  }

  if (!propiedad) {
    return (
      <section aria-labelledby="propiedad-heading">
        <h2 id="propiedad-heading">{t('propiedad.noExiste')}</h2>
        <p><Link to="/catalogo">{t('propiedad.volverCatalogo')}</Link></p>
      </section>
    )
  }

  const esFavorito = (usuarioCompleto?.favoritos || []).includes(propiedadId)

  async function alternarFavorito() {
    const actuales = usuarioCompleto?.favoritos || []
    const nuevos = esFavorito
      ? actuales.filter((favoritoId) => favoritoId !== propiedadId)
      : [...actuales, propiedadId]
    await actualizarUsuario(usuario.id, { favoritos: nuevos })
  }

  function verMes(evento) {
    evento.preventDefault()
    const campos = new FormData(evento.target)
    setMes(Number(campos.get('mes')))
    setAnio(Number(campos.get('anio')))
  }

  function ordenarResenas(evento) {
    evento.preventDefault()
    setOrden(new FormData(evento.target).get('orden'))
  }

  const resenasOrdenadas = [...(resenas || [])].sort((a, b) => {
    if (orden === 'valoracion') return b.valoracion - a.valoracion
    if (orden === 'recientes') return new Date(b.fecha) - new Date(a.fecha)
    return new Date(a.fecha) - new Date(b.fecha)
  })

  const meses = nombresMeses(locale)
  const dias = diasSemana(locale)
  const semanas = generarCalendario(mes, anio, reservas || [], propiedad.fechasBloqueadas || [])

  const { valores, errores, exito, setExito, manejarEnvio, propsCampo } = consulta

  return (
    <>
      <section className="ficha-propiedad" aria-labelledby="propiedad-heading">
        <h2 id="propiedad-heading">{propiedad.nombre} — {propiedad.ubicacion}</h2>

        <p>
          {usuario ? (
            <button className="btn-secundario" onClick={alternarFavorito} type="button">
              {esFavorito ? t('propiedad.quitarFavorito') : t('propiedad.guardarFavorito')}
            </button>
          ) : (
            <Link to="/inicio-sesion">{t('propiedad.favoritoLogin')}</Link>
          )}
        </p>

        {propiedad.imagenes.map((imagen, indice) => (
          <figure className="galeria-figura" key={imagen + indice}>
            <img src={`/imagenes/${imagen}`} alt={`${PIES_IMAGEN[imagen] || propiedad.nombre} — ${propiedad.nombre}`} />
            <figcaption>{PIES_IMAGEN[imagen] || propiedad.nombre}</figcaption>
          </figure>
        ))}

        {propiedad.video && (
          <figure className="figura-video">
            <video controls>
              <source src={`/videos/${propiedad.video}`} type="video/mp4" />
              {t('propiedad.videoNoSoportado')}
            </video>
            <figcaption>{t('propiedad.videoPie', { nombre: propiedad.nombre })}</figcaption>
          </figure>
        )}

        <h3>{t('propiedad.descripcion')}</h3>
        <p>{propiedad.descripcion}</p>

        <h3>{t('propiedad.caracteristicas')}</h3>
        <ul>
          <li>{t('propiedad.caracteristicaTipo', { tipo: t(claveTipo(propiedad.tipo)) })}</li>
          <li>{t('propiedad.caracteristicaCapacidad', { n: propiedad.capacidad })}</li>
          <li>{t('propiedad.caracteristicaUbicacion', { ubicacion: propiedad.ubicacion })}</li>
        </ul>

        <h3>{t('propiedad.serviciosTitulo')}</h3>
        <ul>
          {propiedad.servicios.map((servicio) => (
            <li key={servicio}>{t(claveServicio(servicio))}</li>
          ))}
        </ul>

        <h3>{t('propiedad.condiciones')}</h3>
        <ul>
          <li>{propiedad.mascotas ? t('propiedad.mascotasSi') : t('propiedad.mascotasNo')}</li>
          <li>{propiedad.fumar ? t('propiedad.fumarSi') : t('propiedad.fumarNo')}</li>
          <li>{t('propiedad.horarios', {
            entrada: propiedad.horaEntrada,
            salida: propiedad.horaSalida
          })}</li>
        </ul>

        <h3>{t('propiedad.cancelacion')}</h3>
        <p>{propiedad.politicaCancelacion}</p>

        <h3>{t('propiedad.costoTitulo')}</h3>
        <p>{t('propiedad.costoTexto', {
          precio: formatearMoneda(propiedad.precioNoche),
          valoracion: propiedad.valoracion
        })}</p>

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

        <table className="calendario-disponibilidad">
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

        <p>{t('propiedad.restoDisponible')}</p>

        <p><Link className="btn-primario" to={`/reserva/${propiedad.id}`}>{t('propiedad.reservar')}</Link></p>
      </section>

      <section className="resenas-propiedad" aria-labelledby="resenas-heading">
        <h2 id="resenas-heading">{t('propiedad.resenasTitulo')}</h2>

        <form onSubmit={ordenarResenas}>
          <label htmlFor="resenas-orden">{t('propiedad.ordenarPor')}</label>
          <select id="resenas-orden" name="orden" defaultValue={orden}>
            <option value="valoracion">{t('propiedad.ordenValoracion')}</option>
            <option value="recientes">{t('propiedad.ordenRecientes')}</option>
            <option value="antiguas">{t('propiedad.ordenAntiguas')}</option>
          </select>
          <button type="submit">{t('propiedad.ordenar')}</button>
        </form>

        {resenasOrdenadas.length === 0 && <p>{t('propiedad.sinResenas')}</p>}

        {resenasOrdenadas.map((resena) => (
          <article className="tarjeta-resena" key={resena.id}>
            <h3>{resena.autor}</h3>
            <blockquote>
              <p>&quot;{resena.comentario}&quot;</p>
            </blockquote>
            <p>⭐ {t('comun.valoracionDe', { valor: resena.valoracion })}</p>
            {resena.respuestaAnfitrion && (
              <p>{t('propiedad.respuestaAnfitrion', { texto: resena.respuestaAnfitrion })}</p>
            )}
          </article>
        ))}
      </section>

      <section aria-labelledby="consulta-heading">
        <h2 id="consulta-heading">{t('propiedad.consultaTitulo')}</h2>

        <form onSubmit={manejarEnvio} noValidate>
          <fieldset>
            <legend>{t('propiedad.consultaLeyenda')}</legend>

            <label htmlFor="consulta-nombre">{t('comun.nombre')}</label>
            <input type="text" {...propsCampo('nombre')} value={valores.nombre} required />
            <MensajeError error={errores.nombre} id="consulta-nombre-error" />

            <label htmlFor="consulta-correo">{t('comun.correo')}</label>
            <input type="email" {...propsCampo('correo')} value={valores.correo} required />
            <MensajeError error={errores.correo} id="consulta-correo-error" />

            <label htmlFor="consulta-asunto">{t('propiedad.consultaAsunto')}</label>
            <input type="text" {...propsCampo('asunto')} value={valores.asunto} required />
            <MensajeError error={errores.asunto} id="consulta-asunto-error" />

            <label htmlFor="consulta-mensaje">{t('propiedad.consultaMensaje')}</label>
            <textarea {...propsCampo('mensaje')} value={valores.mensaje} rows="4" maxLength={500} required />
            <MensajeError error={errores.mensaje} id="consulta-mensaje-error" />

            <MensajeExito mensaje={exito} alOcultar={() => setExito(null)} />

            <button type="submit" className="btn-primario">{t('propiedad.consultaEnviar')}</button>
          </fieldset>
        </form>
      </section>
    </>
  )
}
