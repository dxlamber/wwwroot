//apiModule
exports.getSiteJson = function(siteName){
	var retData = {
		"text" : "Hi, API call for '" + siteName + "' succed!"
	};
	return JSON.stringify(retData);
};