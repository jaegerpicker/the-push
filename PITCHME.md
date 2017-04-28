<style>
.accentWord {
  color: blue;
}
</style>
<center><h2>The</h2><h1 class="accentWord">Push</h1><br /><h4>By Shawn Campbell</h4><h5><a href="https://github.com/jaegerpicker/">Github</a>&nbsp;<a href="mailto:jaegerpicker@gmail.com">Email</a></h5></center>

---

## Server based User interaction

### We'll cover:
* Websockets
* Browser notifications
* Push notifications

+++

##### First definitions:
- HTTP: <!-- .element: class="fragment" --> <small>From Wiki: The Hypertext Transfer Protocol (HTTP) is an application protocol for distributed, collaborative, and hypermedia information systems. HTTP is the foundation of data communication for the World Wide Web. <!-- .element: class="fragment" --> Typically implemented as a request event driven stateless protocol. In otherwords there is no ablity to push to the client.</small>
+++
- TCP/IP: <!-- .element: class="fragment" --> <small>The underlying framework that HTTP is built on. Implemented using sockets.</small>
+++
- Sockets: <!-- .element: class="fragment" --> <small>From Wiki: A TCP socket is an endpoint instance defined by an IP address and a port in the context of either a particular TCP connection or the listening state. A port is a virtualisation identifier defining a service endpoint (as distinct from a service instance endpoint aka session identifier). </small>Example node.js socket:

+++

```
var net = require('net');

var client = new net.Socket();
client.connect(1337, '127.0.0.1', function() {
	console.log('Connected');
	client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
```

+++

- Websockets: <!-- .element: class="fragment" --> <small>From Wiki: WebSocket is a computer communications protocol, providing full-duplex communication channels over a single TCP connection. The WebSocket protocol was standardized by the IETF as RFC 6455 in 2011, and the WebSocket API in Web IDL is being standardized by the W3C. <!-- .element: class="fragment" --> It's a reimplementation of TCP/IP sockets over a subset of the HTTP protocol. </small>
+++
- Browser Notifications: <!-- .element: class="fragment" --> <small>Notifications that display rather the browser has focus or not. Appear very like notifications from desktop applications.</small>
+++
- Push Notifications: <!-- .element: class="fragment" --> <small>Notifications that are sent from a server to a client that is subscribed to a notification service.</small>

---

# Websockets
* Requires a server
* and a client
* requires an active alive connection between client and server
* typically allows broadcasts to all or some subset of clients connected
* responds to Server generated events or Client Events

---

# Long Polling

The process of requesting new data for an end point with a very long time out. The poll waits on new data to arrive and returns as soon as it does or it times out. The first technique used for server driven
interaction with the user. Has the advantage of working through firewalls and corporate proxy servers so it's still a popular choice today.

---

# Socket.io

An open source JS lib for handling websockets or falling back to long polling automattically if web sockets aren't supported. 
Example Server Socket.io code:

---

```
import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

let app = express();
let server = http.Server(app);
let io = new SocketIO(server);

io.on('connection', socket => {
	console.log(socket);
	socket.on('disconnect', (socket) => {
		console.log('disconnected: ' + socket)
	});
});
``` 

---

Exampl Client Socket.io Code:

```
import io from 'socket.io-client';
this.socket = io();

this.socket.on('disconnect', () => {
     this.socket.close();
});
```

---

# Browser Notifications
* Are triggered by client side JS for display
* require the page to be running locally on the client

---

# Push Notifications
* Are triggered by server side code and sent from your server to the browser's push notification server
* You can register your page via two different way's
	- Google Cloud Notifications
	- VAPID Number - I use this, the open standard
* When your page loads it needs to request access to send Notifications

+++

* When you register you install a service worker that runs in the background
* This service worker can display notifications even if your page isn't currently loaded in the browser
* Work similar to Mobile notifications though aren't as reliable

---

# Service Workers

These are pieces of async javascript, that is installed locally to the client and runs in the background. Think of it like a process in a native application. 

