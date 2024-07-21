setTimeout(() => {
    $(".lg-hotspot__button").click(function () {
        $(".lg-hotspot").removeClass("lg-hotspot--selected");
        $(this).parents(".lg-hotspot").toggleClass("lg-hotspot--selected");
    });

    $(document).mouseup(function (e) {
        var container = $(".lg-hotspot");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.removeClass("lg-hotspot--selected");
            $(".spot-items").removeClass('active');
        }
    });

    var items = $('.lg-hotspot');
    $(".spot-items").hover(function () {
        $(items).removeClass("lg-hotspot--selected");
        $(".spot-items").removeClass('active');
        $(this).addClass('active');
        var theID = $(this).data("id");

        items.filter(function () {
            return $(this).data('spot') === theID
        }).addClass('lg-hotspot--selected');
    });

    // $(".pw-toggle").click(function () {
    //     $(this).find("i").toggleClass("bi-eye bi-eye-slash");
    //     var input = $($(this).parents(".password-field").find("input"));
    //     if (input.attr("type") == "password") {
    //         input.attr("type", "text");
    //     } else {
    //         input.attr("type", "password");
    //     }
    // });

    $('.dropdown-menu').on('click', function (event) {
        event.stopPropagation();
    });



    $(".currency-selector").click(function () {
        // event.preventDefault();
        // $('#currency-pop').modal('show')
    });


    $(window).scroll(function () {
        if ($(window).scrollTop() > 50) {
            $(".navbar").addClass("sticky");
        } else {
            $(".navbar").removeClass("sticky");
        }

        if ($(window).scrollTop() > 500) {
            $(".scrolltop").addClass("visible");
        } else {
            $(".scrolltop").removeClass("visible");
        }
    });
    $(document).ready(function () {
        if ($(window).scrollTop() > 50) {
            $(".navbar").addClass("sticky");
        } else {
            $(".navbar").removeClass("sticky");
        }
        if ($(window).scrollTop() > 500) {
            $(".scrolltop").addClass("visible");
        } else {
            $(".scrolltop").removeClass("visible");
        }
    });


    jQuery(function ($) {
        $('.js-accordion-title').on('click', function () {
            $(this).next(".accordion-content").slideToggle(200);
            $(this).toggleClass('open', 200);
        });
    });


    $(".hide-filter").click(function () {
        $('.products-listing-wrapper').removeClass('filter-in')
        $('.filter-sidebar').removeClass('visible')
    });


    $(function () {
        $(".filter-toggle").on("click", function (e) {
            $('.filter_offcanvas').addClass('filter-in');
            $('.filter-sidebar').addClass('visible');
            $('body').addClass('noscroll');
        });
        $(".hide-filter").on("click", function (e) {
            $('.filter_offcanvas').removeClass('filter-in');
            $('.filter-sidebar').removeClass('visible');
            $('body').removeClass('noscroll');
        });

    });

    $(".projects-cat a").click(function () {
        event.preventDefault();
        var cat = $(this).text()
        $('.projects-cat a').removeClass('active');
        $(this).addClass('active');
        $('.pg-title').text(cat);
    });



    $(".save-trigger").click(function () {
        $(this).toggleClass("saved");
        if ($(this).find("i").hasClass() == "bi bi-heart")
            $(this).find("i").removeClass("bi bi-heart-fill").addClass("bi bi-heart")
        else
            $(this).find("i").removeClass("bi bi-heart").addClass("bi bi-heart-fill");
    });

    $(".save-trigger.bookmark").click(function () {
        $(this).toggleClass("saved");
        if ($(this).find("i").hasClass() == "bi bi-bookmark")
            $(this).find("i").removeClass("bi bi-bookmark-check-fill").addClass("bi bi-bookmark")
        else
            $(this).find("i").removeClass("bi bi-bookmark").addClass("bi bi-bookmark-check-fill");
    });

    $(document).ready(function () {
        $(".access-trigger").click(function () {
            $('#access-modal').modal('show');
        });
    })





    // const signUpButton = document.getElementById('signUp');
    // const signInButton = document.getElementById('signIn');
    // const container = document.getElementById('container');
    // alert(signUpButton)
    // signUpButton.addEventListener('click', () => {
    //     container.classList.add("right-panel-active");
    // });

    // signInButton.addEventListener('click', () => {
    //     container.classList.remove("right-panel-active");
    // });



    $('.search-toggle').on('click', function () {
        $(".searchbar-wrapper").addClass("visible");
        $(".searchbar-wrapper").find("input").focus();
        $("body").append('<div class="modal-backdrop fade show"></div>');
    });
    $('.search-close').on('click', function () {
        $(".searchbar-wrapper").removeClass("visible");
        $(".modal-backdrop").remove();
    });


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


    $(".post-forum").click(function () {
        $('#new-forum').modal('show')
    });



    $(".icon-filter-item").click(function () {
        $('.icon-filter-item').removeClass('active');
        $(this).addClass('active');
    });


    $(".menu-toggle").click(function () {
        $('.mobile-menu').addClass('visible');
        $('body').addClass('noscroll');
    });

    $(".menu-toggle").click(function () {
        $('.mobile-menu').addClass('visible');
        $('body').addClass('noscroll');
    });

    $(".close-drawer").click(function () {
        $('.mobile-menu').removeClass('visible');
        $('body').removeClass('noscroll');
    });


    $(".upload-trigger").click(function () {
        $(this).find(".plus-icon").toggleClass('trigger');
        $('.bottom-drawer').toggleClass('visible');
        $('body').toggleClass('noscroll');
        $(".custom-backdrop").toggleClass('show');
    });

    $(".custom-backdrop").click(function () {
        $('.bottom-drawer').toggleClass('visible');
        $('body').toggleClass('noscroll');
        $(".custom-backdrop").toggleClass('show');
    });


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


    $(document).on('click', '.ac-link-group a, .profile-hl-links a', function () {
        // alert("hello");
        $('.account-sidebar').addClass('hide');
        $('.account-component').addClass('visible');
    });

    /*  $(".ac-link-group a, .profile-hl-links a").click(function () {
         $('.account-sidebar').addClass('hide');
         $('.account-component').addClass('visible');
     }); */

    // $(".account-component .back").click(function () {
    //     location.reload();
    // });


    $(".address-pop").click(function () {
        event.preventDefault();
        $('#address-pop').modal('show')
    });

    $(".booking-trigger").click(function () {
        $('#booking').modal('show')
    });
}, 1000);


