'use strict';
import { logout } from '/js/login.js';
const logoutButton = document.getElementById('logout-button');

logoutButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const res = await fetch('/api/user/logout');
  const responseJSON = await res.json();

  if (responseJSON.success) {
    logout();
    window.location.href = '/';
  }
});
