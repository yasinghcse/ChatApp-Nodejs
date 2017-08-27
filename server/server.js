const path= require('path');
const express = require('express');
const http = require('http');
const socketIO= require('socket.io');
const port = process.env.PORT||3000;
const publicPath= path.join(__dirname,'../public');
var app= express();
var server= http.createServer(app);
//start accepting socket connection
var io= socketIO(server);

//create route for all static pages
app.use(express.static(publicPath));

//registering event handler
io.on('connection',(socket)=>{
  console.log("##SERVER##=====>New User Connected");

  //Event for sending message from server to client
  socket.emit('newMessage',{
    from: "server",
    text : "Hi... This is a message from server",
    createdAt: new Date()
  });

  //Event for listening new message from Client
  socket.on('createMessage',function(data){
    console.log('##SERVER##=====>Message from client : ', data);
  });

  //Event for disconnect
  socket.on('disconnect',()=>{
    console.log("##SERVER##=====>User Disconnected");
  });
});

server.listen(port,()=>{
  console.log(`Listing at port ${port}`);
});

module.exports={app};
