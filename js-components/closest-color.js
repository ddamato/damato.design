const innerHTML = `
<style type="text/css">
  .closestColor {

  }
</style>

<div class="closestColor">
  <input type="color" class="closestColor--inputColor"/>
  <output class="closestColor--outputColor" type="color"></output>
  <output class="closestColor--outputDistance" type="number"></output>
</div>
`;

const ACCENT_CSS_CUSTOMPROPERTY = '--accent--defaultColor';

class ClosestColor extends HTMLElement {
  constructor() {
    super();

    const accentColor = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(ACCENT_CSS_CUSTOMPROPERTY)
      .trim();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = innerHTML;
    this._inputColor = this.shadowRoot.querySelector('.closestColor--inputColor');
    this._outputColor = this.shadowRoot.querySelector('.closestColor--outputColor');
    this._outputDistance = this.shadowRoot.querySelector('.closestColor--outputDistance');

    if (this.hasAttribute('hexjson')) {
      this.loadColors(this.getAttribute('hexjson'));
    }

    this._inputColor.value = accentColor;

    this._inputColor.addEventListener('change', (ev) => {
      const rgb = this._hexToRGB(ev.target.value);
      const { closest, distance, original } = this.getClosestColor(rgb);
      this._outputColor.value = this._toCss(closest);
      this._outputDistance.value = distance.toFixed(2);
      document.documentElement.style.setProperty(ACCENT_CSS_CUSTOMPROPERTY, this._toCss(closest));
    });
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
    return `rgb(${Object.values(rgb).join(',')})`;
  }

  _getDistance(input, ref) {
    const total = Object.keys(input).reduce((base, key) => {
      return base + Math.pow(input[key] - ref[key], 2);
    }, 0);
    return Math.sqrt(total);
  }

  getClosestColor(rgb) {
    const distances = this._rgbColors.map((color) => this._getDistance(rgb, color));
    const closestDistance = Math.min(...distances);
    const index = distances.findIndex((distance) => distance === closestDistance);
    return {
      closest: this._rgbColors[index],
      distance: closestDistance,
      original: rgb
    }
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