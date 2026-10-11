---
name: visual-language
description: Plan, build, and review Android or responsive-web experiences with the Visual Language design system.
---

# Use this visual language

This is an MVP for designing a complete experience, from brief to review. Read this file first, then the linked guidance for the work you are doing. The language is platform independent; Android and responsive web have implementation guidance today. iOS, watches, and other devices are future adapters, not implied copies of Android UI.

## Authority

**Must** is a requirement. **Should** is the default; document a reason to depart. **May** is an option. Accessibility, clarity, and platform interaction conventions take precedence over a decorative detail. Material Design 3 and Material 3 Expressive supply a structural reference, not a command to place Android controls on the web.

## Design loop

1. **Frame the job.** Write down the audience, primary task, environment, input methods, content density, and smallest and largest supported windows. Identify any physical setting in which the experience lives.
2. **Choose a character.** Read [Principles](principles.md). Name the feeling the experience needs, its one primary color family, and which details deserve vivid color. Do not use all palette families just because they exist.
3. **Map tokens.** Read [Color](color.md), [the palette tokens](../tokens/palette.json), and [foundation tokens](../tokens/foundations.json). Map semantic roles before assigning colors to components. Dusty Coral is the default starter family. The site lets readers preview seven tested primary families; a product still chooses one based on its context. Derive and test a new scheme when none of the starter families fits.
4. **Plan layouts and states.** Read [Adaptive layout](adaptive-layout.md) and [Components and interaction](components.md). For data entry or editing, read [Forms and fields](forms.md) and define the save contract. Cover compact and wide windows, keyboard and touch, loading, empty, error, disabled, selected, and focus states.
5. **Implement natively.** On Android, map roles into Material 3 `ColorScheme`, typography, shapes, and adaptive components. On web, use CSS custom properties, semantic HTML, responsive layout, and native controls where appropriate. Use current platform documentation for API details.
6. **Review the result.** Run the checks in [Review](review.md) against rendered screens at small and large sizes, light and dark themes, and keyboard or accessibility input. Repair failures before delivery.

If designing a space or object, read [Physical space](physical-space.md). Read [Worked example](example.md) when you need to see restrained color and responsive structure together.

## Deliver with the work

Include a brief decision record: task and supported contexts, selected primary family, semantic token map, layout changes by window size, platform-specific choices, and the result of the review. Mark assumptions and any guidance gaps. Do not claim a color pair or state passes accessibility checks without checking the rendered result.

## Source and maturity

These Markdown files are canonical. The website renders them; it does not contain separate rules. The nine original palette colors are anchors. Derived tokens in the starter scheme are examples for the first release and may be refined with evidence. Material reference: Material Design 3 with Material 3 Expressive, reviewed October 2026. Changes to Material are adopted deliberately.

## In the demonstration

The site lets you step through a fieldnotes decision record from task brief to rendered review. It shows how each step adds a concrete choice; it is an illustration of the design loop, not a substitute for recording decisions for the real product.
