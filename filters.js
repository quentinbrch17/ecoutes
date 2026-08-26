const STYLE_GROUPS = {
  chanson: {
    label: "Chanson",
    tags: ["chanson"],
  },
  "soul-funk": {
    label: "Soul, funk & groove",
    tags: ["soul", "funk"],
  },
  "rock-psyche-prog": {
    label: "Rock, psyché & prog",
    tags: ["rock", "psychedelic", "progressive"],
  },
  jazz: {
    label: "Jazz",
    tags: ["jazz"],
  },
  folk: {
    label: "Folk & songwriting",
    tags: ["folk"],
  },
  pop: {
    label: "Pop",
    tags: ["pop"],
  },
  bossa: {
    label: "Bossa & Brésil",
    tags: ["bossa"],
  },
  soundtrack: {
    label: "BO & cinéma",
    tags: ["soundtrack"],
  },
};

const albums = Array.from(document.querySelectorAll(".item")).map((element) => ({
  element,
  tags: new Set(element.dataset.styleTags.trim().split(/\s+/)),
  decade: element.dataset.decade,
  rating: Number(element.dataset.rating),
}));

const styleFilter = document.querySelector("#style-filter");
const decadeFilter = document.querySelector("#decade-filter");
const ratingFilter = document.querySelector("#rating-filter");
const albumCount = document.querySelector("#album-count");
const resetButton = document.querySelector("#reset-filters");
const noResults = document.querySelector("#no-results");

function addOption(select, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.append(option);
}

function populateStyleOptions() {
  Object.entries(STYLE_GROUPS).forEach(([value, group]) => {
    addOption(styleFilter, value, group.label);
  });
}

function populateDecadeOptions() {
  const decades = [...new Set(albums.map((album) => album.decade))]
    .sort((a, b) => Number(a) - Number(b));

  decades.forEach((decade) => addOption(decadeFilter, decade, decade));
}

function matchesStyle(album, selectedStyle) {
  if (!selectedStyle) return true;

  const group = STYLE_GROUPS[selectedStyle];
  return group.tags.some((tag) => album.tags.has(tag));
}

function matchesRating(album, selectedRating) {
  if (!selectedRating) return true;
  if (selectedRating === "under-6") return album.rating < 6;

  return album.rating >= Number(selectedRating);
}

function getFilters() {
  return {
    style: styleFilter.value,
    decade: decadeFilter.value,
    rating: ratingFilter.value,
  };
}

function updateUrl(filters) {
  const url = new URL(window.location.href);

  Object.entries(filters).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  });

  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function applyFilters({ syncUrl = true } = {}) {
  const filters = getFilters();
  let visibleCount = 0;

  albums.forEach((album) => {
    const matches = matchesStyle(album, filters.style)
      && (!filters.decade || album.decade === filters.decade)
      && matchesRating(album, filters.rating);

    album.element.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  albumCount.textContent = `${visibleCount} album${visibleCount === 1 ? "" : "s"}`;
  noResults.hidden = visibleCount !== 0;
  resetButton.hidden = !Object.values(filters).some(Boolean);

  if (syncUrl) updateUrl(filters);
}

function hasOption(select, value) {
  return Array.from(select.options).some((option) => option.value === value);
}

function restoreFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const style = params.get("style") || "";
  const decade = params.get("decade") || "";
  const rating = params.get("rating") || "";

  styleFilter.value = hasOption(styleFilter, style) ? style : "";
  decadeFilter.value = hasOption(decadeFilter, decade) ? decade : "";
  ratingFilter.value = hasOption(ratingFilter, rating) ? rating : "";
}

populateStyleOptions();
populateDecadeOptions();
restoreFiltersFromUrl();
applyFilters();

[styleFilter, decadeFilter, ratingFilter].forEach((filter) => {
  filter.addEventListener("change", () => applyFilters());
});

resetButton.addEventListener("click", () => {
  styleFilter.value = "";
  decadeFilter.value = "";
  ratingFilter.value = "";
  applyFilters();
  styleFilter.focus();
});

window.addEventListener("popstate", () => {
  restoreFiltersFromUrl();
  applyFilters({ syncUrl: false });
});
