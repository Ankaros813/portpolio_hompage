(function () {
  const {
    params,
    getProgram,
    findTopic,
    buildEntryLink,
    setFooter,
    setNavState
  } = window.SiteApp;

  const search = params();
  const programKey = search.get("program") || "bsc";
  const tableId = search.get("table");
  const entryId = search.get("entry");
  const topicId = search.get("topic");
  const program = getProgram(programKey);
  const found = findTopic(programKey, tableId, entryId, topicId);

  setNavState(programKey);

  if (!found) {
    document.body.innerHTML = '<main class="shell page-layout"><div class="empty-state">세부 주제를 찾을 수 없습니다.</div></main>';
    return;
  }

  document.title = `${found.topic.title} | ${program.code}`;

  document.getElementById("topicProgramLabel").textContent = program.code;
  document.getElementById("backToEntry").href = buildEntryLink(programKey, tableId, entryId);
  document.getElementById("topicChapter").textContent = `${found.table.title} / ${found.chapter.title}`;
  document.getElementById("topicTitle").textContent = found.topic.title;
  document.getElementById("topicSummary").textContent = found.topic.summary || "";

  document.getElementById("topicNotes").innerHTML = (found.topic.notes || [])
    .map(
      (note) => `
        <article class="note-card">
          <h3>${note.title}</h3>
          <p>${note.text}</p>
        </article>
      `
    )
    .join("");

  document.getElementById("topicAttachments").innerHTML =
    (found.topic.attachments || []).length > 0
      ? found.topic.attachments
          .map(
            (attachment) => `
              <article class="attachment-item">
                <a class="attachment-link" href="${attachment.href}" target="_blank" rel="noreferrer">${attachment.label}</a>
              </article>
            `
          )
          .join("")
      : '<div class="empty-state">등록된 첨부 자료가 없습니다.</div>';

  document.getElementById("topicGallery").innerHTML =
    (found.topic.gallery || []).length > 0
      ? found.topic.gallery
          .map(
            (item) => `
              <article class="gallery-card">
                ${
                  item.image
                    ? `<img src="${item.image}" alt="${item.title}" loading="lazy" />`
                    : `<div class="gallery-placeholder">${item.title}</div>`
                }
                <div class="gallery-caption">
                  <strong>${item.title}</strong>
                  <span>${item.caption || ""}</span>
                </div>
              </article>
            `
          )
          .join("")
      : '<div class="empty-state">등록된 이미지 자료가 없습니다.</div>';

  setFooter();
})();
