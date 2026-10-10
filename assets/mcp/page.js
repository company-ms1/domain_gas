(() => {
  'use strict';
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
      ? 'Дополнительно доступны баланс и платные заказы. Замените YOUR_API_KEY в настройках клиента.'
      : 'Доступны цены и расчёт ресурсов. Аккаунт не нужен.';
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
        status.textContent = 'Скопировано';
      } catch (_) {
        status.textContent = 'Не удалось скопировать. Выделите текст и скопируйте его вручную.';
      }
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => { status.textContent = ''; }, 4500);
    });
  });
})();
