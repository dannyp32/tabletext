var Chat = (function () {
    var c = {},
        self = c;

    c.chat = $('.chat');
    c.chatName = $('.chat > .description > .name');
    c.conversation = $('.conversation');
    c.sendMessageButton = $('.send-message');
    c.newMessageText = $('.message-text');
    c.party = {};

    c.statPartySize = $('.stat.party-size');
    c.statWaitingFor = $('.stat.waiting-for');
    c.statTotalWait = $('.stat.total-wait');
    c.statNotes = $('.stat.notes');

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
            self.chatName.text(party.name);
            self.loadStats(party);
        }
        console.log(party);
        self.party = party;
        //console.log(party.conversation_id);
        //self.loadMessages(party.conversation_id);
    };

    c.loadStats = function (party) {
        if (party) {
            c.statPartySize.find('.amount').text(party.size);
            setTimeout(60000, c._setTimeWaitedThusFar(party));
            c.statTotalWait.find('.amount').text('45');
            c.statTotalWait.find('.type').text('minutes');
            c.statNotes.find('.content').text((party.notes ? party.notes : ''));
        }
    };

    c._setTimeWaitedThusFar = function (party) {
        if (party && party.arrival_time) {
            var today = new Date();
            var diffMs = (today - new Date(party.arrival_time));
            var diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

            c.statWaitingFor.find('.description').text(party.name + ' has been waiting for');
            if (diffHrs > 0) {
                c.statWaitingFor.find('.amount').text(diffHrs + ':' + (diffMins > 9 ? diffMins : ('0' + diffMins)));
                c.statWaitingFor.find('.type').text('');
            } else if (diffMins > 0) {
                c.statWaitingFor.find('.amount').text((diffMins > 9 ? diffMins : ('0' + diffMins)));
                c.statWaitingFor.find('.type').text('minutes');
            }
        }
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
        self.conversation.html('');
        for (var i = 0; i < messages.length; i++) {
            _addMessage(messages[i]);
        }
    };

    var _addMessage = function (message) {
        if (message && message.message && message.created_at) {
            var messageHtml = '<div class="message ' + (message.is_incoming ? 'me' : 'them') + '"><div class="time">' + _stringifyDate(new Date(message.created_at)) + '</div><div class="text">' + message.message + '</div><div class="dot"></div></div>';
            self.conversation.append(messageHtml);
            $(".conversation").scrollTop($(".conversation")[0].scrollHeight);
        } else {
            console.log('There was an error adding the new message.');
        }
    }

    // Helpers
    var _stringifyDate = function (date) {
        var minuteFiller = date.getMinutes() < 10 ? '0' : '';
        var minutes = minuteFiller + date.getMinutes();
        return ((date.getHours() + 11) % 12 + 1) + ':' + minutes;
    }

    return c;
}());