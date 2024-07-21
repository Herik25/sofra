$(function () {
    setTimeout(() => {
        $("#aks-file-upload").aksFileUpload({
            fileUpload: "#uploadfile",
            fileType: ["jpg", "jpeg", "png"], // allowed file formats
            multiple: false,
            maxFile: 1,
            maxSize: "10 MB",
            dragDrop: false,
            label: "Browse File"
        });
    }, 1000);



});

// $(".tag-block").click(function () {
//     $(".hotspot-modal").addClass("visible");
// });

// $(".cancel").click(function () {
//     $(".hotspot-modal").removeClass("visible");
// });





