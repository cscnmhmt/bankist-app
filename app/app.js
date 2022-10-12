const loginBtn = document.querySelector(".login-btn");
const app = document.getElementById("app");
const loginScreen = document.getElementById("login");

loginBtn.addEventListener("click", displayApp);

function displayApp(e) {
  e.preventDefault();
  loginScreen.style.display = "none";
  setTimeout(() => {
    app.style.display = "grid";
  }, 500);
}
