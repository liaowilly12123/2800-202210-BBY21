'use strict';
import Modal from '/js/modal/modal.js';
import { showToast } from '/js/toast.js';

const params = new URLSearchParams(location.search);
const userId = params.get('userId');

const qualificationsModal = new Modal(
  'tutorQualifications',
  document.getElementById('tutorQualificationsForm')
);

document
  .getElementById('addQualificationsButton')
  .addEventListener('click', () => qualificationsModal.show());

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
const registerForm = document.getElementById('tutorQualificationsForm');

registerForm.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
});

registerForm.addEventListener('submit', async (e) => {
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
    showToast('success', 'Information Updated');
    setTutorInfo();
    qualificationsModal.hide();
  } else {
    showToast('error', responseJson.payload);
  }
});

async function setTutorInfo() {
  const qualificationsRes = await fetch(`/api/tutor/info?userId=${userId}`);
  const qualificationsJson = await qualificationsRes.json();

  if (qualificationsJson.success) {
    const pload = qualificationsJson.payload;
    document.getElementById('pricing').innerText =
      '$' + pload.pricing.$numberDecimal + '/hr' ?? '';
    document.getElementById('highestEducation').innerText =
      pload.higherEducation ?? '';

    const topicsElem = document.getElementById('topics');
    topicsElem.replaceChildren();

    pload.topics.forEach((topic) => {
      let topicElem = document.createElement('div');
      topicElem.innerText = topic;
      topicElem.classList.add('topic');

      topicsElem.appendChild(topicElem);
    });
  } else {
    showToast('error', qualificationsJson.payload);
  }
}

await setTutorInfo();
