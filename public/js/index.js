var socket= io();

socket.on('connect',function(){
  console.log('Client connected to server');

  //event emitter for new message to server -- only when connect is created
  // socket.emit('createMessage',{
  //   from : 'client 1',
  //   text : 'This is a message from client'
  // },function(data){
  //   console.log('####Client###====> Message from server : ',data);
  // });
});

socket.on('disconnect',function(){
  console.log('Client disconnected from server');
});

//event listener for new message from server
socket.on('newMessage',function(data){
  console.log('####Client###====> Message from server : ', data);
  var li=jQuery('<li></li>');
  li.text(`${data.from}: ${data.text}`);
  jQuery('#messages').append(li);
});

//displaying user chat messages
jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from : 'client',
    text : jQuery('[name=message]').val()
  },function(){
  });
});

//sharing user location
var locationButton= jQuery('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){
      return alert('Geolocation not supported on your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position){
      socket.emit('createLocationMessage',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },function(){
      alert('Unable to fetch location');
    });
});

//Event listener for recieving shared client information
socket.on('newLocationMessage',function(message){
  var li= jQuery('<li></li>');
  var a= jQuery('<a target= "_blank"> My Current Location</a>');
  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});
