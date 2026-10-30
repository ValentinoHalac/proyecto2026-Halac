# Bajo Palos ⚽🧤

**Bajo Palos** es una calculadora de rendimiento para arqueros de fútbol. El usuario carga las estadísticas de su temporada y la página calcula su **porcentaje de atajadas**, sus **goles recibidos** y sus **vallas invictas**, y le da una valoración según su categoría.

Proyecto integrador de **Taller de Desarrollo Web** – Universidad Católica de Córdoba (UCC), 2026.

🔗 **Ver la página publicada:** [Bajo Palos en GitHub Pages](https://valentinohalac.github.io/proyecto2026-Halac/)

---

## Índice

1. [Autor](#autor)
2. [Contenido de la página](#contenido-de-la-página)
   - [Inicio](#inicio)
   - [Calculadora](#calculadora)
   - [Referencias](#referencias)
3. [Cómo funciona el cálculo](#cómo-funciona-el-cálculo)
4. [Tecnologías usadas](#tecnologías-usadas)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Prototipos](#prototipos)

---

## Autor

| Nombre | Rol | GitHub |
|--------|-----|--------|
| **Valentino Halac** | Diseño y desarrollo | [@valentinohalac](https://github.com/valentinohalac) |

---

## Contenido de la página

El sitio tiene **3 páginas** conectadas por un menú de navegación, que en celulares se convierte en un menú desplegable (☰).

### Inicio

Página de presentación (`index.html`): explica qué es la calculadora y los tres pasos para usarla, con un botón que lleva directo a la calculadora.

### Calculadora

Página principal del sitio (`calculadora.html`). El usuario completa:

- Nombre
- Categoría (Amateur, Juveniles o Primera)
- Partidos jugados
- Minutos jugados
- Tiros al arco recibidos
- Goles recibidos
- Vallas invictas

Antes de calcular, la página **valida los datos**. Si algo está mal (un campo vacío, letras, números negativos, más goles que tiros al arco, más vallas invictas que partidos, etc.), muestra un aviso, explica el error y borra el campo para que se vuelva a cargar.

### Referencias

Tabla con los valores esperados en cada categoría y una lista de consejos para mejorar bajo los tres palos (`referencias.html`).

---

## Cómo funciona el cálculo

| Métrica | Fórmula |
|---------|---------|
| % de atajadas | (tiros al arco − goles) ÷ tiros al arco × 100 |
| Goles por partido | goles ÷ partidos |
| Goles cada 90' | goles ÷ (minutos ÷ 90) |
| % vallas invictas | vallas invictas ÷ partidos × 100 |

Después compara las métricas con los valores de referencia de la categoría elegida:

- Cumple las **3** métricas → **«Muralla»**
- Cumple **2** métricas → **«Sólido»**
- Cumple **0 o 1** métrica → **«En desarrollo»**

---

## Tecnologías usadas

- **HTML5**: estructura semántica de las páginas
- **CSS3**: estilos, Flexbox, Grid y diseño responsive con media queries
- **JavaScript**: validación de datos y cálculos, con funciones flecha documentadas con JSDoc
- **Google Fonts**: tipografías *Bebas Neue* e *Inter*
- **Figma**: mockup desktop y mobile
- **Git y GitHub**: control de versiones con conventional commits
- **GitHub Pages**: publicación del sitio

---

## Estructura del proyecto

```
proyecto2026-Halac/
├── index.html
├── calculadora.html
├── referencias.html
├── css/
│   └── estilos.css
├── js/
│   └── calculadora.js
├── imagenes/
├── primera-entrega/
│   ├── diagrama/
│   ├── Sketch/
│   └── Mockup/
└── README.md
```

---

## Prototipos

Los prototipos están en la carpeta [`primera-entrega`](primera-entrega):

- **Diagramas** de organización y de funcionamiento → `primera-entrega/diagrama`
- **Sketch** en papel, versión desktop y mobile → `primera-entrega/Sketch`
- **Mockup** en Figma, versión desktop y mobile → `primera-entrega/Mockup`
