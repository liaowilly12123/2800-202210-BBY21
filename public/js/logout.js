'use strict';
import { logout } from '/js/login.js';
import { showToast } from '/js/toast.js';

export async function logoutAPI() {
  const res = await fetch('/api/user/logout');
  const responseJSON = await res.json();

  if (responseJSON.success) {
    logout();
    window.location.href = '/';
  } else {
    showToast('error', responseJSON.payload);
  }
}
