import { createOptimizedPicture } from '../../scripts/aem.js';

const OPTION_CLASSES = [];

/**
 * cards-article: one row per card.
 * cell 1 = image; cell 2 = tag paragraph, date paragraph, h3 linked title.
 * The title link (if present) is used to make the whole card clickable.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-article-card';
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-article-card-image';
      } else {
        div.className = 'cards-article-card-body';
        const heading = div.querySelector('h1, h2, h3, h4, h5, h6');
        const metaParas = [...div.querySelectorAll(':scope > p')]
          .filter((p) => !heading || (heading.compareDocumentPosition(p)
            === Node.DOCUMENT_POSITION_PRECEDING));
        if (metaParas.length) {
          const meta = document.createElement('div');
          meta.className = 'cards-article-card-meta';
          metaParas[0].before(meta);
          metaParas.forEach((p, i) => {
            p.classList.add(i === 0 && metaParas.length > 1 ? 'cards-article-card-tag' : 'cards-article-card-date');
            meta.append(p);
          });
        }
      }
    });

    // stretch the title link over the whole card
    const titleLink = li.querySelector('h1 a, h2 a, h3 a, h4 a, h5 a, h6 a');
    if (titleLink) li.classList.add('cards-article-card-linked');

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(
    createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
  ));
  block.replaceChildren(ul);
}
