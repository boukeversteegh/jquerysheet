var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
	sys.puts(stdout)
}

exec("jison parser.jison", function() {
	var Parser = require('./parser.js');

	var symbols = JSON.stringify(Parser.parser.symbols_);
	var terminals = JSON.stringify(Parser.parser.terminals_);
	var productions = JSON.stringify(Parser.parser.productions_);

	var table = JSON.stringify(Parser.parser.table);
	var defaultActions = JSON.stringify(Parser.parser.defaultActions);

	//turn regex into string
	var rules = [];
	for(var i = 0; i < Parser.parser.lexer.rules.length; i++) {
		rules.push(Parser.parser.lexer.rules[i].toString());
	}
	rules = JSON.stringify(rules);
	rules = rules.substring(1, rules.length - 1);
	
	var conditions = JSON.stringify(Parser.parser.lexer.conditions);
	var parserPerformAction = Parser.parser.performAction.toString();
	var lexerPerformAction = Parser.parser.lexer.performAction.toString();

	function jsToPhpGen(str, stripKey) {
		str = str.replace(new RegExp('[\[]', 'g'), "array(");
		str = str.replace(new RegExp('\]', 'g'), ")");
		str = str.replace(new RegExp('[\{]', 'g'), "array(");
		str = str.replace(new RegExp('[\}]', 'g'), ")");
		str = str.replace(new RegExp('[:]', 'g'), '=>');
		
		str = str.replace('$accept', 'accept');
		str = str.replace('$end', 'end');

		if (stripKey) {
			//str = str.replace(new RegExp(',"', 'g'), ',');
			
			//str = str.replace(new RegExp('[\(]"', 'g'), '(');
		}

		return str;
	}

	function jsFnToPhpGen(str) {
		str = str.split('{');
		str.shift();
		str = str.join('{');

		str = str.split('}');
		str.pop();
		str = str.join('}');

		return str;
	}

	function jsPerformActionToPhp(str) {
		str = jsFnToPhpGen(str);
		str = str.replace("var $0 = $$.length - 1;", '');
		str = str.replace("var YYSTATE=YY_START", '');
		str = str.replace(new RegExp('[$]0', 'g'), '$O');
		str = str.replace(new RegExp('[$][$]', 'g'), '$S');
		str = str.replace(new RegExp('parserlib[.]', 'g'), 'ParserLib::');
		str = str.replace(new RegExp('this[.][$]', 'g'), '$thisS');
		str = str.replace(new RegExp('yystate', 'g'), '$yystate');
		str = str.replace(new RegExp('this[.]yy[.]', 'g'), '$this->yy->');
		str = str.replace(new RegExp('this[.]', 'g'), '$this->');
		str = str.replace(new RegExp('yy[_][.]yytext', 'g'), '$yy_->yytext');
		str = str.replace(new RegExp('yy[.]', 'g'), '$yy->');
		str = str.replace(new RegExp('\][.]', 'g'), ']->');
		str = str.replace(new RegExp('\[\]', 'g'), 'array()');
		str = str.replace(new RegExp('default[:][;]', 'g'), '');
		str = str.replace(new RegExp('[$][.]isArray', 'g'), 'is_array');
		str = str.replace(new RegExp('Math.pow', 'g'), 'pow');
		str = str.replace(new RegExp('yytext', 'g'), '$yytext');
		str = str.replace(new RegExp('new Array', 'g'), 'array');
		str = str.replace(new RegExp('([A-Za-z]+)[.]apply[(]', 'g'), function(i, fn) {
			return "apply('" + fn + "', ";
		});
		
		str = str.replace(new RegExp('([A-Za-z])[.]([A-Za-z])', 'g'), function(i, w1, w2) {
			return w1 + '->' + w2;
		});
		
		str = str.replace(/(\d)\n/g, function(){
			return arguments[1] + ';\n';
		});
		
		return str;
	}

	var parserRaw = fs.readFileSync("./parser_template.php", "utf8");
	
	parserRaw = parserRaw.replace('"<@@SYMBOLS@@>"', jsToPhpGen(symbols));
	parserRaw = parserRaw.replace('"<@@TERMINALS@@>"', jsToPhpGen(terminals, true));
	parserRaw = parserRaw.replace('"<@@PRODUCTIONS@@>"', jsToPhpGen(productions));

	parserRaw = parserRaw.replace('"<@@TABLE@@>"', jsToPhpGen(table));
	parserRaw = parserRaw.replace('"<@@DEFAULT_ACTIONS@@>"', jsToPhpGen(defaultActions));

	parserRaw = parserRaw.replace('"<@@RULES@@>"', 'array(' + rules + ')');
	parserRaw = parserRaw.replace('"<@@CONDITIONS@@>"', jsToPhpGen(conditions));

	parserRaw = parserRaw.replace('"<@@PARSER_PERFORM_ACTION@@>";', jsPerformActionToPhp(parserPerformAction));
	parserRaw = parserRaw.replace('"<@@LEXER_PERFORM_ACTION@@>";', jsPerformActionToPhp(lexerPerformAction));

	fs.writeFile("parser.php", parserRaw, function(err) {
		if (err) {
			console.log("Something went bad");
		} else {
			console.log("Success writing new parser files parser.js & parser.php.");
			console.log("Please Note: The php version of the jison parser is only an ATTEMPTED conversion, that being said:");
			console.log("PLEASE TEST FILES BEFORE COMMITTING!");
		}
	});
});