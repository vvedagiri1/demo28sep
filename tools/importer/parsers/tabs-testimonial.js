/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-28
 *
 * Source: .tabs-wrapper > .tabs-content > .tab-pane x4 (img, strong name, role div, p quote)
 *         .tabs-wrapper > .tab-menu > button.tab-menu-link x4 (avatar img, strong name, role)
 * Output: one row per tab, 2 cells:
 *   [avatar image, **name**, role] [image, **name**, role, quote paragraph]
 * Iteration is keyed on .tab-pane (block-level wrapper); menu buttons are paired by index.
 */

function textParagraph(document, text, bold) {
  const p = document.createElement('p');
  if (bold) {
    const strong = document.createElement('strong');
    strong.textContent = text;
    p.append(strong);
  } else {
    p.textContent = text;
  }
  return p;
}

// Extract name (strong) and role (first non-name text div) from a container
function nameAndRole(container) {
  if (!container) return { name: '', role: '' };
  const strong = container.querySelector('strong');
  const name = strong ? strong.textContent.trim() : '';
  let role = '';
  const leafDivs = [...container.querySelectorAll('div')]
    .filter((d) => !d.querySelector('div, img, p') && d.textContent.trim());
  const roleDiv = leafDivs.find((d) => !d.querySelector('strong') && d.textContent.trim() !== name);
  if (roleDiv) role = roleDiv.textContent.trim();
  return { name, role };
}

export default function parse(element, { document }) {
  const panes = [...element.querySelectorAll('.tab-pane, [role="tabpanel"]')]
    .filter((p, i, arr) => arr.indexOf(p) === i);
  const tabs = [...element.querySelectorAll('.tab-menu-link, [role="tab"]')]
    .filter((t, i, arr) => arr.indexOf(t) === i);

  const count = Math.max(panes.length, tabs.length);
  if (!count) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  for (let i = 0; i < count; i += 1) {
    const pane = panes[i];
    const tab = tabs[i];

    // Panel content
    const panelCell = [];
    let paneInfo = { name: '', role: '' };
    if (pane) {
      const img = pane.querySelector('img');
      if (img) panelCell.push(img);
      const quote = pane.querySelector('p');
      // name/role live in the div wrapping the strong, excluding the quote
      const strong = pane.querySelector('strong');
      const infoBox = strong ? (strong.closest('div')?.parentElement || pane) : pane;
      paneInfo = nameAndRole(infoBox);
      if (paneInfo.name) panelCell.push(textParagraph(document, paneInfo.name, true));
      if (paneInfo.role) panelCell.push(textParagraph(document, paneInfo.role, false));
      if (quote) panelCell.push(quote);
    }

    // Tab label
    const labelCell = [];
    let tabInfo = paneInfo;
    if (tab) {
      const avatar = tab.querySelector('img');
      if (avatar) labelCell.push(avatar);
      const info = nameAndRole(tab);
      if (info.name) tabInfo = info;
    }
    if (tabInfo.name) labelCell.push(textParagraph(document, tabInfo.name, true));
    if (tabInfo.role) labelCell.push(textParagraph(document, tabInfo.role, false));

    if (!labelCell.length && !panelCell.length) continue;
    cells.push([labelCell.length ? labelCell : '', panelCell.length ? panelCell : '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
