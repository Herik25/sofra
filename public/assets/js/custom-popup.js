setTimeout(() => {

    $('.toggle-sidepop').on('click', function () {

        $(".custom-popup").addClass("visible");
        $("body").addClass("noscroll");
        $("body").append('<div class="modal-backdrop fade show"></div>');
    });
    $('.custom-popup .close, .modal-backdrop').on('click', function () {
        $(".custom-popup").removeClass("visible");
        $("body").removeClass("noscroll");
        $(".modal-backdrop").remove();
    });
}, 1000);