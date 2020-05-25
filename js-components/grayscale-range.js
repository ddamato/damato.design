const GRAYSCALE_CSS_CUSTOMPROPERTY = '--grayscale--factor';

class GrayscaleRange extends HTMLElement {
  constructor() {
    super();

    const grayscaleFactor = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(GRAYSCALE_CSS_CUSTOMPROPERTY)
      .trim();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <js-togglerange type="range" min="1" max="8" step="1" value="${grayscaleFactor}">
      Grayscale Factor
      <output slot="output"></output>
    </js-togglerange>`;

    const toggleRange = this.shadowRoot.querySelector('js-togglerange');
    toggleRange.addEventListener('change', (ev) => {
      document.documentElement.style.setProperty(GRAYSCALE_CSS_CUSTOMPROPERTY, ev.detail.value);
    })

  }
}

window.customElements.whenDefined('js-togglerange').then(() => {
  window.customElements.define('grayscale-range', GrayscaleRange);
});