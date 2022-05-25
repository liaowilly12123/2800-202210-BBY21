'use strict';

import { showToast } from '/js/toast.js';
import Modal from '/js/modal/modal.js';
import ModalFactory from '/js/modal/modalFactory.js';

const params = new URLSearchParams(location.search);
const userId = params.get('userId');

let currentPostId = '';
let currentImages = [];
let isOwner = false;

var editor = new Quill('#post-description', {
  theme: 'snow',
});

var editDescEditor = new Quill(`#post-edit-description`, {
  theme: 'snow',
});

const editModal = new Modal('editProfile', document.getElementById('editForm'));
document
  .getElementById('editButton')
  .addEventListener('click', () => editModal.show());

const addPostModal = new Modal('addPost', document.getElementById('postForm'));

const deleteConfirmationModal = ModalFactory.getConfirmationModal(
  'Are you sure you wanna delete this?',
  () => 0
);

const editPostModal = new Modal(
  'editPost',
  document.getElementById('postEditForm')
);

document.getElementById('addPostButton').addEventListener('click', () => {
  document.getElementById('post-image').value = '';
  addPostModal.show();
});

function setProfileData(payload) {
  document.getElementById('fname').innerText = payload.firstName;
  document.getElementById('lname').innerText = payload.lastName;
  document.getElementById('userType').innerText =
    payload.userType.slice(0, 1).toUpperCase() + payload.userType.slice(1);
}

async function updatePost(newData) {
  const res = await fetch('/api/timeline/update', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      postId: currentPostId,
      payload: newData,
    }),
  });
  const resJson = await res.json();

  if (resJson.success) {
    editPostModal.hide();
    showToast('success', 'Post Updated Succesfully');
    setTimelinePosts();
  } else {
    showToast('error', resJson.payload);
  }
}

function setDeletableImagesInEditModal(images) {
  const holder = document.getElementById('uploadedImagesContainer');
  holder.replaceChildren();

  const template = document.getElementById('uploadedImage');

  for (const image of images) {
    const newDiv = template.content.cloneNode(true);
    newDiv.querySelector('.deletableImg').src = image.img;

    newDiv
      .querySelector('.imgDelete')
      .addEventListener('click', async function (e) {
        e.preventDefault();

        if (currentImages.length === 1) {
          return showToast('error', 'Post needs atleast one image');
        }

        currentImages = currentImages.filter((cimg) => cimg._id != image._id);

        document
          .getElementById('uploadedImagesContainer')
          .removeChild(this.parentNode);
      });

    holder.appendChild(newDiv);
  }
}

async function setTimelinePosts() {
  const cardTemplate = document.getElementById('postCardTemplate');
  const postsGrid = document.getElementById('postsGrid');

  const userTimelineRes = await fetch(`/api/timeline/posts?userId=${userId}`);
  const userTimeline = await userTimelineRes.json();

  if (userTimeline.success) {
    const posts = userTimeline.payload.posts;
    postsGrid.replaceChildren();

    for (const post of posts) {
      let postTemplate = cardTemplate.content.cloneNode(true);

      postTemplate.querySelector('.postCard').id = post._id;
      postTemplate.querySelector('.postCardImg').src = post.img[0].img;
      postTemplate.querySelector('.postCardTitle').innerText = post.heading;
      // postTemplate.querySelector('.postCardDesc').innerText = post.description;

      postTemplate.querySelector('.edit').addEventListener('click', (e) => {
        e.preventDefault();

        setDeletableImagesInEditModal(post.img);

        currentPostId = post._id;
        currentImages = post.img;

        document.getElementById('post-edit-heading').placeholder = post.heading;
        document.getElementById('post-edit-image').value = '';
        editDescEditor.setContents(JSON.parse(post.description));
        editPostModal.show();
      });

      postTemplate
        .querySelector('.delete')
        .addEventListener('click', async (e) => {
          e.preventDefault();
          deleteConfirmationModal.show(async () => {
            deleteConfirmationModal.hide();
            const res = await fetch('/api/timeline/delete', {
              method: 'DELETE',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                postId: post._id,
              }),
            });
            const resJson = await res.json();
            if (resJson.success) {
              showToast('success', 'Deleted Succesfully');
              setTimelinePosts();
            } else {
              showToast('error', resJson.payload);
            }
          });
        });

      postsGrid.appendChild(postTemplate);

      setTimeout(function () {
        const descQuill = new Quill(`div[id="${post._id}"] .postCardDesc`, {
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
  const profilepic = await fetch(`/api/user/profilePicture?userId=${userId}`);
  const profileJSON = await profilepic.json();
  if (profileJSON.success) {
    document.getElementById('profilePic').src = profileJSON.payload.path;
    return true;
  } else {
    return false;
  }
}

async function uploadImages(filePicker) {
  if (filePicker.files.length !== 0) {
    const formData = new FormData();
    formData.append('myImage', filePicker.files[0]);

    const uploadRes = await fetch('/api/user/uploadphoto', {
      method: 'post',
      body: formData,
    });
    const uploadResJSON = await uploadRes.json();
    return uploadResJSON;
  }
}

async function uploadMultipleImages(filePicker) {
  if (filePicker.files.length !== 0) {
    const formData = new FormData();

    for (const file of filePicker.files) {
      formData.append('images', file);
    }

    const uploadRes = await fetch('/api/timeline/uploadphoto', {
      method: 'post',
      body: formData,
    });
    const uploadResJSON = await uploadRes.json();

    return uploadResJSON;
  } else {
    return {
      payload: { ids: [] },
    };
  }
}

const userInfoRes = await fetch(`/api/user/info?userId=${userId}`);
const userInfo = await userInfoRes.json();

if (userInfo.success) {
  setProfilePic();

  const payload = userInfo.payload;

  isOwner = payload.isOwner;

  // Set info on profile
  setProfileData(payload);

  document.getElementById('edit-fname').placeholder = payload.firstName;
  document.getElementById('edit-lname').placeholder = payload.lastName;
  document.getElementById('edit-email').placeholder = payload.email;
  document.getElementById('edit-password').placeholder = 'Password';

  document.getElementById('editForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const filePicker = document.getElementById('edit-profilepic');

    const uploadResJSON = await uploadImages(filePicker);

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

  document
    .getElementById('postEditForm')
    .addEventListener('submit', async function (e) {
      e.preventDefault();

      const newHeading = document.getElementById('post-edit-heading');
      const imagesUp = await uploadMultipleImages(
        document.getElementById('post-edit-image')
      );

      updatePost(
        removeEmpty({
          heading: newHeading.value || null,
          description: JSON.stringify(editDescEditor.getContents()),
          img: [...currentImages, ...imagesUp.payload.ids],
        })
      );
    });

  document.getElementById('postForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const filePicker = document.getElementById('post-image');

    if (filePicker.files.length !== 0) {
      const uploadResJSON = await uploadMultipleImages(filePicker);

      if (uploadResJSON.success) {
        const heading = document.getElementById('post-heading').value;

        const timelinePostRes = await fetch('/api/timeline/new', {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            heading: heading || null,
            desc: JSON.stringify(editor.getContents()) || null,
            img: uploadResJSON.payload.ids || null,
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
    } else {
      showToast('info', 'Post needs atleast one picture');
    }
  });

  await setTimelinePosts();

  if (!isOwner) {
    document.getElementById('addPostButton').style.display = 'none';
    document.getElementById('editButton').style.display = 'none';
    document
      .querySelectorAll('.edit')
      .forEach((v) => (v.style.display = 'none'));
    document
      .querySelectorAll('.delete')
      .forEach((v) => (v.style.display = 'none'));
  }
} else {
  window.location.href = '/';
}

// https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}
