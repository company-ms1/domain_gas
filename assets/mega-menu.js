(() => {
  const header = document.querySelector('header.nav');
  if (!header) return;
  const triggers = [...header.querySelectorAll('.mega-trigger')];
  const mobile = header.querySelector('.mobile-menu-toggle');
  const compact = matchMedia('(max-width:980px)');
  function closePanels() {
    triggers.forEach(button => {
      button.setAttribute('aria-expanded', 'false');
      document.getElementById(button.getAttribute('aria-controls')).hidden = true;
    });
  }
  function closeAll() {
    closePanels();
    header.classList.remove('is-mobile-open');
    mobile.setAttribute('aria-expanded', 'false');
  }
  triggers.forEach(button => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    closePanels();
    button.setAttribute('aria-expanded', String(open));
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    panel.hidden = !open;
    // The panel follows the whole navigation in the DOM: move focus to its links.
    if (open) panel.querySelector('a')?.focus({preventScroll:true});
  }));
  mobile.addEventListener('click', () => {
    const open = mobile.getAttribute('aria-expanded') !== 'true';
    closePanels();
    header.classList.toggle('is-mobile-open', open);
    mobile.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeAll();
    else if (event.target.closest('a')) closeAll();
  });
  header.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const active = triggers.find(button => button.getAttribute('aria-expanded') === 'true');
    if (active) { closePanels(); active.focus(); }
    else { closeAll(); mobile.focus(); }
  });
  document.addEventListener('focusin', event => {
    if (!header.contains(event.target)) closeAll();
  });
  compact.addEventListener('change', closeAll);
  function localizeMcp() {
    header.querySelector('a[href$="/mcp"]').href = `${document.documentElement.lang}/mcp`;
  }
  document.addEventListener('landinglanguagechange', localizeMcp);
  localizeMcp();
})();
