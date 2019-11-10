var express = require('express'); //framework
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
changes =[];


//In terminal, accounce that the pairpal chat feature is on 
server.listen(process.env.PORT || 3000);
console.log('PairPal matching...');

app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection',function(socket){
	changes.push(socket);
	console.log('Processing: %s change', changes.length);//aim for debuging, show the number of commands


//Usually, this part is not underused. It makes sure the login feature is disconnected so that the chat may not be interrupted
	socket.on('disconnnect',function(data){
		users.splice(users.indexOf(socket.username),1);
		io.sockets.emit('get users',users);
		changes.splice(changes.indexOf(socket),1);
	});
	
//Send message (add new message to messages' list)
	socket.on('send message',function(data){
		console.log(data);//aim for debug 
		io.sockets.emit('new message',{messageList:data,userList:socket.username});//messageList and userList are called in index.html
	});

//Login (add new users to users' list)
	socket.on('new user',function(data, callback){
		callback(true);
		socket.username = data;
		console.log(socket.username);//check who have been added in terminal
		users.push(socket.username);
		io.sockets.emit('get users',users);
	});
});