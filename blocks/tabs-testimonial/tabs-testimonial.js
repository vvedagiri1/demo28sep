import { toClassName } from '../../scripts/aem.js';

const OPTION_CLASSES = [];

/**
 * tabs-testimonial: one row per tab.
 * cell 1 = tab label (avatar image, name, role)
 * cell 2 = panel (large image, name, role, quote)
 * Renders the panels first and the tab list beneath them.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  const panels = [];
  const buttons = [];

  const select = (index) => {
    panels.forEach((panel, i) => panel.setAttribute('aria-hidden', i !== index));
    buttons.forEach((btn, i) => {
      btn.setAttribute('aria-selected', i === index);
      btn.tabIndex = i === index ? 0 : -1;
    });
  };

  [...block.children].forEach((row, i) => {
    const cells = [...row.children];
    if (!cells.length) {
      row.remove();
      return;
    }
    const label = cells[0];
    // if the author omitted the panel cell, reuse the label as panel content
    const content = cells[1] || label.cloneNode(true);
    const id = `${toClassName(label.textContent) || 'tab'}-${i}`;

    // tab button
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    const labelPic = label.querySelector('picture');
    if (labelPic) {
      const avatar = document.createElement('span');
      avatar.className = 'tabs-testimonial-avatar';
      avatar.append(labelPic);
      button.append(avatar);
    }
    const labelText = document.createElement('span');
    labelText.className = 'tabs-testimonial-tab-text';
    labelText.append(...[...label.childNodes].filter((n) => n.textContent.trim() !== ''));
    button.append(labelText);

    // panel
    const panel = document.createElement('div');
    panel.className = 'tabs-testimonial-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);

    const pic = content.querySelector('picture');
    if (pic) {
      const media = document.createElement('div');
      media.className = 'tabs-testimonial-media';
      const picParent = pic.parentElement;
      media.append(pic);
      if (picParent !== content && !picParent.textContent.trim() && !picParent.children.length) {
        picParent.remove();
      }
      panel.append(media);
    }
    const body = document.createElement('div');
    body.className = 'tabs-testimonial-body';
    body.append(...content.childNodes);
    panel.append(body);

    const index = buttons.length;
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      select(next);
      buttons[next].focus();
    });

    buttons.push(button);
    panels.push(panel);
    tablist.append(button);
    row.remove();
  });

  const panelsWrap = document.createElement('div');
  panelsWrap.className = 'tabs-testimonial-panels';
  panelsWrap.append(...panels);
  block.replaceChildren(panelsWrap, tablist);
  if (buttons.length) select(0);
}
