const path = require('path');
const { rollup } = require('rollup');
const multi = require('@rollup/plugin-multi-entry');
const html = require('rollup-plugin-html');
const postcss = require('rollup-plugin-postcss');

const COMPONENT_PATH = path.resolve(__dirname, '..', 'components');
const COMPILED_SITE_PATH = path.resolve(__dirname, '..', '_site'); 

const inputOptions = {
  input: `${COMPONENT_PATH}/*.js`,
  plugins: [
    multi(),
    html(),
    postcss({ inject: false }),
  ],
};
const outputOptions = {
  file: `${COMPILED_SITE_PATH}/dxsComponents.js`,
  format: 'iife',
  name: 'dxsComponents',
};

async function bundle() {
  const process = await rollup(inputOptions);
  await process.write(outputOptions);
}

bundle();