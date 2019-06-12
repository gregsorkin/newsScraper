function showNote(event) {
    event.preventDefault();
    const id = $(this).attr("value");
    $("#addNote").attr("value", id);
    $.get("/" + id, function(data) {
        $("#artice-title").text(data.title);
        $.get("/note/" + id, function(data) {
            if (data) {
                $("#note-title").val(data.title);
                $("#note-body").val(data.body);
            }
        });
    });
};

function addNote(event) {
    event.preventDefault();
    const id = $(this).attr("value");
    const noteObj = {
        title: $("#note-title").val().trim(),
        body: $("#note-body").val().trim()
    };
    $.post("/note/" + id, noteObj, function(data) {
        window.location.href = "/saved";
    });
};

function changeStatus() {
    const status = $(this).attr("value");
    if (status === "saved") {
        $(this).html("Unsave");
    }
};

function switchBack() {
    $(this).html($(this).attr("value"));
};

$(document).click("#.addNote-button", showNote);
$(document).click("#.addNote", addNote);
$(".status").hover(changeStatus, switchBack);
$("#close-note").click(function() {
    $("#addNote").fadeOut(1000);
});