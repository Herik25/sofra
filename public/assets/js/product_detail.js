if ($(window).width() > 767) {

    var galleryThumbs = new Swiper(".gallery-thumbs", {
        centeredSlides: true,
        centeredSlidesBounds: true,
        slidesPerView: 5,
        spaceBetween: 20,
        watchOverflow: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        direction: 'vertical'
    });
    var galleryMain = new Swiper(".gallery-top", {
        watchOverflow: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        preventInteractionOnTransition: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        thumbs: {
            swiper: galleryThumbs
        }
    });
    galleryMain.on('slideChangeTransitionStart', function () {
        galleryThumbs.slideTo(galleryMain.activeIndex);
    });
    galleryThumbs.on('transitionStart', function () {
        galleryMain.slideTo(galleryThumbs.activeIndex);
    });
} else {

    var galleryThumbs = new Swiper('.gallery-thumbs', {
        centeredSlides: false,
        centeredSlidesBounds: false,
        spaceBetween: 10,
        slidesPerView: 4.5,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
    });
    var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 10,
        thumbs: {
            swiper: galleryThumbs
        }
    });
}

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