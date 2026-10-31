(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const WHATSAPP = '34693005445';
  const BASE_PRICE = 275;
  const eur = (n) => `${n.toLocaleString('es-ES')} €`;

  /* ---------- menú móvil ---------- */
  const menuBtn = $('.menu-toggle');
  const nav = $('#mainnav');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- demo antes / después ---------- */
  const tabs = $$('.demo-tabs [role="tab"]');
  const selectTab = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      $(`#${t.getAttribute('aria-controls')}`).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectTab(t));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  /* ---------- configurador de precio ---------- */
  const boxes = $$('.configurator input[name="extra"]');
  const lines = $('#summary-lines');
  const onceEl = $('#total-once');
  const monthEl = $('#total-month');
  const monthRow = $('#total-month-row');
  const live = $('#summary-live');
  const waBtn = $('#summary-whatsapp');
  const configField = $('#config-field');
  const formConfig = $('#form-config');

  function updateConfigurator() {
    const chosen = boxes.filter((b) => b.checked).map((b) => ({
      label: b.dataset.label,
      price: Number(b.dataset.price),
      monthly: b.dataset.type === 'mes'
    }));
    const once = BASE_PRICE + chosen.filter((c) => !c.monthly).reduce((s, c) => s + c.price, 0);
    const monthly = chosen.filter((c) => c.monthly).reduce((s, c) => s + c.price, 0);

    const all = [{ label: 'Web a medida', price: BASE_PRICE, monthly: false }, ...chosen];
    lines.innerHTML = all.map((c) =>
      `<li><span>${c.label}</span><span>${eur(c.price)}${c.monthly ? '/mes' : ''}</span></li>`
    ).join('');

    onceEl.textContent = eur(once);
    monthEl.textContent = `${eur(monthly)}`;
    monthRow.hidden = monthly === 0;
    live.textContent = `Total: ${eur(once)} de pago único${monthly ? ` y ${eur(monthly)} al mes` : ''}.`;

    const summary = `${all.map((c) => c.label).join(', ')}. Total: ${eur(once)}${monthly ? ` + ${eur(monthly)}/mes` : ''}`;
    const text = `Hola, quiero una web para mi negocio con: ${summary}.`;
    waBtn.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
    configField.value = summary;
    formConfig.textContent = `Tu selección: ${summary}`;
    formConfig.hidden = chosen.length === 0;

    boxes.forEach((b) => b.closest('.extra').classList.toggle('is-checked', b.checked));
  }
  boxes.forEach((b) => b.addEventListener('change', updateConfigurator));
  updateConfigurator();

  /* ---------- formulario de contacto ---------- */
  const form = $('#contact-form');
  const status = $('#form-status');
  const submit = $('#contact-submit');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    submit.disabled = true;
    submit.textContent = 'Enviando…';
    status.hidden = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      updateConfigurator();
      status.className = 'form-status is-ok';
      status.textContent = 'Mensaje enviado. Te respondemos en menos de 24 horas.';
    } catch (err) {
      status.className = 'form-status is-error';
      status.innerHTML = 'No se ha podido enviar. Inténtalo de nuevo o <a href="https://wa.me/34693005445" target="_blank" rel="noopener">escríbenos por WhatsApp</a>.';
    } finally {
      status.hidden = false;
      submit.disabled = false;
      submit.textContent = 'Enviar mensaje';
    }
  });

  $('#year').textContent = new Date().getFullYear();
})();
