(function () {
  const { data, setFooter } = window.SiteApp;

  document.title = `${data.site.owner} | ${data.site.title}`;

  const name = document.getElementById("homeName");
  const tagline = document.getElementById("homeTagline");
  const intro = document.getElementById("homeIntro");
  const photo = document.getElementById("profilePhoto");
  const brandSubtitle = document.getElementById("brandSubtitle");
  const educationList = document.getElementById("educationList");
  const linkList = document.getElementById("linkList");
  const projectList = document.getElementById("featuredProjects");
  const homeMetrics = document.getElementById("homeMetrics");
  const mobileProfileSummary = document.getElementById("mobileProfileSummary");
  const homeSideColumn = document.querySelector(".home-side-column");
  const homeMainGrid = document.querySelector(".home-main-grid");
  const relatedLinksCard = document.querySelector(".related-links-card");
  const labInfoCard = document.querySelector(".lab-info-card");
  const academicBackgroundCard = document.querySelector(".academic-background-card");
  const homeOverviewCard = document.querySelector(".home-overview-card");

  name.textContent = data.site.owner;
  tagline.textContent = data.site.tagline;
  intro.textContent = data.site.intro;
  photo.src = data.site.photo;
  brandSubtitle.textContent = data.site.subtitle;

  if (mobileProfileSummary) {
    const contactRows = data.site.links
      .map((item) => {
        const label = item.label || "";
        const value = item.value || "";

        if (label.toLowerCase().includes("email")) {
          const [emailValue, phoneValue] = value.split("|").map((entry) => entry.trim());
          const emailLink = emailValue
            ? `<a class="mobile-contact-link" href="mailto:${emailValue}">${emailValue}</a>`
            : "";
          const phoneLink = phoneValue
            ? `<a class="mobile-contact-link" href="tel:${phoneValue.replace(/\s+/g, "")}">${phoneValue}</a>`
            : "";
          const combinedLinks = [emailLink, phoneLink].filter(Boolean).join(
            '<span class="mobile-contact-separator"> | </span>'
          );

          return `
            <div class="mobile-contact-row">
              <span class="mobile-contact-label">${label}</span>
              <div class="mobile-contact-values">
                ${combinedLinks}
              </div>
            </div>
          `;
        }

        return `
          <div class="mobile-contact-row">
            <span class="mobile-contact-label">${label}</span>
            <div class="mobile-contact-values">
              <a class="mobile-contact-link" href="${value}" target="_blank" rel="noreferrer">${value}</a>
            </div>
          </div>
        `;
      })
      .join("");

    mobileProfileSummary.innerHTML = `
      <div class="mobile-profile-card">
        <div class="mobile-profile-photo-wrap">
          <img class="mobile-profile-photo" src="${data.site.photo}" alt="Profile Photo" />
        </div>
        <div class="mobile-profile-copy">
          <p class="mobile-profile-period">${data.site.subtitle}</p>
          <div class="mobile-contact-list">${contactRows}</div>
        </div>
      </div>
    `;
  }

  function syncMobileLayout() {
    if (!labInfoCard || !homeSideColumn || !homeMainGrid || !homeOverviewCard) {
      return;
    }

    const isMobile =
      window.matchMedia("(max-width: 760px)").matches && !document.body.classList.contains("force-desktop");

    if (isMobile) {
      homeMainGrid.insertBefore(labInfoCard, homeOverviewCard);
      return;
    }

    if (relatedLinksCard && relatedLinksCard.parentElement === homeSideColumn) {
      homeSideColumn.insertBefore(labInfoCard, relatedLinksCard.nextElementSibling);
      return;
    }

    if (academicBackgroundCard && academicBackgroundCard.parentElement === homeMainGrid) {
      homeSideColumn.appendChild(labInfoCard);
    }
  }

  syncMobileLayout();
  window.addEventListener("resize", syncMobileLayout);
  window.addEventListener("site:layout-mode-change", syncMobileLayout);

  educationList.innerHTML = data.home.education
    .map(
      (item) => `
        <article class="timeline-item">
          <strong>${item.title}</strong>
          <span>${item.subtitle}</span>
        </article>
      `
    )
    .join("");

  linkList.innerHTML = data.site.links
    .map(
      (item) => `
        <article class="link-item">
          <a href="${item.value}" target="_blank" rel="noreferrer">${item.label}</a>
          <div class="entry-meta">${item.value}</div>
        </article>
      `
    )
    .join("");

  projectList.innerHTML = data.home.projects
    .map(
      (item) => `
        <article class="feature-item">
          <strong>${item.title}</strong>
          <span>${item.subtitle}</span>
        </article>
      `
    )
    .join("");

  const totalPrograms = Object.keys(data.programs).length;
  const totalTables = Object.values(data.programs).reduce(
    (sum, program) => sum + program.tables.length,
    0
  );
  const totalEntries = Object.values(data.programs).reduce((sum, program) => {
    return (
      sum +
      program.tables.reduce((tableSum, table) => {
        return (
          tableSum +
          table.groups.reduce((groupSum, group) => groupSum + group.entries.length, 0)
        );
      }, 0)
    );
  }, 0);

  homeMetrics.innerHTML = [
    { title: "과정 수", value: `${totalPrograms}개 과정` },
    { title: "표 섹션", value: `${totalTables}개 테이블` },
    { title: "등록 항목", value: `${totalEntries}개 항목` }
  ]
    .map(
      (item) => `
        <article class="metric-item">
          <strong>${item.title}</strong>
          <span>${item.value}</span>
        </article>
      `
    )
    .join("");

  setFooter();
})();
