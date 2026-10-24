(function () {
  var button = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (button && nav) {
    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        button.setAttribute('aria-expanded', 'false');
        nav.classList.remove('open');
        button.focus();
      }
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

  // Fig. 1: resin fills the crack port by port, bottom up, once the drawing is on screen.
  // Without JS, or with reduced motion, the drawing shows the finished repair.
  var fig = document.querySelector('[data-fig1]');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (fig && !still && 'IntersectionObserver' in window) {
    var replay = fig.querySelector('.fig1-replay');
    var root = getComputedStyle(document.documentElement);
    var page = root.getPropertyValue('--page').trim();
    var ink = root.getPropertyValue('--ink').trim();
    var easeOut = 'cubic-bezier(.22, 1, .36, 1)';
    var timeline = [];
    var step = function (selector, frames, duration, delay, easing) {
      fig.querySelectorAll(selector).forEach(function (el, i) {
        timeline.push([el, frames, { duration: duration, delay: delay(i), easing: easing || 'linear', fill: 'backwards' }]);
      });
    };
    // Inject at a port until resin shows at the next one, cap it, move up.
    step('.fig1-resin', [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], 950, function (i) { return i * 1200 + 100; }, easeOut);
    step('.fig1-port circle', [{ fill: page }, { fill: ink }], 200, function (i) { return i * 1200 + 1050; });
    step('.fig1-sec-resin', [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], 700, function () { return 2300; }, easeOut);
    step('.fig1-drops, .fig1-leaking', [{ opacity: 1 }, { opacity: 0 }], 400, function () { return 5900; }, 'ease');
    step('.fig1-sealed', [{ opacity: 0 }, { opacity: 1 }], 400, function () { return 6200; }, 'ease');

    // The "run" class shows the finished drawing; the animations hold each part at its start until its turn.
    var run = function () {
      timeline.forEach(function (t) {
        t[0].getAnimations().forEach(function (a) { a.cancel(); });
        t[0].animate(t[1], t[2]);
      });
      fig.classList.add('run');
    };
    fig.classList.add('armed');
    var seen = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      seen.disconnect();
      setTimeout(run, 350);
    }, { threshold: 0.4 });
    seen.observe(fig);
    if (replay) {
      replay.hidden = false;
      replay.addEventListener('click', run);
    }
  }
})();
