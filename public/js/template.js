'use strict';
import { isLoggedIn } from '/js/login.js';
import { logoutAPI } from '/js/logout.js';

async function setNav() {
  const res = await fetch('/template/nav');
  const resHtml = await res.text();

  document.getElementById('nav-holder').innerHTML = resHtml;

  if (!isLoggedIn()) {
    document.getElementById('burger').style.display = 'none';
  } else {
    document.getElementById('burger').addEventListener('click', showNav);
    document.querySelectorAll('a[role="button"]').forEach((e) => {
      e.addEventListener('click', async () => {
        await logoutAPI();
      });
    });
  }

  function showNav() {
    const modal = document.getElementById('navModal');
    modal.style.display = 'unset';

    const dropdown = document.getElementById('dropdown');
    dropdown.style.top = 75 + 'px';
  }

  function hideNav() {
    const dropdown = document.getElementById('navModal');
    const tint = document.getElementById('navTint');

    dropdown.classList.add('fadeOutTop');
    tint.classList.add('fadeOut');

    setTimeout(() => {
      dropdown.classList.remove('fadeOutTop');
      tint.classList.remove('fadeOut');
      dropdown.style.display = 'none';
    }, 300);
  }

  document.getElementById('navTint').addEventListener('click', hideNav);
}

setNav();
