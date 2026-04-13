(function () {
  const images = [
    "images/about-1.jpg",
    "images/about-2.jpg",
    "images/about-3.jpg",
    "images/about-4.jpg",
    "images/about-5.jpg"
  ];

  const imgElement = document.getElementById("about-photo");
  if (!imgElement) return;

  const randomIndex = Math.floor(Math.random() * images.length);
  const dayIndex = new Date().getDate() % images.length;
   imgElement.src = images[randomIndex];
  //  imgElement.src = images[dayIndex];
})();
