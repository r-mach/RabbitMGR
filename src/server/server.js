var amqp = require('amqplib/callback_api');
var express = require('express');
var app = express();
var sub_bind_key;
app.use('/', express.static('bin/client/'));
const server = app.listen(3000, function () {
    console.log('Application listening. (Default : http://localhost:3000 ).');
});

const io = require('socket.io')(server);


amqp.connect('amqp://localhost', function (err, conn) {
    conn.on('error', function (err) {
        console.log('An error occurred : ' + err);
        conn.close();
    });
    io.on('connection', function (socket) {
        socket.on('defineUsername', function (username) {
            console.log('New user :', username);
            conn.createChannel(function (err, ch) {
                ch.assertQueue(username, {durable: false});

                ch.sendToQueue(username, new Buffer('You are ready!<br />'));
                socket.emit('mgrReady', '');

                socket.on('defineSubscribe', function (keys) {

                    if (keys.rting.length > 0) {
                        ch.assertExchange(keys.bnding, 'direct', {durable: false});
                        socket.on('disconnect', function () {
                            ch.publish(keys.bnding, 'infos', new Buffer("<strong>" + username + ' logged out.</strong><br />'));
                            ch.close();
                        });
                    } else {
                        ch.assertExchange(keys.bnding, 'fanout', {durable: false});
                    }


                    ch.assertQueue('', {exclusive: true}, function (err, q) {
                        if (keys.rting.length > 0) {
                            for (var typeDx in keys.rting) {
                                ch.bindQueue(q.queue, keys.bnding, keys.rting[typeDx]);
                            }
                            ch.publish(keys.bnding, 'infos', new Buffer("<strong>User " + username + " logged in the channel.</strong><br />"));
                        } else {
                            ch.bindQueue(q.queue, keys.bnding);
                        }

                        ch.consume(q.queue, function (msg) {
                            socket.emit('mgrReceive', msg.content.toString());
                        }, {noAck: true});
                    });


                });

                socket.on('mgrSend', function (mgrContent) {
                    if (mgrContent.type == "publish") {
                        ch.publish(mgrContent.dest, 'msgs', new Buffer(mgrContent.username + ' : ' + mgrContent.message + '<br />'));
                    }
                    if (mgrContent.type == "queue") {
                        ch.sendToQueue(mgrContent.dest, new Buffer(mgrContent.username + ' : ' + mgrContent.message + '<br />'));
                    }
                });

                ch.consume(username, function (msg) {
                    if (msg !== null) {
                        ch.ack(msg);
                        socket.emit('mgrReceive', msg.content.toString());
                    }
                });

                socket.on('disconnect', function () {
                    console.log(username + ' disconnected!');
                });
            });
        });
    });
});
