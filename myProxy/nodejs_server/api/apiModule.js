//apiModule
var http = require("http");
var Url = require("url");
exports.getSiteJson = function(siteName){
	var retData = {
		"text" : "Hi, API call for '" + siteName + "' succed!"
	};
	return JSON.stringify(retData);
};
exports.getSiteHTML = function(siteName, rsp){
	var clt = http.request(
		{
			hostname: Url.parse(siteName).hostname,
			port: 80,
			path: '/',
			method: 'GET'
		}, 
		function(siteRsp){
			siteRsp.on('end',function(){rsp.end();});
			siteRsp.pipe(rsp);
	});
};