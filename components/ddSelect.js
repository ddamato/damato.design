const style = `
  :host {
    position: relative;
    z-index: 1;
  }

  blu-flyout {
    display: none;
  }

  blu-flyout.show {
    display: initial;
  }
`;

class ddSelect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${style}</style>
    <blu-fieldset>
      <blu-selectfield></blu-selectfield>
      <blu-flyout>
        <slot></slot>
      </blu-flyout>
    </blu-fieldset>`;

    this._selectfield = this.shadowRoot.querySelector('blu-selectfield');
    this._flyout = this.shadowRoot.querySelector('blu-flyout');

    const handleClose = () => {
      this._flyout.classList.remove('show');
      document.documentElement.removeEventListener('click', handleClose);
    }

    this._selectfield.addEventListener('click', (ev) => {
      ev.stopPropagation();
      this._flyout.classList.toggle('show');
      window.setTimeout(() => document.documentElement.addEventListener('click', handleClose), 0);
    });

    this._flyout.addEventListener('click', (ev) => {
      ev.stopPropagation();
      this._flyout.classList.remove('show');
    });

    this._slot = this.shadowRoot.querySelector('slot');
    this._slot.addEventListener('slotchange', () => this.onSlotChange());
  }

  onSlotChange() {
    const isOpen = this._flyout.classList.contains('show');

    if (!isOpen) {
      this._flyout.classList.add('show');
    }

    this._options = this._slot.assignedElements();
    [...this._options].forEach((option) => {
      option.addEventListener('chosen', (ev) => {
        this.setValue(ev.detail.value, ev.detail.name);
      });
      
      if (option.chosen) {
        this.setValue(option.value, option.name);
      }
    });

    if (!this.value) {
      console.log('none chosen');
      console.log(this._options);
      console.log(this._options[0].name)
      this.setValue(this._options[0].value, this._options[0].name);
    }

    console.log(this.value);

    window.setTimeout(() => {
      const minWidth = this.findMinWidth(this._options);
      this._selectfield.style.minWidth = `${minWidth}px`;
      if (!isOpen) {
        this._flyout.classList.remove('show');
      }
    }, 0);
  }

  findMinWidth(options) {
    options = options || this.options;
    return [...options].reduce((min, option) => {
      return Math.max(min, option.offsetWidth);
    }, 0);
  }

  setValue(value, name) {
    this._selectfield.innerText = name || value;
    this.value = value || name;
    this.sendChangeEvent(value, name);
  }

  sendChangeEvent(value, name) {
    const event = new CustomEvent('change', {
      detail: { name, value }
    });
    this.dispatchEvent(event);
  }
}

window.customElements.define('dd-select', ddSelect);