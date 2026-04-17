/* =========================================================
   Admin Panel — Karla Miami Pilates
   ========================================================= */

const API_BASE = "https://karlamiamiapi-ghf9hthvd5bbemae.eastus2-01.azurewebsites.net/api";
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

let availabilityData = null;
let privateData = null;
let packagesData = null;
let pendingCell = null;

// ── Auth ──
function login() {
  const pwd = document.getElementById("password").value;
  if (pwd === "karla123") {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    loadAll();
  } else {
    document.getElementById("login-error").textContent = "Incorrect password. Try again.";
  }
}

function logout() {
  document.getElementById("admin-panel").style.display = "none";
  document.getElementById("login-screen").style.display = "flex";
  document.getElementById("password").value = "";
}

// ── Load all data ──
async function loadAll() {
  const [a, p, pk] = await Promise.all([
    fetch(`${API_BASE}/GetAvailability`).then(r => r.json()),
    fetch(`${API_BASE}/GetPrivateAvailability`).then(r => r.json()),
    fetch(`${API_BASE}/GetPackages`).then(r => r.json()),
  ]);
  availabilityData = a;
  privateData = p;
  packagesData = pk;
  renderAvailabilityGrid();
  renderPrivateGrid();
  renderPackagesEditor();
}

// ── Tabs ──
function switchTab(name, btn) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${name}`).classList.add('active');
  btn.classList.add('active');
}

// ── Availability Grid ──
function renderAvailabilityGrid() {
  const container = document.getElementById("availability-grid");
  const gyms = availabilityData.gyms;
  const timeSlots = availabilityData.timeSlots;
  const week = availabilityData.week;

  let html = '<div class="schedule-grid">';
  html += '<div class="grid-header"></div>';
  DAYS.forEach(d => html += `<div class="grid-header">${d.slice(0,3)}</div>`);

  timeSlots.forEach(time => {
    html += `<div class="grid-time">${time}</div>`;
    DAYS.forEach(day => {
      const slot = week[day] && week[day][time];
      if (slot) {
        const gym = gyms[slot.gym];
        html += `
          <div class="grid-cell occupied gym-${gym.id}" data-day="${day}" data-time="${time}">
            <button class="remove-btn" onclick="removeClass('${day}','${time}',event)">✕</button>
            <span class="gym-label">${slot.gym.split(' ')[0]}</span>
          </div>`;
      } else {
        html += `<div class="grid-cell" data-day="${day}" data-time="${time}" onclick="openAddModal('${day}','${time}')">
          <span class="add-icon">+</span>
        </div>`;
      }
    });
  });

  html += '</div>';
  container.innerHTML = html;
}

function openAddModal(day, time) {
  pendingCell = { day, time };
  document.getElementById("modal-desc").textContent = `${day} at ${time}`;
  const select = document.getElementById("modal-gym");
  select.innerHTML = Object.keys(availabilityData.gyms)
    .map(name => `<option value="${name}">${name}</option>`).join('');
  document.getElementById("modal-overlay").classList.add('open');
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove('open');
  pendingCell = null;
}

function confirmAddClass() {
  const gymName = document.getElementById("modal-gym").value;
  const { day, time } = pendingCell;
  if (!availabilityData.week[day]) availabilityData.week[day] = {};
  availabilityData.week[day][time] = { gym: gymName };
  closeModal();
  renderAvailabilityGrid();
}

function removeClass(day, time, event) {
  event.stopPropagation();
  delete availabilityData.week[day][time];
  if (Object.keys(availabilityData.week[day]).length === 0) delete availabilityData.week[day];
  renderAvailabilityGrid();
}

// ── Private Grid ──
function renderPrivateGrid() {
  const container = document.getElementById("private-grid");
  const timeSlots = privateData.timeSlots;
  const week = privateData.week;

  let html = '<div class="private-grid">';
  html += '<div class="grid-header"></div>';
  DAYS.forEach(d => html += `<div class="grid-header">${d.slice(0,3)}</div>`);

  timeSlots.forEach(time => {
    html += `<div class="grid-time">${time}</div>`;
    DAYS.forEach(day => {
      const isAvailable = week[day] && week[day][time];
      html += `<div class="toggle-cell ${isAvailable ? 'available' : ''}" 
        onclick="togglePrivateSlot('${day}','${time}')"></div>`;
    });
  });

  html += '</div>';
  container.innerHTML = html;
}

function togglePrivateSlot(day, time) {
  if (!privateData.week[day]) privateData.week[day] = {};
  if (privateData.week[day][time]) {
    delete privateData.week[day][time];
    if (Object.keys(privateData.week[day]).length === 0) delete privateData.week[day];
  } else {
    privateData.week[day][time] = true;
  }
  renderPrivateGrid();
}

// ── Packages Editor ──
function renderPackagesEditor() {
  const container = document.getElementById("packages-editor");
  container.innerHTML = packagesData.packages.map((pkg, i) => `
    <div class="package-card">
      <h3>
        ${pkg.title}
        ${pkg.featured ? '<span class="featured-badge">Featured</span>' : ''}
      </h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Title</label>
          <input type="text" value="${pkg.title}" onchange="updatePackage(${i},'title',this.value)">
        </div>
        <div class="form-group">
          <label>Price</label>
          <input type="text" value="${pkg.price}" onchange="updatePackage(${i},'price',this.value)">
        </div>
        <div class="form-group">
          <label>Participants</label>
          <input type="text" value="${pkg.participants}" onchange="updatePackage(${i},'participants',this.value)">
        </div>
        <div class="form-group">
          <label>Duration</label>
          <input type="text" value="${pkg.duration}" onchange="updatePackage(${i},'duration',this.value)">
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" value="${pkg.location}" onchange="updatePackage(${i},'location',this.value)">
        </div>
        <div class="form-group">
          <label>Photo Session</label>
          <input type="text" value="${pkg.photoSession || ''}" onchange="updatePackage(${i},'photoSession',this.value)">
        </div>
        <div class="form-group full">
          <label>Description</label>
          <textarea onchange="updatePackage(${i},'description',this.value)">${pkg.description}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

function updatePackage(index, field, value) {
  packagesData.packages[index][field] = value;
}

// ── Save ──
async function saveCurrentTab() {
  const activeTab = document.querySelector('.tab-pane.active').id;
  const btn = document.getElementById("btn-save");
  const status = document.getElementById("save-status");

  btn.disabled = true;
  btn.textContent = "Saving…";
  status.textContent = "";
  status.className = "save-status";

  try {
    let url, body;
    if (activeTab === 'tab-availability') {
      url = `${API_BASE}/PostAvailability`;
      body = availabilityData;
    } else if (activeTab === 'tab-private') {
      url = `${API_BASE}/PostPrivateAvailability`;
      body = privateData;
    } else {
      url = `${API_BASE}/PostPackages`;
      body = packagesData;
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      status.textContent = "✓ Changes saved successfully";
      status.className = "save-status success";
    } else {
      throw new Error("Server error");
    }
  } catch (e) {
    status.textContent = "✕ Error saving. Please try again.";
    status.className = "save-status error";
  }

  btn.disabled = false;
  btn.textContent = "Save Changes";
  setTimeout(() => { status.textContent = ""; }, 4000);
}
