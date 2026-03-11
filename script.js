/* script.js
   Main logic:
   - Populates active dropdowns from options.js
   - Updates summary
   - Email order
   - Renders example galleries
   - Zoom modal
   - Light/Dark theme toggle
*/

(function () {
  const OPT = window.OPTIONS || {};
  const LARGE = window.LARGE_PLAQUES || [];
  const SMALL = window.SMALL_PLAQUES || [];

  const FRAME_FINISHES = [
    "Natural",
    "Jacobean",
    "Burnt Umber",
    "Black"
  ];

  const THEME_STORAGE_KEY = "staceybs-theme";

  function $(id) {
    return document.getElementById(id);
  }

  function val(id) {
    const el = $(id);
    if (!el) return "";
    return (el.value || "").toString().trim();
  }

  function setText(id, text) {
    const el = $(id);
    if (el) el.textContent = text;
  }

  function safe(s) {
    return (s || "").toString().trim();
  }

  function fillSelect(id, items, placeholder = "Select...") {
    const el = $(id);
    if (!el) return;

    el.innerHTML = "";

    const first = document.createElement("option");
    first.value = "";
    first.textContent = placeholder;
    el.appendChild(first);

    (items || []).forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      el.appendChild(opt);
    });
  }

  function shortProduct(productType) {
    if (!productType) return "";
    if (/large/i.test(productType)) return "Large";
    if (/small/i.test(productType)) return "Small";
    return productType;
  }

  function shortTemplate(template) {
    if (!template) return "";
    return template.split(":")[0].trim();
  }

  function athleteSlug(name) {
    return safe(name).replace(/\s+/g, "").slice(0, 10);
  }

  function formattedNeededBy() {
    const raw = val("neededBy");

    if (!raw) return "—";

    const d = new Date(`${raw}T00:00:00`);

    if (Number.isNaN(d.getTime())) return raw;

    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function sku() {
    const parts = [
      shortProduct(val("productType")),
      val("sport"),
      shortTemplate(val("template")),
      athleteSlug(val("athleteName")),
      val("athleteNumber")
    ].filter(Boolean);

    return parts.length ? parts.join("-") : "—";
  }

  function combinedUniformColors() {
    const primary = val("uniformPrimary");
    const accent = val("uniformAccent");

    if (!primary && !accent) return "—";
    if (primary && accent) return `${primary} / ${accent}`;

    return primary || accent;
  }

  function updateSummary() {
    setText("sumCustomer", val("customerName") || "—");
    setText("sumPhone", val("customerPhone") || "—");
    setText("sumEmail", val("customerEmail") || "—");

    setText("sumProduct", val("productType") || "—");
    setText("sumSport", val("sport") || "—");
    setText("sumTemplate", val("template") || "—");
    setText("sumBaseLayerText", val("baseLayerText") || "—");

    setText("sumAthlete", val("athleteName") || "—");
    setText("sumNumber", val("athleteNumber") || "—");
    setText("sumSchool", val("schoolName") || "—");
    setText("sumYear", val("year") || "—");

    setText("sumUniformColors", combinedUniformColors());
    setText("sumNumberColor", val("numberColor") || "—");
    setText("sumFrameFinish", val("frameFinish") || "—");

    setText("sumPosition", val("position") || "—");
    setText("sumGrade", val("grade") || "—");
    setText("sumLogoCircle", val("logoCircle") || "—");

    setText("sumPhotoWindow", val("photoWindow") || "—");
    setText("sumDelivery", val("delivery") || "—");
    setText("sumNeededBy", formattedNeededBy());

    setText("sumSku", `SKU: ${sku()}`);
  }

  function refreshAll() {
    updateSummary();
  }

  function bindInputs(ids) {
    ids.forEach((id) => {
      const el = $(id);
      if (!el) return;

      el.addEventListener("input", refreshAll);
      el.addEventListener("change", refreshAll);
    });
  }

  function buildOrderText() {
    const lines = [];

    lines.push("STACEY B’S CREATIONS — ORDER DETAILS");
    lines.push(`SKU: ${sku()}`);
    lines.push("");

    lines.push("CONTACT");
    lines.push(`Customer Name: ${val("customerName")}`);
    lines.push(`Phone Number: ${val("customerPhone")}`);
    lines.push(`Customer Email: ${val("customerEmail")}`);
    lines.push("");

    lines.push("PRODUCT, SPORT & STYLES");
    lines.push(`Product Type: ${val("productType")}`);
    lines.push(`Sport: ${val("sport")}`);
    lines.push(`Template Style: ${val("template")}`);
    lines.push(`Base Layer Color: ${val("baseLayerText")}`);
    lines.push("");

    lines.push("ATHLETE & TEAM DETAILS");
    lines.push(`Athlete Name For Back Of Jersey: ${val("athleteName")}`);
    lines.push(`Athlete Number: ${val("athleteNumber")}`);
    lines.push(`School / Team Name: ${val("schoolName")}`);
    lines.push(`Year Of Participation: ${val("year")}`);
    lines.push("");

    lines.push("UNIFORM STYLE & COLORS");
    lines.push(`Uniform Primary Color: ${val("uniformPrimary")}`);
    lines.push(`Uniform Accent Color: ${val("uniformAccent")}`);
    lines.push(`Number Color: ${val("numberColor")}`);
    lines.push(`Frame Finish: ${val("frameFinish")}`);
    lines.push("");

    lines.push("CUSTOM BADGE DETAILS");
    lines.push(`Position Played: ${val("position")}`);
    lines.push(`Grade Level: ${val("grade")}`);
    lines.push(`Include Team Logo Circle: ${val("logoCircle")}`);

    if (val("customStats")) {
      lines.push(`Custom Stats: ${val("customStats")}`);
    }

    lines.push("");

    lines.push("PHOTO / CARD INSERT");
    lines.push(`Photo Window: ${val("photoWindow")}`);
    lines.push(`Photo Notes: ${val("photoNotes")}`);
    lines.push("");

    lines.push("NOTES & DELIVERY");
    lines.push(`Needed By: ${formattedNeededBy()}`);
    lines.push(`Delivery Method: ${val("delivery")}`);
    lines.push(`Notes: ${val("notes")}`);

    return lines.join("\n");
  }

  function emailOrder() {
    const to = "staceybscreations@gmail.com";
    const subject = `Stacey B’s Creations Order — ${sku()}`;
    const body = buildOrderText();

    const href =
      `mailto:${encodeURIComponent(to)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = href;
  }

  function resetForm() {
    const ids = [
      "customerName", "customerPhone", "customerEmail",
      "productType", "sport", "template", "baseLayerText",
      "athleteName", "athleteNumber", "schoolName", "year",
      "uniformPrimary", "uniformAccent", "numberColor", "frameFinish",
      "position", "grade", "logoCircle", "customStats",
      "photoWindow", "photoNotes", "neededBy", "delivery", "notes"
    ];

    ids.forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.value = "";
    });

    refreshAll();
  }

  function applyTheme(theme) {
    const normalized = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", normalized);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, normalized);
    } catch (e) {
      // no-op
    }
  }

  function getSavedTheme() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return stored === "light" ? "light" : "dark";
    } catch (e) {
      return "dark";
    }
  }

  function displayTitleFromFilename(filename) {
    if (!filename) return "Plaque Example";

    const clean = filename
      .split("/")
      .pop()
      .replace(/\.[^.]+$/, "")
      .replace(/%20/g, " ")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return clean || "Plaque Example";
  }

  function openZoom(src, title) {
    const modal = $("zoomModal");
    const img = $("zoomImg");
    const titleEl = $("zoomTitle");

    if (!modal || !img || !titleEl) return;

    img.src = src;
    img.alt = title || "Zoomed example";
    titleEl.textContent = title || "Example";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeZoom() {
    const modal = $("zoomModal");
    const img = $("zoomImg");

    if (!modal || !img) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    img.src = "";
    img.alt = "Zoomed example";
    document.body.classList.remove("modal-open");
  }

  function createGalleryCard(filename) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gallery-card";
    card.setAttribute("aria-label", `Open ${displayTitleFromFilename(filename)}`);

    const img = document.createElement("img");
    img.className = "gallery-img";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = `./examples/${filename}`;
    img.alt = displayTitleFromFilename(filename);

    const cap = document.createElement("div");
    cap.className = "gallery-cap";
    cap.textContent = displayTitleFromFilename(filename);

    card.appendChild(img);
    card.appendChild(cap);

    card.addEventListener("click", () => {
      openZoom(img.src, cap.textContent);
    });

    return card;
  }

  function renderExampleSection(items, gridId, emptyId) {
    const grid = $(gridId);
    const empty = $(emptyId);

    if (!grid) return;

    grid.innerHTML = "";

    const validItems = (items || [])
      .map((item) => (item || "").toString().trim())
      .filter(Boolean);

    if (!validItems.length) {
      if (empty) empty.style.display = "block";
      return;
    }

    if (empty) empty.style.display = "none";

    validItems.forEach((filename) => {
      const card = createGalleryCard(filename);
      grid.appendChild(card);
    });
  }

  function initZoomModal() {
    const closeBtn = $("zoomClose");
    const backdrop = $("zoomBackdrop");
    const modal = $("zoomModal");

    if (closeBtn) {
      closeBtn.addEventListener("click", closeZoom);
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeZoom);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeZoom();
      }
    });

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeZoom();
        }
      });
    }
  }

  function init() {
    fillSelect("productType", OPT.productTypes || []);
    fillSelect("sport", OPT.sports || []);
    fillSelect("template", OPT.templates || []);
    fillSelect("logoCircle", OPT.logoCircle || []);
    fillSelect("photoWindow", OPT.photoWindow || [], "Select...");
    fillSelect("delivery", OPT.delivery || []);
    fillSelect("frameFinish", FRAME_FINISHES);

    bindInputs([
      "customerName", "customerPhone", "customerEmail",
      "productType", "sport", "template", "baseLayerText",
      "athleteName", "athleteNumber", "schoolName", "year",
      "uniformPrimary", "uniformAccent", "numberColor", "frameFinish",
      "position", "grade", "logoCircle", "customStats",
      "photoWindow", "photoNotes", "neededBy", "delivery", "notes"
    ]);

    const btnEmail = $("btnEmail");
    const btnReset = $("btnReset");

    if (btnEmail) btnEmail.addEventListener("click", emailOrder);
    if (btnReset) btnReset.addEventListener("click", resetForm);

    const themeSelect = $("themeSelect");

    if (themeSelect) {
      themeSelect.value = getSavedTheme();

      themeSelect.addEventListener("change", (e) => {
        applyTheme(e.target.value);
      });
    }

    applyTheme(getSavedTheme());

    renderExampleSection(LARGE, "largeExamplesGrid", "largeExamplesEmpty");
    renderExampleSection(SMALL, "smallExamplesGrid", "smallExamplesEmpty");
    initZoomModal();

    const yearNow = $("yearNow");
    if (yearNow) {
      yearNow.textContent = String(new Date().getFullYear());
    }

    refreshAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();