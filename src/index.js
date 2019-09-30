const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage} = require('./utils/message');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicPathDirectory = path.join('__dirname', '../public');

app.use(express.static(publicPathDirectory));

// let count = 0;

io.on('connection', (socket)=> {
    socket.emit('show', generateMessage('Welcome'));
    socket.broadcast.emit('show', generateMessage('new user is Joined!'));
    socket.on('message', (msg, callback)=> {
        const filter = new Filter()
        if(filter.isProfane(msg)){
            return callback(generateMessage('Profanity is not allowed'));
        }
        io.emit('show', msg);
    })
    socket.on('disconnect', ()=> {
        io.emit('show', generateMessage("User get disconnected"));
    })
    socket.on('location', (latitude, longitude, callback) => {
        io.emit('show-location', {message: 'Location shared', location: `https://google.com/maps?q=${latitude},${longitude}`});
        callback('Location shared')
    })
})

server.listen(port, ()=> {
    console.log(`server is running at ${port}`);
})