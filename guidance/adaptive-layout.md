# Adaptive layout

## Design for available space

Design for the window and input mode, not a device label. **Must:** Support the smallest and largest intended windows without clipped content or stranded actions. Let type, spacing, and content reflow between layout changes. Test long labels, larger text, orientation changes, keyboard appearance, and split-screen windows.

For Android, start with Material's width classes: compact below 600 dp, medium from 600 to below 840 dp, and expanded from 840 dp. Larger classes exist for desktop-size windows. Use the current `WindowSizeClass` from the adaptive library and choose layout by available width, then check height and folding posture where relevant. [Android's current guide](https://developer.android.com/develop/adaptive-apps/guides/use-window-size-classes) explains the API and breakpoints.

For responsive web, these same numbers can be useful starting points in CSS pixels, but content decides the final breakpoints. A browser extension popup may be much narrower than a phone. Test the popup, full tab, and side panel independently if the product supports them.

| Available width | Starting structure | Review question |
| --- | --- | --- |
| Compact | One primary column, visible next action, short navigation | Is the task possible with one thumb or keyboard? |
| Medium | More breathing room, optional supporting region | Does added width improve the task or only stretch it? |
| Expanded | Constrained reading width, useful second pane or rail | Can people compare or act without excessive scanning? |

## Spacing and density

**Should:** Use the [foundation token](../tokens/foundations.json) spacing scale of 4, 8, 12, 16, 24, 32, and 48 logical units as a starting point, with 16–24 around mobile content and more generous margins as space grows. Preserve comfortable text measures instead of stretching paragraphs edge to edge. Let repeated cards form a grid only when each card remains easy to scan.

**Should:** Increase information value at larger widths: show context, filters, details, or comparisons when they help. Avoid a giant version of the compact layout. At compact widths, simplify composition before shrinking type or targets.

## Platform mapping

Android may move from a navigation bar to a rail or drawer, or from one pane to list-detail. Web navigation may shift from a compact menu to a visible sidebar; links, history, and browser zoom must continue to work. These are examples, not mandatory component substitutions. The underlying task and semantic hierarchy stay recognizable.
