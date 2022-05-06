"use strict";
let currentPage = 1;
let totalPages = null;

function setButtonsState() {
  if (currentPage === 1) {
    document.getElementById("prev").disabled = true;
  } else {
    document.getElementById("prev").disabled = false;
  }

  if (currentPage === totalPages) {
    document.getElementById("next").disabled = true;
  } else {
    document.getElementById("next").disabled = false;
  }
}

async function setUsers(page) {
  const usersRes = await fetch(`/api/user/all?page=${page}`);
  const users = await usersRes.json();

  if (users.success) {
    const payload = users.payload;

    const template = document.getElementById("userCardTemplate");
    const cardHolder = document.getElementById("cardHolder");

    if (totalPages == null) {
      totalPages = payload.totalPages;
    }

    cardHolder.replaceChildren([]);
    for (const user of payload.users) {
      const userCard = template.content.cloneNode(true);
      userCard.querySelector(".card").id = user._id;
      userCard.querySelector(".name").innerText =
        user.firstName + " " + user.lastName;
      userCard.querySelector(".joinDate").innerText = user.joinDate;
      userCard.querySelector(".delete").addEventListener("click", async (e) => {
        e.preventDefault();
        const res = await fetch("/api/user/delete", {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
          }),
        });
        const resJson = await res.json();

        if (resJson.success) {
          const currUserCard = document.getElementById(user._id);
          document.getElementById("cardHolder").removeChild(currUserCard);
          setUsers(currentPage);
        }
      });
      cardHolder.appendChild(userCard);
    }
    updatePageNumber();
    setButtonsState();
  }
}

function updatePageNumber() {
  document.getElementById("pnumcur").innerText = currentPage;
  document.getElementById("pnumtotal").innerText = totalPages;
}

setUsers(currentPage);

document.getElementById("next").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    setUsers(currentPage);
  }
});

document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    setUsers(currentPage);
  }
});
