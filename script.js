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

  if (!Array.isArray(categories) || categories.length !== 15) {
    throw new Error("AI VS expected exactly 15 category datasets.");
  }
  document.querySelectorAll("img").forEach((image) => {
    if (!image.hasAttribute("loading")) image.loading = "lazy";
    image.decoding = "async";
  });
  categories.forEach((category) => {
    if (!Array.isArray(category.keywords) || category.keywords.length !== 10) {
      throw new Error(`AI VS category "${category.title}" must contain exactly 10 keywords.`);
    }
  });

  const formatter = new Intl.NumberFormat("en-US");
  let lastFocusedElement = null;

  const toolProfiles = {
    "chatgpt": { strength: "broad, flexible assistant workflows", caution: "Double-check feature and usage limits on the current plan.", fit: ["general", "everyday", "free", "work"] },
    "claude": { strength: "long-form context and careful writing workflows", caution: "Check current model access and usage limits before relying on it.", fit: ["long", "document", "coding", "writing", "fiction"] },
    "gemini": { strength: "Google-connected workflows and multimodal tasks", caution: "Available features can differ by Google account and plan.", fit: ["google", "gmail", "research", "multimodal"] },
    "perplexity": { strength: "web research with source-oriented answers", caution: "Open cited sources and judge their quality yourself.", fit: ["research", "citation", "academic", "source", "news"] },
    "grok": { strength: "real-time and social-context queries", caution: "Check the source and freshness of fast-moving answers.", fit: ["real-time", "news"] },
    "microsoft copilot": { strength: "Microsoft ecosystem and workplace workflows", caution: "Feature access may depend on the Microsoft account or license.", fit: ["work", "microsoft", "powerpoint", "office"] },
    "poe": { strength: "access to a variety of conversational models", caution: "Model availability and message limits can change.", fit: ["multiple", "models"] },
    "meta ai": { strength: "quick access within Meta's consumer apps", caution: "Availability and features vary by app and region.", fit: ["free", "everyday"] },
    "pi": { strength: "casual, conversational assistance", caution: "It may not fit structured research or production workflows.", fit: ["conversation", "everyday"] },
    "runway": { strength: "a dedicated creative video-generation workflow", caution: "Generation credits and export limits deserve a current check.", fit: ["video", "animation", "creative"] },
    "pika": { strength: "quick, stylized generative video experiments", caution: "Compare output consistency on the same prompt.", fit: ["video", "animation"] },
    "capcut": { strength: "hands-on editing for short-form social video", caution: "Check export, asset, and plan limits for your workflow.", fit: ["short", "reels", "social", "editing"] },
    "invideo": { strength: "template-led video production and publishing", caution: "Review watermark, export, and usage limits on each plan.", fit: ["social", "youtube", "video"] },
    "synthesia": { strength: "presenter-led training and business videos", caution: "Avatar, language, and video-minute allowances vary by plan.", fit: ["training", "business", "avatar"] },
    "heygen": { strength: "avatar-led video and localization workflows", caution: "Verify current video and translation allowances.", fit: ["training", "avatar", "business"] },
    "descript": { strength: "transcript-based editing for spoken audio and video", caution: "Check transcription and export allowances for longer projects.", fit: ["podcast", "audio", "transcription", "editing"] },
    "veed": { strength: "browser-based editing, captions, and social exports", caution: "Export quality and limits may depend on plan.", fit: ["social", "subtitles", "podcast", "editing"] },
    "pictory": { strength: "turning written content into a video draft", caution: "Plan to review stock selections and edit the first draft.", fit: ["blog", "article", "video"] },
    "lumen5": { strength: "template-led repurposing of written content", caution: "Check branding and export options before choosing a plan.", fit: ["blog", "article", "video"] },
    "kling": { strength: "high-detail generative video experiments", caution: "Access, queue times, and generation limits can vary.", fit: ["realistic", "video"] },
    "canva": { strength: "accessible design across common creator assets", caution: "Compare editing control and paid asset access for your team.", fit: ["social", "design", "flyer", "beginner"] },
    "luma dream machine": { strength: "generative motion and cinematic scene exploration", caution: "Test consistency across multiple generations.", fit: ["animation", "realistic", "video"] },
    "adobe firefly": { strength: "creative tools within Adobe's design ecosystem", caution: "Check the current feature, credit, and licensing terms.", fit: ["commercial", "design", "image", "video"] },
    "elevenlabs": { strength: "expressive AI voice and voice-generation workflows", caution: "Review current commercial, voice, and character limits.", fit: ["voice", "narration", "podcast", "cloning"] },
    "murf": { strength: "polished voiceover workflows for business content", caution: "Check voice selection and download limits on the chosen plan.", fit: ["e-learning", "training", "business", "voiceover"] },
    "playht": { strength: "voice generation with creator and developer options", caution: "Confirm current API and commercial usage terms.", fit: ["voice", "api", "cloning"] },
    "wellsaid labs": { strength: "studio-style narration for professional learning content", caution: "Check seat and voice access against your production needs.", fit: ["training", "corporate", "e-learning"] },
    "speechify": { strength: "listen-first accessibility and text-to-speech workflows", caution: "Compare voice and document limits in the current plan.", fit: ["student", "accessibility", "reading"] },
    "naturalreader": { strength: "straightforward document reading and narration", caution: "Some voices and export options may require a paid tier.", fit: ["student", "accessibility", "reading"] },
    "lovo": { strength: "voiceover creation for video and creator projects", caution: "Verify downloads and commercial rights for your use.", fit: ["youtube", "voiceover", "video"] },
    "resemble ai": { strength: "programmable voice workflows for product teams", caution: "Review consent, API, and usage terms carefully.", fit: ["api", "developer", "voice"] },
    "amazon polly": { strength: "cloud-based text-to-speech integration", caution: "Model usage is metered; estimate ongoing usage costs.", fit: ["api", "developer", "cloud"] },
    "jasper": { strength: "structured marketing content workflows", caution: "Evaluate team seats and usage against the total cost.", fit: ["marketing", "team", "ad", "content"] },
    "copy.ai": { strength: "repeatable marketing and go-to-market workflows", caution: "Confirm workflow and seat allowances in current plans.", fit: ["marketing", "team", "ad"] },
    "grammarly": { strength: "everyday writing feedback across common apps", caution: "Verify which editing features are included in your plan.", fit: ["college", "business", "editing", "writing"] },
    "quillbot": { strength: "rewriting and study-oriented writing tools", caution: "Review word limits and academic-integrity expectations.", fit: ["college", "student", "rewriting"] },
    "writesonic": { strength: "AI writing with marketing and search-focused options", caution: "Check current word and feature allowances before subscribing.", fit: ["blog", "seo", "content"] },
    "rytr": { strength: "a lightweight starting point for short-form drafts", caution: "Check output limits and editing needs for long content.", fit: ["blog", "short", "beginner"] },
    "sudowrite": { strength: "creative-writing assistance for fiction projects", caution: "Treat generated passages as material to revise, not finished prose.", fit: ["fiction", "novel", "story"] },
    "novelai": { strength: "customizable story generation and creative exploration", caution: "Compare setup and editing effort as well as the output.", fit: ["fiction", "novel", "story"] },
    "wordtune": { strength: "quick sentence-level rewrites and phrasing options", caution: "Check rewrite limits and preserve your intended meaning.", fit: ["rewriting", "editing"] },
    "anyword": { strength: "marketing copy variants and messaging workflows", caution: "Treat predicted performance as a hypothesis to test.", fit: ["ad", "marketing", "ecommerce"] },
    "notion ai": { strength: "AI assistance alongside workspace notes and documents", caution: "Value depends on whether your team already uses the workspace.", fit: ["meeting", "calendar", "project", "notes"] },
    "writer": { strength: "team-oriented brand and style governance", caution: "Setup and administration may be more than a solo writer needs.", fit: ["business", "team", "style", "enterprise"] },
    "frase": { strength: "research-led content briefs and planning", caution: "Review research sources and generated recommendations.", fit: ["seo", "brief", "content"] },
    "prowritingaid": { strength: "in-depth editing feedback for long-form writing", caution: "Review suggestions selectively to preserve your own voice.", fit: ["fiction", "editing", "writing"] },
    "midjourney": { strength: "distinctive image generation and style exploration", caution: "Check current plan, usage rights, and editing workflow.", fit: ["game", "art", "portrait", "image"] },
    "leonardo ai": { strength: "image creation with creator-focused controls", caution: "Verify credit limits and commercial terms on your plan.", fit: ["game", "art", "image"] },
    "dall-e": { strength: "accessible prompt-driven image creation", caution: "Check current access, editing controls, and usage terms.", fit: ["product", "image"] },
    "ideogram": { strength: "image generation for text-led visual concepts", caution: "Test spelling and layout consistency on your own prompts.", fit: ["text", "logo", "image"] },
    "stable diffusion": { strength: "an open ecosystem with extensive customization", caution: "Setup, hardware, and model licensing need careful review.", fit: ["beginner", "local", "image"] },
    "flux": { strength: "flexible image-model experimentation and realism", caution: "Access and licensing depend on the provider and model.", fit: ["realistic", "portrait", "image"] },
    "krea": { strength: "rapid visual iteration and creative tooling", caution: "Verify export quality and current plan limits.", fit: ["upscaling", "image", "design"] },
    "playground ai": { strength: "approachable image creation and editing", caution: "Check current free-tier and export restrictions.", fit: ["free", "image", "design"] },
    "recraft": { strength: "design-oriented visuals and vector-style assets", caution: "Review output editing and commercial-use terms.", fit: ["logo", "illustration", "design"] },
    "github copilot": { strength: "in-editor code suggestions and GitHub workflows", caution: "Review suggestions and confirm the current individual or team plan.", fit: ["coding", "python", "java", "work"] },
    "cursor": { strength: "AI-assisted editing with codebase-aware IDE workflows", caution: "Compare model access, usage caps, and editor fit.", fit: ["coding", "large codebases", "debugging"] },
    "windsurf": { strength: "agentic assistance within a dedicated coding editor", caution: "Check current model access and usage limits.", fit: ["coding", "large codebases"] },
    "claude code": { strength: "agent-style coding and repository task workflows", caution: "Review proposed changes and current usage requirements.", fit: ["coding", "debugging", "autonomous"] },
    "amazon q developer": { strength: "AWS-aware development and cloud assistance", caution: "Check feature differences between current plan levels.", fit: ["aws", "cloud", "developer"] },
    "replit ai": { strength: "an integrated browser-based build and learning workflow", caution: "Check workspace, deployment, and usage limits.", fit: ["beginner", "coding"] },
    "tabnine": { strength: "privacy-minded code assistance options for teams", caution: "Verify deployment and governance features for your tier.", fit: ["enterprise", "privacy", "coding"] },
    "continue": { strength: "an adaptable open-source coding assistant setup", caution: "Expect some configuration and model-provider setup.", fit: ["local", "coding", "models"] },
    "sourcegraph cody": { strength: "codebase context and code search workflows", caution: "Check repository indexing and plan availability.", fit: ["code search", "large codebases"] },
    "jetbrains ai": { strength: "AI features integrated with JetBrains IDEs", caution: "Compare supported IDEs and plan requirements.", fit: ["java", "coding"] },
    "openhands": { strength: "open agent-style software engineering experiments", caution: "Expect setup and review time before trusting changes.", fit: ["autonomous", "coding"] }
  };

  const accentColors = {
    green: "#00ff88",
    purple: "#bd8aff",
    blue: "#80aaff",
    orange: "#ffb35c",
    pink: "#ff7db5",
    cyan: "#5fe3e3",
    lime: "#c4f45c"
  };

  function makeCard(category, index) {
    const card = document.createElement("button");
    card.className = "category-card";
    card.type = "button";
    card.dataset.slug = category.slug;
    card.style.setProperty("--accent", accentColors[category.color] || "#00ff88");
    card.style.animationDelay = `${Math.min(index * 35, 420)}ms`;
    card.setAttribute("aria-label", `Open ${category.title} ${category.subtitle} comparisons`);

    const top = document.createElement("span");
    top.className = "card-top";
    const icon = document.createElement("span");
    icon.className = "card-icon";
    icon.setAttribute("aria-hidden", "true");
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
    open.setAttribute("aria-hidden", "true");
    open.textContent = "↗";
    bottom.append(keywords, open);
    card.append(top, title, subtitle, bottom);
    return card;
  }

  function renderCategories(query = "") {
    const normalizedQuery = query.trim().toLocaleLowerCase("en-US");
    const filtered = categories.filter((category) => {
      const searchable = [
        category.title,
        category.subtitle,
        category.description,
        ...category.keywords.map(([keyword]) => keyword)
      ].join(" ").toLocaleLowerCase("en-US");
      return searchable.includes(normalizedQuery);
    });

    grid.replaceChildren(...filtered.map((category) => makeCard(category, categories.indexOf(category))));
    comparisonSections.querySelectorAll(".category-comparison-section").forEach((section) => {
      section.hidden = !filtered.some((category) => category.slug === section.dataset.slug);
    });
    resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "category" : "categories"}`;
    emptyState.hidden = filtered.length > 0;
  }

  function splitComparison(keyword) {
    const match = keyword.match(/^(.+?)\s+vs\s+(.+?)(?=\s+for\s+|\s+pricing\b|\s+on\s+|\s+in\s+|$)/i);
    if (!match) throw new Error(`Could not parse comparison keyword: ${keyword}`);
    const names = [match[1].trim(), match[2].trim()];
    names[1] = names[1].replace(/\s+(?:video|pricing)$/i, "").trim();
    const remaining = keyword.slice(match[0].length).trim();
    const focus = remaining.replace(/^(?:for|on|in)\s+/i, "").replace(/\s+pricing$/i, "").trim();
    const hasPricingIntent = /\bpricing\b/i.test(keyword);
    return { names, focus: focus || (hasPricingIntent ? "pricing and usage limits" : "your specific workflow") };
  }

  function profileFor(name) {
    const normalized = name.toLocaleLowerCase("en-US");
    return toolProfiles[normalized] || {
      strength: "a distinct workflow worth testing against your requirements",
      caution: "Check current feature access, usage limits, and plan terms."
    };
  }

  function chooseIntentPick(names, focus) {
    const terms = focus.toLocaleLowerCase("en-US").split(/[^a-z0-9]+/).filter((term) => term.length > 2);
    const scores = names.map((name) => {
      const fit = profileFor(name).fit || [];
      return fit.reduce((score, phrase) => {
        const words = phrase.toLocaleLowerCase("en-US").split(/[^a-z0-9]+/);
        return score + (words.some((word) => terms.includes(word)) ? 1 : 0);
      }, 0);
    });
    return scores[1] > scores[0] ? 1 : 0;
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createList(title, items, className) {
    const wrapper = createElement("div", className);
    wrapper.append(createElement("h4", "detail-subheading", title));
    const list = document.createElement("ul");
    items.forEach((item) => list.append(createElement("li", "", item)));
    wrapper.append(list);
    return wrapper;
  }

  function makeComparisonArticle(category, keywordData, index) {
    const [keyword, volume, difficulty, domain, rationale] = keywordData;
    const { names, focus } = splitComparison(keyword);
    const profiles = names.map(profileFor);
    const pickIndex = chooseIntentPick(names, focus);
    const winner = names[pickIndex];
    const alternative = names[1 - pickIndex];
    const winnerProfile = profiles[pickIndex];
    const alternativeProfile = profiles[1 - pickIndex];
    const article = createElement("article", "comparison-card");
    article.id = `${category.slug}-comparison-${index + 1}`;
    article.dataset.keyword = keyword;

    const top = createElement("div", "comparison-card-top");
    const sequence = createElement("span", "comparison-index", `COMPARISON ${String(index + 1).padStart(2, "0")}`);
    const winnerBadge = createElement("span", "winner-badge", `✦ QUICK PICK · ${winner}`);
    winnerBadge.title = `Intent-led editorial starting point for ${focus}; not a live product benchmark.`;
    top.append(sequence, winnerBadge);

    const title = createElement("h2", "comparison-title", `${names[0]} vs ${names[1]}`);
    const targetKeyword = createElement("p", "target-keyword");
    targetKeyword.append(createElement("span", "target-label", "LOW-COMPETITION US KEYWORD"), document.createTextNode(` “${keyword}”`));
    const intro = createElement("p", "comparison-intro", `A focused ${category.subtitle.toLocaleLowerCase("en-US")} comparison for people weighing ${focus}. Use the same real task to assess both tools; this quick pick is a research starting point, not a universal ranking.`);
    const stats = createElement("div", "detail-stats");
    stats.append(
      createElement("span", "", `US volume estimate: ${formatter.format(volume)} / month`),
      createElement("span", "low-kd", `Low KD estimate: ${difficulty} / 100`),
      createElement("span", "", `SERP domain to investigate: ${domain}`)
    );

    const pricing = createElement("div", "detail-block pricing-block");
    const pricingHeading = createElement("h3", "", "Pricing snapshot ");
    pricingHeading.append(createElement("span", "", "(USD)"));
    pricing.append(pricingHeading);
    const pricingWrap = createElement("div", "pricing-table-wrap");
    const pricingTable = document.createElement("table");
    pricingTable.className = "pricing-table";
    const pricingHead = document.createElement("thead");
    const pricingHeadRow = document.createElement("tr");
    ["Tool", "Free option", "Paid plans (USD)", "What to verify"].forEach((label) => pricingHeadRow.append(createElement("th", "", label)));
    pricingHead.append(pricingHeadRow);
    const pricingBody = document.createElement("tbody");
    names.forEach((name) => {
      const row = document.createElement("tr");
      row.append(
        createElement("th", "pricing-tool", name),
        createElement("td", "", "$0 if currently offered"),
        createElement("td", "pricing-variable", "Check current $ / month"),
        createElement("td", "", "Usage, seats & annual billing")
      );
      pricingBody.append(row);
    });
    pricingTable.append(pricingHead, pricingBody);
    pricingWrap.append(pricingTable);
    pricing.append(pricingWrap, createElement("p", "pricing-note", "Plans, trials, credits, and USD prices change often. No current price is assumed here—confirm each vendor’s official US pricing before you buy."));

    const points = createElement("div", "detail-points");
    const pros = [
      `${names[0]}: ${profiles[0].strength}.`,
      `${names[1]}: ${profiles[1].strength}.`,
      `Both: ${rationale}`
    ];
    const cons = [
      `${names[0]}: ${profiles[0].caution}`,
      `${names[1]}: ${profiles[1].caution}`,
      "Outputs depend on the task, account, and settings; test both with the same inputs before deciding."
    ];
    points.append(createList("3 PROS", pros, "pros-list"), createList("3 CONS", cons, "cons-list"));

    const verdict = createElement("div", "verdict-block");
    verdict.append(createElement("h3", "", "Quick verdict"));
    verdict.append(
      createElement("p", "", `For ${focus}, ${winner} is an intent-led starting pick because ${winnerProfile.strength}.`),
      createElement("p", "", `Keep ${alternative} in the running if ${alternativeProfile.strength} matters more to your workflow; test both and compare the current US plan price before committing.`)
    );

    const authorBox = createElement("aside", "author-box");
    authorBox.setAttribute("aria-label", "Author and review note");
    const authorAvatar = createElement("span", "author-avatar", "A");
    authorAvatar.setAttribute("aria-hidden", "true");
    const authorDetails = createElement("div", "author-details");
    authorDetails.append(
      createElement("strong", "", "Written by [Ahmad] — AI Tools Researcher"),
      createElement("span", "", "Draft byline — replace with the real author before publishing.")
    );
    authorBox.append(authorAvatar, authorDetails);
    const testingNote = createElement("p", "testing-disclosure", "Hands-on testing: Add real test dates, tasks, and observations here. This draft does not claim a personal three-day test.");

    const faq = createElement("details", "comparison-faq");
    const question = `How should US users compare ${names[0]} vs ${names[1]} for ${focus}?`;
    const answer = `For the US search “${keyword},” compare ${names[0]} and ${names[1]} using the same ${focus} task, then review output quality, workflow fit, and current USD plan terms. The intent-led starting pick here is ${winner}, not a guarantee of the best result.`;
    faq.append(createElement("summary", "", question), createElement("p", "", answer));
    const actions = createElement("div", "comparison-card-actions");
    const volumeAction = createElement("button", "text-button", "View keyword estimates ↗");
    volumeAction.type = "button";
    volumeAction.dataset.keywordCategory = category.slug;
    volumeAction.setAttribute("aria-label", `View all keyword estimates for ${category.title}`);
    actions.append(volumeAction, createElement("span", "comparison-domain-note", `Investigate ${domain}`));

    const relatedLinks = createElement("nav", "related-comparisons");
    relatedLinks.setAttribute("aria-label", `Related ${category.title} comparisons`);
    const relatedCandidates = [
      category.keywords[index - 1],
      category.keywords[index + 1]
    ].filter(Boolean);
    if (relatedCandidates.length) {
      relatedLinks.append(createElement("span", "related-label", "RELATED"));
      relatedCandidates.forEach(([relatedKeyword], relatedIndex) => {
        const relatedId = `${category.slug}-comparison-${relatedIndex === 0 && index > 0 ? index : index + 2}`;
        const link = createElement("a", "related-link", relatedKeyword.replace(/\s+for\s+.+$/i, ""));
        link.href = `#${relatedId}`;
        relatedLinks.append(link);
      });
    }

    const seoIntent = focus === "pricing and usage limits" ? "Which Is Cheaper?" : "Which Is Better?";
    article.dataset.seoTitle = `${names[0]} vs ${names[1]} (${new Date().getFullYear()} US Pricing) - ${seoIntent} | AI VS`;
    article.dataset.seoDescription = `${names[0]} vs ${names[1]} for ${focus}: review an intent-led verdict, plan details to verify, and illustrative US search estimates.`;
    article.append(top, title, targetKeyword, intro, stats, pricing, points, verdict, authorBox, testingNote, faq, actions, relatedLinks);
    article.faqQuestion = question;
    article.faqAnswer = answer;
    return article;
  }

  function renderComparisonLibrary() {
    const sections = [];
    const faqEntities = [];
    categories.forEach((category) => {
      const section = createElement("section", "category-comparison-section");
      section.id = `details-${category.slug}`;
      section.dataset.slug = category.slug;
      section.setAttribute("aria-labelledby", `details-title-${category.slug}`);
      const header = createElement("div", "category-detail-heading");
      const headingCopy = document.createElement("div");
      headingCopy.append(createElement("p", "eyebrow", `CATEGORY ${String(categories.indexOf(category) + 1).padStart(2, "0")} / 15`));
      const heading = createElement("h2", "", category.title);
      heading.id = `details-title-${category.slug}`;
      headingCopy.append(heading, createElement("p", "category-detail-description", category.description));
      const actions = createElement("div", "category-detail-actions");
      actions.append(createElement("span", "category-detail-count", "10 detailed comparisons"));
      const estimatesButton = createElement("button", "button button-outline", "Keyword estimates ↗");
      estimatesButton.type = "button";
      estimatesButton.dataset.keywordCategory = category.slug;
      actions.append(estimatesButton);
      header.append(headingCopy, actions);

      const cards = createElement("div", "comparison-detail-grid");
      const articles = category.keywords.map((keywordData, index) => makeComparisonArticle(category, keywordData, index));
      articles.forEach((article) => {
        cards.append(article);
        faqEntities.push({
          "@type": "Question",
          "name": article.faqQuestion,
          "acceptedAnswer": { "@type": "Answer", "text": article.faqAnswer }
        });
      });
      section.append(header, cards);
      sections.push(section);
    });
    comparisonSections.replaceChildren(...sections);
    faqSchema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqEntities
    });
  }

  function updateSeoMetadata() {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const comparison = hash ? document.getElementById(hash) : null;
    let title = "AI VS — Low-Competition AI Comparison Keywords for the US";
    let description = "Explore 150 US-focused AI comparison ideas with illustrative search estimates, tool trade-offs, and current-plan pricing guidance.";

    if (comparison?.classList.contains("comparison-card")) {
      title = comparison.dataset.seoTitle;
      description = comparison.dataset.seoDescription;
    } else {
      const categorySection = hash.startsWith("details-") ? document.getElementById(hash) : null;
      if (categorySection?.classList.contains("category-comparison-section")) {
        const category = categories.find((item) => item.slug === categorySection.dataset.slug);
        if (category) {
          title = `${category.title} ${category.subtitle} — 10 US Comparisons | AI VS`;
          description = `${category.description} Explore 10 US-focused comparison ideas, illustrative keyword estimates, and pricing guidance.`;
        }
      } else if (["about", "contact", "privacy"].includes(hash)) {
        const infoTitle = document.querySelector(`#${hash} h2`)?.textContent;
        if (infoTitle) title = `${infoTitle} | AI VS`;
      }
    }

    document.title = title;
    pageDescription.content = description;
    socialTitle.content = title;
    socialDescription.content = description;
  }

  function makeCell(text, className) {
    const cell = document.createElement("td");
    if (className) cell.className = className;
    cell.textContent = text;
    return cell;
  }

  function populateComparison(category) {
    dialogTitle.textContent = category.title;
    dialogDescription.textContent = category.description;
    const rows = category.keywords.map(([keyword, volume, difficulty, domain, rationale]) => {
      const row = document.createElement("tr");
      row.append(
        makeCell(keyword),
        makeCell(formatter.format(volume)),
        makeCell(`${difficulty} / 100`, "kd-pill"),
        makeCell(domain),
        makeCell(rationale)
      );
      return row;
    });
    comparisonRows.replaceChildren(...rows);
  }

  function openCategory(slug, trigger) {
    const category = categories.find((item) => item.slug === slug);
    if (!category) return;
    lastFocusedElement = trigger;
    populateComparison(category);
    dialog.showModal();
    closeButton.focus();
  }

  function closeDialog() {
    if (dialog.open) dialog.close();
  }

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".category-card");
    if (!card) return;
    const section = document.querySelector(`#details-${card.dataset.slug}`);
    if (section && !section.hidden) {
      history.pushState(null, "", `#${section.id}`);
      updateSeoMetadata();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  comparisonSections.addEventListener("click", (event) => {
    const button = event.target.closest("[data-keyword-category]");
    if (button) openCategory(button.dataset.keywordCategory, button);
  });

  search.addEventListener("input", () => renderCategories(search.value));
  closeButton.addEventListener("click", closeDialog);
  doneButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", () => {
    if (lastFocusedElement?.isConnected) lastFocusedElement.focus();
  });
  window.addEventListener("hashchange", updateSeoMetadata);
  window.addEventListener("popstate", updateSeoMetadata);
  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !dialog.open && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      search.focus();
    }
    if (event.key === "Escape" && dialog.open) closeDialog();
  });

  renderComparisonLibrary();
  renderCategories();
  updateSeoMetadata();
  if (window.location.hash) {
    requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target && (target.classList.contains("comparison-card") || target.classList.contains("category-comparison-section"))) {
        target.scrollIntoView({ block: "start" });
      }
    });
  }
})();