const express = require('express');

const app = express();

const server = require('http').createServer(app);

const io = require('socket.io').listen(server);
let users = [];
let connections = [];

server.listen(process.env.PORT || 3000);
console.log('server started...');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', socket => {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', data => {
        users.splice(users.indexOf(socket.username), 1);
        updateUsername();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    socket.on('send message', data => {
        console.log('line 30: ', data);
        io.sockets.emit('new message', { msg: data, user: socket.username });
    });

    socket.on('new user', (data, callback) => {
        console.log('line 35: ', data);
        callback(true);
        socket.username = data;
        users.push(socket.username);
        console.log('line 39: ', users);
        updateUsername();
    });

    function updateUsername() {
        io.sockets.emit('get users', users);
    }
});
