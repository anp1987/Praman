/* Praman — Shared components (header, footer, nav)
   Enterprise Trust Platform */
(function () {
  "use strict";

  var path = window.location.pathname.split("/").pop() || "index.html";

  function navLink(href, label) {
    var isActive = (href === path);
    var cls = isActive ? ' class="active"' : "";
    return '<a href="' + href + '"' + cls + ">" + label + "</a>";
  }

  var headerHTML = '\
<header class="site-header">\
  <div class="container nav">\
    <a href="index.html" class="brand" aria-label="Praman home">\
      <svg class="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">\
        <rect width="32" height="32" rx="8" fill="url(#brandGrad)"/>\
        <path d="M16 7l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5l7-3z" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" fill="rgba(255,255,255,0.1)"/>\
        <path d="M12.5 15l2.5 2.5L19.5 13" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>\
        <defs><linearGradient id="brandGrad" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#6366f1"/><stop offset="1" stop-color="#4f46e5"/></linearGradient></defs>\
      </svg>\
      <span>Praman</span>\
    </a>\
    <nav class="nav-links" id="navMenu" aria-label="Primary">\
      ' + navLink("index.html", "Home") + '\
      ' + navLink("platform.html", "Platform") + '\
      ' + navLink("frameworks.html", "Frameworks") + '\
      ' + navLink("pricing.html", "Pricing") + '\
      ' + navLink("about.html", "About") + '\
      ' + navLink("contact.html", "Contact") + '\
    </nav>\
    <div class="nav-actions">\
      <a href="contact.html" class="btn btn--primary btn--sm">Book Demo</a>\
    </div>\
    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="navMenu">\
      <span></span><span></span><span></span>\
    </button>\
  </div>\
</header>';

  var footerHTML = '\
<footer class="site-footer">\
  <div class="container">\
    <div class="footer-grid">\
      <div class="footer-brand">\
        <a href="index.html" class="brand" aria-label="Praman home">\
          <svg class="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">\
            <rect width="32" height="32" rx="8" fill="url(#brandGrad2)"/>\
            <path d="M16 7l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5l7-3z" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" fill="rgba(255,255,255,0.1)"/>\
            <path d="M12.5 15l2.5 2.5L19.5 13" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>\
            <defs><linearGradient id="brandGrad2" x1="0" y1="0" x2="32" y2="32"><stop stop-color="#6366f1"/><stop offset="1" stop-color="#4f46e5"/></linearGradient></defs>\
          </svg>\
          <span>Praman</span>\
        </a>\
        <p>AI-powered Enterprise Trust Platform for continuous compliance and intelligent governance.</p>\
      </div>\
      <div>\
        <h5>Platform</h5>\
        <ul>\
          <li><a href="platform.html">Overview</a></li>\
          <li><a href="platform.html#assessment">Assessment</a></li>\
          <li><a href="platform.html#monitoring">Monitoring</a></li>\
          <li><a href="platform.html#ai-copilot">AI Copilot</a></li>\
        </ul>\
      </div>\
      <div>\
        <h5>Frameworks</h5>\
        <ul>\
          <li><a href="frameworks.html">DPDP</a></li>\
          <li><a href="frameworks.html">GDPR</a></li>\
          <li><a href="frameworks.html">ISO 27001</a></li>\
          <li><a href="frameworks.html">SOC 2</a></li>\
          <li><a href="frameworks.html">HIPAA</a></li>\
        </ul>\
      </div>\
      <div>\
        <h5>Company</h5>\
        <ul>\
          <li><a href="about.html">About</a></li>\
          <li><a href="pricing.html">Pricing</a></li>\
          <li><a href="faq.html">FAQ</a></li>\
          <li><a href="contact.html">Contact</a></li>\
        </ul>\
      </div>\
      <div>\
        <h5>Legal</h5>\
        <ul>\
          <li><a href="privacy.html">Privacy Policy</a></li>\
          <li><a href="#" id="manage-cookies-link">Manage Cookies</a></li>\
        </ul>\
      </div>\
    </div>\
    <div class="footer-bottom">\
      <p>&copy; <span id="year"></span> Praman. All rights reserved.</p>\
      <div class="footer-links">\
        <a href="privacy.html">Privacy</a>\
        <a href="#" id="manage-cookies-link-2">Cookies</a>\
      </div>\
    </div>\
  </div>\
</footer>';

  // Inject
  var headerEl = document.getElementById("site-header");
  if (headerEl) headerEl.outerHTML = headerHTML;

  var footerEl = document.getElementById("site-footer");
  if (footerEl) footerEl.outerHTML = footerHTML;

  // Manage Cookies links
  document.querySelectorAll("#manage-cookies-link, #manage-cookies-link-2").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.pramanResetCookieConsent) window.pramanResetCookieConsent();
    });
  });
})();
