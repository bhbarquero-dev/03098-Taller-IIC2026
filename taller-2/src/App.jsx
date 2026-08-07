import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout'
import Index from './pages/Index'
import Catalogo from './pages/Catalogo'
import { inicializarDatosEjemplo } from './utils/dataStore'
import './styles/variables.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/header.css'
import './styles/footer.css'
import './styles/formularios.css'

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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
