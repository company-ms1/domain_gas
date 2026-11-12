import * as THREE from '../vendor/three.module.min.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MINT = 0x9df0cc, RED = 0xff6b78, TEAL = 0x26a17b, AMBER = 0xffc46b;

/* =====================================================================
   i18n — Russian lives in the HTML, English below.
   ===================================================================== */
const EN = {
  'meta.title': 'Check & Prepare a USDT transfer — how it works | GasFree4you',
  'nav.badge': 'TRANSFER CHECK', 'nav.how': 'How it works', 'nav.try': 'Try it', 'nav.who': 'Who it’s for', 'nav.faq': 'FAQ', 'nav.cta': 'Get access',
  'hero.eyebrow': 'NEW METHOD · CHECK & PREPARE A TRANSFER',
  'hero.title': 'Ask before you send.<br><em>Then just send.</em>',
  'hero.lead': 'You pass two addresses — sender and recipient. We answer with one word: <b class="ok">READY</b> or <b class="stop">STOP</b>. If it’s ready, you send USDT the way you always do — no TRX, no Energy, no network fees to think about.',
  'stage.hint': 'Click any participant in the 3D scene — or pick one below',
  'stage.nogl': '3D isn’t available in this browser — but the check below still works.',
  'console.title': 'Method response', 'console.from': 'Sender', 'console.to': 'Recipient',
  'check.sanctions': 'Sanctions lists', 'check.risk': 'Other stop factors', 'check.prep': 'Network prepared for the transfer',
  'stage.who': '1 · Who is sending', 'stage.to': '2 · Sending to', 'stage.run': 'Check & send',
  'actor.app': 'Your app', 'actor.wallet': 'Wallet', 'actor.script': 'Script / bot', 'actor.bank': 'Bank / PSP', 'actor.tronlink': 'TronLink', 'actor.exchange': 'Exchange',
  'recip.clean': 'Regular address', 'recip.sanctioned': 'On a sanctions list', 'recip.risk': 'Other stop factor',
  'how.eyebrow': 'HOW IT WORKS', 'how.title': 'Three steps. <em>Only one of them is ours.</em>',
  'step1.t': 'Ask', 'step1.p': 'Your app, wallet, script or bank sends us the sender address and the recipient address. Nothing else — no keys, no signatures.', 'step1.who': 'YOU',
  'step2.t': 'Get an answer', 'step2.p': 'We screen the recipient against sanctions lists and other stop factors. If it’s clean, we prepare the network for the transfer right away. The answer is <b class="ok">READY</b> or <b class="stop">STOP</b>.', 'step2.who': 'US',
  'step3.t': 'Send', 'step3.p': 'Got READY? Send USDT the usual way. The network fee is already covered — no TRX needed in the wallet.', 'step3.who': 'YOU',
  'ans.eyebrow': 'TWO ANSWERS. THAT’S IT', 'ans.title': 'No “maybe”.',
  'ans.ok.t': 'READY', 'ans.ok.sub': 'Transfer allowed and prepared', 'ans.ok.l1': 'Recipient is clean', 'ans.ok.l2': 'Network is prepared for the transfer', 'ans.ok.l3': 'You can send right now', 'ans.ok.next': '→ You send the USDT',
  'ans.stop.t': 'STOP', 'ans.stop.sub': 'Recipient is on a sanctions list, or another stop factor was found', 'ans.stop.l1': 'Transfer is not prepared', 'ans.stop.l2': 'Nothing gets sent', 'ans.stop.l3': 'The USDT stays with you', 'ans.stop.next': '→ Show your user a clear message',
  'user.eyebrow': 'THROUGH YOUR USER’S EYES', 'user.title': 'For a person, it’s <em>one extra second.</em>',
  'user.p': 'Your user never sees Energy, TRX or screening. They see an address, an amount and a “Send” button. Everything else happens while the spinner turns.',
  'user.mode.ok': 'Regular recipient', 'user.mode.stop': 'Sanctioned recipient',
  'user.s1': 'Enters address and amount', 'user.s2': 'Your app asks us', 'user.s3': 'Gets the answer', 'user.s4': 'Sends — or sees why it can’t',
  'ph.send': 'Send USDT', 'ph.to': 'To', 'ph.amount': 'Amount', 'ph.continue': 'Continue', 'ph.checking': 'Checking recipient…',
  'ph.ready': 'Ready to send', 'ph.fee': 'Network fee', 'ph.feeval': 'already prepared', 'ph.notrx': 'not needed', 'ph.sendbtn': 'Send',
  'ph.blocked': 'Transfer not possible', 'ph.blockedp': 'This recipient is on a sanctions list. Your funds stayed in your account.', 'ph.ok': 'Got it',
  'ph.sent': 'Sent', 'ph.sentp': '250 USDT delivered. With zero TRX in the wallet.',
  'ba.eyebrow': 'BEFORE / AFTER', 'ba.title': 'Everything you can <em>stop thinking about</em>', 'ba.before': 'Without the method', 'ba.after': 'With the method',
  'ba.b1': 'Keep TRX on every wallet', 'ba.b2': 'Calculate Energy and bandwidth for each transfer', 'ba.b3': 'Rent or stake Energy separately', 'ba.b4': 'Screen recipients against sanctions separately', 'ba.b5': 'Investigate transactions that failed for lack of resources',
  'ba.a1': 'One question before sending', 'ba.a2': '<b class="ok">READY</b> → you send', 'ba.a3': '<b class="stop">STOP</b> → you don’t',
  'who.eyebrow': 'WHO IT’S FOR', 'who.title': 'Anyone who sends <em>USDT on TRON</em>',
  'who.p': 'The method isn’t tied to any one app. Whoever is sending simply asks, gets an answer, and sends on their own. Click a card to see that scenario in 3D.',
  'who.app': 'Add the question right before the “Send” button.', 'who.wallet': 'Users send USDT even with zero TRX in the balance.', 'who.script': 'Payouts and automations: one question before every transaction.',
  'who.bank': 'Screen the recipient and prepare the transfer before a client payment goes out.', 'who.tronlink': 'Prepare it — then sign in the wallet you already use.', 'who.exchange': 'Customer withdrawals without managing Energy on hot wallets.',
  'b.eyebrow': 'BOUNDARIES', 'b.title': 'Your money stays <em>in your hands.</em>',
  'b1.t': 'Keys stay with you', 'b1.p': 'We never ask for private keys or seed phrases. Ever. We only need two public addresses.',
  'b2.t': 'Signing stays with you', 'b2.p': 'Your app, script or bank signs and sends the transaction — not us.',
  'b3.t': 'Funds stay with you', 'b3.p': 'We don’t receive or forward your USDT. We answer “yes or no” and prepare the network for the transfer.',
  'faq.eyebrow': 'FAQ', 'faq.title': 'The short version',
  'q1': 'Do I need to change my app or wallet?', 'a1': 'No. You add one question before sending. Everything else works as before — same app, script or banking system.',
  'q2': 'What does “transfer prepared” mean?', 'a2': 'We provide the TRON network resources a USDT transfer needs in advance. So you don’t have to hold TRX for fees, and the transaction won’t fail for lack of Energy.',
  'q3': 'What if the answer is STOP?', 'a3': 'Don’t send. The transfer isn’t prepared and the funds stay with the sender. Best practice is to show the user a clear message that this address can’t receive the transfer.',
  'q4': 'Can you see my money or keys?', 'a4': 'No. We only need two public addresses. Signing and sending is always on your side.',
  'q5': 'How do I connect?', 'a5': 'Write to us — we’ll help you connect the method for your scenario and transfer volume.',
  'cta.title': 'Add one question <em>before you send.</em>', 'cta.p': 'The rest — sanctions screening, Energy, TRX for fees — is on us.', 'cta.btn': 'Discuss integration', 'cta.docs': 'API docs →',
  'f.terms': 'Terms', 'f.privacy': 'Privacy',
};

const DYN = {
  ru: {
    'core.sub': 'проверка + подготовка', sender: 'отправитель', recipient: 'получатель',
    packet: '2 адреса →', ready: 'ГОТОВО ✓', stop: 'СТОП ✕',
    recipOk: '+250 USDT · 0 TRX', recipStop: 'перевод заблокирован',
    wait: 'ожидание', run: 'проверяем…', ok: 'чисто', fail: 'совпадение', skip: 'не выполняется', prepRun: 'готовим…', prepOk: 'готово',
    idleT: 'Ждём вопрос', idleB: 'Выберите, кто отправляет и кому, затем нажмите «Проверить и отправить».',
    busyT: 'Проверяем получателя…', busyB: 'Это занимает доли секунды — здесь замедлено, чтобы было видно.',
    okT: 'ГОТОВО — перевод разрешён и подготовлен', okB: 'Можно отправлять. TRX и энергия на комиссию не нужны — сеть уже подготовлена.',
    sentT: 'Отправлено: 250 USDT', sentB: a => `Перевод отправил участник «${a}» — своим обычным способом. Мы не касались средств.`,
    stopST: 'СТОП — получатель в санкционном списке', stopRT: 'СТОП — найден стоп-фактор по получателю',
    stopB: 'Перевод не подготовлен и не отправляется. USDT остаются у отправителя.',
    again: 'Запустить ещё раз', hover: 'нажмите, чтобы выбрать',
  },
  en: {
    'core.sub': 'check + prepare', sender: 'sender', recipient: 'recipient',
    packet: '2 addresses →', ready: 'READY ✓', stop: 'STOP ✕',
    recipOk: '+250 USDT · 0 TRX', recipStop: 'transfer blocked',
    wait: 'waiting', run: 'checking…', ok: 'clear', fail: 'match', skip: 'not run', prepRun: 'preparing…', prepOk: 'done',
    idleT: 'Waiting for a question', idleB: 'Choose who is sending and to whom, then press “Check & send”.',
    busyT: 'Checking the recipient…', busyB: 'This takes a fraction of a second — slowed down here so you can see it.',
    okT: 'READY — transfer allowed and prepared', okB: 'Go ahead and send. No TRX or Energy needed for fees — the network is already prepared.',
    sentT: 'Sent: 250 USDT', sentB: a => `“${a}” sent the transfer the way it always does. We never touched the funds.`,
    stopST: 'STOP — recipient is on a sanctions list', stopRT: 'STOP — a stop factor was found for the recipient',
    stopB: 'The transfer is not prepared and is not sent. The USDT stays with the sender.',
    again: 'Run again', hover: 'click to select',
  },
};

const RU = {};
$$('[data-i18n]').forEach(el => { RU[el.dataset.i18n] = el.innerHTML; });
let lang = (() => {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'en' || q === 'ru') return q;
  try { const s = localStorage.getItem('gf4u-lang'); if (s === 'en' || s === 'ru') return s; } catch (e) {}
  return (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en';
})();
const t = k => (lang === 'en' ? EN : RU)[k] ?? RU[k] ?? k;
const d = k => DYN[lang][k];

function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  $$('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (v != null) el.innerHTML = v; });
  document.title = t('meta.title');
  $$('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  try { localStorage.setItem('gf4u-lang', l); } catch (e) {}
  refreshDynamic();
}
$$('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

/* =====================================================================
   Icons drawn on canvas (used for 3D faces and the "who" cards)
   ===================================================================== */
function drawIcon(ctx, kind, S, color = '#9df0cc') {
  ctx.save();
  if (!ctx.roundRect) ctx.roundRect = function (x, y, w, h) { this.rect(x, y, w, h); };
  ctx.strokeStyle = color; ctx.fillStyle = color;
  ctx.lineWidth = S * 0.045; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
  const c = S / 2;
  switch (kind) {
    case 'app':
      rr(S * .3, S * .14, S * .4, S * .72, S * .07); ctx.stroke();
      for (let i = 0; i < 3; i++) { rr(S * .37, S * (.28 + i * .11), S * .26, S * .055, S * .02); ctx.globalAlpha = .55; ctx.fill(); ctx.globalAlpha = 1; }
      rr(S * .37, S * .66, S * .26, S * .08, S * .03); ctx.fill();
      break;
    case 'wallet':
      rr(S * .16, S * .28, S * .68, S * .48, S * .07); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(S * .22, S * .28); ctx.lineTo(S * .62, S * .18); ctx.lineTo(S * .66, S * .28); ctx.stroke();
      rr(S * .56, S * .44, S * .28, S * .16, S * .05); ctx.stroke();
      ctx.beginPath(); ctx.arc(S * .65, S * .52, S * .025, 0, 7); ctx.fill();
      break;
    case 'script':
      rr(S * .14, S * .2, S * .72, S * .6, S * .06); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(S * .14, S * .32); ctx.lineTo(S * .86, S * .32); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(S * .27, S * .45); ctx.lineTo(S * .37, S * .54); ctx.lineTo(S * .27, S * .63); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(S * .44, S * .65); ctx.lineTo(S * .62, S * .65); ctx.stroke();
      break;
    case 'bank':
      ctx.beginPath(); ctx.moveTo(S * .14, S * .38); ctx.lineTo(c, S * .17); ctx.lineTo(S * .86, S * .38); ctx.closePath(); ctx.stroke();
      for (let i = 0; i < 4; i++) { const x = S * (.24 + i * .173); ctx.beginPath(); ctx.moveTo(x, S * .46); ctx.lineTo(x, S * .7); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(S * .14, S * .8); ctx.lineTo(S * .86, S * .8); ctx.stroke();
      break;
    case 'tronlink':
      rr(S * .2, S * .22, S * .6, S * .56, S * .1); ctx.stroke();
      ctx.beginPath(); ctx.arc(S * .42, S * .5, S * .09, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(S * .51, S * .5); ctx.lineTo(S * .68, S * .5); ctx.moveTo(S * .62, S * .5); ctx.lineTo(S * .62, S * .58); ctx.stroke();
      break;
    case 'exchange':
      ctx.beginPath(); ctx.arc(c, c, S * .27, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(S * .7, S * .27); ctx.lineTo(S * .73, S * .38); ctx.lineTo(S * .62, S * .39); ctx.stroke();
      ctx.beginPath(); ctx.arc(c, c, S * .27, Math.PI * .1, Math.PI * .9); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(S * .3, S * .73); ctx.lineTo(S * .27, S * .62); ctx.lineTo(S * .38, S * .61); ctx.stroke();
      ctx.font = `700 ${S * .2}px ui-sans-serif,sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('₮', c, c + S * .01);
      break;
    case 'person':
      ctx.beginPath(); ctx.arc(c, S * .38, S * .12, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.arc(c, S * .86, S * .26, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      break;
  }
  ctx.restore();
}
function iconCanvas(kind, S = 256, color) {
  const cv = document.createElement('canvas'); cv.width = cv.height = S;
  drawIcon(cv.getContext('2d'), kind, S, color); return cv;
}
$$('.who-ico').forEach(el => { el.style.backgroundImage = `url(${iconCanvas(el.dataset.icon, 128).toDataURL()})`; });

/* =====================================================================
   Scenario model (works with or without WebGL)
   ===================================================================== */
const ACTORS = [
  { id: 'app', w: 1.15, h: 2.05, dz: .2 },
  { id: 'wallet', w: 1.9, h: 1.3, dz: .34 },
  { id: 'script', w: 2.0, h: 1.4, dz: .26 },
  { id: 'bank', w: 1.75, h: 1.6, dz: .5 },
  { id: 'tronlink', w: 1.15, h: 2.05, dz: .2 },
  { id: 'exchange', w: 1.75, h: 1.5, dz: .4 },
];
const RECIP_ADDR = { clean: 'TQx7…9a2M', sanctioned: 'TN4s…r7Lw', risk: 'TKe2…m8Vd' };
const state = { actor: 'app', recip: 'clean', running: false, t0: 0, plan: null, fired: 0, verdict: null, auto: !REDUCED };

function buildPlan(recip) {
  // times in seconds from run start
  if (recip === 'clean') return { recip, checks: [[1.25, 'sanctions', 'run'], [1.75, 'sanctions', 'ok'], [1.8, 'risk', 'run'], [2.3, 'risk', 'ok'], [2.35, 'prep', 'prep'], [3.0, 'prep', 'ok']], verdictAt: 3.05, ans: [3.1, 4.1], send: [4.35, 6.4], end: 7.0, ok: true };
  if (recip === 'sanctioned') return { recip, checks: [[1.25, 'sanctions', 'run'], [1.95, 'sanctions', 'fail'], [2.0, 'risk', 'skip'], [2.0, 'prep', 'skip']], verdictAt: 2.0, ans: [2.1, 3.1], send: null, end: 4.6, ok: false };
  return { recip, checks: [[1.25, 'sanctions', 'run'], [1.75, 'sanctions', 'ok'], [1.8, 'risk', 'run'], [2.45, 'risk', 'fail'], [2.5, 'prep', 'skip']], verdictAt: 2.5, ans: [2.6, 3.6], send: null, end: 5.1, ok: false };
}

const verdictEl = $('#verdict'), vT = $('#verdictTitle'), vB = $('#verdictBody'), runBtn = $('#run');
function setCheck(id, s) {
  const li = $(`.checks li[data-check="${id}"]`); li.dataset.s = s;
  const map = { wait: 'wait', run: 'run', ok: id === 'prep' ? 'prepOk' : 'ok', fail: 'fail', skip: 'skip', prep: 'prepRun' };
  li.querySelector('em').textContent = d(map[s]);
  if (s === 'prep') li.dataset.s = 'run';
}
function setVerdict(kind) {
  state.verdict = kind;
  const actorName = t('actor.' + state.actor);
  const V = {
    idle: ['idle', d('idleT'), d('idleB')],
    busy: ['busy', d('busyT'), d('busyB')],
    ok: ['ok', d('okT'), d('okB')],
    sent: ['ok', d('sentT'), d('sentB')(actorName)],
    stop: ['stop', state.recip === 'sanctioned' ? d('stopST') : d('stopRT'), d('stopB')],
  }[kind];
  verdictEl.dataset.state = V[0]; vT.textContent = V[1]; vB.textContent = V[2];
}
function resetChecks() { ['sanctions', 'risk', 'prep'].forEach(id => setCheck(id, 'wait')); }
function refreshDynamic() {
  $$('[data-dyn]').forEach(el => {
    const k = el.dataset.dyn;
    if (k === 'actor.name') el.textContent = t('actor.' + state.actor);
    else if (k === 'recip.addr') el.textContent = RECIP_ADDR[state.recip];
    else if (k === 'recip.state') { /* handled in frame */ }
    else el.textContent = d(k);
  });
  $$('.checks li').forEach(li => { if (li.dataset.s) setCheck(li.dataset.check, li.dataset.s === 'run' && li.dataset.check === 'prep' ? 'prep' : li.dataset.s); });
  if (state.verdict) setVerdict(state.verdict);
  if (!state.running && state.plan) runBtn.querySelector('span').textContent = d('again');
}

function clearRun() {
  if (!state.plan) return;
  state.running = false; runBtn.disabled = false;
  state.plan = null; resetChecks(); setVerdict('idle');
  runBtn.querySelector('span').textContent = t('stage.run');
}
function selectActor(id) {
  if (id !== state.actor) clearRun();
  state.actor = id;
  $$('[data-actor]').forEach(b => b.classList.toggle('active', b.dataset.actor === id));
  refreshDynamic();
}
function selectRecip(id) {
  if (id !== state.recip) clearRun();
  state.recip = id;
  $$('[data-recip]').forEach(b => b.classList.toggle('active', b.dataset.recip === id));
  $('#reqTo').textContent = RECIP_ADDR[id];
  refreshDynamic();
}
function startRun() {
  state.plan = buildPlan(state.recip);
  state.t0 = performance.now() / 1000;
  state.fired = 0; state.running = true;
  resetChecks(); setVerdict('busy');
  runBtn.disabled = true;
  scene3d && scene3d.onRun();
  // on phones the canvas sits above the controls: bring it into view
  if (!state.auto && innerWidth <= 1100) {
    const r = $('#scene').getBoundingClientRect();
    if (r.top < 60 || r.bottom > innerHeight) scrollBy({ top: r.top - 80, behavior: REDUCED ? 'auto' : 'smooth' });
  }
}
function stopAuto() { state.auto = false; }

// user input always wins: it cancels an in-flight (auto) run
$$('[data-actor]').forEach(b => b.addEventListener('click', () => { stopAuto(); clearRun(); selectActor(b.dataset.actor); }));
$$('[data-recip]').forEach(b => b.addEventListener('click', () => { stopAuto(); clearRun(); selectRecip(b.dataset.recip); }));
runBtn.addEventListener('click', () => { stopAuto(); if (!state.running) startRun(); });
$$('[data-go]').forEach(b => b.addEventListener('click', () => {
  stopAuto();
  $('#try').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
  clearRun(); selectActor(b.dataset.go); selectRecip('clean');
  setTimeout(() => !state.running && startRun(), 900);
}));

/* timeline tick — independent from rendering */
function tick(now) {
  if (!state.running) return;
  const e = now - state.t0, P = state.plan;
  while (state.fired < P.checks.length && e >= P.checks[state.fired][0]) {
    const [, id, s] = P.checks[state.fired++]; setCheck(id, s);
  }
  if (P.ok) {
    if (e >= P.verdictAt && state.verdict === 'busy') setVerdict('ok');
    if (e >= P.send[1] && state.verdict === 'ok') setVerdict('sent');
  } else if (e >= P.verdictAt && state.verdict === 'busy') setVerdict('stop');
  if (e >= P.end) {
    state.running = false; runBtn.disabled = false;
    runBtn.querySelector('span').textContent = d('again');
    if (state.auto) scheduleAuto();
  }
}

const AUTO = [['app', 'clean'], ['bank', 'sanctioned'], ['script', 'clean'], ['tronlink', 'risk'], ['wallet', 'clean'], ['exchange', 'sanctioned']];
let autoIdx = 0, autoTimer = 0;
function scheduleAuto(delay = 2600) {
  clearTimeout(autoTimer);
  autoTimer = setTimeout(() => {
    if (!state.auto || state.running) return;
    autoIdx = (autoIdx + 1) % AUTO.length;
    selectActor(AUTO[autoIdx][0]); selectRecip(AUTO[autoIdx][1]);
    setTimeout(() => state.auto && !state.running && startRun(), 900);
  }, delay);
}

/* =====================================================================
   3D scene
   ===================================================================== */
let scene3d = null;
function makeScene() {
  const stage = $('#stage'), canvas = $('#scene');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' }); }
  catch (e) { return null; }
  if (!renderer.getContext()) return null;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x070b0d, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070b0d, 0.045);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);

  scene.add(new THREE.HemisphereLight(0xcffff0, 0x0a1214, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 8, 6); scene.add(key);
  const coreLight = new THREE.PointLight(MINT, 30, 14, 1.6); scene.add(coreLight);

  /* helpers */
  const tex = cv => { const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4; return tx; };
  const glowTex = (() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 128; const g = cv.getContext('2d');
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return tex(cv);
  })();
  const glow = (color, size) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    s.scale.setScalar(size); return s;
  };
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const prog = (e, a, b) => clamp01((e - a) / (b - a));

  /* floor */
  const FLOOR_Y = -1.55;
  const grid = new THREE.GridHelper(60, 60, 0x2b4a40, 0x14221f);
  grid.position.y = FLOOR_Y; grid.material.transparent = true; grid.material.opacity = .55; scene.add(grid);
  const floorGlow = (() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d');
    const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, 'rgba(157,240,204,.28)'); gr.addColorStop(1, 'rgba(157,240,204,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), new THREE.MeshBasicMaterial({ map: tex(cv), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    m.rotation.x = -Math.PI / 2; m.position.y = FLOOR_Y + .01; scene.add(m); return m;
  })();

  /* particles */
  const pts = (() => {
    const N = 700, pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 8 + Math.random() * 26, th = Math.random() * Math.PI * 2, y = -1 + Math.random() * 16;
      pos[i * 3] = Math.cos(th) * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = Math.sin(th) * r - 6;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ color: MINT, size: .06, transparent: true, opacity: .55, depthWrite: false }));
    scene.add(p); return p;
  })();

  /* ---------- core ---------- */
  const core = new THREE.Group(); scene.add(core);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x0c2a21, emissive: MINT, emissiveIntensity: .55, metalness: .4, roughness: .25 });
  const coreBall = new THREE.Mesh(new THREE.IcosahedronGeometry(.72, 3), coreMat); core.add(coreBall);
  const shellMat = new THREE.MeshBasicMaterial({ color: MINT, wireframe: true, transparent: true, opacity: .32 });
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.18, 1), shellMat); core.add(shell);
  const coreGlow = glow(MINT, 5.5); coreGlow.material.opacity = .45; core.add(coreGlow);
  const ringMat = new THREE.MeshBasicMaterial({ color: MINT, transparent: true, opacity: .75 });
  const rings = [1.6, 1.95, 2.3].map((r, i) => {
    const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, i === 1 ? .008 : .014, 8, 160), ringMat); g.add(m);
    const sat = new THREE.Mesh(new THREE.SphereGeometry(.06, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    sat.position.x = r; g.add(sat); const sg = glow(MINT, .6); sg.position.x = r; g.add(sg);
    g.rotation.set(Math.PI / 2 + (i - 1) * .55, (i - 1) * .4, 0); core.add(g); return g;
  });
  const scanMat = new THREE.MeshBasicMaterial({ color: MINT, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
  const scanner = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, .05, 64, 1, true), scanMat); core.add(scanner);
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 1, 8), new THREE.MeshBasicMaterial({ color: MINT, transparent: true, opacity: .25 }));
  scene.add(pedestal);

  /* ---------- actors ---------- */
  const actorMeshes = ACTORS.map(def => {
    const g = new THREE.Group(); g.userData.def = def;
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x111a1e, metalness: .55, roughness: .35, transparent: true });
    const geo = new THREE.BoxGeometry(def.w, def.h, def.dz);
    const body = new THREE.Mesh(geo, bodyMat); body.userData.actor = def.id; g.add(body);
    const edgeMat = new THREE.LineBasicMaterial({ color: MINT, transparent: true, opacity: .55 });
    g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat));
    const S = 256, cv = document.createElement('canvas'); cv.width = cv.height = S;
    drawIcon(cv.getContext('2d'), def.id, S);
    const faceMat = new THREE.MeshBasicMaterial({ map: tex(cv), transparent: true, depthWrite: false });
    const s = Math.min(def.w, def.h) * .95;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(s, s), faceMat); face.position.z = def.dz / 2 + .005; g.add(face);
    const screenMat = new THREE.MeshBasicMaterial({ color: MINT, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(def.w * .92, def.h * .92), screenMat); screen.position.z = def.dz / 2 + .01; g.add(screen);
    const halo = glow(MINT, 3.4); halo.material.opacity = 0; halo.position.z = -.3; g.add(halo);
    g.userData = { def, body, bodyMat, edgeMat, faceMat, screenMat, halo, pos: new THREE.Vector3(), scale: 1, phase: Math.random() * 6 };
    scene.add(g); return g;
  });

  /* ---------- recipient ---------- */
  const recip = new THREE.Group(); scene.add(recip);
  const recipMat = new THREE.MeshStandardMaterial({ color: 0x111a1e, metalness: .55, roughness: .3 });
  const hexGeo = new THREE.CylinderGeometry(.95, .95, .34, 6);
  const hex = new THREE.Mesh(hexGeo, recipMat); hex.rotation.x = Math.PI / 2; hex.rotation.y = Math.PI / 6; recip.add(hex);
  const recipEdgeMat = new THREE.LineBasicMaterial({ color: 0x6f8784, transparent: true, opacity: .8 });
  const hexEdges = new THREE.LineSegments(new THREE.EdgesGeometry(hexGeo), recipEdgeMat); hexEdges.rotation.copy(hex.rotation); recip.add(hexEdges);
  const personCv = iconCanvas('person', 256, '#cfe0dc');
  const recipFace = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), new THREE.MeshBasicMaterial({ map: tex(personCv), transparent: true, depthWrite: false }));
  recipFace.position.z = .18; recip.add(recipFace);
  const recipHalo = glow(MINT, 4); recipHalo.material.opacity = 0; recipHalo.position.z = -.3; recip.add(recipHalo);
  const recipRingMat = new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0, depthWrite: false });
  const recipRing = new THREE.Mesh(new THREE.TorusGeometry(1.35, .025, 8, 96), recipRingMat); recip.add(recipRing);

  /* barrier (stop) */
  const barrierCv = (() => {
    const cv = document.createElement('canvas'); cv.width = 64; cv.height = 256; const g = cv.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(.6, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,.95)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 256);
    g.fillStyle = 'rgba(255,255,255,.35)'; for (let y = 0; y < 256; y += 16) g.fillRect(0, y, 64, 1);
    return cv;
  })();
  const barrierMat = new THREE.MeshBasicMaterial({ map: tex(barrierCv), transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
  const barrier = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.4), barrierMat); scene.add(barrier);
  const stopSign = (() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d');
    g.beginPath(); for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; g.lineTo(128 + Math.cos(a) * 118, 128 + Math.sin(a) * 118); } g.closePath();
    g.fillStyle = '#ffffff'; g.fill();
    g.strokeStyle = '#1a0a0c'; g.lineWidth = 26; g.lineCap = 'round';
    g.beginPath(); g.moveTo(84, 84); g.lineTo(172, 172); g.moveTo(172, 84); g.lineTo(84, 172); g.stroke();
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(cv), color: RED, transparent: true, opacity: 0, depthWrite: false }));
    sp.scale.setScalar(.7); scene.add(sp); return sp;
  })();

  /* ---------- coin ---------- */
  const coinFace = (() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d');
    const gr = g.createRadialGradient(100, 90, 10, 128, 128, 128); gr.addColorStop(0, '#6fe8bf'); gr.addColorStop(.6, '#26a17b'); gr.addColorStop(1, '#13604a');
    g.fillStyle = gr; g.beginPath(); g.arc(128, 128, 126, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 6; g.beginPath(); g.arc(128, 128, 108, 0, 7); g.stroke();
    g.fillStyle = '#fff'; g.font = '800 140px ui-sans-serif,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('₮', 128, 136);
    return tex(cv);
  })();
  const coin = new THREE.Group();
  const coinMesh = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .08, 48), [
    new THREE.MeshStandardMaterial({ color: TEAL, metalness: .7, roughness: .3, emissive: TEAL, emissiveIntensity: .25 }),
    new THREE.MeshBasicMaterial({ map: coinFace }), new THREE.MeshBasicMaterial({ map: coinFace }),
  ]);
  coinMesh.rotation.x = Math.PI / 2; coin.add(coinMesh);
  const coinGlow = glow(TEAL, 2.2); coin.add(coinGlow);
  coin.visible = false; scene.add(coin);

  /* ---------- beams & packets ---------- */
  function makeBeam(color) {
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false });
    const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat); mesh.visible = false; scene.add(mesh);
    const packet = new THREE.Group();
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.11, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const halo = glow(color, 1.5); packet.add(dot, halo); packet.visible = false; scene.add(packet);
    return { mesh, mat, packet, halo, curve: null, segs: 120, radial: 8,
      setCurve(c) { this.curve = c; this.mesh.geometry.dispose(); this.mesh.geometry = new THREE.TubeGeometry(c, this.segs, .028, this.radial, false); },
      setColor(col) { this.mat.color.setHex(col); this.halo.material.color.setHex(col); },
      draw(p, head = true) {
        const n = this.mesh.geometry.index.count;
        this.mesh.geometry.setDrawRange(0, Math.floor(n * clamp01(p) / 6) * 6);
        this.mesh.visible = p > 0;
        this.packet.visible = head && p > 0 && p < 1;
        if (this.packet.visible) this.curve.getPointAt(clamp01(p), this.packet.position);
      },
      hide() { this.mesh.visible = false; this.packet.visible = false; },
    };
  }
  const beamReq = makeBeam(MINT), beamAns = makeBeam(MINT);
  const sendTrail = makeBeam(TEAL);

  /* ---------- layout ---------- */
  const L = { actor: new THREE.Vector3(), core: new THREE.Vector3(), recip: new THREE.Vector3(), camPos: new THREE.Vector3(), look: new THREE.Vector3(), narrow: false };
  let W = 1, H = 1;
  function layout() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    const a = W / H; L.narrow = a < 1.15;
    const desk = innerWidth > 1100; // console panel floats over the scene
    if (L.narrow) {
      L.actor.set(-2.25, -.15, 1.6); L.recip.set(2.25, -.15, 1.6); L.core.set(0, 2.3, -1.6);
      L.camPos.set(0, 2.6, 12.6 / Math.max(a, .72)); L.look.set(0, .75, 0);
    } else {
      const shift = desk ? -1.15 : 0; // leave room for the console panel on the right
      L.actor.set(-4.9 + shift, -.1, 1.2); L.recip.set(3.7 + shift, -.1, 1.2); L.core.set(-.6 + shift, 1.75, -2);
      L.camPos.set(0, 3.1, 13.2); L.look.set(0, .85, 0);
    }
    core.position.copy(L.core);
    pedestal.position.set(L.core.x, (FLOOR_Y + L.core.y - 1.2) / 2, L.core.z); pedestal.scale.y = (L.core.y - 1.2 - FLOOR_Y);
    recip.position.copy(L.recip); floorGlow.position.x = L.core.x;
    const a0 = L.actor.clone().add(new THREE.Vector3(.5, .7, 0)), c0 = L.core.clone();
    const mid = a0.clone().lerp(c0, .5);
    beamReq.setCurve(new THREE.QuadraticBezierCurve3(a0, new THREE.Vector3(mid.x - .4, mid.y + 2.6, mid.z + .4), c0));
    beamAns.setCurve(new THREE.QuadraticBezierCurve3(c0.clone(), new THREE.Vector3(mid.x + .6, mid.y - .4, mid.z + 1.6), L.actor.clone().add(new THREE.Vector3(.6, .2, .3))));
    const s0 = L.actor.clone().add(new THREE.Vector3(.7, -.3, .3)), s1 = L.recip.clone().add(new THREE.Vector3(-.7, -.2, .3));
    sendTrail.setCurve(new THREE.QuadraticBezierCurve3(s0, new THREE.Vector3((s0.x + s1.x) / 2, FLOOR_Y + .25, s0.z + 2.6), s1));
    const bp = sendTrail.curve.getPointAt(.5);
    barrier.position.set(bp.x, FLOOR_Y + 1.6, bp.z);
    barrier.userData.x = bp.x;
    barrier.scale.set(L.narrow ? .55 : .8, 1, 1);
  }

  /* slots for the actors that are not selected: an arc behind the core */
  function idleSlot(i, n, out) {
    const spread = L.narrow ? 1.9 : 2.4;
    const th = Math.PI + .35 + (i / Math.max(1, n - 1)) * spread;
    const R = L.narrow ? 6.5 : 9;
    out.set(L.core.x + Math.cos(th) * R * (L.narrow ? .8 : 1.15), 1.6 + Math.sin(i * 1.7) * .5, L.core.z + Math.sin(th) * R * .55 - 2.5);
    return out;
  }

  /* ---------- labels ---------- */
  const lab = {}; $$('#labels [data-l]').forEach(el => { lab[el.dataset.l] = el; });
  const tmpV = new THREE.Vector3();
  function place(el, v, dy = 0, show = true) {
    tmpV.copy(v).project(camera);
    const vis = show && tmpV.z < 1 && Math.abs(tmpV.x) < 1.2;
    el.style.opacity = vis ? '' : 0;
    if (!vis) return;
    const x = (tmpV.x * .5 + .5) * W, y = (-tmpV.y * .5 + .5) * H + dy;
    el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%)`;
  }

  /* ---------- interaction ---------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let hovered = null, downAt = null;
  function pick(ev) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(actorMeshes.map(m => m.userData.body), false)[0];
    return hit ? hit.object.userData.actor : null;
  }
  canvas.addEventListener('pointermove', ev => {
    const r = canvas.getBoundingClientRect();
    pointer.tx = ((ev.clientX - r.left) / r.width) * 2 - 1; pointer.ty = ((ev.clientY - r.top) / r.height) * 2 - 1;
    hovered = ev.pointerType === 'mouse' ? pick(ev) : null;
    canvas.style.cursor = hovered ? 'pointer' : 'grab';
  });
  canvas.addEventListener('pointerleave', () => { pointer.tx = pointer.ty = 0; hovered = null; });
  canvas.addEventListener('pointerdown', ev => { downAt = [ev.clientX, ev.clientY]; });
  canvas.addEventListener('pointerup', ev => {
    if (!downAt || Math.hypot(ev.clientX - downAt[0], ev.clientY - downAt[1]) > 8) return;
    const id = pick(ev); if (!id) return;
    stopAuto(); clearRun();
    selectActor(id); setTimeout(() => !state.running && startRun(), 650);
  });

  /* ---------- run hooks ---------- */
  let runActorId = null;
  function onRun() { runActorId = state.actor; }

  /* ---------- frame ---------- */
  const col = new THREE.Color(), cMint = new THREE.Color(MINT), cRed = new THREE.Color(RED), cAmber = new THREE.Color(AMBER), cIdle = new THREE.Color(0x6f8784);
  const tmpSlot = new THREE.Vector3();
  let last = performance.now() / 1000, visible = true, ringSpeed = 1;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: .02 }).observe(stage);
  addEventListener('resize', layout);
  new ResizeObserver(layout).observe(stage);
  layout();

  function frame() {
    requestAnimationFrame(frame);
    const now = performance.now() / 1000, dt = Math.min(.05, now - last); last = now;
    tick(now);
    if (!visible) return;
    const k = 1 - Math.exp(-dt * 5);

    const run = state.plan && runActorId ? state.plan : null;
    const e = run ? now - state.t0 : 99;
    const stopTone = state.recip === 'risk' ? cAmber : cRed;

    /* camera */
    pointer.x += (pointer.tx - pointer.x) * k * .6; pointer.y += (pointer.ty - pointer.y) * k * .6;
    const sway = REDUCED ? 0 : Math.sin(now * .25) * .35;
    camera.position.set(L.camPos.x + pointer.x * 1.1 + sway, L.camPos.y - pointer.y * .6, L.camPos.z);
    camera.lookAt(L.look);

    /* core */
    const checking = run && e > 1.0 && e < run.verdictAt + .2;
    ringSpeed += ((checking ? 4.5 : 1) - ringSpeed) * k;
    rings.forEach((g, i) => { g.rotation.z += dt * ringSpeed * (.35 + i * .18) * (i % 2 ? -1 : 1); });
    shell.rotation.y += dt * .25 * ringSpeed; shell.rotation.x += dt * .1;
    core.position.y = L.core.y + Math.sin(now * 1.1) * .08;
    let coreTarget = cMint;
    if (run && e >= run.verdictAt && !run.ok) coreTarget = stopTone;
    if (run && checking) coreTarget = col.copy(cMint).lerp(new THREE.Color(0xffffff), .25 + .25 * Math.sin(now * 12));
    ringMat.color.lerp(coreTarget, k); shellMat.color.lerp(coreTarget, k); coreMat.emissive.lerp(coreTarget, k);
    coreGlow.material.color.lerp(coreTarget, k); coreLight.color.lerp(coreTarget, k);
    coreLight.position.copy(core.position);
    coreMat.emissiveIntensity = .55 + (checking ? .5 + .3 * Math.sin(now * 14) : 0);
    scanMat.opacity += ((checking ? .55 : 0) - scanMat.opacity) * k * 2;
    scanner.position.y = Math.sin(now * 5) * 1.0;
    scanMat.color.copy(ringMat.color);
    const pulse = run && e > run.verdictAt && e < run.verdictAt + .6 ? 1 + Math.sin(prog(e, run.verdictAt, run.verdictAt + .6) * Math.PI) * .25 : 1;
    core.scale.setScalar(pulse);

    /* actors */
    const others = ACTORS.filter(a => a.id !== state.actor);
    actorMeshes.forEach(g => {
      const u = g.userData, sel = u.def.id === state.actor;
      const target = sel ? L.actor : idleSlot(others.indexOf(u.def), others.length, tmpSlot);
      if (!u.init) { u.pos.copy(target); u.init = true; }
      u.pos.lerp(target, k * (sel ? 1.2 : .8));
      g.position.copy(u.pos); g.position.y += Math.sin(now * 1.3 + u.phase) * (sel ? .06 : .12);
      u.scale += ((sel ? 1 : (hovered === u.def.id ? .78 : .62)) - u.scale) * k;
      g.scale.setScalar(u.scale);
      g.lookAt(camera.position.x * .35, g.position.y, camera.position.z);
      if (!sel) g.rotation.y += Math.sin(now * .6 + u.phase) * .15;
      const op = sel ? 1 : (hovered === u.def.id ? .95 : .45);
      u.bodyMat.opacity += (op - u.bodyMat.opacity) * k; u.faceMat.opacity = u.bodyMat.opacity;
      u.edgeMat.opacity = sel ? .9 : .3 * u.bodyMat.opacity / .45;
      // answer flash on the selected actor
      let flash = 0, fcol = cMint;
      if (sel && run && e >= run.ans[1]) { flash = Math.max(0, 1 - (e - run.ans[1]) / 1.2) * .5 + .12; fcol = run.ok ? cMint : stopTone; }
      u.screenMat.opacity += (flash - u.screenMat.opacity) * k * 2; u.screenMat.color.copy(fcol);
      u.halo.material.opacity += ((sel ? (flash ? .5 : .18) : 0) - u.halo.material.opacity) * k;
      u.halo.material.color.copy(sel && flash ? fcol : cMint);
      u.edgeMat.color.lerp(sel && flash ? fcol : cMint, k);
    });

    /* beams */
    if (run) {
      beamReq.setColor(MINT);
      const pReq = ease(prog(e, .1, 1.1));
      beamReq.draw(pReq);
      beamReq.mat.opacity = e < run.ans[1] ? .9 : Math.max(0, .9 - (e - run.ans[1]) * 1.2);
      const ansCol = run.ok ? MINT : (state.recip === 'risk' ? AMBER : RED);
      beamAns.setColor(ansCol);
      beamAns.draw(ease(prog(e, run.ans[0], run.ans[1])));
      beamAns.mat.opacity = e < run.end - .8 ? .9 : Math.max(0, .9 - (e - (run.end - .8)) * 1.4);
      if (run.send) {
        const ps = ease(prog(e, run.send[0], run.send[1]));
        sendTrail.setColor(TEAL); sendTrail.draw(ps, false); sendTrail.mat.opacity = .7;
        coin.visible = ps > 0 && ps < 1;
        if (coin.visible) { sendTrail.curve.getPointAt(ps, coin.position); coin.position.y += Math.sin(ps * Math.PI) * .6; coin.rotation.y = now * 7; }
      } else {
        // blocked: the attempted path stops at the barrier
        const pb = ease(prog(e, run.ans[1] - .1, run.ans[1] + .7)) * .46;
        sendTrail.setColor(state.recip === 'risk' ? AMBER : RED); sendTrail.draw(pb, false);
        sendTrail.mat.opacity = e < run.end ? .85 : Math.max(0, .85 - (e - run.end) * .8);
        coin.visible = false;
      }
    } else { beamReq.hide(); beamAns.hide(); sendTrail.hide(); coin.visible = false; }

    /* recipient */
    let rState = 'idle';
    if (run && run.ok && e >= run.send[1]) rState = 'ok';
    if (run && !run.ok && e >= run.ans[1]) rState = 'stop';
    recip.position.y = L.recip.y + Math.sin(now * 1.2 + 2) * .07;
    recip.lookAt(camera.position.x * .35, recip.position.y, camera.position.z);
    const rCol = rState === 'ok' ? cMint : rState === 'stop' ? stopTone : cIdle;
    recipEdgeMat.color.lerp(rCol, k);
    recipHalo.material.color.copy(rState === 'stop' ? stopTone : cMint);
    recipHalo.material.opacity += ((rState === 'idle' ? 0 : .6) - recipHalo.material.opacity) * k;
    recipRingMat.color.copy(stopTone);
    recipRingMat.opacity += ((rState === 'stop' ? .9 : 0) - recipRingMat.opacity) * k;
    recipRing.rotation.z = now * .8; recipRing.scale.setScalar(1 + (rState === 'stop' ? Math.sin(now * 6) * .04 : 0));
    const bump = run && run.ok && e > run.send[1] && e < run.send[1] + .5 ? 1 + Math.sin(prog(e, run.send[1], run.send[1] + .5) * Math.PI) * .18 : 1;
    recip.scale.setScalar(bump);

    /* barrier */
    const bTarget = run && !run.ok && e >= run.ans[1] - .2 && e < run.end + 1.4 ? 1 : 0;
    barrierMat.opacity += (bTarget * .6 - barrierMat.opacity) * k * 1.5;
    barrier.lookAt(camera.position.x, barrier.position.y, camera.position.z);
    barrierMat.color.copy(stopTone);
    barrier.scale.y += ((bTarget ? 1 : .01) - barrier.scale.y) * k * 1.6;
    barrier.position.y = FLOOR_Y + 1.2 * barrier.scale.y;
    stopSign.material.opacity = barrierMat.opacity / .6; stopSign.material.color.copy(stopTone);
    stopSign.position.set(barrier.position.x, FLOOR_Y + 2.4 * barrier.scale.y + .45 + Math.sin(now * 2) * .06, barrier.position.z);
    stopSign.scale.setScalar(.7 * (L.narrow ? .8 : 1) * (.6 + .4 * barrier.scale.y));

    particlesSpin(dt);
    renderer.render(scene, camera);

    /* labels */
    place(lab.core, core.position, L.narrow ? -78 : -96);
    const selMesh = actorMeshes.find(m => m.userData.def.id === state.actor);
    tmpSlot.copy(selMesh.position); tmpSlot.y -= selMesh.userData.def.h / 2 + .25;
    place(lab.actor, tmpSlot, 26);
    tmpSlot.copy(recip.position); tmpSlot.y -= 1.2;
    place(lab.recip, tmpSlot, 30);
    const rs = lab.recip.querySelector('.recip-state');
    rs.className = 'recip-state' + (rState === 'ok' ? ' ok' : rState === 'stop' ? ' stop' : '');
    rs.textContent = rState === 'ok' ? d('recipOk') : rState === 'stop' ? d('recipStop') : '';
    if (rState === 'stop') rs.style.background = state.recip === 'risk' ? '#ffc46b' : '';
    if (rState === 'stop') rs.style.color = state.recip === 'risk' ? '#2a1d05' : '';

    // packet tag
    const pk = lab.packet;
    if (beamReq.packet.visible) { pk.className = 'tag tag-packet on'; pk.textContent = d('packet'); place(pk, beamReq.packet.position, -30); }
    else if (beamAns.packet.visible) {
      pk.className = 'tag tag-packet on ' + (run.ok ? 'ok' : 'stop'); pk.textContent = run.ok ? d('ready') : d('stop');
      if (!run.ok && state.recip === 'risk') { pk.style.borderColor = '#ffc46b'; pk.style.color = '#ffc46b'; } else { pk.style.borderColor = ''; pk.style.color = ''; }
      place(pk, beamAns.packet.position, -30);
    } else pk.className = 'tag tag-packet';
    lab.coin.classList.toggle('on', coin.visible);
    if (coin.visible) place(lab.coin, coin.position, -40);
    // hover tag
    const hv = lab.hover;
    if (hovered && hovered !== state.actor) {
      const m = actorMeshes.find(a => a.userData.def.id === hovered);
      hv.textContent = `${t('actor.' + hovered)} · ${d('hover')}`; hv.classList.add('on');
      tmpSlot.copy(m.position); tmpSlot.y += m.userData.def.h * m.userData.scale / 2 + .2; place(hv, tmpSlot, -16);
    } else hv.classList.remove('on');
  }
  function particlesSpin(dt) { pts.rotation.y += dt * .015; }
  requestAnimationFrame(frame);
  return { onRun };
}

/* fallback ticking loop if WebGL is unavailable */
function fallbackLoop() { tick(performance.now() / 1000); requestAnimationFrame(fallbackLoop); }

/* =====================================================================
   Boot
   ===================================================================== */
selectActor('app'); selectRecip('clean'); resetChecks(); setVerdict('idle');
setLang(lang);
try { scene3d = makeScene(); } catch (err) { console.warn(err); scene3d = null; }
if (!scene3d) { $('#nogl').hidden = false; $('#scene').style.display = 'none'; fallbackLoop(); }

// autoplay the first scenario once the stage is in view
if (state.auto) {
  const io = new IntersectionObserver(es => {
    if (es[0].isIntersecting) { io.disconnect(); setTimeout(() => state.auto && !state.running && startRun(), 900); }
  }, { threshold: .35 });
  io.observe($('#stage'));
}

/* =====================================================================
   Page effects: reveal, tilt, phone
   ===================================================================== */
const rio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } }), { threshold: .2 });
$$('.reveal').forEach(el => rio.observe(el));

if (!REDUCED && matchMedia('(hover: hover)').matches) {
  $$('.tilt').forEach(el => {
    el.addEventListener('pointermove', ev => {
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
      el.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg'); el.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); });
  });
}

(() => {
  const phone = $('#phone'), scenePh = $('#phoneScene'), steps = $$('#phoneSteps li');
  let screen = 1, timer = 0;
  const DUR = { 1: 2600, 2: 1700, 3: 2400, 4: 2400 };
  function show(n) {
    screen = n; phone.dataset.screen = n;
    steps.forEach((li, i) => { li.classList.toggle('active', i === n - 1); li.classList.toggle('done', i < n - 1); });
    clearTimeout(timer);
    if (!REDUCED) timer = setTimeout(() => show(n % 4 + 1), DUR[n]);
  }
  $$('#phoneMode [data-mode]').forEach(b => b.addEventListener('click', () => {
    $$('#phoneMode [data-mode]').forEach(x => x.classList.toggle('active', x === b));
    phone.dataset.mode = b.dataset.mode; show(1);
  }));
  let started = false;
  new IntersectionObserver(es => { if (es[0].isIntersecting && !started) { started = true; show(1); } }, { threshold: .3 }).observe(scenePh);
  if (REDUCED) { show(3); }
  if (!REDUCED && matchMedia('(hover: hover)').matches) {
    scenePh.addEventListener('pointermove', ev => {
      const r = scenePh.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
      phone.style.transform = `rotateY(${-18 + x * 26}deg) rotateX(${6 - y * 14}deg)`;
    });
    scenePh.addEventListener('pointerleave', () => { phone.style.transform = ''; });
  }
})();
