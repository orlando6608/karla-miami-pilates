fetch("data/availability.json")
  .then(res => res.json())
  .then(data => {
    renderCalendar(data);
    renderLegend(data.gyms);
    addDatesToTableHeader("schedule");
  })
  .catch(err => console.error("Error loading availability:", err));

function renderCalendar(data) {
  const tbody = document.querySelector("#schedule tbody");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  data.timeSlots.forEach(time => {
    const row = document.createElement("tr");
    row.innerHTML = `<td class="time">${time}</td>`;
    days.forEach(day => {
      const slot = data.week[day] && data.week[day][time];
      if (slot) {
        const gym = data.gyms[slot.gym];
        row.insertAdjacentHTML("beforeend", `<td class="slot gym-${gym.id}"><a href="${gym.urlSchedule}" target="_blank"> ${slot.gym} </a></td>`);
      } else {
        row.innerHTML += `<td class="empty"></td>`;
      }
    });
    tbody.appendChild(row);
  });
}

function renderLegend(gyms) {
  const legend = document.getElementById("legend");
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  Object.keys(gyms).forEach((name, index) => {
    const gym = gyms[name];
    const encodedAddress = encodeURIComponent(gym.address);
    let mapsUrl;
    if (isIOS) {
      mapsUrl = `maps://?q=${encodedAddress}`;
    } else if (isAndroid) {
      mapsUrl = `geo:0,0?q=${encodedAddress}`;
    } else {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }
    const item = document.createElement("div");
    item.className = `legend-item gym-${gym.id}`;
    item.style.animationDelay = `${index * 0.1}s`;
    item.innerHTML = `
      <h4>${name}</h4>
      <p>${gym.address}</p>
      <a href="${mapsUrl}" target="_blank" rel="noopener">
        📍 Open in Maps
      </a>
      <br>
      <a href="${gym.url}" target="_blank" rel="noopener">
        🌐 Visit studio website
      </a>
    `;
    legend.appendChild(item);
  });
  
}

function addDatesToTableHeader(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const headerCells = table.querySelectorAll("thead th");

  // Get current date
  const today = new Date();

  // Calculate Monday of current week
  const day = today.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  headerCells.forEach((th, index) => {
    if (index === 0) return; // Skip "Time" column

    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + (index - 1));

    const formattedDate = currentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });

    const dayName = th.textContent;

    th.innerHTML = `
      <div class="day-name">${dayName}</div>
      <div class="day-date">${formattedDate}</div>
    `;
  });
}
