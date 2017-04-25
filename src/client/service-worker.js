self.addEventListener('push', event => {
  console.log('Received a push message', event);

  let title = 'The Push!';
  let body = 'Pushing data';
  let icon = '/images/icon.png';
  let tag = 'the-push-demo-sw';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );
});

self.addEventListener('notificationclick', event => {
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({
        type: 'window'
      })
      .then(clientList => {
        clientList.map((v, i, a) => {
          if (v.url === '/' && 'focus' in client) {
            return clientInformation.focus();
          }
        });
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});
