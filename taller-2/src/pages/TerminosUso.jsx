import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function TerminosUso() {
  const { t } = useIdioma()
  useTituloPagina('terminos.titulo')

  return (
    <section className="pagina-institucional" aria-labelledby="terminos-heading">
      <h2 id="terminos-heading">{t('terminos.titulo')}</h2>
      <p>{t('terminos.actualizacion')}</p>

      <h3>{t('terminos.aceptacionTitulo')}</h3>
      <p>
        {t('terminos.aceptacionTextoInicio')}
        <Link to="/politicas-privacidad">{t('terminos.aceptacionEnlace')}</Link>
        {t('terminos.aceptacionTextoFin')}
      </p>

      <h3>{t('terminos.cuentaTitulo')}</h3>
      <p>{t('terminos.cuentaTexto')}</p>

      <h3>{t('terminos.huespedTitulo')}</h3>
      <p>{t('terminos.huespedTexto')}</p>

      <h3>{t('terminos.anfitrionTitulo')}</h3>
      <p>{t('terminos.anfitrionTexto')}</p>

      <h3>{t('terminos.pagosTitulo')}</h3>
      <p>{t('terminos.pagosTexto')}</p>

      <h3>{t('terminos.cancelacionesTitulo')}</h3>
      <p>{t('terminos.cancelacionesTexto')}</p>

      <h3>{t('terminos.contenidoTitulo')}</h3>
      <p>{t('terminos.contenidoTexto')}</p>

      <h3>{t('terminos.responsabilidadTitulo')}</h3>
      <p>{t('terminos.responsabilidadTexto')}</p>

      <h3>{t('terminos.cambiosTitulo')}</h3>
      <p>{t('terminos.cambiosTexto')}</p>
    </section>
  )
}
