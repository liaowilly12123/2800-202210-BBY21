'use strict';

const registerForm = document.getElementById('tutor');
const button = document.getElementById('buttons')
registerForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const educationNode = document.getElementById('tutor-education');
    const experienceNode = document.getElementById('tutor-experience');
    const contact = document.getElementById('tutor-contact');
    const subject = document.getElementById('tutor-subject');
    const info = document.getElementById('tutor-info');


    const res = await fetch('/api/tutor/qualifications', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            higherEducation: educationNode.value,
            experience: experienceNode.value,
            contactNumber: contact.value,
            subject: subject.value,
            pay: info.value,
        }),
    });

    const responseJson = await res.json();
    if (responseJson.success) {
        console.log('Registered Succesfully');
        window.location.href = "/upload";
    } else {
        console.log(responseJson);
        console.error('problem in registering');
    }
});
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
  
    // Set info on profile
    setProfileData(payload);
    document.getElementById('editButton').addEventListener('click', showModal);
    document.getElementById('editTint').addEventListener('click', hideModal);
    document.getElementById('edit-education').placeholder = payload.higherEducation;
    document.getElementById('edit-experience').placeholder = payload.experience;
    document.getElementById('edit-contact').placeholder = payload.contactNumber;
    document.getElementById('edit-subject').placeholder = payload.subject;
    document.getElementById('edit-pay').placeholder = payload.hourlyPay;
    // Other edits
    document.getElementById('editForm').addEventListener('submit', async (e) => {
      e.preventDefault();
    const education = document.getElementById('edit-education');
    const experience = document.getElementById('edit-experience');
    const contact = document.getElementById('edit-contact');
    const sub = document.getElementById('edit-subject');
    const pay = document.getElementById('edit-pay');
    const res = await fetch(`/api/user/info1?id=${userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload: removeEmpty({
          higherEducation: education.value || null,
          experience: experience.value || null,
          contactNumber: contact.value || null,
          subject: sub.value || null,
          hourlyPay : pay.value|| null,
        }),
      })
      })
    const responseJson = await res.json();

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


