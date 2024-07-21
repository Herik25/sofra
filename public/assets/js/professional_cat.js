
var swiperR = Swiper;
var init = false;
var swiper = new Swiper('.swiper-container', {
    slidesPerView: 4,
    spaceBetween: 30,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
});
function swiperMode() {
    let mobile = window.matchMedia('(min-width: 0px) and (max-width: 768px)');
    let desktop = window.matchMedia('(min-width: 769px)');
    if (mobile.matches) {
        init = false;
    }
    else if (desktop.matches) {
        if (!init) {
            init = true;
            var swiper = new Swiper('.swiper-container', {
                slidesPerView: 4,
                spaceBetween: 30,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }
            });
        }
    }
}
// window.addEventListener('load', function () {
//     setTimeout(() => {
//         swiperMode();
//     }, 5000);

// });
window.addEventListener('resize', function () {
    swiperMode();
});