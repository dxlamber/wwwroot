var baseDir = "./html";

var http = require('http');
var Url = require('url');
var fs = require('fs');
var apiM = require('./api/apiModule.js');
var srv;



srv = http.createServer();
srv.on('request', function(req, resp){
	console.log('HTTP server get a HTTP reqeust package from client:\n');
	
	var followProc = function(relPath, paras, data, req, resp){
		var objUrl = Url.parse(req.url, true);
		if(fs.existsSync(relPath))//return content of the file
		{
			var fss = fs.createReadStream(relPath);
			fss.on('end', function(){resp.end();});
			fss.pipe(resp);
		}
		else if(objUrl.pathname.startsWith("/api/"))//web api interface
		{
			var funcName = objUrl.pathname.substring(5, objUrl.pathname.length);
			var qObj = objUrl.query;
			switch(funcName)
			{
				case "getSiteJson":
					var jsonData = JSON.parse(data);
					tUrl = jsonData.tUrl;
					resp.end(apiM["getSiteJson"](tUrl));
					break;
				case "getSiteHTML":
					var jsonData = JSON.parse(data);
					tUrl = jsonData.tUrl;
					apiM["getSiteHTML"](tUrl, resp);
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
	};

	/* 
	1. Get params in URL.
	2. Get data posted.
	3. follow process with the params and data.
	 */
	var relativePath = "";
	var params = [];
	var postData = "";
	var objUrl = Url.parse(req.url, true);
	relativePath = baseDir + (objUrl.pathname == "/" ? "/index.html" : objUrl.pathname);
	params = objUrl.query;
	if(req.method == "GET")
		followProc(relativePath, params, postData, req, resp);
	else //POST
	{
		postData = '';
		req.on('data', function(bf){
			postData += bf;
		});
		req.on('end', function(){
			followProc(relativePath, params, postData, req, resp);
		});
	}

});
srv.listen(3030,"localhost");
console.log('HTTP server is listening on 3030!\n');