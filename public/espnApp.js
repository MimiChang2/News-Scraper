//Get articles as JSON
$.getJSON("/article", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#article").append("<h1 data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</h1>");
    }
});

$(document).on("click", "h1", function() {
    $("#comment").empty();
    var thisID = $(this).attr("data-id");

    $.ajax({
            method: "GET",
            url: "/article/" + thisID
        })
        .done(function(data) {
            console.log(data);
            $("#comment").append("<h1>" + data.title + "</h1>");
            $("#comment").append("<textarea id='body' name='newcomment'></textarea>");
            $("#comment").append("<button data-id ='" + data._id + "'id='newnote'>Submit Comment</button>");

            if (data.comment) {
                //$("#body").val(data.comment.title);
                $("#body").val(data.comment.body);
            }
        });
});

//new post
$(document).on("click", "#newnote", function() {
    var thisID = $(this).attr("data-id");
    console.log("clicked button");

    $.ajax({
            method: "POST",
            url: "/article/" + thisID,
            data: {
                //title: $("#newtitle").val(),
                body: $("#body").val()
            }
        })
        .done(function(data) {
            console.log(data);
            $("#comment").empty();
        });

    $("#newtitle").val("");
    $("#newbody").val("");
});
