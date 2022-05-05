let currentPage = 1;
let totalPages = null;

async function setUsers(page) {
    if (currentPage === 1) {
        document.getElementById("prev").disabled = true
    } else {
        document.getElementById("prev").disabled = false
    }

    if (currentPage === totalPages) {
        document.getElementById("next").disabled = true
    } else {
        document.getElementById("next").disabled = false
    }

    const usersRes = await fetch(`/api/user/all?page=${page}`)
    const users = await usersRes.json()

    console.log(users)

    if (users.success) {
        const payload = users.payload

        const template = document.getElementById("userCardTemplate")
        const cardHolder = document.getElementById("cardHolder")

        if (totalPages == null) {
            totalPages = payload.totalPages
        }

        cardHolder.replaceChildren([])
        for (const user of payload.users) {
            const userCard = template.content.cloneNode(true)
            userCard.querySelector(".name").innerText = user.firstName + " " + user.lastName
            userCard.querySelector(".joinDate").innerText = user.joinDate
            cardHolder.appendChild(userCard)
        }
        updatePageNumber()
    }
}

function updatePageNumber() {
    document.getElementById("pnumcur").innerText = currentPage
    document.getElementById("pnumtotal").innerText = totalPages
}

setUsers(currentPage)

document.getElementById("next").addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        setUsers(currentPage)
    }
})

document.getElementById("prev").addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        setUsers(currentPage)
    }
})
