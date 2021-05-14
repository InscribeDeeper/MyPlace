(function ($) {
	let loginForm = $("#login-form"); // JQuery
	let usernameInput = $("#userName");
	let passwordInput = $("#password");
	let submitButton = $("#submitButton");
	let errors = $(".error");

	loginForm.submit((event) => {
		event.preventDefault();
		usernameInput.removeClass("is-invalid is-valid");
		passwordInput.removeClass("is-invalid is-valid");
		submitButton.prop("disabled", true);
		errors.hide();

		let info = {
			username: usernameInput.val().trim(),
			password: passwordInput.val().trim(),
		};

		let hasErrors = false;
		if (!info.username || !info.password) {
			usernameInput.addClass("is-invalid");
			passwordInput.addClass("is-invalid");
			hasErrors = true;
		}

		if (!hasErrors) {
			loginForm.unbind().submit(); // 提交到数据库
		} else {
			submitButton.prop("disabled", false); // 返回错误 无法提交 / prop 啥意思?? 弹出?
		}
	});
})(jQuery);
