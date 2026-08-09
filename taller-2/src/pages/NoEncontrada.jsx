import { Link } from 'react-router-dom'
import { useIdioma } from '../context/IdiomaContext'
import { useTituloPagina } from '../hooks/useTituloPagina'

export default function NoEncontrada() {
  const { t } = useIdioma()
  useTituloPagina('noEncontrada.titulo')

  return (
    <section aria-labelledby="no-encontrada-heading">
      <h2 id="no-encontrada-heading">{t('noEncontrada.titulo')}</h2>
      <p>{t('noEncontrada.texto')}</p>
      <p><Link className="btn-primario" to="/">{t('comun.volverInicio')}</Link></p>
    </section>
  )
}
