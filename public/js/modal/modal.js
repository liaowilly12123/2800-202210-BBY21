'use strict';

export default class Modal {
  constructor(name, content) {
    this.name = name;
    this.contentNode = content;
    this.inject();
  }

  get modalId() {
    return `${this.name}Modal`;
  }

  get tintId() {
    return `${this.name}ModalTint`;
  }

  get contentId() {
    return `${this.name}ModalContent`;
  }

  inject() {
    if (document.body.contains(this.contentNode)) {
      document.body.removeChild(this.contentNode);
    }

    const animations = document.createElement('link');
    animations.setAttribute('rel', 'stylesheet');
    animations.type = 'text/css';
    animations.href = '/css/animations.css';
    document.head.appendChild(animations);

    const modal = document.createElement('div');
    modal.id = this.modalId;
    modal.style.position = 'fixed';
    modal.style.left = 0;
    modal.style.right = 0;
    modal.style.top = 0;
    modal.style.bottom = 0;
    // modal.style.display = 'flex';
    modal.style.display = 'none';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.classList.add('modalFadeIn');

    const tint = document.createElement('div');
    tint.id = this.tintId;
    tint.style.position = 'absolute';
    tint.style.width = '100%';
    tint.style.height = '100%';
    tint.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    tint.addEventListener('click', () => this.hide());

    const content = document.createElement('div');
    content.style.position = 'absolute';
    content.style.display = 'flex';
    content.style.justifyContent = 'center';
    content.style.alignItems = 'center';
    content.id = this.contentId;

    content.appendChild(this.contentNode);

    modal.appendChild(tint);
    modal.appendChild(content);

    document.body.appendChild(modal);
  }

  show() {
    const modal = document.getElementById(this.modalId);
    modal.classList.add('modalFadeIn');
    modal.style.display = 'flex';
  }

  hide() {
    const modal = document.getElementById(this.modalId);
    modal.classList.add('modalFadeOut');
    setTimeout(() => {
      modal.classList.remove('modalFadeOut');
      modal.style.display = 'none';
    }, 300);
  }
}
