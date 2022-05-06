"use strict";
const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const res = await fetch("/api/user/logout");
  const responseJSON = await res.json();

  if (responseJSON.success) {
    window.location.href = "/";
  }
});
