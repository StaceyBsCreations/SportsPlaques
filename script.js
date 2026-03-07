/* script.js
   Main logic:
   - Populates active dropdowns from options.js
   - Updates summary
   - Email + copy order
   - Renders two example galleries from examples.js
*/

(function () {
  const OPT = window.OPTIONS || {};
  const LARGE = window.LARGE_PLAQUES || [];
  const SMALL = window.SMALL_PLAQUES || [];

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

  function normalizeFileName(file) {
    return safe(file).toLowerCase();
  }

  function exampleScaleClass(file) {
    const name = normalizeFileName(file);

    if (name.includes("female volleyball")) return "scale-up-md";
    if (name.includes("female softball")) return "scale-up-md";
    if (name.includes("male baseball")) return "scale-up-sm";
    if (name.includes("male football")) return "scale-down-sm";

    return "";
  }

  function fillSelect(id, items, placeholder = "Select...") {
    const el = $(id);
    if (!el) return;

    el.innerHTML = "";

    const opt0 = document.createElement("option");
    opt0.value = "";
    opt0.textContent = placeholder;
    el.appendChild(opt0);

    (items || []).forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      el.appendChild(opt);
    });
  }

  function shortProduct(productType) {
    if (!productType) return "";
    if (/^large plaque$/i.test(productType)) return "Large";
    if (/^small plaque$/i.test(productType)) return "Small";
    return productType.split(" ")[0] || "";
  }

  function shortTemplate(template) {
    if (!template) return "";
    return template.split(":")[0] || template;
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
      day: "numeric",
    });
  }

  function sku() {
    const productType = val("productType");
    const sport = val("sport");
    const template = val("template");
    const athlete = val("athleteName");
    const number = val("athleteNumber");

    const parts = [
      shortProduct(productType),
      sport,
      shortTemplate(template),
      athleteSlug(athlete),
      number,
    ].filter(Boolean);

    return parts.length ? parts.join("-") : "—";
  }

  function combinedUniformColors() {
    const primary = val("uniformPrimary");
    const accent = val("uniformAccent");

    if (!primary && !accent) return "—";
    if (primary && accent) return `${primary} / ${accent}`;
    return primary || accent || "—";
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
    setText("sumBackground", val("background") || "—");

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
    lines.push(`Athlete Name: ${val("athleteName")}`);
    lines.push(`Athlete Number: ${val("athleteNumber")}`);
    lines.push(`School / Team Name: ${val("schoolName")}`);
    lines.push(`Year Of Participation: ${val("year")}`);
    lines.push("");

    lines.push("UNIFORM STYLE & COLORS");
    lines.push(`Uniform Primary Color: ${val("uniformPrimary")}`);
    lines.push(`Uniform Accent Color: ${val("uniformAccent")}`);
    lines.push(`Number Color: ${val("numberColor")}`);
    lines.push(`Background Finish: ${val("background")}`);
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
    lines.push("IMPORTANT");
    lines.push("Please manually attach your photo or sports card image to this email before sending.");
    lines.push("");

    lines.push("NOTES & DELIVERY");
    lines.push(`Needed By: ${formattedNeededBy()}`);
    lines.push(`Delivery Method: ${val("delivery")}`);
    lines.push(`Notes: ${val("notes")}`);

    return lines.join("\n");
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard.");
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Copied to clipboard.");
    }
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
      "customerName",
      "customerPhone",
      "customerEmail",
      "productType",
      "sport",
      "template",
      "baseLayerText",
      "athleteName",
      "athleteNumber",
      "schoolName",
      "year",
      "uniformPrimary",
      "uniformAccent",
      "numberColor",
      "background",
      "position",
      "grade",
      "logoCircle",
      "customStats",
      "photoWindow",
      "photoNotes",
      "neededBy",
      "delivery",
      "notes",
    ];

    ids.forEach((id) => {
      const el = $(id);
      if (!el) return;
      el.value = "";
    });

    refreshAll();
  }

  function openZoom(title, src) {
    const modal = $("zoomModal");
    const img = $("zoomImg");
    const t = $("zoomTitle");

    if (!modal || !img || !t) return;

    t.textContent = title || "Example";
    img.src = src;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeZoom() {
    const modal = $("zoomModal");
    const img = $("zoomImg");

    if (!modal) return;

    modal.setAttribute("aria-hidden", "true");
    if (img) img.removeAttribute("src");
    document.body.style.overflow = "";
  }

  function displayTitleFromFilename(file) {
    const raw = safe(file).replace(/\.(png|jpg|jpeg|webp)$/i, "");

    return raw
      .replace(/Cheerleading/gi, "Cheer")
      .replace(/\s+Jersey$/i, "")
      .trim();
  }

  function renderExampleSection(gridId, emptyId, files) {
    const grid = $(gridId);
    const empty = $(emptyId);

    if (!grid) return;

    grid.innerHTML = "";

    if (!Array.isArray(files) || files.length === 0) {
      if (empty) empty.style.display = "block";
      return;
    }

    if (empty) empty.style.display = "none";

    let anyLoaded = false;
    let loadCount = 0;

    files.forEach((file) => {
      const title = displayTitleFromFilename(file);
      const src = `./examples/${encodeURI(file)}`;
      const scaleClass = exampleScaleClass(file);

      const card = document.createElement("div");
      card.className = "gallery-card";
      card.tabIndex = 0;

      const wrap = document.createElement("div");
      wrap.className = "gallery-imgwrap";

      const img = document.createElement("img");
      img.alt = title;
      img.src = src;

      if (scaleClass) {
        img.classList.add(scaleClass);
      }

      img.onload = () => {
        anyLoaded = true;
        loadCount += 1;
        if (loadCount === files.length && empty) {
          empty.style.display = anyLoaded ? "none" : "block";
        }
      };

      img.onerror = () => {
        card.style.display = "none";
        loadCount += 1;
        if (loadCount === files.length && empty) {
          empty.style.display = anyLoaded ? "none" : "block";
        }
      };

      wrap.appendChild(img);

      const cap = document.createElement("div");
      cap.className = "gallery-cap";
      cap.textContent = title;

      card.appendChild(wrap);
      card.appendChild(cap);

      card.addEventListener("click", () => openZoom(title, src));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openZoom(title, src);
        }
      });

      grid.appendChild(card);
    });
  }

  function init() {
    const y = new Date().getFullYear();
    const yearNow = $("yearNow");
    if (yearNow) yearNow.textContent = y.toString();

    fillSelect("productType", OPT.productTypes || []);
    fillSelect("sport", OPT.sports || []);
    fillSelect("template", OPT.templates || []);
    fillSelect("logoCircle", OPT.logoCircle || []);
    fillSelect("photoWindow", OPT.photoWindow || []);
    fillSelect("delivery", OPT.delivery || []);

    bindInputs([
      "customerName",
      "customerPhone",
      "customerEmail",
      "productType",
      "sport",
      "template",
      "baseLayerText",
      "athleteName",
      "athleteNumber",
      "schoolName",
      "year",
      "uniformPrimary",
      "uniformAccent",
      "numberColor",
      "background",
      "position",
      "grade",
      "logoCircle",
      "customStats",
      "photoWindow",
      "photoNotes",
      "neededBy",
      "delivery",
      "notes",
    ]);

    const btnEmail = $("btnEmail");
    const btnCopy = $("btnCopy");
    const btnReset = $("btnReset");

    if (btnEmail) btnEmail.addEventListener("click", () => emailOrder());
    if (btnCopy) {
      btnCopy.addEventListener("click", async () => {
        await copyToClipboard(buildOrderText());
      });
    }
    if (btnReset) btnReset.addEventListener("click", () => resetForm());

    const closeBtn = $("zoomClose");
    const backdrop = $("zoomBackdrop");

    if (closeBtn) closeBtn.addEventListener("click", closeZoom);
    if (backdrop) backdrop.addEventListener("click", closeZoom);

    document.addEventListener("keydown", (e) => {
      const modal = $("zoomModal");
      if (e.key === "Escape" && modal && modal.getAttribute("aria-hidden") === "false") {
        closeZoom();
      }
    });

    renderExampleSection("largeExamplesGrid", "largeExamplesEmpty", LARGE);
    renderExampleSection("smallExamplesGrid", "smallExamplesEmpty", SMALL);

    refreshAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();