document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.site-nav__toggle');
  const menu = document.getElementById('site-nav-menu');

  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const openMenu = () => {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Accordion: tap a parent item to expand/collapse its submenu,
  // instead of navigating (mobile only — desktop still hovers)
  menu.addEventListener('click', (e) => {
    const parentToggle = e.target.closest(
      '.site-nav__item.has-children > a, ' +
      '.site-nav__item.has-children > span, ' +
      '.site-nav__subitem.has-children > a, ' +
      '.site-nav__subitem.has-children > span'
    );

    if (!parentToggle) return;
    if (!window.matchMedia('(max-width: 53rem)').matches) return;
    e.preventDefault();
    e.stopPropagation();

    const item = parentToggle.parentElement;
    const isOpen = item.classList.contains('is-expanded');

    // Close sibling accordions at the same level
    const siblings = item.parentElement.children;
    for (const sib of siblings) {
      sib.classList.remove('is-expanded');
    }

    if (!isOpen) item.classList.add('is-expanded');
  });

  // Close on link click (mobile menu, not desktop dropdowns)
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeMenu();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== toggle) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
});
