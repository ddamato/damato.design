const path = require('path');
const { rollup } = require('rollup');
const multi = require('@rollup/plugin-multi-entry');
const html = require('rollup-plugin-html');
const postcss = require('rollup-plugin-postcss');

const COMPONENT_PATH = path.resolve(__dirname, '..', 'components');
const CONTROL_PATH = path.resolve(__dirname, '..', 'controls');
const COMPILED_SITE_PATH = path.resolve(__dirname, '..', '_site'); 

const inputOptions = {
  input: [`${COMPONENT_PATH}/*.js`, `${CONTROL_PATH}/*.js`],
  plugins: [
    multi(),
    html(),
    postcss({ inject: false }),
  ],
};
const outputOptions = {
  file: `${COMPILED_SITE_PATH}/components.js`,
  format: 'iife',
  name: 'components',
};

async function bundle() {
  const process = await rollup(inputOptions);
  await process.write(outputOptions);
}

// bundle();