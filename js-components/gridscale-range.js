const GRIDSCALE_CSS_CUSTOMPROPERTY = '--gridscale--factor';

class GridscaleRange extends HTMLElement {
  constructor() {
    super();

    const gridscaleFactor = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(GRIDSCALE_CSS_CUSTOMPROPERTY)
      .trim();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <js-togglerange type="range" min="0.1" max="2" step="0.1" value="${gridscaleFactor}">
      Gridscale Factor
      <output slot="output"></output>
    </js-togglerange>`;

    const toggleRange = this.shadowRoot.querySelector('js-togglerange');
    toggleRange.addEventListener('change', (ev) => {
      document.documentElement.style.setProperty(GRIDSCALE_CSS_CUSTOMPROPERTY, ev.detail.value);
    })

  }
}

window.customElements.whenDefined('js-togglerange').then(() => {
  window.customElements.define('gridscale-range', GridscaleRange);
});

