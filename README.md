# PyCon Colombia 2028 — Landing page

Maqueta de la página de PyCon Colombia 2028 (edición Amazonía).

**Sitio publicado:** https://marianamarin-coder.github.io/Interactive_Design_Pycon/

## Qué incluye

- **Recorrido 3D por el Amazonas** como fondo (Three.js): la cámara avanza con el scroll desde el mirador hasta el claro de la ceiba. La calidad se ajusta sola al equipo (alta, media, baja o mínima) y con ahorro de datos o conexión 2G se usa un fondo simple.
- Logo flotante, menú superior en vidrio con desplegable de **Agenda** (Keynotes, Ponentes, Agenda) y selector **ES / EN**.
- Inicio con keynotes, ponentes en una fila deslizable, boleta general y **becas**.
- Pantallas internas: agenda con búsqueda y filtros, mi agenda, evento con mapa del campus, charla (guardar en agenda o en el calendario `.ics`), patrocinadores, código de conducta con formulario de reporte, voluntariado, aplicación a beca y cuentas de redes aún no habilitadas.

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura de la página |
| `styles.css` | Estilos |
| `data.js` | Contenido: ponentes, keynotes, agenda, patrocinadores, código de conducta |
| `main.js` | Idioma, menú, tarjetas y perfil de ponentes |
| `views.js` | Pantallas internas (agenda, charla, formularios…) |
| `tour3d.js` | Recorrido 3D con Three.js |
| `assets/3d/` | Modelo del recorrido (GLB con Draco) |
| `assets/people/` | Fotos de ponentes y keynotes (retratos de stock de relleno) |

## Cómo verla en el computador

El modelo 3D se carga con `fetch`, así que la página debe abrirse desde un servidor (abrir `index.html` con doble clic deja solo el fondo simple). Por ejemplo, con la extensión **Live Server** de VS Code: clic derecho en `index.html` → *Open with Live Server*.
