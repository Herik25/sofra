var current_fs, next_fs, previous_fs;
var left, opacity, scale;
var animating;

$(".next").click(function () {

	var form = $("#msform");
	form.validate({
		errorElement: 'span',
		errorClass: 'help-block',
		highlight: function (element, errorClass, validClass) {
			$(element).closest('.form-group').addClass("has-error");
		},
		unhighlight: function (element, errorClass, validClass) {
			$(element).closest('.form-group').removeClass("has-error");
		},
		// rules: {
		// 	u_business_name: {
		// 		required: true,
		// 		usernameRegex: true,
		// 		minlength: 6,
		// 	},

		// },
		// messages: {
		// 	u_business_name: {
		// 		required: "Username required",
		// 	},
		// }
	});
	if (form.valid() == true) {

		if (animating) return false;
		animating = true;

		current_fs = $(this).parents("fieldset");
		next_fs = $(this).parents("fieldset").next();

		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
		$("#next").disabled = true;
		next_fs.show();
		current_fs.animate({ opacity: 0 }, {
			step: function (now, mx) {
				// scale = 1 - (1 - now) * 0.2;
				// left = (now * 50)+"%";
				opacity = 1 - now;
				current_fs.css({
					'transform': 'scale(' + scale + ')',
					'position': 'absolute'
				});
				next_fs.css({ 'left': left, 'opacity': opacity });
			},
			duration: 800,
			complete: function () {
				current_fs.hide();
				animating = false;
			},
			easing: 'easeInOutBack'
		});
	}
});

$(".previous").click(function () {
	if (animating) return false;
	animating = true;

	current_fs = $(this).parents("fieldset");
	previous_fs = $(this).parents("fieldset").prev();

	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

	previous_fs.show();
	current_fs.animate({ opacity: 0 }, {
		step: function (now, mx) {
			// scale = 0.8 + (1 - now) * 0.2;
			// left = ((1-now) * 50)+"%";
			opacity = 1 - now;
			current_fs.css({ 'left': left });
			previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
		},
		duration: 800,
		complete: function () {
			current_fs.hide();
			animating = false;
		},
		easing: 'easeInOutBack'
	});
});

$(".submit").click(function () {
	return false;
})