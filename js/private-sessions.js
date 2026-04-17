
// fetch("data/private-availability.json")
fetch("https://karlamiamiapi-ghf9hthvd5bbemae.eastus2-01.azurewebsites.net/api/GetPrivateAvailability")
  .then(res => res.json())
  .then(data => {
    renderPrivateCalendar(data);
    addDatesToTableHeader("private-schedule");
  })
  .catch(err => {
    console.error("Error loading private availability:", err);
    const tbody = document.querySelector("#private-schedule tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#999;">
        Availability unavailable. Please contact us directly to book a session.
      </td></tr>`;
    }
  });


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
