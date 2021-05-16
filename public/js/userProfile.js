(function ($) {
	$(".delbtn").on("click", function (event) {
		event.preventDefault();
		var button = $(this);

		var itemType = button.data("type"); // type
		var item_id = button.data("id"); // item ID
		var comment_id = button.data("comment_id"); // comment ID

		var requestConfig = {
			method: "POST",
			url: `/api/deleteComment/${itemType}/${comment_id}`,
			contentType: "application/json",
			data: JSON.stringify({
				comment_id: comment_id,
				type: itemType,
				item_id: item_id,
			}),
		};
		$.ajax(requestConfig).then(function (responseMessage) {
			if (responseMessage.success) {
				button.closest("li").replaceWith("<p class = 'font-italic'>You have deleted this comment!</p>");
			} else {
				button.closest("li").append("<p class = 'font-italic'>Not successful deleted this comment!</p>");
			}
		});
	});
})(jQuery);
