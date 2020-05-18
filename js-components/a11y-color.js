const HEXJSON_URL = 'json/a11yColorsOnBlackAndWhite.json';
const ACCENT_CSS_CUSTOMPROPERTY = '--accent--defaultColor';

class A11yColor extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<closest-color hexjson="${HEXJSON_URL}"></closest-color>`;

    this._closestColor = this.shadowRoot.querySelector('closest-color');
    this._closestColor.addEventListener('change', (ev) => {
      if (ev.detail.userchange) {
        document.documentElement.style.setProperty(ACCENT_CSS_CUSTOMPROPERTY, ev.detail.hex);
      }
    });
  }

  connectedCallback() {
    this._manageObserver();
    this._closestColor.value = this._getAccentColor();
  }

  disconnectedCallback() {
    this._manageObserver();
  }

  _getAccentColor() {
   return window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(ACCENT_CSS_CUSTOMPROPERTY)
    .replace(/\s+/gm, '');
  }

  _manageObserver() {
    if (this._observer) {
      this._observer.disconnect();
      return;
    }

    this._observer = new MutationObserver((entries) => {
      entries.forEach(({ attributeName }) => {
        if (attributeName !== 'style') {
          this._closestColor.value = this._getAccentColor();
        }
      });
    })
    this._observer.observe(document.documentElement, { attributes: true });
  }
}

window.customElements.whenDefined('closest-color').then(() => {
  window.customElements.define('a11y-color', A11yColor);
})

