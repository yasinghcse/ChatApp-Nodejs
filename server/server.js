const path= require('path');
const express = require('express');
const http = require('http');
const socketIO= require('socket.io');
const port = process.env.PORT||3000;
const publicPath= path.join(__dirname,'../public');
const {Users}= require('./utils/users');

var {generateMessage,generateLocationMessage}= require('./utils/message');
var {isRealString}= require('./utils/validation');
var app= express();
var server= http.createServer(app);
//start accepting socket connection
var io= socketIO(server);
var users= new Users();

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
    //remove existing user with same id and add the current one
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    //send event to all users to update the users listening
    io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    //Greeting message from server to a newly Connected user
    socket.emit('newMessage',generateMessage('server',`Hi ${params.name}.. Welcome`));
    //Broadcast message from server to all connected user in a room about a new joinee
    socket.broadcast.to(params.room).emit('newMessage',generateMessage("server",`${params.name} joined our chat room`));
    callback();
  });

  //Event for listening new message from Client
  socket.on('createMessage',function(data,callback){
    console.log('##SERVER##=====>Message from client : ', data);
    //Get this current user
    var user = users.getUser(socket.id);
    if(user && isRealString(data.text)){
      //Sending message  to all connected client including sender in a current room only
      io.to(user.room).emit('newMessage',generateMessage(user.name,data.text));
    }
    callback("Data is Valid !!!");
  });

  //Event listener for recieving location messages
  socket.on('createLocationMessage',(coords)=>{
    //Get this current user
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude, coords.longitude));
    }
  });

  //Event for disconnect
  socket.on('disconnect',()=>{
    console.log("##SERVER##=====>User Disconnected");
    //remove the user from the room
    var user= users.removeUser(socket.id);
    if(user){
      //broadcast the update user list
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      //broadcast a messages about this user existing
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
    }
  });
});


server.listen(port,()=>{
  console.log(`Listing at port ${port}`);
});

module.exports={app};
