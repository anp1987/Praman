/* Praman — Cookie Consent Banner
   GDPR/DPDP compliant cookie consent with granular controls.
   - No cookies are set before user consent (except strictly necessary)
   - Consent state stored in localStorage (not a cookie itself)
   - Respects user choices; re-askable via footer link
   - CSP-safe: no inline event handlers
*/
(function () {
  "use strict";

  var STORAGE_KEY = "praman_cookie_consent";
  var CONSENT_VERSION = 1; // bump to re-ask consent after policy change

  // Cookie categories
  var CATEGORIES = {
    necessary: { label: "Strictly Necessary", description: "Required for the site to function. Cannot be disabled.", locked: true },
    analytics: { label: "Analytics", description: "Help us understand how visitors use our site so we can improve it." },
    marketing: { label: "Marketing", description: "Used to deliver relevant content and measure campaign effectiveness." }
  };

  function getConsent() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      var parsed = JSON.parse(stored);
      if (parsed.version !== CONSENT_VERSION) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(choices) {
    var data = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      choices: choices
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* storage full or blocked — degrade gracefully */ }
  }

  function applyConsent(choices) {
    // Dispatch custom event so other scripts can react
    var event;
    try {
      event = new CustomEvent("praman:consent", { detail: choices });
    } catch (e) {
      event = document.createEvent("CustomEvent");
      event.initCustomEvent("praman:consent", true, true, choices);
    }
    document.dispatchEvent(event);

    // If analytics accepted, you'd load analytics here:
    // if (choices.analytics) { loadAnalytics(); }
    // If marketing accepted:
    // if (choices.marketing) { loadMarketing(); }
  }

  function createBanner() {
    var banner = document.createElement("div");
    banner.id = "cookie-banner";
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie consent");
    banner.setAttribute("aria-describedby", "cookie-desc");

    banner.innerHTML = '\
<div class="cookie-inner">\
  <div class="cookie-text">\
    <h3>We value your privacy</h3>\
    <p id="cookie-desc">We use cookies to enhance your experience. Strictly necessary cookies are always active. You can choose to accept or manage optional cookies. Read our <a href="privacy.html">Privacy Policy</a> for details.</p>\
  </div>\
  <div class="cookie-actions">\
    <button type="button" class="btn btn-primary" id="cookie-accept-all">Accept All</button>\
    <button type="button" class="btn btn-outline" id="cookie-reject-optional">Reject Optional</button>\
    <button type="button" class="btn btn-ghost" id="cookie-manage">Manage Preferences</button>\
  </div>\
  <div class="cookie-manage-panel is-hidden" id="cookie-panel">\
    <div class="cookie-category">\
      <label class="cookie-toggle">\
        <input type="checkbox" checked disabled>\
        <span class="cookie-toggle-label"><strong>Strictly Necessary</strong></span>\
      </label>\
      <p>Required for the site to function. Cannot be disabled.</p>\
    </div>\
    <div class="cookie-category">\
      <label class="cookie-toggle">\
        <input type="checkbox" id="cookie-cat-analytics">\
        <span class="cookie-toggle-label"><strong>Analytics</strong></span>\
      </label>\
      <p>Help us understand how visitors use our site so we can improve it.</p>\
    </div>\
    <div class="cookie-category">\
      <label class="cookie-toggle">\
        <input type="checkbox" id="cookie-cat-marketing">\
        <span class="cookie-toggle-label"><strong>Marketing</strong></span>\
      </label>\
      <p>Used to deliver relevant content and measure campaign effectiveness.</p>\
    </div>\
    <button type="button" class="btn btn-primary" id="cookie-save-prefs">Save Preferences</button>\
  </div>\
</div>';

    document.body.appendChild(banner);

    // Event listeners (no inline handlers for CSP compliance)
    document.getElementById("cookie-accept-all").addEventListener("click", function () {
      var choices = { necessary: true, analytics: true, marketing: true };
      saveConsent(choices);
      applyConsent(choices);
      closeBanner();
    });

    document.getElementById("cookie-reject-optional").addEventListener("click", function () {
      var choices = { necessary: true, analytics: false, marketing: false };
      saveConsent(choices);
      applyConsent(choices);
      closeBanner();
    });

    document.getElementById("cookie-manage").addEventListener("click", function () {
      var panel = document.getElementById("cookie-panel");
      panel.classList.toggle("is-hidden");
    });

    document.getElementById("cookie-save-prefs").addEventListener("click", function () {
      var choices = {
        necessary: true,
        analytics: !!document.getElementById("cookie-cat-analytics").checked,
        marketing: !!document.getElementById("cookie-cat-marketing").checked
      };
      saveConsent(choices);
      applyConsent(choices);
      closeBanner();
    });
  }

  function closeBanner() {
    var banner = document.getElementById("cookie-banner");
    if (banner) {
      banner.classList.add("cookie-banner--hidden");
      setTimeout(function () { banner.remove(); }, 400);
    }
  }

  // Expose reset function for "Manage cookies" footer link
  window.pramanResetCookieConsent = function () {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    // Remove existing banner if any
    var existing = document.getElementById("cookie-banner");
    if (existing) existing.remove();
    createBanner();
  };

  // Initialize
  var consent = getConsent();
  if (consent) {
    // User already consented — apply silently
    applyConsent(consent.choices);
  } else {
    // No consent yet — show banner
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", createBanner);
    } else {
      createBanner();
    }
  }
})();
