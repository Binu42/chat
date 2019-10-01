const socket = io()

// socket.on('countUpdated', (count)=> {
//     console.log('count updated', count);
// });

// document.querySelector('#increment').addEventListener('click', ()=> {
//     console.log('clicked');
//     socket.emit('increment');
// })

const $chatForm = $('#chat');
const $message = $('#message');
const $formButton = $('#send');
const $locationBtn = $('#location');
const $messages = $('#messages');
const messageTemplate = $('#message-template').html();
const locationTemplate = $('#location-template').html();

socket.on('show', (message) => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    });
    $messages.append(html);
})

socket.on('show-location', details => {
    const html = Mustache.render(locationTemplate, {
        location: details.text,
        createdAt: moment(details.createdAt).format("h:mm a")
    });
    $messages.append(html);
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
                return console.log(error);
            }
            console.log('Message Delivered');
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
                console.log(`message is ${msg}`);
            });
        })
    })
})