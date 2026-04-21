/**
 * Site scripts: responsive images (Squarespace), app bar drawer, homepage carousel.
 */
(function () {
  'use strict';

  function loadAllImages() {
    var images = document.querySelectorAll('img[data-src]');
    for (var i = 0; i < images.length; i++) {
      if (typeof ImageLoader !== 'undefined') {
        ImageLoader.load(images[i], { load: true });
      }
    }
  }

  document.addEventListener('DOMContentLoaded', loadAllImages);

  function normalizePath(pathname) {
    if (!pathname) return '/';
    if (pathname.length > 1 && pathname.endsWith('/')) {
      return pathname.slice(0, -1);
    }
    return pathname;
  }

  function applyRouteSections() {
    var path = normalizePath(window.location.pathname);
    var isHome = path === '/' || path === '/welcome';
    var isWho = path === '/who' || path === '/who-we-are';
    var profileSlugs = ['love', 'lehman', 'boyd', 'kingsber'];
    var activeProfile = null;
    for (var i = 0; i < profileSlugs.length; i++) {
      if (path === '/' + profileSlugs[i]) {
        activeProfile = profileSlugs[i];
        break;
      }
    }
    var homeSections = document.querySelectorAll('[data-home-section]');
    var whoSections = document.querySelectorAll('[data-who-section]');
    var profileSections = document.querySelectorAll('[data-profile-section]');
    var cmsSection = document.querySelector('[data-cms-content]');
    var body = document.body;

    if (body) {
      body.classList.toggle('is-home-route', isHome);
      body.classList.toggle('is-who-route', isWho);
      body.classList.toggle('is-profile-route', !!activeProfile);
    }

    homeSections.forEach(function (el) {
      el.hidden = !isHome;
    });
    whoSections.forEach(function (el) {
      el.hidden = !isWho;
    });
    profileSections.forEach(function (el) {
      var slug = el.getAttribute('data-profile-section');
      el.hidden = slug !== activeProfile;
    });

    if (cmsSection) {
      cmsSection.hidden = isHome || isWho || !!activeProfile;
    }
  }

  applyRouteSections();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(loadAllImages, 200);
  });

  var header = document.querySelector('.app-bar');
  var toggle = document.querySelector('.app-bar__icon-btn');
  var nav = document.querySelector('#primary-nav');
  var scrim = document.querySelector('.app-bar__scrim');

  if (header && toggle && nav) {
    function setOpen(open) {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', function () {
      setOpen(!header.classList.contains('is-open'));
    });

    if (scrim) {
      scrim.addEventListener('click', function () {
        setOpen(false);
      });
    }

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 899px)').matches) {
          setOpen(false);
        }
      });
    });

    window.addEventListener('resize', function () {
      if (window.matchMedia('(min-width: 900px)').matches) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  var root = document.querySelector('[data-carousel]');
  if (!root) return;

  var slides = root.querySelectorAll('.screen-hero__slide');
  var dots = root.querySelectorAll('[data-carousel-dot]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var index = 0;
  var timerId = null;

  function goTo(next) {
    if (!slides.length) return;
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      var active = i === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    dots.forEach(function (dot, i) {
      var active = i === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function schedule() {
    if (reduceMotion || slides.length < 2) return;
    clearInterval(timerId);
    timerId = window.setInterval(function () {
      goTo(index + 1);
    }, 6500);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var i = parseInt(dot.getAttribute('data-carousel-dot'), 10);
      if (!Number.isNaN(i)) {
        goTo(i);
        schedule();
      }
    });
  });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(index - 1);
      schedule();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(index + 1);
      schedule();
    }
  });

  if (!root.hasAttribute('tabindex')) {
    root.setAttribute('tabindex', '0');
  }

  schedule();
}());
