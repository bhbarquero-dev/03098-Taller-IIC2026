import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import Index from './pages/Index'
import Catalogo from './pages/Catalogo'
import PropiedadDetalle from './pages/PropiedadDetalle'
import InicioSesion from './pages/InicioSesion'
import Perfil from './pages/Perfil'
import { inicializarDatosEjemplo } from './utils/dataStore'
import './styles/variables.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/header.css'
import './styles/footer.css'
import './styles/formularios.css'
import './styles/componentes.css'
import './styles/inicio.css'
import './styles/catalogo.css'
import './styles/propiedad.css'

function App() {
  useEffect(() => {
    // Inicializar datos de ejemplo en localStorage si es necesario
    inicializarDatosEjemplo()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/propiedades/:id" element={<PropiedadDetalle />} />
          <Route path="/inicio-sesion" element={<InicioSesion />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
