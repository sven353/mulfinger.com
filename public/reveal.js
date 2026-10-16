// Scroll-reveal: fades .reveal elements up as they enter the viewport.
// Loaded in <head> without defer so the "js" class is set before first paint:
// content is only hidden when this script runs, so visitors without JavaScript,
// crawlers and AI scrapers always see everything. External file keeps the CSP at script-src 'self'.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  function start() {
    var els = document.querySelectorAll('.reveal');
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
