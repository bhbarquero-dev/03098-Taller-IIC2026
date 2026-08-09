import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function PoliticasPrivacidad() {
  const { t } = useIdioma()
  useTituloPagina('privacidad.titulo')

  return (
    <section className="pagina-institucional" aria-labelledby="privacidad-heading">
      <h2 id="privacidad-heading">{t('privacidad.titulo')}</h2>
      <p>{t('privacidad.actualizacion')}</p>

      <h3>{t('privacidad.recopilamosTitulo')}</h3>
      <p>{t('privacidad.recopilamosTexto')}</p>

      <h3>{t('privacidad.usoTitulo')}</h3>
      <p>{t('privacidad.usoTexto')}</p>

      <h3>{t('privacidad.tercerosTitulo')}</h3>
      <p>{t('privacidad.tercerosTexto')}</p>

      <h3>{t('privacidad.cookiesTitulo')}</h3>
      <p>{t('privacidad.cookiesTexto')}</p>

      <h3>{t('privacidad.derechosTitulo')}</h3>
      <p>
        {t('privacidad.derechosTextoInicio')}
        <Link to="/ayuda">{t('privacidad.derechosEnlace')}</Link>
        {t('privacidad.derechosTextoFin')}
      </p>

      <h3>{t('privacidad.cambiosTitulo')}</h3>
      <p>{t('privacidad.cambiosTexto')}</p>
    </section>
  )
}
