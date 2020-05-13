const svgElements = [
  'circle',
  'ellipse',
  'line',
  'path',
  'polygon',
  'polyline',
  'rect',
  'stop',
  'use'
];

const voidElements = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
];

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
    this._currentHTML = template.innerHTML;
  }

  const remainingSlots = template.content.querySelectorAll('slot');
  [...remainingSlots].forEach((slot) => !slot.assignedNodes().length &&  slot.remove());
  this._adjacentCode.innerHTML = prepareHTML(template.innerHTML);
}

const SELF_CLOSING = [].concat(voidElements, svgElements);

function prepareHTML(html) {
  const tags = html.replace(/>\s*([a-zA-Z0-9 ]+)\s*</gm, '>$1<').replace(/>\s+</gm, '>\n<').split('\n');
  let indent = 0;
 html = tags.map((tag) => {

    if (/^<\//.test(tag)) {
      indent -= 1;
    }

    let padding = '';
    if (indent > 0) {
      padding = Array(indent).fill('  ').join('');
    }

    const tagName = tag.replace(/<([^ ]+).*/gm, '$1');
    if (!/\//gm.test(tag) && !~SELF_CLOSING.indexOf(tagName)) {
      indent += 1;
    }

    return padding + tag;
  }).join('\n');
  html = html.replace(/[\u00A0-\u9999<>\&]/gim, (i) => '&#' + i.charCodeAt(0) + ';');
  return html;
}

window.BluComponent = BluComponent;
window.customElements.define('blu-component', BluComponent);