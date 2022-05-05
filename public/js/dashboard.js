let currentPage = 1;

async function setUsers(page) {
    if (currentPage === 0) {
        document.getElementById("prev").disabled = true
    } else {
        document.getElementById("prev").disabled = false
    }

    const usersRes = await fetch(`/api/user/all?page=${page}`)
    const users = await usersRes.json()

    if (users.success) {
        const payload = users.payload

        const template = document.getElementById("userCardTemplate")
        const cardHolder = document.getElementById("cardHolder")

        cardHolder.replaceChildren([])
        for (const user of payload) {
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
}

setUsers(currentPage)

document.getElementById("next").addEventListener('click', () => {
    currentPage++;
    setUsers(currentPage)
})

document.getElementById("prev").addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        setUsers(currentPage)
    }
})
