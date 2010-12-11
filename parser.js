/* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"=":4,"e":5,"EOF":6,"<=":7,">=":8,"<>":9,"NOT":10,">":11,"<":12,"+":13,"-":14,"*":15,"/":16,"^":17,"(":18,")":19,"DATE":20,"NUMBER":21,"E":22,"CELL":23,"STRINGLITERAL":24,"IDENTIFIER":25,"expseq":26,";":27,",":28,"$accept":0,"$end":1},
terminals_: {"2":"error","4":"=","6":"EOF","7":"<=","8":">=","9":"<>","10":"NOT","11":">","12":"<","13":"+","14":"-","15":"*","16":"/","17":"^","18":"(","19":")","20":"DATE","21":"NUMBER","22":"E","23":"CELL","24":"STRINGLITERAL","25":"IDENTIFIER","27":";","28":","},
productions_: [0,[3,3],[5,3],[5,3],[5,3],[5,3],[5,3],[5,3],[5,3],[5,3],[5,3],[5,3],[5,3],[5,2],[5,3],[5,1],[5,1],[5,1],[5,1],[5,1],[5,3],[5,4],[26,1],[26,3],[26,3]],
performAction: function anonymous(yytext,yyleng,yylineno,yy) {

var $$ = arguments[5],$0=arguments[5].length;
switch(arguments[4]) {
case 1:return $$[$0-3+2-1];
break;
case 2:this.$ = $$[$0-3+1-1] <= $$[$0-3+3-1];
break;
case 3:this.$ = $$[$0-3+1-1] >= $$[$0-3+3-1];
break;
case 4:this.$ = $$[$0-3+1-1] != $$[$0-3+3-1];
break;
case 5:this.$ = $$[$0-3+1-1] != $$[$0-3+3-1];
break;
case 6:this.$ = $$[$0-3+1-1] > $$[$0-3+3-1];
break;
case 7:this.$ = $$[$0-3+1-1] < $$[$0-3+3-1];
break;
case 8:this.$ = $$[$0-3+1-1] + $$[$0-3+3-1];
break;
case 9:this.$ = $$[$0-3+1-1] - $$[$0-3+3-1];
break;
case 10:this.$ = $$[$0-3+1-1] * $$[$0-3+3-1];
break;
case 11:this.$ = $$[$0-3+1-1] / $$[$0-3+3-1];
break;
case 12:this.$ = Math.pow($$[$0-3+1-1], $$[$0-3+3-1]);
break;
case 13:this.$ = -$$[$0-2+2-1];
break;
case 14:this.$ = $$[$0-3+2-1];
break;
case 15:
			var d = new Date($$[$0-1+1-1]).toString();
		
break;
case 16:this.$ = Number(yytext);
break;
case 17:this.$ = Math.E;
break;
case 18:this.$ = arguments[6].cellValue($$[$0-1+1-1]);
break;
case 19:this.$ = $$[$0-1+1-1].substring(1, $$[$0-1+1-1].length - 1);
break;
case 20:this.$ = jQuery.sheet.fn[$$[$0-3+1-1]]();
break;
case 21:this.$ = jQuery.sheet.fn[$$[$0-4+1-1]]($$[$0-4+3-1]);
break;
case 23:
 		this.$ = ($.isArray($$[$0-3+3-1]) ? $$[$0-3+3-1] : [$$[$0-3+3-1]]);
	 	this.$.push($$[$0-3+1-1]);
 	
break;
case 24:
 		this.$ = ($.isArray($$[$0-3+3-1]) ? $$[$0-3+3-1] : [$$[$0-3+3-1]]);
	 	this.$.push($$[$0-3+1-1]);
 	
break;
}
},
table: [{"3":1,"4":[1,2]},{"1":[3]},{"5":3,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"6":[1,12],"7":[1,13],"8":[1,14],"9":[1,15],"10":[1,16],"11":[1,17],"12":[1,18],"13":[1,19],"14":[1,20],"15":[1,21],"16":[1,22],"17":[1,23]},{"5":24,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"5":25,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"6":[2,15],"7":[2,15],"8":[2,15],"9":[2,15],"10":[2,15],"11":[2,15],"12":[2,15],"13":[2,15],"14":[2,15],"15":[2,15],"16":[2,15],"17":[2,15],"19":[2,15],"27":[2,15],"28":[2,15]},{"6":[2,16],"7":[2,16],"8":[2,16],"9":[2,16],"10":[2,16],"11":[2,16],"12":[2,16],"13":[2,16],"14":[2,16],"15":[2,16],"16":[2,16],"17":[2,16],"19":[2,16],"27":[2,16],"28":[2,16]},{"6":[2,17],"7":[2,17],"8":[2,17],"9":[2,17],"10":[2,17],"11":[2,17],"12":[2,17],"13":[2,17],"14":[2,17],"15":[2,17],"16":[2,17],"17":[2,17],"19":[2,17],"27":[2,17],"28":[2,17]},{"6":[2,18],"7":[2,18],"8":[2,18],"9":[2,18],"10":[2,18],"11":[2,18],"12":[2,18],"13":[2,18],"14":[2,18],"15":[2,18],"16":[2,18],"17":[2,18],"19":[2,18],"27":[2,18],"28":[2,18]},{"6":[2,19],"7":[2,19],"8":[2,19],"9":[2,19],"10":[2,19],"11":[2,19],"12":[2,19],"13":[2,19],"14":[2,19],"15":[2,19],"16":[2,19],"17":[2,19],"19":[2,19],"27":[2,19],"28":[2,19]},{"18":[1,26]},{"1":[2,1]},{"5":27,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"5":28,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"5":29,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"5":30,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"5":31,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"5":32,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"5":33,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"5":34,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"5":35,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"5":36,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"5":37,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11]},{"6":[2,13],"7":[2,13],"8":[2,13],"9":[2,13],"10":[2,13],"11":[2,13],"12":[2,13],"13":[2,13],"14":[2,13],"15":[2,13],"16":[2,13],"17":[2,13],"19":[2,13],"27":[2,13],"28":[2,13]},{"7":[1,13],"8":[1,14],"9":[1,15],"10":[1,16],"11":[1,17],"12":[1,18],"13":[1,19],"14":[1,20],"15":[1,21],"16":[1,22],"17":[1,23],"19":[1,38]},{"5":41,"14":[1,4],"18":[1,5],"19":[1,39],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11],"26":40},{"6":[2,2],"7":[2,2],"8":[2,2],"9":[2,2],"10":[2,2],"11":[1,17],"12":[1,18],"13":[1,19],"14":[1,20],"15":[1,21],"16":[1,22],"17":[1,23],"19":[2,2],"27":[2,2],"28":[2,2]},{"6":[2,3],"7":[2,3],"8":[2,3],"9":[2,3],"10":[2,3],"11":[1,17],"12":[1,18],"13":[1,19],"14":[1,20],"15":[1,21],"16":[1,22],"17":[1,23],"19":[2,3],"27":[2,3],"28":[2,3]},{"6":[2,4],"7":[2,4],"8":[2,4],"9":[2,4],"10":[2,4],"11":[1,17],"12":[1,18],"13":[1,19],"14":[1,20],"15":[1,21],"16":[1,22],"17":[1,23],"19":[2,4],"27":[2,4],"28":[2,4]},{"6":[2,5],"7":[2,5],"8":[2,5],"9":[2,5],"10":[2,5],"11":[1,17],"12":[1,18],"13":[1,19],"14":[1,20],"15":[1,21],"16":[1,22],"17":[1,23],"19":[2,5],"27":[2,5],"28":[2,5]},{"6":[2,6],"7":[2,6],"8":[2,6],"9":[2,6],"10":[2,6],"11":[2,6],"12":[2,6],"13":[1,19],"14":[1,20],"15":[1,21],"16":[1,22],"17":[1,23],"19":[2,6],"27":[2,6],"28":[2,6]},{"6":[2,7],"7":[2,7],"8":[2,7],"9":[2,7],"10":[2,7],"11":[2,7],"12":[2,7],"13":[1,19],"14":[1,20],"15":[1,21],"16":[1,22],"17":[1,23],"19":[2,7],"27":[2,7],"28":[2,7]},{"6":[2,8],"7":[2,8],"8":[2,8],"9":[2,8],"10":[2,8],"11":[2,8],"12":[2,8],"13":[2,8],"14":[2,8],"15":[1,21],"16":[1,22],"17":[1,23],"19":[2,8],"27":[2,8],"28":[2,8]},{"6":[2,9],"7":[2,9],"8":[2,9],"9":[2,9],"10":[2,9],"11":[2,9],"12":[2,9],"13":[2,9],"14":[2,9],"15":[1,21],"16":[1,22],"17":[1,23],"19":[2,9],"27":[2,9],"28":[2,9]},{"6":[2,10],"7":[2,10],"8":[2,10],"9":[2,10],"10":[2,10],"11":[2,10],"12":[2,10],"13":[2,10],"14":[2,10],"15":[2,10],"16":[2,10],"17":[1,23],"19":[2,10],"27":[2,10],"28":[2,10]},{"6":[2,11],"7":[2,11],"8":[2,11],"9":[2,11],"10":[2,11],"11":[2,11],"12":[2,11],"13":[2,11],"14":[2,11],"15":[2,11],"16":[2,11],"17":[1,23],"19":[2,11],"27":[2,11],"28":[2,11]},{"6":[2,12],"7":[2,12],"8":[2,12],"9":[2,12],"10":[2,12],"11":[2,12],"12":[2,12],"13":[2,12],"14":[2,12],"15":[2,12],"16":[2,12],"17":[2,12],"19":[2,12],"27":[2,12],"28":[2,12]},{"6":[2,14],"7":[2,14],"8":[2,14],"9":[2,14],"10":[2,14],"11":[2,14],"12":[2,14],"13":[2,14],"14":[2,14],"15":[2,14],"16":[2,14],"17":[2,14],"19":[2,14],"27":[2,14],"28":[2,14]},{"6":[2,20],"7":[2,20],"8":[2,20],"9":[2,20],"10":[2,20],"11":[2,20],"12":[2,20],"13":[2,20],"14":[2,20],"15":[2,20],"16":[2,20],"17":[2,20],"19":[2,20],"27":[2,20],"28":[2,20]},{"19":[1,42]},{"7":[1,13],"8":[1,14],"9":[1,15],"10":[1,16],"11":[1,17],"12":[1,18],"13":[1,19],"14":[1,20],"15":[1,21],"16":[1,22],"17":[1,23],"19":[2,22],"27":[1,43],"28":[1,44]},{"6":[2,21],"7":[2,21],"8":[2,21],"9":[2,21],"10":[2,21],"11":[2,21],"12":[2,21],"13":[2,21],"14":[2,21],"15":[2,21],"16":[2,21],"17":[2,21],"19":[2,21],"27":[2,21],"28":[2,21]},{"5":41,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11],"26":45},{"5":41,"14":[1,4],"18":[1,5],"20":[1,6],"21":[1,7],"22":[1,8],"23":[1,9],"24":[1,10],"25":[1,11],"26":46},{"19":[2,23]},{"19":[2,24]}],
defaultActions: {"12":[2,1],"45":[2,23],"46":[2,24]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input, o) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        shifts = 0,
        reductions = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;

    var parseError = this.yy.parseError = typeof this.yy.parseError == 'function' ? this.yy.parseError : this.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected, recovered = false;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                    parseError.call(this, errStr,
                        {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, expected: expected});
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
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }
            
            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        a = action; 

        switch (a[0]) {

            case 1: // shift
                shifts++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext); // semantic values or junk only, no terminals
                stack.push(a[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                reductions++;

                len = this.productions_[a[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, a[1], vstack, o);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                }

                stack.push(this.productions_[a[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept

                this.reductionCount = reductions;
                this.shiftCount = shifts;
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){var lexer = ({EOF:"",
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
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
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        for (var i=0;i < this.rules.length; i++) {
            match = this._input.match(this.rules[i]);
            if (match) {
                lines = match[0].match(/\n/g);
                if (lines) this.yylineno += lines.length;
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, i);
                if (token) return token;
                else return;
            }
        }
        if (this._input == this.EOF) {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function () {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    }});
lexer.performAction = function anonymous(yy,yy_) {

switch(arguments[2]) {
case 0:/* skip whitespace */
break;
case 1:return 23;
break;
case 2:return 23;
break;
case 3:return 24;
break;
case 4:return 25;
break;
case 5:return 20;
break;
case 6:return 21;
break;
case 7:/* skip whitespace */
break;
case 8:return ' ';
break;
case 9:return '.';
break;
case 10:return ':';
break;
case 11:return 27;
break;
case 12:return 28;
break;
case 13:return 15;
break;
case 14:return 16;
break;
case 15:return 14;
break;
case 16:return 13;
break;
case 17:return 17;
break;
case 18:return 18;
break;
case 19:return 19;
break;
case 20:return 11;
break;
case 21:return 12;
break;
case 22:return 8;
break;
case 23:return 7;
break;
case 24:return 9;
break;
case 25:return 10;
break;
case 26:return 'PI';
break;
case 27:return 22;
break;
case 28:return '"';
break;
case 29:return "'";
break;
case 30:return 6;
break;
case 31:return 4;
break;
}
};
lexer.rules = [/^\s+/,/^[A-Z][0-9][:][A-Z][0-9]+/,/^[A-Z][0-9]+/,/^["](.|[^"])*["]/,/^[A-Za-z]+/,/^[0-9]([0-9]?)[-/][0-9]([0-9]?)[-/][0-9]([0-9]?)([0-9]?)([0-9]?)/,/^[0-9]+(\.[0-9]+)?/,/^\$/,/^ /,/^\./,/^:/,/^;/,/^,/,/^\*/,/^\//,/^-/,/^\+/,/^\^/,/^\(/,/^\)/,/^>/,/^</,/^>=/,/^<=/,/^<>/,/^NOT\b/,/^PI\b/,/^E\b/,/^"/,/^'/,/^$/,/^=/];return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined') {
exports.parser = parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}
