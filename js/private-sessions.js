fetch("data/private-availability.json")
  .then(res => res.json())
  .then(data => renderPrivateCalendar(data))
  .catch(err => console.error("Error loading private availability:", err));

function renderPrivateCalendar(data) {
  const tbody = document.querySelector("#private-schedule tbody");
  tbody.innerHTML = "";

  const days = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
  ];

  data.timeSlots.forEach(time => {
    const row = document.createElement("tr");
    row.innerHTML = `<td class="time">${time}</td>`;

    days.forEach(day => {
      const available = data.week[day] && data.week[day][time];
      if (available) {
        row.insertAdjacentHTML(
          "beforeend",
          `<td class="slot private-slot">
             Available
           </td>`
        );
      } else {
        row.insertAdjacentHTML("beforeend", `<td class="empty"></td>`);
      }
    });

    tbody.appendChild(row);
  });
}