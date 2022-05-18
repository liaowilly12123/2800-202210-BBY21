import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js';

const socket = io();

socket.on('connection', (msg) => displayMessage(msg));
socket.on('msg', (msg, id) => displayMessage(`${id}: ${msg}`));

document.getElementById('send').addEventListener('click', () => {
  socket.emit(
    'send-message',
    document.getElementById('msg').value,
    document.getElementById('room').value
  );
});

document.getElementById('join').addEventListener('click', () => {
  socket.emit('join-room', document.getElementById('room').value);
});

function displayMessage(msg) {
  const msgNode = document.createElement('div');
  msgNode.innerHTML = msg;

  document.getElementById('messages').appendChild(msgNode);
}
