class BluComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const baseComponent = this.shadowRoot.lastElementChild;
    const baseClassName = baseComponent.classList[0];
    this._attributeList = [];

    [...this.attributes].forEach((attr) => {
      if (attr.name === 'selfdocument') {
        return;
      }

      const parts = attr.name.split('-');
      let target = baseComponent;
      let targetClassSelector = `.${baseClassName}`;
      if (parts.length > 1) {
        targetClassSelector = `${targetClassSelector}--${parts[0]}`;
        target = baseComponent.querySelector(targetClassSelector);
      }

      const entry = {
        target: targetClassSelector,
        name: parts.pop(),
        value: attr.nodeValue
      };
      this._attributeList.push(entry);
      target.setAttribute(entry.name, entry.value);
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
  this._adjacentCode.classList.add('language-html');
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
    [...nodes].forEach((node) => {
      const cloned = node.cloneNode(true);
      cloned.removeAttribute && cloned.removeAttribute('slot');
      frag.appendChild(cloned);
    });
    slotTarget.parentNode.replaceChild(frag, slotTarget);
  }
  const remainingSlots = template.content.querySelectorAll('slot');
  [...remainingSlots].forEach((slot) => slot.remove());
  this._currentHTML = template.innerHTML.replace(/\n(\ {2,})/gmi, (m, n) => n.length % 2 === 1 ? m.slice(0, -1) : m);
  this._adjacentCode.innerHTML = this._currentHTML.replace(/[\u00A0-\u9999<>\&]/gim, (i) => '&#' + i.charCodeAt(0) + ';');;
}

window.BluComponent = BluComponent;
window.customElements.define('blu-component', BluComponent);