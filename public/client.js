
// const { io } = require("socket.io-client");
const socket = io();

const n = prompt ('enter the chat with this name');

const messageInput = document.querySelector("#messageInp");
const messageContainer = document.querySelector(".container");
const sendContainer = document.querySelector("#send-container");


const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

sendContainer.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You:${message}`,"right");
    socket.emit('send',message);
    messageInput.value = '';

});

socket.emit('new-user-joined',n);

socket.on('user-joined', (name)=>{
    append(`${name} joined the chat`, "right");
})

socket.on('recieve', (data)=>{
    append(`${data.name} :${data.message}`, "left");
})

socket.on('left', (data)=>{
    append(`${data.name} has left the chat`, "left");
})