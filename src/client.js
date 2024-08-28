require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env'),
});
const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What's your name: ", (nickname) => {
  const client = new net.Socket();
  client.connect(process.env.PORT, process.env.HOST, () => {
    client.write(nickname);

    client.on('data', (data) => {
      console.log(data.toString().trim());
    });

    client.on('error', (err) => {
      console.error('Error:', err.message);
    });
  });

  rl.on('line', (input) => {
    const message = `${nickname}: ${input}`;
    client.write(message);
  });
});
