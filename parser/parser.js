/* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"expression":4,"EOF":5,"variableSequence":6,"NUMBER":7,"STRING":8,"=":9,"+":10,"(":11,")":12,"<":13,">":14,"NOT":15,"-":16,"*":17,"/":18,"^":19,"%":20,"E":21,"FUNCTION":22,"expseq":23,"cell":24,"FIXEDCELL":25,":":26,"CELL":27,"SHEET":28,"!":29,";":30,",":31,"VARIABLE":32,"DECIMAL":33,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",7:"NUMBER",8:"STRING",9:"=",10:"+",11:"(",12:")",13:"<",14:">",15:"NOT",16:"-",17:"*",18:"/",19:"^",20:"%",21:"E",22:"FUNCTION",25:"FIXEDCELL",26:":",27:"CELL",28:"SHEET",29:"!",30:";",31:",",32:"VARIABLE",33:"DECIMAL"},
productions_: [0,[3,2],[4,1],[4,1],[4,1],[4,3],[4,3],[4,3],[4,4],[4,4],[4,4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,2],[4,2],[4,2],[4,1],[4,3],[4,4],[4,1],[24,1],[24,3],[24,1],[24,3],[24,3],[24,5],[23,1],[23,3],[23,3],[6,1],[6,3]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:return $$[$0-1];
break;
case 2:
			this.$ = yy.lexer.handler.variable.apply(yy.lexer.obj, $$[$0]);//js
            //php this.$ = this->variable($$[$0]);
		
break;
case 3:this.$ = $$[$0] * 1;
break;
case 4:
			this.$ = $$[$0].substring(1, $$[$0].length - 1);//js
			//php this.$ = substr($$[$0], 1, -1);
		
break;
case 5:this.$ = $$[$0-2] == $$[$0];
break;
case 6:this.$ = $$[$0-2] + $$[$0];
break;
case 7:this.$ = $$[$0-1] * 1;
break;
case 8:this.$ = ($$[$0-3] * 1) <= ($$[$0] * 1);
break;
case 9:this.$ = ($$[$0-3] * 1) >= ($$[$0] * 1);
break;
case 10:this.$ = ($$[$0-3] * 1) != ($$[$0] * 1);
break;
case 11:this.$ = $$[$0-2] != $$[$0];
break;
case 12:this.$ = ($$[$0-2] * 1) > ($$[$0] * 1);
break;
case 13:this.$ = ($$[$0-2] * 1) < ($$[$0] * 1);
break;
case 14:this.$ = ($$[$0-2] * 1) - ($$[$0] * 1);
break;
case 15:this.$ = ($$[$0-2] * 1) * ($$[$0] * 1);
break;
case 16:this.$ = ($$[$0-2] * 1) / ($$[$0] * 1);
break;
case 17:
			this.$ = Math.pow(($$[$0-2] * 1), ($$[$0] * 1));//js
			//php this.$ = pow(($$[$0-2] * 1), ($$[$0] * 1));
		
break;
case 18:this.$ = $$[$0] * -1;
break;
case 19:this.$ = $$[$0] * 1;
break;
case 20:this.$ = $$[$0-1] * 0.01;
break;
case 21:/*this.$ = Math.E;*/;
break;
case 22:
			this.$ = yy.lexer.handler.callFunction($$[$0-2], '', yy.lexer.obj);//js
			//php this.$ = this->callFunction($$[$0-2]);
		
break;
case 23:
			this.$ = yy.lexer.handler.callFunction($$[$0-3], $$[$0-1], yy.lexer.obj);//js
			//php this.$ = this->callFunction($$[$0-3], $$[$0-1]);
		
break;
case 25:
			this.$ = yy.lexer.handler.fixedCellValue.apply(yy.lexer.obj, new Array($$[$0]));//js
			//php this.$ = this->fixedCellValue($$[$0]);
		
break;
case 26:
			this.$ = yy.lexer.handler.fixedCellRangeValue.apply(yy.lexer.obj, new Array($$[$0-2], $$[$0]));//js
			//php this.$ = this->fixedCellRangeValue($$[$0-2], $$[$0]);
		
break;
case 27:
			this.$ = yy.lexer.handler.cellValue.apply(yy.lexer.obj, new Array($$[$0]));//js
			//php this.$ = this->cellValue($$[$0]);
		
break;
case 28:
			this.$ = yy.lexer.handler.cellRangeValue.apply(yy.lexer.obj, new Array($$[$0-2], $$[$0]));//js
			//php this.$ = this->cellRangeValue($$[$0-2], $$[$0]);
		
break;
case 29:
			this.$ = yy.lexer.handler.remoteCellValue.apply(yy.lexer.obj, new Array($$[$0-2], $$[$0]));//js
			//php this.$ = this->remoteCellValue($$[$0-2], $$[$0]);
		
break;
case 30:
			this.$ = yy.lexer.handler.remoteCellRangeValue.apply(yy.lexer.obj, new Array($$[$0-4], $$[$0-2], $$[$0]));//js
			//php this.$ = this->remoteCellRangeValue($$[$0-4], $$[$0-2], $$[$0]);
		
break;
case 31:
			this.$ = [$$[$0]];//js
			//php this.$ = array($$[$0]);
		
break;
case 32:
	        this.$ = ($.isArray($$[$0]) ? $$[$0] : [$$[$0]]);//js
		    this.$.push($$[$0-2]);//js

			//php this.$ = (is_array($$[$0]) ? $$[$0] : array());
			//php this.$[] = $$[$0-2];
	    
break;
case 33:
	        this.$ = ($.isArray($$[$0]) ? $$[$0] : [$$[$0]]);//js
		    this.$.push($$[$0-2]);//js

			//php this.$ = (is_array($$[$0]) ? $$[$0] : array());
			//php this.$[] = $$[$0-2];
	    
break;
case 34:
			this.$ = [$$[$0]]; //js
			//php this.$ = array($$[$0]);
		
break;
case 35:
			this.$ = ($.isArray($$[$0-2]) ? $$[$0-2] : [$$[$0-2]]);//js
            this.$.push($$[$0]);//js

            //php this.$ = (is_array($$[$0-2]) ? $$[$0-2] : array());
            //php this.$[] = $$[$0];
		
break;
}
},
table: [{3:1,4:2,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{1:[3]},{5:[1,16],9:[1,17],10:[1,18],13:[1,19],14:[1,20],15:[1,21],16:[1,22],17:[1,23],18:[1,24],19:[1,25]},{5:[2,2],9:[2,2],10:[2,2],12:[2,2],13:[2,2],14:[2,2],15:[2,2],16:[2,2],17:[2,2],18:[2,2],19:[2,2],30:[2,2],31:[2,2],33:[1,26]},{5:[2,3],9:[2,3],10:[2,3],12:[2,3],13:[2,3],14:[2,3],15:[2,3],16:[2,3],17:[2,3],18:[2,3],19:[2,3],20:[1,27],30:[2,3],31:[2,3]},{5:[2,4],9:[2,4],10:[2,4],12:[2,4],13:[2,4],14:[2,4],15:[2,4],16:[2,4],17:[2,4],18:[2,4],19:[2,4],30:[2,4],31:[2,4]},{4:28,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{4:29,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{4:30,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{5:[2,21],9:[2,21],10:[2,21],12:[2,21],13:[2,21],14:[2,21],15:[2,21],16:[2,21],17:[2,21],18:[2,21],19:[2,21],30:[2,21],31:[2,21]},{11:[1,31]},{5:[2,24],9:[2,24],10:[2,24],12:[2,24],13:[2,24],14:[2,24],15:[2,24],16:[2,24],17:[2,24],18:[2,24],19:[2,24],30:[2,24],31:[2,24]},{5:[2,34],9:[2,34],10:[2,34],12:[2,34],13:[2,34],14:[2,34],15:[2,34],16:[2,34],17:[2,34],18:[2,34],19:[2,34],30:[2,34],31:[2,34],33:[2,34]},{5:[2,25],9:[2,25],10:[2,25],12:[2,25],13:[2,25],14:[2,25],15:[2,25],16:[2,25],17:[2,25],18:[2,25],19:[2,25],26:[1,32],30:[2,25],31:[2,25]},{5:[2,27],9:[2,27],10:[2,27],12:[2,27],13:[2,27],14:[2,27],15:[2,27],16:[2,27],17:[2,27],18:[2,27],19:[2,27],26:[1,33],30:[2,27],31:[2,27]},{29:[1,34]},{1:[2,1]},{4:35,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{4:36,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{4:39,6:3,7:[1,4],8:[1,5],9:[1,37],10:[1,8],11:[1,6],14:[1,38],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{4:41,6:3,7:[1,4],8:[1,5],9:[1,40],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{4:42,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{4:43,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{4:44,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{4:45,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{4:46,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{32:[1,47]},{5:[2,20],9:[2,20],10:[2,20],12:[2,20],13:[2,20],14:[2,20],15:[2,20],16:[2,20],17:[2,20],18:[2,20],19:[2,20],30:[2,20],31:[2,20]},{9:[1,17],10:[1,18],12:[1,48],13:[1,19],14:[1,20],15:[1,21],16:[1,22],17:[1,23],18:[1,24],19:[1,25]},{5:[2,18],9:[2,18],10:[2,18],12:[2,18],13:[2,18],14:[2,18],15:[2,18],16:[2,18],17:[1,23],18:[1,24],19:[1,25],30:[2,18],31:[2,18]},{5:[2,19],9:[2,19],10:[2,19],12:[2,19],13:[2,19],14:[2,19],15:[2,19],16:[2,19],17:[1,23],18:[1,24],19:[1,25],30:[2,19],31:[2,19]},{4:51,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],12:[1,49],16:[1,7],21:[1,9],22:[1,10],23:50,24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{25:[1,52]},{27:[1,53]},{27:[1,54]},{5:[2,5],9:[2,5],10:[1,18],12:[2,5],13:[1,19],14:[1,20],15:[1,21],16:[1,22],17:[1,23],18:[1,24],19:[1,25],30:[2,5],31:[2,5]},{5:[2,6],9:[2,6],10:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[2,6],17:[1,23],18:[1,24],19:[1,25],30:[2,6],31:[2,6]},{4:55,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{4:56,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{5:[2,13],9:[2,13],10:[1,18],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[1,22],17:[1,23],18:[1,24],19:[1,25],30:[2,13],31:[2,13]},{4:57,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{5:[2,12],9:[2,12],10:[1,18],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[1,22],17:[1,23],18:[1,24],19:[1,25],30:[2,12],31:[2,12]},{5:[2,11],9:[2,11],10:[1,18],12:[2,11],13:[1,19],14:[1,20],15:[2,11],16:[1,22],17:[1,23],18:[1,24],19:[1,25],30:[2,11],31:[2,11]},{5:[2,14],9:[2,14],10:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],17:[1,23],18:[1,24],19:[1,25],30:[2,14],31:[2,14]},{5:[2,15],9:[2,15],10:[2,15],12:[2,15],13:[2,15],14:[2,15],15:[2,15],16:[2,15],17:[2,15],18:[2,15],19:[1,25],30:[2,15],31:[2,15]},{5:[2,16],9:[2,16],10:[2,16],12:[2,16],13:[2,16],14:[2,16],15:[2,16],16:[2,16],17:[2,16],18:[2,16],19:[1,25],30:[2,16],31:[2,16]},{5:[2,17],9:[2,17],10:[2,17],12:[2,17],13:[2,17],14:[2,17],15:[2,17],16:[2,17],17:[2,17],18:[2,17],19:[2,17],30:[2,17],31:[2,17]},{5:[2,35],9:[2,35],10:[2,35],12:[2,35],13:[2,35],14:[2,35],15:[2,35],16:[2,35],17:[2,35],18:[2,35],19:[2,35],30:[2,35],31:[2,35],33:[2,35]},{5:[2,7],9:[2,7],10:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[2,7],17:[2,7],18:[2,7],19:[2,7],30:[2,7],31:[2,7]},{5:[2,22],9:[2,22],10:[2,22],12:[2,22],13:[2,22],14:[2,22],15:[2,22],16:[2,22],17:[2,22],18:[2,22],19:[2,22],30:[2,22],31:[2,22]},{12:[1,58]},{9:[1,17],10:[1,18],12:[2,31],13:[1,19],14:[1,20],15:[1,21],16:[1,22],17:[1,23],18:[1,24],19:[1,25],30:[1,59],31:[1,60]},{5:[2,26],9:[2,26],10:[2,26],12:[2,26],13:[2,26],14:[2,26],15:[2,26],16:[2,26],17:[2,26],18:[2,26],19:[2,26],30:[2,26],31:[2,26]},{5:[2,28],9:[2,28],10:[2,28],12:[2,28],13:[2,28],14:[2,28],15:[2,28],16:[2,28],17:[2,28],18:[2,28],19:[2,28],30:[2,28],31:[2,28]},{5:[2,29],9:[2,29],10:[2,29],12:[2,29],13:[2,29],14:[2,29],15:[2,29],16:[2,29],17:[2,29],18:[2,29],19:[2,29],26:[1,61],30:[2,29],31:[2,29]},{5:[2,8],9:[2,8],10:[1,18],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[1,22],17:[1,23],18:[1,24],19:[1,25],30:[2,8],31:[2,8]},{5:[2,10],9:[2,10],10:[1,18],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[1,22],17:[1,23],18:[1,24],19:[1,25],30:[2,10],31:[2,10]},{5:[2,9],9:[2,9],10:[1,18],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[1,22],17:[1,23],18:[1,24],19:[1,25],30:[2,9],31:[2,9]},{5:[2,23],9:[2,23],10:[2,23],12:[2,23],13:[2,23],14:[2,23],15:[2,23],16:[2,23],17:[2,23],18:[2,23],19:[2,23],30:[2,23],31:[2,23]},{4:51,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],23:62,24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{4:51,6:3,7:[1,4],8:[1,5],10:[1,8],11:[1,6],16:[1,7],21:[1,9],22:[1,10],23:63,24:11,25:[1,13],27:[1,14],28:[1,15],32:[1,12]},{27:[1,64]},{12:[2,32]},{12:[2,33]},{5:[2,30],9:[2,30],10:[2,30],12:[2,30],13:[2,30],14:[2,30],15:[2,30],16:[2,30],17:[2,30],18:[2,30],19:[2,30],30:[2,30],31:[2,30]}],
defaultActions: {16:[2,1],62:[2,32],63:[2,33]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    var ranges = this.lexer.options && this.lexer.options.ranges;

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        _handle_error:
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            var errStr = '';
            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + (this.terminals_[symbol] || symbol)+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state === 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol == 2 ? null : symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                if (ranges) {
                  yyval._$.range = [lstack[lstack.length-(len||1)].range[0], lstack[lstack.length-1].range[1]];
                }
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};
/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 8;
break;
case 2:return 8;
break;
case 3:
	if (yy.lexer.obj.cell) return 28; //js
	return 'VARIABLE'; //js

break;
case 4:
	if (yy.lexer.obj.cell) return 25; //js
	return 'VARIABLE';

break;
case 5:
	if (yy.lexer.obj.cell) return 27; //js
	return 'VARIABLE';

break;
case 6:return 22;
break;
case 7:return 32;
break;
case 8:return 7;
break;
case 9:/* skip whitespace */
break;
case 10:return ' ';
break;
case 11:return 33;
break;
case 12:return 26;
break;
case 13:return 30;
break;
case 14:return 31;
break;
case 15:return 17;
break;
case 16:return 18;
break;
case 17:return 16;
break;
case 18:return 10;
break;
case 19:return 19;
break;
case 20:return 11;
break;
case 21:return 12;
break;
case 22:return 14;
break;
case 23:return 13;
break;
case 24:return 15;
break;
case 25:return 'PI';
break;
case 26:return 21;
break;
case 27:return '"';
break;
case 28:return "'";
break;
case 29:return "!";
break;
case 30:return 9;
break;
case 31:return 20;
break;
case 32:return 5;
break;
}
};
lexer.rules = [/^(?:\s+)/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:SHEET[0-9]+)/,/^(?:\$[A-Za-z]+\$[0-9]+)/,/^(?:[A-Za-z]+[0-9]+)/,/^(?:[A-Za-z]+(?=[(]))/,/^(?:[A-Za-z]+)/,/^(?:[0-9]+([.][0-9])?)/,/^(?:\$)/,/^(?: )/,/^(?:[.])/,/^(?::)/,/^(?:;)/,/^(?:,)/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\^)/,/^(?:\()/,/^(?:\))/,/^(?:>)/,/^(?:<)/,/^(?:NOT\b)/,/^(?:PI\b)/,/^(?:E\b)/,/^(?:")/,/^(?:')/,/^(?:!)/,/^(?:=)/,/^(?:%)/,/^(?:$)/];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    var source, cwd;
    if (typeof process !== 'undefined') {
        source = require('fs').readFileSync(require('path').resolve(args[1]), "utf8");
    } else {
        source = require("file").path(require("file").cwd()).join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}