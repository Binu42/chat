const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicPathDirectory = path.join('__dirname', '../public');

app.use(express.static(publicPathDirectory));

let count = 0;

io.on('connection', (socket)=> {
    console.log('New websocket connection');
    socket.emit('countUpdated', count);

    socket.on('increment', ()=> {
        count++
        io.emit('countUpdated', count);
    })
})

server.listen(port, ()=> {
    console.log(`server is running at ${port}`);
})