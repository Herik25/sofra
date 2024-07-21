(function ($) {
    $(".accordion > li:eq(0) a.ac-title").addClass("active").next().slideDown();
    $(".accordion a.ac-title").click(function (j) {
        var dropDown = $(this).closest("li").find(".ac-content");
        $(this).closest(".accordion").find(".ac-content").not(dropDown).slideUp();
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        } else {
            $(this).closest(".accordion").find("a.active").removeClass("active");
            $(this).addClass("active");
        }
        dropDown.stop(false, true).slideToggle();
        j.preventDefault();
    });
})(jQuery);