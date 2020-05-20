const TYPESCALE_CSS_CUSTOMPROPERTY = '--typefactor-scale';

class TypescaleRange extends HTMLElement {
  constructor() {
    super();

    const typescaleFactor = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(TYPESCALE_CSS_CUSTOMPROPERTY)
      .trim();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <js-togglerange type="range" min="1" max="2" step="0.1" value="${typescaleFactor}">
      Typescale Factor
      <output slot="output"></output>
    </js-togglerange>`;

    const toggleRange = this.shadowRoot.querySelector('js-togglerange');
    toggleRange.addEventListener('change', (ev) => {
      document.documentElement.style.setProperty(TYPESCALE_CSS_CUSTOMPROPERTY, ev.detail.value);
    })

  }
}

window.customElements.define('typescale-range', TypescaleRange);