/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/columns-hero.js
  function parse(element, { document: document2 }) {
    const columns = [...element.querySelectorAll(":scope > div")];
    let textCol = columns.find((c) => c.querySelector("h1, h2, h3"));
    let mediaCol = columns.find((c) => c !== textCol && c.querySelector("img"));
    if (!textCol) textCol = columns[0] || element;
    if (!mediaCol) mediaCol = columns.find((c) => c !== textCol) || null;
    const heading = textCol.querySelector("h1, h2, h3");
    const subheading = textCol.querySelector("p.subheading") || textCol.querySelector("p");
    const ctas = [...textCol.querySelectorAll(".button-group a, a.button")].filter((a, i, arr) => arr.indexOf(a) === i);
    const textCell = [];
    if (heading) textCell.push(heading);
    if (subheading) textCell.push(subheading);
    ctas.forEach((a) => {
      const p = document2.createElement("p");
      const link = document2.createElement("a");
      link.href = a.getAttribute("href") || "#";
      link.textContent = a.textContent.trim();
      const wrap = document2.createElement(a.classList.contains("secondary-button") ? "em" : "strong");
      wrap.append(link);
      p.append(wrap);
      textCell.push(p);
    });
    const images = mediaCol ? [...mediaCol.querySelectorAll("img")] : [];
    if (!heading && !subheading && !images.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[textCell, images.length ? images : ""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse2(element, { document: document2 }) {
    const columns = [...element.querySelectorAll(":scope > div")];
    let textCol = columns.find((c) => c.querySelector("h1, h2, h3, h4"));
    if (!textCol) textCol = columns[1] || columns[0] || element;
    const mediaCol = columns.find((c) => c !== textCol && c.querySelector("img"));
    const image = mediaCol ? mediaCol.querySelector("img") : textCol.querySelector("img.cover-image");
    const textCell = [];
    const crumbLinks = [...textCol.querySelectorAll('.breadcrumbs a, [class*="breadcrumb"] a')].filter((a, i, arr) => arr.indexOf(a) === i);
    if (crumbLinks.length) {
      const p = document2.createElement("p");
      crumbLinks.forEach((a, i) => {
        if (i > 0) p.append(document2.createTextNode(" "));
        const link = document2.createElement("a");
        link.href = a.getAttribute("href") || "#";
        link.textContent = a.textContent.trim();
        p.append(link);
      });
      textCell.push(p);
    }
    const heading = textCol.querySelector("h1, h2, h3, h4");
    if (heading) textCell.push(heading);
    let metaRows = [...textCol.querySelectorAll(".flex-horizontal")];
    if (!metaRows.length) metaRows = [...textCol.querySelectorAll(":scope p")];
    metaRows.forEach((row) => {
      const parts = [...row.querySelectorAll("span")].map((s) => s.textContent.trim()).filter(Boolean);
      const text = parts.length ? parts.join(" ") : row.textContent.trim().replace(/\s+/g, " ");
      if (!text) return;
      const p = document2.createElement("p");
      p.textContent = text;
      textCell.push(p);
    });
    if (!heading && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[image || "", textCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-gallery.js
  function parse3(element, { document: document2 }) {
    let items = [...element.querySelectorAll(":scope > .utility-aspect-1x1")];
    if (!items.length) items = [...element.querySelectorAll(":scope > div")].filter((d) => d.querySelector("img"));
    const images = items.map((item) => item.querySelector("img")).filter(Boolean);
    if (!images.length) {
      const loose = [...element.querySelectorAll("img")];
      images.push(...loose);
    }
    if (!images.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const colMatch = [...element.classList].map((c) => c.match(/^desktop-(\d+)-column$/)).find(Boolean);
    const cols = Math.min(colMatch ? parseInt(colMatch[1], 10) : 4, images.length);
    const cells = [];
    for (let i = 0; i < images.length; i += cols) {
      const row = images.slice(i, i + cols);
      while (row.length < cols) row.push("");
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function textParagraph(document2, text, bold) {
    const p = document2.createElement("p");
    if (bold) {
      const strong = document2.createElement("strong");
      strong.textContent = text;
      p.append(strong);
    } else {
      p.textContent = text;
    }
    return p;
  }
  function nameAndRole(container) {
    if (!container) return { name: "", role: "" };
    const strong = container.querySelector("strong");
    const name = strong ? strong.textContent.trim() : "";
    let role = "";
    const leafDivs = [...container.querySelectorAll("div")].filter((d) => !d.querySelector("div, img, p") && d.textContent.trim());
    const roleDiv = leafDivs.find((d) => !d.querySelector("strong") && d.textContent.trim() !== name);
    if (roleDiv) role = roleDiv.textContent.trim();
    return { name, role };
  }
  function parse4(element, { document: document2 }) {
    var _a;
    const panes = [...element.querySelectorAll('.tab-pane, [role="tabpanel"]')].filter((p, i, arr) => arr.indexOf(p) === i);
    const tabs = [...element.querySelectorAll('.tab-menu-link, [role="tab"]')].filter((t, i, arr) => arr.indexOf(t) === i);
    const count = Math.max(panes.length, tabs.length);
    if (!count) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    for (let i = 0; i < count; i += 1) {
      const pane = panes[i];
      const tab = tabs[i];
      const panelCell = [];
      let paneInfo = { name: "", role: "" };
      if (pane) {
        const img = pane.querySelector("img");
        if (img) panelCell.push(img);
        const quote = pane.querySelector("p");
        const strong = pane.querySelector("strong");
        const infoBox = strong ? ((_a = strong.closest("div")) == null ? void 0 : _a.parentElement) || pane : pane;
        paneInfo = nameAndRole(infoBox);
        if (paneInfo.name) panelCell.push(textParagraph(document2, paneInfo.name, true));
        if (paneInfo.role) panelCell.push(textParagraph(document2, paneInfo.role, false));
        if (quote) panelCell.push(quote);
      }
      const labelCell = [];
      let tabInfo = paneInfo;
      if (tab) {
        const avatar = tab.querySelector("img");
        if (avatar) labelCell.push(avatar);
        const info = nameAndRole(tab);
        if (info.name) tabInfo = info;
      }
      if (tabInfo.name) labelCell.push(textParagraph(document2, tabInfo.name, true));
      if (tabInfo.role) labelCell.push(textParagraph(document2, tabInfo.role, false));
      if (!labelCell.length && !panelCell.length) continue;
      cells.push([labelCell.length ? labelCell : "", panelCell.length ? panelCell : ""]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document: document2 }) {
    let items = [...element.querySelectorAll(".article-card-body")].map((body) => {
      var _a, _b;
      return {
        body,
        image: (_a = body.parentElement) == null ? void 0 : _a.querySelector(".article-card-image img, img"),
        href: ((_b = body.closest("a")) == null ? void 0 : _b.getAttribute("href")) || ""
      };
    });
    if (!items.length) {
      items = [...element.querySelectorAll(":scope > a, :scope > div")].map((card) => {
        var _a;
        return {
          body: card,
          image: card.querySelector("img"),
          href: ((_a = card.matches("a") ? card : card.querySelector("a")) == null ? void 0 : _a.getAttribute("href")) || ""
        };
      });
    }
    const cells = [];
    items.forEach(({ body, image, href }) => {
      const textCell = [];
      const tag = body.querySelector(".tag");
      const metaSpans = [...body.querySelectorAll(".article-card-meta span")];
      const date = metaSpans.find((s) => s !== tag && s.textContent.trim());
      if (tag && tag.textContent.trim()) {
        const p = document2.createElement("p");
        p.textContent = tag.textContent.trim();
        textCell.push(p);
      }
      if (date) {
        const p = document2.createElement("p");
        p.textContent = date.textContent.trim();
        textCell.push(p);
      }
      const heading = body.querySelector("h1, h2, h3, h4, h5, h6");
      if (heading) {
        const h3 = document2.createElement("h3");
        const title = heading.textContent.trim();
        if (href) {
          const a = document2.createElement("a");
          a.href = href;
          a.textContent = title;
          h3.append(a);
        } else {
          h3.textContent = title;
        }
        textCell.push(h3);
      }
      if (!image && !textCell.length) return;
      cells.push([image || "", textCell.length ? textCell : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document: document2 }) {
    let items = [...element.querySelectorAll(":scope > details, :scope > .faq-item")].filter((d, i, arr) => arr.indexOf(d) === i);
    if (!items.length) items = [...element.querySelectorAll("details")];
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      const questionText = summary ? (summary.querySelector("span, h2, h3, h4, p") || summary).textContent.trim().replace(/\s+/g, " ") : "";
      const answerEl = item.querySelector(".faq-answer") || [...item.children].find((c) => c !== summary);
      let answer = [];
      if (answerEl) {
        answer = [...answerEl.querySelectorAll(":scope > p, :scope > ul, :scope > ol")];
        if (!answer.length && answerEl.textContent.trim()) {
          const p = document2.createElement("p");
          p.textContent = answerEl.textContent.trim();
          answer = [p];
        }
      }
      if (!questionText && !answer.length) return;
      const q = document2.createElement("p");
      q.textContent = questionText;
      cells.push([q, answer.length ? answer : ""]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document: document2 }) {
    const body = element.querySelector(".card-body") || element;
    const bgImage = element.querySelector(":scope > img") || [...element.querySelectorAll("img")].find((img) => !body.contains(img) || body === element);
    const heading = body.querySelector("h1, h2, h3");
    const description = body.querySelector("p.subheading") || body.querySelector("p");
    const ctas = [...body.querySelectorAll(".button-group a, a.button")].filter((a, i, arr) => arr.indexOf(a) === i);
    if (!heading && !description && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    ctas.forEach((a) => {
      const p = document2.createElement("p");
      const link = document2.createElement("a");
      link.href = a.getAttribute("href") || "#";
      link.textContent = a.textContent.trim();
      p.append(link);
      contentCell.push(p);
    });
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".navbar .mega-menu",
        ".navbar .nav-menu-dropdown-list",
        "#nav-toggle"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "a.skip-link",
        "div.navbar",
        "footer.footer.inverse-footer",
        "noscript",
        "link",
        "iframe"
      ]);
      element.querySelectorAll("[data-astro-cid-37fxchfa]").forEach((el) => {
        el.removeAttribute("data-astro-cid-37fxchfa");
      });
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function findSectionElement(root, doc, selectors) {
    const list = Array.isArray(selectors) ? selectors : [selectors];
    for (const sel of list) {
      if (!sel) continue;
      let found = root.querySelector(sel);
      if (!found && doc) found = doc.querySelector(sel);
      if (!found && /^main\s*>/.test(sel)) {
        try {
          found = root.querySelector(sel.replace(/^main\s*>/, ":scope >"));
        } catch (e) {
        }
      }
      if (found) return found;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    if (!template || !Array.isArray(template.sections) || template.sections.length < 2) return;
    const doc = element.ownerDocument || document;
    const { sections } = template;
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = findSectionElement(element, doc, section.selector);
      if (!sectionEl) continue;
      if (section.style) {
        const metadata = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        sectionEl.append(metadata);
      }
      if (i > 0) {
        const hr = doc.createElement("hr");
        sectionEl.before(hr);
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "columns-hero": parse,
    "columns-feature": parse2,
    "columns-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Home page: intro with image collage, featured story, photo gallery, testimonials, latest articles, FAQ and closing CTA banner",
    urls: [
      "https://www.wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "columns-hero",
        instances: ["main > header.section.secondary-section > .container > .grid-layout.grid-gap-xxl"]
      },
      {
        name: "columns-feature",
        instances: ["main > section.section > .container > .grid-layout.tablet-1-column.grid-gap-lg"]
      },
      {
        name: "columns-gallery",
        instances: ["main > section.secondary-section .grid-layout.desktop-4-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: ["main .tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: ["main > section.secondary-section > .container > .grid-layout.desktop-4-column.grid-gap-md"]
      },
      {
        name: "accordion-faq",
        instances: ["main .faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["main > section.inverse-section .utility-position-relative.utility-radius-card"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "intro",
        selector: ["main > header.section.secondary-section"],
        style: "grey",
        blocks: ["columns-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "featured-story",
        selector: ["main > section.section:nth-of-type(1)"],
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "gallery",
        selector: ["main > section.section.secondary-section:nth-of-type(2)"],
        style: "grey",
        blocks: ["columns-gallery"],
        defaultContent: [".container > .utility-text-align-center.utility-margin-bottom-8rem"]
      },
      {
        id: "section-4",
        name: "testimonials",
        selector: ["main > section.section:nth-of-type(3)"],
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "latest-articles",
        selector: ["main > section.section.secondary-section:nth-of-type(4)"],
        style: "grey",
        blocks: ["cards-article"],
        defaultContent: [".container > .utility-text-align-center"]
      },
      {
        id: "section-6",
        name: "faq",
        selector: ["main > section.section:nth-of-type(5)"],
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [".grid-layout.grid-gap-xxl > div:first-child"]
      },
      {
        id: "section-7",
        name: "closing-cta",
        selector: ["main > section.section.inverse-section"],
        style: "dark",
        blocks: ["hero-banner"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
