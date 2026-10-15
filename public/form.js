// Executive diagnostic form: client-side validation and in-place confirmation.
// External file so the CSP can stay script-src 'self'.
(function () {
  var root = document.querySelector('[data-form-root]');
  if (!root || !window.fetch) return;
  var form = root.querySelector('form');
  var success = root.querySelector('[data-form-success]');
  var failure = root.querySelector('[data-form-error]');
  var button = root.querySelector('[data-submit]');
  var label = root.querySelector('[data-submit-label]');
  if (!form || !success) return;

  function setError(input, on) {
    input.setAttribute('aria-invalid', on ? 'true' : 'false');
    var msg = document.getElementById(input.id + '-error');
    if (msg) msg.classList.toggle('hidden', !on);
  }

  function validate() {
    var firstBad = null;
    form.querySelectorAll('input[required], textarea[required]').forEach(function (el) {
      if (el.type !== 'checkbox') {
        var value = el.value.trim();
        if (el.value !== value) el.value = value;
      }
      var ok = el.checkValidity();
      setError(el, !ok);
      if (!ok && !firstBad) firstBad = el;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  form.querySelectorAll('input[required], textarea[required]').forEach(function (el) {
    el.addEventListener('blur', function () { if (el.type !== 'checkbox' && el.value) setError(el, !el.checkValidity()); });
    el.addEventListener('change', function () { if (el.type === 'checkbox') setError(el, !el.checkValidity()); });
    el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') setError(el, !el.checkValidity()); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (failure) failure.classList.add('hidden');
    if (!validate()) return;

    button.disabled = true;
    if (label) label.textContent = 'Sending…';

    var body = new URLSearchParams(new FormData(form)).toString();
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.hidden = true;
        success.hidden = false;
        success.focus();
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(function () {
        if (failure) failure.classList.remove('hidden');
        button.disabled = false;
        if (label) label.textContent = 'Send';
      });
  });
})();
