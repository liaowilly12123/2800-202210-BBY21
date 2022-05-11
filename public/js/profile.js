"use strict";
const params = new URLSearchParams(location.search);
const userId = params.get("id");

async function asyncMain() {
  const userInfoRes = await fetch(`/api/user/info?id=${userId}`);
  const userInfo = await userInfoRes.json();

  if (userInfo.success) {
    const payload = userInfo.payload;
    document.getElementById("firstName").value = payload.firstName;
    document.getElementById("lastName").value = payload.lastName;
    document.getElementById("email").value = payload.email;
    document.getElementById("type").innerText = payload.userType;
    document.getElementById("joinDate").innerText = payload.joinDate;
  } else {
    window.location.href = "/";
  }
}

asyncMain();
