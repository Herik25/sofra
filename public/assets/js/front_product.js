
var swiper = new Swiper('.ad-section .swiper-container', {
    loop: false,
    effect: 'fade',
    autoplay: {
        delay: 2500,
        disableOnInteraction: true,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 5
        // dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});
