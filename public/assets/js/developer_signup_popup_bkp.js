// $(function () {
//     alert('pratik')
//     $("#aks-file-upload").aksFileUpload({
//         fileUpload: "#uploadfile",
//         multiple: false,
//         maxFile: 1,
//         maxSize: "10 MB",
//     });
// });

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});




var swiper = new Swiper('.ad-slider', {
    loop: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: true,
    },
    pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

});



