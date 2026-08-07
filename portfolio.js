(function () {
  "use strict";
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var roles = ["Software Developer", "MERN-Stack Developer", "Full-Stack Developer", "Frontend Developer", "Backend Developer"];
  var typeTarget = document.getElementById("typeTarget");
  function typeLoop() {
    if (!typeTarget) return;
    if (prefersReducedMotion) {
      typeTarget.textContent = roles[0];
      return;
    }
    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;
    function tick() {
      var current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typeTarget.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = false;
          setTimeout(function () { deleting = true; tick(); }, 1400);
          return;
        }
      } else {
        charIndex--;
        typeTarget.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      var speed = deleting ? 35 : 65;
      setTimeout(tick, speed);
    }
    tick();
  }
  typeLoop();
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }
  var timeline = document.querySelector(".timeline");
  var timelineFill = document.getElementById("timelineFill");
  function updateTimelineFill() {
    if (!timeline || !timelineFill) return;
    var rect = timeline.getBoundingClientRect();
    var viewportH = window.innerHeight;
    var total = rect.height;
    var visible = viewportH * 0.75 - rect.top;
    var ratio = Math.max(0, Math.min(1, visible / total));
    timelineFill.style.height = (ratio * 100) + "%";
  }
  window.addEventListener("scroll", updateTimelineFill, { passive: true });
  updateTimelineFill();
  var navbar = document.getElementById("navbar");
  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();
  var toTop = document.getElementById("toTop");
  function updateToTop() {
    if (!toTop) return;
    if (window.scrollY > 600) {
      toTop.classList.add("show");
    } else {
      toTop.classList.remove("show");
    }
  }
  window.addEventListener("scroll", updateToTop, { passive: true });
  updateToTop();
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }
  document.querySelectorAll(".chip-row").forEach(function (row) {
    Array.prototype.forEach.call(row.children, function (chip, i) {
      chip.style.transitionDelay = (i * 55) + "ms";
    });
  });
})();
