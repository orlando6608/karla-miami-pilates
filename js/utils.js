/**
 * utils.js — Shared helpers for Karla Miami Pilates
 * Include this script before calendar.js and private-sessions.js
 */

function addDatesToTableHeader(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const headerCells = table.querySelectorAll("thead th");

  const today = new Date();
  const day = today.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  headerCells.forEach((th, index) => {
    if (index === 0) return; // Skip "Time" column
    if (th.querySelector(".day-date")) return; // Already rendered

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
    return `${urlLimpia}/schedule.html?_mt=%2Fschedule%2Fdaily%2F48541%3FactiveDate%3D${fechaLocal}%26instructors%3D${instructorId}%26locations%3D${locationId}`;
}

// Ejemplo de uso:
// const linkPure = generarEnlaceMT('https://puremotionpilates.us', '6865', '48717');
// const linkVibrant = generarEnlaceMT('https://www.vpvibrantpilates.com', '6150', '48717');
// console.log(linkPure);