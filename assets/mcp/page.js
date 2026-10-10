(() => {
  'use strict';
  const language = document.documentElement.lang;
  const messages = {
    ru: {
      publicHint: 'Доступны цены и расчёт ресурсов. Аккаунт не нужен.',
      keyHint: 'Дополнительно доступны баланс и платные заказы. Замените YOUR_API_KEY в настройках клиента.',
      copied: 'Скопировано', copyError: 'Не удалось скопировать. Выделите текст и скопируйте его вручную.',
      pause: 'Приостановить', play: 'Продолжить',
      estimateQuestion: 'Оцени ресурсы для перевода USDT TRC20.',
      estimateTitle: 'Расчёт для двух адресов',
      estimateText: 'Агент передаёт адреса отправителя и получателя. Средства не отправляются.',
      balanceTitle: 'Баланс и адрес пополнения',
      balanceText: 'С API-ключом агент может получить баланс и адрес пополнения вашего аккаунта.'
    },
    en: {
      publicHint: 'Prices and resource estimates are available. No account needed.',
      keyHint: 'Balance and paid orders are also available. Replace YOUR_API_KEY in your client settings.',
      copied: 'Copied', copyError: 'Could not copy. Select the text and copy it manually.',
      pause: 'Pause', play: 'Resume',
      estimateQuestion: 'Estimate the resources for a USDT TRC20 transfer.',
      estimateTitle: 'An estimate for two addresses',
      estimateText: 'The agent submits the sender and recipient addresses. No funds are sent.',
      balanceTitle: 'Balance and deposit address',
      balanceText: 'With an API key, the agent can retrieve your account balance and deposit address.'
    },
    es: {
      publicHint: 'Precios y estimaciones de recursos disponibles. No necesitas una cuenta.',
      keyHint: 'También están disponibles el saldo y los pedidos de pago. Sustituye YOUR_API_KEY en los ajustes del cliente.',
      copied: 'Copiado', copyError: 'No se pudo copiar. Selecciona el texto y cópialo manualmente.',
      pause: 'Pausar', play: 'Continuar',
      estimateQuestion: 'Estima los recursos para una transferencia de USDT TRC20.',
      estimateTitle: 'Estimación para dos direcciones',
      estimateText: 'El agente envía las direcciones del emisor y del destinatario. No se envían fondos.',
      balanceTitle: 'Saldo y dirección de depósito',
      balanceText: 'Con una clave API, el agente puede consultar el saldo y la dirección de depósito de tu cuenta.'
    },
    id: {
      publicHint: 'Harga dan estimasi sumber daya tersedia. Tidak perlu akun.',
      keyHint: 'Saldo dan pesanan berbayar juga tersedia. Ganti YOUR_API_KEY di pengaturan klien.',
      copied: 'Disalin', copyError: 'Tidak dapat menyalin. Pilih teks dan salin secara manual.',
      pause: 'Jeda', play: 'Lanjutkan',
      estimateQuestion: 'Perkirakan sumber daya untuk transfer USDT TRC20.',
      estimateTitle: 'Estimasi untuk dua alamat',
      estimateText: 'Agen mengirimkan alamat pengirim dan penerima. Tidak ada dana yang dikirim.',
      balanceTitle: 'Saldo dan alamat pengisian',
      balanceText: 'Dengan kunci API, agen dapat mengambil saldo akun dan alamat pengisian saldo Anda.'
    }
  };
  const t = messages[language] || messages.en;
  const endpoint = 'https://www.gasfree4you.com/mcp';
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const hint = document.getElementById('auth-hint');
  const status = document.getElementById('copy-status');
  let statusTimer;

  function selectTab(tab, focus = false) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectTab(tabs[next], true);
      }
    });
  });

  function updateConfigs() {
    const withKey = document.querySelector('input[name="auth"]:checked').value === 'key';
    const server = { url: endpoint };
    if (withKey) server.headers = { 'X-API-Key': 'YOUR_API_KEY' };
    document.getElementById('config-cursor').textContent = JSON.stringify({ mcpServers: { gasfree4you: server } }, null, 2);
    document.getElementById('config-claude').textContent =
      `claude mcp add --transport http --scope user gasfree4you ${endpoint}` +
      (withKey ? ' --header "X-API-Key: YOUR_API_KEY"' : '');
    document.getElementById('config-codex').textContent =
      `[mcp_servers.gasfree4you]\nurl = "${endpoint}"` +
      (withKey ? '\nhttp_headers = { "X-API-Key" = "YOUR_API_KEY" }' : '');
    hint.textContent = withKey
      ? t.keyHint
      : t.publicHint;
  }
  document.querySelectorAll('input[name="auth"]').forEach(input => input.addEventListener('change', updateConfigs));
  updateConfigs();

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return; } catch (_) { /* Try the browser fallback. */ }
    }
    const previousFocus = document.activeElement;
    const input = document.createElement('textarea');
    input.value = text;
    input.readOnly = true;
    input.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, text.length);
    try {
      if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
    } finally {
      input.remove();
      if (previousFocus) previousFocus.focus({ preventScroll: true });
    }
  }
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', async () => {
      try {
        await copyText(document.getElementById(button.dataset.copy).textContent.trim());
        status.textContent = t.copied;
      } catch (_) {
        status.textContent = t.copyError;
      }
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => { status.textContent = ''; }, 4500);
    });
  });

  // Local, illustrative conversation only. This animation makes no network requests.
  const card = document.querySelector('.agent-card');
  const question = document.getElementById('demo-question');
  const method = document.getElementById('demo-method');
  const title = document.getElementById('demo-response-title');
  const answer = document.getElementById('demo-response-text');
  const toggle = document.getElementById('demo-toggle');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scenarios = [
    { question: question.textContent, method: 'get_energy_prices()', title: title.textContent, answer: answer.textContent },
    { question: t.estimateQuestion, method: 'estimate_transfer_fee(…)', title: t.estimateTitle, answer: t.estimateText },
    { question: document.getElementById('prompt-balance').textContent, method: 'get_account_balance()', title: t.balanceTitle, answer: t.balanceText }
  ];
  let scenarioIndex = 0;
  let phase = 'hold';
  let character = 0;
  let answerCharacter = 0;
  let timer;
  let paused = false;
  let visible = true;

  function isRunning() {
    return !paused && !motion.matches && !document.hidden && visible;
  }
  function setPhase(value) {
    phase = value;
    card.dataset.phase = value;
  }
  function schedule(delay) {
    clearTimeout(timer);
    if (isRunning()) timer = setTimeout(advance, delay);
  }
  function advance() {
    if (!isRunning()) return;
    const scenario = scenarios[scenarioIndex];
    if (phase === 'hold') {
      scenarioIndex = (scenarioIndex + 1) % scenarios.length;
      character = 0;
      question.textContent = '';
      method.textContent = scenarios[scenarioIndex].method;
      title.textContent = scenarios[scenarioIndex].title;
      answer.textContent = scenarios[scenarioIndex].answer;
      setPhase('question');
      schedule(200);
    } else if (phase === 'question') {
      character = Math.min(character + 2, scenario.question.length);
      question.textContent = scenario.question.slice(0, character);
      if (character === scenario.question.length) {
        setPhase('thinking');
        schedule(1100);
      } else schedule(35);
    } else if (phase === 'thinking') {
      setPhase('tool');
      schedule(1000);
    } else if (phase === 'tool') {
      answerCharacter = 0;
      answer.textContent = '';
      setPhase('response');
      schedule(40);
    } else {
      answerCharacter = Math.min(answerCharacter + 3, scenario.answer.length);
      answer.textContent = scenario.answer.slice(0, answerCharacter);
      if (answerCharacter === scenario.answer.length) {
        setPhase('hold');
        schedule(4800);
      } else schedule(35);
    }
  }
  function syncPlayback() {
    clearTimeout(timer);
    toggle.hidden = motion.matches;
    toggle.textContent = paused ? t.play : t.pause;
    toggle.setAttribute('aria-pressed', String(paused));
    card.classList.toggle('is-playing', isRunning());
    if (motion.matches) {
      question.textContent = scenarios[scenarioIndex].question;
      answer.textContent = scenarios[scenarioIndex].answer;
      setPhase('hold');
    }
    if (isRunning()) schedule(phase === 'hold' ? 4800 : 150);
  }
  toggle.addEventListener('click', () => { paused = !paused; syncPlayback(); });
  motion.addEventListener('change', syncPlayback);
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncPlayback();
    }, { threshold: 0.1 }).observe(card);
  }
  setPhase('hold');
  syncPlayback();
})();
