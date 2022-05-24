"use strict";
import Modal from "/js/modal/modal.js";

const filterModal = new Modal('filter', document.getElementById('filtersContainer'));

document.getElementById('filterButton').addEventListener('click', () => filterModal.show());
document.getElementById('topicsInput').addEventListener('keyup', addTopic);
document.getElementById('apply-filter').addEventListener('click', applyFilters);
document.getElementById('reset-filter').addEventListener('click', resetFilters);

let searchTopics = [];

function addTopic(e) {
  e.preventDefault();
  const topicInput = document.getElementById('topicsInput');

  if (e.key !== 'Enter') {
    return;
  }
  
  if (searchTopics.includes(topicInput.value)) {
    return;
  }

  searchTopics.push(topicInput.value);
  
  // add new pill with the topic
  const topicPillContainer = document.getElementById('topicPillContainer');
  const newPill = document.createElement('div');
  newPill.innerHTML = topicInput.value;
  topicPillContainer.appendChild(newPill);

  topicInput.value = '';
}

async function applyFilters() {
  const tutorsJSON = await getTutors();
  const tutors = tutorsJSON.payload.tutors;

  document.getElementById('tutorsList').innerHTML = '';
  createTutorCards(tutors);
}

function resetFilters() {
  document.getElementById('pricing-sort').value  = '';
  document.getElementById('rating-sort').value  = '';

  // Reset topic pills for filter
  searchTopics = [];
  document.getElementById('topicPillContainer').innerHTML = '';
}

async function getTutors() {

  const pricing = document.getElementById('pricing-sort').value;
  const rating = document.getElementById('rating-sort').value;

  const tutors = await fetch('/api/tutor/all', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topics: searchTopics,
      pricing: pricing,
      rating: rating
    }),
  });

  const tutorsJSON = await tutors.json();
  
  if (tutorsJSON.success) {
    return tutorsJSON;
  }
}


function createTutorCards(tutors) {
  const tutorsList = document.getElementById("tutorsList");
  const tutorsCardTemplate = document.getElementById("tutorsCardTemplate");

  for (const tutor of tutors) {
    const tutorsCard = tutorsCardTemplate.content.cloneNode(true);
    tutorsCard.querySelector(".tutorName").innerText = `${tutor.user_id.firstName} ${tutor.user_id.lastName}`
    tutorsCard.querySelector(".rating").innerText = `Rating: ${tutor.rating.$numberDecimal}`;
    tutorsCard.querySelector(".pricing").innerText = `$${tutor.pricing.$numberDecimal}/hr`;

    const tagsContainer = tutorsCard.querySelector(".tutorTags");
    for (const topic of tutor.topics) {
      const tag = document.createElement('span');
      tag.classList.add('pills');
      tag.innerText = topic;
      
      tagsContainer.appendChild(tag);
    }
    tutorsList.appendChild(tutorsCard);
  }
}

const tutorsJSON = await getTutors();
const tutors = tutorsJSON.payload.tutors;

createTutorCards(tutors);