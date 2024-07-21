$(".add-cf").click(function () {
    $(".cf-container").append('<div class="cf-row"><div class="cf-column"><input type="text" class="form-control" placeholder="Title"></div><div class="cf-column"><input type="text" class="form-control" placeholder="Value"></div><span class="cf-button remove-cf"><i class="feather icon-minus"></i></span></div>');
});
$(document).on('click', '.remove-cf', function (e) {
    $(this).parents('.cf-row').remove();
});