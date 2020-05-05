const fs = require('fs-extra'); 
const fm = require('front-matter');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();
const glob = require('glob-fs')({ gitignore: true });
const nunjucks = require('nunjucks');

async function compile() {
  const files = await glob.readdirPromise('content/*.md');
  files.forEach((file) => {
    const content = fs.readFileSync(file).toString();
    const { attributes, body } = fm(content);
    const html = md.render(body);
    const page = nunjucks.render('templates/base.njk', { html });
    console.log(attributes);
    console.log(page);
  })
}

compile();