// ─────────────────────────────────────────
// app.js — Lógica principal de la web
// ─────────────────────────────────────────

// ── FECHAS ──
const WD  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const MN  = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const today     = new Date(); today.setHours(0,0,0,0);
const tomorrow  = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
const exam      = new Date('2026-09-01'); exam.setHours(0,0,0,0);
const planStart = new Date('2026-03-23'); planStart.setHours(0,0,0,0);
const startDate = new Date('2026-03-22'); startDate.setHours(0,0,0,0);

const dLeft  = Math.max(0, Math.round((exam - today) / 86400000));
const dow    = today.getDay();
const dayIndex = Math.max(0, Math.min(Math.round((today - startDate) / 86400000), QUOTES.length - 1));

// cuenta atrás eliminada — sin presión

// ── NAVEGACIÓN ──
function goHome(btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('p-home').classList.add('active');
  btn.classList.add('active');
  closeAllDD();
  window.scrollTo(0, 0);
}

function goPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('p-' + id).classList.add('active');
  btn.classList.add('active');
  closeAllDD();
  window.scrollTo(0, 0);
}

function toggleDD(ddId, btn) {
  const menu = document.getElementById('ddm-' + ddId.split('-')[1]);
  const isOpen = menu.classList.contains('open');
  closeAllDD();
  if (!isOpen) { menu.classList.add('open'); btn.classList.add('open'); }
}

function closeAllDD() {
  document.querySelectorAll('.dd-menu').forEach(m => m.classList.remove('open'));
  document.querySelectorAll('.tb-drop-toggle').forEach(b => b.classList.remove('open'));
}

document.addEventListener('click', e => {
  if (!e.target.closest('.tb-dropdown')) closeAllDD();
});

// ── FRASE DEL DÍA ──
const todayQ = QUOTES[dayIndex];
document.getElementById('qdDay').textContent  = `Día ${dayIndex + 1} · ${WD[dow]} ${today.getDate()} de ${MN[today.getMonth()]}`;
const heroDateEl = document.getElementById('heroDate');
if (heroDateEl) heroDateEl.textContent = `${WD[dow]} ${today.getDate()} de ${MN[today.getMonth()]} de ${today.getFullYear()}`;
document.getElementById('qdText').textContent = `"${todayQ.t}"`;
document.getElementById('qdAuthor').textContent = todayQ.a;

// ── RESPIRO DEL DÍA ──
const fun = FUNS[today.getDate() % FUNS.length];
document.getElementById('funCard').innerHTML = `
  <div class="fun-emoji">${fun.e}</div>
  <div class="fun-body">
    <div class="fun-label">${fun.label}</div>
    <div class="fun-title">${fun.title}</div>
    <div class="fun-text">${fun.text}</div>
  </div>`;

// ── ARTÍCULO DEL DÍA ──
// Un artículo por día — rota sola, sin menú, sin decisión
// Día del año (1-365) para rotar entre los 169 artículos sin repetir en meses consecutivos
const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
const artIdx = (dayOfYear - 1) % ARTICLES.length;

function renderArt() {
  const a = ARTICLES[artIdx];
  // Extract just the number for the decorative drawing
  const artNumOnly = a.num.replace('Artículo ', '');
  document.getElementById('artCard').innerHTML = `
    <div class="art-card">
      <div class="art-num-drawing" aria-hidden="true">${artNumOnly}</div>
      <div class="art-num">${a.tag} · ${a.num}</div>
      <div class="art-title">${a.title}</div>
      <div class="art-text">${a.text}</div>
      <div class="joke-box">
        <div class="joke-label">Para que no se olvide</div>
        <div class="joke-text">${a.joke}</div>
      </div>
    </div>`;
  // Solo muestra cuál es, sin botones de navegación
  const counter = document.getElementById('artCounter');
  if (counter) counter.textContent = `Artículo del día`;
}

renderArt();


// ── PLAN DIARIO ──
function getStudyDay(date) {
  let count = 0;
  const d = new Date(planStart);
  while (d < date) {
    const wd = d.getDay();
    if (wd >= 1 && wd <= 5) count++;
    d.setDate(d.getDate() + 1);
  }
  return count;
}

const tomorrowStudyDay = getStudyDay(tomorrow);
const tomorrowWeek     = Math.floor(tomorrowStudyDay / 5);
const wt = WEEK_THEMES[Math.min(tomorrowWeek, WEEK_THEMES.length - 1)];

const DAY_SCHEDULES = {
  1: { // Lunes
    blocks: [
      {time:"9:00",  icon:"☕", title:"Ritual de inicio",        desc:"Café, agua, mismo sitio de siempre. Sin móvil encima. Estás lista.", sub:"10 min", dot:"gold"},
      {time:"9:10",  icon:"📖", title:"Bloque de teoría — Parte 1", desc:`<strong>${wt.mat}</strong>: ${wt.detail}`, sub:"Lectura activa · 50 min", dot:"green"},
      {time:"10:00", icon:"⏸", title:"Descanso",                 desc:"Levántate. Estira. Agua. Nada de móvil todavía.", sub:"5 min", dot:""},
      {time:"10:05", icon:"📖", title:"Bloque de teoría — Parte 2", desc:"Continúa. Esquema en papel de lo que acabas de leer. Lo que salga sin mirar.", sub:"45 min", dot:"green"},
      {time:"10:50", icon:"⏸", title:"Descanso",                 desc:"Este sí, móvil incluido. 10 minutos libres.", sub:"10 min", dot:""},
      {time:"11:00", icon:"📝", title:"Test del tema",            desc:"Abre Tests → Test del día. Preguntas del tema de esta semana. Corrígelo con calma.", sub:"30 min", dot:"blue"},
      {time:"11:30", icon:"✅", title:"Marca el día",             desc:"Cuando acabes, ve a Mi Plan y márcalo.", sub:"", dot:"gold"},
    ],
    total: "~2h 30min"
  },
  2: { // Martes
    blocks: [
      {time:"9:00",  icon:"☕", title:"Ritual de inicio",         desc:"El mismo de siempre.", sub:"10 min", dot:"gold"},
      {time:"9:10",  icon:"📖", title:"Bloque de teoría",         desc:`<strong>${wt.mat}</strong> — hoy profundiza en los detalles que ayer pasaste rápido.`, sub:"60 min", dot:"green"},
      {time:"10:10", icon:"⏸", title:"Descanso",                  desc:"Levántate, estira, agua.", sub:"10 min", dot:""},
      {time:"10:20", icon:"🎤", title:"Explícalo en voz alta",    desc:"Explica el tema como si le enseñaras a alguien. A la pared, a una amiga, a nadie. Retiene más que leer.", sub:"30 min", dot:"green"},
      {time:"10:50", icon:"📝", title:"Test del tema",            desc:"Tests → Test del día.", sub:"30 min", dot:"blue"},
      {time:"11:20", icon:"✅", title:"Marca el día",             desc:"Va. Confeti ganado.", sub:"", dot:"gold"},
    ],
    total: "~2h 20min"
  },
  3: { // Miércoles
    blocks: [
      {time:"9:00",  icon:"☕", title:"Ritual de inicio",         desc:"El de siempre.", sub:"10 min", dot:"gold"},
      {time:"9:10",  icon:"📖", title:"Bloque de teoría",         desc:`Mitad de semana. <strong>${wt.mat}</strong>. Si estás cansada: 25 min + 5 descanso + 25 min.`, sub:"55 min con Pomodoro", dot:"green"},
      {time:"10:05", icon:"⏸", title:"Descanso",                  desc:"10 minutos. Importante.", sub:"10 min", dot:""},
      {time:"10:15", icon:"✍️", title:"Mapa mental",              desc:"Dibuja en papel un mapa mental del tema sin mirar nada. Lo que sale de memoria es lo que ya sabes.", sub:"30 min", dot:"green"},
      {time:"10:45", icon:"📝", title:"Test del tema",            desc:"Tests → Test del día.", sub:"30 min", dot:"blue"},
      {time:"11:15", icon:"✅", title:"Marca el día",             desc:"Tres de tres esta semana.", sub:"", dot:"gold"},
    ],
    total: "~2h 15min"
  },
  4: { // Jueves
    blocks: [
      {time:"9:00",  icon:"☕", title:"Ritual de inicio",         desc:"El de siempre.", sub:"10 min", dot:"gold"},
      {time:"9:10",  icon:"📖", title:"Bloque de teoría",         desc:`Cuarto día. <strong>${wt.mat}</strong> ya debería sonar familiar. Hoy repasa lo más difícil.`, sub:"60 min", dot:"green"},
      {time:"10:10", icon:"⏸", title:"Descanso",                  desc:"10 minutos.", sub:"10 min", dot:""},
      {time:"10:20", icon:"🔁", title:"Flash repaso",             desc:"Sin mirar el temario: escribe de memoria todos los puntos clave. Luego compara.", sub:"25 min", dot:"green"},
      {time:"10:45", icon:"📝", title:"Test del tema",            desc:"Tests → Test del día. Cuando corrijas, lee por qué es correcta la respuesta correcta.", sub:"30 min", dot:"blue"},
      {time:"11:15", icon:"✅", title:"Marca el día",             desc:"Cuatro de cuatro. Rubia.", sub:"", dot:"gold"},
    ],
    total: "~2h 15min"
  },
  5: { // Viernes
    blocks: [
      {time:"9:00",  icon:"☕", title:"Ritual de inicio",         desc:"Último día de la semana. El más importante.", sub:"10 min", dot:"gold"},
      {time:"9:10",  icon:"📖", title:"Repaso de toda la semana", desc:`30 min repasando <strong>${wt.mat}</strong> de principio a fin. Rápido, esquema, puntos clave.`, sub:"30 min", dot:"green"},
      {time:"9:40",  icon:"📋", title:"Test semanal",            desc:"Tests → Test semanal. Mezcla de todo lo de la semana. Cronométrate.", sub:"40 min", dot:"blue"},
      {time:"10:20", icon:"⏸", title:"Descanso",                  desc:"10 minutos. Te lo mereces.", sub:"10 min", dot:""},
      {time:"10:30", icon:"📋", title:"Revisión de fallos",      desc:"Apunta los temas donde has fallado esta semana. Solo anótalos. El lunes empiezas por ahí.", sub:"15 min", dot:"gold"},
      {time:"10:45", icon:"✅", title:"Semana cerrada",          desc:"Cinco días. La semana es tuya. El resto del día: tuyo también, sin culpa.", sub:"", dot:"gold"},
    ],
    total: "~1h 45min"
  },
};

const isWeekend  = (dow === 0 || dow === 6);
const planStarted = today >= planStart;
const dailyEl = document.getElementById('dailyPlan');

if (today < planStart) {
  // Show Monday preview instead of waiting message
  const previewSched = DAY_SCHEDULES[1];
  const previewMap = DAILY_MAP[0][0];
  const previewWt = WEEK_THEMES[0];
  const previewWeekMap = DAILY_MAP[0];
  const previewDayLabels = ['Lunes','Martes','Miércoles','Jueves','Viernes'];
  const previewLaws = [...new Set(previewWeekMap.map(e => e.ley))];
  const previewTopics = previewWeekMap.map(e => e.titulo.split(' — ')[0]);

  const previewDc = document.createElement('div');
  previewDc.className = 'daily-card';
  previewDc.innerHTML = `
    <div class="daily-header">
      <div class="daily-header-eyebrow">Vista previa · Semana 1 · Lunes 23 marzo</div>
      <div class="daily-header-title">${previewMap.titulo}</div>
      <div class="daily-header-ley">${previewMap.ley}</div>
    </div>
    <div class="daily-blocks">
      ${previewSched.blocks.map(b => `
        <div class="daily-block">
          <div class="db-bar ${b.dot}"></div>
          <div class="db-content">
            <div class="db-time-inline">${b.time}</div>
            <div class="db-body">
              <div class="db-title">${b.title}</div>
              <div class="db-desc">${b.desc}</div>
              ${b.sub ? `<div class="db-sub">${b.sub}</div>` : ''}
            </div>
          </div>
        </div>`).join('')}
    </div>
    <div class="daily-footer">
      <span>Terminas antes de mediodía 🌿</span>
      <span class="df-total">${previewSched.total}</span>
    </div>`;

  const previewWeekEl = document.createElement('div');
  previewWeekEl.className = 'week-preview-card';
  const studyDayNum = 0;
  const todayMapEntry = previewMap;
  const wt = previewWt;
  previewWeekEl.innerHTML = `
    <div class="wp-header">
      <div class="wp-eyebrow">Esta semana</div>
      <div class="wp-title">${previewWt.mat}</div>
    </div>
    <div class="wp-days-wrap">
      <div class="wp-days">
        ${previewDayLabels.map((d, i) => `
          <div class="wp-day ${i===0?'wp-today':''}">
            <div class="wp-day-name">${d}</div>
            <div class="wp-day-topic">${previewWeekMap[i].titulo.split(' — ')[0]}</div>
            <div class="wp-day-ley">${previewWeekMap[i].ley}</div>
          </div>`).join('')}
      </div>
      <div class="wp-prep">
        <div class="wp-prep-label">📂 Prepara tus apuntes antes del lunes</div>
        <div class="wp-prep-col">
          <div class="wp-prep-col-title">Leyes</div>
          ${previewLaws.map(l => `<div class="wp-prep-item">${l}</div>`).join('')}
        </div>
        <div class="wp-prep-col">
          <div class="wp-prep-col-title">Temas</div>
          ${previewTopics.map(t => `<div class="wp-prep-item">${t}</div>`).join('')}
        </div>
      </div>
    </div>`;

  dailyEl.appendChild(previewDc);
  dailyEl.appendChild(previewWeekEl);
} else if (isWeekend) {
  const findeMsg = dow === 6 ? [
    { title: "Sábado.", sub: "El temario no te echa de menos. Tómatelo con calma." },
    { title: "Hoy no.", sub: "El cerebro también necesita apagar el wifi. Tú puedes." },
    { title: "Para. Respira.", sub: "Mañana es domingo y pasado vuelves. Hoy no existe el BOE." },
    { title: "Sábado sagrado.", sub: "Ni un artículo. Ni uno. En serio." },
  ] : [
    { title: "Domingo, Rubia.", sub: "Descansa. Mañana arrancas de nuevo y lo vas a petar." },
    { title: "El plan puede esperar.", sub: "Tú no. Disfruta el día. El temario sigue ahí mañana." },
    { title: "Cero temario hoy.", sub: "Ni lo pienses. El descanso es parte del entrenamiento." },
    { title: "Domingo means freedom.", sub: "La Constitución puede esperar hasta el lunes. Prometido." },
  ];
  const msg = findeMsg[dayOfYear % findeMsg.length];
  dailyEl.innerHTML = `
    <div class="rest-card">
      <h2>${msg.title}</h2>
      <p>${msg.sub}</p>
    </div>`;
} else {
  const sched = DAY_SCHEDULES[dow] || DAY_SCHEDULES[1];
  const dc = document.createElement('div');
  // Get today's specific topic from DAILY_MAP (not the week theme)
  const studyDayNum = ['L','M','X','J','V'].indexOf(WD[dow]);
  const todayMapEntry = (studyDayNum >= 0 && DAILY_MAP[tomorrowWeek]) ? DAILY_MAP[tomorrowWeek][studyDayNum] : null;
  const dayTitle = todayMapEntry ? todayMapEntry.titulo : wt.mat;
  const dayLey = todayMapEntry ? todayMapEntry.ley : wt.sub;

  dc.className = 'daily-card';
  dc.innerHTML = `
    <div class="daily-header">
      <div class="daily-header-eyebrow">Semana ${Math.min(tomorrowWeek + 1, 12)} · ${WD[dow]}</div>
      <div class="daily-header-title">${dayTitle}</div>
      <div class="daily-header-ley">${dayLey}</div>
    </div>
    <div class="daily-blocks">
      ${sched.blocks.map(b => `
        <div class="daily-block">
          <div class="db-bar ${b.dot}"></div>
          <div class="db-content">
            <div class="db-time-inline">${b.time}</div>
            <div class="db-body">
              <div class="db-title">${b.title}</div>
              <div class="db-desc">${b.desc}</div>
              ${b.sub ? `<div class="db-sub">${b.sub}</div>` : ''}
            </div>
          </div>
        </div>`).join('')}
    </div>
    <div class="daily-footer">
      <span>Terminas antes de mediodía 🌿</span>
      <span class="df-total">${sched.total}</span>
    </div>`;
  dailyEl.appendChild(dc);

  // ── VISTA SEMANAL (después del plan diario) ──
  const weekEl = document.createElement('div');
  weekEl.className = 'week-preview-card';
  const weekDays = ['L','M','X','J','V'];
  const dayLabels = ['Lunes','Martes','Miércoles','Jueves','Viernes'];
  const weekMapData = DAILY_MAP[tomorrowWeek] || [];
  // Build unique laws needed this week for prep panel
  const weekLaws = [...new Set(weekMapData.filter(Boolean).map(e => e.ley))];
  const weekTopics = weekMapData.filter(Boolean).map(e => e.titulo.split(' — ')[0]);

  weekEl.innerHTML = `
    <div class="wp-header">
      <div class="wp-eyebrow">Esta semana</div>
      <div class="wp-title">${wt.mat}</div>
    </div>
    <div class="wp-days-wrap">
      <div class="wp-days">
        ${weekDays.map((d, i) => {
          const entry = weekMapData[i];
          const isToday = (d === WD[dow]);
          if (!entry) return '';
          return `<div class="wp-day ${isToday ? 'wp-today' : ''}">
            <div class="wp-day-name">${dayLabels[i]}</div>
            <div class="wp-day-topic">${entry.titulo.split(' — ')[0]}</div>
            <div class="wp-day-ley">${entry.ley}</div>
          </div>`;
        }).join('')}
      </div>
      <div class="wp-prep">
        <div class="wp-prep-label">📂 ${dow === 5 || dow === 0 ? "Prepara tus apuntes antes del lunes" : "Lo que necesitas esta semana"}</div>
        <div class="wp-prep-col">
          <div class="wp-prep-col-title">Leyes que necesitas</div>
          ${weekLaws.map(l => `<div class="wp-prep-item">${l}</div>`).join('')}
        </div>
        <div class="wp-prep-col">
          <div class="wp-prep-col-title">Temas de la semana</div>
          ${weekTopics.map(t => `<div class="wp-prep-item">${t}</div>`).join('')}
        </div>
      </div>
    </div>`;
  dailyEl.appendChild(weekEl);
}

// ── TESTS ──
const temaDelDia = TEMAS_TEST[Math.floor(dayIndex / 5) % TEMAS_TEST.length];
const dailyQs = ALL_QUESTIONS.filter(q => q.tema === temaDelDia);
const weekQs  = [...ALL_QUESTIONS].sort(() => Math.random() - .5).slice(0, 8);

// ── REGISTRO DE INSTANCIAS DE TEST ──
window.TEST_REGISTRY = {};

// ── HISTORIAL DE SCORES ──
let testScores = {};
try { testScores = JSON.parse(localStorage.getItem('vania_scores') || '{}'); } catch(e) {}

function saveScore(tema, correct, total) {
  const pct = Math.round(correct / total * 100);
  testScores[tema] = {
    correct, total, pct,
    fecha: new Date().toLocaleDateString('es-ES'),
    ts: Date.now() // timestamp para el cooldown de 4h
  };
  try { localStorage.setItem('vania_scores', JSON.stringify(testScores)); } catch(e) {}
  renderRepaso();
}

function canRepeat(tema) {
  const s = testScores[tema];
  if (!s || !s.ts) return true;
  return (Date.now() - s.ts) > 4 * 60 * 60 * 1000; // 4 horas en ms
}

function timeUntilRepeat(tema) {
  const s = testScores[tema];
  if (!s || !s.ts) return '';
  const remaining = (4 * 60 * 60 * 1000) - (Date.now() - s.ts);
  if (remaining <= 0) return '';
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  return h > 0 ? `Disponible en ${h}h ${m}m` : `Disponible en ${m}m`;
}

// ── TEMAS YA ESTUDIADOS (basado en semanas completadas) ──
function temasEstudiados() {
  // Devuelve TODOS los temas, marcando cuáles están disponibles según el avance
  const temasVistos = Math.max(Math.floor(tomorrowStudyDay / 5) + 1, today < planStart ? 0 : 1);
  return TEMAS_TEST.map((tema, i) => ({
    tema,
    disponible: i < temasVistos
  }));
}

// ── PANEL DE REPASO ──
function renderRepaso() {
  const el = document.getElementById('repaso-panel');
  if (!el) return;

  const temas = temasEstudiados();

  if (!temas.length) {
    el.innerHTML = `<div class="repaso-empty">Aquí aparecerán tus tests cuando empieces el plan. 🌿</div>`;
    return;
  }

  // Entrada especial para el test semanal
  const scoreS = testScores['📋 Test semanal'];
  const pctS = scoreS ? scoreS.pct : null;
  let bClassS = 'badge-sin-datos', bTextS = 'Sin datos', bIconS = '○';
  if (pctS !== null) {
    if (pctS >= 80)      { bClassS = 'badge-verde';    bTextS = `${pctS}%`; bIconS = '●'; }
    else if (pctS >= 60) { bClassS = 'badge-amarillo'; bTextS = `${pctS}%`; bIconS = '●'; }
    else                 { bClassS = 'badge-rojo';     bTextS = `${pctS}%`; bIconS = '●'; }
  }
  const semanalCard = `
    <div class="repaso-card repaso-semanal" onclick="launchRepasoSemanal()">
      <div class="repaso-info">
        <div class="repaso-tema">📋 Test semanal — Repaso completo</div>
        <div class="repaso-meta">${scoreS ? `Última vez: ${scoreS.fecha}` : 'Mezcla de preguntas de todo el temario'}</div>
      </div>
      <div class="repaso-badge ${bClassS}">
        <span class="rb-icon">${bIconS}</span>
        <span class="rb-text">${bTextS}</span>
      </div>
    </div>`;

  el.innerHTML = semanalCard + temas.map(({ tema, disponible }) => {
    const score = testScores[tema];

    // Tema aún no alcanzado en el plan
    if (!disponible) {
      return `
        <div class="repaso-card repaso-bloqueado">
          <div class="repaso-info">
            <div class="repaso-tema" style="color:var(--ink3)">${tema}</div>
            <div class="repaso-meta">Aún no has llegado a este tema en el plan</div>
          </div>
          <div class="repaso-badge badge-sin-datos">
            <span class="rb-icon">🔒</span>
            <span class="rb-text">Pendiente</span>
          </div>
        </div>`;
    }

    const pct = score ? score.pct : null;
    let badgeClass = 'badge-sin-datos';
    let badgeText = 'Sin datos';
    let badgeIcon = '○';
    if (pct !== null) {
      if (pct >= 80)      { badgeClass = 'badge-verde';    badgeText = `${pct}%`; badgeIcon = '●'; }
      else if (pct >= 60) { badgeClass = 'badge-amarillo'; badgeText = `${pct}%`; badgeIcon = '●'; }
      else                { badgeClass = 'badge-rojo';     badgeText = `${pct}%`; badgeIcon = '●'; }
    }

    const qs = ALL_QUESTIONS.filter(q => q.tema === tema);
    const nPregs = qs.length;
    const listo = canRepeat(tema);
    const cooldownMsg = timeUntilRepeat(tema);

    return `
      <div class="repaso-card ${listo ? '' : 'repaso-bloqueado'}"
           onclick="${listo ? `launchRepaso('${tema}')` : ''}">
        <div class="repaso-info">
          <div class="repaso-tema">${tema}</div>
          <div class="repaso-meta">
            ${nPregs} pregunta${nPregs !== 1 ? 's' : ''}
            ${score ? ` · Última vez: ${score.fecha}` : ''}
            ${!listo ? ` · <span style="color:var(--ink3)">${cooldownMsg}</span>` : ''}
          </div>
        </div>
        <div class="repaso-badge ${badgeClass}">
          <span class="rb-icon">${listo ? badgeIcon : '🔒'}</span>
          <span class="rb-text">${listo ? badgeText : 'Espera'}</span>
        </div>
      </div>`;
  }).join('');
}

function launchRepasoSemanal() {
  ['test-daily','test-week','test-sabado','repaso-list','test-repaso-container'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('test-repaso-container').style.display = 'block';
  const qs = [...ALL_QUESTIONS].sort(() => Math.random() - .5).slice(0, 10);
  buildTestRepaso(qs, '📋 Test semanal');
}

function launchRepaso(tema) {
  // Ocultar todos los paneles de test
  ['test-daily','test-week','test-sabado','repaso-list','test-repaso-container'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  // Mostrar el contenedor del test de repaso
  const container = document.getElementById('test-repaso-container');
  if (container) container.style.display = 'block';

  const qs = ALL_QUESTIONS.filter(q => q.tema === tema);
  buildTestRepaso(qs, tema);
}

function buildTestRepaso(questions, tema) {
  const container = document.getElementById('test-repaso-container');
  if (!questions.length) {
    container.innerHTML = `<div class="card"><p style="font-size:14px;color:var(--ink2)">No hay preguntas disponibles para este tema todavía.</p></div>`;
    return;
  }

  let current = 0, score = 0;

  const qs = questions.map(q => {
    const s = shuffleOpts(q);
    return { ...q, opts: s.opts, correct: s.correct };
  });

  function render() {
    if (current >= qs.length) { showRepasoResult(); return; }
    const q = qs[current];
    const pct = Math.round(current / qs.length * 100);
    container.innerHTML = `
      <div class="test-container">
        <div class="test-header">
          <h3>🔁 Repaso · ${tema}</h3>
          <span class="test-score-badge">✓ ${score} / ${qs.length}</span>
        </div>
        <div class="test-prog"><div class="test-prog-fill" style="width:${pct}%"></div></div>
        <div class="question-area">
          <div class="q-num">Pregunta ${current + 1} de ${qs.length}</div>
          <div class="q-text">${q.q}</div>
          <div class="options">
            ${q.opts.map((o, i) => `
              <button class="opt-btn" id="rob-${i}" onclick="TEST_REGISTRY['repaso'].sel(${i})">
                <span class="opt-letter">${['A','B','C','D'][i]}</span>${o}
              </button>`).join('')}
          </div>
          <div class="explanation" id="expl-repaso">${q.exp}</div>
        </div>
        <div class="test-nav">
          <button class="tn-btn" onclick="switchTest('repaso-panel', document.querySelector('.wtab:last-child'))">← Volver</button>
          <button class="tn-btn primary" id="nxt-repaso" onclick="TEST_REGISTRY['repaso'].next()" style="display:none">
            ${current < qs.length - 1 ? 'Siguiente →' : 'Ver resultado'}
          </button>
        </div>
      </div>`;
  }

  TEST_REGISTRY['repaso'] = {
    sel: function(idx) {
      const q = qs[current];
      const allBtns = document.querySelectorAll('#test-repaso-container .opt-btn');
      allBtns.forEach(b => b.disabled = true);
      if (idx === q.correct) { score++; allBtns[idx].classList.add('correct'); }
      else { allBtns[idx].classList.add('wrong'); allBtns[q.correct].classList.add('revealed'); }
      document.getElementById('expl-repaso').classList.add('show');
      document.getElementById('nxt-repaso').style.display = 'block';
    },
    next: function() { current++; render(); }
  };

  function showRepasoResult() {
    const pct = Math.round(score / qs.length * 100);
    saveScore(tema, score, qs.length); // guardar score
    const color = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--gold)' : 'var(--red)';
    const msg = pct >= 80 ? '¡Ese tema ya es tuyo, Rubia! 🌿'
              : pct >= 60 ? 'Vas bien. Repásalo una vez más y lo cierras.'
              : 'Este tema te la está jugando. Vuelve al temario y repite. 💪';
    container.innerHTML = `
      <div class="test-container">
        <div class="test-header"><h3>🔁 Repaso · ${tema} — Resultado</h3></div>
        <div class="test-result">
          <div class="result-num" style="color:${color}">${score}/${qs.length}</div>
          <div class="result-label">${pct}% correcto</div>
          <div class="result-msg">"${msg}"</div>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px">
            <button class="tn-btn primary" onclick="buildTestRepaso(questions,'${tema}')">↺ Repetir este tema</button>
            <button class="tn-btn" onclick="switchTest('repaso-panel', document.querySelector('.wtab:last-child'))">← Volver a mis tests</button>
          </div>
        </div>
      </div>`;
  }

  render();
}

// ── BUILD TESTS ──

function shuffleOpts(q) {
  // Baraja las opciones y recalcula qué índice es el correcto
  const indices = q.opts.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    opts: indices.map(i => q.opts[i]),
    correct: indices.indexOf(q.correct)
  };
}

function buildTest(questions, containerId, label) {
  if (!questions.length) {
    document.getElementById(containerId).innerHTML = `<div class="card"><div class="card-label">Pronto</div><p style="font-size:14px;color:var(--ink2)">Tests de este tema disponibles pronto.</p></div>`;
    return;
  }

  const c = document.getElementById(containerId);
  let current = 0, score = 0;

  // Preparar preguntas con opciones barajadas
  const qs = questions.map(q => {
    const shuffled = shuffleOpts(q);
    return { ...q, opts: shuffled.opts, correct: shuffled.correct };
  });

  function render() {
    if (current >= qs.length) { showResult(); return; }
    const q = qs[current];
    const pct = Math.round(current / qs.length * 100);
    c.innerHTML = `
      <div class="test-container">
        <div class="test-header">
          <h3>${label}</h3>
          <span class="test-score-badge">✓ ${score} / ${qs.length}</span>
        </div>
        <div class="test-prog"><div class="test-prog-fill" style="width:${pct}%"></div></div>
        <div class="question-area">
          <div class="q-num">Pregunta ${current + 1} de ${qs.length} · ${q.tema}</div>
          <div class="q-text">${q.q}</div>
          <div class="options">
            ${q.opts.map((o, i) => `
              <button class="opt-btn" id="ob-${containerId}-${i}"
                onclick="TEST_REGISTRY['${containerId}'].sel(${i})">
                <span class="opt-letter">${['A','B','C','D'][i]}</span>${o}
              </button>`).join('')}
          </div>
          <div class="explanation" id="expl-${containerId}">${q.exp}</div>
        </div>
        <div class="test-nav">
          <span style="font-size:12px;color:var(--ink3)">${q.tema}</span>
          <button class="tn-btn primary" id="nxt-${containerId}"
            onclick="TEST_REGISTRY['${containerId}'].next()" style="display:none">
            ${current < qs.length - 1 ? 'Siguiente →' : 'Ver resultado'}
          </button>
        </div>
      </div>`;
  }

  // Registrar funciones únicas para esta instancia
  TEST_REGISTRY[containerId] = {
    sel: function(idx) {
      const q = qs[current];
      const allBtns = document.querySelectorAll(`#${containerId} .opt-btn`);
      allBtns.forEach(b => b.disabled = true);
      if (idx === q.correct) {
        score++;
        allBtns[idx].classList.add('correct');
      } else {
        allBtns[idx].classList.add('wrong');
        allBtns[q.correct].classList.add('revealed');
      }
      document.getElementById(`expl-${containerId}`).classList.add('show');
      document.getElementById(`nxt-${containerId}`).style.display = 'block';
    },
    next: function() {
      current++;
      render();
    }
  };

  function showResult() {
    const pct = Math.round(score / qs.length * 100);
    saveScore(label.includes('semanal') ? '📋 Test semanal' : label.replace('Test del día · ', '').trim() || containerId, score, qs.length);
    const msg = pct >= 80 ? '¡Eso es, Rubia! El temario ya es tuyo. 🌿'
              : pct >= 60 ? 'Bien encaminada. Repasa los que fallaste y vuelve.'
              :             'Hoy el temario te ha ganado. Mañana ganas tú.';
    const color = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--gold)' : 'var(--red)';
    c.innerHTML = `
      <div class="test-container">
        <div class="test-header"><h3>${label} — Resultado</h3></div>
        <div class="test-result">
          <div class="result-num" style="color:${color}">${score}/${qs.length}</div>
          <div class="result-label">${pct}% correcto</div>
          <div class="result-msg">"${msg}"</div>
          <p style="font-size:12px;color:var(--ink3);margin-bottom:16px">
            Puedes repetirlo desde <strong>Mis tests</strong> cuando quieras — después de 4 horas.
          </p>
          <button class="tn-btn" onclick="this.closest('.test-container').style.display='none'">✕ Cerrar</button>
        </div>
      </div>`;
  }

  render();
}

buildTest(dailyQs, 'test-daily', `Test del día · ${temaDelDia}`);
buildTest(weekQs,  'test-week',  'Test semanal · Repaso completo');

function switchTest(type, btn) {
  document.querySelectorAll('.wtab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const panels = ['test-daily','test-week','test-sabado','repaso-list','test-repaso-container'];
  panels.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = 'none'; });

  if (type === 'daily')        { document.getElementById('test-daily').style.display = 'block'; }
  else if (type === 'week')    { document.getElementById('test-week').style.display = 'block'; }
  else if (type === 'sabado')  { document.getElementById('test-sabado').style.display = 'block'; }
  else if (type === 'repaso-panel') {
    document.getElementById('repaso-list').style.display = 'block';
    renderRepaso();
  }
}

// Inicializar panel de repaso
renderRepaso();

// ── MAPA CONCEPTUAL SEMANAL ──
function renderWeekMap() {
  const el = document.getElementById('weekMap');
  if (!el) return;

  const weekIndex = Math.min(Math.floor(tomorrowStudyDay / 5), DAILY_MAP.length - 1);
  const dayOfWeek = dow === 0 ? 4 : dow - 1; // 0=L,1=M,2=X,3=J,4=V
  const weekDays  = DAILY_MAP[weekIndex] || [];

  const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const todayMap = weekDays[Math.min(dayOfWeek, 4)] || {};

  // Si es sábado/domingo o fuera de rango
  if (isWeekend || !todayMap.titulo || today < planStart) {
    el.innerHTML = '';
    return;
  }

  el.innerHTML = `
    <div class="map-today-card">
      <div class="map-badge">📌 Hoy dominas esto</div>
      <div class="map-title">${todayMap.titulo}</div>
      <div class="map-ley">${todayMap.ley}</div>
      <ul class="map-list">
        ${todayMap.conceptos.map(c => `<li>${c}</li>`).join('')}
      </ul>
      ${todayMap.truco ? `<div class="map-truco"><span>💡</span> ${todayMap.truco}</div>` : ''}
    </div>
    <div class="map-week-card">
      <div class="map-week-title">📅 Esta semana · Semana ${weekIndex + 1}</div>
      <div class="map-week-days">
        ${weekDays.slice(0,5).map((d, i) => `
          <div class="map-week-day ${i === dayOfWeek ? 'today' : ''} ${i < dayOfWeek ? 'past' : ''}">
            <div class="mwd-label">${dayNames[i]}</div>
            <div class="mwd-topic">${d.titulo || '—'}</div>
            ${i === dayOfWeek ? '<div class="mwd-badge">Hoy</div>' : ''}
            ${i < dayOfWeek ? '<div class="mwd-done">✓</div>' : ''}
            ${i === 4 ? '<div class="mwd-test">+ Test semanal</div>' : ''}
          </div>`).join('')}
      </div>
    </div>`;
}

renderWeekMap();

// ── EXAMEN REAL DEL SÁBADO ──
// ── COOLDOWN EXAMEN (2h) ──
function examCooldownHtml() {
  let examTs = null;
  try { examTs = parseInt(localStorage.getItem('vania_exam_ts') || '0'); } catch(e) {}
  const elapsed = Date.now() - examTs;
  const cooldown = 2 * 60 * 60 * 1000;
  if (elapsed >= cooldown) {
    return `<button class="tn-btn primary" onclick="buildExamenReal()" style="width:100%;padding:12px">↺ Nuevo examen</button>`;
  }
  const remaining = cooldown - elapsed;
  const h = Math.floor(remaining / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  return `<button class="tn-btn" disabled style="width:100%;padding:12px;opacity:.5;cursor:not-allowed">
    🔒 Nuevo examen disponible en ${h}h ${m}m
  </button>`;
}

function buildExamenReal() {
  const c = document.getElementById('test-sabado');
  if (!c) return;

  // Pantalla de inicio — el cronómetro NO arranca hasta que ella pulse
  c.innerHTML = `
    <div class="test-container">
      <div class="test-header"><h3>📋 Examen real — Convocatoria oficial</h3></div>
      <div class="test-result" style="padding:40px 28px">
        <div style="font-size:44px;margin-bottom:16px">📋</div>
        <div style="font-family:'Lora',serif;font-size:22px;font-weight:700;color:var(--ink);margin-bottom:12px">
          ¿Lista para empezar?
        </div>
        <div style="font-size:14px;color:var(--ink2);line-height:1.8;max-width:400px;margin:0 auto 24px">
          <strong>20 preguntas · 20 minutos · Penalización -1/3</strong><br>
          Exactamente igual que el examen real.<br>
          El cronómetro empieza cuando tú pulses.<br>
          <span style="font-size:12px;color:var(--ink3)">Solo cuando estés lista de verdad, no por curiosidad 😏</span>
        </div>
        <button class="tn-btn primary" onclick="iniciarExamenReal()" style="padding:12px 32px;font-size:15px">
          ▶ Comenzar examen
        </button>
      </div>
    </div>`;
}

window.iniciarExamenReal = function() {
  const c = document.getElementById('test-sabado');
  if (!c) return;

  const qs = [...EXAM_REAL].sort(() => Math.random() - .5).slice(0, 20);
  let current = 0, correctas = 0, incorrectas = 0, respondidas = 0;
  let segundos = 20 * 60;
  let cronInt = null;

  function tick() {
    segundos--;
    const m = String(Math.floor(segundos / 60)).padStart(2, '0');
    const s = String(segundos % 60).padStart(2, '0');
    const el = document.getElementById('exam-timer');
    if (el) {
      el.textContent = `⏱ ${m}:${s}`;
      if (segundos < 120) el.style.color = 'var(--red)';
    }
    if (segundos <= 0) { clearInterval(cronInt); showExamResult(); }
  }

  function render() {
    if (current >= qs.length) { showExamResult(); return; }
    const q = qs[current];
    const pct = Math.round(current / qs.length * 100);
    c.innerHTML = `
      <div class="test-container">
        <div class="test-header">
          <h3>📋 Examen real — Convocatoria oficial</h3>
          <span class="exam-timer-badge" id="exam-timer">⏱ 20:00</span>
        </div>
        <div class="test-prog"><div class="test-prog-fill" style="width:${pct}%"></div></div>
        <div class="question-area">
          <div class="q-num">Pregunta ${current + 1} de ${qs.length}</div>
          <div class="q-text">${q.q}</div>
          <div class="options">
            ${q.opts.map((o, i) => `
              <button class="opt-btn" id="eob-${i}" onclick="selExamOpt(${i},${q.correct})">
                <span class="opt-letter">${['A','B','C'][i]}</span>${o}
              </button>`).join('')}
          </div>
        </div>
        <div class="test-nav">
          <span class="exam-penalty-note">-1/3 por error · Como el examen real</span>
          <button class="tn-btn primary" id="exam-nxt" onclick="nxtExam()" style="display:none">
            ${current < qs.length - 1 ? 'Siguiente →' : 'Ver resultado'}
          </button>
        </div>
      </div>`;

    if (!cronInt) cronInt = setInterval(tick, 1000);
  }

  // Guardar respuestas para mostrar correcciones AL FINAL
  const respuestas = [];

  window.selExamOpt = function(idx, correct) {
    // Marcar opción elegida visualmente (sin revelar si es correcta)
    document.querySelectorAll('[id^="eob-"]').forEach(b => b.disabled = true);
    document.getElementById(`eob-${idx}`).classList.add('selected-exam');
    respuestas.push({ idx, correct, q: qs[current] });
    respondidas++;
    if (idx === correct) correctas++;
    else incorrectas++;
    document.getElementById('exam-nxt').style.display = 'block';
  };

  window.nxtExam = function() { current++; render(); };

  function calcNota(c, i, total) {
    const pts = c - (i / 3);
    const nota = Math.max(0, (pts / total) * 10);
    return nota.toFixed(2);
  }

  function showExamResult() {
    clearInterval(cronInt);
    // Guardar timestamp para el cooldown de 2h
    try { localStorage.setItem('vania_exam_ts', Date.now().toString()); } catch(e) {}
    const nota = parseFloat(calcNota(correctas, incorrectas, qs.length));
    const notaStr = nota.toFixed(2);

    // Frase sarcástica pero de apoyo según nota
    let emoji, frase, subFrase;
    if (nota >= 8) {
      emoji = '🏆'; frase = 'Oye, que casi me quedo sin palabras.';
      subFrase = 'Casi. Pero en serio, Rubia, esto está muy bien. El examen real no sabe lo que le viene.';
    } else if (nota >= 6) {
      emoji = '🌿'; frase = 'Nota de corte superada. Lo has hecho.';
      subFrase = 'No te emociones demasiado. Aún queda temario. Pero hoy, bien.';
    } else if (nota >= 4) {
      emoji = '😬'; frase = 'Bueno... podrías haberlo hecho peor.';
      subFrase = 'En serio, estás cerca. Los fallos de hoy son los aciertos de la semana que viene. Mira qué has fallado.';
    } else if (nota >= 2) {
      emoji = '😂'; frase = 'El temario te ha ganado hoy. Pasa.';
      subFrase = 'Pero mira la parte positiva: ahora sabes exactamente qué repasar. Eso ya es algo, Rubia.';
    } else {
      emoji = '💀'; frase = 'Oye, ¿seguro que has estudiado algo?';
      subFrase = 'Sin dramas. El primer simulacro siempre es así. Lo importante es saber dónde estás. Y ahora lo sabes.';
    }

    // Tarjetas de estadísticas
    const sin = qs.length - respondidas;

    // Revisión de fallos — solo las incorrectas, con diseño limpio
    const fallos = respuestas.filter(r => r.idx !== r.correct);
    const aciertos = respuestas.filter(r => r.idx === r.correct);

    const revisionFallos = fallos.length === 0
      ? `<div style="text-align:center;padding:24px;color:var(--green);font-family:'Lora',serif;font-size:16px;font-weight:600">
          ¡Sin fallos! Eso no me lo esperaba, Rubia. 🌿
         </div>`
      : fallos.map((r, i) => `
          <div class="exam-fallo-card">
            <div class="exam-fallo-num">Pregunta fallada ${i + 1} de ${fallos.length}</div>
            <div class="exam-fallo-q">${r.q.q}</div>
            <div class="exam-fallo-row exam-fallo-wrong">
              <span class="exam-fallo-label">Tú pusiste</span>
              <span>${r.q.opts[r.idx]}</span>
            </div>
            <div class="exam-fallo-row exam-fallo-correct">
              <span class="exam-fallo-label">Era</span>
              <span>${r.q.opts[r.correct]}</span>
            </div>
            <div class="exam-fallo-exp">${r.q.exp}</div>
          </div>`).join('');

    c.innerHTML = `
      <div class="exam-result-wrap">

        <!-- NOTA GRANDE -->
        <div class="exam-nota-hero">
          <div class="exam-nota-emoji">${emoji}</div>
          <div class="exam-nota-num" style="color:${nota >= 6 ? 'var(--green)' : nota >= 4 ? 'var(--gold)' : 'var(--red)'}">${notaStr}</div>
          <div class="exam-nota-sub">sobre 10 · penalización -1/3 incluida</div>
          <div class="exam-nota-frase">${frase}</div>
          <div class="exam-nota-subfrase">${subFrase}</div>
        </div>

        <!-- ESTADÍSTICAS EN TARJETAS -->
        <div class="exam-stats">
          <div class="exam-stat-card exam-stat-ok">
            <div class="exam-stat-n">${correctas}</div>
            <div class="exam-stat-l">✓ Correctas</div>
          </div>
          <div class="exam-stat-card exam-stat-ko">
            <div class="exam-stat-n">${incorrectas}</div>
            <div class="exam-stat-l">✗ Incorrectas</div>
          </div>
          <div class="exam-stat-card exam-stat-na">
            <div class="exam-stat-n">${sin}</div>
            <div class="exam-stat-l">— Sin contestar</div>
          </div>
        </div>

        <!-- BOTÓN NUEVO EXAMEN -->
        <div style="padding:0 28px 28px">
          ${examCooldownHtml()}
        </div>

        <!-- REVISIÓN DE FALLOS -->
        ${fallos.length > 0 ? `
        <div class="exam-fallos-section">
          <div class="exam-frase-reminder">
            <span>${emoji}</span> ${frase}
          </div>
          <div class="exam-fallos-title">
            Lo que has fallado
            <span class="exam-fallos-badge">${fallos.length} de ${qs.length}</span>
          </div>
          ${revisionFallos}
        </div>` : `
        <div style="text-align:center;padding:0 28px 32px">
          ${revisionFallos}
        </div>`}

      </div>`;
    // Scroll to top so she sees the note and sarcastic phrase first
    c.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.scrollTo({ top: c.offsetTop - 80, behavior: 'smooth' });
  }

  render();
};

// Inicializar examen real (muestra pantalla de inicio)
buildExamenReal();


// ── APUNTES PDF ──
function generateApuntesPDF(info, dayFull, weekIdx) {
  const conceptsHtml = (info.conceptos || []).map((c, i) =>
    `<div class="pdfconcept"><span class="pdfnum">${String(i+1).padStart(2,'0')}</span><span class="pdftext">${c}</span></div>`
  ).join('');

  const printCSS = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@400;600&display=swap');
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'DM Sans',sans-serif;background:#f2ede4;color:#1a1816;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
      .pdfpage{width:100%;min-height:100vh;display:flex;flex-direction:column;}
      .pdfheader{background:linear-gradient(145deg,#1c3d1f,#152e17);padding:36px 52px 28px;position:relative;overflow:hidden;}
      .pdfheader-eyebrow{font-size:9px;text-transform:uppercase;letter-spacing:3px;color:rgba(180,220,180,.5);font-weight:600;margin-bottom:10px;}
      .pdfheader-title{font-family:'Lora',serif;font-size:26px;font-weight:700;color:#e8f0e8;line-height:1.1;margin-bottom:8px;}
      .pdfheader-title em{font-style:italic;color:#8fd68f;}
      .pdfheader-meta{font-size:11px;color:rgba(255,255,255,.3);}
      .pdfgold{background:#fdf4e0;border-bottom:2px solid #e8d898;padding:14px 52px;display:flex;align-items:center;gap:16px;}
      .pdfgold-label{font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#a67c00;font-weight:700;flex-shrink:0;}
      .pdfgold-ref{font-family:'Lora',serif;font-size:16px;font-weight:700;color:#6a5000;}
      .pdfbody{padding:32px 52px;flex:1;}
      .pdfsection{font-size:9px;text-transform:uppercase;letter-spacing:3px;color:#8a7e6e;font-weight:600;margin-bottom:12px;margin-top:24px;}
      .pdfsection:first-child{margin-top:0;}
      .pdfconcepts{display:flex;flex-direction:column;gap:7px;}
      .pdfconcept{display:flex;align-items:flex-start;gap:12px;background:#fff;border-radius:9px;padding:10px 14px;border-left:3px solid #4a8a4a;}
      .pdfnum{font-family:'Lora',serif;font-size:14px;font-weight:700;color:#c8d8c8;flex-shrink:0;min-width:22px;line-height:1.3;}
      .pdftext{font-size:12px;color:#1a1816;line-height:1.5;}
      .pdftruco{background:#fff;border-radius:10px;padding:14px 18px;border-left:3px solid #4a8a4a;font-family:'Lora',serif;font-style:italic;font-size:13px;color:#2d5a2d;line-height:1.7;}
      .pdflines{display:flex;flex-direction:column;gap:20px;margin-top:12px;}
      .pdfline{height:1px;background:#d0c8b8;}
      .pdffooter{background:linear-gradient(145deg,#1c3d1f,#152e17);padding:14px 52px;display:flex;justify-content:space-between;}
      .pdffooter span{font-size:9px;color:rgba(255,255,255,.28);letter-spacing:1.5px;text-transform:uppercase;font-family:'Lora',serif;font-style:italic;}
      @media print{@page{size:A4;margin:0;}body{background:#f2ede4;}}
    </style>`;

  const bodyHtml = `
    <div class="pdfpage">
      <div class="pdfheader">
        <div class="pdfheader-eyebrow">PM Madrid · ${dayFull} · Semana ${weekIdx + 1}</div>
        <div class="pdfheader-title">${info.titulo.replace(' — ', ' <em>&middot;</em> ')}</div>
        <div class="pdfheader-meta">Oposición 2026 · Apuntes del día</div>
      </div>
      <div class="pdfgold">
        <div class="pdfgold-label">📂 Busca en tus apuntes</div>
        <div class="pdfgold-ref">${info.ley}</div>
      </div>
      <div class="pdfbody">
        <div class="pdfsection">Lo que tienes que saber hoy</div>
        <div class="pdfconcepts">${conceptsHtml}</div>
        ${info.truco ? `
          <div class="pdfsection">Truco para recordarlo</div>
          <div class="pdftruco">${info.truco}</div>` : ''}
        <div class="pdfsection">Mis notas</div>
        <div class="pdflines">${Array(10).fill('<div class="pdfline"></div>').join('')}</div>
      </div>
      <div class="pdffooter">
        <span>Vania ✦ Policía Municipal Madrid</span>
        <span>${info.ley} · S${weekIdx + 1}</span>
      </div>
    </div>`;

  // Generate downloadable HTML file (opens in browser, user saves as PDF with Ctrl+P > Save as PDF)
  // This is the only reliable cross-browser method without a server
  const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Apuntes · ${info.titulo}</title>${printCSS}
<style>
  body { display:flex; flex-direction:column; align-items:center; padding:40px 20px; background:#e8e0d4; min-height:100vh; }
  .pdfpage { width:210mm; background:#f2ede4; box-shadow:0 8px 40px rgba(0,0,0,.2); }
  .save-bar { width:210mm; margin-bottom:20px; background:#1c3d1f; border-radius:12px; padding:14px 24px; display:flex; align-items:center; justify-content:space-between; }
  .save-bar span { font-family:'DM Sans',sans-serif; font-size:13px; color:rgba(255,255,255,.7); }
  .save-bar button { font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; background:#c4a84e; color:#111; border:none; border-radius:100px; padding:8px 20px; cursor:pointer; }
  @media print { .save-bar { display:none; } body { padding:0; background:none; } .pdfpage { box-shadow:none; width:100%; } @page { size:A4; margin:15mm 18mm; } }
</style>
</head>
<body>
  <div class="save-bar">
    <span>Vania ✦ Apuntes del día · ${dayFull} Semana ${weekIdx + 1}</span>
    <button onclick="window.print()">Guardar como PDF →</button>
  </div>
  <div class="pdfpage">${bodyHtml.replace('<div class="pdfpage">','').replace(/<\/div>\s*$/, '')}</div>
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const fileName = 'apuntes-s${weekIdx+1}-${dayFull.toLowerCase().replace(/[^a-z]/g,"")}.html';
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}


// ── CALENDARIO ──
const DAY_NAMES = ['L','M','X','J','V','S','D'];
let doneDays = {};
try { doneDays = JSON.parse(localStorage.getItem('vania_days') || '{}'); } catch(e) {}

const calArea = document.getElementById('calArea');
PLAN_DATA.forEach(month => {
  const block = document.createElement('div');
  block.className = 'month-block';
  block.innerHTML = `
    <div class="month-head" onclick="toggleM(this)">
      <div class="m-num ${month.cls}">
        ${month.id === 1 ? `<svg viewBox="0 0 32 32" fill="none"><g stroke="currentColor" stroke-width="1" opacity="0.7"><ellipse cx="16" cy="22" rx="8" ry="16" transform="rotate(-5 16 22)"/><ellipse cx="22" cy="18" rx="6" ry="12" transform="rotate(15 22 18)"/><ellipse cx="10" cy="20" rx="5" ry="10" transform="rotate(-18 10 20)"/><line x1="16" y1="31" x2="16" y2="6" stroke-width="1.2"/><line x1="22" y1="30" x2="22" y2="6" stroke-width="1.2"/><line x1="10" y1="30" x2="10" y2="10" stroke-width="1.2"/></g></svg>` : month.id === 2 ? `<svg viewBox="0 0 32 32" fill="none"><g stroke="currentColor" stroke-width="1" opacity="0.7"><circle cx="16" cy="12" r="6" stroke-dasharray="3 2"/><ellipse cx="16" cy="22" rx="7" ry="12" transform="rotate(0 16 22)"/><ellipse cx="23" cy="20" rx="5" ry="10" transform="rotate(20 23 20)"/><line x1="16" y1="31" x2="16" y2="10" stroke-width="1.2"/><path d="M10 14 Q8 10 10 7" stroke-width="0.9"/><path d="M22 14 Q24 10 22 7" stroke-width="0.9"/></g></svg>` : `<svg viewBox="0 0 32 32" fill="none"><g stroke="currentColor" stroke-width="1" opacity="0.7"><path d="M16 28 Q8 20 8 12 A8 8 0 0 1 24 12 Q24 20 16 28Z"/><line x1="16" y1="28" x2="16" y2="4" stroke-width="1.2"/><path d="M16 18 Q11 14 10 10" stroke-width="0.9"/><path d="M16 18 Q21 14 22 10" stroke-width="0.9"/><path d="M16 24 Q13 20 12 16" stroke-width="0.9"/><path d="M16 24 Q19 20 20 16" stroke-width="0.9"/></g></svg>`}
      </div>
      <div class="m-text">
        <div class="m-title">${month.label} — ${month.title}</div>
        <div class="m-sub">${month.sub}</div>
      </div>
      <span class="m-chev open">▾</span>
    </div>
    <div class="month-body open" id="mb-${month.id}"></div>`;
  calArea.appendChild(block);

  const body = block.querySelector(`#mb-${month.id}`);
  month.weeks.forEach((week, wi) => {
    // Calculate global week index (for DAILY_MAP lookup)
    const monthIdx = PLAN_DATA.indexOf(month);
    const weeksBeforeThisMonth = PLAN_DATA.slice(0, monthIdx).reduce((acc, m) => acc + m.weeks.length, 0);
    const globalWeekIdx = weeksBeforeThisMonth + wi;

    const wr = document.createElement('div');
    wr.className = 'week-row';
    wr.innerHTML = `
      <div class="week-label">${week.n}</div>
      <div class="week-topic">${week.t}</div>
      <div class="days-grid" id="dg-${month.id}-${wi}"></div>`;
    body.appendChild(wr);

    const grid = wr.querySelector(`#dg-${month.id}-${wi}`);
    DAY_NAMES.forEach((d, di) => {
      const key  = `${month.id}-${wi}-${di}`;
      const cell = document.createElement('div');
      const isDone = doneDays[key];
      const isRest = (d === 'S' || d === 'D');

      // Get daily topic from DAILY_MAP (only L-V = di 0-4)
      const studyDayIdx = ['L','M','X','J','V'].indexOf(d);
      const dailyInfo = (studyDayIdx >= 0 && DAILY_MAP[globalWeekIdx])
        ? DAILY_MAP[globalWeekIdx][studyDayIdx] : null;

      cell.className = 'day-cell' + (isDone ? ' done' : '') + (isRest ? ' rest' : '') + (dailyInfo ? ' has-topic' : '');
      cell.innerHTML = `<span class="dc-n">${di + 1}</span><span class="dc-d">${d}</span><span class="dc-chk">✓</span>`;
      cell.dataset.weekIdx = globalWeekIdx;
      cell.dataset.dayIdx = studyDayIdx;
      cell.dataset.key = key;

      if (!isRest) {
        cell.onclick = () => {
          if (doneDays[key] && dailyInfo) {
            // Already done — show topic detail
            showDayDetail(cell, dailyInfo, true, d, globalWeekIdx);
          } else if (!doneDays[key]) {
            // Not done — mark as done
            toggleDay(cell, key);
          }
        };
      }
      grid.appendChild(cell);
    });
  });
});

// ── DÍA DETALLE POPUP ──
function showDayDetail(cell, info, isDone, dayName, weekIdx) {
  document.querySelectorAll('.day-detail-popup').forEach(p => p.remove());

  const dayNames = ['Lunes','Martes','Miércoles','Jueves','Viernes'];
  const dayFull = dayNames[['L','M','X','J','V'].indexOf(dayName)] || dayName;
  const tema = info?.titulo?.split(' — ')[0] || '';

  // Build concepts list
  const conceptsHtml = (info.conceptos || []).map(c =>
    `<li class="ddp-concept">${c}</li>`
  ).join('');

  const popup = document.createElement('div');
  popup.className = 'day-detail-popup';
  popup.innerHTML = `
    <div class="ddp-backdrop"></div>
    <div class="ddp-inner">

      <!-- Header -->
      <div class="ddp-header">
        <div class="ddp-header-left">
          <div class="ddp-day-pill">${dayFull} · Semana ${weekIdx + 1}</div>
          <div class="ddp-title">${info.titulo}</div>
        </div>
        <button class="ddp-close" onclick="document.querySelectorAll('.day-detail-popup').forEach(p=>p.remove())">✕</button>
      </div>

      <!-- Body wrapper -->
      <div class="ddp-body">
        <div class="ddp-section-label">Lo que estudiaste ese día</div>
        <ul class="ddp-list">${conceptsHtml}</ul>
      </div>

      <!-- CTAs -->
      <div class="ddp-btns">
        <button class="ddp-btn ddp-btn-secondary" id="ddp-pdf-btn">
          Descargar apuntes
        </button>
        ${isDone ? `
        <button class="ddp-btn" onclick="
          document.querySelectorAll('.day-detail-popup').forEach(p=>p.remove());
          goPage('tests', document.querySelectorAll('.nav-btn')[3]);
          setTimeout(() => { switchTest('repaso-panel', document.querySelectorAll('.wtab')[3]); setTimeout(() => launchRepaso('${tema}'), 80); }, 80);">
          Test de repaso
        </button>` : ''}
      </div>

      <!-- Apuntes reference — al final -->
      <div class="ddp-apuntes">
        <div class="ddp-apuntes-label">📂 Busca en tus apuntes</div>
        <div class="ddp-apuntes-ref">${info.ley}</div>
      </div>

    </div>`;

  document.body.appendChild(popup);

  // Attach PDF button with closure — avoids window._ddpInfo timing issue
  const pdfBtn = popup.querySelector('#ddp-pdf-btn');
  if (pdfBtn) {
    pdfBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      generateApuntesPDF(info, dayFull, weekIdx);
    });
  }

  const rect = cell.getBoundingClientRect();
  const scrollY = window.scrollY;
  const vpH = window.innerHeight;
  const popH = 440;
  let top = rect.bottom + scrollY + 10;
  if (top + popH > scrollY + vpH - 20) top = rect.top + scrollY - popH - 10;
  const left = Math.max(16, Math.min(rect.left + window.scrollX - 20, window.innerWidth - 320 - 20));
  popup.style.top = top + 'px';
  popup.style.left = left + 'px';

  setTimeout(() => document.addEventListener('click', function handler(e) {
    if (!popup.contains(e.target) && e.target !== cell) {
      popup.remove(); document.removeEventListener('click', handler);
    }
  }), 120);
}

function toggleM(head) {
  const id = head.closest('.month-block').querySelector('[id^="mb-"]').id.split('-')[1];
  head.querySelector('.m-chev').classList.toggle('open');
  document.getElementById(`mb-${id}`).classList.toggle('open');
}

function toggleDay(cell, key) {
  doneDays[key] = !doneDays[key];
  try { localStorage.setItem('vania_days', JSON.stringify(doneDays)); } catch(e) {}
  cell.classList.toggle('done', doneDays[key]);
  updateStats();
}

function updateStats() {
  const done = Object.values(doneDays).filter(Boolean).length;
  const pct  = Math.round(done / 84 * 100);
  document.getElementById('heroPct').textContent   = pct + '%';
  document.getElementById('heroFill').style.width  = pct + '%';
  document.getElementById('heroLabel').textContent = `${done} de 84 días del plan`;
  document.getElementById('pPct').textContent      = pct + '%';
  document.getElementById('pFill').style.width     = pct + '%';
  document.getElementById('pLabel').textContent    = `${done} de 84 días`;
  document.getElementById('pDias').textContent     = done;

  const allKeys = [];
  PLAN_DATA.forEach(m => m.weeks.forEach((w, wi) =>
    DAY_NAMES.forEach((d, di) => { if (d !== 'D') allKeys.push(`${m.id}-${wi}-${di}`); })
  ));
  let r = 0;
  for (let i = allKeys.length - 1; i >= 0; i--) {
    if (doneDays[allKeys[i]]) r++;
    else break;
  }
  document.getElementById('pRacha').textContent      = r;
  // Update new hero racha display
  const rachaNumEl = document.getElementById('rachaBadgeNum');
  if (rachaNumEl) rachaNumEl.textContent = r;
}

updateStats();

// ── CONFETTI ──
function confetti(el) {
  const rect = el.getBoundingClientRect();
  const b = document.createElement('div');
  b.className = 'burst';
  document.body.appendChild(b);
  const cols = ['#3a6b3a','#5a9e5a','#a67c00','#7aba7a','#dfc97a'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'part';
    p.style.cssText = `left:${rect.left + rect.width/2 + (Math.random()-.5)*44}px;top:${rect.top}px;background:${cols[Math.floor(Math.random()*cols.length)]};animation-delay:${Math.random()*.25}s`;
    b.appendChild(p);
  }
  setTimeout(() => b.remove(), 1200);
}

// ── POMODORO ──
let pMin = 25, pSec = 0, pInt = null, pRun = false;

function setPomo(m, btn) {
  document.querySelectorAll('.pm').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  pMin = m; pSec = 0;
  clearInterval(pInt); pRun = false;
  upP();
  document.getElementById('pLbl').textContent = m <= 10 ? 'Descanso ☕' : 'Bloque de estudio';
}

function upP() {
  document.getElementById('pTime').textContent = `${String(pMin).padStart(2,'0')}:${String(pSec).padStart(2,'0')}`;
}

function startP() {
  if (pRun) return;
  pRun = true;
  pInt = setInterval(() => {
    if (pSec === 0) {
      if (pMin === 0) { clearInterval(pInt); pRun = false; document.getElementById('pTime').textContent = '¡Hecho! ✓';
        // Guardar fecha de hoy como pomodoro completado (para desbloquear recompensas)
        try {
          const todayStr = new Date().toISOString().slice(0,10);
          const dates = JSON.parse(localStorage.getItem('vania_pomo_dates') || '[]');
          if (!dates.includes(todayStr)) { dates.push(todayStr); localStorage.setItem('vania_pomo_dates', JSON.stringify(dates)); }
          renderRewardCard();
        } catch(e) {}
        return; }
      pMin--; pSec = 59;
    } else pSec--;
    upP();
  }, 1000);
}

function pauseP() { clearInterval(pInt); pRun = false; }
function resetP() {
  clearInterval(pInt); pRun = false;
  const a = document.querySelector('.pm.active');
  pMin = parseInt(a?.textContent) || 25; pSec = 0; upP();
}

// ── RECOMPENSAS ──
let selectedRewards = [];
try { selectedRewards = JSON.parse(localStorage.getItem('vania_rewards') || '[]'); } catch(e) {}

// Recompensa desbloqueada si completó al menos 1 pomodoro HOY
function rewardUnlocked() {
  try {
    const pomoDates = JSON.parse(localStorage.getItem('vania_pomo_dates') || '[]');
    const todayStr = today.toISOString().slice(0,10);
    return pomoDates.includes(todayStr);
  } catch(e) { return false; }
}

function renderRewardCard() {
  const card = document.getElementById('rewardCard');
  if (!card) return;

  const unlocked = rewardUnlocked();

  if (selectedRewards.length > 0) {
    const list = selectedRewards.map(i => ALL_REWARDS[i]);
    card.innerHTML = `
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:3px;color:var(--sage);font-weight:600;margin-bottom:12px">
        Cuando acabes, te lo has ganado
      </div>
      <p style="font-size:13px;color:var(--ink2);margin-bottom:18px;line-height:1.7">
        ${unlocked
          ? '✓ Has completado el Pomodoro de hoy. <strong style="color:var(--green)">Las recompensas están desbloqueadas.</strong>'
          : 'Completa un Pomodoro hoy para desbloquearlas. Aún no te las has ganado, Rubia.'}
      </p>
      ${list.map(r => `
        <div class="reward-saved ${unlocked ? 'unlocked' : 'locked'}">
          <div class="reward-saved-icon" data-cat="${r.cat}">${r.icon}</div>
          <div class="reward-saved-body">
            <div class="reward-saved-name">${r.name}</div>
            <div class="reward-saved-sub">${r.sub}</div>
            ${unlocked
              ? '<div class="reward-unlock-badge">✓ Desbloqueada</div>'
              : '<div class="reward-saved-lock">🔒 Completa un Pomodoro primero</div>'}
          </div>
        </div>`).join('')}
      <button class="reward-change-btn" onclick="resetRewards()">Cambiar mis recompensas</button>`;
  } else {
    card.innerHTML = `
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:3px;color:var(--sage);font-weight:600;margin-bottom:12px">
        Elige tus recompensas
      </div>
      <p class="reward-picker-intro">
        <strong>¿Qué te apetece cuando termines el Pomodoro de hoy?</strong><br>
        Elige 2 o 3. Se desbloquean automáticamente cuando completes al menos un Pomodoro. Sin trampa.
      </p>
      <div class="reward-options">
        ${ALL_REWARDS.map((r, i) => `
          <div class="reward-opt" id="ropt-${i}" data-cat="${r.cat}" onclick="toggleRewardOpt(${i})">
            <span class="reward-opt-icon">${r.icon}</span>
            <span class="reward-opt-txt">${r.name}</span>
          </div>`).join('')}
      </div>
      <button class="reward-save-btn" onclick="saveRewards()">Guardar mis recompensas →</button>`;
  }
}

function toggleRewardOpt(i) {
  const el  = document.getElementById(`ropt-${i}`);
  const idx = selectedRewards.indexOf(i);
  if (idx > -1) { selectedRewards.splice(idx, 1); el.classList.remove('selected'); }
  else if (selectedRewards.length < 3) { selectedRewards.push(i); el.classList.add('selected'); }
}

function saveRewards() {
  if (!selectedRewards.length) return;
  try { localStorage.setItem('vania_rewards', JSON.stringify(selectedRewards)); } catch(e) {}
  renderRewardCard();
}

function resetRewards() {
  selectedRewards = [];
  try { localStorage.removeItem('vania_rewards'); } catch(e) {}
  renderRewardCard();
}

renderRewardCard();
