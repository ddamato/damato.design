const path = require('path');
const fs = require('fs-extra'); 
const fm = require('front-matter');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const minify = require('html-minifier').minify;
const glob = require('glob-fs')({ gitignore: true });
const nunjucks = require('nunjucks');
const slug = require('slug');
const loader = new nunjucks.FileSystemLoader(path.resolve(__dirname, '..', 'templates'));
const env = new nunjucks.Environment(loader, {
  trimBlocks: true,
  lstripBlocks: true,
});
const COMPILED_SITE_PATH = path.resolve(__dirname, '..', '_site'); 

const sitemap = [];

async function compile() {
  const files = await glob.readdirPromise('content/*.md');
  files.forEach((file) => {
    const content = fs.readFileSync(file).toString();
    prepareSitemap(path.basename(file, '.md'), fm(content));
  });

  sitemap.sort(sortOrder);
  sitemap.forEach((config) => {
    config.sections = config.sections.sort(sortOrder);
    const sections = [config]
      .concat(config.sections)
      .map(renderConfig)
      .join('');
    const html = env.render('base.njk', { sections, title: config.page });
    const pageContent = minify(html, { collapseWhitespace: true });
    const pageFileName = `${COMPILED_SITE_PATH}/${config.basename}.html`;
    fs.ensureFileSync(pageFileName);
    fs.writeFileSync(pageFileName, pageContent, { encoding: 'utf8' });
  });
}

function renderConfig(config) {
  const { markdown, anchor } = config;
  const id = anchor ? `id="${anchor}"` : '';

  return `<section ${id}>${md.render(markdown)}</section>`;
}

function sortOrder(a, b) {
  return Number(a.order) - Number(b.order);
}

function prepareSitemap(basename, { attributes, body }) {
  if (!attributes.anchor) {
    // parent page
    sitemap.push(Object.assign(attributes, { basename, markdown: body, sections: [] }));
  } else {
    // anchored within page
    attributes.anchor = slug(attributes.anchor);
    let existingPage = sitemap.find(({ page }) => page === attributes.page);
    if (!existingPage) {
      existingPage = { page: attributes.page, sections: [], basename };
      sitemap.push(existingPage);
    }
    existingPage.sections.push(Object.assign(attributes, { markdown: body }));
  }
}

// const html = env.render('base.njk', { 
//   html: md.render(body)
// });
// const output = minify(html, { collapseWhitespace: true });

const sm = [{
  page: 'Getting started',
  html: '<header></header>',
  order: 1,
  sections: [{
    anchor: 'first section',
    html: '<section>from .md</section>',
    order: 1,
  }, {
    anchor: 'second section',
    html: '<section>from .md</section>',
    order: 2,
  }],
}]

compile();