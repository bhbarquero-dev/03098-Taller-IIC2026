# CLAUDE.md — Instrucciones generales del repositorio

Contexto para trabajar en cualquiera de los talleres de este curso. Instrucciones específicas de cada taller viven en su propio `README.md` (`taller-1/README.md`, `taller-2/README.md`); esto es lo que aplica a ambos.

**Alcance activo de trabajo: solo `taller-2/`.** `taller-1/` es referencia — se lee, se consulta su estructura semántica, no se modifica (ver regla dura abajo).

## Curso

- **03098 – Programación Web**, Ingeniería Informática, UNED. II Cuatrimestre 2026.
- Estudiante: Bernal Hernández Barquero (bhbarquero@gmail.com).
- Profesora: Daniela Hidalgo Cordero.
- Texto guía: Moreno, D. (2018). *Diseño Web: Interfaces y código cliente*. EUNED.
- Proyecto único para ambos talleres: **StayBooker 360**, plataforma de alojamientos vacacionales (tipo Airbnb/Booking) con tres tipos de usuario: **huésped**, **anfitrión** y **administrador**. Modelo de cuenta única — no hay registro separado por rol; toda cuenta nace huésped y el rol de anfitrión se activa al publicar la primera propiedad (ver `taller-1/analisis-parte2-taller1.md`, sección 7).

## Estructura del repo

```
03098-Taller-IIC2026/
├── CLAUDE.md          # este archivo
├── README.md          # estado general de entregas
├── taller-1/          # CERRADO — no modificar
└── taller-2/          # en desarrollo
```

## Regla dura: `taller-1/` no se toca

`taller-1/` es la base entregada y evaluada de forma independiente. **No se edita, no se refactoriza, no se le agregan archivos** salvo que el usuario lo pida explícitamente. Es fuente de referencia, no de trabajo: se lee para extraer estructura semántica (ver sección "Estructura semántica vinculante de Taller 1" abajo), nunca se escribe en ella. `taller-2/` construye sobre lo que hay ahí (las 38 páginas HTML de `taller-1/parte-2/` son el punto de partida real, pese a que `taller-1/README.md` diga "Parte 2 pendiente" — ese README quedó desactualizado y no se corrige porque implicaría tocar taller-1).

Toda modificación de código en este repo ocurre en `taller-2/`. Si una tarea pareciera requerir tocar algo dentro de `taller-1/`, detenerse y confirmar con el usuario antes de escribir ahí.

## Reglas de integridad académica (aplican a ambos talleres)

- Nada de plantillas comerciales, prediseños, generadores automáticos de código ni frameworks CSS (Bootstrap, Tailwind, etc.). El diseño visual es 100% original y propio.
- Taller 1: solo HTML5 semántico, cero CSS/JS/frameworks, cero `div`/`table` de maquetación.
- Taller 2: se permite un framework de JavaScript (se usa React + Vite + React Router — ver `taller-2/Taller2-Parte1-StayBooker360.md`), pero el CSS sigue siendo 100% propio, sin frameworks de CSS.
- Cada taller cierra con una video reunión de 10 min con la profesora: pantalla compartida + rostro visible, explicando fuentes y asociando el trabajo con los capítulos del texto guía indicados en el enunciado de cada taller.

## Cómo se documentan las decisiones

Cuando un enunciado de taller es ambiguo (pasa seguido — ver `taller-1/analisis-parte2-taller1.md` como ejemplo de este patrón), la forma de trabajar es:

1. Documentar la ambigüedad explícitamente, con las lecturas posibles.
2. Tomar una decisión razonada y marcarla como provisional hasta confirmar con la profesora, con fecha (`**Decisión (DD-mmm-AAAA):** ...`).
3. Avanzar bajo esa hipótesis en vez de bloquearse.
4. Si la profesora confirma o corrige, actualizar la decisión y seguir.

Dudas pendientes de confirmar con la profesora se marcan con ❗️ en el documento correspondiente para que no se pierdan.

## Convenciones de nomenclatura

- Archivos y rutas en español, minúsculas, con guiones (`admin-alojamiento-editar.html`, `/propiedades/1`).
- Prefijos por rol: `admin-*`, `anfitrion-*`; páginas sin prefijo son generales/huésped.
- Los atributos `name` de los formularios ya anticipan el futuro modelo de datos (`correo`, `clave`, `precio_min`, etc.) — no renombrar sin razón, porque taller-2 depende de esa consistencia para la preparación hacia back-end.

## Dónde está cada cosa

- `taller-1/indicaciones/` y `taller-2/indicaciones/`: enunciados oficiales tal como los entregó la cátedra (PDF + Markdown).
- `taller-1/analisis-parte2-taller1.md`: ejemplo del proceso de análisis de rúbrica + inventario de páginas usado para taller 1; mismo patrón aplica si taller-2 lo necesita.
- `taller-2/Taller2-Parte1-StayBooker360.md`: documento de la Parte 1 de taller-2 (stack, CSS, validación, sesión, control de acceso, i18n, preparación para back-end). Sincronizado con el código el 09-ago-2026; falta portada y exportar a PDF.
- `taller-2/plan.md`: plan de trabajo de taller-2, con el estado por bloque, las convenciones de implementación obligatorias y el mapa rúbrica → dónde se cumple.
- `taller-2/plan-traduccion.md`: plan de la versión bilingüe ES/EN.

## Data Store — Persistencia agnóstica

Taller 2 usa un sistema centralizado de acceso a datos:

- **`src/utils/dataStore/`** — Funciones abstractas (obtenerPropiedades, crearReserva, etc.), un archivo por entidad + `index.js` que centraliza los exports. Ocho entidades: `propiedades`, `reservas`, `usuarios`, `resenas`, `promociones`, `consultas`, `posts`, `incidencias`. Hoy usa localStorage (`storage.js`); futuro: API REST con cambio solo interno. El resto del código sigue importando `from '../utils/dataStore'` sin cambios.
- **`src/hooks/useDataStore.js`** — Hook React con reactividad sobre cualquiera de esas entidades.
- **`src/context/SesionContext.jsx`** — Sesión en un contexto (no un hook con estado local: si cada componente tuviera el suyo, el header no se enteraría del login). Persiste en `localStorage` bajo `staybooker_usuario`. `useSesion` se reexporta desde `hooks/useDataStore.js` por compatibilidad con los imports previos.
- **`src/context/IdiomaContext.jsx`** — Idioma (ES/EN) y moneda (CRC/USD), con `t()`, `formatearMoneda`, `formatearFecha` y `formatearNumero`.

**Uso en componentes:**
```jsx
const { datos, cargando, crear } = useDataStore('propiedades')
const { usuario, iniciarSesion, cerrarSesion } = useSesion()
const { t, formatearMoneda, formatearFecha } = useIdioma()
```

**Migración a backend:** Reemplazar solo el interior de los módulos de entidad (fetch en lugar de localStorage). Componentes sin cambios; firmas de función idénticas.

**Inicialización:** `App.jsx` llama `inicializarDatosEjemplo()`. La semilla está versionada con la clave `staybooker_version_datos`: si no coincide con la constante `VERSION_DATOS` de `semilla.js`, se limpia el storage y se vuelve a sembrar — **subir la versión también cierra la sesión activa**, porque el borrado alcanza a todas las claves con el prefijo.

## Internacionalización

El sitio es bilingüe ES/EN, con implementación propia (sin librerías). Regla dura al escribir código: **ningún texto visible se escribe literal en el JSX**; todo sale de `src/i18n/es.js` y `en.js` vía `t('espacio.clave', { params })`. Los valores que se guardan en el data store (`'villa'`, `'confirmada'`, `'wifi'`) nunca se traducen, solo su etiqueta. Las funciones de `src/utils/validaciones.js` devuelven claves, no textos. Antes de cerrar un bloque de trabajo, correr `npm run i18n:check`. Detalle completo en `taller-2/plan-traduccion.md`.

## Arquitectura CSS en Taller 2

### Organización de archivos CSS

Los estilos se dividen por responsabilidad, no en un archivo monolítico:

- **`variables.css`** — Tokens de diseño: colores (`--color-primary`, `--color-accent`), tipografía (`--font-heading`, `--font-body`), espaciado (`--space-1/2/3`), radio (`--radius-base`), transiciones.
- **`base.css`** — Reset ligero, estilos globales de elementos HTML (p, a, ul, button, input).
- **`layout.css`** — Solo lo compartido entre TODAS las páginas: grid body (header/main/footer), `main` padding/max-width/margin entre secciones. Nada específico de una página va aquí.
- **`header.css`** — Encabezado, navegación del header, estilos de h1-h6 (títulos en toda la app).
- **`footer.css`** — Footer, secciones (compañía, redes, boletín, contacto), clases base `.footer-seccion`.
- **`formularios.css`** — Campos (input, select, textarea), labels, botones (.btn-primario, .btn-secundario), validación. Solo lo genérico/reutilizable en cualquier form — un form específico de una página (ej. layout especial del buscador de Inicio) va en el CSS de esa página, no aquí.
- **`componentes.css`** — Estilos de componentes reutilizables de `src/components/` usados en 2+ páginas (ej. `.tarjeta-propiedad` de `TarjetaPropiedad.jsx`, usado en Inicio y Catálogo). Si un componente solo se usa en una página, su estilo va en el CSS de esa página, no aquí.
- **CSS por página o área** — **Decisión (09-ago-2026):** cada página con estilos propios tiene su archivo en `src/styles/`, importado en `App.jsx`. Los once existentes: `inicio.css`, `catalogo.css`, `propiedad.css`, `institucional.css` (sobre nosotros, privacidad, términos y ayuda), `blog.css`, `promociones.css`, `reserva.css` (las tres vistas del flujo), `cuenta.css` (registro, login, mis reservas), `perfil.css`, `propiedad-formulario.css` (publicar y editar propiedad) y `panel.css` (las 20 vistas de anfitrión y admin, que comparten tablas, tarjetas y fichas de edición).

### Nada de `div` de maquetación

La regla de taller-1 sigue vigente en taller-2. Cuando hace falta una rejilla y el HTML original no tiene contenedor, se maqueta sobre los propios elementos semánticos:

- Galería de la ficha de propiedad y lista de reseñas: `display: inline-block` sobre los `figure`/`article`, que en taller-1 son hijos directos de su `section`.
- Tablas anchas de los paneles: `display: block; overflow-x: auto` sobre la propia `<table>` en pantallas angostas, en lugar de envolverla en un div con scroll.
- `body` lleva `grid-template-columns: minmax(0, 1fr)`: sin eso, un hijo ancho (una tabla) estira la columna del grid y provoca desplazamiento horizontal de toda la página.

### Selectores descendentes y specificity

Usar selectores descendentes **específicos** en lugar de selectores globales, para limitar scope y evitar conflictos:

```css
/* ❌ Afecta a TODA nav en la página (header + footer) */
nav { display: flex; }

/* ✓ Afecta solo a nav del header */
header nav { display: flex; }
```

```css
/* ❌ Duplicación: estilos idénticos en 3 clases */
.footer-compania { display: flex; flex-direction: column; align-items: flex-start; }
.footer-redes { display: flex; flex-direction: column; align-items: flex-start; }
.footer-boletin { display: flex; flex-direction: column; align-items: flex-start; }

/* ✓ Clase base + clases específicas */
.footer-seccion { display: flex; flex-direction: column; align-items: flex-start; }
.footer-compania { grid-area: compania; }
.footer-redes { grid-area: redes; }
.footer-boletin { grid-area: boletin; }
```

En HTML/JSX: `<nav className="footer-seccion footer-compania">`

### Estructura de carpetas `src/`

```
src/
├── main.jsx               # Entry point React
├── App.jsx                # Providers, rutas y imports de CSS
├── layout/
│   └── Layout.jsx         # Header, nav, footer compartidos
├── pages/                 # 39 componentes de página (38 vistas + NoEncontrada)
├── components/            # RutaProtegida, TarjetaPropiedad, FormularioPropiedad,
│                          # SeccionIncidencias, EtiquetaEstado, MensajeCampo
├── context/
│   ├── SesionContext.jsx  # Sesión (localStorage) + useSesion()
│   └── IdiomaContext.jsx  # Idioma, moneda, t(), formateadores Intl
├── hooks/
│   ├── useDataStore.js    # Hook de datos (reexporta useSesion)
│   ├── useFormulario.js   # Estado + validación + foco de los 25 formularios
│   ├── useEfectoMenu.js   # addEventListener mouseover/mouseout del menú
│   └── useTituloPagina.js # document.title traducido por página
├── i18n/
│   ├── index.js           # t(), interpolación, IDIOMAS, LOCALES
│   ├── es.js              # diccionario español (idioma fuente)
│   └── en.js              # diccionario inglés (misma estructura de claves)
├── utils/
│   ├── validaciones.js    # Validadores que devuelven CLAVES, no textos
│   ├── validarPropiedad.js# Reglas del formulario de propiedad (alta y edición)
│   ├── catalogos.js       # Valores fijos del dominio (tipos, servicios)
│   ├── calendario.js      # Meses/días vía Intl, matriz de semanas, noches
│   └── dataStore/         # Acceso a datos (localStorage hoy, API después)
│       ├── index.js       # Barrel: es lo que el resto del código importa
│       ├── storage.js     # Helpers internos, no se re-exportan
│       ├── propiedades.js · reservas.js · usuarios.js · resenas.js
│       ├── promociones.js · consultas.js · posts.js · incidencias.js
│       └── semilla.js     # Datos de ejemplo versionados + limpiarTodo
└── styles/                # 7 hojas base + 11 por página/área
```

Fuera de `src/`: `scripts/verificar-i18n.js` (comparador de diccionarios, `npm run i18n:check`).

## Control de versiones

Nunca hacer `git commit` (ni `git push`) sin confirmación explícita del usuario en ese momento. Se puede dejar cambios en el working tree o hacer `git add`/`git status`/`git diff` libremente, pero el commit en sí siempre se pregunta antes.

## Al trabajar en taller-2

- No reinventar la arquitectura de información: las 38 páginas y su jerarquía semántica ya están decididas en taller-1. Taller-2 agrega presentación (CSS) y comportamiento (JS/React) por encima, no cambia la estructura.
- Antes de tocar código, revisar si el borrador de Parte 1 (`taller-2/Taller2-Parte1-StayBooker360.md`) ya describe la decisión relevante (paleta, arquitectura CSS, forma de la sesión, etc.) para no contradecirlo sin querer.

### Estructura semántica vinculante de Taller 1

Las 38 páginas HTML de `taller-1/parte-2/` definen la estructura semántica exacta que debe preservarse en Taller 2. Cada componente React debe renderizar el mismo árbol HTML5 que la página original, sin cambios.

**Estructura fija del Layout (header/main/footer):**

```html
<header>
  <h1>StayBooker 360</h1>
  <nav aria-label="Navegación del sitio">
    <!-- 2 uls (usuario, navegación principal) + 2 select (idioma, moneda) -->
    <ul><!-- usuario: Regístrate + Iniciar sesión (sin sesión) o Perfil + Mis reservas (con sesión), condicional vía useSesion() --></ul>
    <ul><!-- principal: Inicio, Explorar, Promociones, Blog, Ayuda --></ul>
    <select aria-label="Idioma"><!-- ES, EN (el francés se eliminó: decisión 09-ago-2026) --></select>
    <select aria-label="Moneda"><!-- CRC, USD --></select>
  </nav>
</header>
<main>
  <!-- cada página aquí via React Router Outlet -->
</main>
<footer>
  <nav aria-labelledby="compania-heading">
    <h2 id="compania-heading">Compañía</h2>
    <ul><!-- enlaces legales --></ul>
  </nav>
  <section aria-labelledby="redes-heading">
    <h2 id="redes-heading">Redes sociales</h2>
    <ul><!-- redes --></ul>
  </section>
  <section aria-labelledby="boletin-heading">
    <h2 id="boletin-heading">Boletín informativo</h2>
    <form><!-- suscripción --></form>
  </section>
  <address><!-- contacto directo: hijo directo de footer, sin div ni h2 propio --></address>
  <p>&copy; ...</p>
</footer>
```

**Cómo verificar estructura al migrar páginas:**

1. Abrir página HTML original en `taller-1/parte-2/NOMBRE.html`
2. Copiar estructura semántica (etiquetas HTML5: `section`, `article`, `h2`–`h6`, `figure`/`figcaption`, `form`, `fieldset`, `label`, etc.)
3. Convertir a JSX en componente React — texto y atributos cambian, **estructura semántica NO**
4. Validar con inspector del navegador: DOM debe ser idéntico al HTML original

**Qué SI puede cambiar:**
- `href="catalogo.html"` → `to="/catalogo"` (NavLink/Link)
- `<a href="...">` → `<NavLink to="...">` (navegación principal)
- Atributos data (`data-id`, etc.) → estados React si es necesario
- IDs únicos si se repiten componentes (ej. `id="campo-1"` en formularios)
- **Excepción confirmada (09-ago-2026):** selector de idioma/moneda del header pasó de `<ul><li><a>` a dos `<select>` nativos (dropdown funcional). Decisión explícita del usuario, documentada aquí para no revertirla por error en futuras migraciones.
- **Excepción confirmada (09-ago-2026):** el selector de idioma bajó de tres opciones (ES/EN/FR) a dos (ES/EN), porque taller-2 traduce de verdad y el francés se descartó.
- **Excepción confirmada (09-ago-2026):** las acciones que en taller-1 eran enlaces con query string (`anfitrion-reservas.html?aceptar=201`, "Bloquear reseña", "Reportar") son `<button type="button">` con handler de React. Cambia la etiqueta, no la jerarquía: sin back-end un enlace con query no puede ejecutar nada, y un botón es lo semánticamente correcto para una acción.

**Qué NO puede cambiar:**
- Jerarquía de etiquetas semánticas
- Atributos `aria-*` (accesibilidad)
- `<fieldset>` / `<legend>` en formularios
- Estructura de lists (`<ul>` / `<ol>` / `<li>`) — salvo la excepción de idioma/moneda arriba
- `<address>` para contacto
- `<figure>` / `<figcaption>` para imágenes
- `<article>` para tarjetas de contenido

**Checklist por página:**
- [ ] Etiquetas semánticas preservadas
- [ ] `aria-label` / `aria-labelledby` intactos
- [ ] Formularios usan `<fieldset>` + `<legend>`
- [ ] IDs de labels coinciden con inputs
- [ ] `<article>` para tarjetas/items
- [ ] `<section>` agrupa contenido temático
- [ ] Sin `<div>` innecesarios de maquetación
