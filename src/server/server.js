'use strict';

import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import compression from 'compression';
import webpush from 'web-push';
import urlsafebase64 from 'urlsafe-base64';
import bodyParser from 'body-parser';
import { validNick, findIndex, sanitizeString } from '../shared/util';

let app = express();
let server = http.Server(app);
let io = new SocketIO(server);
let port = process.env.PORT || 3000;
let users = [];
let sockets = {};
let vapidKeys = {
  publicKey: 'BP4n-Dv3HpSS3pI3Ozqq49ARKCdViQUF3_SlEMKRfKWsMuacxN04y-GuQY02IQiEKoCdu_053deNj5ciXqkMOKE',
  privateKey: 'NV17A6AXNWuD5HzwTI4TS29_CT9J3MV33W-tFMQ8-K8'
};
let decodedVapidPublicKey = urlsafebase64.decode(vapidKeys.publicKey);
let Uint8ArrPublicKey = new Uint8Array(decodedVapidPublicKey);

app.use(compression({}));
app.use(express['static'](__dirname + '/../client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/vapidkey', (req, res) => {
  res.send(JSON.stringify(vapidKeys.publicKey));
});

app.post('/push', function(request, response) {
  console.log(request.body);
  const subscription = request.body.subscription;
  const message = request.body.message;
  console.log(subscription);
  console.log(message);
  setTimeout(() => {
    const options = {
      TTL: 24 * 60 * 60,
      vapidDetails: {
        subject: 'mailto:jaegerpicker@gmail.com',
        publicKey: vapidKeys.publicKey,
        privateKey: vapidKeys.privateKey
      }
    };
    console.log(subscription + ' ' + message + ' ' + options);
    webpush.sendNotification(subscription, message, options);
  }, 0);

  response.send('OK');
});

io.on('connection', socket => {
  let nick = socket.handshake.query.nick;
  let currentUser = {
    id: socket.id,
    nick: nick
  };

  if (findIndex(users, currentUser.id) > -1) {
    console.log('[INFO] User ID is already connected, kicking.');
    socket.disconnect();
  } else if (!validNick(currentUser.nick)) {
    socket.disconnect();
  } else {
    console.log('[INFO] User ' + currentUser.nick + ' connected!');
    sockets[currentUser.id] = socket;
    users.push(currentUser);
    io.emit('userJoin', { nick: currentUser.nick });
    console.log('[INFO] Total users: ' + users.length);
  }

  socket.on('push', data => {
    socket.broadcast.emit('serverPush', { message: data.message });
  });

  socket.on('ding', () => {
    socket.emit('dong');
  });

  socket.on('disconnect', () => {
    if (findIndex(users, currentUser.id) > -1)
      users.splice(findIndex(users, currentUser.id), 1);
    console.log('[INFO] User ' + currentUser.nick + ' disconnected!');
    socket.broadcast.emit('userDisconnect', { nick: currentUser.nick });
  });

  socket.on('userChat', data => {
    let _nick = sanitizeString(data.nick);
    let _message = sanitizeString(data.message);
    let date = new Date();
    let time =
      ('0' + date.getHours()).slice(-2) + ('0' + date.getMinutes()).slice(-2);

    console.log('[CHAT] [' + time + '] ' + _nick + ': ' + _message);
    socket.broadcast.emit('serverPush', {
      message: _message + ' from ' + _nick
    });
    socket.broadcast.emit('serverSendUserChat', {
      nick: _nick,
      message: _message
    });
  });
});

server.listen(port, () => {
  console.log('[INFO] Listening on *:' + port);
});
