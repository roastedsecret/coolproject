/* Kova website script. Edit KOVA_CONFIG when you publish a new installer. */
window.KOVA_CONFIG = {
  // Direct link to the Windows installer. A GitHub Releases link that always points at the newest build works well:
  // https://github.com/<owner>/<repo>/releases/latest/download/Kova-Setup.exe
  downloadUrl: '',          // [INSTALLER URL]
  version: '[VERSION]',
  fileSize: '[FILE SIZE]',
  sha256: '[SHA-256 CHECKSUM]'
};

(function () {
  var cfg = window.KOVA_CONFIG;

  // Mobile menu
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.menu-toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Pricing: switch between yearly and monthly prices.
  var pricing = document.querySelector('[data-billing]');
  if (pricing) {
    var buttons = pricing.querySelectorAll('[data-set-billing]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var period = btn.getAttribute('data-set-billing');
        pricing.setAttribute('data-billing', period);
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        pricing.querySelectorAll('[data-' + period + ']').forEach(function (el) {
          el.textContent = el.getAttribute('data-' + period);
        });
      });
    });
  }

  // Start the hero sequence once the page has painted.
  var demo = document.querySelector('[data-demo]');
  if (demo) requestAnimationFrame(function () { demo.classList.add('play'); });

  // Fill installer details wherever they appear.
  document.querySelectorAll('[data-kova]').forEach(function (el) {
    var key = el.getAttribute('data-kova');
    if (cfg[key]) el.textContent = cfg[key];
  });

  // Tell visitors on other systems that the app is Windows-only for now.
  var ua = navigator.userAgent || '';
  var isWindows = /Windows/i.test(ua) && !/Windows Phone/i.test(ua);
  var other = document.querySelector('[data-not-windows]');
  if (other && !isWindows) other.classList.add('show');

  // Downloading page: start the download automatically.
  var starter = document.querySelector('[data-autostart]');
  if (starter) {
    var fallback = document.querySelector('[data-fallback]');
    var progress = document.querySelector('.progress');
    var missing = document.querySelector('[data-missing]');
    if (!cfg.downloadUrl) {
      if (missing) missing.classList.add('show');
      if (progress) progress.classList.add('done');
      return;
    }
    if (fallback) fallback.href = cfg.downloadUrl;
    setTimeout(function () {
      window.location.href = cfg.downloadUrl;
      if (progress) setTimeout(function () { progress.classList.add('done'); }, 1500);
    }, 900);
  }
})();
