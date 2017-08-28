const path= require('path');
const express = require('express');
const http = require('http');
const socketIO= require('socket.io');
const port = process.env.PORT||3000;
const publicPath= path.join(__dirname,'../public');

var {generateMessage}= require('./utils/message');
var app= express();
var server= http.createServer(app);
//start accepting socket connection
var io= socketIO(server);

//create route for all static pages
app.use(express.static(publicPath));

//registering event handler
io.on('connection',(socket)=>{
  console.log("##SERVER##=====>New User Connected");

  //Greeting message from server to a newly Connected user
  socket.emit('newMessage',generateMessage('server','Hi New User.. Welcome'));

  //Broadcast message from server to all connected user about a new joinee
  socket.broadcast.emit('newMessage',generateMessage("server","New User..connected to our chat room"));

  //Event for listening new message from Client
  socket.on('createMessage',function(data,callback){
    console.log('##SERVER##=====>Message from client : ', data);
    //broadcasting message to all connected client except sender
    // socket.broadcast.emit('newMessage',{
    //   from: data.from,
    //   text : data.text,
    //   createdAt: new Date()
    // });

    //Sending message  to all connected client including sender
    io.emit('newMessage',generateMessage(data.from,data.text));
    callback("Data is Valid !!!");
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
