/* Praman — Scroll animations & interactions */
(function () {
  "use strict";

  // Intersection Observer for scroll animations
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll("[data-animate]").forEach(function (el) {
    observer.observe(el);
  });

  // Smooth number counter for dashboard stats
  function animateCounter(el, target, duration) {
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  // Animate dashboard bars on visibility
  var dashObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var bars = entry.target.querySelectorAll(".bar");
        bars.forEach(function (bar, i) {
          setTimeout(function () {
            bar.style.height = bar.dataset.height || (Math.random() * 60 + 30) + "%";
          }, i * 80);
        });
        dashObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".dash-chart").forEach(function (chart) {
    dashObserver.observe(chart);
  });

  // Typing effect for AI chat
  function typeText(el, text, speed, callback) {
    var i = 0;
    el.textContent = "";
    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
    type();
  }

  var aiDemo = document.querySelector(".ai-chat-demo");
  if (aiDemo) {
    var aiObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var msgs = aiDemo.querySelectorAll(".ai-chat-msg");
          msgs.forEach(function (msg, i) {
            setTimeout(function () {
              msg.style.opacity = "1";
              msg.style.transform = "translateY(0)";
            }, i * 600);
          });
          aiObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    aiObserver.observe(aiDemo);
  }
})();
