// AOS init
if (window.AOS) {
  AOS.init({ once: true, duration: 700, offset: 80 });
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');
  const mqMobile = window.matchMedia('(max-width: 960px)');

  if (!toggleBtn || !nav) return;

  // Utilidades
  const focusableSelector =
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    toggleBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');

    // No bloqueamos el body para permitir desplazamiento de la página.
    // En móviles modernos, esto ayuda a evitar el bug de "no baja".
    document.body.style.overscrollBehavior = open ? 'contain' : '';

    if (open) {
      // Enfocar el primer enlace del menú para accesibilidad
      const firstFocusable = nav.querySelector(focusableSelector);
      if (firstFocusable) firstFocusable.focus({ preventScroll: true });
      // Escuchar clic fuera para cerrar
      document.addEventListener('click', onClickOutside, true);
    } else {
      document.removeEventListener('click', onClickOutside, true);
      // Regresar el foco al botón
      toggleBtn.focus({ preventScroll: true });
    }
  }

  function onClickOutside(e) {
    if (!nav.classList.contains('is-open')) return;
    const clickInsideMenu = nav.contains(e.target);
    const clickOnToggle = toggleBtn.contains(e.target);
    if (!clickInsideMenu && !clickOnToggle) setOpen(false);
  }

  // Toggle
  toggleBtn.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
  });

  // Cerrar al hacer clic en un enlace (con scroll suave si es ancla)
  nav.addEventListener('click', (e) => {
    const link = e.target.closest('a.nav__link');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      setOpen(false);
      if (target) {
        // pequeño delay para asegurar cierre antes del desplazamiento
        setTimeout(
          () => target.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          80
        );
      }
    } else {
      // Navegación a otra página
      setOpen(false);
    }
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
    }

    // Pequeño "focus trap" cuando el panel está abierto
    if (e.key === 'Tab' && nav.classList.contains('is-open')) {
      const focusables = Array.from(nav.querySelectorAll(focusableSelector))
        .filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });

  // Si el viewport pasa a desktop, forzamos cerrar el panel
  function handleViewportChange(e) {
    if (!e.matches) {
      // Ya NO estamos en móvil -> cerrar menú y limpiar estilos
      if (nav.classList.contains('is-open')) setOpen(false);
      document.body.style.overscrollBehavior = '';
    }
  }
  mqMobile.addEventListener('change', handleViewportChange);

  // Seguridad: al cargar en desktop, asegurar cerrado
  if (!mqMobile.matches) setOpen(false);
});
