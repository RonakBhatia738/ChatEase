
// const { io } = require("socket.io-client");
const socket = io();

const n = prompt ('enter the chat with this name');

const messageInput = document.querySelector("#messageInp");
const messageContainer = document.querySelector(".container");
const sendContainer = document.querySelector("#send-container");
const stop = document.querySelector(".stop");


const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

const appendAudio = (audio, position)=>{
    const messageElement = document.createElement('audio');
    messageElement.controls=true;
    messageElement.src = audio;
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





let constraintObj = {
    audio : true,
    video : false
};

let start = document.querySelector(".start");

start.addEventListener('click',(ev)=>{
    navigator.mediaDevices.getUserMedia(constraintObj).
    then(function(mediaStreamObj){
        const audio = document.querySelector("#a1");

        audio.srcObject = mediaStreamObj;

        // video.onloadedmetadata = function(ev){
        //     video.play();
        // } 

        // let start = document.querySelector(".start");
        let stop = document.querySelector(".stop");
        // let a2 = document.querySelector("#a2");

        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        let chunks = [];

        //start.addEventListener('click', function(ev){
            mediaRecorder.start();
            console.log(mediaRecorder.state);
        // });

        stop.addEventListener('click', function(ev){
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            
        });

        mediaRecorder.addEventListener('dataavailable',(ev)=>{
            chunks.push(ev.data);
        });

        mediaRecorder.onstop = (ev)=>{
                //  const a2 = document.createElement('audio');
                //  a2.controls = true;
                 const blob = new Blob(chunks, { 'type' :'audio/mp3;' });
                 chunks = [];
                 const audioURL = window.URL.createObjectURL(blob);
                //  a2.src = audioURL;
                appendAudio(audioURL,'right');
                 socket.emit('stop',audioURL);
            }
        


    }).catch(function(err) { 
            console.log(err.name, err.message); 
        });
})


    socket.on('recieve-audio',(data)=>{
        appendAudio(data.audio,'left');
    })