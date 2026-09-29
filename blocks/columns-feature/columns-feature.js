const OPTION_CLASSES = [];

/**
 * columns-feature: one row, two cells.
 * cell 1 = image; cell 2 = breadcrumb links, h2, byline, date/read time.
 * Cells are classified by content so authors may swap or omit them.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  [...block.children].forEach((row) => {
    row.classList.add('columns-feature-row');
    [...row.children].forEach((cell) => {
      const pic = cell.querySelector('picture');
      const text = cell.textContent.trim();
      if (pic && !text) {
        cell.classList.add('columns-feature-media');
        return;
      }
      cell.classList.add('columns-feature-content');

      const children = [...cell.children];
      const headingIndex = children.findIndex((el) => /^H[1-6]$/.test(el.tagName));
      // breadcrumb = link paragraph before the heading; meta = paragraphs after it
      children.forEach((p, i) => {
        if (p.tagName !== 'P' || headingIndex < 0) return;
        const links = p.querySelectorAll('a');
        if (i < headingIndex && links.length) {
          const nav = document.createElement('nav');
          nav.setAttribute('aria-label', 'Breadcrumb');
          nav.className = 'columns-feature-breadcrumb';
          const ol = document.createElement('ol');
          links.forEach((a) => {
            const li = document.createElement('li');
            li.append(a);
            ol.append(li);
          });
          nav.append(ol);
          p.replaceWith(nav);
        } else if (i > headingIndex) {
          p.classList.add('columns-feature-meta');
        }
      });
    });
  });
}
