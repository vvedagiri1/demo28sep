/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-hero. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-28
 *
 * Source: .grid-layout.grid-gap-xxl > [div (h1, p.subheading, .button-group a)] [div.grid-layout (img.cover-image x3)]
 * Output: 1 row x 2 cells: [h1, p, CTA paragraphs (strong = primary, em = secondary)] [images]
 */
export default function parse(element, { document }) {
  const columns = [...element.querySelectorAll(':scope > div')];

  // Classify columns by content: the one holding the heading is text, the rest are media
  let textCol = columns.find((c) => c.querySelector('h1, h2, h3'));
  let mediaCol = columns.find((c) => c !== textCol && c.querySelector('img'));
  if (!textCol) textCol = columns[0] || element;
  if (!mediaCol) mediaCol = columns.find((c) => c !== textCol) || null;

  const heading = textCol.querySelector('h1, h2, h3');
  const subheading = textCol.querySelector('p.subheading') || textCol.querySelector('p');
  const ctas = [...textCol.querySelectorAll('.button-group a, a.button')]
    .filter((a, i, arr) => arr.indexOf(a) === i);

  const textCell = [];
  if (heading) textCell.push(heading);
  if (subheading) textCell.push(subheading);
  ctas.forEach((a) => {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href') || '#';
    link.textContent = a.textContent.trim();
    const wrap = document.createElement(a.classList.contains('secondary-button') ? 'em' : 'strong');
    wrap.append(link);
    p.append(wrap);
    textCell.push(p);
  });

  const images = mediaCol ? [...mediaCol.querySelectorAll('img')] : [];

  if (!heading && !subheading && !images.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[textCell, images.length ? images : '']];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-hero', cells });
  element.replaceWith(block);
}
