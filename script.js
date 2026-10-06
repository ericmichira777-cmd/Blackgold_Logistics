

document.getElementById('year').textContent = new Date().getFullYear();


const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});


const form = document.getElementById('booking-form');
const confirmation = document.getElementById('confirmation');
const refNumberEl = document.getElementById('ref-number');
const stubDetails = document.getElementById('stub-details');
const newBookingBtn = document.getElementById('new-booking');

const truckLabels = {
  flatbed: 'Flatbed',
  box: 'Box truck / dry van',
  refrigerated: 'Refrigerated',
  tanker: 'Tanker & bulk'
};

function generateReference() {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `BGL-${year}-${random}`;
}

function markInvalidFields() {
  form.querySelectorAll('input, select').forEach(field => {
    field.classList.add('touched');
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    markInvalidFields();
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const reference = generateReference();

  refNumberEl.textContent = reference;

  const handling = data.getAll('handling');
  const summary = [
    ['Route', `${data.get('pickup')} → ${data.get('destination')}`],
    ['Pickup date', data.get('pickup-date') || '—'],
    ['Cargo', data.get('cargo-desc')],
    ['Weight', `${data.get('weight')} kg`],
    ['Truck type', truckLabels[data.get('truck-type')] || '—'],
    ['Handling', handling.length ? handling.join(', ') : 'Standard'],
    ['Contact', `${data.get('full-name')} · ${data.get('phone')}`]
  ];

  stubDetails.innerHTML = summary.map(([label, value]) => `
    <div>
      <dt>${label}</dt>
      <dd>${value}</dd>
    </div>
  `).join('');

  form.hidden = true;
  confirmation.hidden = false;
  confirmation.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

newBookingBtn.addEventListener('click', () => {
  form.reset();
  form.querySelectorAll('.touched').forEach(field => field.classList.remove('touched'));
  confirmation.hidden = true;
  form.hidden = false;
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
