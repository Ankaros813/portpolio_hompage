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

  name.textContent = data.site.owner;
  tagline.textContent = data.site.tagline;
  intro.textContent = data.site.intro;
  photo.src = data.site.photo;
  brandSubtitle.textContent = data.site.subtitle;

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
