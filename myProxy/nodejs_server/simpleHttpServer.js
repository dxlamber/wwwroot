var bDebug = false;
var baseDir = "./html";
var baseApiDir = "./html";

var http = require('http');
var Url = require('url');
var fs = require('fs');
var apiM = require('./api/apiModule.js');
var srv,gBuf;



srv = http.createServer();
console.log('HTTP server is created!\n');
srv.on('request', function(req, resp){
	console.log('HTTP server get a HTTP reqeust package from client:\n');
	if(bDebug)
	{
		console.log('HTTP server send back data to client test:\n');
		var body = '<div>Method: ' + req.method + '</div>';
		var bOdd = false;
		body += req.rawHeaders.reduce(function(prev, curval){
			if(bOdd)
			{
				bOdd = !bOdd;
				return prev + curval + '</div>';
			}
			else
			{
				bOdd = !bOdd;
				return prev + '<div>' + curval + ': ';
			}
		},"");
		body += '<div>Body: We only debug the header area.</div>';
		console.log("URL: "+ req.url + "\n" + body);
		resp.writeHead(200, {
		  'Content-Length': Buffer.byteLength(body),
		  'Content-Type': 'text/html' });
		resp.end(body);
	}
	else
	{
		var objUrl = Url.parse(req.url, true);
		console.log("Client requested url: " + req.url);
		var relativePath = baseDir + (objUrl.pathname == "/" ? "/index.html" : objUrl.pathname);
		console.log("Client requested file path: " + relativePath);
		if(fs.existsSync(relativePath))//return content of the file
		{
			var fss = fs.createReadStream(relativePath);
			fss.on('end', function(){resp.end();});
			fss.pipe(resp);
		}
		else if(objUrl.pathname.startsWith("/api/"))//web api interface
		{
			var funcName = objUrl.pathname.substring(5, objUrl.pathname.length);
			var qObj = objUrl.query;
			switch(funcName)
			{
				case "getSite":
					resp.end(apiM["getSite"](qObj.name));
					break;
				default:
					resp.writeHead(404, {
						'Content-Length': Buffer.byteLength("Hello, 404 World!"),
						'Content-Type': 'text/html' });
					resp.end('Hello, 404 World!');
					break;
			}
		}
		else//return 404
		{
			resp.writeHead(404, {
				'Content-Length': Buffer.byteLength("Hello, 404 World!"),
				'Content-Type': 'text/html' });
			resp.end('Hello, 404 World!');
		}
	}
});
srv.listen(3030,"localhost");
console.log('HTTP server is listening on 3030!\n');