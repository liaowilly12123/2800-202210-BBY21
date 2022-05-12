"use strict";
const params = new URLSearchParams(location.search);
const userId = params.get("id");

async function asyncMain() {
  const userInfoRes = await fetch(`/api/user/info?id=${userId}`);
  const userInfo = await userInfoRes.json();

  if (userInfo.success) {
    const payload = userInfo.payload;
    document.getElementById("firstName").innerText = payload.firstName;
    document.getElementById("lastName").innerText = payload.lastName;
    document.getElementById("email").innerText = payload.email;
    document.getElementById("type").innerText = payload.userType;
    document.getElementById("joinDate").innerText = payload.joinDate;
  } else {
    window.location.href = "/";
  }
}

asyncMain();

const image_input = document.querySelector("#image-input");

image_input.addEventListener("change", function() {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
  });
  reader.readAsDataURL(this.files[0]);
});
