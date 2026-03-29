(function () {
  const {
    params,
    getProgram,
    findEntry,
    buildTopicLink,
    setFooter,
    setNavState
  } = window.SiteApp;

  const search = params();
  const programKey = search.get("program") || "bsc";
  const tableId = search.get("table");
  const entryId = search.get("entry");
  const program = getProgram(programKey);
  const found = findEntry(programKey, tableId, entryId);

  setNavState(programKey);

  if (!found) {
    document.body.innerHTML = '<main class="shell page-layout"><div class="empty-state">항목을 찾을 수 없습니다.</div></main>';
    return;
  }

  document.title = `${found.entry.title} | ${program.code}`;

  document.getElementById("entryProgramLabel").textContent = program.code;
  document.getElementById("backToProgram").href = `${programKey}.html`;
  document.getElementById("entryCategory").textContent = `${found.table.title} / ${found.group.label}`;
  document.getElementById("entryTitle").textContent = found.entry.title;
  document.getElementById("entrySummary").textContent = found.entry.summary || "";

  document.getElementById("chapterList").innerHTML = (found.entry.chapters || [])
    .map(
      (chapter) => `
        <article class="chapter-card">
          <h3>${chapter.title}</h3>
          <div class="topic-list">
            ${(chapter.topics || [])
              .map(
                (topic) => `
                  <a class="topic-link" href="${buildTopicLink(programKey, tableId, entryId, topic.id)}">
                    ${topic.title}
                    <span>${topic.summary || ""}</span>
                  </a>
                `
              )
              .join("")}
          </div>
        </article>
      `
    )
    .join("");

  setFooter();
})();
