(function () {
  "use strict";

  function normalizePath(pathname) {
    if (!pathname) return "/";
    if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
    return pathname;
  }

  function applyRouteSections() {
    var path = normalizePath(window.location.pathname);
    var isHome = path === "/" || path === "/welcome";
    var isWho = path === "/who" || path === "/who-we-are";
    var isWhat = path === "/what" || path === "/what-we-do";
    var isContact = path === "/contact" || path === "/contact-us";
    var profileSlugs = ["love", "lehman", "boyd", "kingsber"];
    var practiceSlugs = ["estateplanning", "estateprobatetrust", "businesslaw"];
    var activeProfile = null;
    var activePractice = null;
    var i;

    for (i = 0; i < profileSlugs.length; i++) {
      if (path === "/" + profileSlugs[i]) {
        activeProfile = profileSlugs[i];
        break;
      }
    }
    for (i = 0; i < practiceSlugs.length; i++) {
      if (path === "/" + practiceSlugs[i]) {
        activePractice = practiceSlugs[i];
        break;
      }
    }

    document.querySelectorAll("[data-home-section]").forEach(function (el) {
      el.hidden = !isHome;
    });
    document.querySelectorAll("[data-who-section]").forEach(function (el) {
      el.hidden = !isWho;
    });
    document.querySelectorAll("[data-what-section]").forEach(function (el) {
      el.hidden = !isWhat;
    });
    document.querySelectorAll("[data-contact-section]").forEach(function (el) {
      el.hidden = !isContact;
    });
    document.querySelectorAll("[data-practice-section]").forEach(function (el) {
      el.hidden = el.getAttribute("data-practice-section") !== activePractice;
    });
    document.querySelectorAll("[data-profile-section]").forEach(function (el) {
      el.hidden = el.getAttribute("data-profile-section") !== activeProfile;
    });

    var cmsSections = document.querySelectorAll("[data-cms-content]");
    cmsSections.forEach(function (cmsSection) {
      var inContactSection = !!cmsSection.closest("[data-contact-section]");
      if (inContactSection) {
        cmsSection.hidden = !isContact;
      } else {
        cmsSection.hidden = isHome || isWho || isWhat || isContact || !!activePractice || !!activeProfile;
      }
    });
  }

  applyRouteSections();

  var modernHeader = document.querySelector(".wa-header");
  var modernToggle = document.querySelector(".wa-menu-btn");
  var modernNav = document.querySelector("#wa-nav");

  if (modernHeader && modernToggle && modernNav) {
    modernToggle.addEventListener("click", function () {
      var open = modernHeader.classList.toggle("is-open");
      modernToggle.setAttribute("aria-expanded", open ? "true" : "false");
      modernToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    modernNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        modernHeader.classList.remove("is-open");
        modernToggle.setAttribute("aria-expanded", "false");
        modernToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  var parallaxBg = document.querySelector("[data-parallax-bg]");
  if (!parallaxBg && document.body.classList.contains("wa-body")) {
    parallaxBg = document.createElement("div");
    parallaxBg.className = "wa-parallax-bg";
    parallaxBg.setAttribute("data-parallax-bg", "");
    parallaxBg.setAttribute("aria-hidden", "true");
    document.body.insertBefore(parallaxBg, document.body.firstChild);
  }

  if (parallaxBg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ticking = false;
    function updateParallax() {
      var scrollY = window.scrollY || window.pageYOffset;
      var y = (scrollY * 0.07).toFixed(2);
      parallaxBg.style.transform = "translate3d(0, " + y + "px, 0)";
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    updateParallax();
  }
})();
