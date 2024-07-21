var swiper = new Swiper('.le-banner .swiper-container', {
    loop: true,
    effect: 'fade',
    autoplay: {
        delay: 6000,
        disableOnInteraction: false,
    },
});

var swiper = new Swiper('.le-banner .swiper-container1', {
    loop: true,
    effect: 'fade',
    autoplay: {
        delay: 6000,
        disableOnInteraction: false,
    },
});

setTimeout(function () {

    var swiper = new Swiper('.profCategory-slider', {
      loop: true,
      slidesPerView: 4,
      spaceBetween: 20,
      centeredSlides: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 5
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
      autoplay: {
        delay: 2000,
        disableOnInteraction: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 8,
        },
        1024: {
          slidesPerView: 3,
        },
      }
    });
    }, 2000)



// var swiper = new Swiper('.profCategory-slider', {
//     loop: true,
//     slidesPerView: 4,
//     autoplay: {
//         delay: 2500,
//         disableOnInteraction: true,
//     },
//     pagination: {
//         el: '.swiper-pagination',
//         dynamicBullets: true,
//         dynamicMainBullets: 5
//     },
//     navigation: {
//         nextEl: '.swiper-button-next',
//         prevEl: '.swiper-button-prev',
//     },

// });