'use strict';
const params = new URLSearchParams(location.search);
const userId = params.get("id")

async function asyncMain() {
    const userInfoRes = await fetch(`/api/user/info?id=${userId}`)
    const userInfo = await userInfoRes.json()

    if (userInfo.success) {
        const payload = userInfo.payload
        document.getElementById("firstName").innerText = payload.firstName
        document.getElementById("lastName").innerText = payload.lastName
        document.getElementById("email").innerText = payload.email
        document.getElementById("type").innerText = payload.userType
        document.getElementById("joinDate").innerText = payload.joinDate
    } else {
        document.write(`<h1>${userInfo.payload}</h1>`)
    }
}

asyncMain()
