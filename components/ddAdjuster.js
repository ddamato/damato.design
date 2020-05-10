import html from '../blueprints/ddAdjuster/ddAdjuster.html';
import css from '../blueprints/ddAdjuster/ddAdjuster.css';

class ddAdjuster extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${css}</style>${html}`;

    this._adjuster = this.shadowRoot.querySelector('.dd-adjuster');

    if (this.type === 'toggle') {
      this.addEventListener('click', () => this.chosen = !this.chosen);
    }

    this.addEventListener('keydown', (ev) => {
      if (document.activeElement === this && ev.code.toLowerCase() === 'space') {
        ev.preventDefault();
        
        if (this.type === 'toggle') {
          this.chosen = !this.chosen;
        }

      }
    });
  }

  static get observedAttributes() {
    return ['type', 'chosen'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'chosen' && this.type === 'toggle') {
      this._adjuster.style.setProperty('--adjuster-percent', Number(this.chosen));
      this.sendChangedEvent();
    }
  }

  get type() {
    return this.getAttribute('type');
  }

  set type(newVal) {
    this.setAttribute('type', newVal);
  }

  get chosen() {
    return this.hasAttribute('chosen');
  }

  set chosen(newVal) {
    if (newVal) {
      this.setAttribute('chosen', '');
    } else {
      this.removeAttribute('chosen');
    }
  }

  sendChangedEvent() {
    const event = new CustomEvent('change', {
      detail: {
        type: this.type,
        chosen: this.chosen
      }
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define('dd-adjuster', ddAdjuster);