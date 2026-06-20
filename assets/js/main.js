/* ===== DEMO TOGGLE ===== */
const toggleButtons = document.querySelectorAll('.demo-toggle-bar button');
const views = {
  before: document.getElementById('view-before'),
  after:  document.getElementById('view-after')
};

toggleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    toggleButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[btn.dataset.view].classList.add('active');
  });
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.querySelector('.nav-hamburger');
const navLinks  = document.querySelector('nav .links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.textContent = isOpen ? '✕' : '☰';
});

// Cerrar el menú al hacer click en cualquier enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    hamburger.textContent = '☰';
  });
});
