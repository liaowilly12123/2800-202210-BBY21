'use strict';
const registerForm = document.getElementById('register');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  document.getElementById('error').innerText = '';

  const emailNode = document.getElementById('register-email');
  const passwordNode = document.getElementById('register-password');
  const firstnameNode = document.getElementById('register-name');
  const lastnameNode = document.getElementById('register-name1');
  const type = document.getElementById('helo');

  const res = await fetch('/api/user/register', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: emailNode.value || null,
      password: passwordNode.value || null,
      firstName: firstnameNode.value || null,
      lastName: lastnameNode.value || null,
      userType: type.value || null,
    }),
  });

  const responseJson = await res.json();

  if (responseJson.success) {
    window.location.href = '/profile';
  } else {
    document.getElementById('error').innerText = responseJson.payload;
  }
});

function clearError() {
  document.getElementById('error').innerText = '';
}

document.getElementById('register-email').addEventListener('input', clearError);
document
  .getElementById('register-password')
  .addEventListener('input', clearError);
document.getElementById('register-name').addEventListener('input', clearError);
document.getElementById('register-name1').addEventListener('input', clearError);
