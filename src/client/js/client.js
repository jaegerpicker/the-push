'use strict';

import * as $ from 'jquery';
import urlsafebase64 from 'urlsafe-base64';
import Chat from './Chat';
import { validNick } from '../../shared/util';

class Client {
  constructor() {
    let btn = document.getElementById('startButton'),
      userNameInput = document.getElementById('userNameInput');

    btn.onclick = () => {
      this.startChat(userNameInput.value);
    };

    userNameInput.addEventListener('keypress', e => {
      let key = e.which || e.keyCode;

      if (key === 13) {
        this.startChat(userNameInput.value);
      }
    });
    if ('serviceWorker' in navigator) {
      console.log('Checking for service work support...');
      navigator.serviceWorker.register('./service-worker.js').then(
        registration => {
          console.log('Service Worker registered!');
        },
        error => {
          console.log('Service Worker registration failed!');
        }
      );
    } else {
      console.log('Service Worker not supported!');
    }

    if (!('Notification' in window)) {
      console.error('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      console.log('Permission to receive notifications has been granted');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(permission => {
        if (permission === 'granted') {
          console.log('Permission to receive notifications has been granted');
        }
      });
    }

    navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
      $.get('./vapidkey', data => {
        console.log(data);
        window.vapidPublicKey = urlsafebase64.decode(data);
      }).then(() => {
        /*serviceWorkerRegistration.pushManager
          .getSubscription()
          .then(subscription => {
            subscription.unsubscribe();
          });*/
        serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: new Uint8Array(window.vapidPublicKey)
        });
      });
    });
  }

  startChat(nick) {
    let nickErrorText = document.querySelector('#startMenu .input-error');

    if (validNick(nick)) {
      nickErrorText.style.opacity = 0;
      this.nick = nick;
    } else {
      nickErrorText.style.opacity = 1;
      return false;
    }

    this.chat = new Chat(this.nick);

    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('chatbox').style.display = 'block';
  }
}

window.onload = () => {
  new Client();
};
