fetch("data/availability.json")
  .then(res => res.json())
  .then(data => {
    renderCalendar(data);
    renderLegend(data.gyms);
    addDatesToTableHeader("schedule");
  })
  .catch(err => {
    console.error("Error loading availability:", err);
    const tbody = document.querySelector("#schedule tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#999;">
        Schedule unavailable. Please check back later or contact us directly.
      </td></tr>`;
    }
  });

// function renderCalendar(data) {
//   const tbody = document.querySelector("#schedule tbody");
//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
//   data.timeSlots.forEach(time => {
//     const row = document.createElement("tr");
//     row.innerHTML = `<td class="time">${time}</td>`;
//     days.forEach(day => {
//       const slot = data.week[day] && data.week[day][time];
//       if (slot) {
//         const gym = data.gyms[slot.gym];
//         row.insertAdjacentHTML("beforeend", `<td class="slot gym-${gym.id}"><a href="${gym.urlSchedule}" target="_blank"> ${slot.gym} </a></td>`);
//       } else {
//         row.innerHTML += `<td class="empty"></td>`;
//       }
//     });
//     tbody.appendChild(row);
//   });
// }

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
        const url = gym.mt
          ? generarEnlaceMT(gym.url, gym.mt.instructorId, gym.mt.locationId)
          : gym.urlSchedule;
        row.insertAdjacentHTML("beforeend",
          `<td class="slot gym-${gym.id}">
             <a href="${url}" target="_blank">${slot.gym}</a>
           </td>`);
      } else {
        row.insertAdjacentHTML("beforeend", `<td class="empty"></td>`);
      }
    });

    tbody.appendChild(row);
  });
}


/**
 * Genera el enlace dinámico para gimnasios con plataforma Mariana Tek.
 * @param {string} baseUrl - Ejemplo: 'https://puremotionpilates.us'
 * @param {string} instructorId - El ID de Karla en ese gimnasio.
 * @param {string} locationId - El ID de la sede.
 */
function generarEnlaceMT(baseUrl, instructorId, locationId) {
    // Obtenemos la fecha local en formato YYYY-MM-DD
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const fechaLocal = `${anio}-${mes}-${dia}`;

    // Limpiamos la URL base por si trae una barra al final
    const urlLimpia = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    // Construimos la URL con los escapes necesarios para el parámetro _mt
    if (urlLimpia.includes("https://puremotionpilates.us"))       
      {
         return `${urlLimpia}/schedule.html?_mt=%2Fschedule%2Fdaily%2F48541%3FactiveDate%3D${fechaLocal}%26instructors%3D${instructorId}%26locations%3D${locationId}`;
      } else{
          return `${urlLimpia}/schedule?_mt=%2Fschedule%2Fdaily%2F48541%3FactiveDate%3D${fechaLocal}%26instructors%3D${instructorId}%26locations%3D${locationId}`;
      }
}
// Ejemplo de uso:
// const linkPure = generarEnlaceMT('https://puremotionpilates.us', '6865', '48717');
// const linkVibrant = generarEnlaceMT('https://www.vpvibrantpilates.com', '6150', '48717');
// console.log(linkPure);

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


