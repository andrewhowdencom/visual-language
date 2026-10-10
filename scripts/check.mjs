import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const base = normalizeBase(process.env.SITE_BASE_PATH ?? '/visual-language/');
const palette = JSON.parse(await readFile(join(root, 'tokens/palette.json'), 'utf8'));
const failures = [];

function normalizeBase(value) {
  let path = value.startsWith('/') ? value : `/${value}`;
  if (!path.endsWith('/')) path += '/';
  return path.replace(/\/+/g, '/');
}

function luminance(hex) {
  const channel = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = channel.map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + .05) / (values[1] + .05);
}

const expectedAnchors = {
  warmWhite: '#FAFAF7', espresso: '#3C3432', deepAvocado: '#5F704B', avocadoMint: '#9FB58A',
  fadedMustard: '#D9B45B', softTerracotta: '#D98B6C', dustyCoral: '#D9878F',
  mutedMauve: '#A88BA8', powderBlue: '#83AFC1'
};
for (const [name, value] of Object.entries(expectedAnchors)) {
  if (palette.anchors[name] !== value) failures.push(`Anchor ${name} changed from ${value}`);
}

if (!palette.themes[palette.defaultTheme]) failures.push('Default theme is missing');
if (Object.keys(palette.themes).length !== 6) failures.push('Expected six selectable themes');
for (const [family, theme] of Object.entries(palette.themes)) {
  if (theme.anchor !== palette.anchors[family]) failures.push(`${family} anchor mismatch`);
  for (const mode of ['light', 'dark']) {
    const colors = { ...palette.neutrals[mode], ...theme[mode] };
    const pairs = [
      ['text / canvas', colors.text, colors.canvas, 4.5],
      ['text / surface', colors.text, colors.surface, 4.5],
      ['muted text / canvas', colors.textMuted, colors.canvas, 4.5],
      ['muted text / surface', colors.textMuted, colors.surface, 4.5],
      ['on primary / primary', colors.onPrimary, colors.primary, 4.5],
      ['on primary / strong primary', colors.onPrimary, colors.primaryStrong, 4.5],
      ['on primary container / primary container', colors.onPrimaryContainer, colors.primaryContainer, 4.5],
      ['on error / error', colors.onError, colors.error, 4.5],
      ['focus / canvas', colors.focus, colors.canvas, 3]
    ];
    for (const [label, foreground, background, minimum] of pairs) {
      const value = contrast(foreground, background);
      if (value < minimum) failures.push(`${family} ${mode} ${label}: ${value.toFixed(2)} < ${minimum}`);
    }
  }
}

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

const pages = await htmlFiles(dist);
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!url.startsWith(base)) continue;
    const relative = url.slice(base.length).split('#')[0].split('?')[0];
    const target = join(dist, relative);
    try {
      const info = await stat(target);
      if (info.isDirectory()) await stat(join(target, 'index.html'));
    } catch {
      failures.push(`Broken local link in ${file.slice(dist.length + 1)}: ${url}`);
    }
  }
}

if (pages.length !== 9) failures.push(`Expected 9 pages, found ${pages.length}`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} pages, local links, anchor colors, and six light/dark theme contrast pairs.`);
}
