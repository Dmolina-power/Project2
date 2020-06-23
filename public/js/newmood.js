$(document).ready(() => {

    $(document).on("click", "#createbutton", createBtn);

    function createBtn(event) {
        event.preventDefault();

        newMood({
            title: $("#title").val().trim(),
            description: $("#description").val().trim(),
            youtubeVideoId: $("#youtube").val().trim(),
            mood: $("#mood").val().trim()
        });
    }

    function newMood(moodData) {
        $.post("/api/playlist", moodData)
            .then(function () {
                console.log("Mood has been created")
            });
    }

    function newmoodRow(moodData) {
        console.log(moodData);
        var newTr = $("<tr>");
        newTr.data("id", moodData);
        newTr.append("<td><a href='/api/playlist?userid=" + dbUser.id + "'>Create Mood</a></td>");
        return newTr;
    }




});
