function login() {
  const pwd = document.getElementById("password").value;
  if (pwd === "karla123") {
    document.getElementById("editor").style.display = "block";
  } else {
    alert("Incorrect password");
  }
}
