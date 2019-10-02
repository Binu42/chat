const socket = io()

// Elements
const $chatForm = $('#chat');
const $message = $('#message');
const $formButton = $('#send');
const $locationBtn = $('#location');
const $messages = $('#messages');
const $roomUsers = $('#roomUsers')

// Options
var {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})
// Templates
const messageTemplate = $('#message-template').html();
const locationTemplate = $('#location-template').html();
const roomUsersTemplate = $('#roomUsers-template').html();

const autoscroll = () => {
    $messages.scrollTop($messages.height());
}

socket.on('show', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    });
    $messages.append(html);
    autoscroll();
})

socket.on('show-location', details => {
    const html = Mustache.render(locationTemplate, {
        username: details.username,
        location: details.text,
        createdAt: moment(details.createdAt).format("h:mm a")
    });
    $messages.append(html);
    autoscroll();
})

socket.on('roomUsers', ({room, users})=> {
    const html = Mustache.render(roomUsersTemplate, {
        room,
        users
    })
    $roomUsers.html(html);
})

$(() => {
    $chatForm.submit(event => {
        event.preventDefault();
        $formButton.attr('disabled', true)
        const message = $message.val();
        socket.emit('message', message, (error) => {
            $formButton.attr('disabled', false);
            $message.val('');
            $message.focus();
            if (error) {
                return alert(error);
            }
        });
    })
})

$(() => {
    $locationBtn.on('click', () => {
        if (!navigator.geolocation) {
            module('Your browser doesn\'t support geolocation');
        }
        $locationBtn.attr('disabled', true);
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit('location', position.coords.latitude, position.coords.longitude, (msg) => {
                $locationBtn.attr('disabled', false);
            });
        })
    })
})

socket.emit('join', {username, room}, error=>{
    alert(error);
    location.href = '/';
})