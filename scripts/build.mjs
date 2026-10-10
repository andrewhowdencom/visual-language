import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { marked } from 'marked';

const root = process.cwd();
const out = join(root, 'dist');
const base = normalizeBase(process.env.SITE_BASE_PATH ?? '/visual-language/');
const tokenData = JSON.parse(await readFile(join(root, 'tokens/palette.json'), 'utf8'));

const pages = [
  { slug: 'start', file: 'SKILL.md', label: 'Start here', section: 'Use the language', description: 'The complete agent workflow, from brief to review.' },
  { slug: 'principles', file: 'principles.md', label: 'Principles', section: 'Foundations', description: 'The character and choices behind the language.' },
  { slug: 'color', file: 'color.md', label: 'Color & intensity', section: 'Foundations', description: 'Anchor colors, semantic roles, and contextual intensity.' },
  { slug: 'adaptive-layout', file: 'adaptive-layout.md', label: 'Adaptive layout', section: 'Build', description: 'Useful layouts from compact windows to wide screens.' },
  { slug: 'components', file: 'components.md', label: 'Components & interaction', section: 'Build', description: 'Native controls and clear states on Android and web.' },
  { slug: 'example', file: 'example.md', label: 'Worked example', section: 'Apply', description: 'One task workspace across Android and responsive web.' },
  { slug: 'physical-space', file: 'physical-space.md', label: 'Physical space', section: 'Apply', description: 'Translate the language into an office and objects.' },
  { slug: 'review', file: 'review.md', label: 'Review checklist', section: 'Apply', description: 'Checks to run against a rendered experience.' }
];

function normalizeBase(value) {
  let path = value.startsWith('/') ? value : `/${value}`;
  if (!path.endsWith('/')) path += '/';
  return path.replace(/\/+/g, '/');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function themeStyles() {
  const fields = { primary: 'primary', primaryStrong: 'primary-strong', onPrimary: 'on-primary', primaryContainer: 'primary-container', onPrimaryContainer: 'on-primary-container', focus: 'focus' };
  const declarations = (values) => Object.entries(fields).map(([field, css]) => `--${css}:${values[field]};`).join('');
  return Object.entries(tokenData.themes).map(([key, theme]) => {
    const selector = `:root[data-color="${key}"]`;
    const light = `${key === tokenData.defaultTheme ? ':root,' : ''}${selector}{--theme-anchor:${theme.anchor};--example-primary:${theme.light.primary};--example-strong:${theme.light.primaryStrong};--example-container:${theme.light.primaryContainer};${declarations(theme.light)}}`;
    const dark = `${selector}[data-theme="dark"]${key === tokenData.defaultTheme ? ',:root:not([data-color])[data-theme="dark"]' : ''}{${declarations(theme.dark)}}`;
    const automatic = `@media(prefers-color-scheme:dark){${selector}:not([data-theme="light"])${key === tokenData.defaultTheme ? ',:root:not([data-color]):not([data-theme="light"])' : ''}{${declarations(theme.dark)}}}`;
    return `${light}\n${dark}\n${automatic}`;
  }).join('\n');
}

function slugify(value) {
  return value.toLowerCase().replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function href(slug) {
  return `${base}guide/${slug}/`;
}

function markdownLink(url) {
  if (url.startsWith('../tokens/')) return `${base}tokens/${url.split('/').pop()}`;
  if (url.startsWith('http') || url.startsWith('#')) return url;
  const file = url.split('/').pop();
  const page = pages.find((item) => item.file === file);
  return page ? href(page.slug) : url;
}

function renderMarkdown(source) {
  const withoutFrontmatter = source.replace(/^---\n[\s\S]*?\n---\n/, '');
  const raw = marked.parse(withoutFrontmatter, { gfm: true });
  const headings = [];
  const withHeadings = raw.replace(/<h([123])>([\s\S]*?)<\/h\1>/g, (_, level, inner) => {
    const plain = inner.replace(/<[^>]+>/g, '');
    const id = slugify(plain);
    if (Number(level) > 1) headings.push({ id, label: plain, level: Number(level) });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  const html = withHeadings
    .replace(/href="([^"]+)"/g, (_, url) => `href="${escapeHtml(markdownLink(url))}"`)
    .replace(/<table>([\s\S]*?)<\/table>/g, '<div class="table-scroll" role="region" aria-label="Scrollable data table" tabindex="0"><table>$1</table></div>');
  return { html, headings };
}

function brand() {
  return `<a class="brand" href="${base}" aria-label="Visual Language home"><span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span><span>visual<span class="brand-dot">.</span>language</span></a>`;
}

function header(active = '') {
  return `<header class="site-header"><div class="header-inner">${brand()}<nav class="top-nav" aria-label="Main navigation"><a ${active === 'guide' ? 'aria-current="page"' : ''} href="${href('start')}">Guidance</a><a href="${href('color')}">Color system</a><a href="${href('example')}">Example</a><a class="nav-agent" href="${base}raw/SKILL.md">Agent files <span aria-hidden="true">↗</span></a></nav><div class="header-actions"><button class="color-trigger" type="button" aria-label="Choose primary color" aria-haspopup="dialog" aria-controls="color-dialog" title="Choose primary color"><span class="color-trigger-dot" aria-hidden="true"></span><span class="color-trigger-label">Color</span><span class="color-trigger-arrow" aria-hidden="true">⌄</span></button><button class="theme-toggle" type="button" aria-label="Switch color theme" title="Switch color theme"><span class="theme-icon" aria-hidden="true">◐</span></button><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open navigation"><span></span><span></span><span></span></button></div></div><nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" hidden><a href="${href('start')}">Guidance</a><a href="${href('color')}">Color system</a><a href="${href('example')}">Example</a><a href="${base}raw/SKILL.md">Agent files</a></nav></header>`;
}

function colorDialog() {
  const choices = Object.entries(tokenData.themes).map(([key, theme]) => `<button class="color-option" type="button" data-color-choice="${key}" aria-pressed="${key === tokenData.defaultTheme}"><span class="color-option-swatch" style="background:${theme.anchor}" aria-hidden="true"></span><span>${escapeHtml(theme.label)}</span><span class="color-option-check" aria-hidden="true">✓</span></button>`).join('');
  return `<dialog class="color-dialog" id="color-dialog" aria-labelledby="color-dialog-title"><div class="color-dialog-heading"><div><span class="eyebrow">Make it yours</span><h2 id="color-dialog-title">Choose a color</h2></div><button class="color-dialog-close" type="button" aria-label="Close color selector">×</button></div><p>Preview a primary family across the site and examples. The guidance still starts with context.</p><div class="color-options">${choices}</div></dialog>`;
}

function footer() {
  return `<footer class="site-footer"><div><div class="footer-brand">visual<span>.</span>language</div><p>Calm foundations. Lively details.<br>Guidance for screens, spaces, and the people who use them.</p></div><div class="footer-links"><a href="${href('start')}">Read guidance</a><a href="${base}raw/SKILL.md">Agent entry point</a><a href="https://github.com/andrewhowdencom/visual-language">Source on GitHub ↗</a></div><div class="footer-meta">MVP · Material 3 Expressive reference · October 2026</div></footer>`;
}

function shell({ title, description, content, active = '' }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#FAFAF7"><title>${escapeHtml(title)} · Visual Language</title><meta name="description" content="${escapeHtml(description)}"><link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${base}assets/styles.css"><link rel="stylesheet" href="${base}assets/themes.css"><script defer src="${base}assets/main.js"></script></head><body><a class="skip-link" href="#main">Skip to content</a>${header(active)}${colorDialog()}${content}${footer()}</body></html>`;
}

function sidebar(current) {
  let lastSection = '';
  return `<nav class="guide-nav" aria-label="Guide pages">${pages.map((page) => {
    const label = page.section !== lastSection ? `<div class="guide-nav-heading">${page.section}</div>` : '';
    lastSection = page.section;
    return `${label}<a href="${href(page.slug)}" ${current === page.slug ? 'aria-current="page"' : ''}>${page.label}<span aria-hidden="true">↗</span></a>`;
  }).join('')}</nav>`;
}

function toc(headings) {
  return `<aside class="toc" aria-label="On this page"><div class="toc-title">On this page</div>${headings.map(({ id, label, level }) => `<a class="toc-level-${level}" href="#${id}">${escapeHtml(label)}</a>`).join('')}<div class="toc-aside"><span class="little-star" aria-hidden="true">✳</span><p>From first idea to final check.</p><a href="${href('review')}">Open review checklist <span aria-hidden="true">↗</span></a></div></aside>`;
}

function nextPage(index) {
  if (index >= pages.length - 1) return '';
  const page = pages[index + 1];
  return `<a class="next-page" href="${href(page.slug)}"><span>Continue reading</span><strong>${page.label}</strong><span aria-hidden="true">↗</span></a>`;
}

function guidePage(page, index, rendered) {
  const raw = `${base}raw/${page.file}`;
  const content = `<main class="guide-layout" id="main"><aside class="guide-sidebar"><div class="sidebar-intro"><span class="eyebrow">The guide / 01—08</span><p>A practical visual language for people and agents.</p></div>${sidebar(page.slug)}</aside><article class="guide-article"><div class="article-top"><span class="eyebrow">${escapeHtml(page.section)} / ${String(index + 1).padStart(2, '0')}</span><a class="raw-link" href="${raw}">Read as Markdown ↗</a></div><div class="markdown-body">${rendered.html}</div>${page.slug === 'color' ? exampleFigure('compact') : ''}${page.slug === 'example' ? exampleFigure('wide') + androidFigure() : ''}${nextPage(index)}</article>${toc(rendered.headings)}</main>`;
  return shell({ title: page.label, description: page.description, content, active: 'guide' }).replace('</head>', `<link rel="alternate" type="text/markdown" href="${raw}"></head>`);
}

function swatchCards() {
  const cards = [
    ['Warm White', tokenData.anchors.warmWhite, 'canvas'],
    ['Espresso', tokenData.anchors.espresso, 'structure'],
    ['Dusty Coral', tokenData.anchors.dustyCoral, 'default primary'],
    ['Soft Terracotta', tokenData.anchors.softTerracotta, 'peach warmth'],
    ['Faded Mustard', tokenData.anchors.fadedMustard, 'warmth'],
    ['Powder Blue', tokenData.anchors.powderBlue, 'air']
  ];
  return `<div class="swatch-row">${cards.map(([name, hex, mood]) => `<div class="swatch"><div class="swatch-color" style="background:${hex}"></div><div class="swatch-name">${name}</div><div class="swatch-meta">${hex} / ${mood}</div></div>`).join('')}</div>`;
}

function exampleFigure(size) {
  return `<figure class="example-figure ${size}"><div class="example-caption"><span class="eyebrow">In practice / controlled color</span><p>One clear action. A quieter field around it.</p></div><div class="demo-window"><div class="demo-topbar"><span class="demo-brand"><span class="demo-brand-mark">✳</span> fieldnotes</span><span class="demo-top-actions"><span>Today</span><span class="demo-avatar">A</span></span></div><div class="demo-body"><div class="demo-nav"><span class="demo-nav-item selected"><span>◫</span> Overview</span><span class="demo-nav-item"><span>☷</span> Projects</span><span class="demo-nav-item"><span>◉</span> Calendar</span></div><div class="demo-content"><div class="demo-kicker">Saturday, 10 October</div><div class="demo-heading"><div><h3>Good morning, Alex.</h3><p>Focus on what moves your work forward.</p></div><span class="demo-sun" aria-hidden="true"><i></i><i></i><i></i></span></div><div class="demo-grid"><div class="demo-card primary-card"><span class="demo-card-label">UP NEXT <span>01 / 03</span></span><h4>Shape the new workspace</h4><p>Review the layout and choose the next useful step.</p><span class="demo-cta">Open task <span aria-hidden="true">↗</span></span></div><div class="demo-card list-card"><span class="demo-card-label">TODAY'S THREAD</span><div class="demo-task"><span class="demo-task-icon">↗</span><span><strong>Explore the color system</strong><small>Design · In progress</small></span></div><div class="demo-task"><span class="demo-task-icon peach">◇</span><span><strong>Review the first layout</strong><small>Product · Next</small></span></div><div class="demo-task"><span class="demo-task-icon blue">▧</span><span><strong>Share the direction</strong><small>Team · Later</small></span></div></div></div></div></div></div><figcaption>Illustrative project workspace. Most working surfaces stay neutral; color marks action and selected context.</figcaption></figure>`;
}

function androidFigure() {
  return `<figure class="android-figure"><div class="example-caption"><span class="eyebrow">Same task / Android compact</span><p>A native structure for a smaller window.</p></div><div class="android-phone"><div class="android-status"><span>9:41</span><span>●●● ▰</span></div><div class="android-appbar"><span class="android-app-icon">✳</span><strong>fieldnotes</strong><span class="android-app-menu">⋮</span></div><div class="android-content"><span class="demo-kicker">SATURDAY, 10 OCTOBER</span><h3>Good morning,<br>Alex.</h3><p>Focus on what moves your work forward.</p><div class="android-task-card"><span>UP NEXT <b>01 / 03</b></span><h4>Shape the new workspace</h4><p>Review the layout and choose the next useful step.</p><span class="android-button">Open task ↗</span></div><h4 class="android-subtitle">Today's thread</h4><div class="android-row"><span class="android-row-icon">↗</span><span><strong>Explore the color system</strong><small>Design · In progress</small></span></div><div class="android-row"><span class="android-row-icon peach">◇</span><span><strong>Review the first layout</strong><small>Product · Next</small></span></div></div><div class="android-bottom-nav"><span class="active"><i>◫</i>Overview</span><span><i>☷</i>Projects</span><span><i>◉</i>Calendar</span></div><div class="android-system-bar"><i></i></div></div><figcaption>Illustrative Android compact variant. Material-style navigation and system framing replace the web sidebar while the task hierarchy stays familiar.</figcaption></figure>`;
}

function homePage() {
  const content = `<main id="main"><section class="hero"><div class="hero-copy"><div class="eyebrow hero-eyebrow"><span class="eyebrow-line"></span> A living design language <span> / 001</span></div><h1>Calm by default.<br><em>Alive where it matters.</em></h1><p>One visual language for thoughtful digital experiences and physical spaces. Rooted in Material 3, shaped by warm color, clear hierarchy, and the context in front of us.</p><div class="hero-actions"><a class="button button-primary" href="${href('start')}">Explore the guidance <span aria-hidden="true">↗</span></a><a class="button button-text" href="${base}raw/SKILL.md">For agents <span aria-hidden="true">↗</span></a></div><div class="hero-footnote"><span class="mini-disc"></span> Built for Android & responsive web <span class="hero-separator">·</span> Made to grow</div></div><div class="hero-art" aria-label="Geometric illustration using the selected primary family and warm accents"><div class="art-surface"><span class="art-label">A quieter kind<br>of expressive.</span><div class="art-sun"><i></i><i></i><i></i><i></i></div><div class="art-arch"></div><div class="art-hill-one"></div><div class="art-hill-two"></div><div class="art-disc"></div><div class="art-caption">FORM / FEELING / FUNCTION <span>01—03</span></div></div><div class="art-side-note">GOOD DESIGN, IN CONTEXT <span>✳</span></div></div></section><section class="intro-band"><span>THE IDEA</span><p>A system should give you a point of view, <em>not a template to copy.</em> These are the decisions behind a coherent experience—available to read, reuse, and question.</p><span class="band-star" aria-hidden="true">✳</span></section><section class="section-block method-section"><div class="section-header"><div><span class="eyebrow">01 / The method</span><h2>From brief to<br><em>built experience.</em></h2></div><p>Guidance for agents and people working through the whole design loop.</p></div><div class="method-grid"><a class="method-card" href="${href('principles')}"><span class="method-number">01</span><div class="method-icon icon-frame"><span>✳</span></div><h3>Find the character</h3><p>Start with the task, the setting, and the feeling the experience should leave behind.</p><span class="card-link">Principles ↗</span></a><a class="method-card" href="${href('color')}"><span class="method-number">02</span><div class="method-icon icon-palette"><i></i><i></i><i></i></div><h3>Choose with intent</h3><p>Work from semantic roles and contextual intensity, not scattered color values.</p><span class="card-link">Color system ↗</span></a><a class="method-card" href="${href('adaptive-layout')}"><span class="method-number">03</span><div class="method-icon icon-layout"><i></i><i></i></div><h3>Adapt to the moment</h3><p>Build layouts and interactions around available space and native behavior.</p><span class="card-link">Adaptive layout ↗</span></a><a class="method-card" href="${href('review')}"><span class="method-number">04</span><div class="method-icon icon-check"><span>✓</span></div><h3>Review the real thing</h3><p>Check rendered states, accessibility, and the decisions that shaped the result.</p><span class="card-link">Review checklist ↗</span></a></div></section><section class="color-section"><div class="color-copy"><span class="eyebrow">02 / Palette</span><h2>Quiet ground.<br><em>Confident accents.</em></h2><p>Nine anchor colors, used with restraint. Choose a color above to preview a primary family; each product still makes room for contrast, scale, and context.</p><a class="text-link" href="${href('color')}">Explore color & intensity <span aria-hidden="true">↗</span></a></div>${swatchCards()}</section><section class="example-section"><div class="section-header"><div><span class="eyebrow">03 / In practice</span><h2>One language.<br><em>Many contexts.</em></h2></div><p>A worked interface shows how calm surfaces make meaningful details easier to find.</p></div>${exampleFigure('wide')}<div class="context-cards"><a href="${href('components')}"><span class="context-icon">▣</span><div><h3>On a screen</h3><p>Android and responsive web share intent while honoring native controls.</p></div><span aria-hidden="true">↗</span></a><a href="${href('physical-space')}"><span class="context-icon">⌂</span><div><h3>In a room</h3><p>Translate the palette and hierarchy into materials, light, furniture, and space.</p></div><span aria-hidden="true">↗</span></a></div></section><section class="agent-section"><div><span class="eyebrow">04 / Agent-ready by design</span><h2>Readable by people.<br><em>Usable by agents.</em></h2><p>The Markdown source gives agents a reading order, rules, starter tokens, platform mapping, and a review checklist. The site gives people a place to explore the same guidance.</p><div class="agent-actions"><a class="button button-light" href="${base}raw/SKILL.md">Open agent entry point ↗</a><a class="agent-secondary" href="${base}tokens/palette.json">View tokens ↗</a></div></div><div class="agent-code" aria-label="Excerpt of agent guidance"><div class="code-top"><span><i></i><i></i><i></i></span> guidance / SKILL.md</div><pre><code><span class="code-comment"># Use this visual language</span>\n\n1. Frame the job and its context.\n2. Choose one primary family.\n3. Map semantic color roles.\n4. Plan layouts and states.\n5. Implement natively.\n6. Review the rendered result.</code></pre><div class="code-foot">ONE SOURCE OF TRUTH <span>↗</span></div></div></section></main>`;
  return shell({ title: 'Design guidance for screens and spaces', description: 'A warm, practical visual language for Android, responsive web, agents, and physical spaces.', content });
}

await rm(out, { recursive: true, force: true });
await mkdir(join(out, 'assets'), { recursive: true });
await mkdir(join(out, 'tokens'), { recursive: true });
await mkdir(join(out, 'raw'), { recursive: true });
await cp(join(root, 'site/assets'), join(out, 'assets'), { recursive: true });
await writeFile(join(out, 'assets/themes.css'), themeStyles());
await cp(join(root, 'tokens/palette.json'), join(out, 'tokens/palette.json'));
await cp(join(root, 'tokens/foundations.json'), join(out, 'tokens/foundations.json'));
await writeFile(join(out, 'index.html'), homePage());
for (const [index, page] of pages.entries()) {
  const source = await readFile(join(root, 'guidance', page.file), 'utf8');
  await cp(join(root, 'guidance', page.file), join(out, 'raw', page.file));
  const rendered = renderMarkdown(source);
  const directory = join(out, 'guide', page.slug);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), guidePage(page, index, rendered));
}
await writeFile(join(out, '.nojekyll'), '');
await writeFile(join(out, 'llms.txt'), `# Visual Language\n\nPlatform-independent design guidance for people and agents. Current implementation guidance covers Android and responsive web.\n\nAgent entry: https://andrewhowdencom.github.io/visual-language/raw/SKILL.md\nPalette tokens: https://andrewhowdencom.github.io/visual-language/tokens/palette.json\nFoundation tokens: https://andrewhowdencom.github.io/visual-language/tokens/foundations.json\n\nGuidance pages:\n${pages.map((page) => `- ${page.label}: https://andrewhowdencom.github.io/visual-language/raw/${page.file}`).join('\n')}\n`);
console.log(`Built ${pages.length + 1} pages at ${out} (base ${base})`);
