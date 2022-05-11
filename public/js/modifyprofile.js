"use strict";

const save = document.getElementById("save-button")

let toggle = () => {

    let element = document.getElementById("save-button");
    let element2 = document.getElementById("edit-button");
    let element3 = document.getElementById("password");
    let element4 = document.getElementById("password-label")

    let hidden = element.getAttribute("hidden");

    if (element.hidden) {
        element.removeAttribute("hidden");
    } else {
        element.setAttribute("hidden", "hidden");
    }

    if (element2.hidden) {
        element2.removeAttribute("hidden");
    } else {
        element2.setAttribute("hidden", "hidden");
    }

    if (element3.hidden) {
        element3.removeAttribute("hidden");
    } else {
        element3.setAttribute("hidden", "hidden");
    }

    if (element4.hidden) {
        element4.removeAttribute("hidden");
    } else {
        element4.setAttribute("hidden", "hidden");
    }
}

document.getElementById("edit-button").addEventListener("click", async (e) => {
    e.preventDefault();
    toggle();
    
    const firstname = document.getElementById("firstName");
    firstname.disabled = false;

    const lastname = document.getElementById("lastName");
    lastname.disabled = false;

    const email = document.getElementById("email");
    email.disabled = false;

    const password = document.getElementById("password");
    password.disabled = false;
})

document.getElementById("save-button").addEventListener("click", async (e) => {
    e.preventDefault();
    toggle();
    
    const firstname = document.getElementById("firstName");
    firstname.disabled = true;

    const lastname = document.getElementById("lastName");
    lastname.disabled = true;

    const email = document.getElementById("email");
    email.disabled = true;

    const password = document.getElementById("password");
    password.disabled = true;

    const res = await fetch("/api/user/info", {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            payload: {
                firstName: firstname.value || null,
                lastName: lastname.value || null,
                email: email.value || null,
                password: password.value || null
            }
        }),
    });
    
    const responseJson = await res.json();

    if (responseJson.success) {
        window.location.href = "/profile";
    } else {
        document.getElementById("error").innerText = responseJson.payload;
        setTimeout( () => {
            document.getElementById("error").innerText = "";
        }, 5000)
        
    }
})
