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
- HTTP: <!-- .element: class="fragment" --> From Wiki: The Hypertext Transfer Protocol (HTTP) is an application protocol for distributed, collaborative, and hypermedia information systems. HTTP is the foundation of data communication for the World Wide Web. <!-- .element: class="fragment" --> Typically implemented as a request event driven stateless protocol. In otherwords there is no ablity to push to the client.
- TCP/IP: <!-- .element: class="fragment" --> The underlying framework that HTTP is built on. Implemented using sockets.
- Sockets: <!-- .element: class="fragment" --> From Wiki: A TCP socket is an endpoint instance defined by an IP address and a port in the context of either a particular TCP connection or the listening state. A port is a virtualisation identifier defining a service endpoint (as distinct from a service instance endpoint aka session identifier). Example node.js socket:

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

- Websockets: <!-- .element: class="fragment" --> From Wiki: WebSocket is a computer communications protocol, providing full-duplex communication channels over a single TCP connection. The WebSocket protocol was standardized by the IETF as RFC 6455 in 2011, and the WebSocket API in Web IDL is being standardized by the W3C. <!-- .element: class="fragment" --> It's a reimplementation of TCP/IP sockets over a subset of the HTTP protocol. 
- Browser Notifications: <!-- .element: class="fragment" --> Notifications that display rather the browser has focus or not. Appear very like notifications from desktop applications.
- Push Notifications: <!-- .element: class="fragment" --> Notifications that are sent from a server to a client that is subscribed to a notification service.

---

# Websockets
* Requires a server
* and a client
* requires an active alive connection between client and server
* typically allows broadcasts to all or some subset of clients connected
* responds to Server generated events or Client Events
