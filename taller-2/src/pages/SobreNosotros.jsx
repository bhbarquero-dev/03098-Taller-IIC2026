import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function SobreNosotros() {
  const { t } = useIdioma()
  useTituloPagina('sobreNosotros.titulo')

  return (
    <section className="pagina-institucional" aria-labelledby="sobre-heading">
      <h2 id="sobre-heading">{t('sobreNosotros.titulo')}</h2>

      <h3>{t('sobreNosotros.quienesTitulo')}</h3>
      <p>{t('sobreNosotros.quienesTexto')}</p>

      <h3>{t('sobreNosotros.misionTitulo')}</h3>
      <p>{t('sobreNosotros.misionTexto')}</p>

      <h3>{t('sobreNosotros.visionTitulo')}</h3>
      <p>{t('sobreNosotros.visionTexto')}</p>

      <h3>{t('sobreNosotros.historiaTitulo')}</h3>
      <p>{t('sobreNosotros.historiaTexto')}</p>

      <h3>{t('sobreNosotros.coberturaTitulo')}</h3>
      <p>{t('sobreNosotros.coberturaTexto')}</p>
    </section>
  )
}
