// ── MAP ──
const spots = [
  { name: "Lago di Carezza",      lat: 46.408, lng: 11.577, day: "Día 22–23",  color: "#2D5016", img: "carezza.jpg" },
  { name: "Alpe di Siusi",        lat: 46.541, lng: 11.622, day: "Día 23",     color: "#4A7FA5", img: "siusi.jpg" },
  { name: "Passo Sella",          lat: 46.508, lng: 11.757, day: "Día 23",     color: "#4A7FA5", img: "siusi.jpg" },
  { name: "Seceda / Col Raiser",  lat: 46.593, lng: 11.713, day: "Día 24",     color: "#C4602A", img: "seceda.jpg" },
  { name: "Val di Funes",         lat: 46.666, lng: 11.745, day: "Día 24",     color: "#C4602A", img: "valdifuness.jpg" },
  { name: "Tre Cime di Lavaredo", lat: 46.620, lng: 12.301, day: "Día 25",     color: "#8B0000", img: "trecime.jpg" },
  { name: "Cadini di Misurina",   lat: 46.588, lng: 12.264, day: "Día 25",     color: "#8B0000", img: "cadini.jpg" },
  { name: "Lago di Sorapis",      lat: 46.505, lng: 12.201, day: "Día 26",     color: "#1a5f7a", img: "sorapis.jpg" },
  { name: "Passo Giau",           lat: 46.484, lng: 12.054, day: "Día 26",     color: "#B8860B", img: "pasogiau.jpg" },
  { name: "Lago di Braies",       lat: 46.694, lng: 12.084, day: "Día 27",     color: "#2D5016", img: "braies.jpg" },
  { name: "Cinque Torri",         lat: 46.504, lng: 12.009, day: "Día 27",     color: "#2D5016", img: "cinque-torri.jpg" },
];

const map = L.map('map', { zoomControl: true, scrollWheelZoom: false }).setView([46.55, 11.9], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  maxZoom: 18
}).addTo(map);

spots.forEach((s, i) => {
  const icon = L.divIcon({
    className: '',
    html: `<div style="background:${s.color};color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-weight:700;">${i + 1}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });

  const popup = `
    <div class="map-popup">
      <img src="images/${s.img}" alt="${s.name}">
      <div class="map-popup-body">
        <div class="map-popup-name">${i + 1}. ${s.name}</div>
        <div class="map-popup-day">${s.day}</div>
      </div>
    </div>`;

  L.marker([s.lat, s.lng], { icon })
    .addTo(map)
    .bindPopup(popup, { maxWidth: 220, minWidth: 220 });
});

L.polyline(spots.map(s => [s.lat, s.lng]), {
  color: '#C4602A', weight: 2, opacity: 0.5, dashArray: '6,6'
}).addTo(map);


// ── TRAVEL TIMES & ANIMATED CAMPER ──
const travelTimes = ['45 min', '30 min', '20 min', '25 min', '1h 30min', '15 min', '30 min', '45 min', '2h', '1h 15min'];

function camperIcon(goingWest) {
  return L.divIcon({
    className: '',
    html: `<div class="camper-icon"${goingWest ? ' style="transform:scaleX(-1)"' : ''}>🚐</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
}

function driveLabelIcon(text) {
  return L.divIcon({
    className: '',
    html: `<div class="drive-label">🚗 ${text}</div>`,
    iconSize: [90, 22],
    iconAnchor: [45, 11]
  });
}

const camper = L.marker([spots[0].lat, spots[0].lng], {
  icon: camperIcon(false),
  zIndexOffset: 1000,
  interactive: false
}).addTo(map);

// Single label — only on map while camper is moving
const driveLabel = L.marker([spots[0].lat, spots[0].lng], {
  icon: driveLabelIcon(travelTimes[0]),
  interactive: false,
  zIndexOffset: 900
});
let labelOnMap = false;

function segLen(a, b) {
  return Math.sqrt(Math.pow(b.lat - a.lat, 2) + Math.pow(b.lng - a.lng, 2));
}
const segFrames = spots.slice(0, -1).map((s, i) => Math.max(100, Math.round(segLen(s, spots[i + 1]) / 0.001)));

let seg = 0, frame = 0, pauseFrame = 0, isPaused = true;

(function tick() {
  requestAnimationFrame(tick);

  if (isPaused) {
    if (labelOnMap) { map.removeLayer(driveLabel); labelOnMap = false; }
    if (++pauseFrame >= 70) { isPaused = false; pauseFrame = 0; }
    return;
  }

  if (!labelOnMap) {
    const from = spots[seg], to = spots[seg + 1];
    driveLabel.setLatLng([(from.lat + to.lat) / 2, (from.lng + to.lng) / 2]);
    driveLabel.setIcon(driveLabelIcon(travelTimes[seg]));
    driveLabel.addTo(map);
    labelOnMap = true;
  }

  const t = Math.min(frame / segFrames[seg], 1);
  const from = spots[seg], to = spots[seg + 1];
  camper.setLatLng([from.lat + (to.lat - from.lat) * t, from.lng + (to.lng - from.lng) * t]);
  frame++;
  if (frame >= segFrames[seg]) {
    frame = 0;
    seg = (seg + 1) % (spots.length - 1);
    if (seg === 0) camper.setLatLng([spots[0].lat, spots[0].lng]);
    camper.setIcon(camperIcon(spots[seg + 1].lng < spots[seg].lng));
    isPaused = true;
  }
})();


// ── DAY TABS ──
function showDay(n) {
  document.querySelectorAll('.day-panel').forEach((p, i) => p.classList.toggle('active', i === n));
  document.querySelectorAll('.day-tab').forEach((t, i) => t.classList.toggle('active', i === n));
}


// ── NAV ──
const NAV_SECTIONS = ['itinerary', 'map', 'checklist', 'maleta', 'tips'];

function navTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
}

window.addEventListener('scroll', () => {
  let current = '';
  NAV_SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 80) current = id;
  });
  document.querySelectorAll('.nav-btn').forEach((b, i) => {
    b.classList.toggle('active', NAV_SECTIONS[i] === current);
  });
});


// ── COUNTDOWN ──
function updateCountdown() {
  const tripStart = new Date('2026-06-22T00:00:00');
  const tripEnd   = new Date('2026-06-28T23:59:59');
  const now       = new Date();
  const el        = document.getElementById('countdown');
  if (!el) return;

  if (now >= tripStart && now <= tripEnd) {
    el.innerHTML = '<div class="countdown-msg">¡Estáis en las Dolomitas! 🏔️</div>';
    return;
  }
  if (now > tripEnd) {
    const days = Math.floor((now - tripEnd) / (1000 * 60 * 60 * 24));
    el.innerHTML = `<div class="countdown-msg">Viaje completado ✓ · hace ${days} días</div>`;
    return;
  }

  const diff  = tripStart - now;
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);

  el.innerHTML = `
    <div class="countdown-unit"><span class="countdown-num">${days}</span><div class="countdown-lbl">días</div></div>
    <div class="countdown-sep">:</div>
    <div class="countdown-unit"><span class="countdown-num">${String(hours).padStart(2,'0')}</span><div class="countdown-lbl">horas</div></div>
    <div class="countdown-sep">:</div>
    <div class="countdown-unit"><span class="countdown-num">${String(mins).padStart(2,'0')}</span><div class="countdown-lbl">min</div></div>
    <div class="countdown-sep">:</div>
    <div class="countdown-unit"><span class="countdown-num">${String(secs).padStart(2,'0')}</span><div class="countdown-lbl">seg</div></div>`;
}

setInterval(updateCountdown, 1000);
updateCountdown();


// ── CHECKLIST (persiste en localStorage por nombre de item) ──
const STORAGE_KEY = 'dolomitas-checklist-v2';

function loadChecklist() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  document.querySelectorAll('.check-card').forEach(card => {
    const key = card.querySelector('.check-name')?.textContent?.trim() || '';
    if (saved[key]) card.classList.add('done');
  });
  updateProgress();
}

function toggleCheck(card) {
  card.classList.toggle('done');
  saveChecklist();
  updateProgress();
}

function saveChecklist() {
  const state = {};
  document.querySelectorAll('.check-card').forEach(card => {
    const key = card.querySelector('.check-name')?.textContent?.trim() || '';
    state[key] = card.classList.contains('done');
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updateProgress() {
  const section = document.getElementById('checklist');
  if (!section) return;
  const cards = section.querySelectorAll('.check-card');
  const done  = section.querySelectorAll('.check-card.done').length;
  const el    = document.getElementById('checklist-progress');
  if (!el) return;
  if (done === 0) { el.textContent = ''; return; }
  el.textContent = done === cards.length ? '✓ Todo reservado 🎉' : `${done} de ${cards.length} completados`;
}

document.addEventListener('DOMContentLoaded', loadChecklist);
