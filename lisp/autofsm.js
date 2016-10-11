/*
	var a = new AutoFsm({
		"null": {"d":"start"},
		"start":{"e":"1"},
		"1":{"f":"2"},
		"2":{"u":"3"},
		"3":{"n":"4"},
		"4":{"Separator":AutoFsm.succStat}
	});
	var bmatched = a.test("test defun keyword", false);
	
	var iTest = new AutoFsm(LispAutoFsm.rule.word.Number);
	iTest.test("234nb 56", false);
	
	var strTest = new AutoFsm(LispAutoFsm.rule.word.String);
	strTest.test("labelTest01go", true);
*/

AutoFsm = function(statJump){
	this.statJump = statJump || {"null":false};
};
AutoFsm.nullStat = "null";
AutoFsm.startStat = "start";
AutoFsm.succStat = "succ";
AutoFsm.prototype.getEvent = function(curChar){
	return curChar;
};
AutoFsm.prototype.test = function(strLine, bWholeMatch, bStartMatch){
	var iStartPos = -1;
	var iEndPos = -1;
	var oriStrLine = strLine;
	strLine = strLine + " ";
	
	var stat = AutoFsm.nullStat;
	for(var i = 0; i < strLine.length; i++)
	{
		var getCh = this.getEvent(strLine[i]);
		
		//stat = (this.statJump[stat][getCh] ? this.statJump[stat][getCh] : AutoFsm.nullStat);
		if(typeof(this.statJump[stat]) == "function")//use function mapping
			stat = this.statJump[stat](getCh);
		else if(this.statJump[stat][getCh])//use object mapping
			stat = this.statJump[stat][getCh];
		else
			stat = AutoFsm.nullStat;
		
		//exit the test if need start match and not matched.
		if(i === 0 && (bWholeMatch || bStartMatch))
			if(stat !== AutoFsm.startStat)
				return -1;
				
		if(stat === AutoFsm.startStat)
		{
			iStartPos = i;
		}
		if(stat === AutoFsm.succStat)
		{
			if(bWholeMatch)
				if(i !== strLine.length-1)
					return -1;
			iEndPos = i;
			break;
		}
		if(stat === AutoFsm.nullStat)
		{
			iStartPos = -1;
			iEndPos = -1;
		}
	}
	
	console.log((iEndPos >= 0 ? 'Matched in ' : 'Unmatched in ') + '"' +oriStrLine  + '"' + ". String position is at (" + iStartPos + ", " + iEndPos + "), use substring() value: " + strLine.substring(iStartPos,iEndPos+1));
	return iEndPos-1;
};


LispAutoFsm = {};
LispAutoFsm.inAlphaBetaArea = function(evtName){
	if(evtName.length > 1)
		return false;
	if(evtName >= 'a' && evtName <= 'z')
		return true;
	if(evtName >= 'A' && evtName <= 'Z')
		return true;
	return false;
};
LispAutoFsm.inNumberArea = function(evtName){ 
	var okA = {"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"0":true};
	return (okA[evtName] ? true : false);
};
LispAutoFsm.inLabelfirstArea = function(evtName){ 
	return (LispAutoFsm.inAlphaBetaArea(evtName) ? true : false);
}
LispAutoFsm.inLabelafterArea = function(evtName){ 
	var okA = {"-":true,"_":true};
	if(LispAutoFsm.inAlphaBetaArea(evtName) || LispAutoFsm.inNumberArea(evtName))
		return true;
	return (okA[evtName] ? true : false);
};
LispAutoFsm.inFourOperatorArea = function(evt)
{
	var bM = false;
	var op = ["+","-","*","/"];
	op.forEach(function(it){if(it===evt)bM=true;});
	return bM;
};
/*
Input:
    strStream: the stream of characters
Output:
	retArr: an array of word. Every word has a type and value.
*/
LispAutoFsm.parseWord = function(strStream)
{
	var retArr = [];
	var bMatched = false;
	
	var curPos = 0;
	var endPos = strStream.length-1;
	var strNeedTest = "";
	var regMF = "";
	
	var RegTable = {};
	var tmpRef = LispAutoFsm.rule.word;
	for(var r in tmpRef)
		RegTable[r] = new AutoFsm(tmpRef[r]);
	
	while (true)
	{
		if(curPos > endPos)
		{
			bMatched = true;
			break;
		}
		strNeedTest = strStream.substring(curPos, endPos+1);
		
		regMF = "";
		for(var p in RegTable)
		{
			var stepPos = RegTable[p].test(strNeedTest, false, true);
			if(stepPos >= 0)
			{
				curPos = curPos + (stepPos+1);
				regMF = "matched_" + p;
				retArr.push({type: p, val:strNeedTest.substring(0, stepPos+1)})
				break;
			}
		}
		
		if(regMF === "")
		{
			bMatched = false;
			break;
		}
	}
	
	return bMatched ? retArr : [];
};

LispAutoFsm.removeSeparator = function(arrWord)
{
	var newArr = [];
	newArr = arrWord.filter(function(it){return (it.type !== "Separator")});
	return newArr;
}

LispAutoFsm.rule = {};
LispAutoFsm.rule.word = {
	Number : {
		"null": function(evt){
			var vCh = {"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true};
			if(vCh[evt])
				return AutoFsm.startStat;
			else
				return AutoFsm.nullStat;
		},
		"start": function(evt){
			if(LispAutoFsm.inNumberArea(evt))
				return "S1";
			else
				return AutoFsm.succStat;
		},
		"S1": function(evt){
			if(LispAutoFsm.inNumberArea(evt))
				return "S1";
			else
				return AutoFsm.succStat;
		},
	},
	String: {
		"null": function(evt){
			var vCh = {'"':true};
			if(vCh[evt])
				return AutoFsm.startStat;
			else
				return AutoFsm.nullStat;
		},
		"start": function(evt){
			var vCh = {'"':true};
			if(vCh[evt])
				return AutoFsm.succStat;
			else
				return AutoFsm.startStat;
		}
	},
	Label : {
		"null": function(evt){
			var fNextStat = function(x){return AutoFsm.startStat;};
			return (LispAutoFsm.inAlphaBetaArea(evt) ? fNextStat(evt) : AutoFsm.nullStat); 
		},
		"start": function(evt){
			if(LispAutoFsm.inLabelfirstArea(evt))
				return "S1";
			else
				return AutoFsm.succStat;
		},
		"S1": function(evt){
			if(LispAutoFsm.inLabelafterArea(evt))
				return "S1";
			else
				return AutoFsm.succStat;
		}
	},
	BracketStart : {
		"null": function(evt){
			var fNextStat = function(x){return AutoFsm.startStat;};
			return (evt === "(" ? fNextStat(evt) : AutoFsm.nullStat); 
		},
		"start": function(evt){
			//any event, go succ
			return AutoFsm.succStat;
		}
	},
	BracketEnd : {
		"null": function(evt){
			var fNextStat = function(x){return AutoFsm.startStat;};
			return (evt === ")" ? fNextStat(evt) : AutoFsm.nullStat); 
		},
		"start": function(evt){
			//any event, go succ
			return AutoFsm.succStat;
		}
	},
	FourOperator : {
		"null": function(evt){
			var fNextStat = function(x){return AutoFsm.startStat;};
			return (LispAutoFsm.inFourOperatorArea(evt) ? fNextStat(evt) : AutoFsm.nullStat); 
		},
		"start": function(evt){
			//any event, go succ
			return AutoFsm.succStat;
		}
	},
	Separator: {
		"null": {" ":"start"},
		"start": function(evt){
			if(evt === " ")
				return AutoFsm.startStat;
			return AutoFsm.succStat;
		}
	}
};

	
LispAutoFsm.rule.syntax = {
	/*syntax rule 1*/
	Atom: {
		"null": {"Number":AutoFsm.startStat, "String":AutoFsm.startStat},
		"start": function(evt){
			//any event, go succ
			return AutoFsm.succStat;
		}
	},
	ListEmpty: {/*Empty list*/
		"null": {"BracketStart":AutoFsm.startStat},
		"start": {"BracketEnd":AutoFsm.succStat},
	},
	ListAtom: {/*List only with atom parameters*/
		"null": {"BracketStart":AutoFsm.startStat},
		"start": {"Number":"S1","String":"S1","Label":"S1"},
		"S1": function(evt){
			if(evt.type === "Separator")
				return "S2";
			else if(evt.type === "BracketEnd")
				return AutoFsm.succStat;
			else
				return AutoFsm.nullStat;
		},
		"S2": {"Number":"S2","String":"S2","Label":"S2"},
	},
	ListMix: {
		"null": {"BracketStart":AutoFsm.startStat},
		"start": function(evt){
			if(evt === "BracketEnd")
				return AutoFsm.succStat;
			return AutoFsm.succStat;
		}
	}
};
