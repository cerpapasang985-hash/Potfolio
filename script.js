// ========== HELPERS ==========
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ========== THEME TOGGLE ==========
const themeToggle = $("#themeToggle");
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("theme", theme); } catch (e) {}
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) {}
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
});

// ========== MOBILE MENU ==========
const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.textContent = open ? "✕" : "☰";
});

$$(".nav-link").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.textContent = "☰";
  })
);

// ========== TYPING EFFECT ==========
const words = ["Web Developer", "Frontend Builder", "Problem Solver", "Future Freelancer"];
const typedEl = $("#typed");
let wordIndex = 0, charIndex = 0, deleting = false;

function type() {
  const word = words[wordIndex];
  typedEl.textContent = word.substring(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(type, 90);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1500);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(type, 45);
  } else {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, 300);
  }
}
type();

// ========== SCROLL: HEADER, BACK-TO-TOP, ACTIVE LINK ==========
const header = $("#header");
const toTop = $("#toTop");
const sections = $$("main section[id]");
const navAnchors = $$(".nav-link");

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 20);
  toTop.classList.toggle("show", y > 500);

  let current = "home";
  sections.forEach((sec) => {
    if (y >= sec.offsetTop - 140) current = sec.id;
  });
  navAnchors.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`)
  );
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ========== SCROLL REVEAL + SKILL BARS + COUNTERS ==========
function animateCount(el) {
  const target = +el.dataset.count;
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");

      $$(".fill", el).forEach((bar) => (bar.style.width = bar.dataset.width + "%"));
      $$("[data-count]", el).forEach(animateCount);

      observer.unobserve(el);
    });
  },
  { threshold: 0.15 }
);

$$(".reveal").forEach((el) => observer.observe(el));

// ========== CONTACT FORM ==========
const form = $("#contactForm");
const status = $("#formStatus");

function setError(input, message) {
  const field = input.closest(".field");
  field.classList.toggle("invalid", !!message);
  $(".error", field).textContent = message || "";
}

function validate() {
  const name = $("#name");
  const email = $("#email");
  const message = $("#message");
  let ok = true;

  if (name.value.trim().length < 2) { setError(name, "Please enter your name."); ok = false; }
  else setError(name, "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    setError(email, "Please enter a valid email."); ok = false;
  } else setError(email, "");

  if (message.value.trim().length < 10) {
    setError(message, "Message should be at least 10 characters."); ok = false;
  } else setError(message, "");

  return ok;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.textContent = "";
  if (!validate()) return;

  // Opens the visitor's email app with the message filled in.
  // Replace with your own email:
  const myEmail = "your.email@example.com";
  const subject = encodeURIComponent(`Portfolio message from ${$("#name").value.trim()}`);
  const body = encodeURIComponent(
    `${$("#message").value.trim()}\n\nFrom: ${$("#name").value.trim()} (${$("#email").value.trim()})`
  );
  window.location.href = `mailto:${myEmail}?subject=${subject}&body=${body}`;

  status.textContent = "Thanks! Your email app should open now ✅";
  form.reset();
});

// ========== FOOTER YEAR ==========
$("#year").textContent = new Date().getFullYear();
