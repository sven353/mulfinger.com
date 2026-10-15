// Mobile navigation drawer. Kept as an external file so the CSP can stay script-src 'self'.
(function () {
  var menu = document.getElementById('mobile-menu');
  var openBtn = document.getElementById('menu-open');
  if (!menu || !openBtn) return;
  function setOpen(open) {
    menu.classList.toggle('hidden', !open);
    openBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) { var c = menu.querySelector('button[data-close]'); if (c) c.focus(); }
    else openBtn.focus();
  }
  openBtn.addEventListener('click', function () { setOpen(true); });
  menu.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.classList.contains('hidden')) setOpen(false);
  });
})();
