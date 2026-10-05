(() => {
  "use strict";

  const categories = window.AIVS_CATEGORIES;
  const grid = document.querySelector("#category-grid");
  const search = document.querySelector("#category-search");
  const resultCount = document.querySelector("#results-count");
  const emptyState = document.querySelector("#empty-state");
  const comparisonSections = document.querySelector("#comparison-sections");
  const faqSchema = document.querySelector("#faq-schema");
  const pageDescription = document.querySelector('meta[name="description"]');
  const socialTitle = document.querySelector('meta[property="og:title"]');
  const socialDescription = document.querySelector('meta[property="og:description"]');
  const dialog = document.querySelector("#comparison-dialog");
  const dialogTitle = document.querySelector("#dialog-title");
  const dialogDescription = document.querySelector("#dialog-description");
  const comparisonRows = document.querySelector("#comparison-rows");
  const closeButton = document.querySelector(".dialog-close");
  const doneButton = document.querySelector(".dialog-done");

  // DEBOUNCE - ye INP fix karega
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

  // Searchable text pehle se banao - speed ke liye
  const searchableMap = new Map();
  categories.forEach((category) => {
    searchableMap.set(category.slug, [
      category.title,
      category.subtitle,
      category.description,
     ...category.keywords.map(([k]) => k)
    ].join(" ").toLocaleLowerCase("en-US"));
  });

  const formatter = new Intl.NumberFormat("en-US");
  let lastFocusedElement = null;

  const toolProfiles = { /*...tumhara purana toolProfiles yahan same rahega... */ };
  // NOTE: ToolProfiles ka sara data same rehne do, maine yahan short kiya hai paste karne me asani ke liye
  // Agar pura chahiye to neeche wala complete file GitHub se le lo

  // --- BAQI SAARE FUNCTIONS SAME RAHENGE ---
  // makeCard, splitComparison, profileFor etc waisa hi rahega

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
    // Fast filter using pre-computed map
    const filtered = normalizedQuery === ""? categories : categories.filter((c) => searchableMap.get(c.slug).includes(normalizedQuery));

    // Use Fragment for faster DOM
    const frag = document.createDocumentFragment();
    filtered.forEach((category, i) => frag.append(makeCard(category, categories.indexOf(category))));
    grid.replaceChildren(frag);

    comparisonSections.querySelectorAll(".category-comparison-section").forEach((section) => {
      section.hidden =!filtered.some((category) => category.slug === section.dataset.slug);
    });
    resultCount.textContent = `${filtered.length} ${filtered.length === 1? "category" : "categories"}`;
    emptyState.hidden = filtered.length > 0;
  }

  //... baqi makeComparisonArticle, renderComparisonLibrary, updateSeoMetadata functions same copy kar lo purani file se...

  // SEARCH KO DEBOUNCE SE LAGAO - YE SAB SE IMPORTANT LINE HAI
  search.addEventListener("input", debounce(() => renderCategories(search.value), 200));

  // Baqi event listeners same
  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".category-card");
    if (!card) return;
    const section = document.querySelector(`#details-${card.dataset.slug}`);
    if (section &&!section.hidden) {
      history.pushState(null, "", `#${section.id}`);
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  closeButton.addEventListener("click", () => dialog.close());
  doneButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

  renderCategories();
  if (window.location.hash) {
    requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) target.scrollIntoView({ block: "start" });
    });
  }
})();