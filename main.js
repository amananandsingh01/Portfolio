// Page behaviour: menu, skills, projects, filters, hero spotlight, contact form
const $ = id => document.getElementById(id);

// Replace missing images with a visible, accessible fallback instead of a broken icon.
function showImageFallback(image, label) {
  image.addEventListener("error", () => {
    const fallback = document.createElement("div");
    fallback.className = "ph";
    fallback.setAttribute("role", "img");
    fallback.setAttribute("aria-label", label);
    fallback.textContent = `🖼️ ${label}`;
    image.replaceWith(fallback);
  }, { once: true });
}

// Mobile menu
const nav = $("nav"), menu = $("menu");
function setMenu(open){
  nav.classList.toggle("open", open);
  menu.setAttribute("aria-expanded", open);
  menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menu.textContent = open ? "✕" : "☰";
}
menu.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.addEventListener("click", e => { if (e.target.tagName === "A") setMenu(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

// Skills + marquee
$("skills").innerHTML = skills.map(s => `<li>${s}</li>`).join("");
$("marquee").innerHTML = skills.map(s => `<span>${s} ✦</span>`).join("").repeat(4);

// Photo
$("photo").innerHTML = PHOTO
  ? `<img src="${PHOTO}" alt="Arpit Anand Singh">`
  : `<div class="ph" role="img" aria-label="Photo placeholder">📷 Add a portrait</div>`;
const photoImage = $("photo").querySelector("img");
if (photoImage) showImageFallback(photoImage, "Portrait unavailable — add a photo to images/me.jpg");

// Projects
const cats = ["All", ...new Set(projects.map(p => p.cat))];
$("grid").innerHTML = projects.map((p, i) => `
  <article class="card c${i % 5}" data-cat="${p.cat}">
    ${p.img
      ? `<img src="${p.img}" alt="${p.title} screenshot" loading="lazy">`
      : `<div class="ph" role="img" aria-label="Screenshot placeholder for ${p.title}">🖼️ Add screenshot<br>${p.title}</div>`}
    <h3>${p.title}</h3><p>${p.desc}</p>
    <ul class="tags">${p.tags.map(t => `<li>${t}</li>`).join("")}</ul>
    <div class="links">${p.live ? `<a href="${p.live}" target="_blank" rel="noopener">Live site</a>` : ""}${p.code ? `<a href="${p.code}" target="_blank" rel="noopener">Code on GitHub</a>` : ""}</div>
  </article>`).join("");
$("grid").querySelectorAll("img").forEach(image => showImageFallback(image, `${image.alt} unavailable`));

$("chips").innerHTML = cats.map((c, i) => `<button class="chip" aria-pressed="${i === 0}" data-c="${c}">${c}</button>`).join("");
$("chips").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  $("chips").querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === b));
  let n = 0;
  $("grid").querySelectorAll(".card").forEach(c => {
    const ok = b.dataset.c === "All" || c.dataset.cat === b.dataset.c;
    c.classList.toggle("hide", !ok); if (ok) n++;
  });
  $("empty").style.display = n ? "none" : "block";
});

// Hero spotlight (mouse, touch and pen)
const heroName = $("name");
function spot(e){
  const r = heroName.getBoundingClientRect();
  heroName.style.setProperty("--x", (e.clientX - r.left) + "px");
  heroName.style.setProperty("--y", (e.clientY - r.top) + "px");
}
heroName.addEventListener("pointermove", spot);
heroName.addEventListener("pointerdown", spot);

// Contact form opens the visitor's email app
$("form").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `${f.get("message")}\n\n– ${f.get("name")} (${f.get("email")})`;
  location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Portfolio message from " + f.get("name"))}&body=${encodeURIComponent(body)}`;
  $("status").textContent = "Opening your email app…";
});

$("yr").textContent = new Date().getFullYear();
