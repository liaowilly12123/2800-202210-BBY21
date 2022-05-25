'use strict';

import Modal from '/js/modal/modal.js';

export default class ModalFactory {
  static getConfirmationModal(message, onConfirm) {
    let content = document.createElement('div');
    content.style.padding = '20px';
    content.style.backgroundColor = 'var(--nord1)';
    content.style.borderRadius = '8px';

    let confirmation = document.createElement('p');
    confirmation.innerText = message;
    confirmation.style.color = 'var(--nord6)';
    confirmation.style.paddingBottom = '20px';

    let buttonsRow = document.createElement('div');
    buttonsRow.style.display = 'flex';
    buttonsRow.style.justifyContent = 'flex-end';
    buttonsRow.style.gap = '10px';

    let confirmButton = document.createElement('button');
    confirmButton.innerText = 'Confirm';
    confirmButton.style.border = 'none';
    confirmButton.style.backgroundColor = 'var(--nord14)';
    confirmButton.style.borderRadius = '8px';
    confirmButton.style.padding = '7.5px 12.5px';
    confirmButton.addEventListener('click', onConfirm);

    let cancelButton = document.createElement('button');
    cancelButton.innerText = 'Cancel';
    cancelButton.style.border = 'none';
    cancelButton.style.backgroundColor = 'var(--nord11)';
    cancelButton.style.borderRadius = '8px';
    cancelButton.style.padding = '7.5px 12.5px';

    buttonsRow.appendChild(cancelButton);
    buttonsRow.appendChild(confirmButton);

    content.appendChild(confirmation);
    content.appendChild(buttonsRow);

    const ret = new Modal(`${message}ConfirmationModal`, content);

    ret.show = (onConfirm) => {
      if (onConfirm) {
        confirmButton.addEventListener('click', onConfirm);
      }

      const modal = document.getElementById(ret.modalId);
      modal.classList.add('modalFadeIn');
      modal.style.display = 'flex';
    };

    cancelButton.addEventListener('click', () => ret.hide());

    return ret;
  }
}
