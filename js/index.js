$('.add-party').click(function (event) {
    if ($('.add-party').hasClass('submit')) {
        console.log('does this get called');
        $('.add-party.submit').attr("disabled", true);

        $.post("http://localhost:3000/addParty", {
            name: $('.add-party-form2 > .name').val(),
            size: $('.add-party-form2 > .size').val(),
            mobile: $('.add-party-form2 > .mobile').val()
        }, function (data) {
            console.log(data);
            // when ajax call is done 
            $('.add-party-form2').hide();
            $('.add-party.submit').attr("disabled", false);
        });

        $('.add-party-form2').hide();
        $('.add-party.submit').attr("disabled", false);
    } else {
        $('.add-party-form2').show(function () {
            $(".add-party").text('Done!');
            $(".add-party").addClass('submit');
            $(".add-party-form2").slideDown();
        });
    }
});

// Helper 
var stringifyDate = function (date) {
    return ((date.getHours() + 11) % 12 + 1) + ":" + date.getMinutes();
}
var socket = io.connect('http://localhost:3000');

socket.on('connect', function () {
    console.log("connect");
});


socket.on('newParty', function (data) {
    var party = data.party;
    var message = data.message;

    console.log('got the new party socket message');

    var name = party.name;
    var preview = party.preview;
    var size = party.size;

    $('#parties').prepend('<div class=' + '"party active"' + '><div class=' + '"name"' + '>' + party.name + '</div><div class=' + '"preview truncate"' + '>' + message.message + '</div><div class="arrival-time">' + stringifyDate(new Date(party.arrival_time)) + '</div><div class="size"><i class="fa fa-users icon"></i><div class="number">' + party.size + '</div><div class="clear"></div></div></div>');
});