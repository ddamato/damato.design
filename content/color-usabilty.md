---
page: Color
anchor: Usability
order: 1
---

## Usability

### WCAG accessible text
In choosing colors, accessibility must be a priority. With the layout colors selected at opposite ends of the scale, this ensures that if a gray on one side appears as text on top of a gray on the other side, the text _should_ pass accessibility standards (assuming the font size is appropriate).

While there are now [different standards between AA and AAA](https://www.w3.org/TR/WCAG21/#contrast-minimum) which also relate to font size, a general rule is to ensure a 4.5:1 contrast ratio between the background color and text. Throughout the site, this ratio is typically much higher. You can use the colorfield control below to test the ratio between a chosen text color and the current background color of the site. This should also update when changing the system color.

<a11y-color></a11y-color>

The process in creating this functionality is outlined in the article _[Building your own color contrast checker](https://dev.to/alvaromontoro/building-your-own-color-contrast-checker-4j7o)_ which also explains the calculations involved to determine the ratio.

### Accent color selection
Selecting an accent color to support light and dark mode themes was _tricky_.

The article _[Which Colors Look Good on Black and White?](https://dev.to/finnhvman/which-colors-look-good-on-black-and-white-2pe6)_ ends with a list of colors however, it would appear that these colors are _only_ for black and white. Additionally, a post within the UX Stack Exchange also asks for a _[Background colour suitable for both black and white text](https://ux.stackexchange.com/questions/73763/background-colour-suitable-for-both-black-and-white-text)_ with [an answer](https://ux.stackexchange.com/questions/73763/background-colour-suitable-for-both-black-and-white-text) providing a link to a much larger table of colors. That link is broken however, I've [found a backup](https://maswildan.wordpress.com/2016/08/28/color-contrast-on-blackwhite-background/) and have prepared a [json file](json/a11yColorsOnBlackAndWhite.json) with the referenced colors. Those colors are loaded into the colorfield component below and the accent colors were chosen from this set.

<closest-color></closest-color>

The colorfield component above provides the [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance) between the chosen color and a color from the list following [the idea from a Stack Overflow answer](https://stackoverflow.com/a/9018153/3928045). There are [other opinions](https://graphicdesign.stackexchange.com/questions/121923/how-to-quantify-the-distance-between-two-colors) regarding the accuracy of color distances, including merely using the contrast ratio.

Admittedly, the accent colors selected for the site _do not_ meet the 4.5:1 contrast ratio for both the light and dark themes and therefore you will find the majority of text is not given an accent color _unless_ it is actionable. Actionable text styles has been modified to increase legibility to allow for accent colors to be used in these locations.
