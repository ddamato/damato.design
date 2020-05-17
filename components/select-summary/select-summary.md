---
page: Components
anchor: Select-Summary
---

## Select-Summary
The select-summary component is a hybrid of a few components found in design systems which show and hide content. Each version allows for control via the spacebar to open and close the content drawer. By default, content will disrupt the remaining document flow. In other words, the content area does not flyout and appear on top of other content; it will push content down.

### type:select
When in the "select" configuration, the component acts like a stylized `<select>` component. Additional JavaScript is required for the value to appear in the value slot on selection. 

<blu-selectsummary selfdocument type="select">
  <span slot="value">Option 1</span>
  <svg-icon value="caret-down" slot="indicator-open" class="selectSummary--indicatorOpen"></svg-icon>
  <svg-icon value="caret-down" slot="indicator-close" class="selectSummary--indicatorClose"></svg-icon>
  <button class="selectSummary--option" value="1">Option 1</button>
  <button class="selectSummary--option" value="2">Option 2</button>
  <button class="selectSummary--option" value="3">Option 3</button>
</blu-selectsummary>

Example of a JavaScript enhanced version; value changes on selection:

<select-summary type="select">
  <span slot="value">Pick a fruit</span>
  <svg-icon value="caret-down" slot="indicator-open" class="selectSummary--indicatorOpen"></svg-icon>
  <svg-icon value="caret-down" slot="indicator-close" class="selectSummary--indicatorClose"></svg-icon>
  <button class="selectSummary--option" value="apple">Apple</button>
  <button class="selectSummary--option" value="banana">Banana</button>
  <button class="selectSummary--option" value="pear">Pear</button>
  <button class="selectSummary--option" value="orange">Orange</button>
</select-summary>

---

### type:menu
When in the "menu" configuration, the component is prepared to hold navigational items. No additional JavaScript is required for this component to work.

<blu-selectsummary selfdocument type="menu">
  <span slot="value">Group</span>
  <svg-icon value="plus" slot="indicator-open" class="selectSummary--indicatorOpen"></svg-icon>
  <svg-icon value="plus" slot="indicator-close" class="selectSummary--indicatorClose"></svg-icon>
  <a class="selectSummary--option" href="javascript:void(0);">Child link 1</a>
  <a class="selectSummary--option" href="javascript:void(0);">Child link 2</a>
  <a class="selectSummary--option" href="javascript:void(0);">Child link 3</a>
</blu-selectsummary>

---

### type:summary
When in the "summary" configuration, the component acts similarly to native HTML5 `<details>` and `<summary>` components. No additional JavaScript is required for this component.

<blu-selectsummary selfdocument type="summary">
  <span slot="value">Want to hear a joke about construction?</span>
  <svg-icon value="eye-close" slot="indicator-open" class="selectSummary--indicatorOpen"></svg-icon>
  <svg-icon value="eye-open" slot="indicator-close" class="selectSummary--indicatorClose"></svg-icon>
  <p>I’m still working on it.</p>
</blu-selectsummary>


