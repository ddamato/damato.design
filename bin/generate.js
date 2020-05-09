const path = require('path');
const fs = require('fs-extra');
const glob = require('glob-fs')({ gitignore: true });
const terser = require('terser');

const COMPILED_SITE_PATH = path.resolve(__dirname, '..', '_site'); 

async function generate() {
  const files = await glob.readdirPromise('blueprints/**');
  const blueprints = {};
  files.forEach((file) => {
    const extension = path.extname(file);
    const basename = path.basename(file, extension);
    if (!blueprints[basename]) {
      blueprints[basename] = {};
    }
    blueprints[basename][extension.slice(1)] = fs.readFileSync(file).toString().replace(/\r?\n|\r/g, '');
  });
  
  const elements = Object.keys(blueprints).map((blueprint) => {
    const { html, css } = blueprints[blueprint];
    const className = `Blu${blueprint.charAt(0).toUpperCase() + blueprint.slice(1)}`;
    return `class ${className} extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = '<style type="text/css">${css}</style>${html}';
      }
    }
    
    window.customElements.define('blu-${blueprint}', ${className});`
  }).join('');

  const elementsFileName = `${COMPILED_SITE_PATH}/elements.js`;
  fs.ensureFileSync(elementsFileName);
  fs.writeFileSync(elementsFileName, terser.minify(elements).code, { encoding: 'utf8' });
}

// generate();
