# Forms and fields

Forms should make it clear what can be changed, when a change takes effect, and how to recover if it fails. Keep working screens visually quiet: readable values, neutral field surfaces, clear focus, and color reserved for meaningful action or state. Use [Components and interaction](components.md) for the shared control principles.

## Choose the save contract first

**Must:** Decide and communicate whether a value is a draft, saved automatically, or submitted with an action. The presence of a text field alone does not tell someone when data is stored. Use one rule consistently for comparable fields in a flow.

Before removing a control or automating a save, trace what its action changes: stored records, calculations, history, import or export, and any other place the value appears. A shorter form must not silently change the data rule. Decide what an unfinished item is and whether Cancel, Back, switching screens, or an interruption discards or restores its draft.

| Situation | Starting behavior | What the person should see |
| --- | --- | --- |
| Create a named item | Keep a draft until an explicit **Add** or **Create** action succeeds. | A half-written or empty name does not create an item. The action names the result. |
| Edit one existing value in place | Save a valid change after a short pause, on focus loss, or on keyboard Done when quick editing is the main task. | The new value stays visible. Routine successful saves can stay quiet; a failed save needs a clear error and retry. |
| Edit independent values | Let each change take effect separately, even if the fields share a screen. | Saving one value does not require an unrelated edit. |
| Edit values that form one decision | Submit them together with an explicit **Save** or task-specific action unless completion itself is unmistakable and easy to correct. | The action applies to the whole decision, with errors attached to affected fields. |
| Enter a repeating row | Show the next blank row when that makes entry faster; persist a row only when its required values are valid and the person completes it. | A blank or partial row remains a draft. Avoid an Add control if completion already advances to the next row. |

These are starting patterns, not a universal autosave rule. Use explicit submission when a change has a consequential effect, needs review as a group, or would be surprising to commit while typing. **Must:** Give a distinct outcome to Done, Save, Add, and navigation away. For an automatically saved field, do not leave a valid edit stranded solely because the person closed the keyboard or left the screen. For explicit submission, make unsaved changes apparent before they are discarded. Avoid a generic **Save** button when its scope is unclear; name the object or action where useful.

For automatically added rows, decide whether each new field starts blank or copies a previous value; do not let a visual mockup settle that data choice. A row appearing on screen does not mean it has been persisted.

## Compose the form

- **Must:** Give every field a persistent visible label. Use placeholder text only for examples or format hints. Put units beside numeric values and keep them legible while editing.
- **Should:** Choose controls by the data: text for names, a numeric keyboard for quantities, a selection control for finite choices, and a multiline field for prose. Do not use free text where constrained input makes errors likely.
- **Should:** Group fields that are saved together under a clear heading. Put the primary action close to the content it affects. On compact windows, keep the sequence readable with the keyboard open; on wider windows, add space or context without stretching fields across the whole screen.
- **Should:** Use one clear boundary per editable row. An outlined field inside an outlined card often adds weight without adding meaning. Keep adjacent actions distinct and reachable at large text sizes.
- **Should:** Keep form typography ordinary and readable, including measurements and numbers. Use a subtle neutral field surface, strong value contrast, and restrained color; decorative graphics belong away from dense input work.
- **Must:** Support logical focus order, visible focus, accessible names, and reachable controls with touch, keyboard, and assistive technology. Set appropriate input and keyboard actions; avoid relying on color or icons alone to explain a state.

## Validate and recover

**Must:** Preserve what the person typed when validation or persistence fails. Explain an invalid value next to its field in words, and make the path to correction clear. For grouped submission, identify every affected field and provide a short summary when useful. Do not mark untouched optional fields as errors.

**Should:** Validate format as the person edits when the rule is clear, but avoid disruptive errors before they have had a reasonable chance to finish. Check cross-field rules when the related values are present or on submission. If saving is asynchronous, keep the latest edit from being overwritten by an earlier response. Keep a failed draft available for retry or correction, including after navigation where the task requires it.

As a starting point, show an error when the person leaves a field or attempts to commit it. Give earlier feedback only when the rule is unambiguous and it helps correction; do not display a premature error while a value is still being formed.

Preserve an unfinished draft and the person's place through expected interruptions when the task calls for it. On Android, check activity recreation and appropriate process restoration; on web, decide what navigation or reload should do. Restoring a draft is distinct from committing it to the product's stored data.

Use routine success feedback sparingly when the changed value itself confirms the result. **Must:** Show a recoverable error if an automatic save fails; do not silently discard the draft or claim it was saved. For an explicit action, show progress when completion is not immediate and prevent accidental duplicate submission.

## Map to each platform

| Concern | Android | Responsive web |
| --- | --- | --- |
| Field and label | Material 3 text field or suitable native control, with label, support/error text, and semantic state | Native `input`, `textarea`, or choice control with an associated `label`; link hints and errors to the field |
| Keyboard | Match keyboard type and IME action to the value and next step; check the form with the IME visible | Use appropriate input type and autocomplete; preserve Enter and Tab behavior |
| Error and status | Place field errors beside the control and announce relevant changes accessibly | Use field relationships and an appropriate status/error region for asynchronous results |

Platform APIs change; consult current platform documentation when implementing. Keep the same save contract and error behavior across platforms while following each platform's native interaction conventions.

Implementation references: [Android Compose text fields](https://developer.android.com/develop/ui/compose/text/user-input), [Android Compose focus](https://developer.android.com/develop/ui/compose/touch-input/focus/react-to-focus), [W3C form labels](https://www.w3.org/WAI/tutorials/forms/labels/), and [W3C input validation](https://www.w3.org/WAI/tutorials/forms/validation/).

## Review a form

Walk through an empty draft, a valid edit, an incomplete value, a rejected value, a save failure, Cancel, and leaving the screen mid-edit. Check compact and wide layouts, an open keyboard, long labels, large text, light and dark themes, RTL layout, touch targets, and assistive-technology order. On Android, verify keyboard resize, Back, and recreation on a device or emulator where relevant; code inspection alone does not prove those behaviors. Record the save contract, initial values, and any behavior that differs between fields.

## In the demonstration

The browser-only fieldnotes example below has four commitments: **Add task** creates an item; renaming one existing task saves independently after a pause or when editing ends; a start/end time pair uses **Save focus block**; and completing a checklist row creates the next blank draft. Try an empty name, a failed rename, and an invalid time range. **Reset demo** returns the example to its starting state. Nothing is sent to a server.
