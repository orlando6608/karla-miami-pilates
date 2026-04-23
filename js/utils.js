/**
 * utils.js — Shared helpers for Karla Miami Pilates
 * Include this script before calendar.js and private-sessions.js
 */

async function loadFooter() {
  const placeholder = document.getElementById('site-footer');
  if (!placeholder) return;
  const res = await fetch('footer.html');
  const html = await res.text();
  placeholder.outerHTML = html;
}
loadFooter();

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
