(function($){
    $('.delbtn').on('click', (function(event){
        event.preventDefault();
        var button = $(this);
        var itemType = button.data('type'); // type
        var item_id = button.data('id'); // item ID
        var comment_id = button.data('comment_id'); // comment ID
        
        var requestConfig = {
            method: "POST",
            url: `/api/deleteComment/${itemType}/${item_id}/${comment_id}`,
            contentType: 'application/json',
            data: JSON.stringify({
                id: reviewId
            })
        }
        $.ajax(requestConfig).then(function(responseMessage){
            if (responseMessage.success){
                let empty = "<p class = 'font-italic'>You have deleted this comment!</p>";
                button.closest('ul').replaceWith(empty);
            }else{
                button.closest('li').remove(); // ?
            }
        });
    }));
})(jQuery);