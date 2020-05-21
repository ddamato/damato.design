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
    this._iconStore = {};
    this._pending = {};
  }

  fetchIconMarkup(name) {
    const onMarkupFetch = () => {
      const html = this.getIconMarkup(name);
      return Promise.resolve(html);
    };

    if (this.isStored(name)) {
      return onMarkupFetch();
    }

    const request = this.getPending(name) || this.requestIcon(name);
    return request.then(onMarkupFetch);

  }

  getPending(name) {
    return this._pending[name];
  }

  isStored(name) {
    return !!this._iconStore[name];
  }

  getIconMarkup(name) {
    return this._iconStore[name] || '';
  }

  requestIcon(name) {
    const url = `icons/${name}.svg`
    this._pending[name] = fetch(url)
      .then((res) => res.text())
      .then((text) => this._setResponse(text, name));
    return this._pending[name];
  }

  _setResponse(text, name) {
    const iconDOM = new DOMParser().parseFromString(text, 'application/xml');
    const group = iconDOM.querySelector('g');
    this._iconStore[name] = group.innerHTML;
  }
}

class SvgIcon extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = innerHTML;
    this._svg = this.shadowRoot.querySelector('.svgIcon');

    if (!window.IconManager) {
      window.IconManager = new IconManager();
    }
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
    window.IconManager.fetchIconMarkup(this.value).then((html) => this._svg.innerHTML = html);
  }
}

window.customElements.define('svg-icon', SvgIcon);