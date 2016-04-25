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



var Chat = (function () {
    var c = {},
        self = c;

    c.chat = $('.chat');
    c.party = {};

    c.init = function () {
        this.bindUIActions();
        console.log('it gets to init in CHAT');
    };

    c.bindUIActions = function () {
        self.chat.on('chat:reload', self.loadChat);
    };

    c.loadChat = function (event, party) {
        if (party) {
            self.loadMessages(party.conversation_id);
        }
        console.log(party);
        //console.log(party.conversation_id);
        //self.loadMessages(party.conversation_id);
    };

    c.loadMessages = function (conversationId) {
        $.get('http://localhost:3000/conversation/' + conversationId + '/messages', function (data) {
            console.log('Here are the messages!!');
            console.log(data);
            loadMessagesUI(data);
        }).fail(function () {
            alert('loadMessages get request failed :(');

        });
    };

    // Private Methods
    var loadMessagesUI = function (messages) {
        for (var i = 0; i < messages.length; i++) {
            $('.conversation').append('<div class="message them"><div class="time">' + stringifyDate(new Date(messages[i].created_at)) + '</div><div class="text">' + messages[i].message + '</div><div class="dot"></div></div>');
        }
    };



    // Helpers
    var stringifyDate = function (date) {
        return ((date.getHours() + 11) % 12 + 1) + ":" + date.getMinutes();
    }

    return c;
}());