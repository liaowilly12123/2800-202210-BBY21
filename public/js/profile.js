const params = new URLSearchParams(location.search);
const tutorId = params.get("id")

async function asyncMain() {
    const tutorInfoRes = await fetch(`/api/tutor/info?id=${tutorId}`)
    const tutorInfo = await tutorInfoRes.json()

    if (tutorInfo.success) {
        const payload = tutorInfo.payload
        document.getElementById("firstName").innerText = payload.firstName
        document.getElementById("lastName").innerText = payload.lastName
        document.getElementById("email").innerText = payload.email
        document.getElementById("type").innerText = payload.userType
        document.getElementById("joinDate").innerText = payload.joinDate
    } else {
        document.write(`<h1>${tutorInfo.payload}</h1>`)
    }
}

asyncMain()