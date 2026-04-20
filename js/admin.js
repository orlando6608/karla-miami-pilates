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
  renderGymsEditor();
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
    if (activeTab === 'tab-availability' || activeTab === 'tab-studios') {
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

// ── Studios Editor ──
function renderGymsEditor() {
  const container = document.getElementById("studios-editor");
  const gyms = availabilityData.gyms;

  const gymsInUse = new Set();
  Object.values(availabilityData.week).forEach(daySlots => {
    Object.values(daySlots).forEach(slot => gymsInUse.add(slot.gym));
  });

  const cards = Object.entries(gyms).map(([name, gym]) => {
    const mt = gym.mt || {};
    return `
    <div class="studio-card">
      <div class="studio-card-header">
        <h3>${name}</h3>
        <button type="button" class="btn-remove-studio" onclick="removeGym('${name}')"
          ${gymsInUse.has(name) ? 'disabled title="Studio is in use in the schedule"' : ''}>Remove</button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Name</label>
          <input type="text" value="${name}" onchange="renameGym('${name}', this.value)">
        </div>
        <div class="form-group">
          <label>ID (CSS class)</label>
          <input type="text" value="${gym.id || ''}" onchange="updateGymField('${name}', 'id', this.value)">
        </div>
        <div class="form-group full">
          <label>Address</label>
          <input type="text" value="${gym.address || ''}" onchange="updateGymField('${name}', 'address', this.value)">
        </div>
        <div class="form-group">
          <label>Website URL</label>
          <input type="url" value="${gym.url || ''}" onchange="updateGymField('${name}', 'url', this.value)">
        </div>
        <div class="form-group">
          <label>Schedule URL</label>
          <input type="url" value="${gym.urlSchedule || ''}" onchange="updateGymField('${name}', 'urlSchedule', this.value)">
        </div>
        <div class="form-group">
          <label>MT Instructor ID</label>
          <input type="text" value="${mt.instructorId || ''}" onchange="updateGymMt('${name}', 'instructorId', this.value)">
        </div>
        <div class="form-group">
          <label>MT Location ID</label>
          <input type="text" value="${mt.locationId || ''}" onchange="updateGymMt('${name}', 'locationId', this.value)">
        </div>
      </div>
    </div>
  `}).join('');

  container.innerHTML = cards + `
    <button type="button" class="btn-add-studio" onclick="showAddStudioForm()">+ Add New Studio</button>
    <div id="add-studio-form" class="studio-card" style="display:none">
      <h3>New Studio</h3>
      <div class="form-grid">
        <div class="form-group">
          <label>Name</label>
          <input type="text" id="new-gym-name" placeholder="e.g. Pure Yoga">
        </div>
        <div class="form-group">
          <label>ID (CSS class suffix)</label>
          <input type="text" id="new-gym-id" placeholder="e.g. pure">
        </div>
        <div class="form-group full">
          <label>Address</label>
          <input type="text" id="new-gym-address" placeholder="e.g. 123 Main St, Miami, FL 33101">
        </div>
        <div class="form-group">
          <label>Website URL</label>
          <input type="url" id="new-gym-url" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>Schedule URL</label>
          <input type="url" id="new-gym-urlSchedule" placeholder="https://.../schedule">
        </div>
        <div class="form-group">
          <label>MT Instructor ID</label>
          <input type="text" id="new-gym-instructorId" placeholder="optional">
        </div>
        <div class="form-group">
          <label>MT Location ID</label>
          <input type="text" id="new-gym-locationId" placeholder="optional">
        </div>
      </div>
      <div class="modal-actions" style="margin-top:16px">
        <button type="button" class="btn-cancel" onclick="hideAddStudioForm()">Cancel</button>
        <button type="button" class="btn-confirm" onclick="confirmAddStudio()">Add Studio</button>
      </div>
    </div>
  `;
}

function renameGym(oldName, newName) {
  newName = newName.trim();
  if (!newName || newName === oldName) return;
  if (availabilityData.gyms[newName]) {
    alert(`A studio named "${newName}" already exists.`);
    renderGymsEditor();
    return;
  }
  availabilityData.gyms[newName] = availabilityData.gyms[oldName];
  delete availabilityData.gyms[oldName];
  Object.values(availabilityData.week).forEach(daySlots => {
    Object.values(daySlots).forEach(slot => {
      if (slot.gym === oldName) slot.gym = newName;
    });
  });
  renderGymsEditor();
}

function updateGymField(name, field, value) {
  availabilityData.gyms[name][field] = value.trim();
}

function updateGymMt(name, field, value) {
  if (!availabilityData.gyms[name].mt) availabilityData.gyms[name].mt = {};
  availabilityData.gyms[name].mt[field] = value.trim();
}

function removeGym(name) {
  if (!confirm(`Remove studio "${name}"?`)) return;
  delete availabilityData.gyms[name];
  renderGymsEditor();
}

function showAddStudioForm() {
  document.getElementById("add-studio-form").style.display = "block";
}

function hideAddStudioForm() {
  document.getElementById("add-studio-form").style.display = "none";
  ["new-gym-name","new-gym-id","new-gym-address","new-gym-url","new-gym-urlSchedule","new-gym-instructorId","new-gym-locationId"]
    .forEach(id => { document.getElementById(id).value = ""; });
}

function confirmAddStudio() {
  const name = document.getElementById("new-gym-name").value.trim();
  const id   = document.getElementById("new-gym-id").value.trim();
  if (!name || !id) { alert("Please fill in both Name and ID."); return; }
  if (availabilityData.gyms[name]) { alert(`A studio named "${name}" already exists.`); return; }

  const gym = { id };
  const address      = document.getElementById("new-gym-address").value.trim();
  const url          = document.getElementById("new-gym-url").value.trim();
  const urlSchedule  = document.getElementById("new-gym-urlSchedule").value.trim();
  const instructorId = document.getElementById("new-gym-instructorId").value.trim();
  const locationId   = document.getElementById("new-gym-locationId").value.trim();

  if (address)     gym.address = address;
  if (url)         gym.url = url;
  if (urlSchedule) gym.urlSchedule = urlSchedule;
  if (instructorId || locationId) gym.mt = { instructorId, locationId };

  availabilityData.gyms[name] = gym;
  renderGymsEditor();
}
