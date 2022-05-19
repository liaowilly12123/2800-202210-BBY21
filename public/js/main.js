"use strict";
import Modal from "/js/modal/modal.js";

const filterModal = new Modal('filter', document.getElementById('filtersContainer'));

document.getElementById('filterButton').addEventListener('click', () => filterModal.show());
document.getElementById('topicsInput').addEventListener('keyup', addTopic);
document.getElementById('apply-filter').addEventListener('click', applyFilters);

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
    console.log(tutorsJSON);
    return true;
  }
}