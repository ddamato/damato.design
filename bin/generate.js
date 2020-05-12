const path = require('path');
const fs = require('fs-extra');
const glob = require('glob-fs')({ gitignore: true });
const terser = require('terser');
const postcss = require('postcss');
const nested = require('postcss-nested');
const mixins = require('postcss-sassy-mixins');
const cssminifier = require('css-simple-minifier');

const COMPILED_SITE_PATH = path.resolve(__dirname, '..', '_site');

async function bundleCSS() {
  const pcssFileOrder = ['vars.pcss', 'index.pcss', 'content.pcss', 'mobile.pcss'];
  const pcss = pcssFileOrder.reduce((pcss, pcssFileName) => {
    const filePath = path.resolve(__dirname, '..', 'styles', pcssFileName);
    return pcss + fs.readFileSync(filePath, { encoding: 'utf8'});
  }, '');
  const { css } = await postcss([
    nested(),
    mixins(),
  ]).process(pcss, { from: undefined });
  return css;
}

async function generate() {
  let siteCss = await bundleCSS();

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
    if (css) {
      siteCss += css;
    }
    const cleanName = blueprint.toLowerCase().replace(/-/gm, '');
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
  const stylesCssFileName = `${COMPILED_SITE_PATH}/styles.css`;

  const { code } = terser.minify(elements);
  const elementsJs = code || elements;

  fs.ensureFileSync(elementsFileName);
  fs.writeFileSync(elementsFileName, elementsJs, { encoding: 'utf8' });

  fs.ensureFileSync(stylesCssFileName);
  fs.writeFileSync(stylesCssFileName, cssminifier(siteCss), { encoding: 'utf8' });
}

generate();
