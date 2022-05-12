"use strict";
let currentPage = 1;
let totalPages = null;
let userIdClicked = "";
let isModalOpen = false;
let buttonType = "create";
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const userType = document.getElementById("userType");

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
  const usersRes = await fetch(`/api/user/all?page=${page}&limit=9`);
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
      userCard.querySelector(".joinDate").innerText = new Date(
        user.joinDate
      ).toDateString();
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
          userIdClicked = user._id;
        }
      });
      userCard.querySelector(".edit").addEventListener("click", async (e) => {
        e.preventDefault();
        displayEditButton();
        getUserInfo(user._id);
        setUserIdClicked(user._id);
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

function openModal() {
  document.getElementById("error").innerText = "";
  const modal = document.getElementsByClassName("modal");
  modal[0].classList.remove("hidden");
  isModalOpen = true;
}

function closeModal() {
  const modal = document.getElementsByClassName("modal");
  modal[0].classList.add("hidden");
  isModalOpen = false;
  clearFields();
}

function hideButton() {
  document
    .getElementById(`${buttonType}ButtonContainer`)
    .classList.add("hidden");
}

function displayButton() {
  document
    .getElementById(`${buttonType}ButtonContainer`)
    .classList.remove("hidden");
}

function clearFields() {
  firstName.value = '';
  lastName.value = '';
  email.value = '';
  password.value = '';
  userType.value = '';
}

function setUserIdClicked(userId) {
  userIdClicked = userId;
}

function displayEditButton() {
  buttonType = "update";
  displayButton();
  openModal();
}

async function updateUser(userId) {
  const response = await fetch(`/api/user/info?id=${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payload: {
        firstName: firstName.value || null,
        lastName: lastName.value || null,
        email: email.value || null,
        password: password.value || null,
        userType: userType.value || null,
      }
    }),
  });

  const responseJson = await response.json();

  if (responseJson.success) {
    closeModal();
  } else {
    document.getElementById("error").innerText = responseJson.payload;
  }
}

async function getUserInfo(userId) {
  const userInfo = await fetch(`/api/user/info?id=${userId}`);
  const userInfoJSON = await userInfo.json();

  if (userInfoJSON.success) {
    firstName.value = userInfoJSON.payload.firstName;
    lastName.value = userInfoJSON.payload.lastName;
    email.value = userInfoJSON.payload.email;
    password.value = userInfoJSON.payload.password;
    userType.value = userInfoJSON.payload.userType;
  }
}

document.getElementById('createUser').addEventListener('click', () => {
  buttonType = 'create';
  displayButton();
  openModal();
});

document.getElementById('modalClose').addEventListener('click', () => {
  hideButton();
  closeModal();
});

document.getElementById('createButton').addEventListener('click', async (e) => {
  e.preventDefault();

  const response = await fetch('/api/user/register', {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: firstName.value || null,
      lastName: lastName.value || null,
      email: email.value || null,
      password: password.value || null,
      userType: userType.value || null,
    }),
  });

  const responseJson = await response.json();

  if (responseJson.success) {
    hideButton();
    closeModal();
    setUsers(currentPage);
  } else {
    document.getElementById("error").innerText = responseJson.payload;
  }
});

document.getElementById('updateButton').addEventListener('click', async (e) => {
  e.preventDefault();
  await updateUser(userIdClicked);
  hideButton();
  closeModal();
  setUsers(currentPage);
});