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

// Portada: listado de propiedades con filtro por tipo
const grid = document.getElementById('grid');
if (grid && window.PROPIEDADES) {
  const card = (p) => `
    <${p.url ? `a href="${p.url}"` : 'div'} class="card" data-tipo="${p.tipo}">
      <div class="ph">${p.foto ? `<img src="${p.foto}" alt="${p.titulo}" loading="lazy" onerror="this.remove()">` : ''}<span>Fotografía en preparación</span>${p.ejemplo ? '<b class="keep">Ficha de ejemplo</b>' : ''}</div>
      <div class="card-body">
        <p class="card-zone">${p.tipo} · ${p.zona}</p>
        <h3>${p.titulo}</h3>
        <p class="card-data">${p.datos.join(' · ')}</p>
        <p class="card-foot"><strong>${p.precio}</strong><span>${p.url ? 'Ver ficha →' : 'Ficha próximamente'}</span></p>
      </div>
    </${p.url ? 'a' : 'div'}>`;
  grid.innerHTML = window.PROPIEDADES.map(card).join('');
  const select = document.getElementById('propiedad');
  if (select) window.PROPIEDADES.forEach((p) => select.add(new Option(p.titulo)));
  document.querySelectorAll('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
      grid.querySelectorAll('.card').forEach((c) => { c.hidden = btn.dataset.filter !== 'Todas' && c.dataset.tipo !== btn.dataset.filter; });
    });
  });
}
