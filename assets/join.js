/* joinkova.eu/join: hands an invite link to the Kova app.
   The invite token is after the # in the link, so browsers never send it to any
   server, including this website's host. This script makes no network requests. */
(function () {
  var page = document.querySelector('[data-join]');
  if (!page) return;

  var token = (window.location.hash || '').slice(1);
  var title = document.querySelector('[data-join-title]');
  var status = document.querySelector('[data-join-status]');
  var progress = document.querySelector('[data-join-progress]');
  var missing = document.querySelector('[data-join-missing]');
  var open = document.querySelector('[data-join-open]');

  if (!/^[A-Za-z0-9_-]{16,128}$/.test(token)) {
    title.textContent = 'This invite link is incomplete.';
    status.hidden = true;
    progress.hidden = true;
    missing.classList.add('show');
    open.removeAttribute('href');
    open.setAttribute('aria-disabled', 'true');
    open.classList.add('is-disabled');
    return;
  }

  var appLink = 'kova://join?token=' + encodeURIComponent(token);
  open.href = appLink;

  // Take the invite out of the address bar so it isn't bookmarked or shared by accident.
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // Ask the browser to open Kova. If Kova isn't installed, nothing happens and the
  // buttons below take over.
  setTimeout(function () {
    window.location.href = appLink;
  }, 600);

  setTimeout(function () {
    progress.classList.add('done');
    status.textContent = "If Kova didn't open, use one of the options below.";
  }, 4000);
})();
