/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-28
 *
 * Source: .grid-layout.desktop-4-column > a.article-card.card-link x4
 *           > div.article-card-image (img) + div.article-card-body (.article-card-meta spans, h3)
 * Output: one row per card, 2 cells: [image] [tag p, date p, h3 with linked title]
 *
 * Iteration is keyed on the inner block wrapper .article-card-body (NOT the sibling <a> wrappers,
 * which html2md preprocessing can merge). The href is read from the closest <a> and re-attached
 * to the title.
 */
export default function parse(element, { document }) {
  let items = [...element.querySelectorAll('.article-card-body')].map((body) => ({
    body,
    image: body.parentElement?.querySelector('.article-card-image img, img'),
    href: body.closest('a')?.getAttribute('href') || '',
  }));
  if (!items.length) {
    // Fallback: iterate the card wrappers directly
    items = [...element.querySelectorAll(':scope > a, :scope > div')].map((card) => ({
      body: card,
      image: card.querySelector('img'),
      href: (card.matches('a') ? card : card.querySelector('a'))?.getAttribute('href') || '',
    }));
  }

  const cells = [];
  items.forEach(({ body, image, href }) => {
    const textCell = [];

    const tag = body.querySelector('.tag');
    const metaSpans = [...body.querySelectorAll('.article-card-meta span')];
    const date = metaSpans.find((s) => s !== tag && s.textContent.trim());
    if (tag && tag.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = tag.textContent.trim();
      textCell.push(p);
    }
    if (date) {
      const p = document.createElement('p');
      p.textContent = date.textContent.trim();
      textCell.push(p);
    }

    const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const h3 = document.createElement('h3');
      const title = heading.textContent.trim();
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = title;
        h3.append(a);
      } else {
        h3.textContent = title;
      }
      textCell.push(h3);
    }

    if (!image && !textCell.length) return;
    cells.push([image || '', textCell.length ? textCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
