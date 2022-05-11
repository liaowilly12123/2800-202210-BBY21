"use strict";
const registerForm = document.getElementById("register");

registerForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const emailNode = document.getElementById("register-email");
    const passwordNode = document.getElementById("register-password");
    const FirstnameNode = document.getElementById("register-name");
    const LastnameNode = document.getElementById("register-name1");
    const type = document.getElementById("helo");

    const res = await fetch("/api/user/register", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: emailNode.value,
            password: passwordNode.value,
            firstName: FirstnameNode.value,
            lastName: LastnameNode.value,
            userType: type.value,
        }),
    });

    const responseJson = await res.json();

    console.log(responseJson);

    if (responseJson.success) {
        console.log("Registered Succesfully");
        window.location.href = "/profile";
    } else {
        console.error("problem in registering");
    }
});