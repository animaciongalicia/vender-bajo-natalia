// Dirección que recibe las solicitudes de visita. Vacía = formulario sin conectar.
const CONTACT_EMAIL = '';
const PRICE = 120000;

// Pestañas de los tres futuros
const tabs = document.querySelectorAll('[data-tab]');
const panels = document.querySelectorAll('[data-panel]');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    panels.forEach((p) => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
  });
});

// Calculadora para inversores
const $ = (id) => document.getElementById(id);
const euro = (n) => Math.round(n).toLocaleString('es-ES', { useGrouping: 'always' }) + ' €';
const dec = (n) => n.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
function updateCalc() {
  const rent = Number($('rent').value);
  const costs = Number($('costs').value);
  const fees = Number($('fees').value);
  const total = PRICE * (1 + fees / 100);
  const net = rent * 12 - costs;
  $('rentOut').textContent = euro(rent);
  $('costsOut').textContent = euro(costs);
  $('feesOut').textContent = dec(fees) + ' %';
  $('totalOut').textContent = euro(total);
  $('netOut').textContent = euro(net);
  if (net <= 0) {
    $('yieldOut').textContent = '—';
    $('paybackOut').textContent = '—';
    $('tenOut').textContent = 'Con estas cifras el alquiler no cubre los gastos.';
    return;
  }
  $('yieldOut').textContent = dec((net / total) * 100) + ' %';
  $('paybackOut').textContent = dec(total / net) + ' años';
  $('tenOut').innerHTML = `En 10 años habrás cobrado <strong>${euro(net * 10)}</strong> netos. Y el bajo sigue siendo tuyo.`;
}
if ($('rent')) {
  ['rent', 'costs', 'fees'].forEach((id) => $(id).addEventListener('input', updateCalc));
  updateCalc();
}

// Formulario: abre el correo del visitante con la solicitud ya redactada
const form = document.getElementById('form');
const msg = document.getElementById('formMsg');
if (form) form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    msg.textContent = 'Rellena los campos obligatorios para enviar la solicitud.';
    return;
  }
  if (!CONTACT_EMAIL) {
    msg.textContent = 'Formulario pendiente de conectar con un correo de contacto.';
    return;
  }
  const lines = [];
  new FormData(form).forEach((value, key) => lines.push(`${key}: ${value}`));
  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.dataset.subject || 'Contacto desde la web')}&body=${encodeURIComponent(lines.join('\n'))}`;
  msg.textContent = 'Se ha abierto tu correo con la solicitud lista para enviar.';
});

// Portada: listado de propiedades con buscador y filtro por tipo
const TIPOS = { local: 'Local comercial', vivienda: 'Vivienda' };
const ICONS = {
  m2: '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4zM4 9h3M4 14h3M9 20v-3M14 20v-3"/></svg>',
  dorm: '<svg viewBox="0 0 24 24"><path d="M3 18v-7h18v7M3 14h18M6 11V7h12v4M3 18v2M21 18v2"/></svg>',
  bano: '<svg viewBox="0 0 24 24"><path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM6 12V6a2 2 0 0 1 4 0"/></svg>',
};
const grid = document.getElementById('grid');
if (grid && window.PROPIEDADES) {
  const specs = (p) => [
    `<li>${ICONS.m2}${p.m2} m²</li>`,
    p.dormitorios ? `<li>${ICONS.dorm}${p.dormitorios} dorm.</li>` : '',
    p.banos ? `<li>${ICONS.bano}${p.banos} ${p.banos > 1 ? 'baños' : 'baño'}</li>` : '',
    ...(p.dormitorios ? [] : p.extras.map((x) => `<li>${x}</li>`)),
  ].join('');
  const card = (p) => `
    <a href="${p.url || `propiedades/vivienda.html?id=${p.id}`}" class="card t-${p.tipo}" data-id="${p.id}">
      <div class="ph">${p.foto ? `<img src="${p.foto}" alt="${p.titulo}" loading="lazy" onerror="this.remove()">` : ''}<span>Fotografía en preparación</span>
        <i class="badge">${TIPOS[p.tipo]}</i>${p.ejemplo ? '<b class="keep">Ficha de ejemplo</b>' : ''}</div>
      <div class="card-body">
        <p class="card-zone">${p.zona} · A Coruña</p>
        <h3>${p.titulo}</h3>
        <ul class="specs">${specs(p)}</ul>
        <p class="card-foot"><strong>${euro(p.precio)}</strong><span>Ver ficha →</span></p>
      </div>
    </a>`;
  grid.innerHTML = window.PROPIEDADES.map(card).join('');

  const search = document.getElementById('search');
  const zonas = document.getElementById('zonas');
  [...new Set(window.PROPIEDADES.map((p) => p.zona))].sort().forEach((z) => zonas.add(new Option(z)));
  const select = document.getElementById('propiedad');
  window.PROPIEDADES.forEach((p) => select.add(new Option(p.titulo)));
  const filterTabs = document.querySelectorAll('[data-filter]');

  function apply() {
    const { tipo, zona, max } = Object.fromEntries(new FormData(search));
    let shown = 0;
    window.PROPIEDADES.forEach((p) => {
      const ok = (!tipo || p.tipo === tipo) && (!zona || p.zona === zona) && (!max || p.precio <= Number(max));
      grid.querySelector(`[data-id="${p.id}"]`).hidden = !ok;
      if (ok) shown += 1;
    });
    document.getElementById('empty').hidden = shown > 0;
    filterTabs.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.filter === tipo)));
  }
  const setTipo = (tipo) => { search.elements.tipo.value = tipo; apply(); };
  search.addEventListener('submit', (e) => {
    e.preventDefault();
    apply();
    document.getElementById('propiedades').scrollIntoView({ behavior: 'smooth' });
  });
  filterTabs.forEach((b) => b.addEventListener('click', () => setTipo(b.dataset.filter)));
  document.querySelectorAll('[data-go]').forEach((l) => l.addEventListener('click', () => setTipo(l.dataset.go)));
}

// Ficha de vivienda: se rellena con los datos de propiedades.js según ?id=
const ficha = document.getElementById('ficha-vivienda');
if (ficha && window.PROPIEDADES) {
  const p = window.PROPIEDADES.find((x) => x.id === new URLSearchParams(location.search).get('id'));
  if (!p) {
    ficha.innerHTML = '<section><h1>Esta propiedad ya no está disponible.</h1><p><a class="link" href="../index.html#propiedades">Ver todas las propiedades →</a></p></section>';
  } else {
    document.title = `${p.titulo} · Ezasa Inmobiliaria`;
    $('ejemplo').hidden = !p.ejemplo;
    $('vZona').textContent = `${p.zona} · A Coruña`;
    $('vTitulo').textContent = p.titulo;
    $('vDesc').textContent = p.descripcion || '';
    const facts = [['Precio', euro(p.precio)], ['Superficie', `${p.m2} m²`], ['Dormitorios', p.dormitorios], ['Baños', p.banos]];
    $('vFacts').innerHTML = facts.filter((f) => f[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    if (p.foto) $('vFoto').insertAdjacentHTML('afterbegin', `<img src="${p.foto}" alt="${p.titulo}" onerror="this.remove()">`);
    $('vPunch').innerHTML = [[`${p.m2} m²`, 'bien distribuidos'], [p.dormitorios, p.dormitorios > 1 ? 'dormitorios' : 'dormitorio'], ...p.extras.slice(0, 2).map((x) => [x, 'en esta vivienda'])]
      .map(([a, b]) => `<div><strong>${a}</strong><span>${b}</span></div>`).join('');
    const rows = [['Zona', `${p.zona}, A Coruña`], ['Precio', euro(p.precio)], ['Precio por m²', euro(p.precio / p.m2)], ['Superficie', `${p.m2} m²`],
      ['Dormitorios', p.dormitorios], ['Baños', p.banos], ['Características', p.extras.join(' · ')]];
    $('vTabla').innerHTML = rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('');
    form.dataset.subject = `Visita: ${p.titulo} (${p.zona})`;

    const quota = () => {
      const down = Number($('down').value), years = Number($('years').value), rate = Number($('rate').value);
      const loan = p.precio * (1 - down / 100), r = rate / 1200, n = years * 12;
      const monthly = loan * r / (1 - Math.pow(1 + r, -n));
      $('downOut').textContent = `${down} %`;
      $('yearsOut').textContent = `${years} años`;
      $('rateOut').textContent = `${dec(rate)} %`;
      $('downEur').textContent = euro(p.precio - loan);
      $('loanOut').textContent = euro(loan);
      $('intOut').textContent = euro(monthly * n - loan);
      $('quotaOut').textContent = `${euro(monthly)}/mes`;
    };
    ['down', 'years', 'rate'].forEach((id) => $(id).addEventListener('input', quota));
    quota();
  }
}
