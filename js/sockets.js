var socket = io.connect('http://localhost:3000');

socket.on('connect', function () {
    console.log("connect");
});

socket.on('newParty', function (data) {
    var party = data.party;
    var message = data.message;

    $('#parties').prepend('<div class=' + '"party"' + '><div class=' + '"name"' + '>' + party.name + '</div><div class=' + '"preview truncate"' + '>' + message.message + '</div><div class="arrival-time">' + _stringifyDate(new Date(party.arrival_time)) + '</div><div class="size"><i class="fa fa-users icon"></i><div class="number">' + party.size + '</div><div class="clear"></div></div></div>');

    //Waitlist.bindUIActions();
});

socket.on('getActiveConversation', function (data) {
    console.log('trying to get the active conversation');
    socket.emit('activeConversationId', {
        reqBody: data.reqBody,
        conversation_id: Chat.party.conversation_id
    });
});

socket.on('incomingMessage', function (data) {
    console.log(data);
    console.log('did something just fuckin happen?');
    var message = data.message;
    var meOrThem = message.is_incoming ? 'me' : 'them';
    if (data.message.conversation_id == Chat.party.conversation_id) {
        console.log('the message is for the current conversation');

        $('.conversation').append('<div class="message ' + meOrThem + '"><div class="time">' + _stringifyDate(new Date(message.created_at)) + '</div><div class="text">' + message.message + '</div><div class="dot"></div></div>');
        $(".conversation").scrollTop($(".conversation")[0].scrollHeight);
    }
});


socket.on('newMessage', function (data) {
    var message = data.message;

    $('.conversation').append('<div class="message me"><div class="time">' + _stringifyDate(new Date(message.created_at)) + '</div><div class="text">' + message.text + '</div><div class="dot"></div></div>');
    $(".conversation").scrollTop($(".conversation")[0].scrollHeight);
});

// Helpers
var _stringifyDate = function (date) {
    var minuteFiller = date.getMinutes() < 10 ? '0' : '';
    var minutes = minuteFiller + date.getMinutes();
    return ((date.getHours() + 11) % 12 + 1) + ':' + minutes;
}