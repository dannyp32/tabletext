var socket = io.connect('http://localhost:3000');

socket.on('connect', function () {
    console.log("connect");
});

socket.on('newParty', function (data) {
    var party = data.party;
    var message = data.message;

    $('#parties').prepend('<div class=' + '"party"' + '><div class=' + '"name"' + '>' + party.name + '</div><div class=' + '"preview truncate"' + '>' + message.message + '</div><div class="arrival-time">' + stringifyDate(new Date(party.arrival_time)) + '</div><div class="size"><i class="fa fa-users icon"></i><div class="number">' + party.size + '</div><div class="clear"></div></div></div>');
});

socket.on('newMessage', function (data) {
    var message = data.message;

    $('.conversation').append('<div class="message them"><div class="time">' + stringifyDate(new Date(message.created_at)) + '</div><div class="text">' + message.text + '</div><div class="dot"></div></div>');
});

// Helpers
var stringifyDate = function (date) {
    return ((date.getHours() + 11) % 12 + 1) + ":" + date.getMinutes();
}