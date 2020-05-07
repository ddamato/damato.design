const style = `
  :host {
    display: block;
  }
`;

class ddOption extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${style}</style>
      <blu-optionitem>
        <slot></slot>
      </blu-optionitem>`;
    
    this.addEventListener('click', () => { this.chosen = true; });
  }

  static get observedAttributes() {
    return ['chosen'];
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'chosen' && this.chosen) {
      const event = new CustomEvent('chosen', {
        detail: {
          name: this.innerText,
          value: this.value || this.innerText
        }
      });
      this.dispatchEvent(event);
    }
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

  get value() {
    return this.getAttribute('value');
  }

  set value(newVal) {
    this.setAttribute('value', newVal);
  }
}

window.customElements.define('dd-option', ddOption);