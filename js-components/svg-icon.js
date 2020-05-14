const innerHTML = `
<style type="text/css">
  :host {
    display: inline-flex;
    width: var(--svgIcon--dimension, 1.5em);
    height: var(--svgIcon--dimension, 1.5em);
  }

  .svgIcon {
    width: 100%;
    height: 100%;
    fill: var(--svgIcon--fill, currentColor);
  }
</style>

<svg class="svgIcon" viewBox="0 0 24 24"></svg>
`;

class IconManager {
  constructor() {
    this._iconInventory = {};
  }

  async fetchMarkup(value) {
    return this._iconInventory[value] || await this.requestIcon(value);
  }

  async requestIcon(value) {
    try {
      const response = await fetch(`icons/${value}.svg`)
      const text = await response.text();
      this.storeResponse(value, text);
    } catch (err) {
      console.info(`Fetch failed for icon: ${value}`);
    }
    return this._iconInventory[value] || '';
  }

  storeResponse(value, text) {
    const iconDOM = new DOMParser().parseFromString(text, 'application/xml');
    const group = iconDOM.querySelector('g');
    this._iconInventory[value] = group.innerHTML;
  }
}

class SvgIcon extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = innerHTML;
    this._svg = this.shadowRoot.querySelector('.svgIcon');

  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'value') {
      this._render();
    }
  }

  static get observedAttributes() {
    return ['value'];
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(newVal) {
    this.setAttribute('value', newVal);
  }

  _render() {
    if (!window.IconManager) {
      window.IconManager = new IconManager();
    }

    window.IconManager.fetchMarkup(this.value).then((markup) => this._svg.innerHTML = markup);
  }
}

window.customElements.define('svg-icon', SvgIcon);