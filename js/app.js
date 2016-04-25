var app = (function () {
    var a = {};

    a.init = function () {
        Chat.init();
        Waitlist.init();
    };

    return a;
})();

app.init();