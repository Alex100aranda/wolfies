// AOS init (si lo usas)
if (window.AOS) AOS.init({ once: true, duration: 700, offset: 80 });

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');

  if (!toggleBtn || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    toggleBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  // Toggle simple
  toggleBtn.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
  });

  // Cerrar y desplazarse en anclas
  nav.addEventListener('click', (e) => {
    const link = e.target.closest('a.nav__link');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    setOpen(false);

    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      // compensa el header sticky (64px aprox.)
      const headerH = 64;
      const y = target.getBoundingClientRect().top + window.scrollY - headerH - 6;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
  });

  // Seguridad: al redimensionar a desktop, cierra
  window.addEventListener('resize', () => {
    if (window.innerWidth > 960 && nav.classList.contains('is-open')) setOpen(false);
  });
});
