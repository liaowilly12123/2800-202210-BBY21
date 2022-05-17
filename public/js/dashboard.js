'use strict';
import { showToast } from '/js/toast.js';
import Modal from '/js/modal/modal.js';

let currentPage = 1;
let totalPages = null;
let userIdClicked = '';

const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const password = document.getElementById('password');
const userType = document.getElementById('userType');

const editCreateModal = new Modal(
  'editDeleteModal',
  document.getElementById('userForm')
);

function setButtonsState() {
  if (currentPage === 1) {
    document.getElementById('prev').disabled = true;
  } else {
    document.getElementById('prev').disabled = false;
  }

  if (currentPage === totalPages) {
    document.getElementById('next').disabled = true;
  } else {
    document.getElementById('next').disabled = false;
  }
}

async function setUsers(page) {
  const usersRes = await fetch(`/api/user/all?page=${page}&limit=9`);
  const users = await usersRes.json();

  if (users.success) {
    const payload = users.payload;

    const template = document.getElementById('userCardTemplate');
    const cardHolder = document.getElementById('cardHolder');

    totalPages = payload.totalPages;

    cardHolder.replaceChildren([]);
    for (const user of payload.users) {
      const userCard = template.content.cloneNode(true);
      userCard.querySelector('.card').id = user._id;
      userCard.querySelector('.name').innerText =
        user.firstName + ' ' + user.lastName;
      userCard.querySelector('.joinDate').innerText = new Date(
        user.joinDate
      ).toDateString();
      userCard.querySelector('.type').innerText = user.userType;

      userCard.querySelector('.delete').addEventListener('click', async (e) => {
        e.preventDefault();
        const res = await fetch('/api/user/delete', {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user._id,
          }),
        });
        const resJson = await res.json();

        if (resJson.success) {
          const currUserCard = document.getElementById(user._id);
          document.getElementById('cardHolder').removeChild(currUserCard);
          setUsers(currentPage);
          userIdClicked = user._id;
          showToast('success', 'User deleted');
        } else {
          showToast('error', resJson.payload);
        }
      });

      userCard.querySelector('.edit').addEventListener('click', async (e) => {
        e.preventDefault();

        displayButton('update');
        hideButton('create');
        clearFields();

        editCreateModal.show();

        setPlaceHolders(user);
        setUserIdClicked(user._id);
      });
      cardHolder.appendChild(userCard);
    }
    updatePageNumber();
    setButtonsState();
  } else {
    showToast('error', users.payload);
  }
}

function updatePageNumber() {
  document.getElementById('pnumcur').innerText = currentPage;
  document.getElementById('pnumtotal').innerText = totalPages;
}

setUsers(currentPage);

document.getElementById('next').addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    setUsers(currentPage);
  }
});

document.getElementById('prev').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    setUsers(currentPage);
  }
});

function hideButton(name) {
  document.getElementById(`${name}ButtonContainer`).classList.add('hidden');
}

function displayButton(name) {
  document.getElementById(`${name}ButtonContainer`).classList.remove('hidden');
}

function clearFields() {
  firstName.value = '';
  firstName.placeholder = 'First name';

  lastName.value = '';
  lastName.placeholder = 'Last name';

  email.value = '';
  email.placeholder = 'Email';

  password.value = '';
  password.placeholder = 'Password';

  userType.value = 'tutor';
}

function setUserIdClicked(userId) {
  userIdClicked = userId;
}

async function updateUser(userId) {
  const response = await fetch(`/api/user/info?id=${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payload: removeEmpty({
        firstName: firstName.value || null,
        lastName: lastName.value || null,
        email: email.value || null,
        password: password.value || null,
        userType: userType.value || null,
      }),
    }),
  });

  const responseJson = await response.json();

  if (responseJson.success) {
    showToast('success', 'Succesfully Updated');
  } else {
    showToast('error', responseJson.payload);
  }
}

async function setPlaceHolders(user) {
  firstName.placeholder = user.firstName;
  lastName.placeholder = user.lastName;
  email.placeholder = user.email;
  password.placeholder = 'password';
  userType.value = user.userType;
}

// https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

document.getElementById('createUser').addEventListener('click', () => {
  displayButton('create');
  hideButton('update');
  clearFields();
  editCreateModal.show();
});

document.getElementById('createButton').addEventListener('click', async (e) => {
  e.preventDefault();

  const response = await fetch('/api/user/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
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
    hideButton('create');
    setUsers(currentPage);
    showToast('success', 'Created user succesfully');
    editCreateModal.hide();
  } else {
    showToast('error', responseJson.payload);
  }
});

document.getElementById('updateButton').addEventListener('click', async (e) => {
  e.preventDefault();
  await updateUser(userIdClicked);
  setUsers(currentPage);
  editCreateModal.hide();
});
