/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 * Removes non-authorable site chrome (skip link, global header/nav, footer)
 * and other non-content elements. Header and footer are migrated separately.
 *
 * All selectors verified against migration-work/cleaned.html:
 *   - a.skip-link                (line 1: <a href="#main-content" class="skip-link">)
 *   - div.navbar                 (line 1: global header wrapper)
 *   - nav#nav-menu / .mega-menu  (line 1: nav mega menu inside .navbar)
 *   - button#nav-toggle          (line 47: mobile menu button inside .navbar)
 *   - footer.footer.inverse-footer (line 98: global footer)
 *
 * NOTE: Do NOT remove the generic `header` element - the intro section of the
 * page is `main > header.section.secondary-section` and contains authorable content.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove interactive navigation chrome early so it cannot be picked up
    // by block parsers (mega menu contains card-like links and headings).
    WebImporter.DOMUtils.remove(element, [
      '.navbar .mega-menu',
      '.navbar .nav-menu-dropdown-list',
      '#nav-toggle',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove global site chrome (handled by header/footer migration).
    WebImporter.DOMUtils.remove(element, [
      'a.skip-link',
      'div.navbar',
      'footer.footer.inverse-footer',
      'noscript',
      'link',
      'iframe',
    ]);

    // Strip framework-specific scoping attributes (Astro) that carry no content.
    element.querySelectorAll('[data-astro-cid-37fxchfa]').forEach((el) => {
      el.removeAttribute('data-astro-cid-37fxchfa');
    });
  }
}
