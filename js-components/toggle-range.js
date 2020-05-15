import html from '../components/toggle-range/toggle-range.html';
import css from '../components/toggle-range/toggle-range.css';

class ToggleRange extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${css}</style>${html}`;

    this._toggleRange = this.shadowRoot.querySelector('.toggleRange');
    this._label = this.shadowRoot.querySelector('.toggleRange--label');
    this._input = this.shadowRoot.querySelector('.toggleRange--input');
    this._input.id = 'toggleRange-inputId';
    this._label.setAttribute('for', this._input.id);
    this._input.step = this.getAttribute('step') || 1;
    const outputSlot = this.shadowRoot.querySelector('slot[name="output"]');
    outputSlot.addEventListener('slotchange', () => {
      this._output = outputSlot.assignedElements()[0];
      this._output.value = this._output.value || this._output.innerText || this.value;
    });

    this._toggleRange.setAttribute('type', this.type);

    // Need to determine click as immediate touchdown/touchup, as user could shift range
    let timedownStart;
    const onMousedown = () => timedownStart = new Date().getTime();
    const onMouseup = () => {
      if (this.shadowRoot.activeElement !== this._input) {
        this._input.focus();
      }

      if (this.type === 'toggle' && new Date().getTime() - timedownStart < 300)  {
        this.value = Number(!this.value);
      }
    };
    this.addEventListener('mousedown', onMousedown);
    this.addEventListener('mouseup', onMouseup);
    this.addEventListener('touchdown', onMousedown);
    this.addEventListener('touchup', onMouseup);
  }
  

  connectedCallback() {
    if (this.type === 'toggle') {
      this._input.min = 0;
      this._input.max = 1;
      if (!this.hasAttribute('value')) {
        this.value = Number(this.chosen);
      }
      this._input.value = this.value;
      this._input.setAttribute('value', this.value);
    }

    if (this.type === 'range') {
      this._input.min = this.min;
      this._input.max = this.max;
      this._input.value = this.value;
      this._input.setAttribute('value', this._input.value);
    }

    this._input.addEventListener('input', (ev) => this.value = ev.target.value);
    this._input.addEventListener('change', (ev) => this.value = ev.target.value);

    this.addEventListener('keydown', (ev) => {
      if (ev.code.toLowerCase() === 'space' && this.type === 'toggle') {
        ev.preventDefault();
        this.value = Number(!this.value);
      }
    });
  }

  static get observedAttributes() {
    return ['type', 'chosen', 'value'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'value') {
      if (this._output) {
        this._output.value = this.value;
      }
      this._input.value = this.value;
      this._input.setAttribute('value', this.value);

      if (this.type == 'toggle') {
        this.chosen = Boolean(this.value);
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