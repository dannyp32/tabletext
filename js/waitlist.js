var Waitlist = (function () {
    var w = {},
        self = w;

    w.addPartyForm = $('.add-party-form');
    w.addPartyButton = $('.add-party');
    w.partyItems = $('.party');
    w.partiesParent = $('#parties');
    w.chat = $('.chat');
    w.parties = [];

    w.activePartyId = '';
    w.activeConversationId = '';
    w.activeParty = {};

    w.init = function () {
        console.log('at least it got initialized');
        this.bindUIActions();
    };

    w.bindUIActions = function () {
        self.addPartyButton.on('click', self.clickAddParty);
        self.partiesParent.on('click', '.party', self.selectParty);
    };

    w.clickAddParty = function () {
        if (self.addPartyButton.hasClass('submit')) {
            _submitAddPartyForm();
        } else {
            _showAddPartyForm();
        }
    };

    w.selectParty = function () {
        var selectedParty = $(this);
        var index = $(this).index();

        if (index != self.parties.length) {
            w.chat.trigger("chat:reload", [self.parties[index]]);
        }

        console.log(index);
    };

    w.loadParties = function (userId) {
        $.get('http://localhost:3000/userId/' + userId + '/parties', function (data) {
            console.log('Here are the parties!!');
            console.log(data);
            _loadPartiesUI(data);
        }).fail(function () {
            console.log('loadMessages get request failed :(');
        });
    };

    // Private Methods
    var _loadParitesUI(parties) = function () {
        self.partiesParent.html('');
        for (var i = 0; i < parties.length; i++) {
            _addParty(parties[i]);
        }
    };

    var _addParty = function () {
        var party = data.party;
        var message = data.party.message;

        $('#parties').prepend('<div class=' + '"party"' + '><div class=' + '"name"' + '>' + party.name + '</div><div class=' + '"preview truncate"' + '>' + message.message + '</div><div class="arrival-time">' + _stringifyDate(new Date(party.arrival_time)) + '</div><div class="size"><i class="fa fa-users icon"></i><div class="number">' + party.size + '</div><div class="clear"></div></div></div>');
    }

    var _showAddPartyForm = function () {
        self.addPartyForm.show(function () {
            self.addPartyButton.text('Done!');
            self.addPartyButton.addClass('submit');
            self.addPartyForm.slideDown();
        });
    };

    var _submitAddPartyForm = function () {
        self.addPartyButton.attr('disabled', true);

        $.post('http://localhost:3000/newParty', {
            name: self.addPartyForm.find('.name').val(),
            size: self.addPartyForm.find('.size').val(),
            mobile: self.addPartyForm.find('.mobile').val()
        }, function (data) {
            if (data.error) {
                console.log(data.error);
                return;
            }

            self.parties.splice(0, 0, data.party);

            self.addPartyForm.hide();
            self.addPartyButton.attr('disabled', false);
            self.addPartyButton.removeClass('submit');
            self.addPartyButton.text('Add Party');
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " + "error thrown: " + errorThrown);
        });
    };

    var _stringifyDate = function (date) {
        var minuteFiller = date.getMinutes() < 10 ? '0' : '';
        var minutes = minuteFiller + date.getMinutes();
        return ((date.getHours() + 11) % 12 + 1) + ':' + minutes;
    }

    var dummyPost = function (postToString, data, callback) {
        console.log('POST: ' + postToString);
        console.log(data);

        if (callback) {
            callback();
        }
    };



    return w;
}());