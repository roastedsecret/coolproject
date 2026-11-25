/* Kova status page. Reads ../status.json (same site, no third parties).
   To report a problem, edit status.json: set a component's "status" and add an incident. */
(function () {
  var page = document.querySelector('[data-status-page]');
  if (!page) return;

  var LABELS = {
    operational: 'Working normally',
    degraded: 'Slower than usual',
    outage: 'Not working',
    maintenance: 'Planned maintenance'
  };
  var INCIDENT_LABELS = {
    investigating: 'Investigating',
    identified: 'Cause found',
    monitoring: 'Fix in place, monitoring',
    resolved: 'Resolved'
  };
  var RANK = { operational: 0, maintenance: 1, degraded: 2, outage: 3 };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function fmt(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return iso || '';
    return d.toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich' }) + ' (Zürich time)';
  }

  var banner = page.querySelector('[data-banner]');
  var title = page.querySelector('[data-banner-title]');
  var updated = page.querySelector('[data-updated]');
  var list = page.querySelector('[data-components]');
  var incidentsBox = page.querySelector('[data-incidents]');

  fetch('status.json', { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var comps = data.components || [];
      var worst = 'operational';
      comps.forEach(function (c) {
        var s = LABELS[c.status] ? c.status : 'operational';
        if (RANK[s] > RANK[worst]) worst = s;
        var li = el('li', 'component');
        li.appendChild(el('span', 'component-name', c.name));
        var badge = el('span', 'badge badge-' + s);
        badge.appendChild(el('span', 'badge-icon'));
        badge.appendChild(document.createTextNode(LABELS[s]));
        li.appendChild(badge);
        list.appendChild(li);
      });

      var headline = {
        operational: 'Everything is working normally',
        maintenance: 'Planned maintenance in progress',
        degraded: 'Some services are slower than usual',
        outage: 'Some services are not working'
      }[worst];
      banner.setAttribute('data-state', worst);
      title.textContent = headline;
      updated.textContent = data.updated ? 'Last updated ' + fmt(data.updated) : '';

      incidentsBox.innerHTML = '';
      var incidents = data.incidents || [];
      if (!incidents.length) {
        incidentsBox.appendChild(el('p', 'status-note', 'No incidents reported.'));
        return;
      }
      incidents.forEach(function (inc) {
        var art = el('article', 'incident');
        var head = el('div', 'incident-head');
        head.appendChild(el('h3', null, inc.title));
        head.appendChild(el('span', 'incident-state', INCIDENT_LABELS[inc.status] || inc.status));
        art.appendChild(head);
        if (inc.started) art.appendChild(el('p', 'status-note', 'Started ' + fmt(inc.started) + (inc.resolved ? ', resolved ' + fmt(inc.resolved) : '')));
        (inc.updates || []).forEach(function (u) {
          var p = el('p', 'incident-update');
          p.appendChild(el('b', null, fmt(u.time) + ': '));
          p.appendChild(document.createTextNode(u.text));
          art.appendChild(p);
        });
        incidentsBox.appendChild(art);
      });
    })
    .catch(function () {
      banner.setAttribute('data-state', 'unknown');
      title.textContent = 'Status is unavailable right now';
      updated.textContent = 'If Kova isn’t working for you, email support@joinkova.eu.';
      incidentsBox.innerHTML = '';
    });
})();
