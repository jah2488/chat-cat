var app = (function($) {
    var apiUrl   = 'http://tiny-pizza-server.herokuapp.com/collections/chat-cat';
    var username = '';
    var avatar   = '';
    var chatData = JSON.parse(localStorage.getItem('cat-chat')) || {};

    var userMessageCountTemplate = _.template($('#count').html());
    var messageTemplate          = _.template($('#message').html());


    var onSignIn = function () {
        $('.signin, .backdrop').addClass('hide');
        $('.messages').removeClass('hide').addClass('fixed');
        username = $('#name').val();
        avatar   = $('#icon').val();
    };

    var onSend = function () {
        saveMessage({
            id: new Date().getTime(),
            message: $('#send').val(),
            name: username,
            icon: avatar,
            sentAt: new Date()
        });

        $('#send').val('');
    };

    var saveMessage = function (message) {
        chatData[message.id] = message;
        localStorage.setItem('cat-chat', JSON.stringify(chatData));
    };


    var addUserMessages = function () {
        var compiledTemplates = _.map(_.values(chatData), messageTemplate);
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
    }, 100);

    $('.signin   input[type=submit]').on('click', onSignIn);
    $('.messages input[type=submit]').on('click', onSend);

})($);
