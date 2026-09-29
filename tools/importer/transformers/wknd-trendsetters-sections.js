/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters sections.
 * Inserts section breaks (<hr>) between template sections and appends a
 * Section Metadata block to every section whose style is non-null.
 *
 * Section selectors come from tools/importer/page-templates.json (payload.template.sections)
 * and were verified against migration-work/cleaned.html:
 *   - main > header.section.secondary-section           (intro, style: grey)
 *   - main > section.section:nth-of-type(1)             (featured-story)
 *   - main > section.section.secondary-section:nth-of-type(2) (gallery, style: grey)
 *   - main > section.section:nth-of-type(3)             (testimonials)
 *   - main > section.section.secondary-section:nth-of-type(4) (latest-articles, style: grey)
 *   - main > section.section:nth-of-type(5)             (faq)
 *   - main > section.section.inverse-section            (closing-cta, style: dark)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

function findSectionElement(root, doc, selectors) {
  const list = Array.isArray(selectors) ? selectors : [selectors];
  for (const sel of list) {
    if (!sel) continue;
    let found = root.querySelector(sel);
    if (!found && doc) found = doc.querySelector(sel);
    // Fallback when the root element itself is <main> (selector prefix "main >").
    if (!found && /^main\s*>/.test(sel)) {
      try {
        found = root.querySelector(sel.replace(/^main\s*>/, ':scope >'));
      } catch (e) {
        // ignore invalid selector fallback
      }
    }
    if (found) return found;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  if (!template || !Array.isArray(template.sections) || template.sections.length < 2) return;

  const doc = element.ownerDocument || document;
  const { sections } = template;

  // Process in reverse so DOM insertions do not affect later lookups.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const sectionEl = findSectionElement(element, doc, section.selector);
    if (!sectionEl) continue;

    if (section.style) {
      const metadata = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      sectionEl.append(metadata);
    }

    // Section break before every section except the first.
    if (i > 0) {
      const hr = doc.createElement('hr');
      sectionEl.before(hr);
    }
  }
}
