//$('send-message').click(function (event) {
//    $('.send-message').attr("disabled", true);
//
//    $.post("http://localhost:3000/newMessage", {
//        name: $('.new-message > .message-text').val(),
//        conversationId: conversationId
//    }, function (data) {
//        console.log(data);
//        // when ajax call is done 
//        $('.add-party-form').hide();
//        $('.send-message').attr("disabled", false);
//    });
//});



var Chat = (function () {
    var c = {},
        self = c;

    c.chat = $('.chat');
    c.conversation = $('.conversation');
    c.sendMessageButton = $('.send-message');
    c.newMessageText = $('.message-text');
    c.party = {};

    c.init = function () {
        this.bindUIActions();
        console.log('it gets to init in CHAT');
    };

    c.bindUIActions = function () {
        self.chat.on('chat:reload', self.loadChat);
        self.sendMessageButton.on('click', self.sendMessage);
    };

    c.sendMessage = function (event) {
        if (self.newMessageText.val() != '' && self.party) {
            self.sendMessageButton.attr("disabled", true);

            $.post("http://localhost:3000/newMessage", {
                message: self.newMessageText.val(),
                conversation_id: self.party.conversation_id,
                mobile: self.party.mobile_number
            }, function (data) {
                console.log(data);
                _addMessage(data.message);
                // when ajax call is done 
                self.sendMessageButton.attr("disabled", false);
            }).fail(function () {
                self.sendMessageButton.attr("disabled", false);
            });
        }
    }

    c.loadChat = function (event, party) {
        if (party) {
            self.loadMessages(party.conversation_id);
        }
        console.log(party);
        self.party = party;
        //console.log(party.conversation_id);
        //self.loadMessages(party.conversation_id);
    };

    c.loadMessages = function (conversationId) {
        $.get('http://localhost:3000/conversation/' + conversationId + '/messages', function (data) {
            console.log('Here are the messages!!');
            console.log(data);
            _loadMessagesUI(data);
        }).fail(function () {
            console.log('loadMessages get request failed :(');
        });
    };

    // Private Methods
    var _loadMessagesUI = function (messages) {
        for (var i = 0; i < messages.length; i++) {
            _addMessage(messages[i]);
        }
    };

    var _addMessage = function (message) {
        if (message && message.message && message.created_at) {
            self.conversation.append('<div class="message them"><div class="time">' + _stringifyDate(new Date(message.created_at)) + '</div><div class="text">' + message.message + '</div><div class="dot"></div></div>');
        } else {
            console.log('There was an error adding the new message.');
        }
    }

    // Helpers
    var _stringifyDate = function (date) {
        return ((date.getHours() + 11) % 12 + 1) + ":" + date.getMinutes();
    }

    return c;
}());