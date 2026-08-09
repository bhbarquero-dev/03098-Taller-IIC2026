import { useNavigate } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useSesion } from '../context/SesionContext'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useFormulario } from '../hooks/useFormulario'
import FormularioPropiedad from '../components/FormularioPropiedad'
import { crearPropiedad, promoverAAnfitrion } from '../utils/dataStore'
import {
  propiedadDesdeValores,
  validarPropiedad,
  valoresDesdePropiedad
} from '../utils/validarPropiedad'

export default function PublicarPropiedad() {
  const { t } = useIdioma()
  const { usuario, actualizarPerfil } = useSesion()
  const navigate = useNavigate()
  useTituloPagina('publicar.institucionalTitulo')

  const formulario = useFormulario({
    prefijoId: 'propiedad',
    valoresIniciales: valoresDesdePropiedad(null),
    validarValores: validarPropiedad,
    alEnviar: (valores) => {
      crearPropiedad({
        ...propiedadDesdeValores(valores),
        anfitrionId: usuario.id,
        estado: 'pendiente'
      })

      // Modelo de cuenta única: publicar la primera propiedad activa el rol.
      if (usuario.rol === 'huesped') {
        promoverAAnfitrion(usuario.id)
        actualizarPerfil({ rol: 'anfitrion' })
      }

      navigate('/anfitrion-propiedades', { state: { mensaje: t('publicar.exito') } })
    }
  })

  return (
    <>
      <section className="pagina-institucional" aria-labelledby="institucional-heading">
        <h2 id="institucional-heading">{t('publicar.institucionalTitulo')}</h2>
        <p>{t('publicar.institucionalTexto')}</p>

        <h3>{t('publicar.beneficiosTitulo')}</h3>
        <p>{t('publicar.beneficiosTexto')}</p>

        <h3>{t('publicar.requisitosTitulo')}</h3>
        <p>{t('publicar.requisitosTexto')}</p>

        <h3>{t('publicar.procesoTitulo')}</h3>
        <ol>
          <li>{t('publicar.proceso1')}</li>
          <li>{t('publicar.proceso2')}</li>
          <li>{t('publicar.proceso3')}</li>
        </ol>
      </section>

      <section aria-labelledby="propiedad-heading">
        <h2 id="propiedad-heading">{t('publicar.datosTitulo')}</h2>

        <form onSubmit={formulario.manejarEnvio} noValidate>
          <FormularioPropiedad formulario={formulario} />
          <button type="submit" className="btn-primario">{t('publicar.publicar')}</button>
        </form>
      </section>
    </>
  )
}
