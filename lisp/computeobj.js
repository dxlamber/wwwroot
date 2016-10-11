function ComputedObj(){};
ComputedObj.prototype.getRef = function(){ return this;};
ComputedObj.prototype.val = function(){ /*must be override by subclass*/};



function Atom(type, val)
{
	this.type = type;
	this.value = val;
};
inheritS(Atom, ComputedObj);
Atom.prototype.val = function()
{
	var rtVal;
	switch(this.type)
	{
		case "Number":
			rtVal = parseFloat(this.value);
			break;
		case "String":
			rtVal = this.value;
			break;
		case "Label":
		case "FourOperator":
			rtVal = GlobalEnv[this.value];
			break;
		default:
			rtVal = this.value;
	}
	return rtVal;
};



function Exp(paraArr)
{
	this.paraArr = paraArr;
};
inheritS(Exp, ComputedObj);
Exp.prototype.val = function()
{
	return this.paraArr[0].apply(this, this.paraArr.slice(1, this.paraArr.length));
};

