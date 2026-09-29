/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-28
 *
 * Source: .utility-position-relative.utility-radius-card > img.cover-image.utility-overlay (background)
 *         + div.overlay (decorative) + div.card-body (h2, p.subheading, .button-group a)
 * Output: 1 column. Row 1 = [background image] (optional); Row 2 = [h2, p, CTA link]
 */
export default function parse(element, { document }) {
  const body = element.querySelector('.card-body') || element;

  // Background image: direct child img (or overlay-classed img), not inside the content body
  const bgImage = element.querySelector(':scope > img')
    || [...element.querySelectorAll('img')].find((img) => !body.contains(img) || body === element);

  const heading = body.querySelector('h1, h2, h3');
  const description = body.querySelector('p.subheading') || body.querySelector('p');
  const ctas = [...body.querySelectorAll('.button-group a, a.button')]
    .filter((a, i, arr) => arr.indexOf(a) === i);

  if (!heading && !description && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (bgImage) cells.push([bgImage]);

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  ctas.forEach((a) => {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href') || '#';
    link.textContent = a.textContent.trim();
    p.append(link);
    contentCell.push(p);
  });
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
