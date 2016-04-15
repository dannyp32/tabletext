$('send-message').click(function (event) {
    $('.send-message').attr("disabled", true);

    $.post("http://localhost:3000/newMessage", {
        name: $('.new-message > .message-text').val(),
        conversationId: conversationId
    }, function (data) {
        console.log(data);
        // when ajax call is done 
        $('.add-party-form').hide();
        $('.send-message').attr("disabled", false);
    });
});



var Chat = {

    settings: {
        articleList: $("#article-list"),
        moreButton: $("#more-button")
    },

    init: function () {
        s = this.settings;
        this.bindUIActions();
    },

    bindUIActions: function () {
        s.moreButton.on("click", function () {
            NewsWidget.getMoreArticles(s.numArticles);
        });
    },

    getMoreArticles: function (numToGet) {
        // $.ajax or something
        // using numToGet as param
    }
};