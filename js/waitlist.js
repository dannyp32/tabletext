var Waitlist = (function () {
    var w = {},
        self = w;

    w.addPartyForm = $('.add-party-form');
    w.addPartyButton = $('.add-party');
    w.partyItems = $('.party');
    w.partiesParent = $('#parties');
    w.chat = $('.chat');
    w.parties = [];


    w.waitlistTab = $('.category.waitlist');
    w.incomingMessagesTab = $('.category.incoming-messages');
    w.settingsTab = $('.settingsTab');

    w.activePartyId = '';
    w.activeConversationId = '';
    w.activeParty = {};

    w.init = function () {
        console.log('at least it got initialized');
        this.bindUIActions();
    };

    w.bindUIActions = function () {
        self.loadParties('');
        self.addPartyButton.on('click', self.clickAddParty);
        self.partiesParent.on('click', '.party', self.selectParty);
        self.waitlistTab.on('click', self.selectWaitlistTab);
        self.incomingMessagesTab.on('click', self.selectIncomingMessagesTab);
    };

    w.selectWaitlistTab = function () {
        self.waitlistTab.addClass('active');
        self.incomingMessagesTab.removeClass('active');
        self.settingsTab.removeClass('active');
        self.loadParties('');

    };

    w.selectIncomingMessagesTab = function () {
        self.incomingMessagesTab.addClass('active');
        self.waitlistTab.removeClass('active');
        self.settingsTab.removeClass('active');
        self.loadConversations('');
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

        if ($(this).hasClass('incoming-conversation')) {
            self.parties[index].name = self.parties[index].mobile_number;
            self.parties[index].conversation_id = self.parties[index]._id;
            w.chat.trigger("chat:reload", self.parties[index]);
            return;
        }

        if (index != self.parties.length) {
            w.chat.trigger("chat:reload", self.parties[index]);
        }

        console.log(index);
    };

    w.loadParties = function (userId) {
        $.get('http://localhost:3000/userId/' + '2232' + '/parties', function (data) {
            console.log('Here are the parties!!');
            console.log(data);
            self.parties = [];
            _loadPartiesUI(data);
            if (self.parties && self.parties[0]) {
                w.chat.trigger("chat:reload", [self.parties[0]]);
            }
        }).fail(function () {
            console.log('loadMessages get request failed :(');
        });
    };

    w.loadConversations = function (userId) {
        $.get('http://localhost:3000/userId/' + '2232' + '/conversations', function (data) {
            console.log('Here are the incoming conversations');
            console.log(data);
            self.parties = [];
            _loadConversationsUI(data);

            if (self.parties && self.parties[0]) {
                self.parties[0].name = self.parties[0].mobile_number;
                self.parties[0].conversation_id = self.parties[0]._id;
                w.chat.trigger("chat:reload", [self.parties[0]]);
            }
        }).fail(function () {
            console.log('loadMessages get request failed :(');
        });
    };

    w.addConversation = function (data) {
        var convo = data;
        self.parties.splice(0, 0, convo);
        //var message = data.party.message;

        $('#parties').prepend('<div class="party incoming-conversation"><div class="name">' + convo.mobile_number + '</div><div class="preview truncate"></div><div class="arrival-time">' + _stringifyDate(new Date(convo.created_at)) + '</div>');
    };

    // Private Methods
    var _loadPartiesUI = function (parties) {
        self.partiesParent.html('');
        for (var i = 0; i < parties.length; i++) {
            _addParty(parties[i]);
        }
    };

    var _loadConversationsUI = function (convos) {
        self.partiesParent.html('');
        for (var i = 0; i < convos.length; i++) {
            self.addConversation(convos[i]);
        }
    };


    var _addParty = function (data) {
        var party = data;
        self.parties.splice(0, 0, data);
        var message = data.message;

        $('#parties').prepend('<div class=' + '"party"' + '><div class=' + '"name"' + '>' + party.name + '</div><div class=' + '"preview truncate"' + '>' + (message && message.message ? message.message : '') + '</div><div class="arrival-time">' + _stringifyDate(new Date(party.arrival_time)) + '</div><div class="size"><i class="fa fa-users icon"></i><div class="number">' + party.size + '</div><div class="clear"></div></div></div>');
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
            mobile: self.addPartyForm.find('.mobile').val(),
            notes: self.addPartyForm.find('.notes').val()
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