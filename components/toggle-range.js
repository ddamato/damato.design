import html from '../blueprints/toggle-range/toggle-range.html';
import css from '../blueprints/toggle-range/toggle-range.css';

class ToggleRange extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${css}</style>${html}`;

    this._toggleRange = this.shadowRoot.querySelector('.toggleRange');
    this._input = this.shadowRoot.querySelector('.toggleRange--input');

    if (this.type === 'toggle') {
      this._input.min = 0;
      this._input.max = 1;
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

  connectedCallback() {
    // this.updateColor();
  }

  static get observedAttributes() {
    return ['type', 'chosen'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'chosen' && this.type === 'toggle') {
      this._input.value = Number(this.chosen);
      this._input.setAttribute('value', this._input.value);
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

window.customElements.define('toggle-range', ToggleRange);