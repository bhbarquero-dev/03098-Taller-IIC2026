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

> **Estado: sincronizado con el código (09-ago-2026).** La Parte 2 ya está construida, y este documento se actualizó para describir lo que efectivamente se implementó, no lo que se planeaba implementar. Falta únicamente completar los datos de portada y convertirlo a `.pdf` para la entrega.

## 1. Introducción y objetivo

Este documento presenta la propuesta de capa de presentación del sitio web StayBooker 360, construida sobre la estructura HTML5 semántica desarrollada en el Taller No. 1 (38 páginas: catálogo, detalle de propiedad, reserva, paneles de huésped, anfitrión y administrador, secciones institucionales, entre otras). El Taller No. 1 se centró exclusivamente en el maquetado estructural; este taller incorpora estilos CSS, interactividad, validación de formularios en el lado del cliente y una primera preparación de las páginas para su futura integración con un back-end.

Se documentan cuatro aspectos, siguiendo lo solicitado en el instrumento de evaluación: (1) la estructura general del sitio en HTML5 semántico, (2) la propuesta visual de las hojas de estilo CSS, (3) la estrategia de validación de formularios, interactividad y experiencia de usuario en el front-end, y (4) la preparación de las secciones del sitio para su uso futuro con base de datos y sesiones activas.

**Aclaración de alcance sobre frameworks:** siguiendo el enunciado del taller, la parte responsiva y visual se resuelve con hojas de estilo CSS propias en su totalidad, sin frameworks de CSS (sin Bootstrap, Tailwind ni similares). Para la capa de interactividad y manipulación del DOM del lado del cliente se emplea React, con Vite como herramienta de construcción y React Router para la navegación entre las 38 vistas del sitio. Esta distinción — CSS propio al 100 %, JavaScript con framework — se mantiene de forma consistente en todo el documento.

> ⚠️ *Nota abierta:* no está confirmado con la profesora si React satisface el rubro "Realiza manipulación de objetos del DOM" dado que abstrae el DOM directo. La sección 4.3 documenta la manipulación directa efectivamente implementada (referencias + `addEventListener`, `focus()`, `classList`, `document.title` y `document.documentElement.lang`) para cubrir ese rubro explícitamente. Confirmar con la profesora en la video reunión.

**Idiomas:** el sitio se entrega bilingüe, español e inglés (ver sección 6). El Taller No. 1 dejaba declarados tres idiomas —español, inglés y francés— como estructura sin traducción real; para el Taller No. 2 se decidió reducirlos a dos y traducir de verdad, en lugar de mantener tres etiquetas sin contenido detrás.

## 2. Estructura general del sitio en HTML5 semántico

La arquitectura de información definida en el Taller No. 1 se conserva sin modificaciones: cada una de las 38 páginas mantiene su jerarquía de etiquetas semánticas (`header`, `nav`, `main`, `section`, `article`, `aside`, `figure`/`figcaption`, `form`, `footer`, `address`). El Taller No. 2 no altera esta capa de información; únicamente añade la capa de presentación (CSS) y la capa de comportamiento (JavaScript/React) por encima de ella, respetando la separación entre estructura, presentación y comportamiento.

### 2.1 De páginas estáticas a vistas de una aplicación de una sola página (SPA)

Para poder compartir un mismo encabezado, menú de navegación y pie de página entre las 38 páginas sin duplicar código, y para habilitar el manejo de sesión y el paso de datos entre pantallas del lado del cliente, las 38 páginas HTML5 del Taller No. 1 se migran a componentes de React, cada una asociada a una ruta de React Router. La URL de cada vista conserva un nombre equivalente al archivo original (por ejemplo, `catalogo.html` pasa a la ruta `/catalogo`; `propiedad-detalle.html?id=1` pasa a `/propiedades/1`).

Cada componente de página renderiza el mismo árbol semántico ya validado en Taller No. 1 (`header`, `nav`, `main` con sus `section`/`article`/`aside`, y `footer`), ahora expresado en JSX. El componente compartido `Layout` centraliza header, nav y footer, y las páginas internas se insertan como contenido de `main` mediante el mecanismo de rutas anidadas de React Router (`Outlet`). Esto resuelve, de forma justificada por el propio comportamiento del framework, la repetición de encabezado y pie en cada una de las 38 páginas.

```jsx
// src/layout/Layout.jsx (extracto)
export default function Layout() {
  const { usuario, estaAutenticado, cerrarSesion } = useSesion();
  const { t, idioma, cambiarIdioma, moneda, cambiarMoneda } = useIdioma();
  const refNav = useRef(null);
  useEfectoMenu(refNav);           // onmouseover / onmouseout nativos

  return (
    <>
      <header>
        <h1>{t('header.titulo')}</h1>
        <nav ref={refNav} aria-label={t('header.navegacion')}>
          <ul>{/* usuario: saludo, perfil, reservas y cerrar sesión, o registro e inicio de sesión */}</ul>
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

El primer bloque de la navegación cambia según haya sesión iniciada o no, y el pie mantiene la misma estructura del Taller No. 1: el contacto es un `<address>` hijo directo de `<footer>`, sin contenedor de maquetación intermedio.

Las etiquetas semánticas (`header`, `nav`, `main`, `section`, `article`, `aside`, `figure`, `footer`, `address`) se mantienen exactamente igual que en Taller No. 1; JSX solo cambia la sintaxis de escritura, no la semántica del documento renderizado en el navegador.

### 2.2 Inventario de las 38 vistas por bloque

| Bloque | Vistas | Contenido |
|---|---|---|
| A — Público e institucional | 8 | Página principal, sobre nosotros, políticas de privacidad, términos de uso, centro de ayuda, blog, artículo de blog y promociones |
| B — Catálogo y reserva | 5 | Catálogo con filtros, ficha de propiedad, formulario de reserva, resumen y comprobante |
| C — Cuenta | 5 | Registro, inicio de sesión, perfil, mis reservas y publicar propiedad |
| D — Panel de anfitrión | 8 | Tablero, listado y edición de propiedades, reservas recibidas, consultas y su respuesta, reseñas y su respuesta |
| E — Panel de administración | 12 | Tablero, gestión y edición de usuarios, alojamientos, reservas, promociones y blog, más reportes |

Cada vista corresponde a una ruta de React Router cuyo nombre reproduce el del archivo original (`anfitrion-propiedades.html` pasa a `/anfitrion-propiedades`), salvo las que reciben un identificador, que lo llevan como parámetro de ruta (`/propiedades/:id`, `/admin-reserva-editar/:id`). Una ruta comodín atiende cualquier dirección que no exista y muestra una página de error propia en lugar de una pantalla en blanco.

## 3. Propuesta visual de las hojas de estilo CSS

### 3.1 Organización de las hojas de estilo

Las hojas de estilo se separan por responsabilidad, en lugar de un único archivo monolítico, para facilitar mantenimiento y reutilización entre las 38 vistas:

**Hojas base**, que aplican a todo el sitio:

- `variables.css` — tokens de diseño: colores, tipografía, espaciado, radios y transiciones.
- `base.css` — reset ligero, tipografía base, rejilla de tres áreas del documento (encabezado, contenido y pie) y comportamiento por defecto de los elementos HTML.
- `layout.css` — únicamente lo compartido por todas las páginas: ancho máximo y separación del `main`.
- `header.css` — encabezado, menú de navegación con sus efectos, y jerarquía de títulos `h1`–`h6`.
- `footer.css` — pie de página en cuadrícula de cuatro columnas.
- `formularios.css` — campos, etiquetas, estados de foco y de error, variantes de botón y mensajes al usuario.
- `componentes.css` — componentes reutilizados en dos o más páginas, como la tarjeta de propiedad.

**Hojas por página o por área**, una por cada conjunto de vistas con estilos propios: `inicio.css`, `catalogo.css`, `propiedad.css`, `institucional.css`, `blog.css`, `promociones.css`, `reserva.css`, `cuenta.css`, `perfil.css`, `propiedad-formulario.css` y `panel.css` (compartida por las veinte vistas de los paneles de anfitrión y administración).

Son dieciocho archivos en total, todos dentro de `src/styles/` y todos escritos desde cero. La división evita que una hoja general se convierta en un cajón de sastre con estilos de todas las páginas mezclados, y todas comparten las variables de `variables.css`, garantizando consistencia visual entre las 38 páginas sin recurrir a un framework de CSS.

### 3.2 Paleta de colores y tipografía

La paleta busca transmitir confianza y calidez (hospedaje, viaje) sin perder legibilidad:

- Color primario: `#1F6F5C` (verde azulado profundo) — encabezado, enlaces activos, botones principales.
- Color primario oscuro: `#17553F` — estado hover/activo de elementos primarios.
- Color de acento: `#F2A65A` (arena/atardecer) — subrayados de hover, insignias de promociones.
- Texto principal: `#1E293B`; fondo general: `#F8FAFC`; superficies (tarjetas, formularios): `#FFFFFF`.
- Estado de error: `#DC2626`; estado de éxito: `#16A34A`.

Tipografía: **Poppins** (semibold) para títulos (h1–h4) y **Inter** para texto de cuerpo, etiquetas y botones — dos tipografías sans-serif declaradas en las variables, con pila de respaldo a fuentes del sistema (`system-ui`, `Segoe UI`, `Arial`). La distinción entre familia de títulos y familia de cuerpo se aplica con las variables `--font-heading` y `--font-body` en toda la aplicación.

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

### 3.4 Selectores descendentes y scoping CSS

Para evitar conflictos entre estilos y mantener claridad en el código, se emplean selectores descendentes (contextual selectors) que aumentan la especificidad y limitan el alcance de las reglas CSS. Por ejemplo, en lugar de aplicar estilos generales a `footer ul`, se usan selectores más específicos como:

```css
.footer-compania ul,
.footer-redes ul,
.footer-boletin ul {
  /* estilos aplicables solo a listas dentro de estas secciones */
}
```

Esta técnica evita efectos secundarios no deseados: los estilos de la lista de compañía no interfieren con las listas de redes sociales o boletín. Mejora mantenibilidad y legibilidad del código CSS.

### 3.5 Disposición, espaciado y aspectos responsivos

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

La interactividad se implementa con React (Vite como bundler y servidor de desarrollo, React Router para las rutas de las 38 vistas). Esta decisión se documenta y se asume de forma explícita: el CSS del sitio es 100 % propio y sin frameworks; el framework se usa exclusivamente para JavaScript/DOM, tal como lo permite el Taller No. 1 respecto al uso de frameworks en el Taller No. 2.

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

Las funciones de validación se centralizan en un único módulo (`src/utils/validaciones.js`) y devuelven **claves de mensaje**, no textos, de modo que el mensaje mostrado depende del idioma activo. El estado, el foco y los mensajes de cada formulario los gestiona un hook propio (`useFormulario`), que evita repetir el mismo esqueleto en los veinticinco formularios del sitio.

El catálogo completo de validaciones implementadas es:

| Validación | Formularios donde aplica |
|---|---|
| Campo vacío o solo espacios | Todos los campos obligatorios |
| Formato de correo electrónico | Registro, inicio de sesión, perfil, contacto, consulta al anfitrión, boletín, propiedad |
| Correo ya registrado | Registro |
| Contraseña de al menos 8 caracteres y confirmación coincidente | Registro y restablecimiento desde el panel de administración |
| Teléfono con al menos 8 dígitos | Registro, perfil, propiedad, edición de cuenta |
| Numérico con rango | Capacidad, precio por noche, cantidad de huéspedes, monto de reembolso |
| Cantidad de huéspedes menor o igual a la capacidad de la propiedad | Reserva |
| Fecha no anterior a hoy; salida posterior a entrada; vigencia final posterior a la inicial | Buscador, reserva, bloqueo de fechas, promociones |
| Fechas sin traslape con reservas ya existentes | Reserva |
| Extensión de imagen `.jpg`, `.jpeg`, `.png`, `.webp` | Propiedad, entrada de blog |
| Extensión de video `.mp4`, `.webm` | Propiedad |
| Casilla obligatoria marcada | Aceptación de términos en el registro |
| Longitud máxima de texto con contador visible | Descripciones, mensajes, respuestas y comentarios |
| Tarjeta: 16 dígitos, código de 3 o 4 dígitos y vencimiento MM/AA vigente | Reserva |
| Motivo obligatorio solo cuando se rechaza una publicación | Aprobación de alojamientos |

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

La sesión activa se maneja mediante una función dedicada y un conjunto de variables de estado, expuestas a toda la aplicación con un contexto de React (`SesionProvider`) y persistidas en `localStorage`:

```jsx
export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesionGuardada);

  const iniciarSesion = useCallback((datosUsuario) => {
    const { clave, ...resto } = datosUsuario;      // la contraseña nunca entra en la sesión
    const sesion = { ...resto, inicio: new Date().toISOString() };
    localStorage.setItem('staybooker_usuario', JSON.stringify(sesion));
    setUsuario(sesion);
    return sesion;
  }, []);

  const cerrarSesion = useCallback(() => {
    localStorage.removeItem('staybooker_usuario');
    setUsuario(null);
    document.title = 'StayBooker 360';
  }, []);

  const valor = useMemo(() => ({
    usuario, iniciarSesion, cerrarSesion, actualizarPerfil,
    estaAutenticado: !!usuario,
    esAnfitrion: usuario?.rol === 'anfitrion' || usuario?.rol === 'administrador',
    esAdministrador: usuario?.rol === 'administrador'
  }), [usuario, iniciarSesion, cerrarSesion, actualizarPerfil]);

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}
```

Se eligió `localStorage` sobre `sessionStorage` de forma deliberada: la sesión sobrevive al cierre del navegador, que es el comportamiento de "recordarme" habitual en un sitio de reservas y el que permite demostrar la persistencia sin depender de que la pestaña siga abierta.

El contexto es imprescindible, y no un lujo: si cada componente guardara su propio estado de sesión, iniciar sesión en una vista no actualizaría el menú del encabezado, que ya está montado. Con el contexto, el saludo de bienvenida, los enlaces de usuario y los accesos a los paneles reaccionan de inmediato.

Esta función y sus variables (`usuario`, `iniciarSesion`, `cerrarSesion`) son, de forma intencional, el punto exacto donde se conectará la lógica de back-end más adelante: hoy simulan la sesión en el navegador; cuando exista un servidor, `iniciarSesion` pasará de escribir en `localStorage` a llamar a un endpoint de autenticación y guardar el token devuelto, sin cambiar la forma en que el resto de los componentes consumen el contexto.

### 4.6 Control de acceso por tipo de usuario

Las vistas privadas se envuelven en un componente `RutaProtegida` que comprueba la sesión y el rol antes de renderizar:

```jsx
export default function RutaProtegida({ roles, children }) {
  const { usuario } = useSesion();
  const ubicacion = useLocation();

  if (!usuario) {
    return <Navigate to="/inicio-sesion" state={{ destino: ubicacion.pathname }} replace />;
  }
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/perfil" replace />;
  }
  return children;
}
```

Se aplica a las cinco vistas de cuenta (solo requieren sesión), a las ocho del panel de anfitrión (roles `anfitrion` y `administrador`) y a las doce del panel de administración (rol `administrador`). Cuando alguien intenta abrir una vista privada sin sesión, la ruta de destino se recuerda y, tras iniciar sesión, el usuario aterriza donde quería ir. Esta comprobación es de interfaz: el futuro back-end deberá repetirla del lado del servidor, igual que ocurre con la validación de formularios.

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

- **Data store como única puerta a los datos:** todas las operaciones (`obtenerPropiedades`, `obtenerPropiedad(id)`, `crearReserva(datos)`, `responderConsulta(id, texto)`, …) viven en `src/utils/dataStore/`, un módulo por entidad —propiedades, reservas, usuarios, reseñas, promociones, consultas, entradas de blog e incidencias— reunidos en un índice común. Los componentes importan siempre desde ese índice y no saben de dónde salen los datos. Hoy cada función lee y escribe `localStorage`; cada una lleva anotado el endpoint que la sustituirá (`// TODO: reemplazar con fetch GET /api/propiedades/:id`). Migrar a un servidor real significa reescribir el interior de esos módulos, sin tocar ni un componente.
- **Estados del ciclo de vida ya modelados:** una propiedad recorre `pendiente → publicada | rechazada | inactiva`, una reserva recorre `pendiente → confirmada → finalizada | cancelada` con un estado de pago independiente (`pendiente`, `pagado`, `reembolsado`), y una cuenta puede estar `activa` o `suspendida`. Estos valores se guardan en español y sin traducir: son datos, no texto de interfaz.
- **Sesión y autenticación extensibles:** el contexto de sesión descrito en la sección 4.5 concentra toda la lógica de usuario activo; al incorporar back-end, `iniciarSesion()` pasará de `localStorage` a un token (JWT o cookie de sesión) devuelto por el servidor, manteniendo la misma interfaz para el resto de la aplicación.
- **Validación cliente como primera capa, no la única:** las funciones de validación (sección 4.2) son una primera barrera de calidad de datos; se anticipa que el futuro back-end repita esas mismas validaciones del lado del servidor antes de escribir en base de datos, por seguridad.
- **Carga de archivos, pendiente por definición:** los campos de imagen y video validan la extensión y registran el nombre del archivo elegido, pero sin servidor no hay dónde subirlo. Ese es el punto exacto donde entrará el almacenamiento real de multimedia.

## 6. Sitio bilingüe: español e inglés

Toda la interfaz está disponible en dos idiomas y el selector del encabezado la cambia en caliente, sin recargar la página y sin perder el estado de la vista (filtros aplicados, formulario a medio llenar, paso del flujo de reserva).

La internacionalización se implementó **sin librerías externas**: dos diccionarios (`src/i18n/es.js` y `src/i18n/en.js`) con la misma estructura de claves —631 cada uno—, una función `t('espacio.clave', { parametros })` de una veintena de líneas que resuelve la clave e interpola marcadores `{nombre}`, y un contexto de React que expone el idioma activo. Un script propio (`npm run i18n:check`) compara ambos diccionarios y reporta claves faltantes, sobrantes o con marcadores de interpolación distintos.

El idioma también gobierna el formato de fechas y números mediante `Intl.DateTimeFormat` e `Intl.NumberFormat`, incluidos los nombres de meses y días del calendario de disponibilidad, que no están escritos a mano. La moneda (colones o dólares) es una preferencia independiente: se puede ver la interfaz en inglés con precios en colones. Ambas preferencias se guardan en el navegador y, si hay sesión iniciada, también en el perfil del usuario —que es exactamente por donde viajarían al back-end—. Al cambiar de idioma se actualiza además el atributo `lang` del documento.

Se traduce la interfaz, no el contenido publicado por los usuarios: nombres y descripciones de alojamientos, comentarios de reseñas y artículos del blog se mantienen en su idioma original, igual que hacen las plataformas reales. Es una decisión de alcance razonada, no un descuido.

## 7. Conclusión

La propuesta descrita conserva íntegramente la estructura semántica de HTML5 definida en el Taller No. 1, añade una capa de presentación CSS propia y sin frameworks, y resuelve la interactividad, la validación de formularios, el manejo de sesión y la versión bilingüe mediante React, Vite y React Router, dejando puntos de extensión explícitos (data store, contexto de sesión, control de acceso por rol) para la futura integración con un back-end real. La Parte 2 de este taller implementa esta propuesta sobre las 38 páginas construidas en el Taller No. 1.

## 8. Referencias

- Moreno, D. (2018). *Diseño Web: Interfaces y código cliente*. EUNED.
- React. (s.f.). *React documentation*. https://react.dev
- Vite. (s.f.). *Vite documentation*. https://vitejs.dev
- React Router. (s.f.). *React Router documentation*. https://reactrouter.com
- MDN Web Docs. (s.f.). *CSS, HTML y JavaScript reference*. Mozilla. https://developer.mozilla.org
