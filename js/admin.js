fetch("data/availability.json")
  .then(res => res.text())
  .then(text => {
    document.getElementById("jsonEditor").value = text;
  });

function downloadJSON() {
  const content = document.getElementById("jsonEditor").value;
  const blob = new Blob([content], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "availability.json";
  a.click();
}
