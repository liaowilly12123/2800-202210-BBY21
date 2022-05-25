'use strict';
var modal = document.getElementById("tutorModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
var submitbtn = document.getElementById("submit");
btn.onclick = function() {
  modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}
submitbtn.onclick = function() {
  modal.style.display = "none";
}
document.getElementById('tutor-subject').addEventListener('keyup', addTopic);

let searchTopics = [];

 function addTopic(e) {
  e.preventDefault();
  const topics = document.getElementById('tutor-subject');
  if (e.key !== 'Enter') {
    return;
  }
  if (searchTopics.includes(topics.value)) {
    return;
  }
  searchTopics.push(topics.value);
  const topicPillContainer = document.getElementById('topicPillContainer');
  const newPill = document.createElement('div');
  newPill.innerHTML = topics.value;
  newPill.className = 'newPill';
  topicPillContainer.appendChild(newPill);
  topics.value = '';
}
const educationNode = document.getElementById('tutor-education');
const experienceNode = document.getElementById('tutor-experience');
const contact = document.getElementById('tutor-contact');
const info = document.getElementById('tutor-info');
const registerForm = document.getElementById('tutor');
registerForm.addEventListener('submit', async(e) => {
    e.preventDefault();
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
            topics: searchTopics,
            pricing: info.value,
        }),
    });
    const responseJson = await res.json();
    if (responseJson.success) {
        console.log('updated Succesfully');
    } else {
        console.log(responseJson);
        console.error('problem in updating');
    }
});