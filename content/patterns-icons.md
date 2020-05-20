---
page: Patterns
anchor: Icons
order: 3
---

## Icons

::: audience-engineer
### Using web-components
Throughout the site, icons are usually handled with a custom web-component which was a decision based on the exploration outlined in _[The Road to SVG and Custom Elements in Clarity Icons](https://medium.com/claritydesignsystem/the-road-to-svg-and-custom-elements-in-clarity-icons-1d691c6cc91)_. The web-component fetches SVG markup and injects it into the page. The fetch only occurs if the markup hasn't been fetched before. Otherwise, it has a store of path data to reference when it needs to render from a previous fetch. This is similar to the fallback approach outlined in _[SVG 'use' with External Reference, Take 2](https://css-tricks.com/svg-use-with-external-reference-take-2/)_.

This site _could_ have used the original method outlined in the article, the drawback is SVGs are susceptible to CORS. If you were to host the SVG group file on a CDN, it would need to be under the same domain. This is often not the case with CDNs, so the approach here leverages a solution around this as if these files were requested across domains.

Additionally, because these are web components, there is a possibility of not loading because of a number of reasons. Luckily, [Google provides their icons as a icon font](https://google.github.io/material-design-icons/). Unlike [other icons fonts](https://fontawesome.com/), the icons render through the use of [ligature](https://alistapart.com/article/the-era-of-symbol-fonts/). We can use this to our advantage, assuming the Material Icon font is loaded on the page.

```css
svg-icon:not(:defined) {
  font-family: "Material Icons";
  text-transform: none;
  text-align: center;
  font-size: 1.5em;
  color: var(--svgIcon--fill, currentColor);
}
```

Then in your markup, you can set `<svg-icon value="flag">flag</svg-icon>`. If the icon is not defined (ie. no JavaScript), you get the Material Icon (referenced between the tags). If the icon is defined (ie. JavaScript is active), the text within doesn't display and the intended SVG is rendered instead.
:::