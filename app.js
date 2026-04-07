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
const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);

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

// ── FECHA Y HÉROE ──
const heroDateEl = document.getElementById('heroDate');
if (heroDateEl) heroDateEl.textContent = `${WD[dow]} ${today.getDate()} de ${MN[today.getMonth()]} de ${today.getFullYear()}`;
const RUBIA_SUBS = [
  "Hoy también.", "Sin excusas.", "Un día más cerca.",
  "El examen no se aprueba solo.", "Vamos.", "Cada día cuenta.",
  "Nadie te quita lo que sabes.", "El Atleti tampoco se rinde.",
  "Nadie pasa sin que yo lo sepa.", // Cypher en español
  "Ningún secreto está a salvo. Ningún movimiento pasa desapercibido.", // Cypher
  "Con información, se gana.", "El router está enchufado.",
];
const subEl = document.getElementById('heroSubfrase');
if (subEl) subEl.textContent = RUBIA_SUBS[dayOfYear % RUBIA_SUBS.length];

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
const artIdx = (dayOfYear - 1) % ARTICLES.length;

function renderArt() {
  const a = ARTICLES[artIdx];
  // Extract just the number for the decorative drawing
  const artNumOnly = a.num.replace('Artículo ', '');
  document.getElementById('artCard').innerHTML = `
    <div class="art-card">
      <div class="art-num-drawing" aria-hidden="true">${artNumOnly}</div>
      <div class="art-num">${a.tag}</div>
      <div class="art-title">${a.title}</div>
      <div class="art-text">${a.text}</div>
      <div class="joke-box">
        <div class="joke-label">Para que no se olvide</div>
        <div class="joke-text">${a.joke}</div>
      </div>
    </div>`;
  // Solo muestra cuál es, sin botones de navegación
  const counter = document.getElementById('artCounter');
  if (counter) counter.textContent = ``; // eyebrow ya lo dice
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
const todayStudyDay    = getStudyDay(today);
const todayWeek        = Math.floor(todayStudyDay / 5);
const wt = WEEK_THEMES[Math.min(tomorrowWeek, WEEK_THEMES.length - 1)];

const DAY_SCHEDULES = {
  1: { // Lunes — hasta las 14:00
    blocks: [
      {time:"9:00",  title:"Ritual de inicio",        desc:"Café, agua, mismo sitio de siempre. Sin móvil encima. Estás lista.", sub:"10 min", dot:"gold"},
      {time:"9:10",  title:"Bloque de teoría — Parte 1", desc:`<strong>#{TITULO}</strong> — #{LEY}`, sub:"Lectura activa · 60 min", dot:"green"},
      {time:"10:10", title:"Descanso",                desc:"Levántate. Estira. Agua. Nada de móvil todavía.", sub:"20 min", dot:"rest"},
      {time:"10:30", title:"Bloque de teoría — Parte 2", desc:"Continúa donde lo dejaste.", sub:"70 min", dot:"green"},
      {time:"11:40", title:"Descanso",                desc:"Móvil 10 minutos. Aire fresco si puedes.", sub:"10 min", dot:"rest"},
      {time:"11:50", title:"Test del día",             desc:"Abre Tests → Test del día. Preguntas del tema. Corrígelo con calma.", sub:"35 min", dot:"blue"},
      {time:"12:25", title:"Descanso",                desc:"Come algo. Desconecta de verdad.", sub:"20 min", dot:"rest"},
      {time:"12:45", title:"Hora del examen",         desc:"15 preguntas mixtas de todo lo estudiado esta semana. Sin mirar nada.", sub:"15 min", dot:"blue"},
      {time:"13:00", title:"Marca el día",             desc:"Ve a Mi Plan y márcalo. Te lo has ganado.", sub:"", dot:"gold"},
    ],
    total: "~4h"
  },
  2: { // Martes — hasta las 14:00
    blocks: [
      {time:"9:00",  title:"Ritual de inicio",        desc:"El mismo de siempre.", sub:"10 min", dot:"gold"},
      {time:"9:10",  title:"Bloque de teoría — Parte 1", desc:`<strong>#{TITULO}</strong> — #{LEY}. Profundiza en los detalles de ayer.`, sub:"70 min", dot:"green"},
      {time:"10:20", title:"Descanso",                desc:"Levántate, estira, agua.", sub:"20 min", dot:"rest"},
      {time:"10:40", title:"Bloque de teoría — Parte 2", desc:"Segundo bloque. Sigue el hilo.", sub:"10 min", dot:"green"},
      {time:"10:50", title:"Test del día",             desc:"Tests → Test del día.", sub:"35 min", dot:"blue"},
      {time:"11:25", title:"Descanso",                desc:"20 minutos libres. De verdad.", sub:"20 min", dot:"rest"},
      {time:"11:45", title:"Bloque de teoría — Parte 3", desc:"Esquema del tema completo. Sin mirar. Lo que no salga: búscalo y anótalo.", sub:"60 min", dot:"green"},
      {time:"12:45", title:"Marca el día",             desc:"Hecho. A por el miércoles.", sub:"", dot:"gold"},
    ],
    total: "~3h 45min"
  },
  3: { // Miércoles — hasta las 14:00
    blocks: [
      {time:"9:00",  title:"Ritual de inicio",        desc:"El de siempre.", sub:"10 min", dot:"gold"},
      {time:"9:10",  title:"Bloque de teoría — Parte 1", desc:`<strong>#{TITULO}</strong> — #{LEY}. Pomodoro: 25+5+25+5+25.`, sub:"85 min", dot:"green"},
      {time:"10:35", title:"Descanso",                desc:"20 minutos. Importante.", sub:"20 min", dot:"rest"},
      {time:"10:55", title:"Mapa mental",              desc:"Dibuja en papel un mapa mental del tema sin mirar nada. Lo que sale de memoria es lo que ya sabes.", sub:"20 min", dot:"green"},
      {time:"11:15", title:"Test del día",             desc:"Tests → Test del día.", sub:"35 min", dot:"blue"},
      {time:"11:50", title:"Descanso",                desc:"20 minutos reales.", sub:"20 min", dot:"rest"},
      {time:"12:10", title:"Bloque de teoría — Parte 2", desc:"Repasa los conceptos del mapa mental que no te salieron. Solo esos.", sub:"35 min", dot:"green"},
      {time:"12:45", title:"Marca el día",             desc:"Tres de tres. Bien.", sub:"", dot:"gold"},
    ],
    total: "~3h 45min"
  },
  4: { // Jueves — hasta las 14:00
    blocks: [
      {time:"9:00",  title:"Ritual de inicio",        desc:"El de siempre.", sub:"10 min", dot:"gold"},
      {time:"9:10",  title:"Bloque de teoría — Parte 1", desc:`<strong>#{TITULO}</strong> — #{LEY}. Ya debería sonar familiar. Hoy repasa lo más difícil.`, sub:"70 min", dot:"green"},
      {time:"10:20", title:"Descanso",                desc:"20 minutos.", sub:"20 min", dot:"rest"},
      {time:"10:40", title:"Bloque de teoría — Parte 2", desc:"Tercer bloque. Consolida lo del día.", sub:"10 min", dot:"green"},
      {time:"10:50", title:"Test del día",             desc:"Tests → Test del día. Cuando corrijas, lee por qué es correcta la respuesta.", sub:"35 min", dot:"blue"},
      {time:"11:25", title:"Descanso",                desc:"20 minutos.", sub:"20 min", dot:"rest"},
      {time:"11:45", title:"Bloque de teoría — Parte 3", desc:"Tercer bloque. Lo que falló en el test: dale una lectura.", sub:"30 min", dot:"green"},
      {time:"12:15", title:"Hora del examen",         desc:"30 preguntas mixtas de todo el temario hasta hoy. Sin mirar nada. Cronometrada.", sub:"30 min", dot:"blue"},
      {time:"12:45", title:"Marca el día",             desc:"Cuatro de cuatro. Rubia.", sub:"", dot:"gold"},
    ],
    total: "~3h 45min"
  },
  5: { // Viernes — hasta las 14:00
    blocks: [
      {time:"9:00",  title:"Ritual de inicio",        desc:"Último día de la semana.", sub:"10 min", dot:"gold"},
      {time:"9:10",  title:"Bloque de teoría — Parte 1", desc:"<strong>#{TITULO}</strong> — #{LEY}.", sub:"60 min", dot:"green"},
      {time:"10:10", title:"Descanso",                desc:"20 minutos.", sub:"20 min", dot:"rest"},
      {time:"10:30", title:"Bloque de teoría — Parte 2", desc:"Continúa donde lo dejaste.", sub:"40 min", dot:"green"},
      {time:"11:10", title:"Test semanal",             desc:"Tests → Test semanal. Mezcla de todo lo de la semana. Cronométrate.", sub:"40 min", dot:"blue"},
      {time:"11:50", title:"Hora del examen",          desc:"30 preguntas mixtas de todo el temario. Sin apuntes, cronometrada.", sub:"30 min", dot:"blue"},
      {time:"12:20", title:"Marca el día",             desc:"Ve a Mi Plan y márcalo. La semana es tuya.", sub:"", dot:"gold"},
    ],
    total: "~3h 40min"
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
      ${previewSched.blocks.map(b => {
        const desc = b.desc.replace('#{TITULO}', previewMap.titulo).replace('#{LEY}', previewMap.ley);
        return `
        <div class="daily-block">
          <div class="db-bar ${b.dot}"></div>
          <div class="db-content">
            <div class="db-time-inline">${b.time}</div>
            <div class="db-body">
              <div class="db-title">${b.title}</div>
              <div class="db-desc">${desc}</div>
              ${b.sub ? `<div class="db-sub">${b.sub}</div>` : ''}
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div class="daily-footer">
      <span>Terminas antes de mediodía 🌿</span>
      <span class="df-total">${previewSched.total}</span>
    </div>`;

  dailyEl.appendChild(previewDc);
} else if (isWeekend) {
  const findeMsg = dow === 6 ? [
    { title: "Sábado.", sub: "El temario no te echa de menos. Tómatelo con calma." },
    { title: "Hoy no.", sub: "El cerebro también necesita apagar el wifi. Y la Spycam." },
    { title: "Para. Respira.", sub: "Mañana es domingo y pasado vuelves. Hoy no existe el BOE." },
    { title: "Sábado sagrado.", sub: "Ni un artículo. Ni uno. Si hay partido del Atleti, mejor plan imposible." },
    { title: "Neural Theft desactivado.", sub: "Hoy no procesas info. Hoy descansas. Órdenes de Cypher. 🕵️" },
    { title: "Día libre.", sub: "Si el Madrid perdió esta semana: karma confirmado. Si ganó: el examen lo compensa. 😈" },
  ] : [
    { title: "Domingo, Rubia.", sub: "Descansa. Mañana arrancas de nuevo y lo vas a petar." },
    { title: "El plan puede esperar.", sub: "Tú no. Disfruta el día. El temario sigue ahí mañana." },
    { title: "Cero temario hoy.", sub: "Ni lo pienses. El descanso es parte del entrenamiento. Como el descanso entre trampas de Cypher." },
    { title: "Domingo means freedom.", sub: "La Constitución puede esperar hasta el lunes. El Atleti no. Si hay partido, prioritario. 🔴⚪" },
    { title: "Ningún secreto está a salvo.", sub: "Excepto el tuyo: que hoy no estudias y está perfectamente bien. — Cypher 🕵️" },
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
  const studyDayNum = dow >= 1 && dow <= 5 ? dow - 1 : -1; // L=0, M=1, X=2, J=3, V=4
  const todayMapEntry = (studyDayNum >= 0 && DAILY_MAP[todayWeek]) ? DAILY_MAP[todayWeek][studyDayNum] : null;
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
      ${sched.blocks.map(b => {
        const desc = b.desc.replace('#{TITULO}', dayTitle).replace('#{LEY}', dayLey);
        return `
        <div class="daily-block">
          <div class="db-bar ${b.dot || 'rest'}"></div>
          <div class="db-content${b.dot === 'rest' ? ' is-rest' : ''}">
            <div class="db-time-inline">${b.time}</div>
            <div class="db-body">
              <div class="db-title">${b.title}</div>
              <div class="db-desc">${desc}</div>
              ${b.sub ? `<div class="db-sub">${b.sub}</div>` : ''}
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div class="daily-footer">
      <span>Terminas antes de mediodía 🌿</span>
      <span class="df-total">${sched.total}</span>
    </div>`;
  dailyEl.appendChild(dc);


}

// ── TESTS ──
// Mapear el título del día actual al tema de preguntas correspondiente
function getTemaFromTitulo(titulo) {
  if (!titulo) return null;
  const t = titulo.toLowerCase();
  if (t.includes('ce —') || t.includes('constitución') || t.startsWith('ce ')) return 'Constitución';
  if (t.includes('código penal') || t.startsWith('cp —')) return 'Código Penal';
  if (t.includes('lo 4/15')) return 'LO 4/15 — Seg. Ciudadana';
  if (t.includes('lo 2/86')) return 'LO 2/86 — Modelo Policial';
  if (t.includes('tráfico') || t.includes('rgc') || t.includes('lsv') || t.includes('alcoholemia') || t.includes('infracciones de tráfico')) return 'Tráfico y Circulación';
  if (t.includes('taxi')) return 'Ordenanza Taxi';
  if (t.includes('oms') || t.includes('movilidad sostenible')) return 'Ordenanza Movilidad';
  if (t.includes('decreto 210') || t.includes('reglamento marco') || t.includes('reglamento cuerpo pm') || t.includes('régimen disciplinario')) return 'Reglamento PM y Marco';
  if (t.includes('lo 4/00') || t.includes('extranjería')) return 'Derechos Extranjeros';
  if (t.includes('violencia de género') || t.includes('lo 1/04') || t.includes('ley 27/03')) return 'Violencia de Género';
  if (t.includes('igualdad') || t.includes('lo 3/07') || t.includes('lgtbi')) return 'Igualdad';
  if (t.includes('prl') || t.includes('ley 31/95') || t.includes('prevención')) return 'PRL';
  if (t.includes('capitalidad') || t.includes('distritos') || t.includes('lbrl') || t.includes('ley 7/85') || t.includes('ley 22/2006') || t.includes('estatuto autonomía')) return 'Admin. Local y Madrid';
  // Para días sin preguntas específicas (repaso, simulacro, etc.) usar Constitución como fallback
  return 'Constitución';
}
const studyDayNum4Test = dow >= 1 && dow <= 5 ? dow - 1 : -1;
const todayMapEntry4Test = studyDayNum4Test >= 0 && DAILY_MAP[todayWeek] ? DAILY_MAP[todayWeek][studyDayNum4Test] : null;
const temaDelDia = getTemaFromTitulo(todayMapEntry4Test?.titulo) || 'Constitución';
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

// ── BLOQUEO POR HORA ──
// Horas de desbloqueo según horario real (L=1,M=2,X=3,J=4,V=5)
const TEST_UNLOCK_HOURS = { 1: 11*60+50, 2: 10*60+50, 3: 11*60+15, 4: 10*60+50, 5: 9*60+40 };
const nowMinutes = today.getHours() * 60 + today.getMinutes();
const unlockMinutes = TEST_UNLOCK_HOURS[dow] || 11*60;
const testDailyUnlocked = planStarted && !isWeekend;
const testWeeklyUnlocked = dow === 5; // Solo viernes

function buildLockedTest(containerId, title, reason) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = `
    <div class="test-container">
      <div class="test-locked-msg">
        <div class="test-locked-icon">🔒</div>
        <div class="test-locked-title">${title}</div>
        <div class="test-locked-sub">${reason}</div>
      </div>
    </div>`;
}

if (testDailyUnlocked) {
  buildTest(dailyQs, 'test-daily', `Test del día · ${temaDelDia}`);
} else if (planStarted && !isWeekend) {
  const h = Math.floor(unlockMinutes / 60);
  const m = String(unlockMinutes % 60).padStart(2,'0');
  buildLockedTest('test-daily', 'Test del día', `Disponible a las ${h}:${m}. Termina la teoría primero, Rubia.`);
} else {
  buildTest(dailyQs, 'test-daily', `Test del día · ${temaDelDia}`);
}

if (testWeeklyUnlocked) {
  buildTest(weekQs, 'test-week', 'Test semanal · Repaso completo');
} else if (dow === 5) {
  buildLockedTest('test-week', 'Test semanal', 'Disponible a las 9:40. Primero el repaso de la semana.');
} else {
  const diasParaViernes = (5 - dow + 7) % 7 || 7;
  const pluralDias = diasParaViernes === 1 ? 'día' : 'días';
  buildLockedTest('test-week', 'Test semanal', `Solo los viernes. Quedan ${diasParaViernes} ${pluralDias}.`);
}

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

// Inicializar — todos los paneles de test ocultos excepto el activo
['test-daily','test-week','test-sabado','repaso-list','test-repaso-container'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
});
// Mostrar test del día por defecto
const defaultPanel = document.getElementById('test-daily');
if (defaultPanel) defaultPanel.style.display = 'block';

// Inicializar repaso en segundo plano sin mostrarlo
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
    const dayLabelsShort = ['L','M','X','J','V'];
    const dayLabelsLong = ['Lunes','Martes','Miércoles','Jueves','Viernes'];
    const weekDayDetails = globalWeekIdx < DAILY_MAP.length
      ? DAILY_MAP[globalWeekIdx].map((d, di) => `
          <div class="week-day-detail">
            <span class="week-day-letter">${dayLabelsShort[di]}</span>
            <span class="week-day-topic">${d.titulo}</span>
            <span class="week-day-ley">${d.ley}</span>
          </div>`).join('')
      : '';

    const weekMapForPrep = DAILY_MAP[globalWeekIdx] || [];
    const prepLaws = [...new Set(weekMapForPrep.map(d => d.ley))];
    const prepLawsHtml = prepLaws.map(l => `<div class="week-prep-item">${l}</div>`).join('');

    wr.innerHTML = `
      <div class="week-label">${week.n}</div>
      <div class="week-topic">${week.t}</div>
      <div class="week-day-blocks" id="dg-${month.id}-${wi}"></div>
      <div class="week-prep-strip">
        <div class="week-prep-strip-label">📂 Prepara estos apuntes</div>
        ${prepLawsHtml}
      </div>`;
    body.appendChild(wr);

    const grid = wr.querySelector(`#dg-${month.id}-${wi}`);
    const studyDays = ['L','M','X','J','V'];
    studyDays.forEach((d, studyDayIdx) => {
      const di = ['L','M','X','J','V','S','D'].indexOf(d);
      const key = `${month.id}-${wi}-${di}`;
      const isDone = doneDays[key];
      const dailyInfo = DAILY_MAP[globalWeekIdx] ? DAILY_MAP[globalWeekIdx][studyDayIdx] : null;
      if (!dailyInfo) return;

      const dayNames = ['Lunes','Martes','Miércoles','Jueves','Viernes'];
      const block = document.createElement('div');
      block.className = 'day-block' + (isDone ? ' done' : '');
      block.dataset.key = key;
      block.dataset.weekIdx = globalWeekIdx;
      block.dataset.dayIdx = studyDayIdx;
      block.dataset.dayLetter = d;
      block.innerHTML = `
        <div class="day-block-left">
          <div class="day-block-letter">${d}</div>
          <div class="day-block-dayname">${dayNames[studyDayIdx]}</div>
        </div>
        <div class="day-block-body">
          <div class="day-block-titulo">${dailyInfo.titulo}</div>
          <div class="day-block-ley">${dailyInfo.ley}</div>
        </div>
        <div class="day-block-check">✓</div>`;

      block.onclick = () => {
        if (doneDays[key]) {
          showDayDetail(block, dailyInfo, true, d, globalWeekIdx);
        } else {
          toggleDay(block, key);
          block.classList.add('done');
        }
      };

      grid.appendChild(block);
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
          Ver apuntes
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

function showToast(msg) {
  const existing = document.getElementById('vania-toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.id = 'vania-toast';
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a2e1a;color:#ede4cc;padding:10px 22px;border-radius:100px;font-family:"DM Sans",sans-serif;font-size:13px;font-weight:500;z-index:999;box-shadow:0 4px 20px rgba(0,0,0,.25);animation:fadeUp .3s ease;letter-spacing:.3px;white-space:nowrap;';
  document.body.appendChild(t);
  setTimeout(() => t.style.opacity = '0', 2200);
  setTimeout(() => t.remove(), 2600);
}

function toggleM(head) {
  const id = head.closest('.month-block').querySelector('[id^="mb-"]').id.split('-')[1];
  head.querySelector('.m-chev').classList.toggle('open');
  document.getElementById(`mb-${id}`).classList.toggle('open');
}

const DONE_MSGS = [
  "Otro día en el saco. Que no se te olvide que esto se gana así, uno a uno.",
  "Marcado. Ahora no lo borres porque 'total tampoco estudié mucho'. Sí estudiaste.",
  "Un día más. El examen no sabe que hoy no te apetecía. Pero tú apareciste igual.",
  "Lo tienes. Ahora no empieces a pensar en lo que te queda. Hoy está hecho.",
  "Día cerrado. Sin drama, sin medalla. Mañana más.",
  "Ningún secreto está a salvo. Ningún movimiento pasa desapercibido. — Cypher. Y tú tampoco te escapas del temario.",
  "Marcado. El Atleti ha ganado partidos con peor inicio que tu mañana. Sigue.",
  "Eso es. Sin esperar aplausos. Así es como funciona esto.",
  "Día hecho. Cypher no falla en la info. Tú tampoco en el plan. 🕵️",
  "Suma y sigue, Rubia.",
  "Marcado. Y si el Madrid ganó anoche, que te dé fuerzas para hundir el examen. 😈",
];
function toggleDay(cell, key) {
  const wasDone = doneDays[key];
  doneDays[key] = !doneDays[key];
  try { localStorage.setItem('vania_days', JSON.stringify(doneDays)); } catch(e) {}
  // Update block visual
  const blockEl = document.querySelector(`[data-key="${key}"]`);
  if (blockEl) blockEl.classList.toggle('done', doneDays[key]);
  if (doneDays[key] && !wasDone) {
    showRewardPopup();
  }
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
  // +9 días que llevaba antes de que arrancara el plan digital
  const RACHA_OFFSET = 9;
  document.getElementById('pRacha').textContent      = r + RACHA_OFFSET;
  // Update new hero racha display
  const rachaNumEl = document.getElementById('rachaBadgeNum');
  if (rachaNumEl) rachaNumEl.textContent = r + RACHA_OFFSET;
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

// ── POPUP DE RECOMPENSA (se muestra al marcar el día) ──
const SARAH_PARAGRAPHS = [
    "Rubia. Lo has hecho.",
    "¿Ves? Sabía yo que podías.",
    "Otro día. Otro tick. Así se aprueba esto.",
    "Sin excusas. Sin dramas. Solo tú y el temario, y ganaste tú.",
    "Me alegra tanto esto que no sabes.",
    "Oye. Para. Respira. Lo acabas de hacer.",
    "Te lo dije. Y tú me dijiste que no podías. Aquí estamos.",
    "Hoy has ganado. Sin más.",
    "Bien hecho. En serio. Bien hecho.",
    "No necesito decirte nada más. El día está cerrado.",
    "¿Sabes lo que acabas de hacer? Aparecer. Eso es todo lo que se pedía.",
    "Estoy orgullosa. De verdad.",
    "Cada día que haces esto me alegra más habértelo propuesto.",
    "Otro día que nadie te quita.",
    "Lo conseguiste. Como siempre que te lo propones.",
    "Te bloqueas, lloras, y luego lo haces. Siempre. Hoy también.",
    "¿Recuerdas cuando decías que no ibas a poder? Mira.",
    "Dijiste que no podías. El calendario dice que sí.",
    "Eres de las que lloran y luego arrasan. Hoy has arrasado.",
    "La que se bloquea pero no se rinde. Eso eres tú.",
    "Cuántas veces me has dicho que no podías. Cuántas veces has podido.",
    "Ya sé que antes de empezar pensabas que no ibas a llegar. Y has llegado.",
    "Siempre igual: drama al principio, victoria al final.",
    "Lloras, te bloqueas, y después lo consigues todo. Hoy también.",
    "Podría apostar por ti con los ojos cerrados. Y ganaría.",
    "No te voy a decir que fue fácil. Pero lo has hecho igual.",
    "Hoy no te apetecía. Lo sé. Y aun así.",
    "No hace falta que me digas nada. Sé lo que ha costado.",
    "El temario no se aprueba de golpe. Se aprueba así. Día a día.",
    "Suma y sigue. Eso es todo.",
    "Un día más. El examen tiene cada vez menos preguntas que darte.",
    "Hoy has hecho lo que tocaba. Eso es suficiente.",
    "Lo estás consiguiendo. Aunque no lo parezca, lo estás consiguiendo.",
    "No todo el mundo llega hasta aquí. Tú sí.",
    "Hay días que no te apetece nada. Y aun así abres el temario. Eso es carácter.",
    "No necesitas motivación. Tienes algo mejor: constancia.",
    "Te lo mereces todo hoy.",
    "Descansa. De verdad. Te lo has ganado.",
    "Ahora a desconectar. Sin culpa, sin remordimientos.",
    "El resto del día es tuyo. Entera.",
    "Para ya. Disfruta. Hoy lo mereces.",
    "Apaga el modo estudio. Ya.",
    "Come lo que te apetezca. Sal si quieres. Haz lo que te dé la gana.",
    "Hoy no existe el BOE. Solo tú disfrutando.",
    "El temario puede esperar hasta mañana. Tú no.",
    "Nada de pensar en lo que queda. Hoy ya está.",
    "Un tick más en el calendario. No lo borres.",
    "Otro día que no puedes tacharte de la lista de las que no estudian.",
    "Hoy eras tú contra el temario. Has ganado tú.",
    "El examen no sabe lo que le espera.",
    "En septiembre esto va a tener sentido. Ya lo verás.",
    "Cada día de estos es un paso. Hoy has dado el tuyo.",
    "Esto se gana exactamente así. Sin más secreto.",
    "No hay atajo. Hay esto. Y tú lo estás haciendo.",
    "Nadie te regala nada. Tú tampoco te lo estás regalando. Lo estás ganando.",
    "Lo que has hecho hoy tiene un nombre: trabajo. Y da sus frutos.",
    "Confía. Aunque ahora no lo veas, está pasando.",
    "No siempre se siente el progreso. Pero está ahí.",
    "Hoy has invertido en ti. Eso no se pierde.",
    "Nadie te quita lo que sabes. Nadie.",
    "Todo lo que has aprendido hoy es tuyo para siempre.",
    "La diferencia entre las que aprueban y las que no es lo que tú estás haciendo ahora.",
    "Tú sí. Eso es todo lo que hay que decir.",
    "Hoy te has ganado el derecho a no pensar en nada más.",
    "Venga. Ahora a vivir un rato.",
    "Llama a alguien. Sal. Haz algo que te apetezca de verdad.",
    "Mereces una tarde buena. Ve a por ella.",
    "Date un capricho. Uno de los buenos.",
    "Descansa bien esta noche. El cerebro también lo necesita.",
    "Hoy has dado todo lo que tenías. Eso es más que suficiente.",
    "No le pidas más a un día. Este ya ha dado lo que tenía que dar.",
    "Cierra el temario. Ya no lo toques hasta mañana.",
    "Poquito a poco. Pero hacia adelante siempre.",
    "Hoy ha sido un buen día. Aunque no lo haya parecido.",
    "No siempre es fácil empezar. Pero tú empezaste. Y acabaste.",
    "No necesitas que nadie te diga que puedes. Ya lo has demostrado tú sola.",
    "Hoy has sido más fuerte que las ganas de no hacer nada.",
    "Ganaste tú. Al sofá, a las excusas, al 'ya lo hago luego'. Ganaste tú.",
    "No me vengas con que no puedes. Llevo semanas viendo que puedes.",
    "Tengo razón yo, como siempre. Podías.",
    "¿Ves? Otra vez tenía razón.",
    "Como siempre: yo decía que sí y tú que no. Y mira.",
    "Voy a apuntar esto: 'Sarah tenía razón. Otra vez.'",
    "No me sorprende. Nunca me sorprende cuando lo haces.",
    "Ya sabía yo que ibas a poder. Siempre lo sé.",
    "Lo sabía. Lo supe desde el primer día.",
    "Te conozco mejor que tú a ti misma. Por eso sé que vas a llegar.",
    "Lo que más me gusta de ti es que siempre acabas consiguiendo lo que te propones.",
    "Siempre igual. Dudas, te agobias, y luego lo haces mejor que nadie.",
    "No siempre tienes que sentirte bien para hacer las cosas bien. Hoy es prueba de eso.",
    "Los días difíciles valen el doble. Hoy ha sido uno de esos.",
    "Cuando no te apetece y lo haces de todas formas, eso es lo que marca la diferencia.",
    "El examen no sabe que hoy no te apetecía. Solo sabe que estudiaste.",
    "No todo el mundo tiene lo que tú tienes. No lo dudes.",
    "Tienes más cabeza que nadie cuando te la pones a funcionar.",
    "Cuando quieres, no hay quien te pare. Hoy has querido.",
    "Hoy es un día más que te separa del examen con trabajo detrás.",
    "Voy a estar ahí cuando apruebes. Y voy a acordarme de todos estos días.",
    "Verás cómo en septiembre todo esto tiene sentido.",
    "Cuando apruebes, que vas a aprobar, me acuerdo de este día.",
    "Estoy aquí. Siempre estoy aquí.",
    "No estás sola en esto. Que conste.",
    "Oye. Lo estás haciendo muy bien. Que sepas.",
    "Solo quería decirte que estoy muy orgullosa.",
    "De verdad que me alegra mucho esto.",
    "Me hace feliz esto. En serio.",
    "Te mereces todo lo bueno.",
    "Sé lo que está costando. Y por eso me alegra más.",
    "No tienes ni idea de lo bien que lo estás haciendo.",
    "Confío en ti más de lo que tú confías en ti misma. Y tengo razón.",
    "Tú puedes. Ya lo sé yo. Ahora tienes que saberlo tú.",
    "No lo dudes. En serio. No lo dudes.",
    "Eres más de lo que crees.",
    "Tienes mucho más de lo que necesitas para pasar esto.",
    "Vales muchísimo. Y el examen lo va a notar.",
    "Rubia, estás hecha para esto.",
    "Listo. Día cerrado. A otra cosa.",
    "Hecho. Siguiente.",
    "Un día más. Siguiente.",
    "Tick. Siguiente.",
    "Ya. Hecho. Bien.",
    "Sí. Eso. Exactamente eso.",
    "Muy bien, Rubia.",
    "Un día más que es tuyo.",
    "Ya es tuyo. Nadie te lo quita.",
    "Este día ya es tuyo para siempre.",
    "Todo va sumando.",
    "Todo cuenta. Hoy también.",
    "El trabajo siempre da sus frutos. Siempre.",
    "Confía. Solo confía.",
    "Tú y yo sabemos que puedes. Eso no cambia.",
    "Vamos las dos en esto. No lo olvides.",
    "Ni se te ocurra parar ahora.",
    "Estás más cerca de lo que crees.",
    "Cada día más cerca.",
    "Ya queda menos.",
    "Un día menos para el examen. Un día más de trabajo tuyo.",
    "Hasta el final. Y tú vas a llegar.",
    "Vas a llegar. Lo sé.",
    "Vas a aprobar. Lo sé.",
    "Lo vas a conseguir. Lo sé.",
    "Yo en ti. Siempre.",
];

function showRewardPopup() {
  const popup = document.getElementById('rewardPopup');
  const box = document.getElementById('rewardPopupBox');
  if (!popup || !box) return;
  const msg = SARAH_PARAGRAPHS[dayOfYear % SARAH_PARAGRAPHS.length];
  box.innerHTML = `
    <div class="reward-popup-header">
      <span class="reward-popup-label">Un momento, antes de irte</span>
      <button class="reward-popup-close" onclick="document.getElementById('rewardPopup').style.display='none'">✕</button>
    </div>
    <div class="reward-popup-text">${msg}</div>
    <div class="reward-popup-sign">— Sarah</div>`;
  popup.style.display = 'flex';
}

// Mostrar card de recompensa en Tests tab (siempre visible, sin bloqueo)
function renderRewardCard() {
  const card = document.getElementById('rewardCard');
  if (!card) return;
  const msg = SARAH_PARAGRAPHS[dayOfYear % SARAH_PARAGRAPHS.length];
  card.innerHTML = `
    <div class="reward-para-card">
      <div class="reward-para-label">Un momento, antes de irte</div>
      <div class="reward-para-text">${msg}</div>
      <div class="reward-para-sign">— Sarah</div>
    </div>`;
}

renderRewardCard();
