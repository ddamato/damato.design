class AudienceSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
    <dd-select>
      <dd-option value="no-preference">No Preference</dd-option>
      <dd-option value="designer">Designer</dd-option>
      <dd-option value="engineer">Engineer</dd-option>
    </dd-select>
    `;

    const select = this.shadowRoot.querySelector('dd-select');
    select.addEventListener('change', (ev) => {
      document.documentElement.setAttribute('audience', ev.detail.value);
    });
  }
}

window.customElements.define('audience-selector', AudienceSelector);