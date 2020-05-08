class ThemeSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <dd-select>
      <dd-option value="no-preference">System Preference</dd-option>      
      <dd-option value="light">Light</dd-option>
      <dd-option value="dark">Dark</dd-option>
    </dd-select>
    `;

    const select = this.shadowRoot.querySelector('dd-select');
    select.addEventListener('change', (ev) => {
      document.documentElement.setAttribute('theme', ev.detail.value);
    });
  }
}

window.customElements.define('theme-selector', ThemeSelector);