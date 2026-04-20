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
        onclick="openModal('${pkg.title}')">
        Request information
      </button>
    `;

    container.appendChild(card);
  });
}


const modal = document.getElementById("contact-modal");
const closeModalBtn = document.getElementById("close-modal");
const packageField = document.getElementById("package-field");

function openModal(packageTitle) {
  packageField.value = packageTitle;
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

closeModalBtn.addEventListener("click", closeModal);

// Close on backdrop click
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

/* EmailJS submit */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  submitBtn.classList.add("loading");
  submitBtn.disabled = true;
  status.textContent = "";


  emailjs.sendForm(
    "service_r2ll86x",
    "template_w0y10x9",
    form
  )
  
then(() => {
    status.textContent = "✅ Message sent successfully!";
    form.reset();
    setTimeout(closeModal, 1200);
  })
  .catch(() => {
    status.textContent = "❌ Could not send message. Please try again.";
  })
  .finally(() => {
    submitBtn.classList.remove("loading");
    submitBtn.disabled = false;
  });
});

