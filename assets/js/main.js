(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const WHATSAPP = '34693005445';
  const BASE_PRICE = 525;
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
  // Negocios de ejemplo (ficticios): cada uno con su propia web, no un mismo molde recoloreado.
  const svg = (d, extra = '') => `<svg viewBox="0 0 16 16" aria-hidden="true"${extra}><path d="${d}"/></svg>`;
  const ICON = {
    lock: svg('M5 7V5a3 3 0 0 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v4a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5v-4A1.5 1.5 0 0 1 4.5 7H5zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2z'),
    phone: svg('M3.2 1.8h2.6l1.3 3.3-1.6 1.1a8.6 8.6 0 0 0 4.3 4.3l1.1-1.6 3.3 1.3v2.6a1.6 1.6 0 0 1-1.7 1.6A12.6 12.6 0 0 1 1.6 3.5a1.6 1.6 0 0 1 1.6-1.7z'),
    chat: svg('M8 1.5a6.5 6.5 0 0 0-5.7 9.6L1.4 14.6l3.6-.9A6.5 6.5 0 1 0 8 1.5zm-2.6 5.2c.3-.6.6-.6.9-.6l.5.1.7 1.5c0 .2 0 .3-.1.4l-.4.5c.5 1 1.3 1.7 2.3 2.2l.5-.5c.1-.2.3-.2.5-.1l1.4.7c.1.6-.2 1.2-.8 1.4-.6.2-1.4.1-2.7-.6a7 7 0 0 1-2.6-2.6c-.6-1.1-.6-1.9-.2-2.4z'),
    pin: svg('M8 1.2a4.8 4.8 0 0 0-4.8 4.8c0 3.6 4.8 8.8 4.8 8.8s4.8-5.2 4.8-8.8A4.8 4.8 0 0 0 8 1.2zm0 6.6a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6z'),
    star: svg('M8 1.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 11.9l-4.2 2.3.8-4.7-3.4-3.3 4.7-.7z'),
    menu: svg('M2 4.2h12v1.6H2zm0 3h12v1.6H2zm0 3h8v1.6H2z'),
    check: svg('M6.3 11.6 2.7 8l1.1-1.1 2.5 2.5 5.9-5.9 1.1 1.1z'),
    chevron: svg('M6 3.5 10.5 8 6 12.5l-1.1-1.1L8.3 8 4.9 4.6z'),
    plus: svg('M7.2 3h1.6v4.2H13v1.6H8.8V13H7.2V8.8H3V7.2h4.2z')
  };
  const stars = (n = 5) => `<span class="m-stars">${ICON.star.repeat(n)}</span>`;
  const openDot = (text, closed) => `<span class="m-open${closed ? ' is-closed' : ''}"><i></i>${text}</span>`;

  const MOCKS = {
    peluqueria: {
      domain: 'estudioalma.es', theme: 'alma',
      body: () => `
        <header class="m-bar">
          <span class="m-ico">${ICON.menu}</span>
          <span class="m-logo">Estudio Alma</span>
          <span class="m-link">Reservar</span>
        </header>
        <div class="m-photo m-photo-alma">
          <div class="m-photo-text">
            ${openDot('Abierto, cierra a las 20:00')}
            <p class="m-title">Cortes, color y cuidado en el centro de Sevilla</p>
          </div>
        </div>
        <section class="m-sec">
          <p class="m-h">Huecos libres hoy</p>
          <div class="m-chips">
            <span>16:30</span><span class="is-on">17:15</span><span>18:00</span><span>19:30</span>
          </div>
        </section>
        <section class="m-sec m-services">
          <p><span>Corte y peinado<small>45 min</small></span><b>22 €</b></p>
          <p><span>Color completo<small>1 h 30 min</small></span><b>45 €</b></p>
          <p><span>Manicura semipermanente<small>40 min</small></span><b>15 €</b></p>
        </section>
        <section class="m-sec m-team">
          <span class="m-avatars"><i style="--h:18">L</i><i style="--h:340">M</i><i style="--h:30">I</i></span>
          <span>Lucía, Marta e Inés<small>${stars()} 4,9 en Google</small></span>
        </section>
        <span class="m-float">${ICON.chat}Pedir cita por WhatsApp</span>`
    },
    bar: {
      domain: 'barelpatio.es', theme: 'patio',
      body: () => `
        <header class="m-bar">
          <span class="m-logo">El Patio<small>Bar de tapas</small></span>
          <span class="m-ico">${ICON.menu}</span>
        </header>
        <div class="m-photo m-photo-patio">
          <div class="m-photo-text">
            <p class="m-title">Tapas caseras junto a la plaza</p>
            ${openDot('Cocina abierta hasta las 23:30')}
          </div>
        </div>
        <nav class="m-tabs"><span class="is-on">Tapas</span><span>Raciones</span><span>Bebidas</span></nav>
        <section class="m-board">
          <p class="m-board-h">Hoy en la pizarra</p>
          <p><span>Espinacas con garbanzos</span><i></i><b>3,50</b></p>
          <p><span>Montadito de pringá</span><i></i><b>2,80</b></p>
          <p><span>Carrillada al Pedro Ximénez</span><i></i><b>4,20</b></p>
          <p><span>Menú de mediodía</span><i></i><b>12,00</b></p>
        </section>
        <section class="m-booking">
          <span class="m-field"><small>Personas</small>4</span>
          <span class="m-field"><small>Hoy</small>21:30</span>
          <span class="m-btn">Reservar mesa</span>
        </section>
        <p class="m-foot">${stars()} 4,7 de 342 reseñas en Google</p>`
    },
    taller: {
      domain: 'talleresruiz.es', theme: 'ruiz',
      body: () => `
        <header class="m-bar">
          <span class="m-logo"><b>R</b>Talleres Ruiz</span>
          <span class="m-ico">${ICON.phone}</span>
        </header>
        <section class="m-intro">
          ${openDot('Abierto, cierra a las 19:00')}
          <p class="m-title">Mecánica de confianza, con presupuesto antes de tocar nada</p>
          <span class="m-badge">${ICON.star}<b>4,8</b> 96 reseñas en Google</span>
        </section>
        <div class="m-actions">
          <span>${ICON.phone}Llamar</span>
          <span>${ICON.chat}WhatsApp</span>
          <span>${ICON.pin}Cómo llegar</span>
        </div>
        <section class="m-form">
          <p class="m-h">Pide cita en un minuto</p>
          <span class="m-plate"><i>E</i>4821 KLM</span>
          <span class="m-select">Revisión pre-ITV${ICON.chevron}</span>
          <span class="m-btn">Pedir presupuesto</span>
        </section>
        <section class="m-prices">
          <p><span>Cambio de aceite y filtro</span><b>49 €</b></p>
          <p><span>Revisión pre-ITV</span><b>25 €</b></p>
          <p><span>Neumáticos montados</span><b>desde 55 €</b></p>
        </section>`
    },
    fisio: {
      domain: 'fisiotriana.es', theme: 'triana',
      body: () => `
        <header class="m-bar">
          <span class="m-logo"><i></i>fisio triana</span>
          <span class="m-ico">${ICON.menu}</span>
        </header>
        <section class="m-intro">
          <p class="m-title">Vuelve a moverte sin dolor</p>
          <p class="m-sub">Fisioterapia deportiva y tratamiento de espalda en Triana.</p>
          ${openDot('Cerrado, abre mañana a las 9:00', true)}
        </section>
        <section class="m-cal">
          <p class="m-h">Elige día y hora</p>
          <div class="m-days">
            <span><small>lun</small>3</span><span class="is-on"><small>mar</small>4</span><span><small>mié</small>5</span><span><small>jue</small>6</span><span><small>vie</small>7</span>
          </div>
          <div class="m-slots">
            <span>9:00</span><span class="is-off">10:30</span><span class="is-on">12:00</span><span>17:30</span><span class="is-off">18:15</span><span>19:00</span>
          </div>
        </section>
        <section class="m-pro">
          <span class="m-avatars"><i style="--h:168">C</i></span>
          <span>Carmen Ortega<small>Fisioterapeuta colegiada, 12 años de experiencia</small></span>
          <b>${ICON.star}5,0</b>
        </section>
        <section class="m-treat">
          <p><span>Sesión de fisioterapia<small>50 min</small></span><b>35 €</b></p>
        </section>
        <span class="m-float">Reservar el martes a las 12:00</span>`
    }
  };

  const mock = $('#mock');
  const bizTabs = $$('.showcase-tabs [role="tab"]');
  function renderMock(key) {
    const m = MOCKS[key];
    mock.className = `phone-screen theme-${m.theme}`;
    mock.innerHTML = `
      <div class="m-status"><span>9:41</span><span class="m-sys" aria-hidden="true"><i></i><i></i><i></i><b></b></span></div>
      <div class="m-page">${m.body()}</div>
      <div class="m-browser" aria-hidden="true"><span>aA</span><span class="m-addr">${ICON.lock}${m.domain}</span><span>${ICON.plus}</span></div>`;
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

  /* ---------- aparición de secciones ---------- */
  // Cada bloque entra suavemente al llegar a él; sin movimiento si se ha pedido reducirlo.
  const revealEls = $$('main > section:not(.hero) .wrap > *, .footer .wrap > *');
  if ('IntersectionObserver' in window && !reduceMotion) {
    revealEls.forEach((el) => {
      el.classList.add('reveal');
      el.style.setProperty('--i', [...el.parentElement.children].indexOf(el));
      const done = (e) => {
        if (e.target !== el || !el.classList.contains('is-in')) return;
        el.classList.remove('reveal', 'is-in');
        el.removeEventListener('transitionend', done);
      };
      el.addEventListener('transitionend', done);
    });
    const show = (el) => { el.classList.add('is-in'); rio.unobserve(el); };
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) show(en.target); });
      // Lo que ya quedó por encima (salto con un enlace o scroll rápido) se muestra también
      $$('.reveal:not(.is-in)').forEach((el) => { if (el.getBoundingClientRect().bottom < 0) show(el); });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => rio.observe(el));
  }

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
