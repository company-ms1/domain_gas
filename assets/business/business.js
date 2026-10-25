(() => {
  // Integration hooks only: no analytics network requests or personal data in events.
  const track = (event, properties = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, page: 'business', ...properties });
  };
  const form = document.querySelector('#lead-form');
  document.querySelectorAll('[data-event]').forEach(link => {
    link.addEventListener('click', () => {
      track(link.dataset.event);
      if (link.dataset.interest) form.elements.interest.value = link.dataset.interest;
    });
  });
  form.elements.interest.addEventListener('change', () => {
    if (form.elements.interest.value === 'Wallet Preparation API') track('wallet_prepare_api_interest');
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    const params = new URLSearchParams(location.search);
    const lines = [
      'GasFree4you Business — API consultation', '',
      `Work Email: ${fields.email}`, `Company: ${fields.company}`,
      `Website: ${fields.website || 'Not provided'}`, `Business Type: ${fields.business_type}`,
      `Monthly TRC20 Transfers: ${fields.monthly_transfers || 'Not provided'}`,
      `Interested In: ${fields.interest}`, '', `Message: ${fields.message || 'Not provided'}`,
      '', 'Source: /business'
    ];
    if (document.referrer) {
      try { lines.push(`Referrer: ${new URL(document.referrer).origin}`); } catch {}
    }
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
      if (params.has(key)) lines.push(`${key}: ${params.get(key).slice(0, 200)}`);
    });
    // These events represent email draft intent, never a confirmed or saved lead.
    if (fields.interest === 'Wallet Preparation API') track('business_lead_wallet_prepare', { delivery: 'email_draft', confirmed: false });
    if (fields.interest === 'High-Volume Energy API') track('business_lead_volume_pricing', { delivery: 'email_draft', confirmed: false });
    location.href = `mailto:lina@gasfree4you.com?subject=${encodeURIComponent(`Business consultation — ${fields.company}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
    document.querySelector('#form-status').textContent = 'Email draft requested. Send it from your email app to complete your request. If no app opened, contact lina@gasfree4you.com directly. Nothing has been saved or sent by this website.';
  });
})();
