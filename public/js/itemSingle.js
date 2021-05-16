(function ($) {
	function updateHelpfulOnPage(btn, responseMessage) {
		var helpful = btn.closest(".container").find(".helpful");
		helpful.html(responseMessage.helpfulNum);
	}

	function showHelpfulError(btn) {
		var error = btn.closest(".container").find(".error");
		error.html("You must be logged in to mark helpful");
		error.removeAttr("hidden");
	}

	function showRepError(btn) {
		var error = btn.closest(".container").find(".error");
		error.html("You must be logged in to report reviews");
		error.removeAttr("hidden");
	}

	// Attach 'active' class to first carousel item to show the carousel
	let firstItem = $(".carousel-item")[0];
	$(firstItem).addClass("active");

	$(".reportbtn").on("click", function (event) {
		event.preventDefault();
		var btn = $(this);
		var comment_id = btn.data("cid");
		var user_id = btn.data("uid");
		var item_id = btn.data("iid");
		var type = btn.data("type");

		if (user_id) {
			var requestConfig = {
				method: "POST",
				url: "/comments/report/" + comment_id,
				contentType: "application/json",
				data: JSON.stringify({
					item_id: item_id,
					user_id: user_id,
					type: type,
				}),
			};
			$.ajax(requestConfig).then(function (responseMessage) {
				if (!responseMessage.unReport) {
					btn.closest(".list-group-item").append("<li class = 'list-group-item error font-italic'>This review has been reported</li>");
				} else{
                    btn.closest(".list-group-item").append("<li class = 'list-group-item error font-italic'>This review has been Unreported</li>");
                }

				//toggle icon color and text
				var reportText = btn.children(".report-text");
				reportText.text(reportText.text() == "Report" ? "Unreport" : "Report");

				var msg = btn.closest(".container").find(".msg");
				if (btn.hasClass("btn-danger")) {
					msg.text("Thank you, your review has been submitted!");
				} else {
					msg.text("You have unreported this review.");
				}
				msg.removeAttr("hidden");

				btn.toggleClass("btn-danger");
				btn.toggleClass("btn-secondary");
			});
		} else {
			showRepError(btn);
		}
	});

	$(".helpfulbtn").on("click", function (event) {
		event.preventDefault();
		var btn = $(this);
		var comment_id = btn.data("cid");
		var user_id = btn.data("uid");
		var item_id = btn.data("iid");
		var type = btn.data("type");

		if (user_id) {
			var requestConfig = {
				method: "POST",
				url: "/comments/helpful/" + comment_id,
				contentType: "application/json",
				data: JSON.stringify({
					item_id: item_id,
					user_id: user_id,
					type: type,
				}),
			}
			$.ajax(requestConfig).then(function (responseMessage) {
				// ajax能够访问 post 对应的数据 到数据库. 只是这里的数据库接口用的是 api/like/
				updateHelpfulOnPage(btn, responseMessage);

				//toggle icon color
				var other = btn.parent().find(".fa-thumbs-down");
				if (other.hasClass("filled")) {
					other.removeClass("filled");
				}
				btn.toggleClass("filled");
			})
		} else {
			showHelpfulError(btn);
		}
	});
})(jQuery);
