// Initialize io on client side
const socket = io();

// Enter the name to join chat prompt
const n = prompt ('enter the chat with this name');

const messageInput = document.querySelector("#messageInp");
const messageContainer = document.querySelector(".container");
const sendContainer = document.querySelector("#send-container");
const stop = document.querySelector(".stop");
let start = document.querySelector(".start");

var uploadurl = "";


// function to append text messages in messageContainer
const append = (person,message, position)=>{
    const messageElement = document.createElement('div');
    const btn = document.createElement('button');
    messageElement.innerHTML = `${person}:${message}`;
    btn.innerHTML = "Speak" ;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageElement.append(btn);

    btn.addEventListener('click', ()=>{
        speak(message);
    })

    messageContainer.append(messageElement);


}


// function to append audio message in messageContainer
const appendAudio = (audio,text, position)=>{

    const div = document.createElement('div');
    const messageElement = document.createElement('audio');
    const btn = document.createElement('button');
    
    messageElement.controls=true;
    messageElement.src = audio;
    btn.innerHTML = "Convert to Text" ;

    div.classList.add('message');
    div.classList.add(position);
    div.innerHTML = "Audio File";

    div.appendChild(messageElement);
    div.append(btn);
    btn.addEventListener('click', ()=>{
      btn.style.display = 'none'
      div.append(text);

    })
    messageContainer.append(div);

}


// Add event listener to submit button
sendContainer.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append("You",message,"right");
    socket.emit('send',message);
    messageInput.value = '';

});



socket.emit('new-user-joined',n);

socket.on('user-joined', (name)=>{
    append("",`${name} joined the chat`, "right");
})

socket.on('recieve', (data)=>{
    append(data.name,data.message, "left");
})

socket.on('left', (data)=>{
    append("",`${data.name} has left the chat`, "left");
})


// permission for audio recording from browser
let constraintObj = {
    audio : true,
    video : false
};


// start recording on clicking start button
start.addEventListener('click',(ev)=>{
   

    navigator.mediaDevices.getUserMedia(constraintObj).
    then(function(mediaStreamObj){
        const audio = document.querySelector("#a1");

        audio.srcObject = mediaStreamObj;

        
        let stop = document.querySelector(".stop");
        

        let mediaRecorder = new MediaRecorder(mediaStreamObj);
        let chunks = [];

        
        mediaRecorder.start();
        console.log(mediaRecorder.state);
       

        stop.addEventListener('click', function(ev){
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
        });


        mediaRecorder.addEventListener('dataavailable',(ev)=>{
            chunks.push(ev.data);
        });

        mediaRecorder.onstop = (ev)=>{

          const blob = new Blob(chunks, { 'type' :'audio/mp3;' });
          //Creating a file from blob tat will be sent AWS S3 bucket
          var file = new File([blob], "my_audio_2.mp3",{type:"audio/mp3", lastModified:new Date().getTime()})
          console.log(file);
          chunks = [];
          audioURL = window.URL.createObjectURL(blob);
          appendAudio(audioURL,"Your text",'right');
          // Passing file to get signed request 
          getSignedRequest(file); 
        }
        


    }).catch(function(err) { 
            console.log(err.name, err.message); 
        });
})


    socket.on('recieve-audio',(data)=>{
        appendAudio(data.audio,data.text,'left');
    })


    function getSignedRequest(file){
      console.log(file.name,file.type);
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
      xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        console.log(response);
        uploadFile(file, response.signedRequest, response.url);
        console.log(response.url);
      }
      else{
        alert('Could not get signed URL.');
      }
    }
  };
xhr.send();
}

function uploadFile(file, signedRequest, url){
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
    if(xhr.status === 200){

      //alert ("uploaded");
      // Url recieved from S3 bucket
     socket.emit('stop',url);
      }
    else{
      alert('Could not upload file.');
    }
  }
};
xhr.send(file);
}

// Text to audio feature

    const synth = window.speechSynthesis;

    const speak = (textInput) => {
        // Check if speaking
        if (synth.speaking) {
          console.error('Already speaking...');
          return;
        }
        if (textInput !== '') {
          // Get speak text
          const speakText = new SpeechSynthesisUtterance(textInput);
      
          // Speak end
          speakText.onend = e => {
            console.log('Done speaking...');
            
          };
      
          // Speak error
          speakText.onerror = e => {
            console.error('Something went wrong');
          };

          synth.speak(speakText);
        }
      };







      