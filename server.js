const express = require("express");

const app = express();

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.use(express.static("public"));

const users = {};

app.get('/', function(req,res){
    res.sendFile(__dirname+'/index.html');
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
});

















server.listen(3000,()=>console.log("Server running at port 3000"));