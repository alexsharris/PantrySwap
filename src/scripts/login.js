// hiding login form and activating create new account form

document.getElementById("SignUpButton").addEventListener("click", () => {
  document.getElementById("LoginForm").classList.add("hidden");
  document.getElementById("SignUpForm").classList.toggle("hidden");
  document.getElementById("SignUpButton").classList.add("hidden");
  document.getElementById("LoginButton").classList.remove("hidden");
});

// if user is on the sign up section and clicks on login

document.getElementById("LoginButton").addEventListener("click", () => {
  document.getElementById("LoginForm").classList.remove("hidden");
  document.getElementById("SignUpForm").classList.toggle("hidden");
  document.getElementById("SignUpButton").classList.remove("hidden");
  document.getElementById("LoginButton").classList.add("hidden");
});


// submitting the login form

const LoginForm = document
  .getElementById("LoginForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailLogin = document.getElementById("emailLogin").value;
    const passwordLogin = document.getElementById("passwordLogin").value;
    const RememberLogin = document.getElementById("RememberLogin").checked;

    // make the post request to get the user

    const Response = await fetch("/Login", {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailLogin, passwordLogin, RememberLogin }),
    });
    // response from a server is a getting redirected to another route(if successful)
    // this is for to check if the response has redirected attribute, set the window location href
    // to the url attribute attached to it

    if (Response.redirected) {
      window.location.href = Response.url;
    }
    else{
      document.getElementById("errorMsg").classList.remove("hidden");
    }
  });

// submitting the signup form

const SignUpForm = document
  .getElementById("SignUpForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const emailSignup = document.getElementById("emailSignup").value;
    const passwordSignup = document.getElementById("passwordSignup").value;
    const RememberSignup = document.getElementById("RememberSignup").checked;

    // making the post request to send new user info to the server

    const Response = await fetch("/SignUp", {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, emailSignup, passwordSignup, RememberSignup  }),
    });

    // redirecting them to home when signed up successfully
    if (Response.redirected) {
      window.location.href = Response.url;
    } else if (!Response.ok) {
      const data = await Response.json();
      const errorMsg = document.getElementById("signupErrorMsg");
      document.getElementById("signupErrorText").textContent = data.error;
      errorMsg.classList.remove("hidden");
    }
  });
