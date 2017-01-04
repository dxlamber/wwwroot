var net = require('net');
var cltskt;


cltskt = net.connect(3030,"localhost",()=>{
	console.log('TCP connect is established success!\n');
	cltskt.write("Hi, World!\n");
	console.log('Send an string "Hi, World!\\n" to peer.\n');
	cltskt.end();
	console.log('Send an FIN packet to peer.\n');
});
console.log('TCP connect request is send out to peer!\n');

cltskt.on('data', (data)=>{
	console.log("Received data from peer: \n");
	console.log(data.toString());
});
cltskt.on('end', ()=>{
	console.log("Reveiveed FIN packet from peer ended: \n");
});
