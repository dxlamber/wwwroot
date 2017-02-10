var baseDir = "./html";

var http = require('http');
var Url = require('url');
var fs = require('fs');

var srv;

srv = http.createServer();
src.on('request', function(cReq, cRes){
	//1. analysis request of reqeust client
	//2. send to final server
	//3. use the response of the final server as response to request client.
	/* Use pipe to simplify the process
		client request -->  proxy create request  --> final server reqeust process
		client response <--- proxy get response <-- final server created an response
	 */
	var uObj = Url.parse(cReq.url);
	var opts = {
			hostname: uObj.hostname,
			port: uObj.port || 80,
			path: uObj.path,
			method: uObj.method,
			headers: cReq.headers
	};
	var clientReqObjWriteStream = http.request(opts, function(finalSiteRsp){
		cRes.writeHead(finalSiteRsp.statusCode, finalSiteRsp.headers);
		finalSiteRsp.pipe(cRes);
	});
	cReq.pipe(clientReqObjWriteStream);
});
srv.listen(3031, "localhost");
console.log('HTTP server is listening on 3030 of "localhost"!\n');