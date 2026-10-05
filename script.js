(() => {
  "use strict";

  const categories = window.AIVS_CATEGORIES;
  const grid = document.querySelector("#category-grid");
  const search = document.querySelector("#category-search");
  const resultCount = document.querySelector("#results-count");
  const emptyState = document.querySelector("#empty-state");
  const comparisonSections = document.querySelector("#comparison-sections");
  const dialog = document.querySelector("#comparison-dialog");
  const dialogTitle = document.querySelector("#dialog-title");
  const dialogDescription = document.querySelector("#dialog-description");
  const comparisonRows = document.querySelector("#comparison-rows");
  const closeButton = document.querySelector(".dialog-close");
  const doneButton = document.querySelector(".dialog-done");

  // DEBOUNCE - INP FIX - Ahmad
  function debounce(fn, delay = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  if (!Array.isArray(categories) || categories.length!== 15) {
    throw new Error("AI VS expected exactly 15 category datasets.");
  }

  document.querySelectorAll("img").forEach((image) => {
    if (!image.hasAttribute("loading")) image.loading = "lazy";
    image.decoding = "async";
  });

  const searchableMap = new Map();
  categories.forEach((category) => {
    searchableMap.set(category.slug, [
      category.title,
      category.subtitle,
      category.description,
     ...category.keywords.map(([k]) => k)
    ].join(" ").toLocaleLowerCase("en-US"));
  });

  let lastFocusedElement = null;

  function makeCard(category, index) {
    const card = document.createElement("button");
    card.className = "category-card";
    card.type = "button";
    card.dataset.slug = category.slug;
    card.setAttribute("aria-label", `Open ${category.title}`);
    card.style.animationDelay = `${Math.min(index * 35, 420)}ms`;
    const top = document.createElement("span");
    top.className = "card-top";
    const icon = document.createElement("span");
    icon.className = "card-icon";
    icon.textContent = category.icon;
    const tag = document.createElement("span");
    tag.className = "card-tag";
    tag.textContent = category.tag;
    top.append(icon, tag);
    const title = document.createElement("span");
    title.className = "category-card-title";
    title.textContent = category.title;
    const subtitle = document.createElement("span");
    subtitle.className = "card-subtitle";
    subtitle.textContent = category.subtitle;
    const bottom = document.createElement("span");
    bottom.className = "card-bottom";
    const keywords = document.createElement("span");
    keywords.className = "card-keywords";
    const keywordCount = document.createElement("strong");
    keywordCount.textContent = "10";
    keywords.append(keywordCount, document.createTextNode(" comparison ideas"));
    const open = document.createElement("span");
    open.className = "card-open";
    open.textContent = "↗";
    bottom.append(keywords, open);
    card.append(top, title, subtitle, bottom);
    return card;
  }

  function renderCategories(query = "") {
    const normalizedQuery = query.trim().toLocaleLowerCase("en-US");
    const filtered = normalizedQuery === ""? categories : categories.filter((c) => searchableMap.get(c.slug).includes(normalizedQuery));

    // CLS FIX: layout shift rokna
    const prevHeight = grid.offsetHeight;
    grid.style.minHeight = prevHeight + "px";

    const frag = document.createDocumentFragment();
    filtered.forEach((category) => frag.append(makeCard(category, categories.indexOf(category))));

    requestAnimationFrame(() => {
      grid.replaceChildren(frag);
      comparisonSections.querySelectorAll(".category-comparison-section").forEach((section) => {
        section.hidden =!filtered.some((category) => category.slug === section.dataset.slug);
      });
      resultCount.textContent = `${filtered.length} ${filtered.length === 1? "category" : "categories"}`;
      emptyState.hidden = filtered.length > 0;

      // height wapas auto
      requestAnimationFrame(() => {
        grid.style.minHeight = "";
      });
    });
  }

  // SEARCH - Sab se important INP fix
  search.addEventListener("input", debounce(() => renderCategories(search.value), 200));

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".category-card");
    if (!card) return;
    const section = document.querySelector(`#details-${card.dataset.slug}`);
    if (section &&!section.hidden) {
      requestAnimationFrame(() => {
        history.pushState(null, "", `#${section.id}`);
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  });

  if (closeButton) closeButton.addEventListener("click", () => dialog.close());
  if (doneButton) doneButton.addEventListener("click", () => dialog.close());
  if (dialog) dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

  renderCategories();
  if (window.location.hash) {
    requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) target.scrollIntoView({ block: "start" });
    });
  }
})();