function injectToastFramework() {
  const inject = `
    <style>
      #toast {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        display: none;
        pointer-events: none;
      }

      #toastData {
        background-color: var(--nord1);
        width: fit-content;
        height: fit-content;
        margin-bottom: 20px;
        border-radius: 8px;
        padding: 15px 20px;
        
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 40px;
        pointer-events: auto;
      }

      @keyframes toastShowAnim {
          0% {
              transform: translateY(-2%);
              opacity: 0;
          }
          100% {
              transform: translateY(0%);
              opacity: 1;
          }
      } 

      @keyframes toastHideAnim {
          0% {
              transform: translateY(0%);
              opacity: 1;
          }
          100% {
              transform: translateY(2%);
              opacity: 0;
          }
      } 

     .toastShow {
         animation: toastShowAnim ease-in 0.3s;
     }

     .toastHide {
         animation: toastHideAnim ease-in 0.3s;
     }

      #toastClose {
          color: var(--nord5);
          cursor: pointer;
      }

      .toastsuccess {
          color: var(--nord14);
      }

      .toasterror {
          color: var(--nord11);
      }

      .toastinfo {
          color: var(--nord10);
      }
    </style>

    <div id="toast">
      <div id="toastData">
        <div id="toastMsg"></div>
        <div id="toastClose"><i class="fa-solid fa-xmark"></i></div>
      </div>
    </div>
    `;
  const toastHolder = document.createElement('div');
  toastHolder.innerHTML = inject;
  toastHolder.style.position = 'fixed';

  document.body.appendChild(toastHolder);

  document.getElementById('toastClose').addEventListener('click', hideToast);
}

let currentTimeout;

export function isToastVisible() {
  const toast = document.getElementById('toast');
  return toast.style.display === 'flex';
}

export function showToast(type, msg) {
  clearTimeout(currentTimeout);
  if (isToastVisible()) {
    hideToast();
  }
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  toast.classList.add('toastShow');
  toastMsg.className = `toast${type}`;
  toastMsg.innerText = msg;

  toast.style.display = 'flex';
  currentTimeout = setTimeout(hideToast, 3000);
}

export function hideToast() {
  const toast = document.getElementById('toast');

  toast.classList.remove('toastShow');
  toast.classList.add('toastHide');

  setTimeout(() => {
    toast.classList.remove('toastHide');
    toast.style.display = 'none';
  }, 300);
}

injectToastFramework();
