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

    // Private Methods
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

    var dummyPost = function (postToString, data, callback) {
        console.log('POST: ' + postToString);
        console.log(data);

        if (callback) {
            callback();
        }
    };

    return w;
}());