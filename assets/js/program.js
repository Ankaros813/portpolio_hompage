(function () {
  const { getProgramKeyFromPath, getProgram, buildEntryLink, setFooter } = window.SiteApp;

  const programKey = getProgramKeyFromPath();
  const program = getProgram(programKey);

  document.title = `${program.code} | ${program.title}`;

  document.getElementById("programTitle").textContent = `${program.code} Curriculum`;
  document.getElementById("programDescription").textContent = program.description;

  document.getElementById("programMeta").innerHTML = program.meta
    .map(
      (item) => `
        <article class="meta-card">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </article>
      `
    )
    .join("");

  const sectionHost = document.getElementById("tableSections");
  const tableJumpNav = document.getElementById("tableJumpNav");

  tableJumpNav.innerHTML = program.tables
    .map(
      (table) => `
        <a class="jump-link jump-link-cta" href="#table-${table.id}">
          <span>${table.title}</span>
          <strong>↓</strong>
        </a>
      `
    )
    .join("");

  function renderCreditTableRows(table) {
    const rows = [];

    table.groups.forEach((group) => {
      rows.push(`
        <tr>
          <td class="year-cell">${group.label}</td>
          <td>
            <div class="entry-grid">
              ${group.entries
                .map(
                  (entry) => `
                    <a class="entry-chip" href="${buildEntryLink(programKey, table.id, entry.id)}">
                      ${entry.title}
                    </a>
                  `
                )
                .join("")}
            </div>
          </td>
          <td class="credit-cell"></td>
        </tr>
      `);

      rows.push(`
        <tr class="total-row">
          <td>\uD569\uACC4</td>
          <td>${group.label} \uD559\uC810 \uD569\uACC4</td>
          <td>${group.totalCredits || "-"}</td>
        </tr>
      `);
    });

    rows.push(`
      <tr class="total-row">
        <td>\uC804\uCCB4</td>
        <td>\uC804\uCCB4 \uD559\uC810</td>
        <td>${table.overallCredits || "-"}</td>
      </tr>
    `);

    return rows.join("");
  }

  function renderDefaultTableRows(table) {
    const rows = [];

    table.groups.forEach((group) => {
      group.entries.forEach((entry, index) => {
        rows.push(`
          <tr>
            <td class="year-cell">${index === 0 ? group.label : ""}</td>
            <td>
              <a class="table-entry-link" href="${buildEntryLink(programKey, table.id, entry.id)}">
                ${entry.title}
              </a>
              <span class="entry-meta">${entry.summary || ""}</span>
            </td>
            <td class="credit-cell">${entry.summary || "-"}</td>
          </tr>
        `);
      });
    });

    return rows.join("");
  }

  function renderTable(table) {
    const rows = table.showCredits ? renderCreditTableRows(table) : renderDefaultTableRows(table);

    return `
      <section id="table-${table.id}" class="table-card">
        <div class="table-head">
          <p class="eyebrow">${table.id.toUpperCase()}</p>
          <h2>${table.title}</h2>
          <p>${table.description}</p>
        </div>
        <table class="curriculum-table">
          <thead>
            <tr>
              ${table.columns.map((column) => `<th>${column}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </section>
    `;
  }

  sectionHost.innerHTML = program.tables.map(renderTable).join("");
  setFooter();
})();
