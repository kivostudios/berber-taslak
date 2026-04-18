// ============================================
// ADMIN PANEL — JavaScript
// ============================================

const ADMIN_PASSWORD = 'barber2025'; // Wijzig dit wachtwoord!
const BOOKINGS_KEY = 'barber_bookings';
const AUTH_KEY = 'barber_admin_auth';

const monthsNl = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];

// ---- HELPERS ----
function getBookings() {
  return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
}

function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(d)} ${monthsNl[parseInt(m)-1]} ${y}`;
}

function statusBadge(status) {
  const labels = { pending: 'In afwachting', confirmed: 'Bevestigd', cancelled: 'Geannuleerd' };
  return `<span class="booking-status ${status}">${labels[status] || status}</span>`;
}

function actionButtons(id, status) {
  let btns = '';
  if (status !== 'confirmed') {
    btns += `<button class="admin-action-btn confirm" onclick="updateStatus('${id}','confirmed')">Bevestig</button>`;
  }
  if (status !== 'cancelled') {
    btns += `<button class="admin-action-btn cancel" onclick="updateStatus('${id}','cancelled')">Annuleer</button>`;
  }
  btns += `<button class="admin-action-btn delete" onclick="deleteBooking('${id}')">Verwijder</button>`;
  return btns;
}

function bookingRow(b) {
  return `
    <div class="booking-row" id="row-${b.id}">
      <div>
        <div class="booking-row-name">${b.name}</div>
        <div class="booking-row-phone">${b.phone}</div>
      </div>
      <div>
        <div class="booking-row-service">${b.service}</div>
        <div class="booking-row-price">€${b.price} · ${b.duration} min</div>
      </div>
      <div>
        <div class="booking-row-datetime">${formatDate(b.date)}</div>
        <div class="booking-row-time">${b.time}</div>
      </div>
      <div class="booking-row-actions">
        ${statusBadge(b.status)}
        ${actionButtons(b.id, b.status)}
      </div>
    </div>`;
}

function emptyState(msg) {
  return `<div class="admin-empty">${msg}</div>`;
}

// ---- STATUS ACTIONS ----
window.updateStatus = function(id, status) {
  const bookings = getBookings();
  const idx = bookings.findIndex(b => String(b.id) === String(id));
  if (idx === -1) return;
  bookings[idx].status = status;
  saveBookings(bookings);
  renderAll();
};

window.deleteBooking = function(id) {
  if (!confirm('Reservering verwijderen?')) return;
  const bookings = getBookings().filter(b => String(b.id) !== String(id));
  saveBookings(bookings);
  renderAll();
};

// ---- RENDER ----
function renderStats() {
  const bookings = getBookings();
  const today = todayStr();
  document.getElementById('stat-today').textContent = bookings.filter(b => b.date === today).length;
  document.getElementById('stat-total').textContent = bookings.length;
  document.getElementById('stat-confirmed').textContent = bookings.filter(b => b.status === 'confirmed').length;
  document.getElementById('stat-pending').textContent = bookings.filter(b => b.status === 'pending').length;
}

function renderRecent() {
  const bookings = getBookings().slice(-5).reverse();
  const el = document.getElementById('recent-list');
  el.innerHTML = bookings.length
    ? bookings.map(bookingRow).join('')
    : emptyState('Nog geen reserveringen.');
}

let currentFilter = 'all';

function renderBookings() {
  const all = getBookings().reverse();
  const filtered = currentFilter === 'all' ? all : all.filter(b => b.status === currentFilter);
  const el = document.getElementById('bookings-list');
  el.innerHTML = filtered.length
    ? filtered.map(bookingRow).join('')
    : emptyState('Geen reserveringen gevonden.');
}

function renderToday() {
  const today = todayStr();
  const bookings = getBookings().filter(b => b.date === today).sort((a,b) => a.time.localeCompare(b.time));
  const el = document.getElementById('today-list');

  const d = new Date();
  document.getElementById('today-full-date').textContent =
    `${d.getDate()} ${monthsNl[d.getMonth()]} ${d.getFullYear()}`;

  el.innerHTML = bookings.length
    ? bookings.map(bookingRow).join('')
    : emptyState('Geen afspraken vandaag.');
}

function renderAll() {
  renderStats();
  renderRecent();
  renderBookings();
  renderToday();
}

// ---- VIEWS ----
function showView(name) {
  document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(a => a.classList.remove('active'));
  document.getElementById(`view-${name}`)?.classList.add('active');
  document.querySelector(`[data-view="${name}"]`)?.classList.add('active');
}

// ---- AUTH ----
function showDashboard() {
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-dashboard').style.display = 'grid';

  const d = new Date();
  const dateEl = document.getElementById('admin-today-date');
  if (dateEl) dateEl.textContent = `${d.getDate()} ${monthsNl[d.getMonth()]} ${d.getFullYear()}`;

  renderAll();
}

function checkAuth() {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  // Auto-login if already authenticated
  if (checkAuth()) {
    showDashboard();
  }

  // Login form
  document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('login-password').value;
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      document.getElementById('login-error').style.display = 'none';
      showDashboard();
    } else {
      document.getElementById('login-error').style.display = 'block';
      document.getElementById('login-password').value = '';
    }
  });

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem(AUTH_KEY);
    location.reload();
  });

  // Nav links
  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showView(el.dataset.view);
    });
  });

  // Filter buttons
  document.querySelectorAll('.admin-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderBookings();
    });
  });
});
