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

## 1. Introducción y objetivo

Este documento presenta la propuesta de capa de presentación del sitio web StayBooker 360, a construir sobre la estructura HTML5 semántica desarrollada en el Taller No. 1. El Taller No. 1 se centró exclusivamente en el maquetado estructural; este taller incorporará estilos CSS, interactividad, validación de formularios en el lado del cliente y una primera preparación de las páginas para su futura integración con un back-end.

Se documentan cuatro aspectos, siguiendo lo solicitado en el instrumento de evaluación: (1) la estructura general del sitio en HTML5 semántico, (2) la propuesta visual de las hojas de estilo CSS, (3) la estrategia de validación de formularios, interactividad y experiencia de usuario en el front-end, y (4) la preparación de las secciones del sitio para su uso futuro con base de datos y sesiones activas.

**Aclaración de alcance sobre frameworks:** siguiendo el enunciado del taller, la parte responsiva y visual se resolverá con hojas de estilo CSS propias en su totalidad, sin frameworks de CSS. Para la capa de interactividad y manipulación del DOM del lado del cliente se propone emplear React (React, s.f.), con Vite (Vite, s.f.) como herramienta de construcción y React Router (React Router, s.f.) para la navegación entre las 38 vistas del sitio.

## 2. Estructura general del sitio en HTML5 semántico

La arquitectura de información definida en el Taller No. 1 se conservará sin modificaciones: cada una de las 38 páginas mantendrá su jerarquía de etiquetas semánticas (`header`, `nav`, `main`, `section`, `article`, `aside`, `figure`/`figcaption`, `form`, `footer`, `address`). El Taller No. 2 no alterará esta capa de información; únicamente añadirá la capa de presentación (CSS) y la capa de comportamiento (JavaScript/React) por encima de ella, respetando la separación entre estructura, presentación y comportamiento (Moreno, 2018).

### 2.1 De páginas estáticas a vistas de una aplicación de una sola página (SPA)

Para poder compartir un mismo encabezado, menú de navegación y pie de página entre las 38 páginas sin duplicar código, y para habilitar el manejo de sesión y el paso de datos entre pantallas del lado del cliente, se propone migrar las 38 páginas HTML5 del Taller No. 1 a componentes de React (React, s.f.), cada una asociada a una ruta de React Router (React Router, s.f.). La URL de cada vista conservaría un nombre equivalente al archivo original (por ejemplo, `catalogo.html` pasaría a la ruta `/catalogo`; `propiedad-detalle.html?id=1` pasaría a `/propiedades/1`).

Cada componente de página renderizaría el mismo árbol semántico ya validado en Taller No. 1 (`header`, `nav`, `main` con sus `section`/`article`/`aside`, y `footer`), ahora expresado en JSX. Un componente compartido `Layout` centralizaría header, nav y footer, y las páginas internas se insertarían como contenido de `main`. Esto resolvería la repetición de encabezado y pie en cada una de las 38 páginas.

```jsx
// Layout.jsx (boceto propuesto)
export default function Layout() {
  return (
    <>
      <header>
        <h1>{t('header.titulo')}</h1>
        <nav ref={refNav} aria-label={t('header.navegacion')}>
          <ul>{/* usuario: perfil, reservas y cerrar sesión, o registro e inicio de sesión */}</ul>
          <ul>{/* navegación principal: inicio, explorar, promociones, blog y ayuda */}</ul>
          <select aria-label={t('header.idioma')} value={idioma} onChange={...}>…</select>
          <select aria-label={t('header.moneda')} value={moneda} onChange={...}>…</select>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <nav aria-labelledby="compania-heading">…</nav>
        <section aria-labelledby="redes-heading">…</section>
        <section aria-labelledby="boletin-heading">{/* formulario de boletín */}</section>
        <address>…</address>
        <p>{t('footer.copyright')}</p>
      </footer>
    </>
  );
}
```

El primer bloque de la navegación cambiaría según haya sesión iniciada o no, y el pie mantendría la misma estructura del Taller No. 1. Las etiquetas semánticas (`header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `footer`, `address`) se mantendrían exactamente igual que en Taller No. 1; JSX solo cambiaría la sintaxis de escritura, no la semántica del documento renderizado en el navegador.

## 3. Propuesta visual de las hojas de estilo CSS

### 3.1 Organización de las hojas de estilo

Las hojas de estilo se separarán por responsabilidad, en lugar de un único archivo monolítico, para facilitar mantenimiento y reutilización entre las 38 vistas:

**Hojas base**, que aplican a todo el sitio:

- `variables.css` — tokens de diseño: colores, tipografía, espaciado, radios y transiciones.
- `base.css` — tipografía base, rejilla de tres áreas del documento (encabezado, contenido y pie) y comportamiento por defecto de los elementos HTML.
- `layout.css` — únicamente lo compartido por todas las páginas: ancho máximo y separación del `main`.
- `header.css` — encabezado, menú de navegación con sus efectos, y jerarquía de títulos `h1`–`h6`.
- `footer.css` — pie de página en cuadrícula de cuatro columnas.
- `formularios.css` — campos, etiquetas, estados de foco y de error, variantes de botón y mensajes al usuario.
- `componentes.css` — componentes reutilizados en dos o más páginas, como la tarjeta de propiedad.

**Hojas por página o por área**, una por cada conjunto de vistas con estilos propios: `inicio.css`, `catalogo.css`, `propiedad.css`, `institucional.css`, `blog.css`, `promociones.css`, `reserva.css`, `cuenta.css`, `perfil.css`, `propiedad-formulario.css` y `panel.css` (compartida por las vistas de los paneles de anfitrión y administración).

Se estiman dieciocho archivos en total. Todas compartirían las variables de `variables.css`, garantizando consistencia visual entre las páginas.

La estructura general de cada página (encabezado, contenido, pie) se propone resolver con **CSS Grid** (MDN Web Docs, s.f.) sobre `body`, en `base.css`, con tres áreas apiladas; `layout.css` ubicaría `main` en su área y le fijaría el ancho máximo de lectura:

```css
/* propuesta para base.css */
body {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header"
    "main"
    "footer";
  min-height: 100vh;
}

/* propuesta para layout.css */
main {
  grid-area: main;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* propuesta para header.css */
header {
  grid-area: header;
}

/* propuesta para footer.css */
footer {
  grid-area: footer;
}
```

Más allá del esqueleto de página, se propone repetir Grid en toda la aplicación para cuadrículas de tarjetas y paneles de datos: el layout de dos columnas del catálogo (`aside` de filtros + resultados), las tarjetas de propiedades destacadas y de promociones, las tarjetas de entradas del blog, la lista de favoritos del perfil, las tarjetas de estadísticas de los paneles de anfitrión/administración, y el propio `footer` en cuatro columnas (compañía, redes, boletín, contacto). Flexbox se usaría en cambio para disposición lineal de elementos —el menú de navegación del header, los campos de un formulario (etiqueta sobre input), la fila de botones de acción, y el contenido interno de cada tarjeta (`componentes.css`)—, donde no hace falta una cuadrícula bidimensional.

### 3.2 Paleta de colores y tipografía

La paleta propuesta:

- Color primario: `#1F6F5C` (verde azulado profundo) — encabezado, enlaces activos, botones principales.
- Color primario oscuro: `#17553F` — estado hover/activo de elementos primarios.
- Color de acento: `#F2A65A` (arena/atardecer) — subrayados de hover, insignias de promociones.
- Texto principal: `#1E293B`; fondo general: `#F8FAFC`; superficies (tarjetas, formularios): `#FFFFFF`.
- Estado de error: `#DC2626`; estado de éxito: `#16A34A`.

Tipografía: **Poppins** (semibold) para títulos (h1–h4) y **Inter** para texto de cuerpo, etiquetas y botones — dos tipografías sans-serif declaradas en las variables, con pila de respaldo a fuentes del sistema (`system-ui`, `Segoe UI`, `Arial`). La distinción entre familia de títulos y familia de cuerpo se aplicaría con las variables `--font-heading` y `--font-body` en toda la aplicación.

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

El resto del CSS consumiría estos tokens en vez de repetir valores sueltos, por ejemplo en la tarjeta de propiedad (`componentes.css`):

```css
.tarjeta-propiedad {
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border-radius: var(--radius-base);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}
```

Si la paleta cambia, se editaría una sola vez en `variables.css` y el ajuste se propagaría a las páginas.

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

**Formularios**: cada campo se agruparía en un contenedor de columna (etiqueta arriba, campo abajo), con borde neutro que cambiaría a color primario y una sombra de foco al enfocarse (accesible por teclado), y a color de error cuando la validación falle.

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

**Botones**: variante primaria de fondo sólido con leve elevación al pasar el cursor; variante secundaria de borde; variante de peligro (cancelar reserva) en rojo. Todas compartirían el mismo radio de esquina, tipografía y transición para mantener coherencia visual.

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

### 3.4 Selectores descendentes y scoping CSS

Para evitar conflictos entre estilos y mantener claridad en el código, se propone emplear selectores descendentes (contextual selectors) que aumenten la especificidad y limiten el alcance de las reglas CSS, siguiendo el modelo de especificidad de la cascada (MDN Web Docs, s.f.). Por ejemplo, en lugar de aplicar estilos generales a `footer ul`, se usarían selectores más específicos como:

```css
.footer-compania ul,
.footer-redes ul,
.footer-boletin ul {
  /* estilos aplicables solo a listas dentro de estas secciones */
}
```

Esta técnica evitaría efectos secundarios no deseados: los estilos de la lista de compañía no interferirían con las listas de redes sociales o boletín. Mejoraría la mantenibilidad y legibilidad del código CSS.

### 3.5 Disposición, espaciado y aspectos responsivos

El espaciado se controlaría en toda la aplicación con las variables `--space-1/2/3` (ver §3.2), evitando valores sueltos repetidos por todo el CSS.

El sitio se propone diseñar **mobile-first**: los estilos base corresponderían a una columna en pantallas angostas, y las media queries ampliarían a las disposiciones de Grid/Flexbox descritas en §3.1 en pantallas medianas y grandes. Toda la responsividad se resolvería con CSS puro (media queries; MDN Web Docs, s.f.), sin ningún framework de CSS, cumpliendo el requisito explícito del taller.

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

Breakpoints propuestos: 640px (móvil a tableta) y 1024px (tableta a escritorio), consistentes con los tamaños de contenedor a usar en toda la aplicación.

## 4. Validación de formularios, interactividad y experiencia de usuario en front-end

### 4.1 Validación de formularios en el lado del cliente

Cada formulario combinaría dos niveles de validación: atributos nativos de HTML5 (`required`, `type="email"`, `pattern`, `min`, `max`, `maxlength`) como primera barrera (MDN Web Docs, s.f.), y una función de validación en JavaScript que se ejecutaría antes de simular el envío, mostrando mensajes de error específicos por campo y evitando el envío si existen errores.

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

Las funciones de validación se centralizarían en un único módulo (`validaciones.js`) y devolverían **claves de mensaje**, no textos, de modo que el mensaje mostrado dependa del idioma activo. El estado, el foco y los mensajes de cada formulario los gestionaría un hook propio (`useFormulario`), que evitaría repetir el mismo esqueleto en los veinticinco formularios del sitio.

### 4.2 Manipulación del DOM

Aunque React gestiona el árbol de la interfaz mediante un DOM virtual, se propone incorporar manipulación directa del DOM en los puntos donde sea necesario un control explícito, mediante referencias (`useRef`) y las APIs nativas del navegador (MDN Web Docs, s.f.): enfocar el primer campo con error, alternar clases CSS de estado (por ejemplo, `campo-invalido` o `enlace-activo`), actualizar `document.title` de forma dinámica y adjuntar/quitar manejadores de eventos nativos en el menú de navegación.

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

Este mismo patrón (referencia al nodo real + `addEventListener`/`removeEventListener`) se reutilizaría para los botones de los formularios que requieran retroalimentación inmediata, como resaltar el botón de enviar reserva mientras se valida la disponibilidad simulada.

### 4.3 Mensajes del lado del cliente

El sitio mostraría mensajes generados y controlados enteramente en el navegador, sin procesamiento en base de datos: saludo personalizado con sesión iniciada ("Hola, [nombre]. Estos alojamientos coinciden con tus preferencias.", en la página de Inicio, tomado del estado de sesión), confirmación visual tras enviar un formulario válido (por ejemplo, resumen de reserva o confirmación de suscripción al boletín), y mensajes de error específicos por campo cuando la validación falle. Los mensajes se implementarían como componentes de React condicionados por el estado de errores/éxito, estilizados con las clases `.mensaje-error` y `.mensaje-exito` propuestas en la hoja de estilos de formularios.


## 5. Preparación de las secciones del sitio para integración futura con back-end

Aunque el taller no requiere procesamiento real en base de datos, el sitio se estructurará para facilitar esa integración posterior, siguiendo el principio de separar la interfaz de la lógica de datos:

- **Nombres de campos consistentes:** los atributos `name` de cada formulario (`correo`, `clave`, `destino`, `entrada`, `salida`, `huespedes`, `precio_min`, `precio_max`, `servicios`) coincidirían con los nombres que tendrían las columnas o propiedades del futuro modelo de datos, evitando renombrados posteriores.
- **Forma de los datos prevista en JSON:** cada entidad (propiedad, reserva, usuario) se modelaría en el front-end con la forma que tendría la respuesta de una futura API, de modo que reemplazar los datos de ejemplo por una llamada real (`fetch`) no requiera rediseñar los componentes.

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
    "servicios": ["wifi", "piscina", "parqueo"],
    "imagenes": ["sala.jpg", "cocina.jpg", "cuarto.jpg"],
    "anfitrionId": 2,
    "estado": "publicada",
    "promocionId": 1,
    "fechasBloqueadas": ["2026-08-29", "2026-08-30"],
    "consultasContador": 42,
    "mascotas": false,
    "fumar": false,
    "horaEntrada": "15:00",
    "horaSalida": "11:00",
    "politicaCancelacion": "Cancelación gratuita hasta 5 días antes de la fecha de entrada.",
    "contactoCorreo": "anfitrion@ejemplo.com",
    "contactoTelefono": "+506 8888-0001"
  }
}
```

- **Data store como única puerta a los datos:** todas las operaciones (`obtenerPropiedades`, `obtenerPropiedad(id)`, `crearReserva(datos)`, `responderConsulta(id, texto)`, …) vivirían en `src/utils/dataStore/`, un módulo por entidad —propiedades, reservas, usuarios, reseñas, promociones, consultas, entradas de blog e incidencias— reunidos en un índice común. Los componentes importarían siempre desde ese índice y no sabrían de dónde salen los datos. Cada función leería y escribiría `localStorage`; migrar a un servidor real significaría reescribir el interior de esos módulos por llamadas `fetch` al endpoint equivalente (`GET /api/propiedades/:id`, `POST /api/reservas`, …), sin tocar ni un componente.
- **Validación cliente como primera capa, no la única:** las funciones de validación (sección 4.1) serían una primera barrera de calidad de datos; se anticipa que el futuro back-end repita esas mismas validaciones del lado del servidor antes de escribir en base de datos, por seguridad.
- **Carga de archivos, pendiente por definición:** los campos de imagen y video validarían la extensión y registrarían el nombre del archivo elegido, pero sin servidor no habría dónde subirlo. Ese sería el punto exacto donde entraría el almacenamiento real de multimedia.

## 6. Referencias

- Moreno, D. (2018). *Diseño Web: Interfaces y código cliente*. EUNED.
- React. (s.f.). *React documentation*. https://react.dev
- Vite. (s.f.). *Vite documentation*. https://vitejs.dev
- React Router. (s.f.). *React Router documentation*. https://reactrouter.com
- MDN Web Docs. (s.f.). *CSS, HTML y JavaScript reference*. Mozilla. https://developer.mozilla.org
