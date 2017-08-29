var socket= io();

socket.on('connect',function(){
  var params = jQuery.deparam(window.location.search);
  socket.emit('join',params,function(err){
    if(err){
      alert(err);
      window.location.href ='/';
    }
    else{
      console.log('No Error');
    }
  });;
});

//update user list event
socket.on('updateUserList',function(users){
  var ol = jQuery('<ol></ol>');
  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});

socket.on('disconnect',function(){
  console.log('Client disconnected from server');
});

//autoscrolling feature
function scrollToBottom(){
  //Selectors
  var messages= jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  //Heights
  var clientHeight=messages.prop('clientHeight');
  var scrollTop=messages.prop('scrollTop');
  var scrollHeight=messages.prop('scrollHeight');
  var newMessageHeight=newMessage.innerHeight();
  var lastMessageHeight=newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=scrollHeight){
    console.log("hiiiiiiiiiiiiiii");
    messages.scrollTop(scrollHeight);
  }
}

//event listener for new message from server
socket.on('newMessage',function(data){
  console.log('####Client###====> Message from server : ', data);
  var formattedTime = moment(data.createdAt).format('h:mm a');
  //regular method
  // var li=jQuery('<li></li>');
  // li.text(`${data.from} ${formattedTime}: ${data.text}`);
  //Best Practise to render templte
  var template = jQuery('#message-template').html();
  var html= Mustache.render(template,{
    from: data.from,
    text: data.text,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

//displaying user chat messages
jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  socket.emit('createMessage',{
    from : 'client',
    text : jQuery('[name=message]').val()
  },function(){
      text : jQuery('[name=message]').val('')
  });
});

//sharing user location
var locationButton= jQuery('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){
      return alert('Geolocation not supported on your browser');
    }
    //disable send location button and change it text
    locationButton.attr('disabled','disabled').text('Sending Location....');

    navigator.geolocation.getCurrentPosition(function(position){
      //enable send location button as position is fetched and change the text back to its original
      locationButton.removeAttr('disabled').text('Send Location');
      socket.emit('createLocationMessage',{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },function(){
      //enable send location button as position is fetched and change the text back to its original
      locationButton.removeAttr('disabled').text('Send Location');
      alert('Unable to fetch location');
    });
});

//Event listener for recieving shared client information
socket.on('newLocationMessage',function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  // var li= jQuery('<li></li>');
  // var a= jQuery('<a target= "_blank"> My Current Location</a>');
  // li.text(`${message.from}: ${formattedTime}`);
  // a.attr('href', message.url);
  // li.append(a);

  var template = jQuery('#location-message-template').html();
  var html= Mustache.render(template,{
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});
