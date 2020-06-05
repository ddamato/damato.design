const styles = `
<style type="text/css">
  :host {
    display: inline-flex;
    width: var(--svgIcon--dimension, 1.5em);
    height: var(--svgIcon--dimension, 1.5em);
  }

  svg {
    width: 100%;
    height: 100%;
    fill: var(--svgIcon--fill, currentColor);
  }
</style>
`;
class SvgIcon extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `${styles}<svg><use xlink:href="icons/${this.value}.svg#${this.value}"/></svg>`;
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(newVal) {
    this.setAttribute('value', newVal);
  }
}

window.customElements.define('svg-icon', SvgIcon);