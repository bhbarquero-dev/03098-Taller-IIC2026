import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useDataStore } from '../hooks/useDataStore'
import EtiquetaEstado from '../components/EtiquetaEstado'
import { obtenerPropiedad, obtenerUsuario, obtenerUsuarios } from '../utils/dataStore'

export default function AdminReservas() {
  const { t, formatearFecha } = useIdioma()
  useTituloPagina('admin.reservasTitulo')

  const { datos: reservas } = useDataStore('reservas')
  const [anfitrionFiltro, setAnfitrionFiltro] = useState('')

  const anfitriones = obtenerUsuarios().filter((usuario) => usuario.rol === 'anfitrion')
  const listado = (reservas || []).filter((reserva) => (
    !anfitrionFiltro || reserva.anfitrionId === Number(anfitrionFiltro)
  ))

  function filtrar(evento) {
    evento.preventDefault()
    setAnfitrionFiltro(new FormData(evento.target).get('anfitrion'))
  }

  return (
    <section aria-labelledby="reservas-heading">
      <h2 id="reservas-heading">{t('admin.reservasTitulo')}</h2>

      <form onSubmit={filtrar}>
        <label htmlFor="filtro-anfitrion">{t('admin.filtrarAnfitrion')}</label>
        <select id="filtro-anfitrion" name="anfitrion" defaultValue={anfitrionFiltro}>
          <option value="">{t('admin.todosAnfitriones')}</option>
          {anfitriones.map((anfitrion) => (
            <option value={anfitrion.id} key={anfitrion.id}>{anfitrion.nombre}</option>
          ))}
        </select>
        <button type="submit">{t('admin.filtrar')}</button>
      </form>

      <table className="tabla-panel">
        <thead>
          <tr>
            <th scope="col">{t('comun.propiedad')}</th>
            <th scope="col">{t('comun.anfitrion')}</th>
            <th scope="col">{t('comun.huesped')}</th>
            <th scope="col">{t('comun.fechas')}</th>
            <th scope="col">{t('admin.estadoReserva')}</th>
            <th scope="col">{t('admin.estadoPago')}</th>
            <th scope="col">{t('comun.acciones')}</th>
          </tr>
        </thead>
        <tbody>
          {listado.map((reserva) => (
            <tr key={reserva.id}>
              <td>{obtenerPropiedad(reserva.propiedadId)?.nombre || '—'}</td>
              <td>{obtenerUsuario(reserva.anfitrionId)?.nombre || '—'}</td>
              <td>{obtenerUsuario(reserva.usuarioId)?.nombre || '—'}</td>
              <td>
                <time dateTime={reserva.fechaEntrada}>{formatearFecha(reserva.fechaEntrada, 'medium')}</time>
                {' → '}
                <time dateTime={reserva.fechaSalida}>{formatearFecha(reserva.fechaSalida, 'medium')}</time>
              </td>
              <td><EtiquetaEstado estado={reserva.estado} /></td>
              <td><EtiquetaEstado estado={reserva.estadoPago} /></td>
              <td><Link to={`/admin-reserva-editar/${reserva.id}`}>{t('comun.editar')}</Link></td>
            </tr>
          ))}
        </tbody>
      </table>

      {listado.length === 0 && <p>{t('comun.sinDatos')}</p>}

      <p><Link to="/admin-panel">{t('admin.volverPanel')}</Link></p>
    </section>
  )
}
