# UNIVERSIDAD ESTATAL A DISTANCIA
**VICERRECTORÍA ACADÉMICA**
**ESCUELA DE CIENCIAS EXACTAS Y NATURALES — INGENIERÍA INFORMÁTICA**

03098 – Programación Web

# Taller No. 2
## Parte 1 — Propuesta de capa de presentación
*Sitio web: StayBooker 360*

Participante: Bernal Hernández Barquero
Profesora: Daniela Hidalgo Cordero
Agosto 2026

---

> **Estado: BORRADOR.** Este documento se está redactando antes de construir el código de Parte 2. Es probable que cambie mientras se implementa el sitio — cualquier decisión aquí (paleta, arquitectura de carpetas CSS, forma exacta del contexto de sesión, etc.) se ajusta libremente hasta que Parte 2 esté lista. Cuando el contenido quede firme, se convierte a `.docx`/`.pdf` para la entrega.

## 1. Introducción y objetivo

Este documento presenta la propuesta de capa de presentación del sitio web StayBooker 360, construida sobre la estructura HTML5 semántica desarrollada en el Taller No. 1 (34 páginas: catálogo, detalle de propiedad, reserva, paneles de huésped, anfitrión y administrador, secciones institucionales, entre otras). El Taller No. 1 se centró exclusivamente en el maquetado estructural; este taller incorpora estilos CSS, interactividad, validación de formularios en el lado del cliente y una primera preparación de las páginas para su futura integración con un back-end.

Se documentan cuatro aspectos, siguiendo lo solicitado en el instrumento de evaluación: (1) la estructura general del sitio en HTML5 semántico, (2) la propuesta visual de las hojas de estilo CSS, (3) la estrategia de validación de formularios, interactividad y experiencia de usuario en el front-end, y (4) la preparación de las secciones del sitio para su uso futuro con base de datos y sesiones activas.

**Aclaración de alcance sobre frameworks:** siguiendo el enunciado del taller, la parte responsiva y visual se resuelve con hojas de estilo CSS propias en su totalidad, sin frameworks de CSS (sin Bootstrap, Tailwind ni similares). Para la capa de interactividad y manipulación del DOM del lado del cliente se emplea React, con Vite como herramienta de construcción y React Router para la navegación entre las 34 vistas del sitio. Esta distinción — CSS propio al 100 %, JavaScript con framework — se mantiene de forma consistente en todo el documento.

> ⚠️ *Nota abierta:* no está confirmado con la profesora si React satisface el rubro "Realiza manipulación de objetos del DOM" dado que abstrae el DOM directo. La sección 4.3 documenta cómo se fuerza manipulación directa (refs + `addEventListener`) para cubrir ese rubro explícitamente. Confirmar con la profesora si esto es aceptado antes de dar Parte 2 por cerrada.

## 2. Estructura general del sitio en HTML5 semántico

La arquitectura de información definida en el Taller No. 1 se conserva sin modificaciones: cada una de las 34 páginas mantiene su jerarquía de etiquetas semánticas (`header`, `nav`, `main`, `section`, `article`, `aside`, `figure`/`figcaption`, `form`, `footer`, `address`). El Taller No. 2 no altera esta capa de información; únicamente añade la capa de presentación (CSS) y la capa de comportamiento (JavaScript/React) por encima de ella, respetando la separación entre estructura, presentación y comportamiento.

### 2.1 De páginas estáticas a vistas de una aplicación de una sola página (SPA)

Para poder compartir un mismo encabezado, menú de navegación y pie de página entre las 34 páginas sin duplicar código, y para habilitar el manejo de sesión y el paso de datos entre pantallas del lado del cliente, las 34 páginas HTML5 del Taller No. 1 se migran a componentes de React, cada una asociada a una ruta de React Router. La URL de cada vista conserva un nombre equivalente al archivo original (por ejemplo, `catalogo.html` pasa a la ruta `/catalogo`; `propiedad-detalle.html?id=1` pasa a `/propiedades/1`).

Cada componente de página renderiza el mismo árbol semántico ya validado en Taller No. 1 (`header`, `nav`, `main` con sus `section`/`article`/`aside`, y `footer`), ahora expresado en JSX. El componente compartido `Layout` centraliza header, nav y footer, y las páginas internas se insertan como contenido de `main` mediante el mecanismo de rutas anidadas de React Router (`Outlet`). Esto resuelve, de forma justificada por el propio comportamiento del framework, la repetición de encabezado y pie en cada una de las 34 páginas.

```jsx
// src/layout/Layout.jsx
import { Outlet, NavLink } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <header>
        <h1>StayBooker 360</h1>
        <nav aria-label="Navegación del sitio">
          <ul>
            <li><NavLink to="/">Inicio</NavLink></li>
            <li><NavLink to="/catalogo">Explorar</NavLink></li>
            <li><NavLink to="/promociones">Promociones</NavLink></li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>{/* enlaces institucionales, redes, boletín */}</footer>
    </>
  );
}
```

Las etiquetas semánticas (`header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `footer`, `address`) se mantienen exactamente igual que en Taller No. 1; JSX solo cambia la sintaxis de escritura, no la semántica del documento renderizado en el navegador.

## 3. Propuesta visual de las hojas de estilo CSS

### 3.1 Organización de las hojas de estilo

Las hojas de estilo se separan por responsabilidad, en lugar de un único archivo monolítico, para facilitar mantenimiento y reutilización entre las 34 vistas:

- `variables.css` — tokens de diseño: colores, tipografía, espaciado, radios y transiciones.
- `base.css` — reset ligero, tipografía base y comportamiento por defecto de elementos HTML.
- `layout.css` — estructura general (grid/flexbox del header, main y footer).
- `componentes/header-nav.css` — encabezado y menú de navegación, incluidos los efectos hover.
- `componentes/formularios.css` — campos, etiquetas, estados de error y de foco.
- `componentes/botones.css` — variantes de botones (primario, secundario, peligro).
- `componentes/tarjetas.css` — cajas de propiedades, promociones y reseñas (`article`).
- `responsive.css` — media queries transversales para los breakpoints definidos.

Cada componente de React importa únicamente la hoja de estilo que necesita, pero todas comparten las variables definidas en `variables.css`, garantizando consistencia visual entre las 34 páginas sin recurrir a un framework de CSS.

### 3.2 Paleta de colores y tipografía

La paleta busca transmitir confianza y calidez (hospedaje, viaje) sin perder legibilidad:

- Color primario: `#1F6F5C` (verde azulado profundo) — encabezado, enlaces activos, botones principales.
- Color primario oscuro: `#17553F` — estado hover/activo de elementos primarios.
- Color de acento: `#F2A65A` (arena/atardecer) — subrayados de hover, insignias de promociones.
- Texto principal: `#1E293B`; fondo general: `#F8FAFC`; superficies (tarjetas, formularios): `#FFFFFF`.
- Estado de error: `#DC2626`; estado de éxito: `#16A34A`.

Tipografía: **Poppins** (semibold) para títulos (h1–h4) y **Inter** para texto de cuerpo, etiquetas y botones — ambas tipografías sans-serif de Google Fonts, con pila de respaldo a fuentes del sistema (`system-ui`, `Segoe UI`, `Arial`) si no cargan.

```css
:root {
  --color-primary: #1F6F5C;
  --color-primary-dark: #17553F;
  --color-accent: #F2A65A;
  --color-text: #1E293B;
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-error: #DC2626;
  --color-success: #16A34A;
  --font-heading: 'Poppins', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --radius-base: 8px;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --transition-base: 180ms ease-in-out;
}
```

### 3.3 Bloques: cajas, menús, formularios y botones

**Cajas** (tarjetas de propiedad, promoción y reseña — etiqueta `article`): borde sutil, esquinas redondeadas mediante `--radius-base`, sombra ligera y separación interna consistente con las variables de espaciado.

**Menú de navegación** (`header`/`nav`): distribución en fila con flexbox, separación uniforme entre enlaces y una línea inferior que aparece progresivamente al pasar el cursor (transición de color y de `border-bottom`).

```css
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  background-color: var(--color-surface);
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
}
nav ul { display: flex; gap: var(--space-3); list-style: none; }
nav a {
  color: var(--color-text);
  text-decoration: none;
  font-family: var(--font-body);
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  transition: border-color var(--transition-base), color var(--transition-base);
}
nav a:hover, nav a.enlace-activo {
  color: var(--color-primary);
  border-bottom-color: var(--color-accent);
}
```

**Formularios**: cada campo se agrupa en un contenedor de columna (etiqueta arriba, campo abajo), con borde neutro que cambia a color primario y una sombra de foco al enfocarse (accesible por teclado), y a color de error cuando la validación falla.

```css
.campo { display: flex; flex-direction: column; gap: 4px; margin-bottom: var(--space-2); }
input, select, textarea {
  padding: 10px 12px;
  border: 1px solid #CBD5E1;
  border-radius: var(--radius-base);
  font-family: var(--font-body);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(31,111,92,.15);
}
input.campo-invalido { border-color: var(--color-error); }
.mensaje-error { color: var(--color-error); font-size: .85rem; margin-top: 2px; }
```

**Botones**: variante primaria de fondo sólido con leve elevación al pasar el cursor; variante secundaria de borde; variante de peligro (cancelar reserva) en rojo. Todas comparten el mismo radio de esquina, tipografía y transición para mantener coherencia visual.

```css
.btn-primario {
  background-color: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-base);
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color var(--transition-base), transform 120ms ease;
}
.btn-primario:hover { background-color: var(--color-primary-dark); transform: translateY(-1px); }
.btn-secundario { background: transparent; border: 1px solid var(--color-primary); color: var(--color-primary); }
```

### 3.4 Disposición, espaciado y aspectos responsivos

El layout general usa CSS Grid para las cuadrículas de tarjetas (catálogo, destacados, resultados de búsqueda) y Flexbox para los componentes lineales (header, filtros, formularios en fila). El espaciado se controla con las variables `--space-1/2/3`, evitando valores sueltos repetidos por todo el CSS.

El sitio se diseña **mobile-first**: los estilos base corresponden a una columna en pantallas angostas, y las media queries amplían la disposición en pantallas medianas y grandes. Toda la responsividad se resuelve con CSS puro (Grid, Flexbox y media queries), sin ningún framework de CSS, cumpliendo el requisito explícito del taller.

```css
.catalogo-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
}
@media (min-width: 640px) {
  .catalogo-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .catalogo-grid { grid-template-columns: repeat(4, 1fr); }
  header { flex-direction: row; }
}
```

Breakpoints definidos: 640px (móvil a tableta) y 1024px (tableta a escritorio), consistentes con los tamaños de contenedor usados en toda la aplicación.

## 4. Validación de formularios, interactividad y experiencia de usuario en front-end

### 4.1 Arquitectura de JavaScript

La interactividad se implementa con React (Vite como bundler y servidor de desarrollo, React Router para las rutas de las 34 vistas). Esta decisión se documenta y se asume de forma explícita: el CSS del sitio es 100 % propio y sin frameworks; el framework se usa exclusivamente para JavaScript/DOM, tal como lo permite el Taller No. 1 respecto al uso de frameworks en el Taller No. 2.

### 4.2 Validación de formularios en el lado del cliente

Cada formulario (registro, inicio de sesión, publicación de propiedad, reserva, contacto, boletín, entre otros) combina dos niveles de validación: atributos nativos de HTML5 (`required`, `type="email"`, `pattern`, `min`, `max`, `maxlength`) como primera barrera, y una función de validación en JavaScript que se ejecuta antes de simular el envío, mostrando mensajes de error específicos por campo y evitando el envío si existen errores.

```jsx
function validarRegistro(valores) {
  const errores = {};
  if (!valores.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio.';
  }
  const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!patronCorreo.test(valores.correo)) {
    errores.correo = 'Ingresa un correo electrónico válido.';
  }
  if (valores.clave.length < 8) {
    errores.clave = 'La contraseña debe tener al menos 8 caracteres.';
  }
  return errores;
}

function manejarEnvio(evento) {
  evento.preventDefault();
  const erroresEncontrados = validarRegistro(valores);
  setErrores(erroresEncontrados);
  if (Object.keys(erroresEncontrados).length > 0) {
    campoConErrorRef.current?.focus();
    return;
  }
  registrarUsuario(valores);
}
```

Se validan, según el formulario: espacios vacíos en campos obligatorios, formato de correo electrónico, longitud y tipo de caracteres en contraseñas y campos numéricos (capacidad, precio, huéspedes), coherencia de fechas de entrada/salida en la reserva, y extensión de archivos en los campos de carga de imágenes del panel de anfitrión (aceptando únicamente `.jpg`, `.jpeg`, `.png` y `.webp`).

### 4.3 Manipulación del DOM

Aunque React gestiona el árbol de la interfaz mediante un DOM virtual, el sitio incorpora manipulación directa del DOM en los puntos donde es necesario un control explícito, mediante referencias (`useRef`) y las APIs nativas del navegador: enfocar el primer campo con error, alternar clases CSS de estado (por ejemplo, `campo-invalido` o `enlace-activo`), actualizar `document.title` de forma dinámica y adjuntar/quitar manejadores de eventos nativos en el menú de navegación.

```jsx
// Efecto hover del menú, con addEventListener nativo (onmouseover / onmouseout)
function useEfectoMenu(refNav) {
  useEffect(() => {
    const nodo = refNav.current;
    if (!nodo) return;
    const enlaces = nodo.querySelectorAll('a');

    function resaltar(evento) {
      evento.target.classList.add('enlace-activo');
    }
    function quitarResalte(evento) {
      evento.target.classList.remove('enlace-activo');
    }

    enlaces.forEach((enlace) => {
      enlace.addEventListener('mouseover', resaltar);
      enlace.addEventListener('mouseout', quitarResalte);
    });

    return () => {
      enlaces.forEach((enlace) => {
        enlace.removeEventListener('mouseover', resaltar);
        enlace.removeEventListener('mouseout', quitarResalte);
      });
    };
  }, [refNav]);
}
```

Este mismo patrón (referencia al nodo real + `addEventListener`/`removeEventListener`) se reutiliza para los botones de los formularios que requieren retroalimentación inmediata, como resaltar el botón de enviar reserva mientras se valida la disponibilidad simulada.

### 4.4 Mensajes del lado del cliente

El sitio muestra mensajes generados y controlados enteramente en el navegador, sin procesamiento en base de datos: saludo de bienvenida personalizado tras iniciar sesión ("Hola, [nombre]", tomado del estado de sesión), confirmación visual tras enviar un formulario válido (por ejemplo, resumen de reserva o confirmación de suscripción al boletín), y mensajes de error específicos por campo cuando la validación falla. Los mensajes se implementan como componentes de React condicionados por el estado de errores/éxito, estilizados con las clases `.mensaje-error` y `.mensaje-exito` definidas en la hoja de estilos de formularios.

### 4.5 Envío de información entre páginas y sesión activa

El paso de datos de una vista a otra se realiza íntegramente en el cliente, sin backend: los parámetros de ruta de React Router (por ejemplo `/propiedades/1`) identifican la propiedad seleccionada, y el estado de navegación (`location.state`) transporta datos temporales entre pasos de un mismo flujo, como el resumen de una reserva antes de su confirmación.

La sesión activa se maneja mediante una función dedicada y un conjunto de variables de estado, expuestas a toda la aplicación con un contexto de React y persistidas en `sessionStorage` para sobrevivir a la navegación entre las 34 vistas dentro de una misma pestaña:

```jsx
function useSesion() {
  const [usuario, setUsuario] = useState(() => {
    const guardado = sessionStorage.getItem('staybooker_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  function iniciarSesion(nombre, rol) {
    const datosSesion = { nombre, rol, inicio: new Date().toISOString() };
    sessionStorage.setItem('staybooker_usuario', JSON.stringify(datosSesion));
    setUsuario(datosSesion);
    document.title = `StayBooker 360 — Hola, ${nombre}`;
  }

  function cerrarSesion() {
    sessionStorage.removeItem('staybooker_usuario');
    setUsuario(null);
    document.title = 'StayBooker 360';
  }

  return { usuario, iniciarSesion, cerrarSesion };
}
```

Esta función y sus variables (`usuario`, `iniciarSesion`, `cerrarSesion`) son, de forma intencional, el punto exacto donde se conectará la lógica de back-end más adelante: hoy simulan la sesión en el navegador; cuando exista un servidor, `iniciarSesion` pasará de escribir en `sessionStorage` a llamar a un endpoint de autenticación, sin cambiar la forma en que el resto de los componentes consumen el contexto de sesión.

## 5. Preparación de las secciones del sitio para integración futura con back-end

Aunque el taller no requiere procesamiento real en base de datos, el sitio se estructura para facilitar esa integración posterior, siguiendo el principio de separar la interfaz de la lógica de datos:

- **Nombres de campos consistentes:** los atributos `name` de cada formulario (`correo`, `clave`, `destino`, `entrada`, `salida`, `huespedes`, `precio_min`, `precio_max`, `servicios`) coinciden con los nombres que tendrían las columnas o propiedades del futuro modelo de datos, evitando renombrados posteriores.
- **Forma de los datos prevista en JSON:** cada entidad (propiedad, reserva, usuario) se modela ya en el front-end con la forma que tendría la respuesta de una futura API, de modo que reemplazar los datos de ejemplo por una llamada real (`fetch`) no requiera rediseñar los componentes.

```json
{
  "propiedad": {
    "id": 1,
    "nombre": "Villa Los Sueños",
    "tipo": "villa",
    "ubicacion": "Guanacaste, Costa Rica",
    "capacidad": 6,
    "precioNoche": 85,
    "valoracion": 4.8,
    "servicios": ["wifi", "piscina", "parqueo"]
  }
}
```

- **Funciones de acceso a datos aisladas:** operaciones como `listarPropiedades()`, `obtenerPropiedad(id)` o `crearReserva(datos)` se definen ya como funciones independientes de los componentes visuales; hoy devuelven datos de ejemplo en memoria, y más adelante su implementación interna cambiará a llamadas HTTP sin alterar los componentes que las consumen.
- **Sesión y autenticación extensibles:** el contexto de sesión descrito en la sección 4.5 concentra toda la lógica de usuario activo; al incorporar back-end, `iniciarSesion()` pasará de `sessionStorage` a un token (JWT o cookie de sesión) devuelto por el servidor, manteniendo la misma interfaz para el resto de la aplicación.
- **Validación cliente como primera capa, no la única:** las funciones de validación (sección 4.2) se documentan como una primera barrera de calidad de datos; se anticipa que el futuro back-end repita esas mismas validaciones del lado del servidor antes de escribir en base de datos, por seguridad.

## 6. Conclusión

La propuesta descrita conserva íntegramente la estructura semántica de HTML5 definida en el Taller No. 1, añade una capa de presentación CSS propia y sin frameworks, y resuelve la interactividad, la validación de formularios y el manejo de sesión mediante React, Vite y React Router, dejando puntos de extensión explícitos (funciones de acceso a datos, contexto de sesión) para la futura integración con un back-end real. El Taller No. 2, en su Parte 2, implementará esta propuesta sobre las 34 páginas construidas en el Taller No. 1.

## 7. Referencias

- Moreno, D. (2018). *Diseño Web: Interfaces y código cliente*. EUNED.
- React. (s.f.). *React documentation*. https://react.dev
- Vite. (s.f.). *Vite documentation*. https://vitejs.dev
- React Router. (s.f.). *React Router documentation*. https://reactrouter.com
- MDN Web Docs. (s.f.). *CSS, HTML y JavaScript reference*. Mozilla. https://developer.mozilla.org
