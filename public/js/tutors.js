'use strict';

const registerForm = document.getElementById('tutor');
// const submit = document.getElementById('Submit');
// submit.onclick = function () {
//   document.getElementById('tutor').submit();
//   // document.getElementById('form2').submit();
// };
registerForm.addEventListener('submit', async (e) => {
  console.log('bruh');
  e.preventDefault();
  const educationNode = document.getElementById('tutor-education');
  const experienceNode = document.getElementById('tutor-experience');
  const FirstnameNode = document.getElementById('tutor-name');
  const LastnameNode = document.getElementById('tutor-name1');

  const res = await fetch('/api/tutor/qualifications', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      higherEducation: educationNode.value,
      experience: experienceNode.value,
      firstName: FirstnameNode.value,
      lastName: LastnameNode.value,
    }),
  });

  const responseJson = await res.json();
  if (responseJson.success) {
    console.log('Registered Succesfully');
  } else {
    console.log(responseJson);
    console.error('problem in registering');
  }
});

// const registerForm = document.getElementById('tutor');
// const button = document.getElementById('buttons')
// registerForm.addEventListener('submit', async(e) => {
//     console.log('bruh');
//     e.preventDefault();
//     const educationNode = document.getElementById('tutor-education');
//     const experienceNode = document.getElementById('tutor-experience');
//     const contact = document.getElementById('tutor-contact');
//     const subject = document.getElementById('tutor-subject');
//     const info = document.getElementById('tutor-info');


//     const res = await fetch('/api/tutor/qualifications', {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             higherEducation: educationNode.value,
//             experience: experienceNode.value,
//             contactNumber: contact.value,
//             subject: subject.value,
//             pay: info.value,
//         }),
//     });

//     const responseJson = await res.json();
//     if (responseJson.success) {
//         console.log('Registered Succesfully');
//         window.location.href = "/upload";
//     } else {
//         console.log(responseJson);
//         console.error('problem in registering');
//     }
// });
// button.addEventListener("click", async (e) => {
//     e.preventDefault();
//     const res = await fetch("/api/user/delete1", {
//         method: "DELETE",
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             userId: '628444c4a9300fc1e18216e5',
//         }),
//     });
//     const resJson = await res.json();
//     if (resJson.success) {
//         console.log('Registered Succesfully');
   
//     } else {
//         console.log(resJson);
//         console.error('problem in registering');
//     }
// })
const params = new URLSearchParams(location.search);
const userId = params.get('id');

const userInfoRes = await fetch(`/api/user/info1?id=${userId}`);
const userInfo = await userInfoRes.json();
console.log(userInfo);

function setProfileData(payload) {
    document.getElementById('tutor-education').innerText = payload.higherEducation;
    document.getElementById('tutor-experience').innerText = payload.experience;
    document.getElementById('tutor-contact').innerText = payload.contactNumber;
    document.getElementById('tutor-subject').innerText = payload.subject;
    document.getElementById('tutor-info').innerText = payload.hourlyPay;
}
  
  function showModal() {
    document.getElementById('editModal').style.display = 'flex';
  }
  
  function hideModal() {
    document.getElementById('editModal').style.display = 'none';
  }

  if (userInfo.success) {
    hideModal();
   
    const payload = userInfo.payload;
    console.log(payload);
  
    // Set info on profile
    setProfileData(payload);
    document.getElementById('editButton').addEventListener('click', showModal);
    document.getElementById('editTint').addEventListener('click', hideModal);
    document.getElementById('edit-fname').placeholder = payload.higherEducation;
    document.getElementById('edit-lname').placeholder = payload.experience;
    document.getElementById('edit-email').placeholder = payload.contactNumber;
    document.getElementById('edit-password').placeholder = 'Password';
    document.getElementById('edit-passwor').placeholder = payload.hourlyPay;
    // Other edits
    document.getElementById('editForm').addEventListener('submit', async (e) => {
      e.preventDefault();
    const firstNameElem = document.getElementById('edit-fname');
    const lastNameElem = document.getElementById('edit-lname');
    const emailElem = document.getElementById('edit-email');
    const passwordElem = document.getElementById('edit-password');
    const passwordElemt = document.getElementById('edit-passwor');
    const res = await fetch(`/api/user/info1?id=${userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: removeEmpty({
          higherEducation: firstNameElem.value || null,
          experience: lastNameElem.value || null,
          contactNumber: emailElem.value || null,
          subject: passwordElem.value || null,
          hourlyPay : passwordElemt.value|| null,
        }),
      })
      })
      console.log(firstNameElem.value);
    const responseJson = await res.json();
    console.log(responseJson);
    console.log(responseJson.payload.higherEducation);
    console.log(responseJson.payload.experience);
    if (responseJson.success) {
      setProfileData(responseJson.payload);
      hideModal();
      console.log("info")
    } else {
      console.log('error');
    }
  });

}
function removeEmpty(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}


