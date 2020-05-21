---
page: Components
anchor: Toggle-Range
---

## Toggle-Range
This hybrid component was designed to share styles between toggle switches and ranges merely by changing the type of input you are using within the component.

### Toggle
When using the component like a checkbox, the spacebar will toggle the switch.

<blu-togglerange selfdocument type="checkbox" input-type="checkbox">
  Checkbox toggle
</blu-togglerange>

::: audience-engineer
### Checkbox vs. range
The component was originally engineered to keep the `input[type="range"]` element for both toggles and ranges and only shortening the component (with a few other specific state attributes) since they were crafted to look similar. Using `input[type="checkbox"]` differs by requiring the label to be present, however this shouldn't be a concern as the label should _always_ be present for any interactive element.

Unfortunately, using `input[type="range"]` requires much more JavaScript to get a working toggle that would otherwise be done with the "[Checkbox Hack](https://css-tricks.com/the-checkbox-hack/)". Below is the original blueprint for the toggle using the `input[type="range"]`.

<blu-togglerange selfdocument type="toggle" input-value="1" input-min="0" input-max="1">
  Toggle using range input
</blu-togglerange>

You should immediately notice that the input doesn't behave as expected. Clicking does not toggle, but dragging does. Hitting enter or space does not toggle, using the arrow keys do. The JavaScript version below adds back the toggle functionality to the range.

<js-togglerange type="toggle">
  JavaScript enabled range input
</js-togglerange>

This now makes the component near identical to the CSS only version. 
:::



---

### Range
The range component allows the user to choose a value between a minimum and maximum value. It is composed of a native HTML `input[type="range"]` element and is interactive as such.

<blu-togglerange selfdocument type="range" input-value="3" input-min="0" input-max="10">
  Range
  <output slot="output">3</output>
</blu-togglerange>