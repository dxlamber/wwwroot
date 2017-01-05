var net = require('net');
var srv,gBuf;


srv = net.createServer();
console.log('TCP server is created!\n');
srv.on('connection', function(sck){
	console.log('TCP connection is established successed!\n');
	gBuf = Buffer.alloc(0);
	
	
	var onWriteSocketFunc = (function(sk){
		return function(data){
			console.log("Write data to peer: \n");
			console.log(data.toString());
			sk.write(data);
		};
	})(sck);
	var onEndSocketFunc = (function(sk){
		return function(){
			console.log("Send FIN packet to peer.\n");
			sk.end();
		};
	})(sck);
	sck.on('data',function(buf){
		console.log("Reveiveed data from peer: \n");
		console.log(buf.toString());
		var tLen = gBuf.length + buf.length;
		gBuf = Buffer.concat([gBuf, buf], tLen);
		onWriteSocketFunc(buf);
	});
	
	sck.on('end', function(){
		console.log("Reveiveed FIN packet from peer.\n");
		onEndSocketFunc();
		srv.close();
		console.log("Server closed.\n");
	});
	
	
});
srv.listen(3030,"localhost");
console.log('TCP server is listening on 3030!\n');