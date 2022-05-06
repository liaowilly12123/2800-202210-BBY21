"use strict";
const loginForm = document.getElementById("login");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const emailNode = document.getElementById("login-email");
  const passwordNode = document.getElementById("login-password");

  const res = await fetch("/api/user/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailNode.value,
      password: passwordNode.value,
    }),
  });
  const responseJson = await res.json();

  if (responseJson.success) {
    if (responseJson.payload.userType == "admin") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/profile";
    }
  } else {
    console.error(responseJson.payload);
  }
});
