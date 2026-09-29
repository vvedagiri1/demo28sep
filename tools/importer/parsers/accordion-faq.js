/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-09-28
 *
 * Source: .faq-list > details.faq-item x4 > summary.faq-question (span text + icon img) + div.faq-answer (p)
 * Output: one row per item, 2 cells: [question] [answer content]
 * The decorative icon <img> inside the summary is dropped.
 */
export default function parse(element, { document }) {
  let items = [...element.querySelectorAll(':scope > details, :scope > .faq-item')]
    .filter((d, i, arr) => arr.indexOf(d) === i);
  if (!items.length) items = [...element.querySelectorAll('details')];

  const cells = [];
  items.forEach((item) => {
    const summary = item.querySelector('summary, .faq-question');
    const questionText = summary
      ? (summary.querySelector('span, h2, h3, h4, p') || summary).textContent.trim().replace(/\s+/g, ' ')
      : '';

    const answerEl = item.querySelector('.faq-answer') || [...item.children].find((c) => c !== summary);
    let answer = [];
    if (answerEl) {
      answer = [...answerEl.querySelectorAll(':scope > p, :scope > ul, :scope > ol')];
      if (!answer.length && answerEl.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = answerEl.textContent.trim();
        answer = [p];
      }
    }

    if (!questionText && !answer.length) return;
    const q = document.createElement('p');
    q.textContent = questionText;
    cells.push([q, answer.length ? answer : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
