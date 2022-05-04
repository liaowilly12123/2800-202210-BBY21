const registerForm = document.getElementById("register");

registerForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const emailNode = document.getElementById("register-email");
    const passwordNode = document.getElementById("register-password");
    const FirstnameNode = document.getElementById("register-name");
    const LastnameNode = document.getElementById("register-name1");
    const type = document.getElementById("register-name2");

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

    const responseJson = await res.json()

    if (responseJson.status == 'success') {
        console.log("Registered Succesfully")
    } else {
        console.error(responseJson.msg)
    }
});