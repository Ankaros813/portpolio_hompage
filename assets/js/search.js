(function () {
  const { params, buildSearchResults, setFooter } = window.SiteApp;

  const search = params();
  const query = (search.get("q") || "").trim();
  const title = document.getElementById("searchTitle");
  const summary = document.getElementById("searchSummary");
  const resultsHost = document.getElementById("searchResults");
  const input = document.getElementById("searchQueryInput");

  if (input) {
    input.value = query;
  }

  if (!query) {
    title.textContent = "Search Results";
    summary.textContent = "Enter a keyword to search across the portfolio.";
    resultsHost.innerHTML = '<div class="empty-state">No keyword entered.</div>';
    setFooter();
    return;
  }

  const results = buildSearchResults(query);
  title.textContent = `"${query}" Results`;
  summary.textContent = `${results.length} page(s) matched.`;

  resultsHost.innerHTML =
    results.length > 0
      ? results
          .map(
            (item) => `
              <article class="search-result-card">
                <a class="search-result-link" href="${item.href}">${item.title}</a>
                <p class="search-result-meta">${item.meta}</p>
              </article>
            `
          )
          .join("")
      : '<div class="empty-state">No matching pages were found.</div>';

  setFooter();
})();
