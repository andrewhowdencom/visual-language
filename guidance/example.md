# Worked example: a project workspace

Imagine a small workspace for reviewing tasks. The same information appears as an Android screen and a responsive web page. The content is illustrative, not a prescribed product.

## Decision record

- **Task:** See what needs attention and open the next task.
- **Primary family:** Dusty Coral, chosen for a warm, welcoming tone. Another product may choose differently.
- **Color intensity:** Warm White canvas; a pale pink container for a selected task; a darker derived coral for the primary action and readable white text; the original Dusty Coral as a small accent. Mustard and blue remain optional details, not extra action colors.
- **Compact layout:** One task column, clear heading, primary action near the list, concise navigation.
- **Wide layout:** Task list plus a useful detail pane; reading width remains limited.
- **States:** Empty list, loading, error, selected task, disabled action, keyboard focus, and dark theme all need explicit treatment.

## Platform translation

| Decision | Android compact window | Responsive web wide window |
| --- | --- | --- |
| Navigation | Material 3 bottom navigation for a few top-level destinations | Visible sidebar with links and browser history |
| Primary action | Filled Material 3 button near the selected task | Prominent button in the task card |
| Content | One task column; open detail as a new destination or suitable pane | Task list beside a detail pane when width supports it |
| Selection | Tonal container plus label and icon | Tonal row plus clear heading in the detail region |
| Input | Touch targets, system bars, back navigation, accessibility semantics | Keyboard focus, native links and controls, browser zoom |

## What to notice

The hero and selected task earn their color because they carry hierarchy and state. Most of the working area stays neutral. The task title and action remain readable without depending on the accent. The web version uses links and browser navigation; the Android version uses platform navigation and Material 3 components. The site shows both visual sketches below. Its color selector can preview other families in these sketches; this decision record describes the Dusty Coral default.

To adapt this example, keep the decision process and replace its task, content model, primary family, and platform controls when the context calls for it.

## In the demonstration

The site lets you compare ready, empty, loading, and error states for the same fieldnotes task in web and Android sketches. The wider web and compact Android figures below show the ordinary populated view. These are visual simulations, not a running Android app.
