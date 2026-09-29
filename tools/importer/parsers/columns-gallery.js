/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-gallery. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-28
 *
 * Source: .grid-layout.desktop-4-column > div.utility-aspect-1x1 (img.cover-image) x8
 * Output: rows of 4 cells, one image per cell (2 rows x 4 for the home page).
 * Column count follows the desktop-N-column class when present; last row padded with ''.
 */
export default function parse(element, { document }) {
  // Iterate the block-level item wrappers; fall back to any direct child holding an image
  let items = [...element.querySelectorAll(':scope > .utility-aspect-1x1')];
  if (!items.length) items = [...element.querySelectorAll(':scope > div')].filter((d) => d.querySelector('img'));

  const images = items.map((item) => item.querySelector('img')).filter(Boolean);
  if (!images.length) {
    const loose = [...element.querySelectorAll('img')];
    images.push(...loose);
  }

  if (!images.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const colMatch = [...element.classList].map((c) => c.match(/^desktop-(\d+)-column$/)).find(Boolean);
  const cols = Math.min(colMatch ? parseInt(colMatch[1], 10) : 4, images.length);

  const cells = [];
  for (let i = 0; i < images.length; i += cols) {
    const row = images.slice(i, i + cols);
    while (row.length < cols) row.push('');
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-gallery', cells });
  element.replaceWith(block);
}
