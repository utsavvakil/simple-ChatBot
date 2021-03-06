/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey, Hello I am a sentient robot from the future. I want to get to know you"); //We start with the introduction;
  setTimeout(timedQuestion, 4000, socket,"What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  answer= 'Hello ' + input +'. Nice to meet you.';// output response
  waitTime =2500;
  question = 'Which year is it currently?';			    	// load next question
  }
  else if (questionNum == 1) {
  answer= 'Really ' + input + '? So that means I will be created in: ' + (2500-parseInt(input)) + ' years';// output response
  waitTime =2500;
  question = 'Who is the current President in your country?';			    	// load next question
  }
  else if (questionNum == 2) {
  answer= ' Oh ' + input +'! I remember! Quite a ride that was!';
  waitTime =2500;
  question = ' Which color do you like?';			    	// load next question
  }
  else if (questionNum == 3) {
  answer= 'Ok, ' + input+' it is.';
  socket.emit('changeBG',input.toLowerCase());
  waitTime = 2500;
  socket.emit('changeFont','white');
  question = 'So, do you believe in God?';			    	// load next question
  }
  else if (questionNum == 4) {
    if(input.toLowerCase()==='yes'|| input===1){
      answer = 'Ah! A religious person. Nice!';
      waitTime =2500;
      question = 'Whats your favorite place?';
    }
    else if(input.toLowerCase()==='no'|| input===0){
        socket.emit('changeFont','white'); /// we really should look up the inverse of what we said befor.
        answer='Ah! An Athiest. Nice!'
        question='What\'s your favorite place?';
        waitTime =2500;
    }
  // load next question
  }
  else{
    answer= 'I have nothing more to say!';// output response
    waitTime =0;
    question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
