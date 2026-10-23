(function () {
  var button = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (button && nav) {
    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
  }

  // Until a form handler is chosen, keep the quote form from posting to "#".
  document.querySelectorAll('form.quote-form').forEach(function (form) {
    if (form.dataset.connected === 'yes') return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var status = form.querySelector('.form-status');
      if (status) status.textContent = 'Draft preview: this form is not connected to an inbox yet.';
    });
  });
})();
