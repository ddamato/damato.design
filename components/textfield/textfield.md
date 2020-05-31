---
page: Components
anchor: Textfield
---

## Textfield
The textfield is composed of a single input and label with an optional button to accompany the component. 

[Material Design text input revisit](https://medium.com/google-design/the-evolution-of-material-designs-text-fields-603688b3fe03)

<blu-textfield selfdocument input-placeholder="Input w/o button">
  Label
</blu-textfield>

<blu-textfield selfdocument input-placeholder="Input with primary button">
  Label
  <button class="button" slot="button" type="primary">Submit</button>
</blu-textfield>

<blu-textfield selfdocument input-placeholder="Input with secondary button">
  Label
  <button class="button" slot="button" type="secondary">Submit</button>
</blu-textfield>

<blu-textfield selfdocument input-placeholder="Input with default button">
  Label
  <button class="button" slot="button">Submit</button>
</blu-textfield>

<blu-textfield selfdocument input-placeholder="Input with disabled button">
  Label
  <button class="button" slot="button" disabled>Submit</button>
</blu-textfield>