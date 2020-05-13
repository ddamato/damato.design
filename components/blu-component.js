class BluComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const baseComponent = this.shadowRoot.children[1];
    const baseClassName = baseComponent.classList[0];
    [...this.attributes].forEach((attr) => {
      if (attr.name === 'selfdocument') {
        return;
      }

      const parts = attr.name.split('-');
      let target = baseComponent;
      if (parts.length > 1) {
        target = baseComponent.querySelector(`.${baseClassName}--${parts[0]}`);
      }
      target.setAttribute(parts.pop(), attr.nodeValue);
    });


    if (this.hasAttribute('selfdocument')) {
      showCode.call(this);
    }
  }

  disconnectedCallback() {
    if (this._adjacentPre) {
      this._adjacentPre.remove();
    }
  }
}

function showCode() {
  this._adjacentPre = document.createElement('pre');
  this._adjacentCode = document.createElement('code');
  this._adjacentCode.classList.add('hljs');
  this._adjacentPre.appendChild(this._adjacentCode);
  this.after(this._adjacentPre);
  this._currentHTML = '';

  const slots = this.shadowRoot.querySelectorAll('slot');
  [...slots].forEach((slot) => {
    slot.addEventListener('slotchange', () =>  renderCode.call(this, slot));
  });
}

function renderCode(slot) {
  if (!this._currentHTML) {
    const sheets = this.shadowRoot.styleSheets;
    const style = sheets[0].ownerNode.outerHTML;
    this._currentHTML = this.shadowRoot.innerHTML.replace(style, '');
  }

  const template = document.createElement('template');
  template.innerHTML = this._currentHTML;
  const query = slot.name ? `slot[name="${slot.name}"]` : 'slot:not([name])';
  const slotTarget = template.content.querySelector(query);
  if (slotTarget) {
    const nodes = slot.assignedNodes();
    const frag = document.createDocumentFragment();
    [...nodes].forEach((node) =>frag.appendChild(node.cloneNode(true)));
    slotTarget.parentNode.replaceChild(frag, slotTarget);
    this._currentHTML = template.innerHTML.replace(/\n(\ {2,})/gmi, (m, n) => n.length % 2 === 1 ? m.slice(0, -1) : m);
  }
  this._adjacentCode.innerHTML = this._currentHTML.replace(/[\u00A0-\u9999<>\&]/gim, (i) => '&#' + i.charCodeAt(0) + ';');;
}

window.BluComponent = BluComponent;
window.customElements.define('blu-component', BluComponent);