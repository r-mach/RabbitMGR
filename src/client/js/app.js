var btn = document.getElementById('login'),
    pusername = document.getElementById('p_username'),
    tchat_dialBtn = document.getElementById('tchat_dialBtn'),
    tchat_dialUsername = document.getElementById('tchat_dialUsername'),
    tchat_dialMessage = document.getElementById('tchat_dialMessage'),
    tchat_dialDisplay = document.getElementById('tchat_dialDisplay'),
    connectJumb = document.getElementById('connectJumb'),
    tchatJumb = document.getElementById('tchatJumb'),
    username,
    socket;

tchat_dialMessage.addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
        sendMessage();
    }
});

btn.onclick = function () {

    username = document.getElementById('username').value;
    socket = require('socket.io-client')('http://localhost:3000');

    socket.on('connect', function (socket) {
        console.log("Connection check.");

    });
    socket.emit('defineUsername', username);

    socket.on('mgrReady', function (data) {
        console.log("Connected to RabbitMQ.");
        pusername.innerHTML = username;
        connectJumb.style.display = 'none';
        tchatJumb.style.display = 'block';
    });
    socket.on('mgrReceive', function (data) {
        iReceiveToTchat(data);
    });

};

tchat_dialBtn.onclick = function () {
    sendMessage();
};
function sendMessage() {
    var mgrContent = {};
    mgrContent.username = username;
    mgrContent.message = tchat_dialMessage.value;
    mgrContent.dest = tchat_dialUsername.value;
    socket.emit('mgrSend', mgrContent);
    iSendToTchat(mgrContent);
    tchat_dialMessage.value = "";
}

function iSendToTchat(data) {
    var beautify;
    beautify = '<div style="width:100%;display:block;min-height:30px;margin-top:10px;"><div style="margin-left:auto;  border-radius: 40px 10px 10px 40px; margin-right:0;max-width:60%;padding:20px;background-color:#84c6ff;display:block;text-align:left;">Sent to ' + data.dest + ' : ' + data.message + '</div></div>';
    tchat_dialDisplay.innerHTML = tchat_dialDisplay.innerHTML + beautify;
    tchat_dialDisplay.scrollTop = tchat_dialDisplay.scrollHeight;
}
function iReceiveToTchat(data) {
    var beautify;
    beautify = '<div style="width:100%;display:block;min-height:30px;margin-top:10px;"><div style="margin-left:0;  border-radius: 10px 40px 40px 10px; margin-right:auto;max-width:60%;padding:20px;background-color:#c5ffc3;display:block;text-align:left;">' + data + '</div></div>';
    tchat_dialDisplay.innerHTML = tchat_dialDisplay.innerHTML + beautify;
    tchat_dialDisplay.scrollTop = tchat_dialDisplay.scrollHeight;
}