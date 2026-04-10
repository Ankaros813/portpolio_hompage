(function () {
  const data = window.SITE_DATA;

  function getProgramKeyFromPath() {
    const path = window.location.pathname;
    if (path.endsWith("msc.html")) {
      return "msc";
    }
    return "bsc";
  }

  function params() {
    return new URLSearchParams(window.location.search);
  }

  function setFooter() {
    const footer = document.getElementById("footerText");
    if (footer) {
      footer.textContent = data.site.footer;
    }
  }

  function preventIosInputZoom() {
    const ua = window.navigator.userAgent || "";
    const isAppleMobile = /iPhone|iPad|iPod/i.test(ua);

    if (!isAppleMobile) {
      return;
    }

    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      return;
    }

    const content = viewport.getAttribute("content") || "";
    if (!content.includes("maximum-scale=1")) {
      viewport.setAttribute("content", `${content}, maximum-scale=1, viewport-fit=cover`);
    }
  }

  function loadChatbot() {
    const chatbot = data.site.chatbot;

    if (!chatbot || !chatbot.enabled || !chatbot.scriptSrc || !chatbot.apiKey) {
      return;
    }

    const allowedHosts = chatbot.allowedHosts || [];
    if (allowedHosts.length > 0 && !allowedHosts.includes(window.location.hostname)) {
      return;
    }

    if (document.querySelector('script[data-chatbot-loader="deepfountain"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src = chatbot.scriptSrc;
    script.setAttribute("data-api-key", chatbot.apiKey);
    script.setAttribute("data-chatbot-loader", "deepfountain");
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  function setNavState(programKey) {
    const bsc = document.getElementById("navBsc") || document.getElementById("topicNavBsc");
    const msc = document.getElementById("navMsc") || document.getElementById("topicNavMsc");

    if (bsc && msc) {
      bsc.classList.toggle("is-active", programKey === "bsc");
      msc.classList.toggle("is-active", programKey === "msc");
    }
  }

  function getProgram(programKey) {
    return data.programs[programKey];
  }

  function findTable(programKey, tableId) {
    return getProgram(programKey).tables.find((table) => table.id === tableId);
  }

  function findEntry(programKey, tableId, entryId) {
    const table = findTable(programKey, tableId);
    let found = null;

    table.groups.forEach((group) => {
      group.entries.forEach((entry) => {
        if (entry.id === entryId) {
          found = { group, entry, table };
        }
      });
    });

    return found;
  }

  function findTopic(programKey, tableId, entryId, topicId) {
    const foundEntry = findEntry(programKey, tableId, entryId);
    let found = null;

    foundEntry.entry.chapters.forEach((chapter) => {
      (chapter.topics || []).forEach((topic) => {
        if (topic.id === topicId) {
          found = { table: foundEntry.table, entry: foundEntry.entry, chapter, topic };
        }
      });
    });

    return found;
  }

  function buildEntryLink(programKey, tableId, entryId) {
    return `entry.html?program=${programKey}&table=${tableId}&entry=${entryId}`;
  }

  function buildTopicLink(programKey, tableId, entryId, topicId) {
    return `topic.html?program=${programKey}&table=${tableId}&entry=${entryId}&topic=${topicId}`;
  }

  function normalizeText(value) {
    return String(value || "").toLowerCase();
  }

  function buildSearchResults(query) {
    const terms = normalizeText(query)
      .split(/\s+/)
      .filter(Boolean);

    if (terms.length === 0) {
      return [];
    }

    const results = new Map();

    function addResult({ href, title, meta, text }) {
      if (!href || results.has(href)) {
        return;
      }

      const haystack = normalizeText([title, meta, text].join(" "));
      const isMatch = terms.every((term) => haystack.includes(term));

      if (!isMatch) {
        return;
      }

      results.set(href, { href, title, meta });
    }

    addResult({
      href: "index.html",
      title: data.site.owner,
      meta: data.site.title,
      text: [
        data.site.subtitle,
        data.site.tagline,
        data.site.intro,
        ...(data.home.education || []).map((item) => `${item.title} ${item.subtitle}`),
        ...(data.home.projects || []).map((item) => `${item.title} ${item.subtitle}`),
        ...(data.site.links || []).map((item) => `${item.label} ${item.value}`)
      ].join(" ")
    });

    Object.entries(data.programs || {}).forEach(([programKey, program]) => {
      addResult({
        href: `${programKey}.html`,
        title: `${program.code} ${program.title}`,
        meta: "Program Page",
        text: [
          program.description,
          ...(program.meta || []).map((item) => `${item.label} ${item.value}`),
          ...(program.tables || []).map((table) => `${table.title} ${table.description}`)
        ].join(" ")
      });

      (program.tables || []).forEach((table) => {
        (table.groups || []).forEach((group) => {
          (group.entries || []).forEach((entry) => {
            const entryHref = buildEntryLink(programKey, table.id, entry.id);
            addResult({
              href: entryHref,
              title: entry.title,
              meta: `${program.code} / ${table.title} / ${group.label}`,
              text: [
                entry.summary,
                ...(entry.chapters || []).map((chapter) => chapter.title),
                ...(entry.chapters || []).flatMap((chapter) =>
                  (chapter.topics || []).map((topic) => `${topic.title} ${topic.summary}`)
                )
              ].join(" ")
            });

            (entry.chapters || []).forEach((chapter) => {
              (chapter.topics || []).forEach((topic) => {
                addResult({
                  href: buildTopicLink(programKey, table.id, entry.id, topic.id),
                  title: topic.title,
                  meta: `${program.code} / ${entry.title} / ${chapter.title}`,
                  text: [
                    topic.summary,
                    ...(topic.notes || []).map((note) => `${note.title} ${note.text}`),
                    ...(topic.attachments || []).map((item) => `${item.label} ${item.href}`),
                    ...(topic.gallery || []).map((item) => `${item.title} ${item.caption}`)
                  ].join(" ")
                });
              });
            });
          });
        });
      });
    });

    return Array.from(results.values());
  }

  window.SiteApp = {
    data,
    params,
    getProgramKeyFromPath,
    getProgram,
    findTable,
    findEntry,
    findTopic,
    buildEntryLink,
    buildTopicLink,
    buildSearchResults,
    setFooter,
    setNavState
  };

  preventIosInputZoom();
  loadChatbot();
})();
