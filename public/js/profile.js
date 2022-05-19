'use strict';

import { showToast } from '/js/toast.js';
import Modal from '/js/modal/modal.js';

const params = new URLSearchParams(location.search);
const userId = params.get('id');

var editor = new Quill('#post-description', {
  theme: 'snow',
});

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

async function setTimelinePosts() {
  const cardTemplate = document.getElementById('postCardTemplate');
  const postsGrid = document.getElementById('postsGrid');

  const userTimelineRes = await fetch(`/api/timeline/posts?user_id=${userId}`);
  const userTimeline = await userTimelineRes.json();

  if (userTimeline.success) {
    const posts = userTimeline.payload.posts;
    postsGrid.replaceChildren();

    for (const post of posts) {
      let postTemplate = cardTemplate.content.cloneNode(true);

      postTemplate.querySelector('.postCard').id = post._id;
      postTemplate.querySelector('.postCardImg').src = post.img;
      postTemplate.querySelector('.postCardTitle').innerText = post.heading;
      // postTemplate.querySelector('.postCardDesc').innerText = post.description;

      postsGrid.appendChild(postTemplate);

      setTimeout(function () {
        const descQuill = new Quill(`div[id="${post._id}"] > .postCardDesc`, {
          readOnly: true,
        });
        descQuill.setContents(JSON.parse(post.description));
      }, 0);
    }
  } else {
    showToast('error', userTimeline.payload);
  }
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
        const heading = document.getElementById('post-heading').value;

        const timelinePostRes = await fetch('/api/timeline/new', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            heading: heading,
            desc: JSON.stringify(editor.getContents()),
            img: uploadResJSON.payload.id,
          }),
        });

        const timelinePostResJson = await timelinePostRes.json();

        if (timelinePostResJson.success) {
          showToast('success', 'New post added');
          setTimelinePosts();
          addPostModal.hide();
        } else {
          showToast('error', timelinePostResJson.payload);
        }
      } else {
        showToast('error', uploadResJSON.payload);
        return;
      }
    }
  });

  setTimelinePosts();
} else {
  window.location.href = '/';
}

// https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
