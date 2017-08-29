const path= require('path');
const express = require('express');
const http = require('http');
const socketIO= require('socket.io');
const port = process.env.PORT||3000;
const publicPath= path.join(__dirname,'../public');

var {generateMessage,generateLocationMessage}= require('./utils/message');
var {isRealString}= require('./utils/validation');
var app= express();
var server= http.createServer(app);
//start accepting socket connection
var io= socketIO(server);

//create route for all static pages
app.use(express.static(publicPath));

//registering event handler
io.on('connection',(socket)=>{
  console.log("##SERVER##=====>New User Connected");

  //Chat Room Handling
  socket.on('join', (params, callback)=>{
    console.log(`name = ${params.name}; room = ${params.room}`);
    if(!isRealString(params.name) || !isRealString(params.room)){
      callback('Name and Room name are required');
    }

    //Assign user to a room
    socket.join(params.room);

    //Greeting message from server to a newly Connected user
    socket.emit('newMessage',generateMessage('server',`Hi ${params.name}.. Welcome`));

    //Broadcast message from server to all connected user in a room about a new joinee
    socket.broadcast.to(params.room).emit('newMessage',generateMessage("server",`${params.name} joined our chat room`));

    callback();
  });

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

  //Event listener for recieving location messages
  socket.on('createLocationMessage',(coords)=>{
    io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude, coords.longitude));
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
