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
  
  let blueprintCss = '';

  const elements = Object.keys(blueprints).map((blueprint) => {
    const { html, css } = blueprints[blueprint];
    if (css) {
      blueprintCss += css;
    }
    const cleanName = blueprint.toLowerCase().replace(/^dd/, '');
    const className = `Blu${cleanName}`;
    const tagName = `blu-${cleanName}`;
    console.log(tagName);
    return `class ${className} extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = '<style type="text/css">${css}</style>${html}';
      }
    }
    
    window.customElements.define('${tagName}', ${className});`
  }).join('');

  const elementsFileName = `${COMPILED_SITE_PATH}/elements.js`;
  const blueprintCssFileName = `${COMPILED_SITE_PATH}/blueprints.css`;

  const { code } = terser.minify(elements);
  const elementsJs = code || elements;

  fs.ensureFileSync(elementsFileName);
  fs.writeFileSync(elementsFileName, elementsJs, { encoding: 'utf8' });

  fs.ensureFileSync(blueprintCssFileName);
  fs.writeFileSync(blueprintCssFileName, blueprintCss, { encoding: 'utf8' });
}

generate();
