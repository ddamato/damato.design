const path = require('path');
const fs = require('fs-extra');
const glob = require('glob-fs')({ gitignore: true });
const terser = require('terser');
const postcss = require('postcss');
const nested = require('postcss-nested');
const mixins = require('postcss-sassy-mixins');
const cssminifier = require('css-simple-minifier');

const { rollup } = require('rollup');
const multi = require('@rollup/plugin-multi-entry');
const html = require('rollup-plugin-html');
const postcssPlugin = require('rollup-plugin-postcss');

const SCRIPTS_PATH = path.resolve(__dirname, '..', 'scripts');
const COMPONENT_PATH = path.resolve(__dirname, '..', 'components');
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

async function bundleJS() {
  const inputOptions = {
    input: [`${COMPONENT_PATH}/*.js`, `${SCRIPTS_PATH}/*.js`],
    plugins: [
      multi(),
      html(),
      postcssPlugin({ inject: false }),
    ],
  };
  const outputOptions = {
    file: `${COMPILED_SITE_PATH}/components.js`,
    format: 'iife',
    name: 'components',
  };
  const bundle = await rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  return output.reduce((script, { code }) => script + (code || ''), '');
}

async function bundle() {
  let siteCss = await bundleCSS();
  let siteJs = await bundleJS();

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

  siteJs += Object.keys(blueprints).map((blueprint) => {
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

  const scriptsFileName = `${COMPILED_SITE_PATH}/scripts.js`;
  const stylesCssFileName = `${COMPILED_SITE_PATH}/styles.css`;

  const { code } = terser.minify(siteJs);
  const javascript = code || siteJs;

  fs.ensureFileSync(scriptsFileName);
  fs.writeFileSync(scriptsFileName, javascript, { encoding: 'utf8' });

  fs.ensureFileSync(stylesCssFileName);
  fs.writeFileSync(stylesCssFileName, cssminifier(siteCss), { encoding: 'utf8' });
}

bundle();
