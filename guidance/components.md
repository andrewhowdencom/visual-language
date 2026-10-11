# Components and interaction

## Start with the task

Pick a component for its job, not its appearance. **Must:** Use clear labels and distinguish primary, secondary, and destructive actions. Provide visible hover, focus, pressed, selected, loading, disabled, success, and error feedback where each state applies. State changes should be understandable without color alone.

| Need | Android starting point | Responsive web starting point |
| --- | --- | --- |
| Primary action | Material 3 filled button or suitable prominent action | Semantic `button` with primary role |
| Secondary action | Outlined or tonal button | Secondary `button` or link when navigating |
| Text entry | Material 3 text field with label and support text | Labeled native `input` or `textarea` |
| Choice | Radio, checkbox, switch, or chips by meaning | Native choice controls with clear grouping |
| Navigation | Material navigation pattern matched to window size | Links, browser history, responsive nav |
| Collection | List or cards chosen by scan/action needs | List, table, or cards chosen by data shape |
| Feedback | Inline state, snackbar, dialog only when warranted | Inline message, status region, dialog only when warranted |

## Shape, type, and surface

**Should:** Use a few purposeful radii: moderate for inputs, larger for content cards, and rounded shapes for prominent actions or selected navigation. [Foundation tokens](../tokens/foundations.json) provide starter values. A screen full of identical pills loses hierarchy. Use white or near-white content surfaces, modest borders, and pale tonal containers before adding shadows. Keep body text at a comfortable reading size and use a sturdy geometric or grotesk sans for headings. Numeric data should align and remain legible.

## Input and navigation

**Must:** Keep labels visible, explain errors next to the affected field, and preserve user input when validation fails. On web, use elements with their native semantics and keyboard behavior. On Android, respect system bars, back navigation, touch targets, and accessibility semantics. Ensure focus can move logically through every interactive region.

**Should:** Keep the next action near the content it affects. Use confirmation for consequential or irreversible actions, not routine choices. Prefer progressive disclosure to a wall of controls.

For data entry and editing, use [Forms and fields](forms.md) to choose how drafts, validation, and saving behave.

## Motion and motifs

**Should:** Use motion to explain where content came from or what changed. Avoid decorative motion during dense work. Honor reduced-motion settings. Small flat motifs may distinguish a landing or overview surface, but they must never carry information alone or compete with controls.

## In the demonstration

The fieldnotes controls below let you select a task, complete it, simulate failure, and reset. Selection, loading, success, disabled, and error have visible text as well as color. Use keyboard focus to inspect the same controls without a pointer.
