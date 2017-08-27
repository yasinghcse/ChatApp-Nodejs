var socket= io();

socket.on('connect',function(){
  console.log('Client connected to server');

  //event emitter for new message to server -- only when connect is created
  socket.emit('createMessage',{
    from : 'client 1',
    text : 'This is a message from client'
  });
});

socket.on('disconnect',function(){
  console.log('Client disconnected from server');
});

//event listener for new message from server
socket.on('newMessage',function(data){
  console.log('####Client###====> Message from server : ', data);
});
