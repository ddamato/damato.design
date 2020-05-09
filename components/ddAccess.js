import html from '../blueprints/ddAccess/ddAccess.html';
import css from '../blueprints/ddAccess/ddAccess.css';

class ddAccess extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${css}</style>${html}`;

    this._access = this.shadowRoot.querySelector('.dd-access');
    this._checkbox = this.shadowRoot.querySelector('.dd-access--checkbox');
    this._titleSlot = this.shadowRoot.querySelector('slot[name]');
    this._contentSlot = this.shadowRoot.querySelector('slot:not([name])');
    

    if (this.type !== 'details') {
      this._access.classList.add('dd-access--single');
      this._contentSlot.addEventListener('slotchange', () => {
        const options = this._contentSlot.assignedElements();
        this._access.classList.toggle('dd-access--single', options.length === 1);

        let chosen = options[0];
        [...options].forEach((option) => {
          if (!option.href) {

            if (option.hasAttribute('chosen')) {
              chosen = option;
            }

            option.addEventListener('click', () => {
              this._titleSlot.innerHTML = option.innerText;
              this.value = option.getAttribute('value');
              this.sendChangedEvent();
            })
          }
        });

        if (this.type === 'select') {
          this._titleSlot.innerHTML = chosen.innerText;
          this.value = chosen.getAttribute('value');
          this.sendChangedEvent();
        }
      });
    }
  }

  static get observedAttributes() {
    return ['type', 'value', 'open'];
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'type') {
      this._access.setAttribute('type', this.type);
    }

    if (attrName === 'open') {
      this._checkbox.checked = this.open;
    }
  }

  get type() {
    return this.getAttribute('type');
  }

  set type(newVal) {
    this.setAttribute('type', newVal);
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(newVal) {
    this.setAttribute('value', newVal);
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(newVal) {
    if (newVal) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  sendChangedEvent() {
    const event = new CustomEvent('change', {
      detail: {
        name: this._titleSlot.innerText,
        type: this.type,
        value: this.value
      }
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define('dd-access', ddAccess);