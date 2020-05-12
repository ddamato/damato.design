import html from '../blueprints/toggle-range/toggle-range.html';
import css from '../blueprints/toggle-range/toggle-range.css';

class ToggleRange extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${css}</style>${html}`;

    this._toggleRange = this.shadowRoot.querySelector('.toggleRange');
    this._input = this.shadowRoot.querySelector('.toggleRange--input');
    this._output = this.shadowRoot.querySelector('.toggleRange--output');

    this._toggleRange.setAttribute('type', this.type);

    if (this.type === 'toggle') {
      this._input.min = 0;
      this._input.max = 1;
      this._input.style.pointerEvents = 'none';
    }

    if (this.type === 'range') {
      this._input.value = this.value;
      this._input.setAttribute('value', this.value);
      this._input.min = this.min;
      this._input.max = this.max;
      this._input.step = this.getAttribute('step');
    }
  }

  connectedCallback() {
    if (this.type === 'toggle') {
      this.addEventListener('click', () => {
        this.chosen = !this.chosen;
      });
    }

    if (this.type === 'range') {
      this._input.addEventListener('input', (ev) => {
        this.value = ev.target.value;
      });
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
    return ['type', 'chosen', 'value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {

    if (attrName === 'chosen' && this.type === 'toggle') {
      this._input.value = Number(this.chosen);
      this._input.setAttribute('value', this._input.value);
      this.sendChangedEvent();
    }

    if (attrName === 'value' && this.type === 'range') {
      this._output.value = this.value;
      if (this._input.value !== newVal) {
        this._input.value = newVal;
      }
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

  get min() {
    return Number(this.getAttribute('min')) || 0;
  }

  set min(newVal) {
    this.setAttribute('min', newVal);
  }

  get max() {
    return Number(this.getAttribute('max')) || 1;
  }

  set max(newVal) {
    this.setAttribute('max', newVal);
  }

  get value() {
    return Number(this.getAttribute('value'));
  }

  set value(newVal) {
    this.setAttribute('value', newVal);
  }

  sendChangedEvent() {
    const event = new CustomEvent('change', {
      detail: {
        type: this.type,
        chosen: this.chosen,
        value: this.value,
      }
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define('toggle-range', ToggleRange);