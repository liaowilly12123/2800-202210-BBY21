'use strict';

import { showToast } from '/js/toast.js';
import Modal from '/js/modal/modal.js';

const params = new URLSearchParams(location.search);
const userId = params.get('id');

const editModal = new Modal('postToTimeline', document.getElementById('postForm'));
document
    .getElementById('postButton')
    .addEventListener('click', () => editModal.show());

function setPostData(payload) {
    document.getElementById('fname').innerText = payload.postDescription;
}

async function setPostImage() {
    const postImage = await fetch('/api/user/postPicture');
    const postJSON = await postImage.json();
    if (postJSON.success) {
        document.getElementById('postImage').src = postJSON.payload.path;
        return true;
    } else {
        showToast('error', postJSON.payload);
        return false;
    }
}

const postInfoRes = await fetch(`/api/user/info?id=${userId}`);
const postInfo = await userInfoRes.json();

if (userInfo.success) {
    setPostImage();

    const payload = postInfo.payload;

    // Set info on profile
    setPostData(payload);

    document.getElementById('edit-description').placeholder = 'Whats on your mind?';

    document.getElementById('postForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const filePicker = document.getElementById('edit-image');

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
                await fetch('/api/user/uploadPostPicture', {
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
        const postDescriptionElem = document.getElementById('edit-description');

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
            setPostData(responseJson.payload);
            await setProfilePic();
            editModal.hide();
            showToast('success', 'Profile Updated Successfully');
        } else {
            showToast('error', responseJson.payload);
        }
    });
} else {
    window.location.href = '/';
}

// https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
function removeEmpty(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}