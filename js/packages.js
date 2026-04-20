// fetch("data/packages.json")
fetch("https://karlamiamiapi-ghf9hthvd5bbemae.eastus2-01.azurewebsites.net/api/GetPackages")
  .then(res => res.json())
  .then(data => renderPackages(data.packages))
  .catch(err => {
    console.error("Error loading packages:", err);
    const container = document.getElementById("packages-container");
    if (container) {
      container.innerHTML = `<p style="text-align:center;color:#999;">
        Package information unavailable. Please contact us directly.
      </p>`;
    }
  });

function renderPackages(packages) {
  const container = document.getElementById("packages-container");
  container.innerHTML = "";

  packages.forEach(pkg => {
    const card = document.createElement("article");
    card.className = "package-card";

    card.innerHTML = `
      <h3>${pkg.title}</h3>

      <ul>
        <li>${pkg.participants}</li>
        <li>${pkg.duration}</li>
        <li>${pkg.description}</li>
        <li>${pkg.location}</li>
        <li>Professional photo session: ${pkg.photoSession}</li>
      </ul>

      <p class="price">${pkg.price}</p>
      
      <button class="btn btn-primary"
        onclick="selectPackage('${pkg.title}')">
        Request information
      </button>
    `;

    container.appendChild(card);
  });
}

function selectPackage(title) {
  document.getElementById("package-field").value = title;
  document.getElementById("contact-section").style.display = "block";
  document.getElementById("contact-section").scrollIntoView({ behavior: "smooth" });
}

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  status.textContent = "Sending…";

  emailjs.sendForm(
    "service_r2ll86x",
    "template_w0y10x9",
    form
  )
  .then(() => {
    status.textContent = "✅ Message sent successfully!";
    form.reset();
  })
  .catch(error => {
    console.error("EmailJS error:", error);
    status.textContent = "❌ Error sending message. Please try again.";
  });
});
