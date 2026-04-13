
fetch("data/private-availability.json")
  .then(res => res.json())
  .then(data => {
    renderPrivateCalendar(data);
    addDatesToTableHeader("private-schedule");
  })
  .catch(err => console.error("Error loading private availability:", err));


function renderPrivateCalendar(data) {
  const tbody = document.querySelector("#private-schedule tbody");
  tbody.innerHTML = "";

  const days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ];

  data.timeSlots.forEach(time => {
    const row = document.createElement("tr");
    row.innerHTML = `<td class="time">${time}</td>`;

    days.forEach(day => {
      const available = data.week[day] && data.week[day][time];
      if (available) {
        row.insertAdjacentHTML("beforeend", `<td class="slot private-slot">Available </td>`);
      } else {
        row.insertAdjacentHTML("beforeend", `<td class="empty"></td>`);
      }
    });

    tbody.appendChild(row);
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
    if (th.querySelector(".day-date")) retur
    th.innerHTML = `
      <div class="day-name">${dayName}</div>
      <div class="day-date">${formattedDate}</div>
    `;
  });
}
