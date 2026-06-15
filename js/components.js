/* Praman — shared header/footer components
   Single source of truth for navigation and footer.
   Each page just needs:
     <div id="site-header"></div>  (before <main>)
     <div id="site-footer"></div>  (after </main>)
   and <script src="js/components.js"></script> in the <head> or before main.js
*/
(function () {
  "use strict";

  // Determine the current page from the URL
  var path = window.location.pathname.split("/").pop() || "index.html";

  function navLink(href, label, extraClass) {
    var isActive = (href === path);
    var cls = (extraClass || "") + (isActive ? " active" : "");
    var aria = isActive ? ' aria-current="page"' : "";
    return '<a href="' + href + '"' + (cls ? ' class="' + cls.trim() + '"' : "") + aria + ">" + label + "</a>";
  }

  var headerHTML = '\
<header class="site-header">\
  <div class="container nav">\
    <a href="index.html" class="brand" aria-label="Praman home">\
      <svg class="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">\
        <rect width="32" height="32" rx="9" fill="#0E7C6B"/>\
        <path d="M16 5l8 3v6c0 5-3.4 9.2-8 11-4.6-1.8-8-6-8-11V8l8-3z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>\
        <path d="M12 15.5l2.6 2.6L20 12.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\
      </svg>\
      <span class="brand-name">Pra<span>man</span></span>\
    </a>\
    <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="navMenu">\
      <span></span><span></span><span></span>\
    </button>\
    <nav class="nav-menu" id="navMenu" aria-label="Primary">\
      ' + navLink("index.html", "Home") + '\
      ' + navLink("services.html", "Services") + '\
      ' + navLink("pricing.html", "Pricing") + '\
      ' + navLink("faq.html", "FAQ") + '\
      ' + navLink("about.html", "About") + '\
      ' + navLink("contact.html", "Contact") + '\
      ' + navLink("readiness.html", "Free Readiness Score", "btn btn-primary nav-cta") + '\
    </nav>\
  </div>\
</header>';

  var footerHTML = '\
<footer class="site-footer">\
  <div class="container footer-grid">\
    <div class="footer-brand">\
      <a href="index.html" class="brand" aria-label="Praman home">\
        <svg class="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">\
          <rect width="32" height="32" rx="9" fill="#0E7C6B"/>\
          <path d="M16 5l8 3v6c0 5-3.4 9.2-8 11-4.6-1.8-8-6-8-11V8l8-3z" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>\
          <path d="M12 15.5l2.6 2.6L20 12.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\
        </svg>\
        <span class="brand-name">Pra<span>man</span></span>\
      </a>\
      <p>Data-protection &amp; compliance advisory for growing businesses.</p>\
    </div>\
    <div>\
      <h4>Services</h4>\
      <ul>\
        <li><a href="services.html">Readiness Assessment</a></li>\
        <li><a href="services.html">Implementation</a></li>\
        <li><a href="services.html">Compliance Retainer</a></li>\
        <li><a href="services.html">Privacy Training</a></li>\
      </ul>\
    </div>\
    <div>\
      <h4>Company</h4>\
      <ul>\
        <li><a href="about.html">About</a></li>\
        <li><a href="pricing.html">Pricing</a></li>\
        <li><a href="faq.html">FAQ</a></li>\
        <li><a href="readiness.html">Readiness Score</a></li>\
        <li><a href="contact.html">Contact</a></li>\
      </ul>\
    </div>\
    <div class="footer-contact">\
      <h4>Get in touch</h4>\
      <a href="mailto:hello@praman.example">hello@praman.example</a>\
      <a href="tel:+910000000000">+91 00000 00000</a>\
      <a href="contact.html">Book a consultation &rarr;</a>\
    </div>\
  </div>\
  <div class="container footer-bottom">\
    <p>&copy; <span id="year"></span> Praman. All rights reserved.</p>\
    <p class="footer-links"><a href="privacy.html">Privacy Policy</a> · <a href="#" id="manage-cookies-link">Manage Cookies</a></p>\
    <p class="disclaimer">Praman provides compliance advisory services and does not provide legal advice. Engage qualified legal counsel for formal compliance decisions.</p>\
  </div>\
</footer>';

  // Inject header
  var headerEl = document.getElementById("site-header");
  if (headerEl) headerEl.outerHTML = headerHTML;

  // Inject footer
  var footerEl = document.getElementById("site-footer");
  if (footerEl) footerEl.outerHTML = footerHTML;

  // "Manage Cookies" link handler
  var manageCookiesLink = document.getElementById("manage-cookies-link");
  if (manageCookiesLink) {
    manageCookiesLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.pramanResetCookieConsent) window.pramanResetCookieConsent();
    });
  }
})();
