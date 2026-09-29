const OPTION_CLASSES = [];

/**
 * hero-banner: row 1 = background image; row 2 = heading, text, CTA.
 * Rows are classified by content, so a missing image row or content
 * authored in the same row as the image still renders.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const background = document.createElement('div');
  background.className = 'hero-banner-background';
  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic && !background.querySelector('picture')) {
        background.append(pic);
      }
      [...cell.childNodes].forEach((node) => {
        // drop wrappers left empty after moving the picture out
        if (node.nodeType === Node.ELEMENT_NODE && !node.textContent.trim()
          && !node.querySelector('picture, img, a')) return;
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        content.append(node);
      });
    });
  });

  const children = [];
  if (background.children.length) {
    children.push(background);
    block.classList.add('hero-banner-has-image');
  }
  children.push(content);
  block.replaceChildren(...children);
}
