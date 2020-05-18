import html from '../components/closest-color/closest-color.html';
import css from '../components/closest-color/closest-color.css';

const ACCENT_CSS_CUSTOMPROPERTY = '--accent--defaultColor';
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

    if (this.hasAttribute('hexjson')) {
      this.loadColors(this.getAttribute('hexjson')).then(() => this._initColor());
    }

    this._inputColor.addEventListener('change', (ev) => {
      const rgb = this._hexToRGB(ev.target.value);
      this._renderColors(rgb, true);
    });
  }

  connectedCallback() {
    this._manageObserver();
  }

  disconnectedCallback() {
    this._manageObserver();
  }

  _manageObserver() {
    if (this._observer) {
      this._observer.disconnect();
      return;
    }

    this._observer = new MutationObserver((entries) => {
      entries.forEach(({ attributeName }) => {
        attributeName !== 'style' && this._initColor();
      });
    })
    this._observer.observe(document.documentElement, { attributes: true });
  }

  _parseCss(css) {
    const match = css.match(/(\d+)/gm);
    if (match) {
      return '#' + match.slice(0, 3).map((str) => parseInt(str).toString(16).padStart(2, '0')).join('');
    }
    return '#000000';
  }

  _renderColors(rgb, apply) {
    const { closest, distance, original } = this.getClosestColor(rgb);
    this._setOutputColor(this._outputChosen, original);
    this._outputChosen.style.setProperty('color', this._getContrast(original));
    const accentColor = this._setOutputColor(this._outputClosest, closest);
    this._outputDistance.value = distance && distance.toFixed(2);
    if (apply) {
      document.documentElement.style.setProperty(ACCENT_CSS_CUSTOMPROPERTY, accentColor);
    }
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
    const accentColor = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(ACCENT_CSS_CUSTOMPROPERTY)
      .trim();

    // requires 6-digit hex
    this._inputColor.value = this._parseCss(accentColor);
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