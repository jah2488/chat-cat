var chatData = JSON.parse(localStorage.getItem('cat-chat')) || {};
var apiUrl   = 'http://tiny-pizza-server.herokuapp.com/collection/chat-cat'

var Message = function (messageData) {
    var defaults = {
       id:      new Date().getTime(),
       message: 'none',
       name:    'a ghost',
       icon:    '',
       sentAt:  new Date()
    };
    return {

        template: _.template($('#message').html()),

        data: _.extend(defaults, messageData),

        html: function () { return this.template(this.data); },

        save: function (doneCallback) {
            // chatData[this.data.id] = this.data;
            // localStorage.setItem('cat-chat', JSON.stringify(chatData));
            $.ajax({
                method: "POST",
                url: apiUrl,
                data: this.data
            }).done(doneCallback);
        }
    };
}

app = (function($) {
    var username = '';
    var avatar   = '';

    var userMessageCountTemplate = _.template($('#count').html());

    var onSignIn = function () {
        $('.signin, .backdrop').addClass('hide');
        $('.messages').removeClass('hide').addClass('fixed');
        username = $('#name').val();
        avatar   = $('#icon').val();
    };

    var onSend = function () {
        var message = new Message({
            message: $('#send').val(),
            name: username,
            icon: avatar
        });

        message.save(function (response) {
            $('#send').val('');
        });
    };

    var addUserMessages = function () {
        var compiledTemplates = _.map(_.values(chatData), function (messageData) {
            var message = new Message(messageData);
            return message.html();
        });
        $('.historyContainer').html(compiledTemplates);
    };

    var addUserLeaderboard = function () {

        var namesAndCount = _.countBy(chatData, function (msg) { return msg.name; });

        var userMessageCount = _.map(namesAndCount, function (val, key) {
             return { name: key, length: val };
        });
        var compiledUserMessageCount = _.map(userMessageCount, userMessageCountTemplate);

        $('.leaderboard').html(compiledUserMessageCount);
    };

    setInterval(function () {
        addUserMessages();
        addUserLeaderboard();
    }, 1000);

    $('.signin   input[type=submit]').on('click', onSignIn);
    $('.messages input[type=submit]').on('click', onSend);

})($);
