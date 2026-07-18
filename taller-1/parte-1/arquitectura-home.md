# Arquitectura de información — Página principal StayBooker 360

Alcance: solo la página principal (index.html), acotado a los 7 criterios de Parte 1. Páginas secundarias, formularios completos y paneles de usuario quedan para Parte 2.

## Estructura y etiquetas HTML5 semánticas

1. `<header>`
   - Logotipo/nombre del sitio (`h1`)
   - Barra de búsqueda estructural (`form` con `input type="search"`)
   - `nav` secundario: registro, inicio de sesión, perfil, reservas
   - `nav` de idiomas: ES / EN / FR (enlaces simples, evidencia estructural de la multilingüe sin implementarla)

2. `nav` principal (menú de exploración)
   - Tipo de propiedad, destino, rango de precio, cantidad de huéspedes, servicios, experiencias destacadas

3. `<main>`
   - `section` Hero / propuesta de valor (huésped y anfitrión)
   - `section` Alojamientos destacados → `article` por propiedad (imagen, título, ubicación, precio, valoración) usando `figure`/`figcaption`
   - `section` Tipos de alojamiento (casa, apartamento, villa, cabaña, glamping) → `article` por tipo
   - `section` "Publica tu propiedad" (CTA institucional para anfitriones, enlaza a la sección de afiliación de Parte 2)
   - `section` Reseñas y testimonios → `article`/`blockquote` por reseña
   - `section` Promociones / experiencias destacadas
   - `aside` Recomendaciones por destino o temporada

4. `<footer>`
   - `nav` de enlaces institucionales (políticas, términos, ayuda)
   - Redes sociales
   - `form` de suscripción a boletín
   - Datos de contacto (`address`)

## Justificación de etiquetas (resumen para el documento)
- `header`/`footer`: encabezado y pie únicos de la página.
- `nav`: agrupa cada bloque de enlaces de navegación (menú principal, cuenta, idiomas, institucional).
- `main`: contenido central único de la página.
- `section`: divide bloques temáticos con encabezado propio (h2).
- `article`: contenido autocontenible y repetible (propiedad, reseña, tipo de alojamiento).
- `aside`: contenido relacionado pero secundario (recomendaciones).
- `figure`/`figcaption`: imágenes de propiedades con su descripción.
- `form`, `fieldset`, `label`, `input`, `button`: búsqueda y boletín, solo estructura, sin validación ni estilos.
- Se evita `div`/`table` con fines organizativos.

## Separación estructura/presentación
- Cero atributos `style`, cero `<link rel="stylesheet">`, cero `<script>`.
- El orden del documento sigue la jerarquía lógica de lectura (no depende de una maquetación visual).
