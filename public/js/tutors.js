'use strict';
const registerForm = document.getElementById('tutor');
const submit = document.getElementById('Submit');
submit.onclick = function () {
  document.getElementById('tutor').submit();
  document.getElementById('form2').submit();
};
registerForm.addEventListener('submit', async (e) => {
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
    console.error('problem in registering');
  }
});
