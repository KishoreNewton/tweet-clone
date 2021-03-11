let connected = false;
let socket = io('http://localhost:3000');

socket.emit('setup', userLoggedIn);

socket.on('connected', () => (connected = true));
socket.on('message received', newMessage => messageReceived(newMessage));

socket.on('notification received', newNotification => {});

function emitNoitification(userId) {
  if (userId === userLoggedIn._id) return;

  socket.emit('notification received', userId);
}
