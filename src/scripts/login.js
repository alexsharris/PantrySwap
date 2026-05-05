// hiding login form and activating create new account form

document.getElementById("SignUpButton").addEventListener("click", () => {
  document.getElementById("LoginForm").classList.add("hidden");
  document.getElementById("SignUpForm").classList.toggle("hidden");
  document.getElementById("SignUpButton").classList.add("hidden");
});
