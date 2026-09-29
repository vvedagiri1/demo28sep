const OPTION_CLASSES = [];

/**
 * columns-hero: one row, two cells.
 * cell 1 = heading, subheading, CTAs; cell 2 = image collage (1..n images).
 * Cells may be swapped, omitted or extra; each cell is classified by its content.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  [...block.children].forEach((row) => {
    row.classList.add('columns-hero-row');
    const cells = [...row.children];
    row.classList.add(`columns-hero-${cells.length}-cols`);

    cells.forEach((cell) => {
      const pictures = [...cell.querySelectorAll('picture')];
      const hasText = [...cell.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol')]
        .some((el) => el.textContent.trim() !== '');

      if (pictures.length && !hasText) {
        cell.classList.add('columns-hero-media');
        // flatten images into direct children for the collage grid
        const items = pictures.map((pic) => {
          const item = document.createElement('div');
          item.className = 'columns-hero-media-item';
          item.append(pic);
          return item;
        });
        cell.replaceChildren(...items);
        cell.classList.add(`columns-hero-media-${Math.min(items.length, 4)}`);
      } else {
        cell.classList.add('columns-hero-content');
        // group consecutive CTA paragraphs into a single actions row
        const ctas = [...cell.querySelectorAll(':scope > p')]
          .filter((p) => p.querySelector('a') && p.textContent.trim() === [...p.querySelectorAll('a')].map((a) => a.textContent).join('').trim());
        if (ctas.length) {
          const actions = document.createElement('div');
          actions.className = 'columns-hero-actions';
          ctas[0].before(actions);
          actions.append(...ctas);
        }
      }
    });
  });
}
