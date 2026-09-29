/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-28
 *
 * Source: .grid-layout.grid-gap-lg > [div (img.cover-image)] [div (.breadcrumbs a, h2, byline + date spans)]
 * Output: 1 row x 2 cells: [image] [breadcrumb links p, h2, byline p, date/read-time p]
 */
export default function parse(element, { document }) {
  const columns = [...element.querySelectorAll(':scope > div')];

  let textCol = columns.find((c) => c.querySelector('h1, h2, h3, h4'));
  if (!textCol) textCol = columns[1] || columns[0] || element;
  const mediaCol = columns.find((c) => c !== textCol && c.querySelector('img'));

  // Image: prefer content image in media column (skip inline svg data URIs)
  const image = mediaCol
    ? mediaCol.querySelector('img')
    : textCol.querySelector('img.cover-image');

  const textCell = [];

  // Breadcrumb links -> single paragraph of links
  const crumbLinks = [...textCol.querySelectorAll('.breadcrumbs a, [class*="breadcrumb"] a')]
    .filter((a, i, arr) => arr.indexOf(a) === i);
  if (crumbLinks.length) {
    const p = document.createElement('p');
    crumbLinks.forEach((a, i) => {
      if (i > 0) p.append(document.createTextNode(' '));
      const link = document.createElement('a');
      link.href = a.getAttribute('href') || '#';
      link.textContent = a.textContent.trim();
      p.append(link);
    });
    textCell.push(p);
  }

  const heading = textCol.querySelector('h1, h2, h3, h4');
  if (heading) textCell.push(heading);

  // Meta rows: each .flex-horizontal group becomes one paragraph of joined spans
  let metaRows = [...textCol.querySelectorAll('.flex-horizontal')];
  if (!metaRows.length) metaRows = [...textCol.querySelectorAll(':scope p')];
  metaRows.forEach((row) => {
    const parts = [...row.querySelectorAll('span')].map((s) => s.textContent.trim()).filter(Boolean);
    const text = parts.length ? parts.join(' ') : row.textContent.trim().replace(/\s+/g, ' ');
    if (!text) return;
    const p = document.createElement('p');
    p.textContent = text;
    textCell.push(p);
  });

  if (!heading && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[image || '', textCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
