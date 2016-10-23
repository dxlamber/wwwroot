var GlobalEnv = {};
GlobalEnv["+"] = function(){
 return [].reduce.call(arguments, function(pv, cv){return pv+cv;}, 0);
};
GlobalEnv["*"] = function(){
 debugger;
 return [].reduce.call(arguments, function(pv, cv){return pv*cv;}, 1);
};
GlobalEnv["-"] = function(){
 if(arguments.length != 2)
 {
	debugger;
	return;
 }

 return arguments[0] - arguments[1];
};
GlobalEnv["/"] = function(){
 if(arguments.length != 2)
 {
	debugger;
	return;
 }

 return arguments[0] / arguments[1];
};
GlobalEnv.note = function(obj){
 return obj.toNote();
};