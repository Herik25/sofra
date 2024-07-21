
var galleryThumbs = new Swiper(".gallery-thumbs", {
    spaceBetween: 15,
    slidesPerView: 7,
    freeMode: true,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
});
var galleryTop = new Swiper(".gallery-top", {
    spaceBetween: 10,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    thumbs: {
        swiper: galleryThumbs,
    },
});
var swiper = new Swiper('.stories-section .swiper-container', {
    loop: true,
    slidesPerView: 4.5,
    spaceBetween: 30,
    centeredSlides: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 4
    },
    autoplay: {
        delay: 4000,
        disableOnInteraction: true
    },
    breakpoints: {
        0: {
            slidesPerView: 1.7,
        },
        1024: {
            slidesPerView: 4.5,
        },
    }
});

$(window).scroll(function () {
    if ($(window).scrollTop() > 100) {
        $(".project-actionButtons").addClass("visible");
    } else {
        $(".project-actionButtons").removeClass("visible");
    }
});

$(document).ready(function () {
    if ($(window).scrollTop() > 100) {
        $(".project-actionButtons").addClass("visible");
    } else {
        $(".project-actionButtons").removeClass("visible");
    }
});

$(window).on('scroll', function () {
    if ($(window).scrollTop() >= $('.project-detail-content').offset().top + $('.project-detail-content').outerHeight() - window.innerHeight) {
        $(".project-actionButtons").removeClass('visible');
    }
});