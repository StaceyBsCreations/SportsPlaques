/* gallery.js
   Renders example images from window.EXAMPLES into #galleryGrid
   Click any example to open a zoom modal (lightbox).
*/

(function () {
  function $(id) { return document.getElementById(id); }

  function titleFromFilename(filename) {
    return (filename || "")
      .replace(/\.(png|jpg|jpeg|webp)$/i, "")
      .replace(/[_-]+/g, " ")
      .trim();
  }

  function buildUrl(filename) {
    // Use encodeURI to preserve spaces safely (HTTP server handles this correctly)
    return encodeURI(`./examples/${filename}`);
  }

  function openLightbox(src, caption) {
    const lb = $("lightbox");
    const img = $("lightboxImg");
    const cap = $("lightboxCap");
    if (!lb || !img || !cap) return;

    img.src = src;
    cap.textContent = caption || "";
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    const lb = $("lightbox");
    const img = $("lightboxImg");
    if (!lb || !img) return;

    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    img.removeAttribute("src");
  }

  function wireLightbox() {
    const lb = $("lightbox");
    if (!lb) return;

    lb.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-close") === "1") closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  function renderGallery() {
    const grid = $("galleryGrid");
    const empty = $("galleryEmpty");
    const list = (window.EXAMPLES || []).slice();

    if (!grid || !empty) return;

    grid.innerHTML = "";

    if (!list.length) {
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";

    list.forEach((filename) => {
      const card = document.createElement("div");
      card.className = "gallery-card";

      const wrap = document.createElement("div");
      wrap.className = "gallery-imgwrap";

      const img = document.createElement("img");
      img.alt = titleFromFilename(filename);
      img.loading = "lazy";
      img.src = buildUrl(filename);

      const cap = document.createElement("div");
      cap.className = "gallery-cap";
      cap.textContent = img.alt;

      wrap.appendChild(img);
      card.appendChild(wrap);
      card.appendChild(cap);

      card.addEventListener("click", () => {
        openLightbox(buildUrl(filename), img.alt);
      });

      grid.appendChild(card);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireLightbox();
    renderGallery();
  });
})();