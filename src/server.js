require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
});
const net = require('net');
const clients = [];
const nicknames = [];

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const server = net.createServer((socket) => {
  console.log(`Connected with ${socket.remoteAddress}:${socket.remotePort}`);

  socket.write('NICK');

  socket.once('data', (data) => {
    const nickname = data.toString().trim();
    nicknames.push(nickname);
    clients.push(socket);

    console.log(`Nickname is ${nickname}`);
    broadcast(`${nickname} joined!`);
    socket.write('Connected to server!');

    socket.on('data', (message) => {
      broadcast(message.toString());
    });

    socket.on('end', () => {
      const index = clients.indexOf(socket);
      if (index !== -1) {
        clients.splice(index, 1);
        const removedNickname = nicknames.splice(index, 1)[0];
        broadcast(`${removedNickname} left!`);
      }
    });

    socket.on('error', (err) => {
      console.error('Error:', err.message);
    });
  });
});

function broadcast(message) {
  clients.forEach((client) => {
    client.write(message + '\n');
  });
}

server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});
