var Waitlist = (function () {
    var w = {},
        self = w;


    w.addPartyForm = $('.add-party-form');
    w.addPartyButton = $('.add-party');
    w.partyItems = $('.party');
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
        self.partyItems.on('click', self.selectParty);
    };

    w.clickAddParty = function () {
        if (self.addPartyButton.hasClass('submit')) {
            submitAddPartyForm();
        } else {
            showAddPartyForm();
        }
    };

    w.selectParty = function () {
        var selectedParty = $(this);
        var oldParty = self.partyItems.index(self.activeParty);
        var index = self.partyItems.index(this);

        if (oldParty >= 0) {
            self.partyItems[oldParty].removeClass('active');
        }

        console.log(index);
        self.activeParty = self.parties[index];
        selectedParty.addClass('active');
        self.chat.trigger("chat:load", self.parties[index]);
    };

    // Private Methods
    var showAddPartyForm = function () {
        self.addPartyForm.show(function () {
            self.addPartyButton.text('Done!');
            self.addPartyButton.addClass('submit');
            self.addPartyForm.slideDown();
        });
    };

    var submitAddPartyForm = function () {
        self.addPartyButton.attr('disabled', true);

        dummyPost('http://localhost:3000/addParty', {
            name: self.addPartyForm.find('.name').val(),
            size: self.addPartyForm.find('.size').val(),
            mobile: self.addPartyForm.find('.mobile').val()
        }, function (data) {
            self.parties.splice(0, 0, data.party);

            self.addPartyForm.hide();
            self.addPartyButton.attr('disabled', false);
            self.addPartyButton.removeClass('submit');
            self.addPartyButton.text('Add Party');
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