---
page: Color
order: 2
---

# With flying **colors**

The selection of colors in similar to the process outlined in _[Speccing Colors in Design Systems](https://medium.com/@ethersystem/speccing-colors-in-design-systems-f06e91ed9ca0)_. Beginning with layout colors; assuming everything is designed as grayscale. This is easy to visualize as wireframing with pencil and paper. This provides a perfect opportunity to identify the core user experience and lessen the concern about the personality of the interface.

A simple rule set here was to have three shades toward both ends of grayscale; 3 dark grays (including black) and 3 light grays (including white). This means there isn't a traditional material scale of color. Colors toward the middle of the scale tend to be less accessible, especially when mixing with more saturated colors.

> It was all about contrast. _[Ether @Medium](https://medium.com/@ethersystem)_

The color steps of gray are logistic, meaning they increment exponentially from the middle gray (`rgb(128, 128, 128)`). The formula to determine the level of gray is the following:

- **RGB**: `255 / 1 + Math.pow(grayscale, step)`, result is the number for each color channel.
- **HSL**: `100 / 1 + Math.pow(grayscale, step)`, result is the percentage of lightness (0% saturation).

Step 0 results in middle gray, each step either goes toward black (_ultragray_) or white (_infragray_). The `grayscale` value is where curation occurs as we can tune this to have more or less contrast between the grays. The higher the `grayscale`, the more contrast between infragray and ultragray (which also results in _less_ contrast between grays on the same side of the scale). You can see the effect of the value with the range control below.

<grayscale-range></grayscale-range>

However, the system here differs when thinking of semanitc colors. **No color is selected to represent something good or bad**. [Different colors mean different things to different cultures](https://uxplanet.org/understanding-color-psychology-though-culture-symbolism-and-emotion-215102347276). This could be rectified with localized color theming with a large effort for coverage or by choosing not including color as status. Instead, we expect to use other patterns to help guide the user in understanding a meaning of state.

Accent colors were chosen first by general hue then by [accessibility measurements](#color-usability) and finally applied to denote a user interaction or areas of interest. Many of the components that which can take an action are indicated using the accent color.

- <span class="badge bg-everyone">Green</span> is meant to indicate the content is for all audiences.
- <span class="badge bg-designer">Pink</span> is meant to indicate the content is for designers.
- <span class="badge bg-engineer">Blue</span> is meant to indicate the content is for engineers.

This is unique to the purposes of this site and its contents. For most of the site, a single accent color is chosen to enhance the user interface, except in areas where a specific audience is expected.