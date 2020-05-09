import html from '../blueprints/ddAdjuster/ddAdjuster.html';
import css from '../blueprints/ddAdjuster/ddAdjuster.css';

class ddAdjuster extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${css}</style>${html}`;
  }
}

window.customElements.define('dd-adjuster', ddAdjuster);