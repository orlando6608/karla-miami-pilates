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

      <a href="mailto:contact@karlamiami.com" class="btn btn-primary">
        Request information
      </a>
    `;

    container.appendChild(card);
  });
}
