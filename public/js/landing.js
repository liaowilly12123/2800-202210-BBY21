'use strict';
import { login } from '/js/login.js';
import { showToast } from '/js/toast.js';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// hide register form on first load
registerForm.style.display = 'none';

document.getElementById('signup-text').addEventListener('click', () => {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'flex';
});

document.getElementById('signin-text').addEventListener('click', () => {
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'flex';
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

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
    login();
    window.location.href = '/profile';
  } else {
    showToast('error', responseJson.payload);
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailNode = document.getElementById('register-email');
  const passwordNode = document.getElementById('register-password');
  const firstnameNode = document.getElementById('register-fname');
  const lastnameNode = document.getElementById('register-lname');
  const type = document.getElementById('register-type');

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
    login();
    window.location.href = '/profile';
  } else {
    showToast('error', responseJson.payload);
  }
});
