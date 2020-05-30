---
page: Layout
anchor: Design Tokens
order: 1
---

## Design Tokens

The layout design tokens come in a single group (**genitive**, relating to each other) which can be applied in the page or within components.

### Genitive Layout Tokens
These tokens describe the general family that possess all the layout values as human-readable names. They can be applied anywhere spacing or elevation needs to be defined.

#### Spacing tokens
These are applied by multiplying the token within a `calc()` function by `1rem` as the value of the property.
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--density--xs` | Extra-small spacing factor. | `.25` |
| `--density--sm` | Small spacing factor. | `.5` |
| `--density--md` | Medium spacing factor. | `1` |
| `--density--lg` | Large spacing factor. | `2` |
| `--density--xl` | Extra-large spacing factor. | `4` |

#### Elevation tokens
| Token | Description | Value |
| ----- | ----------- | ----- |
| `--boxElevated--shadowColor` |  Describes the shadow color for elevated containers. This includes some translucent alpha channel. | <span class="swatch" style="background: var(--boxElevated--shadowColor)" ></span> |

