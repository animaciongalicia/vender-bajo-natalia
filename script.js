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

// Calculadora de rentabilidad bruta
const rent = document.getElementById('rent');
const euro = (n) => n.toLocaleString('es-ES') + ' €';
function updateCalc() {
  const monthly = Number(rent.value);
  const yearly = monthly * 12;
  document.getElementById('rentOut').textContent = euro(monthly);
  document.getElementById('yearOut').textContent = euro(yearly);
  document.getElementById('yieldOut').textContent =
    ((yearly / PRICE) * 100).toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %';
}
rent.addEventListener('input', updateCalc);
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
