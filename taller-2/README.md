# Taller 2 — Capa de Presentación y Comportamiento

Implementación de la capa visual (CSS) y comportamiento (JavaScript/React) de StayBooker 360 sobre la estructura HTML5 de Taller 1.

## Stack

- **Framework:** React 19 (con Vite)
- **Router:** React Router 7
- **CSS:** Propio 100%, sin frameworks (Poppins + Inter de Google Fonts)
- **Validación:** Cliente-side, atributos HTML5 + funciones JavaScript
- **Estado:** React (sessionStorage para sesión activa)

## Estructura de archivos

```
taller-2/
├── vite.config.js              # Config Vite + React plugin
├── index.html                  # Entrada HTML (importa Google Fonts)
├── package.json                # Dependencias
├── ESTRUCTURA-SEMANTICA.md     # Referencia de etiquetas semánticas
├── src/
│   ├── main.jsx               # Entry point React
│   ├── App.jsx                # Router setup
│   ├── layout/
│   │   └── Layout.jsx         # Header, nav, footer (shared)
│   ├── pages/                 # Componentes de páginas
│   │   ├── Index.jsx
│   │   ├── Catalogo.jsx
│   │   └── ...
│   ├── components/            # Componentes reutilizables
│   │   ├── TarjetaPropiedad.jsx
│   │   ├── FormularioReserva.jsx
│   │   └── ...
│   ├── hooks/                 # Custom hooks
│   │   └── useSesion.js       # Gestión de sesión + sessionStorage
│   ├── utils/                 # Funciones utilitarias
│   │   └── validaciones.js    # Validación de formularios
│   └── styles/
│       ├── variables.css      # Tokens de diseño (colores, tipografía, espaciado)
│       ├── base.css           # Reset, tipografía base
│       ├── layout.css         # Grid body + header/footer
│       ├── formularios.css    # Campos, botones, mensajes
│       └── responsive.css     # Media queries (640px, 1024px)
└── dist/                      # Build output (Vite)
```

## Desarrollo

```bash
npm install
npm run dev          # Dev server (http://127.0.0.1:5173)
npm run build        # Build para producción
```

## Decisiones de diseño

### Estructura semántica

Cada componente React renderiza el árbol HTML5 exacto de la página HTML original de Taller 1. No se modifican etiquetas semánticas, `aria-*` atributos ni estructura lógica.

Ver `ESTRUCTURA-SEMANTICA.md` para checklist y referencias.

### CSS

- **Mobile-first:** Estilos base en móvil (1 columna), media queries expanden en 640px y 1024px.
- **Grid con named areas:** Body usa `grid-template-areas` para header/main/footer.
- **Variables CSS:** Paleta (`--color-primary`, `--color-accent`), tipografía (`--font-heading`, `--font-body`), espaciado (`--space-1/2/3`), transiciones.
- **Sin frameworks:** 100% CSS Grid/Flexbox/media queries.

### Validación

Dos niveles:
1. **HTML5 nativo:** `required`, `type="email"`, `pattern`, `min`, `max` como primera barrera.
2. **JavaScript:** Funciones de validación en `useSesion.js` + manejo de errores por campo.

### Sesión y estado

El hook `useSesion()` gestiona:
- Usuario activo (nombre, rol)
- Persistencia en `sessionStorage`
- Contexto React para acceso global

Hoy simula datos. Al integrar back-end, cambia internamente a fetch/token sin afectar componentes.

## Rubros de Taller 2 cubiertos

✓ Estructura HTML5 semántico preservada  
✓ CSS propio 100%  
✓ Validación cliente-side  
✓ Mensajes lado cliente  
✓ Envío datos entre páginas (React Router + location.state)  
✓ Sesión activa (sessionStorage + contexto)  
✓ Manipulación DOM nativa (useRef + addEventListener + classList)  
✓ Responsividad (Grid, Flexbox, media queries)  

## Notas importantes

- **Taller 1 no se toca:** Las 34 páginas HTML de `taller-1/parte-2/` son referencia inmutable.
- **Nombres de campos:** Los atributos `name` en formularios coinciden con futuro modelo de datos (`correo`, `clave`, `precio_min`, etc.) — no renombrar.
- **Parte 1:** Documento PDF con propuesta visual, validación y preparación back-end.
- **Parte 2:** Código React implementando la propuesta.

## Referencias

- `taller-2/Taller2-Parte1-StayBooker360.md` — Borrador vivo de decisiones de diseño
- `CLAUDE.md` — Instrucciones globales del curso
- `taller-1/` — Estructura HTML5 de referencia

---

**Estudiante:** Bernal Hernández Barquero  
**Profesora:** Daniela Hidalgo Cordero  
**Curso:** 03098 – Programación Web  
**UNED – II Cuatrimestre 2026**
