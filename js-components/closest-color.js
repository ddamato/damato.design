import html from '../components/closest-color/closest-color.html';
import css from '../components/closest-color/closest-color.css';

const COLORVALUE_CSS_PROPERTY = '--closestColor--value';

class ClosestColor extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${css}</style>${html}`;
    this._inputColor = this.shadowRoot.querySelector('.closestColor--input');
    this._outputChosen = this.shadowRoot.querySelector('.closestColor--outputChosen');
    this._outputDistance = this.shadowRoot.querySelector('.closestColor--outputDistance');
    this._outputClosest = this.shadowRoot.querySelector('.closestColor--outputClosest');

    this._userchange = false;

    if (this.hasAttribute('hexjson')) {
      this.loadColors(this.getAttribute('hexjson')).then(() => this._initColor());
    }

    this._inputColor.addEventListener('change', (ev) => {
      this._userchange = true;
      const rgb = this._hexToRGB(ev.target.value);
      this._renderColors(rgb, true);
    });
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(attrName) {
    if (attrName === 'value') {
      if (Array.isArray(this._rgbColors)) {
        this._initColor();
      }
    }
  }

  _parseCss(css) {
    const match = css.match(/(\d+)/gm);
    if (match) {
      return '#' + match.slice(0, 3).map((str) => parseInt(str).toString(16).padStart(2, '0')).join('');
    }
    return '#000000';
  }

  _renderColors(rgb) {
    const { closest, distance, original } = this.getClosestColor(rgb);
    this._setOutputColor(this._outputChosen, original);
    this._outputChosen.style.setProperty('color', this._getContrast(original));
    this._outputDistance.value = distance && distance.toFixed(2);
    this.rgb = this._setOutputColor(this._outputClosest, closest);
    this.hex = this._parseCss(this.rgb);
    this.sendChangedEvent();
  }

  get rgb() {
    if (!this.hasAttribute('rgb')) {
      return this._parseCss(this._hexToRGB(this.hex));
    }
    return this.getAttribute('rgb');
  }

  set rgb(newVal) {
    this.setAttribute('rgb', newVal);
  }

  get hex() {
    if (!this.hasAttribute('hex')) {
      return this._hexToRGB(this._inputColor.value);
    }
    return this.getAttribute('hex');
  }

  set hex(newVal) {
    this.setAttribute('hex', newVal);
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(newVal) {
    this.setAttribute('value', newVal);
  }

  sendChangedEvent() {
    const event = new CustomEvent('change', {
      detail: {
        hex: this.hex,
        rgb: this.rgb,
        value: this.value,
        userchange: this._userchange,
      }
    });
    this.dispatchEvent(event);
  }

  _getContrast(rgb) {
    return rgb && (rgb.r*0.299) + (rgb.g*0.587) + (rgb.b*0.114) > 186 ? '#000000' : '#ffffff';
  }

  _setOutputColor(output, rgb) {
    const css = this._toCss(rgb);
    output.value = css;
    output.style.setProperty(COLORVALUE_CSS_PROPERTY, css);
    return css;
  }

  _hexToRGB(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  _toCss(rgb) {
    return rgb && `rgb(${Object.values(rgb).join(',')})`;
  }

  _getDistance(input, ref) {
    const total = Object.keys(input).reduce((base, key) => {
      return base + Math.pow(input[key] - ref[key], 2);
    }, 0);
    return Math.sqrt(total);
  }

  getClosestColor(rgb) {
    if (!this._rgbColors) {
      return {};
    }

    const distances = this._rgbColors.map((color) => this._getDistance(rgb, color));
    const closestDistance = Math.min(...distances);
    const index = distances.findIndex((distance) => distance === closestDistance);
    return {
      closest: this._rgbColors[index],
      distance: closestDistance,
      original: rgb
    }
  }

  _initColor() {
    // css rgb() string
    let hex = this._inputColor.value;
    if (this.value && this.value.startsWith('#')) {
      hex = this.value;
    }

    if (this.value && this.value.startsWith('rgb')) {
      hex = this._parseCss(this.value);
    }

    // requires 6-digit hex
    this._inputColor.value = hex;
    const rgb = this._hexToRGB(this._inputColor.value);
    this._renderColors(rgb);
  }

  async loadColors(hexcolors) {
    let colors = Array.isArray(hexcolors) ? hexcolors : [];
    if (typeof hexcolors === 'string') {
      colors = await fetch(hexcolors).then((res) => res.json()); 
    }

    this._rgbColors = colors.map((color) => this._hexToRGB(color));
  }
}

window.customElements.define('closest-color', ClosestColor);