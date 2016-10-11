function ComputedObj(){};
ComputedObj.prototype.getRef = function(){ return this;};



function Atom(atomWord){
 this.type = atomWord.type;
 this.value = atomWord.val;
};
Atom.prototype.getVal = function(){
	if(this.type == "Number")
		return parseFloat(this.value);
	return this.value;
};
function Exp(listWordArray){
 this.operator = null;
 this.operandObjArr = [];
 this.initByNotation(strNotation);
};
Exp.prototype.initByNotation = function(strNt)
{
 var thisRef = this;
 var optName = strNt.split(' ')[0].substr(1);
 switch(optName)
 {
  case '+':
   this.operator = GlobalEnv.add
   break;
  case '-':
   this.operator = GlobalEnv.minus
   break;
  case '*':
   this.operator = GlobalEnv.mult
   break;
  case '/':
   this.operator = GlobalEnv.div
   break;
  case 'Note':
   this.operator = GlobalEnv.note;
 }
 
 var opr = strNt.split(' ');
 opr.splice(0, 1);
 var lastOne = opr[opr.length-1];
 opr[opr.length-1] = lastOne.substring(0, lastOne.length-1);//remove the last ')'
 opr.forEach(function(it){
  if(it[0] == '(')
   thisRef.operandObjArr.push(new Exp(it));
  else
   thisRef.operandObjArr.push(new Atom(it));
 });
};
/*call as one function*/
Exp.prototype.getVal = function(){
 var paras = [];
 this.operandObjArr.forEach(function(it){
  paras.push(it.getVal());
 });
 return this.operator.apply(this, paras);
};
/*call as a series of functions*/
Exp.prototype.getVal1 = function(){
 var rtVal;
 rtVal = this.operator.apply(this);
 this.operandObjArr.forEach(function(it){
  rtVal = it.apply(this);
 });
 return rtVal;
};
