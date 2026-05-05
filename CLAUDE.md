# Dolomitas · Junio 2026 — Contexto del proyecto

Página web de planificación de viaje en camper a las Dolomitas para 4 personas.
**Viaje:** 22–28 junio 2026 · **Crew:** Rafa, Natalia, Clau, Guille.

---

## Estructura del workspace

```
dolomitas/
├── index.html          ← punto de entrada
├── css/style.css       ← todos los estilos
├── js/app.js           ← lógica (mapa, tabs, nav, checklist, countdown)
├── images/             ← banner.png + fotos de cada spot
│   ├── banner.png      ← imagen de fondo del hero (escritorio)
│   ├── banner-movil.png← imagen de fondo del hero en móvil (≤600px, vertical)
│   ├── braies.jpg
│   ├── cadini.jpg
│   ├── carezza.jpg
│   ├── cinque-torri.jpg
│   ├── ortisei.jpg
│   ├── pasogiau.jpg
│   ├── seceda.jpg
│   ├── siusi.jpg
│   ├── sorapis.jpg
│   ├── trecime.jpg
│   └── valdifuness.jpg
└── dolomitas.html      ← archivo monolítico original (puede borrarse)
```

---

## Datos del viaje

### Vuelos de ida (22 jun)
| Quién | Ruta | Horario |
|-------|------|---------|
| Rafa y Natalia | MAD → MXP | 12:50 → 14:55 |
| Clau y Guille | SVQ → BGY | 15:30 → 18:05 (FR77, Ryanair) |

### Vuelo de vuelta (28 jun)
| Quién | Ruta | Horario |
|-------|------|---------|
| Todos (4) | MXP → SVQ | 12:40 → 15:20 |

### Camper
- **Empresa:** Indie Campers
- **Recogida:** Vía Giacomo Matteotti, 6, 21010 Ferno VA (cerca T1 Malpensa)
- **Devolución:** mismo punto · 28 jun · ~9:00–9:30

---

## Itinerario resumido

| Día | Fecha | Plan | Dormir |
|-----|-------|------|--------|
| 0 | Jue 22 | Llegada MXP + BGY | Lago di Carezza |
| 1 | Vie 23 | Amanecer Carezza + Alpe di Siusi + **atardecer Passo Sella** | Val Gardena |
| 2 | Sáb 24 | Seceda + Ortisei + Val di Funes | Zona Misurina/Cortina |
| 3 | Dom 25 | Tre Cime + Cadini di Misurina | Misurina/Cortina |
| 4 | Lun 26 | Lago di Sorapis + atardecer Passo Giau | Zona Dobbiaco / Val Pusteria |
| 5 | Mar 27 | **Braies (antes 8:30)** → Cinque Torri → Bergamo | Zona Bergamo |
| 6 | Mié 28 | Entrega camper 9:00 · Vuelo MXP 12:40 | — |

> **Día 23:** Passo Sella es la parada de atardecer recomendada — vistas al Sassolungo y Grupo Sella, 15 min desde Ortisei, parking gratuito en el paso.
> **Día 24:** dormir en zona Misurina/Cortina (no Val di Funes) para acortar la ruta a Tre Cime el día 25.
> **Día 26:** dormir en Dobbiaco/Val Pusteria (~2h desde Passo Giau tras el atardecer) — a solo 20 min de Braies para el día 27.
> **Día 27:** el orden es Braies primero (llegar antes 8:30 o cierran el parking), luego Cinque Torri (~1h15 desde Braies) de camino a Bergamo.

---

## Reservas críticas
1. **Peaje Tre Cime** (Rifugio Auronzo) — reservar con meses de antelación, se llena
2. **Teleférico Col Raiser** (Seceda) — ~32€/persona, reservar online para evitar colas

---

## Secciones de la web

| ID | Nav label | Contenido |
|----|-----------|-----------|
| `#itinerary` | Itinerario | Tabs día a día (22–28 jun) — primera sección |
| `#map` | Mapa | Leaflet interactivo con 11 pins + fotos |
| `#checklist` | Reservas | Checklist de reservas |
| `#maleta` | Maleta | Checklist de equipaje |
| `#tips` | Tips | Recomendaciones generales |

> La sección `#overview` (Resumen) fue eliminada. El itinerario es ahora la primera sección tras el hero.

---

## Decisiones técnicas

- **Separación HTML/CSS/JS:** el archivo original `dolomitas.html` era monolítico (~960 líneas). Se separó en tres archivos para facilitar el mantenimiento.
- **Nav function:** renombrada de `scrollTo` a `navTo` para evitar conflicto con `window.scrollTo` del navegador (era la causa de que los botones no navegaran).
- **Checklist persistente:** usa `localStorage` con clave `dolomitas-checklist-v2`. Guarda el estado por nombre de item (robusto ante reordenaciones). Funciona para todas las secciones con `.check-card`.
- **Mapa interactivo:** Leaflet.js con 11 pins (se añadió Passo Sella en Día 23). Popups con imagen del spot y nombre + día. `NAV_SECTIONS` en app.js refleja el orden actual sin `overview`.
- **Camper animado en el mapa:** emoji 🚐 que se mueve a lo largo de la ruta entre spots. Se voltea horizontalmente en tramos hacia el oeste. Velocidad proporcional a la distancia geográfica de cada tramo. Una única etiqueta de tiempo de conducción aparece en el punto medio del tramo actual mientras la camper se mueve y desaparece al llegar a cada spot.
- **Countdown:** en el hero, cuenta regresiva al 22 jun 2026. Si ya pasó, muestra "Viaje completado ✓".
- **Banner hero:** `images/banner.png` en escritorio. En móvil (≤600px) usa `images/banner-movil.png` (foto vertical) vía media query en `css/style.css`.
- **CSS path de imagen:** desde `css/style.css` la ruta es `../images/`.

---

## Tips / Recomendaciones (contenido)
- **Supermercados Conad** — presentes en toda la zona Dolomitas
- **Neverita portátil** — para bebidas frías en ruta
- **Pantalla furgo en español** — pedir a Indie Campers al recoger la camper

## Lista de maleta (contenido)
- Cámara de fotos
- Toalla
- Trapos para platos
- Botas de trekking (imprescindible para Sorapis y Cadini — tramos con cable)
- Chubasquero (tormentas de tarde habituales en verano en los Dolomitas)
