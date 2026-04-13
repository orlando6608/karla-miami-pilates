fetch("data/packages.json")
  .then(res => res.json())
  .then(data => renderPackages(data.packages))
  .catch(err => console.error("Error loading packages:", err));

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
        <li>Photographer: ${pkg.photographer}</li>
      </ul>

      <p class="price">${pkg.price}</p>

      <a href="mailto:contact@karlamiami.com" class="btn btn-primary">
        Request information
      </a>
    `;

    container.appendChild(card);
  });
}
