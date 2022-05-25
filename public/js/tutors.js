'use strict';
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
  modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

const registerForm = document.getElementById('tutor');
registerForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const educationNode = document.getElementById('tutor-education');
    const experienceNode = document.getElementById('tutor-experience');
    const contact = document.getElementById('tutor-contact');
    const subject = document.getElementById('tutor-subject');
    const info = document.getElementById('tutor-info');


    const res = await fetch('/api/tutor/info', {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            higherEducation: educationNode.value,
            experience: experienceNode.value,
            contact: contact.value,
            topics: subject.value,
            pricing: info.value,
        }),
    });
    modal.style.display = "none";
    const responseJson = await res.json();
    if (responseJson.success) {
        console.log('Registered Succesfully');
    } else {
        console.log(responseJson);
        console.error('problem in registering');
    }
});