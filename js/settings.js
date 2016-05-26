var Settings = (function () {
    var s = {},
        self = s;

    s.saveButton = $('.save-settings');

    s.addressMessage = $('.answer.address');
    s.hoursMessage = $('.answer.hours');
    s.websiteMessage = $('.answer.website');
    s.takeoutMessage = $('.answer.takeout');
    s.menuMessage = $('.answer.menu');

    s.init = function () {
        this.bindUIActions();
    };

    s.bindUIActions = function () {
        self.loadSettings();
        self.saveButton.on('click', self.saveSettings);
    };

    s.saveSettings = function () {
        $.post('http://localhost:3000/saveSettings', {
            hours: self.hoursMessage.val(),
            address: self.addressMessage.val(),
            menu: self.menuMessage.val(),
            website: self.websiteMessage.val(),
            takeout: self.takeoutMessage.val()

        }, function (data) {
            if (data.error) {
                console.log(data.error);
                return;
            }

            console.log('cool seems like that worked');
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " + "error thrown: " + errorThrown);
        });
    };

    s.loadSettings = function (userId) {
        $.get('http://localhost:3000/settings', function (data) {
            if (data && data[0]) {
                self.hoursMessage.text(data[0].hours);
                self.addressMessage.val(data[0].address);
            }
        }).fail(function () {
            console.log('loadMessages get request failed :(');
        });
    };

    var _stringifyDate = function (date) {
        var minuteFiller = date.getMinutes() < 10 ? '0' : '';
        var minutes = minuteFiller + date.getMinutes();
        return ((date.getHours() + 11) % 12 + 1) + ':' + minutes;
    }

    return s;
}());

Settings.init();