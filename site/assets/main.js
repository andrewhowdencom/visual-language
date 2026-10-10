const themeButton = document.querySelector('.theme-toggle');
const colorButton = document.querySelector('.color-trigger');
const colorDialog = document.querySelector('.color-dialog');
const colorChoices = [...document.querySelectorAll('[data-color-choice]')];
const validColors = new Set(colorChoices.map((choice) => choice.dataset.colorChoice));
const savedColor = localStorage.getItem('visual-language-color');
const initialColor = validColors.has(savedColor) ? savedColor : 'dustyCoral';
document.documentElement.dataset.color = initialColor;

function updateColorChoice(color) {
  const selected = colorChoices.find((choice) => choice.dataset.colorChoice === color);
  colorButton?.setAttribute('aria-label', `Choose primary color, current: ${selected?.querySelector('span:nth-child(2)')?.textContent || 'Dusty Coral'}`);
  for (const choice of colorChoices) choice.setAttribute('aria-pressed', String(choice === selected));
}
updateColorChoice(initialColor);

colorButton?.addEventListener('click', () => colorDialog?.showModal());
document.querySelector('.color-dialog-close')?.addEventListener('click', () => colorDialog.close());
colorDialog?.addEventListener('click', (event) => {
  if (event.target === colorDialog) colorDialog.close();
});
for (const choice of colorChoices) {
  choice.addEventListener('click', () => {
    const color = choice.dataset.colorChoice;
    document.documentElement.dataset.color = color;
    localStorage.setItem('visual-language-color', color);
    updateColorChoice(color);
    colorDialog.close();
    colorButton.focus();
  });
}

const savedTheme = localStorage.getItem('visual-language-theme');
if (savedTheme === 'light' || savedTheme === 'dark') {
  document.documentElement.dataset.theme = savedTheme;
}
const initialTheme = document.documentElement.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
themeButton?.setAttribute('aria-label', `Switch to ${initialTheme === 'dark' ? 'light' : 'dark'} theme`);

themeButton?.addEventListener('click', () => {
  const current = document.documentElement.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('visual-language-theme', next);
  themeButton.setAttribute('aria-label', `Switch to ${current} theme`);
});

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
  mobileNav.hidden = open;
});

mobileNav?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  mobileNav.hidden = true;
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open navigation');
});
