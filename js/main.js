/* Praman — shared site scripts */
(function () {
  "use strict";

  /* =================================================================
     FORM PROVIDER SETUP
     1. Get a free access key at https://web3forms.com (no account needed —
        enter the email where you want leads delivered; they email you a key).
     2. Paste it below, replacing YOUR-ACCESS-KEY-HERE.
     Until a real key is set, forms validate and show a confirmation but do
     NOT send anything (so the site still works locally).
     ================================================================= */
  var FORM_ACCESS_KEY = "YOUR-ACCESS-KEY-HERE";

  // Shared submit helper. Returns Promise that resolves to true | false | "demo".
  window.pramanSubmit = function (payload) {
    if (!FORM_ACCESS_KEY || FORM_ACCESS_KEY === "YOUR-ACCESS-KEY-HERE") {
      return Promise.resolve("demo");
    }
    return fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(Object.assign({ access_key: FORM_ACCESS_KEY }, payload))
    }).then(function (r) { return r.json(); })
      .then(function (d) { return !!(d && d.success); });
  };

  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }
  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function setNote(el, kind, msg) { el.className = "form-note " + kind + " show"; el.textContent = msg; }

  /* ---- mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- current year in footer ---- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- contact form ---- */
  var form = document.getElementById("contactForm");
  if (form) {
    var note = document.getElementById("formNote");
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = val("cf-name"), email = val("cf-email"), service = val("cf-service");
      if (!name || !validEmail(email) || !service) {
        setNote(note, "err", "Please add your name, a valid email, and the service you're interested in.");
        return;
      }
      var original = btn.textContent; btn.disabled = true; btn.textContent = "Sending…";
      window.pramanSubmit({
        subject: "New enquiry from the Praman website",
        from_name: name, email: email,
        company: val("cf-company"), phone: val("cf-phone"),
        service: service, message: val("cf-message")
      }).then(function (res) {
        if (res === false) {
          setNote(note, "err", "Something went wrong sending your enquiry. Please email us directly.");
        } else {
          setNote(note, "ok", "Thanks, " + name.split(" ")[0] + " — your enquiry about " + service +
            " has been received. We'll reply within one business day.");
          form.reset();
        }
      }).catch(function () {
        setNote(note, "err", "Network error — please email us directly.");
      }).then(function () { btn.disabled = false; btn.textContent = original; });
    });
  }

  /* ---- prefill service on contact page from ?service= ---- */
  var pre = new URLSearchParams(window.location.search).get("service");
  var select = document.getElementById("cf-service");
  if (pre && select) {
    Array.prototype.forEach.call(select.options, function (o) {
      if (o.value.toLowerCase() === pre.toLowerCase()) o.selected = true;
    });
  }
})();
