/* =====================================================
 *  C.B.I.C — Crime Branch & Investigation Commission
 *  Front-end JS (jQuery + plugins)
 * ===================================================== */

(function ($) {
  'use strict';

  /* -------------------- AOS init -------------------- */
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  /* -------------------- Hero Swiper -------------------- */
  if (typeof Swiper !== 'undefined' && document.querySelector('.hero-swiper')) {
    new Swiper('.hero-swiper', {
      loop: true,
      speed: 1000,
      autoplay: { delay: 6000, disableOnInteraction: false },
      effect: 'fade',
      fadeEffect: { crossFade: true },
      pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.hero-swiper .swiper-button-next',
        prevEl: '.hero-swiper .swiper-button-prev'
      }
    });
  }

  /* -------------------- Testimonial Swiper -------------------- */
  if (typeof Swiper !== 'undefined' && document.querySelector('.testi-swiper')) {
    new Swiper('.testi-swiper', {
      loop: false,
      rewind: true,
      watchOverflow: true,
      speed: 700,
      autoplay: { delay: 5500 },
      spaceBetween: 24,
      slidesPerView: 1,
      pagination: { el: '.testi-swiper .swiper-pagination', clickable: true },
      breakpoints: {
        768:  { slidesPerView: 2 },
        992:  { slidesPerView: 3 }
      }
    });
  }

  /* -------------------- Certificates Swiper -------------------- */
  if (typeof Swiper !== 'undefined' && document.querySelector('.cert-swiper')) {
    new Swiper('.cert-swiper', {
      loop: true,
      speed: 700,
      autoplay: { delay: 4000 },
      spaceBetween: 22,
      slidesPerView: 2,
      pagination: { el: '.cert-swiper .swiper-pagination', clickable: true },
      breakpoints: {
        576: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1200:{ slidesPerView: 5 }
      }
    });
  }

  /* -------------------- Navbar scroll state -------------------- */
  var $nav = $('#mainNav');
  function toggleNav() {
    if ($(window).scrollTop() > 60) $nav.addClass('scrolled');
    else $nav.removeClass('scrolled');
  }
  $(window).on('scroll', toggleNav);
  toggleNav();

  /* -------------------- Mobile drawer (backdrop + body lock) -------------------- */
  var $drawer    = $('#cbicNav');
  var $backdrop  = $('#navBackdrop');
  var $body      = $('body');

  $drawer.on('show.bs.collapse', function () {
    $backdrop.addClass('show');
    $body.addClass('nav-open');
  });
  $drawer.on('hide.bs.collapse', function () {
    $backdrop.removeClass('show');
    $body.removeClass('nav-open');
  });
  // Close drawer when backdrop is clicked
  $backdrop.on('click', function () {
    if ($drawer.hasClass('show')) {
      bootstrap.Collapse.getOrCreateInstance($drawer[0]).hide();
    }
  });
  // Close drawer when a nav link (not a dropdown-toggle) is clicked
  $drawer.on('click', 'a.nav-link:not(.dropdown-toggle), .dropdown-item', function () {
    if ($drawer.hasClass('show') && window.innerWidth < 1200) {
      bootstrap.Collapse.getOrCreateInstance($drawer[0]).hide();
    }
  });
  // Close on Escape
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $drawer.hasClass('show')) {
      bootstrap.Collapse.getOrCreateInstance($drawer[0]).hide();
    }
  });
  // Ensure body-lock is released if user resizes up to desktop
  $(window).on('resize', function () {
    if (window.innerWidth >= 1200) {
      $backdrop.removeClass('show');
      $body.removeClass('nav-open');
    }
  });

  /* -------------------- Dropdown on hover (desktop) -------------------- */
  function enableHoverDropdown() {
    if (window.innerWidth < 1200) return;
    $('.main-nav .dropdown').off('mouseenter.cbic mouseleave.cbic')
      .on('mouseenter.cbic', function () {
        $(this).find('.dropdown-toggle').dropdown('show');
      })
      .on('mouseleave.cbic', function () {
        $(this).find('.dropdown-toggle').dropdown('hide');
      });
  }
  enableHoverDropdown();
  $(window).on('resize', enableHoverDropdown);

  /* -------------------- Scroll to top -------------------- */
  var $scrollTop = $('#scrollTop');
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 380) $scrollTop.addClass('show');
    else $scrollTop.removeClass('show');
  });
  $scrollTop.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  /* -------------------- Counter animation -------------------- */
  function animateCounter($el) {
    var target = parseInt($el.attr('data-target'), 10) || 0;
    var suffix = $el.attr('data-suffix') || '';
    $({ val: 0 }).animate({ val: target }, {
      duration: 2200,
      easing: 'swing',
      step: function (now) {
        $el.text(Math.floor(now).toLocaleString('en-IN') + suffix);
      },
      complete: function () {
        $el.text(target.toLocaleString('en-IN') + suffix);
      }
    });
  }

  var counterStarted = false;
  function checkCounters() {
    if (counterStarted) return;
    var $stats = $('.counter');
    if (!$stats.length) return;
    var top = $stats.first().offset().top;
    if ($(window).scrollTop() + $(window).height() > top + 80) {
      $stats.each(function () { animateCounter($(this)); });
      counterStarted = true;
    }
  }
  $(window).on('scroll', checkCounters);
  checkCounters();

  /* -------------------- Hero Complaint Form -------------------- */
  var $heroForm = $('#heroComplaintForm');
  $heroForm.on('submit', function (e) {
    e.preventDefault();
    var $form = $(this);
    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }
    var $btn = $form.find('.btn-hero-submit');
    var $err = $form.find('.form-error');
    var $ok  = $form.find('.form-success');
    $err.hide().text('');
    $ok.removeClass('show');
    $btn.addClass('loading').prop('disabled', true);

    $.ajax({
      url: 'quick-complaint.php',
      method: 'POST',
      data: $form.serialize(),
      dataType: 'json',
      timeout: 12000
    })
    .done(function (res) {
      if (res && res.ok) {
        $('#heroRef').text(res.ref || '—');
        $ok.addClass('show');
        $form.find('input, select, textarea').val('');
      } else {
        $err.text((res && res.error) || 'Submission failed. Please try again.').show();
      }
    })
    .fail(function () {
      $err.text('Network error. Please try again.').show();
    })
    .always(function () {
      $btn.removeClass('loading').prop('disabled', false);
    });
  });

  /* -------------------- Newsletter -------------------- */
  $('#newsletterForm').on('submit', function (e) {
    e.preventDefault();
    var $form = $(this);
    var $btn = $form.find('button');
    var original = $btn.html();
    $btn.html('<i class="fa-solid fa-check"></i>').prop('disabled', true);
    setTimeout(function () {
      $form.trigger('reset');
      $btn.html(original).prop('disabled', false);
      alert('Thank you! You have been subscribed to the C.B.I.C newsletter.');
    }, 600);
  });

  /* -------------------- Smooth-scroll for in-page anchors -------------------- */
  $('a[href^="#"]').not('[data-bs-toggle]').on('click', function (e) {
    var target = $(this).attr('href');
    if (target === '#' || target.length < 2) return;
    if ($(target).length) {
      e.preventDefault();
      $('html,body').animate({ scrollTop: $(target).offset().top - 90 }, 600);
    }
  });

})(jQuery);


/* Accessible floating scroll-to-top control */
(function(){
  var btn = document.getElementById('scrollTop');
  if (!btn) return;
  function update(){ btn.classList.toggle('show', window.scrollY > 260); }
  window.addEventListener('scroll', update, {passive:true});
  update();
  btn.addEventListener('click', function(e){
    e.preventDefault();
    window.scrollTo({top:0,behavior:'smooth'});
  });
})();
