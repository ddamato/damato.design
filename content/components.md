---
page: Components
order: 6
---

# Bits & Pieces

The components provided below are presented with "Blueprint" examples, using the definition from the [Salesforce Lightning Design System](https://www.lightningdesignsystem.com/components/overview/). These components are crafted using only HTML/CSS and any functionality provided in the examples is available solely with these technologies. Components can be enhanced with JavaScript but the core functionality is based on web standards which allows them to be wired into any framework.

::: audience-engineer
### Markup decisions
One of the key decisions in ensuring that we can include interactivity without JavaScript is by setting HTML elements in a deliberate structure to allow for CSS selectors to act with conditional logic.

For example, in the interactive components below, the `<input>` element found within is typically the first child of the element's container. This allows the CSS sibling selectors (`+`, `~`) to help determine what elements exist in the container and make visual changes based on those elements.

In a simple case, the ["Checkbox Hack"](https://css-tricks.com/the-checkbox-hack/) is used to open/close the `summary-select` component by targeting affecting the visibility of the content container depending on if the checkbox is `:checked` or not.
:::
