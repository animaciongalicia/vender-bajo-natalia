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
['rent', 'costs', 'fees'].forEach((id) => $(id).addEventListener('input', updateCalc));
updateCalc();

// Formulario: abre el correo del visitante con la solicitud ya redactada
const form = document.getElementById('form');
const msg = document.getElementById('formMsg');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    msg.textContent = 'Rellena nombre, email y las dos preguntas para pedir la visita.';
    return;
  }
  if (!CONTACT_EMAIL) {
    msg.textContent = 'Formulario pendiente de conectar con un correo de contacto.';
    return;
  }
  const d = new FormData(form);
  const body = [
    `Nombre: ${d.get('nombre')}`,
    `Email: ${d.get('email')}`,
    `Interés: ${d.get('interes')}`,
    `Forma de pago: ${d.get('pago')}`,
    '',
    d.get('mensaje'),
  ].join('\n');
  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Visita al bajo de Bugallal Marchesi 22')}&body=${encodeURIComponent(body)}`;
  msg.textContent = 'Se ha abierto tu correo con la solicitud lista para enviar.';
});
