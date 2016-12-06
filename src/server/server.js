var amqp = require('amqplib/callback_api');
var express = require('express');
var app = express();

app.use('/', express.static('bin/client/'));
const server = app.listen(3000, function () {
    console.log('Application listening. (Default : http://localhost:3000 ).');
});

const io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.on('defineUsername', function (username) {
        console.log('New user :', username);
        amqp.connect('amqp://localhost', function (err, conn) {
            conn.createChannel(function (err, ch) {
                ch.assertQueue(username, {durable: false});
                // Note: on Node 6 Buffer.from(msg) should be used
                ch.sendToQueue(username, new Buffer('Vous êtes prêt!<br />'));
                socket.emit('mgrReady', '');
                socket.on('mgrSend', function (mgrContent) {
                    ch.sendToQueue(mgrContent.dest, new Buffer(mgrContent.username + ' : ' + mgrContent.message + '<br />'));
                });
                ch.consume(username, function (msg) {
                    if (msg !== null) {
                        ch.ack(msg);
                        socket.emit('mgrReceive', msg.content.toString());
                    }
                });
            });
        });
    });
});
