
fetch("data/availability.json")
  .then(res => res.json())
  .then(data => {
    renderCalendar(data);
    renderLegend(data.gyms);
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
  const isMobile = navigator.userAgentData?.mobile ?? /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  Object.keys(gyms).forEach((name, index) => {
    const gym = gyms[name];
    const encodedAddress = encodeURIComponent(gym.address);

    let mapsUrl;
    if (isIOS) {
      // Apple Maps en iOS
      mapsUrl = `maps://?q=${encodedAddress}`;
    } else if (isAndroid) {
      // Google Maps app en Android — el esquema geo: abre la app nativa
      mapsUrl = `geo:0,0?q=${encodedAddress}`;
    } else {
      // Escritorio — Google Maps en navegador
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
