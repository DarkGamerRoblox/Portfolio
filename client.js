const root = document.documentElement;
const themeButtons = document.querySelectorAll('[data-toggle-theme]');

function setTheme(theme) {
  root.dataset.theme = theme;
  for (const button of themeButtons) {
    button.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  }
  try { localStorage.setItem('darkgamer-theme', theme); } catch {}
}

for (const button of themeButtons) {
  button.addEventListener('click', () => setTheme(root.dataset.theme === 'light' ? 'dark' : 'light'));
}

for (const button of document.querySelectorAll('.copy-button')) {
  button.addEventListener('click', async () => {
    const source = button.closest('.code-block')?.querySelector('pre code')?.textContent ?? '';
    const label = button.querySelector('.copy-label');
    try {
      await navigator.clipboard.writeText(source);
      if (label) label.textContent = 'Copied!';
    } catch {
      const code = button.closest('.code-block')?.querySelector('pre code');
      if (code) {
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      if (label) label.textContent = 'Select & copy';
    }
    window.setTimeout(() => { if (label) label.textContent = 'Copy'; }, 1800);
  });
}

const drawer = document.querySelector('#mobile-navigation');
const menuButton = document.querySelector('[data-open-menu]');
menuButton?.addEventListener('click', () => {
  drawer?.showModal();
  document.body.style.overflow = 'hidden';
  menuButton.setAttribute('aria-expanded', 'true');
});
drawer?.querySelector('[data-close-menu]')?.addEventListener('click', () => drawer.close());
drawer?.addEventListener('close', () => {
  document.body.style.overflow = '';
  menuButton?.setAttribute('aria-expanded', 'false');
});
for (const link of drawer?.querySelectorAll('a[href^="#"]') ?? []) {
  link.addEventListener('click', () => drawer.close());
}

const trackedSections = [...document.querySelectorAll('section[id]')];
const tocLinks = [...document.querySelectorAll('.toc nav a')];
const sideLinks = [...document.querySelectorAll('.sidebar .nav-link')];
const topLinks = [...document.querySelectorAll('.topnav a')];

function markActive(id) {
  for (const link of [...tocLinks, ...sideLinks]) {
    const active = link.hash === `#${id}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
  const group = id === 'work' ? '#work' : id === 'showcase' ? '#showcase' : id === 'open-source' ? '#open-source' : ['capabilities','principles'].includes(id) ? '#capabilities' : ['about','contact'].includes(id) ? '#about' : null;
  for (const link of topLinks) link.classList.toggle('active', group ? link.hash === group : false);
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (visible) markActive(visible.target.id);
  }, { rootMargin: '-110px 0px -62% 0px', threshold: 0 });
  for (const section of trackedSections) observer.observe(section);
}
