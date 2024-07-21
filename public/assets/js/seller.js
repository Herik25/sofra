$(function () {

    $("#aks-file-upload").aksFileUpload({
        fileUpload: "#uploadfile",
        fileType: ["jpg", "jpeg", "png"], // allowed file formats
        multiple: false,
        maxFile: 1,
        maxSize: "10 MB",
        dragDrop: false,
        label: "Browse File"
    });
});
$(document).ready(function () {
    // $(".text-title").click(function () {
    //     $('<div class="block-wrapper text-block-wrapper"><input type="text" class="text-control" placeholder="Title"/><button class="remove-block"><i class="bi bi-x"></i></button></div>').insertBefore(".project-end").find("input").focus();
    // });
    // $(".text-block").click(function(){
    //     $('<div class="block-wrapper text-block-wrapper"><textarea class="text-control" placeholder="Write Here"></textarea><button class="remove-block"><i class="bi bi-x"></i></button></div>').insertBefore(".project-end").find("textarea").focus();
    // });
    $(".tag-block").click(function () {
        $(".hotspot-modal").addClass("visible");
    });
    $(".cancel").click(function () {
        $(".hotspot-modal").removeClass("visible");
    });
});
// $(document).on('click', '.remove-block', function(){
//     $(this).parents(".block-wrapper").remove();
// });







