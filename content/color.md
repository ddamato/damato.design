---
page: Color
order: 2
---

# With flying **colors**

### Color Curation
The selection of colors started with assuming everything is designed as grayscale. This is easy to visualize as wireframing with pencil and paper. This provides a perfect opportunity to identify the user experience and lessen the concern about the personality of the interface.

A simple rule set here was to have three shades on both sides of grayscale; 3 dark grays (including black) and 3 light grays (including white). This means there isn't a traditional material scale of color. Colors toward the middle of the scale tend to be less accessible, especially when mixing with more saturated colors.

Then accent colors were chosen first by general hue then by [accessibility measurements](#color-usability) and then applied under a set of guidelines.

- Use an accent color to denote a user interaction. Many of the components that can be touched change color to indicate waiting for the user to make the next move.
- Don't use color to indicate a culture's common expression of status. No color is selected to represent something good or bad. [Different colors mean different things to different cultures](https://uxplanet.org/understanding-color-psychology-though-culture-symbolism-and-emotion-215102347276). This could be rectified with localized color theming with a large effort for coverage or by choosing not including color as status.
- Use color to indicate a group of items that are related. An example of this is found in the menu where the children of the section are grouped with a accented line to the left.

### Page controls
Some of the sections with provide control to change colors. If you wish to reset the page back to the original starting values, you can press this button:

<button class="button" type="primary" onclick="document.documentElement.removeAttribute('style')">Reset page colors</button>