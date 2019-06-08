$(document).ready(function () {
    // Add a comment click event
    $(".addComment").on("click", function() {
        event.preventDefault();

        let articleId = $(this).data("id");
        let URL = window.location.origin;

        let frmName = "form-add-" + articleId;
        let frm = ("#" + frmName);
        
        // AJAX call and promise
        $.ajax({
            url: URL + "/add/comment/" + articleId,
            type: "POST",
            data: frm.serialize(),
        }).done(function() {
            location.reload();
        });
    });

    // Delete a comment click event
    $(".deleteComment").on("click", function() {
        event.preventDefault();

        let commentId = $(this).data("id");
        let URL = window.location.origin;

        // AJAX call and promise
        $.ajax({
            url: URL + "/remove/comment/" + commentId,
            type: "POST"
        }).done(function() {
            location.reload();
        })
    });
});