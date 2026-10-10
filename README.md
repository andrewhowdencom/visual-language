# Visual Language

A platform-independent design language for humans and AI agents. The first release supports Android and responsive web, with a physical-space translation for an office. It draws on Material 3 Expressive foundations while using native interaction patterns on each platform.

## For agents

Start with [guidance/SKILL.md](guidance/SKILL.md). It links to the rules needed to plan, build, and review an experience. Machine-readable starter values live in [tokens/palette.json](tokens/palette.json) and [tokens/foundations.json](tokens/foundations.json).

## Website

The site is generated from the same Markdown files agents read:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm check
```

Serve `dist/` through a local HTTP server. For a local root-path preview, build with `SITE_BASE_PATH=/ pnpm build`. GitHub Actions builds and deploys the site to GitHub Pages on pushes to `main`; pull requests run the build and checks without publishing. Set **Settings → Pages → Build and deployment → Source** to **GitHub Actions** for the repository. The default deployment base path is `/visual-language/`.

Dusty Coral is the default primary family. The site's Color control previews seven accent families in light and dark modes and saves the reader's choice in the browser. All nine Android-skill anchor colors appear in the site palette; Warm White and Espresso are background and text neutrals. The schemes come from `tokens/palette.json`; the generated CSS stays in step with those tokens.

The guidance is an MVP. Its Material reference is Material Design 3 with Material 3 Expressive as of October 2026. Updates are adopted deliberately rather than changing published rules automatically.
