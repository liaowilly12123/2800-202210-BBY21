import { isLoggedIn } from '/js/login.js';
import { logoutAPI } from '/js/logout.js';

async function setNav() {
  const res = await fetch('/template/nav');
  const resHtml = await res.text();

  document.getElementById('nav-holder').innerHTML = resHtml;

  document.getElementById('burger').addEventListener('click', showNav);

  if (!isLoggedIn()) {
    document.querySelectorAll('a[role="button"]').forEach((e) => {
      e.style.display = 'none';
    });
  } else {
    document.querySelectorAll('a[role="button"]').forEach((e) => {
      e.addEventListener('click', async () => {
        await logoutAPI();
      });
    });
  }

  function showNav() {
    const modal = document.getElementById('modal');
    modal.style.display = 'unset';

    const dropdown = document.getElementById('dropdown');
    dropdown.style.top = 75 + 'px';
  }

  function hideNav() {
    const dropdown = document.getElementById('modal');
    const tint = document.getElementById('tint');

    dropdown.classList.add('fadeOutTop');
    tint.classList.add('fadeOut');

    setTimeout(() => {
      dropdown.classList.remove('fadeOutTop');
      tint.classList.remove('fadeOut');
      dropdown.style.display = 'none';
    }, 300);
  }

  document.getElementById('tint').addEventListener('click', hideNav);
}

setNav();
