const OPTION_CLASSES = [];

/**
 * columns-gallery: N rows x M cells, one image per cell.
 * All cells are flattened into a single responsive grid so uneven rows
 * (authors adding/omitting cells) still lay out cleanly.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const firstRow = block.firstElementChild;
  const cols = firstRow ? firstRow.children.length : 0;
  if (cols) block.style.setProperty('--columns-gallery-cols', cols);

  const items = [];
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (!cell.querySelector('picture, img') && !cell.textContent.trim()) return;
      cell.classList.add('columns-gallery-item');
      items.push(cell);
    });
  });
  block.replaceChildren(...items);
}
