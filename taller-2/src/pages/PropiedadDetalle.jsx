import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDataStore, useSesion } from '../hooks/useDataStore'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const CAPTIONS_IMAGEN = {
  'sala.jpg': 'Sala de estar',
  'cocina.jpg': 'Cocina equipada',
  'cuarto.jpg': 'Habitación',
  'playa.jpg': 'Vista a la playa',
  'montaña.jpg': 'Vista a la montaña'
}

function generarCalendario(mes, anio, reservas) {
  const primerDiaSemana = (new Date(anio, mes - 1, 1).getDay() + 6) % 7
  const diasEnMes = new Date(anio, mes, 0).getDate()

  const dias = []
  for (let numero = 1; numero <= diasEnMes; numero++) {
    const fechaISO = `${anio}-${String(mes).padStart(2, '0')}-${String(numero).padStart(2, '0')}`
    const reservado = reservas.some(r => fechaISO >= r.fechaEntrada && fechaISO < r.fechaSalida)
    dias.push({ numero, fechaISO, reservado })
  }

  const semanas = []
  let semana = new Array(primerDiaSemana).fill(null)
  for (const dia of dias) {
    semana.push(dia)
    if (semana.length === 7) {
      semanas.push(semana)
      semana = []
    }
  }
  if (semana.length > 0) {
    while (semana.length < 7) semana.push(null)
    semanas.push(semana)
  }
  return semanas
}

export default function PropiedadDetalle() {
  const { id } = useParams()
  const propiedadId = Number(id)
  const { usuario } = useSesion()

  const { datos: propiedad, cargando } = useDataStore('propiedad', { id })
  const { datos: resenas, cargar: cargarResenas } = useDataStore('resenas')
  const { datos: reservas, cargar: cargarReservas } = useDataStore('reservas')
  const { datos: usuarioCompleto, actualizar: actualizarUsuario, cargar: recargarUsuario } = useDataStore('usuario', { id: usuario?.id })

  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth() + 1)
  const [anio, setAnio] = useState(hoy.getFullYear())
  const [orden, setOrden] = useState('valoracion')
  const [consultaEnviada, setConsultaEnviada] = useState(false)

  useEffect(() => {
    cargarResenas({ propiedadId })
    cargarReservas({ propiedadId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propiedadId, cargarResenas, cargarReservas])

  if (cargando) {
    return <p>Cargando propiedad...</p>
  }

  if (!propiedad) {
    return (
      <section aria-labelledby="propiedad-heading">
        <h2 id="propiedad-heading">Propiedad no encontrada</h2>
        <p><Link to="/catalogo">Volver al catálogo</Link></p>
      </section>
    )
  }

  const esFavorito = (usuarioCompleto?.favoritos || []).includes(propiedadId)

  async function alternarFavorito() {
    const actuales = usuarioCompleto?.favoritos || []
    const nuevos = esFavorito
      ? actuales.filter(favoritoId => favoritoId !== propiedadId)
      : [...actuales, propiedadId]
    await actualizarUsuario(usuario.id, { favoritos: nuevos })
    recargarUsuario()
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

  function enviarConsulta(evento) {
    evento.preventDefault()
    evento.target.reset()
    setConsultaEnviada(true)
  }

  const resenasOrdenadas = [...(resenas || [])].sort((a, b) => {
    if (orden === 'valoracion') return b.valoracion - a.valoracion
    if (orden === 'recientes') return new Date(b.fecha) - new Date(a.fecha)
    return new Date(a.fecha) - new Date(b.fecha)
  })

  const semanas = generarCalendario(mes, anio, reservas || [])

  return (
    <>
      <section aria-labelledby="propiedad-heading">
        <h2 id="propiedad-heading">{propiedad.nombre} — {propiedad.ubicacion}</h2>

        <p>
          {usuario ? (
            <button className="btn-secundario" onClick={alternarFavorito} type="button">
              {esFavorito ? 'Quitar de favoritos' : 'Guardar como favorito'}
            </button>
          ) : (
            <Link to="/inicio-sesion">Inicia sesión para guardar como favorito</Link>
          )}
        </p>

        <div className="galeria-propiedad">
          {propiedad.imagenes.map((imagen, indice) => (
            <figure key={imagen + indice}>
              <img src={`/imagenes/${imagen}`} alt={`${CAPTIONS_IMAGEN[imagen] || 'Foto'} de ${propiedad.nombre}`} />
              <figcaption>{CAPTIONS_IMAGEN[imagen] || propiedad.nombre}</figcaption>
            </figure>
          ))}
        </div>

        <h3>Descripción</h3>
        <p>{propiedad.descripcion}</p>

        <h3>Características</h3>
        <ul>
          <li>Tipo de alojamiento: {propiedad.tipo}</li>
          <li>Capacidad: {propiedad.capacidad} huéspedes</li>
          <li>Ubicación: {propiedad.ubicacion}</li>
        </ul>

        <h3>Servicios</h3>
        <ul>
          {propiedad.servicios.map(servicio => (
            <li key={servicio}>{servicio}</li>
          ))}
        </ul>

        <h3>Costo y disponibilidad</h3>
        <p>Desde ${propiedad.precioNoche} por noche · ⭐ {propiedad.valoracion} de 5</p>

        <form onSubmit={verMes}>
          <label htmlFor="disponibilidad-mes">Mes</label>
          <select id="disponibilidad-mes" name="mes" defaultValue={String(mes)}>
            {MESES.map((nombreMes, indice) => (
              <option value={indice + 1} key={nombreMes}>{nombreMes}</option>
            ))}
          </select>

          <label htmlFor="disponibilidad-anio">Año</label>
          <select id="disponibilidad-anio" name="anio" defaultValue={String(anio)}>
            <option value={hoy.getFullYear()}>{hoy.getFullYear()}</option>
            <option value={hoy.getFullYear() + 1}>{hoy.getFullYear() + 1}</option>
          </select>

          <button type="submit">Ver mes</button>
        </form>

        <table className="calendario-disponibilidad">
          <caption>Disponibilidad — {MESES[mes - 1]} {anio}</caption>
          <thead>
            <tr>
              {DIAS_SEMANA.map(dia => <th scope="col" key={dia}>{dia}</th>)}
            </tr>
          </thead>
          <tbody>
            {semanas.map((semana, indiceSemana) => (
              <tr key={indiceSemana}>
                {semana.map((dia, indiceDia) => (
                  <td key={indiceDia} className={dia?.reservado ? 'dia-reservado' : undefined}>
                    {dia && (
                      <>
                        <time dateTime={dia.fechaISO}>{dia.numero}</time>
                        {dia.reservado && <span className="sr-only"> — Reservado</span>}
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="leyenda-calendario"><span className="muestra-reservado"></span> Reservado</p>

        <p>El resto de las fechas está disponible para reservar.</p>

        <p><Link className="btn-primario" to={`/reserva?id=${propiedad.id}`}>Reservar esta propiedad</Link></p>
      </section>

      <section aria-labelledby="resenas-heading">
        <h2 id="resenas-heading">Reseñas de huéspedes</h2>

        <form onSubmit={ordenarResenas}>
          <label htmlFor="resenas-orden">Ordenar por</label>
          <select id="resenas-orden" name="orden" defaultValue={orden}>
            <option value="valoracion">Valoración</option>
            <option value="recientes">Más recientes</option>
            <option value="antiguas">Más antiguas</option>
          </select>
          <button type="submit">Ordenar</button>
        </form>

        {resenasOrdenadas.length === 0 && <p>Todavía no hay reseñas para esta propiedad.</p>}

        <div className="resenas-lista">
          {resenasOrdenadas.map(resena => (
            <article className="tarjeta-resena" key={resena.id}>
              <h3>{resena.autor}</h3>
              <blockquote>
                <p>"{resena.comentario}"</p>
              </blockquote>
              <p>⭐ {resena.valoracion} de 5</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="consulta-heading">
        <h2 id="consulta-heading">Consultar al anfitrión sobre esta propiedad</h2>

        <form onSubmit={enviarConsulta}>
          <fieldset>
            <legend>Formulario de consulta</legend>

            <label htmlFor="consulta-nombre">Nombre</label>
            <input type="text" id="consulta-nombre" name="nombre" required />

            <label htmlFor="consulta-correo">Correo electrónico</label>
            <input type="email" id="consulta-correo" name="correo" required />

            <label htmlFor="consulta-mensaje">Mensaje</label>
            <textarea id="consulta-mensaje" name="mensaje" rows="4" required></textarea>

            <button type="submit" className="btn-primario">Enviar consulta</button>
          </fieldset>
        </form>

        {consultaEnviada && <p className="mensaje-exito">Tu consulta fue enviada. El anfitrión te contactará pronto.</p>}
      </section>
    </>
  )
}
