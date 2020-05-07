const style = `
  blu-flyout {
    display: none;
  }

  blu-flyout.show {
    display: initial;
  }
`;

class ddSelect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style type="text/css">${style}</style>
    <blu-fieldset>
      <blu-selectfield></blu-selectfield>
      <blu-flyout>
        <slot></slot>
      </blu-flyout>
    </blu-fieldset>`;

    this._selectfield = this.shadowRoot.querySelector('blu-selectfield');
    this._flyout = this.shadowRoot.querySelector('blu-flyout');

    const handleClose = () => {
      this._flyout.classList.remove('show');
      document.documentElement.removeEventListener('click', handleClose);
    }

    this._selectfield.addEventListener('click', (ev) => {
      ev.stopPropagation();
      this._flyout.classList.toggle('show');
      window.setTimeout(() => document.documentElement.addEventListener('click', handleClose), 0);
    });

    this._flyout.addEventListener('click', (ev) => {
      ev.stopPropagation();
      this._flyout.classList.remove('show');
    });

    this._slot = this.shadowRoot.querySelector('slot');
    this._slot.addEventListener('slotchange', () => {
      const isOpen = this._flyout.classList.contains('show');

      if (!isOpen) {
        this._flyout.classList.add('show');
      }

      this._options = this._slot.assignedNodes();
      const chosen = [...this._options].reduce((chosen, option) => {
        option.addEventListener('chosen', (ev) => {
          this._selectfield.innerText = ev.detail.name;
        });
        return chosen || option.chosen;
      }, null);

      if (chosen) {
        this.setValue(chosen.innerText);
      } else {
        this._options[0].chosen = true;
      }

      window.setTimeout(() => {
        const minWidth = this.findMinWidth(this._options);
        this._selectfield.style.minWidth = `${minWidth}px`;
        if (!isOpen) {
          this._flyout.classList.remove('show');
        }
      }, 0);
    });
  }

  findMinWidth(options) {
    options = options || this.options;
    return [...options].reduce((min, option) => {
      return Math.max(min, option.offsetWidth);
    }, 0);
  }
}

window.customElements.define('dd-select', ddSelect);