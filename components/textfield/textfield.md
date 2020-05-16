---
page: Components
anchor: Textfield
---

## Textfield
The textfield is composed of a single input and label with an optional button to accompany the component. The following displays use with `.button[type="primary"]`

<blu-textfield selfdocument input-placeholder="Enter text here">
  Label
  <button class="button" slot="button" type="primary">Submit</button>
</blu-textfield>

It is not recommended to use the `.button[type="secondary"]` as its borders will conflict with the component's borders.

<blu-textfield selfdocument input-placeholder="Enter text here">
  Label
  <button class="button" slot="button">Submit</button>
</blu-textfield>