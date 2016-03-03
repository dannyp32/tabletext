$('.add-party').click(function (event) {
    $('.add-party-form').show();
});
$('.add-party-submit').click(function (event) {
    $('.add-party-submit').attr("disabled", true);

    // do ajax call here...
    $.post("http://localhost:3000/addParty", {
        name: $('.add-party-form > .name').val(),
        size: $('.add-party-form > .size').val(),
        mobile: $('.add-party-form > .mobile').val()
    }, function (data) {
        console.log(data);
        // when ajax call is done 
        $('.add-party-form').hide();
        $('.add-party-submit').attr("disabled", false);
    });
});

var socket = io.connect('http://localhost:3000');

socket.on('connect', function () {
    console.log("connect");
});


socket.on('new party', function (party) {
    console.log('got the new party socket message');
    /*
        var newParty = document.createElement('div');
        var name = document.createElement('div');
        var preview = document.createElement('div');
        var size = document.createElement('div');
    */
    var name = party.name;
    var preview = party.preview;
    var size = party.size;
    /*
        newParty.appendChild(name);
        newParty.appendChild(preview);
        newParty.appendChild(size);

        document.getElementById('parties').appendChild(newParty);
        console.log(newParty);
        */

    $('#parties').prepend('<div class=' + '"party active"' + '><div class=' + '"name"' + '>' + name + '</div><div class=' + '"preview truncate"' + '>' + preview + '</div><div class="arrival-time">1:34 PM</div><div class="size"><i class="fa fa-users icon"></i><div class="number">' + size + '</div><div class="clear"></div></div></div>');

});