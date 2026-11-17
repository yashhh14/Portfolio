(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var roles = ["Software Developer", "Full-Stack Developer", "MERN-Stack Developer","Backend Developer"];
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

  var revealTargets = document.querySelectorAll(".reveal, .timeline-item, .skill-card");

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
  // ---- Floating Particle Network Background ----
  var canvas = document.getElementById("particle-network");

  if (canvas) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var mouse = { x: null, y: null };
    var width = 0;
    var height = 0;
    var animationId = null;
    var lastFrame = 0;
    var frameInterval = 1000 / 30;

    var particleColor = "94, 234, 212";
    var connectionDistance = 125;

    function createParticles() {
      particles = [];

      var count = Math.min(
        110,
        Math.max(35, Math.floor((width * height) / 11000))
      );

      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.5 + 1
        });
      }
    }

    function resizeCanvas() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createParticles();
      drawParticles();
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw connections between nearby particles
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            var opacity = (1 - distance / connectionDistance) * 0.35;

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "rgba(" + particleColor + "," + opacity + ")";
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw the floating particles
      particles.forEach(function (particle) {
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = "rgba(94, 234, 212, 0.75)";
        ctx.fill();
      });
    }

    function updateParticles() {
      particles.forEach(function (particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce particles at screen edges
        if (particle.x < 0 || particle.x > width) {
          particle.vx *= -1;
        }

        if (particle.y < 0 || particle.y > height) {
          particle.vy *= -1;
        }

        // Gently repel particles from the cursor
        if (mouse.x !== null && mouse.y !== null) {
          var dx = particle.x - mouse.x;
          var dy = particle.y - mouse.y;
          var distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100 && distance > 0) {
            var force = (100 - distance) / 100;

            particle.x += (dx / distance) * force * 1.5;
            particle.y += (dy / distance) * force * 1.5;
          }
        }
      });
    }

    function animateParticles(timestamp) {
      if (document.hidden) {
        animationId = null;
        return;
      }

      if (timestamp - lastFrame >= frameInterval) {
        lastFrame = timestamp;
        updateParticles();
        drawParticles();
      }

      animationId = requestAnimationFrame(animateParticles);
    }

    function startParticleAnimation() {
      if (prefersReducedMotion || document.hidden || animationId !== null) {
        return;
      }

      animationId = requestAnimationFrame(animateParticles);
    }

    function stopParticleAnimation() {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("pointermove", function (event) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    });

    window.addEventListener("pointerleave", function () {
      mouse.x = null;
      mouse.y = null;
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopParticleAnimation();
      } else {
        startParticleAnimation();
      }
    });

    resizeCanvas();

    if (!prefersReducedMotion) {
      startParticleAnimation();
    }
  }
})();
