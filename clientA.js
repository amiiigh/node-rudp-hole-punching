#!/usr/bin/env node
// based on http://www.bford.info/pub/net/p2pnat/index.html
var dgram = require('dgram');
var rudp = require('rudp');
var fs = require('fs');
var socket = dgram.createSocket('udp4');
var serverPort = 33333;
var serverHost = '80.240.22.240';
var keepAliveInterval = null;
socket.bind(10000 + Math.floor(Math.random() * (65535 - 10000)))

socket.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    try {
    	var publicEndpointB = JSON.parse(message);
    	sendMessageToB(publicEndpointB.address, publicEndpointB.port);
    } catch(err) {
    	console.log(err)
    }
});

function sendMessageToS () {
	var message = new Buffer('A');
	socket.send(message, 0, message.length, serverPort, serverHost, function (err, nrOfBytesSent) {
	    if (err) return console.log(err);
	    console.log('UDP message sent to ' + serverHost +':'+ serverPort);
	    // socket.close();
	});
}

function sendHeartBeat () {
	var message = new Buffer('T')
	socket.send(message, 0, message.length, serverPort, serverHost, function (err, nrOfBytesSent) {
	    if (err) return console.log(err);
	    console.log('UDP HeartBeat ' + serverHost +':'+ serverPort);
	});	
}

function startHeartBeat () {
    if (keepAliveInterval) {
      return
    }
    keepAliveInterval = setInterval(function () { sendHeartBeat()}, 2000)
}

var counter = 0;
function sendMessageToB (address, port) {
	// var client = new rudp.Client(socket, address, port)
	// var expected = null;
	// client.on('data', function (data) {
	// 	console.log(data)
	// })
	console.log(socket.address().port, socket.address().address)
	if(counter == 5) return;
	var message = new Buffer(counter++ + ': Hello B!');
	socket.send(message, 0, message.length, port, address, function (err, nrOfBytesSent) {
	    if (err) return console.log(err);
	    console.log('UDP message sent to B:', address +':'+ port);

	    setTimeout(function () {
	    	sendMessageToB(address, port);
	    }, 2000);
	});
}
	// try {
	// 	socket.send(message)
	// 	console.log('UDP message sent to B:', address +':'+ port);
	// 	setTimeout(function () {sendMessageToB(address, port);}, 2000);
	// } catch(err) {
	// 	console.log(err);
	// 	process.exit(1);
	// }


sendMessageToS();
// startHeartBeat();