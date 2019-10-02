const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {
    generateMessage
} = require('./utils/message');
const {
    addUser,
    removeUser,
    getuser,
    getUsersInRoom
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicPathDirectory = path.join('__dirname', '../public');

app.use(express.static(publicPathDirectory));

// let count = 0;

io.on('connection', (socket) => {
    socket.on('message', (msg, callback) => {
        const user = getuser(socket.id);
        if (user) {
            const filter = new Filter();
            if (filter.isProfane(msg)) {
                return callback('Profanity is not allowed');
            }
            io.to(user.room).emit('show', generateMessage(user.username, msg));
            callback();
        }
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('show', generateMessage("Binu", `${user.username} has left`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    })
    socket.on('location', (latitude, longitude, callback) => {
        const user = getuser(socket.id);
        if (user) {
            const location = `https://google.com/maps?q=${latitude},${longitude}`
            io.to(user.room).emit('show-location',
                generateMessage(user.username, location));
            callback('Location shared')
        }
    })
    socket.on('join', (options, callback) => {
        const {
            error,
            user
        } = addUser({
            id: socket.id,
            ...options
        });
        if (error) {
            return callback(error);
        }
        socket.join(user.room);
        socket.emit('show', generateMessage("Binu", 'Welcome'));
        socket.broadcast.to(user.room).emit('show', generateMessage("Binu", `${user.username} has Joined the room`));
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
    })
})

server.listen(port, () => {
    console.log(`server is running at ${port}`);
})