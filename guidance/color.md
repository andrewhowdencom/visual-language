# Color and intensity

## Anchor palette

These are starting colors, not nine simultaneous UI roles. The brighter values suggested in [issue #1](https://github.com/andrewhowdencom/visual-language/issues/1) remain exploratory. Deep Avocado is the weightlifting app's primary, not a universal primary.

| Family | Anchor | Typical starting use |
| --- | --- | --- |
| Warm White | `#FAFAF7` | Light canvas |
| Espresso | `#3C3432` | Primary text and dark neutral |
| Deep Avocado | `#5F704B` | Possible primary; weightlifting example |
| Avocado Mint | `#9FB58A` | Tonal accent |
| Faded Mustard | `#D9B45B` | Warm primary option or small accent |
| Soft Terracotta | `#D98B6C` | Peach primary option |
| Dusty Coral | `#D9878F` | Default pink primary family |
| Muted Mauve | `#A88BA8` | Purple primary option or accent |
| Powder Blue | `#83AFC1` | Blue primary option or informational accent |

## Family × intensity

Choose a primary family for the product. For each family in use, define **subtle**, **base**, and **vivid** tokens. Subtle is a container or atmospheric tint; base is the recognizable anchor or a close tonal variant; vivid is a more assertive detail. Intensity describes visual emphasis, not a promise that a value is safe for text. Do not invent vivid values by simply increasing saturation. Derive a small ramp, inspect it beside the other families, and test every foreground/background pair in its actual role.

## Semantic roles first

**Must:** Assign colors through roles such as `canvas`, `surface`, `text`, `text-muted`, `primary`, `on-primary`, `primary-container`, `on-primary-container`, `border`, `focus`, `error`, and `on-error`. Keep raw hex values in token definitions or artwork. For Android, map those roles into Material 3 `ColorScheme` rather than recoloring each component separately. For web, expose them as CSS custom properties.

The [token file](../tokens/palette.json) includes the anchors and six tested primary families. Dusty Coral is the default for this site and its worked example. The site's color selector previews the other families without changing this written recommendation. A product can select another family when its context calls for it. The original pink anchor is too light for ordinary white text, so the light scheme uses a darker derived coral for filled primary actions and keeps `#D9878F` as the family anchor. The scheme must be checked again if a color, font weight, opacity, or surface changes.

## Compose color with context

- **Must:** Meet at least WCAG 2.2 AA contrast for digital text: 4.5:1 for ordinary text and 3:1 for large text. Meaningful non-text boundaries and states need 3:1 where the criterion applies. Check light, dark, hover, focus, selected, disabled, and error states.
- **Must:** Never rely on color alone for status, selection, or chart meaning. Add text, shape, icon, position, or pattern.
- **Should:** Keep broad working surfaces neutral. Use color more intensely in small actions, selected states, data highlights, or hero moments. The balance may change on a watch, a large display, a poster, or a wall.
- **Should:** Build a deliberate dark scheme with a neutral dark canvas, differentiated surfaces, light text, and visible muted accents. Do not invert the light values mechanically.
- **May:** Use dynamic color on Android when personalization is part of the product. Retain a tested fallback and ensure the experience still has a recognizable structure.

See [WCAG 2.2 contrast](https://www.w3.org/TR/WCAG22/#contrast-minimum) and [non-text contrast](https://www.w3.org/TR/WCAG22/#non-text-contrast). Physical colors need on-site samples under the actual lighting; screen hex values are not paint specifications.
