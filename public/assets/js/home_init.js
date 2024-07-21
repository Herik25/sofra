// setTimeout(() => {

//     $("#hero-carousel").carousel({
//         interval: 5000,
//         cycle: true,
//     });
// }, 1000);


function googleTranslateElementInit() {

  if ($(window).width() < 760) {
    new google.translate.TranslateElement(
      {

        includedLanguages: "en,ar",
        layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
      },
      "google_translate_element1"
    );
  } else {
    new google.translate.TranslateElement(
      {

        includedLanguages: "en,ar",
        layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
      },
      "google_translate_element"
    );
  }




}