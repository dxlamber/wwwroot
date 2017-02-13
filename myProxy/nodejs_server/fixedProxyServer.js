var http = require('http');
var Url = require('url');

var srv;

srv = http.createServer();
srv.on('request', function(cReq, cRes){
	//1. analysis request of reqeust client
	//2. send to final server
	//3. use the response of the final server as response to request client.
	/* Use pipe to simplify the process
		client request -->  proxy create request  --> final server reqeust process
		client response <--- proxy get response <-- final server created an response
	 */
	var uObj = Url.parse(cReq.url);
	console.log("client request URL: " + cReq.url);
	console.log("client request port: " + uObj.port);
	var opts = {
			hostname: cReq.headers.host.split(':')[0],
			port: 80,
			path: uObj.path,
			method: cReq.method,
			headers: cReq.headers
	};
	logObj(opts);
	var clientReqObjWriteStream = http.request(opts, function(finalSiteRsp){
		cRes.writeHead(finalSiteRsp.statusCode, finalSiteRsp.headers);
		finalSiteRsp.pipe(cRes);
	});
	clientReqObjWriteStream.on('error', function(e){cRes.end();});
	cReq.pipe(clientReqObjWriteStream);
	clientReqObjWriteStream.end();
});
srv.listen(3030);
console.log('HTTP server is listening on 3030\n');


function logObj(obj)
{
	console.log("Object content: ");
	for(var p in obj)
	{
		console.log("\t"+p+": " + obj[p]);
	}
	console.log("\n");
}