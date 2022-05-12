'use strict';
const params = new URLSearchParams(location.search);
const userId = params.get('id');

const userInfoRes = await fetch(`/api/user/info?id=${userId}`);
const userInfo = await userInfoRes.json();

function setProfileData(payload) {
  document.getElementById('name').innerText = payload.firstName;
  document.getElementById('userType').innerText = payload.userType;
}

function showModal() {
  document.getElementById('editModal').style.display = 'flex';
}

function hideModal() {
  document.getElementById('editModal').style.display = 'none';
}

async function setProfilePic() {
  // Load profile pic
  const profilepic = await fetch('/api/user/profilePicture');
  const profileJSON = await profilepic.json();
  if (profileJSON.success) {
    document.getElementById('profilePic').src = profileJSON.payload.path;
    return true;
  } else {
    return false;
  }
}

if (userInfo.success) {
  hideModal();
  setProfilePic();

  const payload = userInfo.payload;

  // Set info on profile
  setProfileData(payload);

  // modal stuff
  document.getElementById('editButton').addEventListener('click', showModal);
  document.getElementById('editTint').addEventListener('click', hideModal);

  document.getElementById('edit-fname').placeholder = payload.firstName;
  document.getElementById('edit-lname').placeholder = payload.lastName;
  document.getElementById('edit-password').placeholder = 'Password';

  document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const filePicker = document.getElementById('edit-profilepic');

    // Profile picture stuff
    if (filePicker.files.length !== 0) {
      const formData = new FormData();
      formData.append('myImage', filePicker.files[0]);

      const uploadRes = await fetch('/api/user/uploadphoto', {
        method: 'post',
        body: formData,
      });
      const uploadResJSON = await uploadRes.json();

      if (uploadResJSON.success) {
        await fetch('/api/user/uploadProfilePicture', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imgId: uploadResJSON.payload.id }),
        });
      }
    }

    // Other edits
    const firstNameElem = document.getElementById('edit-fname');
    const lastNameElem = document.getElementById('edit-lname');
    const passwordElem = document.getElementById('edit-password');

    const res = await fetch('/api/user/info', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: removeEmpty({
          firstName: firstNameElem.value || null,
          lastName: lastNameElem.value || null,
          password: passwordElem.value || null,
        }),
      }),
    });

    const responseJson = await res.json();

    if (responseJson.success) {
      setProfileData(responseJson.payload);
      await setProfilePic();
      hideModal();
    } else {
    }
  });
} else {
  window.location.href = '/';
}

// https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
