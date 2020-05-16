---
page: Components
anchor: Select-Summary
---

## Select-Summary
The select-summary component is a hybrid of a few components found in design systems which show and hide content. Each version allows for control via the spacebar to open and close the content drawer. By default, content will disrupt the remaining document flow. In other words, the content area does not flyout and appear on top of other content; it will push content down.

### Select type
When in the "select" configuration, the component acts like a stylized `<select>` component. Additional JavaScript is required for the value to appear in the title slot on selection. 

<blu-selectsummary selfdocument type="select">
  <span slot="title">Option 1</span>
  <button class="selectSummary--option" value="1">Option 1</button>
  <button class="selectSummary--option" value="2">Option 2</button>
  <button class="selectSummary--option" value="3">Option 3</button>
</blu-selectsummary>

Example of a JavaScript enhanced version; value changes on selection:

<select-summary type="select">
  <span slot="title">Pick a fruit</span>
  <button class="selectSummary--option" value="apple">Apple</button>
  <button class="selectSummary--option" value="banana">Banana</button>
  <button class="selectSummary--option" value="pear">Pear</button>
  <button class="selectSummary--option" value="orange">Orange</button>
</select-summary>

---

### Menu type
When in the "menu" configuration, the component is prepared to hold navigational items. No additional JavaScript is required for this component to work.

<blu-selectsummary selfdocument type="menu">
  <span slot="title">Group</span>
  <a class="selectSummary--option" href="#">Child link 1</a>
  <a class="selectSummary--option" href="#">Child link 2</a>
  <a class="selectSummary--option" href="#">Child link 3</a>
</blu-selectsummary>

---

### Summary type
When in the "summary" configuration, the component acts similarly to native HTML5 `<details>` and `<summary>` components. No additional JavaScript is required for this component.

<blu-selectsummary selfdocument type="summary">
  <span slot="title">Want to hear a joke about construction?</span>
  <p>I’m still working on it.</p>
</blu-selectsummary>


