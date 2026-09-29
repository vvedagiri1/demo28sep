const OPTION_CLASSES = [];

/**
 * accordion-faq: one row per item.
 * cell 1 = question; cell 2 = answer.
 * Rows missing an answer render the question as a non-expandable item.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  [...block.children].forEach((row) => {
    const [label, body, ...extra] = [...row.children];
    if (!label) {
      row.remove();
      return;
    }

    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    // unwrap a single paragraph so the summary holds inline content
    const onlyP = label.children.length === 1 && label.firstElementChild.tagName === 'P';
    summary.append(...(onlyP ? label.firstElementChild.childNodes : label.childNodes));

    const content = body || document.createElement('div');
    content.className = 'accordion-faq-item-body';
    // fold any extra cells into the answer body
    extra.forEach((cell) => content.append(...cell.childNodes));

    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, content);
    row.replaceWith(details);
  });
}
