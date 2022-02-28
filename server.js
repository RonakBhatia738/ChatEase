const express = require("express");
const app = express();
app.use(express.static("public"));

const aws = require('aws-sdk');
aws.config.region = 'us-east-1';
const S3_BUCKET = process.env.S3_BUCKET_NAME;
// aws.config.update({
//     "region" : 'us-east-1',
//     accessKeyId: "AKIAR7IJKZ2C7QRUWL5O",
//     secretAccessKey: "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",
// })

// Creating server socket.io
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Assembly AI API(Audio to Text Feature)
const axios = require("axios");
const fs = require("fs");
const { url } = require("inspector");
const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: "a20a76b408d4417a9fe398cf96099e07",
        "content-type": "application/json",
        "transfer-encoding": "chunked",
    },
});

// Initializing users array
const users = {};
var id ='';
var text = 'initial text';
var status = '';


app.get('/', function(req,res){
    res.sendFile(__dirname+'/index.html');
});

// GET signed request
app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    console.log(req.query['file-name']);
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 3000,
      ContentType: fileType,
      ACL: 'public-read'
    };
  
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      console.log(returnData);
      res.write(JSON.stringify(returnData));
      res.end();
    });
  });




io.on('connection',(socket)=>{
    socket.on('new-user-joined', function(name){
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        console.log(`${name} joined the chat`);
    });

    socket.on('send',(message)=>{
        socket.broadcast.emit('recieve',{name:users[socket.id], message:message});
    });

    socket.on('disconnect',(data)=>{
        socket.broadcast.emit('left',{name:users[socket.id]});
    });

    socket.on('stop',(url)=>{
    
           assembly
           .post("/transcript", {
            audio_url:`${url}`
           })
           .then((res) => {
              console.log(`this is id : ${res.data.id}`);
               id = res.data.id;            
           }).then(()=>{
            assembly
            .get(`/transcript/${id}`)
            .then((resp) => {
            console.log(resp.data);
             status = resp.data.status;
             console.log(status);
            text = resp.data.text;
            console.log(text);
        }).then(
            function gettext (){

                assembly
            .get(`/transcript/${id}`)
            .then((resp) => {
             status = resp.data.status;
             text = resp.data.text;
            })
                if(status=== "completed"){
                    console.log(text);
                    socket.broadcast.emit('recieve-audio',{name:users[socket.id], audio:url,text:text})
                }
                else{
                    console.log("repeating");
                    setTimeout(gettext, 5000);
                }
               
            }
        )
           
           
        .catch((err) => console.error(err));
           })
           .catch((err) => {});

    });
});





//server.listen(3000,()=>console.log("Server running at port 3000"));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
server.listen(process.env.PORT,()=>console.log("Server running at port 3000"));
