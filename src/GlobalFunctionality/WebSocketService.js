import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

const connect = (onMessageReceived) => {
  const socket = new SockJS('http://localhost:8080/websocket-endpoint');
  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {},
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = function (frame) {
    console.log('Connected: ' + frame);
    subscribeToTopic(onMessageReceived);
  };

  stompClient.activate();
};

const subscribeToTopic = (onMessageReceived) => {
  if (!stompClient) {
    return;
  }

  stompClient.subscribe('/topic/tickets', message => {
    onMessageReceived(JSON.parse(message.body));
  });
};

const disconnect = () => {
  if (stompClient !== null) {
    stompClient.deactivate();
  }
  console.log("Disconnected");
};

export { connect, disconnect };
