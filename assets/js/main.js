  const buttons = document.querySelectorAll('.demo-toggle-bar button');
  const views = {
    before: document.getElementById('view-before'),
    after: document.getElementById('view-after')
  };
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      Object.values(views).forEach(v => v.classList.remove('active'));
      views[btn.dataset.view].classList.add('active');
    });
  });
