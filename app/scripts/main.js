var chatData = JSON.parse(localStorage.getItem('cat-chat')) || {};

var Message = function (messageData, username, avatar) {
    return {

        template: _.template($('#message').html()),

        data: (function () {
            return {
                id:      messageData.id       || new Date().getTime(),
                message: messageData.message  || 'none',
                name:    messageData.name     || 'a ghost',
                icon:    messageData.icon     || '',
                sentAt:  messageData.sentAt   || new Date()
            };
        })(),

        html: function () { return this.template(this.data); },

        save: function () {
            chatData[this.data.id] = this.data;
            localStorage.setItem('cat-chat', JSON.stringify(chatData));
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
        var message = new Message({ message: $('#send').val(), name: username, icon: avatar);

        message.save();

        $('#send').val('');
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
