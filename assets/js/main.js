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

  /* ---------- maqueta de la portada ---------- */
  // Negocios de ejemplo (ficticios) para enseñar cómo quedaría una web.
  const BUSINESSES = {
    peluqueria: {
      name: 'Estudio Alma', type: 'Peluquería y estética', theme: 'alma',
      tagline: 'Cortes, color y cuidado en el centro de Sevilla.',
      status: 'Abierto, cierra a las 20:00', cta: 'Pedir cita por WhatsApp',
      items: [['Corte y peinado', '22 €'], ['Color completo', '45 €'], ['Manicura', '15 €']],
      rating: '4,9', reviews: '128 reseñas'
    },
    bar: {
      name: 'El Patio', type: 'Bar de tapas', theme: 'patio',
      tagline: 'Tapas caseras y menú del día junto a la plaza.',
      status: 'Abierto, cocina hasta las 23:30', cta: 'Reservar mesa',
      items: [['Tapa del día', '3,50 €'], ['Montadito de pringá', '2,80 €'], ['Menú de mediodía', '12 €']],
      rating: '4,7', reviews: '342 reseñas'
    },
    taller: {
      name: 'Talleres Ruiz', type: 'Taller mecánico', theme: 'ruiz',
      tagline: 'Mecánica, neumáticos y pre-ITV con presupuesto sin compromiso.',
      status: 'Abierto, cierra a las 19:00', cta: 'Pedir presupuesto',
      items: [['Cambio de aceite', '49 €'], ['Revisión pre-ITV', '25 €'], ['Neumáticos', 'desde 55 €']],
      rating: '4,8', reviews: '96 reseñas'
    },
    fisio: {
      name: 'Fisio Triana', type: 'Fisioterapia', theme: 'triana',
      tagline: 'Fisioterapia deportiva y tratamiento del dolor de espalda.',
      status: 'Cerrado, abre mañana a las 9:00', cta: 'Reservar sesión', closed: true,
      items: [['Sesión de fisioterapia', '35 €'], ['Masaje deportivo', '40 €'], ['Bono de 5 sesiones', '160 €']],
      rating: '5,0', reviews: '74 reseñas'
    }
  };

  const mock = $('#mock');
  const bizTabs = $$('.showcase-tabs [role="tab"]');
  function renderMock(key) {
    const b = BUSINESSES[key];
    mock.className = `phone-screen theme-${b.theme}`;
    mock.innerHTML = `
      <div class="m-status"><span>9:41</span><span class="m-url">${b.name.toLowerCase().replace(/[^a-z]+/g, '')}.es</span></div>
      <div class="m-head"><span class="m-logo">${b.name}</span><span class="m-menu" aria-hidden="true"></span></div>
      <div class="m-hero">
        <p class="m-type">${b.type}</p>
        <p class="m-title">${b.tagline}</p>
        <p class="m-open${b.closed ? ' is-closed' : ''}"><i></i>${b.status}</p>
        <span class="m-btn">${b.cta}</span>
        <span class="m-btn m-btn-ghost">Cómo llegar</span>
      </div>
      <div class="m-list">
        ${b.items.map(([n, p]) => `<p><span>${n}</span><span>${p}</span></p>`).join('')}
      </div>
      <div class="m-rating"><span class="m-stars" aria-hidden="true">★★★★★</span> ${b.rating} · ${b.reviews} en Google</div>
      <div class="m-map" aria-hidden="true"><i></i></div>`;
  }
  const selectBiz = (tab) => {
    bizTabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
    });
    renderMock(tab.dataset.biz);
  };
  bizTabs.forEach((t, i) => {
    t.addEventListener('click', () => selectBiz(t));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = bizTabs[(i + (e.key === 'ArrowRight' ? 1 : bizTabs.length - 1)) % bizTabs.length];
      selectBiz(next);
      next.focus();
    });
  });
  renderMock('peluqueria');

  /* ---------- configurador de precio ---------- */
  const boxes = $$('.configurator input[name="extra"]');
  const lines = $('#summary-lines');
  const emptyMsg = $('#summary-empty');
  const onceEl = $('#total-once');
  const monthEl = $('#total-month');
  const live = $('#summary-live');
  const waBtn = $('#summary-whatsapp');
  const configField = $('#config-field');
  const formConfig = $('#form-config');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Anima suavemente el cambio de una cifra
  function animateNumber(el, to, format) {
    const from = Number(el.dataset.value || to);
    el.dataset.value = to;
    if (reduceMotion || from === to) { el.textContent = format(to); return; }
    const start = performance.now();
    const dur = 380;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = format(Math.round(from + (to - from) * eased));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    el.classList.remove('is-bumped'); void el.offsetWidth; el.classList.add('is-bumped');
  }

  let prevKeys = new Set();
  function updateConfigurator() {
    const chosen = boxes.filter((b) => b.checked).map((b) => ({
      key: b.value,
      label: b.dataset.label,
      price: Number(b.dataset.price),
      monthly: b.dataset.type === 'mes'
    }));
    const once = BASE_PRICE + chosen.filter((c) => !c.monthly).reduce((s, c) => s + c.price, 0);
    const monthly = chosen.filter((c) => c.monthly).reduce((s, c) => s + c.price, 0);

    lines.innerHTML = chosen.map((c) =>
      `<li class="${prevKeys.has(c.key) ? '' : 'is-new'}"><span>${c.label}</span><span>${eur(c.price)}${c.monthly ? '/mes' : ''}</span></li>`
    ).join('');
    prevKeys = new Set(chosen.map((c) => c.key));
    emptyMsg.hidden = chosen.length > 0;

    animateNumber(onceEl, once, eur);
    animateNumber(monthEl, monthly, (n) => (n ? `${eur(n)}` : 'Sin cuota'));
    $('#price-bar-total').textContent = `${eur(once)}${monthly ? ` + ${eur(monthly)}/mes` : ''}`;
    live.textContent = `Total: ${eur(once)} de pago único${monthly ? ` y ${eur(monthly)} al mes` : ''}.`;

    const all = ['Web a medida', ...chosen.map((c) => c.label)];
    const summary = `${all.join(', ')}. Total: ${eur(once)}${monthly ? ` + ${eur(monthly)}/mes` : ''}`;
    const text = `Hola, quiero una web para mi negocio con: ${summary}.`;
    waBtn.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
    configField.value = summary;
    formConfig.textContent = `Tu selección: ${summary}`;
    formConfig.hidden = chosen.length === 0;

    boxes.forEach((b) => b.closest('.extra').classList.toggle('is-checked', b.checked));
  }
  boxes.forEach((b) => b.addEventListener('change', updateConfigurator));
  // El enlace dentro de una opción no debe marcar la casilla
  $$('.extra a').forEach((a) => a.addEventListener('click', (e) => e.stopPropagation()));
  updateConfigurator();

  /* ---------- barra de total en móvil ---------- */
  // Visible mientras se eligen extras y el resumen no está en pantalla.
  const priceBar = $('#price-bar');
  const visible = { options: false, summary: false };
  const syncBar = () => {
    const show = visible.options && !visible.summary;
    priceBar.classList.toggle('is-visible', show);
    document.body.classList.toggle('price-bar-on', show);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.target.matches('.config-options')) visible.options = en.isIntersecting;
        else visible.summary = en.isIntersecting;
      });
      syncBar();
    });
    io.observe($('.config-options'));
    io.observe($('.config-summary'));
  }

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
