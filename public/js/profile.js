'use strict';

import { showToast } from '/js/toast.js';
import Modal from '/js/modal/modal.js';

const params = new URLSearchParams(location.search);
const userId = params.get('id');

const editModal = new Modal('editProfile', document.getElementById('editForm'));
document
  .getElementById('editButton')
  .addEventListener('click', () => editModal.show());

const addPostModal = new Modal('addPost', document.getElementById('postForm'));

document
  .getElementById('addPostButton')
  .addEventListener('click', () => addPostModal.show());

function setProfileData(payload) {
  document.getElementById('fname').innerText = payload.firstName;
  document.getElementById('lname').innerText = payload.lastName;
  document.getElementById('userType').innerText =
    payload.userType.slice(0, 1).toUpperCase() + payload.userType.slice(1);
}

const cardTemplate = document.getElementById('postCardTemplate');

for (let i = 0; i < 50; i++) {
  let copy = cardTemplate.content.cloneNode(true);
  document.getElementById('postsGrid').appendChild(copy);
}

async function setProfilePic() {
  // Load profile pic
  const profilepic = await fetch('/api/user/profilePicture');
  const profileJSON = await profilepic.json();
  if (profileJSON.success) {
    document.getElementById('profilePic').src = profileJSON.payload.path;
    return true;
  } else {
    showToast('error', profileJSON.payload);
    return false;
  }
}

const userInfoRes = await fetch(`/api/user/info?id=${userId}`);
const userInfo = await userInfoRes.json();

if (userInfo.success) {
  setProfilePic();

  const payload = userInfo.payload;

  // Set info on profile
  setProfileData(payload);

  document.getElementById('edit-fname').placeholder = payload.firstName;
  document.getElementById('edit-lname').placeholder = payload.lastName;
  document.getElementById('edit-email').placeholder = payload.email;
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
      } else {
        showToast('error', uploadResJSON.payload);
        return;
      }
    }

    // Other edits
    const firstNameElem = document.getElementById('edit-fname');
    const lastNameElem = document.getElementById('edit-lname');
    const emailElem = document.getElementById('edit-email');
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
          email: emailElem.value || null,
          password: passwordElem.value || null,
        }),
      }),
    });

    const responseJson = await res.json();

    if (responseJson.success) {
      setProfileData(responseJson.payload);
      await setProfilePic();
      editModal.hide();
      showToast('success', 'Profile Updated Successfully');
    } else {
      showToast('error', responseJson.payload);
    }
  });

  document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('here');

    const filePicker = document.getElementById('post-image');

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
        console.log('heherhehr');
        const heading = document.getElementById('post-heading').value;
        const desc = document.getElementById('post-description').value;

        const ret = await fetch('/api/timeline/new', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            heading: heading,
            desc: desc,
            img: uploadResJSON.payload.id,
          }),
        });

        console.log(await ret.json());
      } else {
        showToast('error', uploadResJSON.payload);
        return;
      }
    }
  });
} else {
  window.location.href = '/';
}

// https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
