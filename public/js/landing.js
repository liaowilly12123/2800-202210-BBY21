'use strict';
const loginForm = document.getElementById('login');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  document.getElementById('error').innerText = '';

  const emailNode = document.getElementById('login-email');
  const passwordNode = document.getElementById('login-password');

  const res = await fetch('/api/user/login', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: emailNode.value,
      password: passwordNode.value,
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

document.getElementById('login-email').addEventListener('input', clearError);
document.getElementById('login-password').addEventListener('input', clearError);
