import html from '../components/colorfield/colorfield.html';
import css from '../components/colorfield/colorfield.css';

const COLORFIELD_CSS_PROPERTY = '--colorfield--color';

class JsColorfield extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${css}</style>${html}`;
    this._input = this.shadowRoot.querySelector('.colorfield--input');
    this._outputInput  = this.shadowRoot.querySelector('.colorfield--outputInput');
    this._outputDelta  = this.shadowRoot.querySelector('.colorfield--outputDelta');
    this._outputValue  = this.shadowRoot.querySelector('.colorfield--outputValue');

    if (!this.hasAttribute('hex')) {
      this.setAttribute('rgb', '');
    }

    this._input.addEventListener('change', (ev) => {
      this._manageColorChange(true);
    });
  }

  static get observedAttributes() {
    return ['color'];
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'color') {
      this._input.value = this.color;
      this._manageColorChange(false);
    }
  }

  _manageColorChange(userchange) {
    const { delta, value } = this.onColorchange(this._input.value) || {};
    this.delta = delta;
    this.value = value;
    this._render();
    this._sendChangedEvent(userchange);
  }

  _sendChangedEvent(userchange) {
    const event = new CustomEvent('change', {
      detail: {
        delta: this.delta,
        value: this.value,
        userchange,
      }
    });
    this.dispatchEvent(event);
  }

  _render() {
    this._setOutput(this._outputInput, this._input.value);
    this._outputDelta.value = this.delta;
    this._setOutput(this._outputValue, this.value);
  }

  _setOutput(output, value) {
    if (this.hasAttribute('hex') && value.startsWith('rgb')) {
      value = this.rgbStringToHex(value);
    }

    if (this.hasAttribute('rgb') && value.startsWith('#')) {
      value = this.rgbToString(this.hexToRGB(value));
    }

    if (this.hasAttribute('colorvalue') || output ===  this._outputInput) {
      output.style.setProperty(COLORFIELD_CSS_PROPERTY, value);
    }

    output.value = value;
  }

  _getContrastHex(rgb) {
    return rgb && (rgb.r*0.299) + (rgb.g*0.587) + (rgb.b*0.114) > 186 ? '#000000' : '#ffffff';
  }

  hexToRGB(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  rgbToString(rgb) {
    return rgb && `rgb(${Object.values(rgb).join(',')})`;
  }

  rgbStringToHex(str) {
    const match = str.match(/(\d+)/gm);
    if (match) {
      return '#' + match.slice(0, 3).map((digit) => parseInt(digit).toString(16).padStart(2, '0')).join('');
    }
    return '#000000';
  }

  _getContrast(rgb) {
    return rgb && (rgb.r*0.299) + (rgb.g*0.587) + (rgb.b*0.114) > 186 ? '#000000' : '#ffffff';
  }

  get color() {
    return this.getAttribute('color');
  }

  set color(newVal) {
    if (newVal.startsWith('rgb')) {
      newVal = this.rgbStringToHex(newVal);
    }

    this.setAttribute('color', newVal);
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(newVal) {
    if (this.hasAttribute('hex') && newVal.startsWith('rgb')) {
      newVal = this.rgbStringToHex(newVal);
    }

    if (this.hasAttribute('rgb') && newVal.startsWith('#')) {
      newVal = this.rgbToString(this.hexToRGB(newVal));
    }

    this.setAttribute('value', newVal);
  }

  get delta() {
    return this.getAttribute('delta');
  }

  set delta(newVal) {
    this.setAttribute('delta', newVal);
  }
  
  onColorchange = Function.prototype
}

window.customElements.define('js-colorfield', JsColorfield);