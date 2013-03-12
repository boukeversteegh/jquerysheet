<?php
/* Jison generated parser */

class Parser
{
	var $symbols_ = array();
	var $terminals_ = array();
	var $productions_ = array();
	var $table = array();
	var $defaultActions = array();
	var $version = '0.3.12';
	var $debug = false;

	function __construct()
	{
		//ini_set('error_reporting', E_ALL);
		//ini_set('display_errors', 1);
		
		$accept = 'accept';
		$end = 'end';
		
		//parser
		$this->symbols_ = 		json_decode('{"error":2,"grid":3,"rows":4,"EOF":5,"row":6,"END_OF_LINE":7,"END_OF_LINE_EMPTY":8,"string":9,"QUOTE_ON":10,"QUOTE_OFF":11,"COLUMN_EMPTY":12,"COLUMN_STRING":13,"BOF":14,"CHAR":15,"$accept":0,"$end":1}', true);
		$this->terminals_ = 	json_decode('{"2":"error","5":"EOF","7":"END_OF_LINE","8":"END_OF_LINE_EMPTY","10":"QUOTE_ON","11":"QUOTE_OFF","12":"COLUMN_EMPTY","13":"COLUMN_STRING","14":"BOF","15":"CHAR"}', true);
		$this->productions_ = 	json_decode('[0,[3,2],[3,1],[4,1],[4,1],[4,1],[4,2],[4,2],[4,3],[4,3],[6,1],[6,3],[6,1],[6,1],[6,2],[6,2],[6,3],[6,3],[9,1],[9,1],[9,2]]', true);
		$this->table = 			json_decode('[{"3":1,"4":2,"5":[1,3],"6":4,"7":[1,5],"8":[1,6],"9":7,"10":[1,8],"12":[1,9],"13":[1,10],"14":[1,11],"15":[1,12]},{"1":[3]},{"5":[1,13],"7":[1,14],"8":[1,15]},{"1":[2,2]},{"5":[2,3],"7":[2,3],"8":[2,3],"12":[1,16],"13":[1,17]},{"5":[2,4],"7":[2,4],"8":[2,4]},{"5":[2,5],"7":[2,5],"8":[2,5]},{"5":[2,10],"7":[2,10],"8":[2,10],"12":[2,10],"13":[2,10],"15":[1,18]},{"9":19,"14":[1,11],"15":[1,12]},{"5":[2,12],"7":[2,12],"8":[2,12],"12":[2,12],"13":[2,12]},{"5":[2,13],"7":[2,13],"8":[2,13],"12":[2,13],"13":[2,13]},{"5":[2,18],"7":[2,18],"8":[2,18],"11":[2,18],"12":[2,18],"13":[2,18],"15":[2,18]},{"5":[2,19],"7":[2,19],"8":[2,19],"11":[2,19],"12":[2,19],"13":[2,19],"15":[2,19]},{"1":[2,1]},{"5":[2,6],"6":20,"7":[2,6],"8":[2,6],"9":7,"10":[1,8],"12":[1,9],"13":[1,10],"14":[1,11],"15":[1,12]},{"5":[2,7],"6":21,"7":[2,7],"8":[2,7],"9":7,"10":[1,8],"12":[1,9],"13":[1,10],"14":[1,11],"15":[1,12]},{"5":[2,14],"7":[2,14],"8":[2,14],"9":22,"12":[2,14],"13":[2,14],"14":[1,11],"15":[1,12]},{"5":[2,15],"7":[2,15],"8":[2,15],"9":23,"12":[2,15],"13":[2,15],"14":[1,11],"15":[1,12]},{"5":[2,20],"7":[2,20],"8":[2,20],"11":[2,20],"12":[2,20],"13":[2,20],"15":[2,20]},{"11":[1,24],"15":[1,18]},{"5":[2,8],"7":[2,8],"8":[2,8],"12":[1,16],"13":[1,17]},{"5":[2,9],"7":[2,9],"8":[2,9],"12":[1,16],"13":[1,17]},{"5":[2,16],"7":[2,16],"8":[2,16],"12":[2,16],"13":[2,16],"15":[1,18]},{"5":[2,17],"7":[2,17],"8":[2,17],"12":[2,17],"13":[2,17],"15":[1,18]},{"5":[2,11],"7":[2,11],"8":[2,11],"12":[2,11],"13":[2,11]}]', true);
		$this->defaultActions = json_decode('{"3":[2,2],"13":[2,1]}', true);
		
		//lexer
		$this->rules = 			array("/^(?:(\\n|\\\\n))/","/^(?:(\"))/","/^(?:('))/","/^(?:(?=(\\t)))/","/^(?:(:::::'))/","/^(?:((\\t|\\n|\\\\n)'))/","/^(?:(\\n|\\\\n))/","/^(?:('))/","/^(?:(\"))/","/^(?:(?=(\\t)))/","/^(?:(:::::\"))/","/^(?:((\\t|\\n|\\\\n)\"))/","/^(?:(:::::))/","/^(?:(\\n|\\\\n))/","/^(?:(\\t))/","/^(?:(\\t))/","/^(?:(\\s))/","/^(?:(.))/","/^(?:(.))/","/^(?:(.))/","/^(?:(\\n|\\\\n))/","/^(?:(.))/","/^(?:$)/");
		$this->conditions = 	json_decode('{"SINGLE_QUOTE_ON":{"rules":[0,1,2,3,4,5,10,11,12,15,18,20,21,22],"inclusive":true},"DOUBLE_QUOTE_ON":{"rules":[4,5,6,7,8,9,10,11,12,15,19,20,21,22],"inclusive":true},"STRING":{"rules":[4,5,10,11,12,13,14,15,16,17,20,21,22],"inclusive":true},"INITIAL":{"rules":[4,5,10,11,12,15,20,21,22],"inclusive":true}}', true);
		
		$this->options =		json_decode('{}', true);
	}
	
	function trace()
	{
		
	}
	
	function parser_performAction(&$thisS, $yytext, $yyleng, $yylineno, $yystate, $S, $_S, $O)
	{
		


switch ($yystate) {
case 1:
		return $S[$O-1];
	
break;
case 2:
		return [['']];
	
break;
case 3:
		$thisS = [$S[$O]];
	
break;
case 4:
        $thisS = [];
    
break;
case 5:
        $thisS = [''];
    
break;
case 6:
        $thisS = $S[$O-1];
    
break;
case 7:
        $S[$O-1][$S[$O-1].length - 1].push('');
        $thisS = $S[$O-1];
    
break;
case 8:
        $S[$O-2].push($S[$O]);
        $thisS = $S[$O-2];
    
break;
case 9:
        $S[$O-2][$S[$O-2].length - 1].push('');
        $S[$O-2].push($S[$O]);
        $thisS = $S[$O-2];
    
break;
case 10:
		$thisS = [$S[$O]];
	
break;
case 11:
        $thisS = $S[$O-1];
    
break;
case 12:
		$thisS = [''];
	
break;
case 13:
        //$thisS = [];
    
break;
case 14:
        $S[$O-1].push('');
        $thisS = $S[$O-1];
    
break;
case 15:
        //$S[$O-1].push('');
        $thisS = $S[$O-1];
    
break;
case 16:
        $S[$O-2].push('');
        $S[$O-2].push($S[$O]);
        $thisS = $S[$O-2];
    
break;
case 17:
        //$S[$O-2].push('');
        $S[$O-2].push($S[$O]);
        $thisS = $S[$O-2];
    
break;
case 18:
		$thisS = '';
	
break;
case 19:
		$thisS = $S[$O-1];
	
break;
case 15:
		$thisS = $S[$O];
	
break;
case 20:
		$thisS = $S[$O-1] + '' + $S[$O];
	
break;
}

	}

	function parser_lex()
	{
		$token = $this->lexer_lex(); // $end = 1
		$token = (isset($token) ? $token : 1);
		
		// if token isn't its numeric value, convert
		if (isset($this->symbols_[$token]))
			return $this->symbols_[$token];
		
		return $token;
	}
	
	function parseError($str = "", $hash = array())
	{
		throw new Exception($str);
	}
	
	function parse($input)
	{
		$stack = array(0);
		$stackCount = 1;
		
		$vstack = array(null);
		$vstackCount = 1;
		// semantic value stack
		
		$lstack = array($this->yyloc);
		$lstackCount = 1;
		//location stack

		$shifts = 0;
		$reductions = 0;
		$recovering = 0;
		$TERROR = 2;
		
		$this->setInput($input);
		
		$yyval = (object)array();
		$yyloc = $this->yyloc;
		$lstack[] = $yyloc;

		while (true) {
			// retreive state number from top of stack
			$state = $stack[$stackCount - 1];
			// use default actions if available
			if (isset($this->defaultActions[$state])) {
				$action = $this->defaultActions[$state];		
			} else {
				if (empty($symbol) == true) {
					$symbol = $this->parser_lex();
				}
				// read action for current state and first input
				if (isset($this->table[$state][$symbol])) {
					$action = $this->table[$state][$symbol];
				} else {
					$action = '';
				}
			}

			if (empty($action) == true) {
				if (!$recovering) {
					// Report error
					$expected = array();
					foreach($this->table[$state] as $p => $item) {
						if (!empty($this->terminals_[$p]) && $p > 2) {
							$expected[] = $this->terminals_[$p];
						}
					}
					
					$errStr = "Parse error on line " . ($this->yylineno + 1) . ":\n" . $this->showPosition() . "\nExpecting " . implode(", ", $expected) . ", got '" . (isset($this->terminals_[$symbol]) ? $this->terminals_[$symbol] : 'NOTHING') . "'";
			
					$this->parseError($errStr, array(
						"text"=> $this->match,
						"token"=> $symbol,
						"line"=> $this->yylineno,
						"loc"=> $yyloc,
						"expected"=> $expected
					));
				}
	
				// just recovered from another error
				if ($recovering == 3) {
					if ($symbol == $this->EOF) {
						$this->parseError(isset($errStr) ? $errStr : 'Parsing halted.');
					}

					// discard current lookahead and grab another
					$yyleng = $this->yyleng;
					$yytext = $this->yytext;
					$yylineno = $this->yylineno;
					$yyloc = $this->yyloc;
					$symbol = $this->parser_lex();
				}
	
				// try to recover from error
				while (true) {
					// check for error recovery rule in this state
					if (isset($this->table[$state][$TERROR])) {
						break 2;
					}
					if ($state == 0) {
						$this->parseError(isset($errStr) ? $errStr : 'Parsing halted.');
					}
					
					array_slice($stack, 0, 2);
					$stackCount -= 2;
					
					array_slice($vstack, 0, 1);
					$vstackCount -= 1;

					$state = $stack[$stackCount - 1];
				}
	
				$preErrorSymbol = $symbol; // save the lookahead token
				$symbol = $TERROR; // insert generic error symbol as new lookahead
				$state = $stack[$stackCount - 1];
				if (isset($this->table[$state][$TERROR])) {
					$action = $this->table[$state][$TERROR];
				}
				$recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
			}
	
			// this shouldn't happen, unless resolve defaults are off
			if (is_array($action[0])) {
				$this->parseError("Parse Error: multiple actions possible at state: " . $state . ", token: " . $symbol);
			}
			
			switch ($action[0]) {
				case 1:
					// shift
					//$this->shiftCount++;
					$stack[] = $symbol;
					$stackCount++;
					
					$vstack[] = $this->yytext;
					$vstackCount++;
					
					$lstack[] = $this->yyloc;
					$lstackCount++;
					
					$stack[] = $action[1]; // push state
					$stackCount++;

					$symbol = "";
					if (empty($preErrorSymbol)) { // normal execution/no error
						$yyleng = $this->yyleng;
						$yytext = $this->yytext;
						$yylineno = $this->yylineno;
						$yyloc = $this->yyloc;
						if ($recovering > 0) $recovering--;
					} else { // error just occurred, resume old lookahead f/ before error
						$symbol = $preErrorSymbol;
						$preErrorSymbol = "";
					}
					break;
		
				case 2:
					// reduce
					$len = $this->productions_[$action[1]][1];
					// perform semantic action
					$yyval->S = $vstack[$vstackCount - $len];// default to $S = $1
					// default location, uses first token for firsts, last for lasts
					$yyval->_S = array(
                        "first_line"=> 		$lstack[$lstackCount - (isset($len) ? $len : 1)]['first_line'],
                        "last_line"=> 		$lstack[$lstackCount - 1]['last_line'],
                        "first_column"=> 	$lstack[$lstackCount - (isset($len) ? $len : 1)]['first_column'],
                        "last_column"=> 	$lstack[$lstackCount - 1]['last_column']
                    );
					
					$r = $this->parser_performAction($yyval->S, $yytext, $yyleng, $yylineno, $action[1], $vstack, $lstack, $vstackCount - 1);
					
					if (isset($r)) {
						return $r;
					}
					
					// pop off stack
					if ($len > 0) {
						$stack = array_slice($stack, 0, -1 * $len * 2);
						$stackCount -= $len * 2;
					
						$vstack = array_slice($vstack, 0, -1 * $len);
						$vstackCount -= $len;
						
						$lstack = array_slice($lstack, 0, -1 * $len);
						$lstackCount -= $len;
					}
					
					$stack[] = $this->productions_[$action[1]][0]; // push nonterminal (reduce)
					$stackCount++;
					
					$vstack[] = $yyval->S;
					$vstackCount++;
					
					$lstack[] = $yyval->_S;
					$lstackCount++;
					
					// goto new state = table[STATE][NONTERMINAL]
					$newState = $this->table[$stack[$stackCount - 2]][$stack[$stackCount - 1]];
					
					$stack[] = $newState;
					$stackCount++;
					
					break;
		
				case 3:
					// accept
					return true;
			}

		}

		return true;
	}


	/* Jison generated lexer */
	var $EOF = 1;
	var $S = "";
	var $yy = "";
	var $yylineno = "";
	var $yyleng = "";
	var $yytext = "";
	var $match = "";
	var $matched = "";
	var $yyloc = array(
		"first_line"=> 1,
		"first_column"=> 0,
		"last_line"=> 1,
		"last_column"=> 0,
		"range"=> array()
	);
	var $conditionsStack = array();
	var $conditionStackCount = 0;
	var $rules = array();
	var $conditions = array();
	var $done = false;
	var $less;
	var $more;
	var $_input;
	var $options;
	var $offset;
	
	function setInput($input)
	{
		$this->_input = $input;
		$this->more = $this->less = $this->done = false;
		$this->yylineno = $this->yyleng = 0;
		$this->yytext = $this->matched = $this->match = '';
		$this->conditionStack = array('INITIAL');
		$this->yyloc["first_line"] = 1;
		$this->yyloc["first_column"] = 0;
		$this->yyloc["last_line"] = 1;
		$this->yyloc["last_column"] = 0;
		if (isset($this->options->ranges)) {
			$this->yyloc['range'] = array(0,0);
		}
		$this->offset = 0;
		return $this;
	}
	
	function input()
	{
		$ch = $this->_input[0];
		$this->yytext .= $ch;
		$this->yyleng++;
		$this->offset++;
		$this->match .= $ch;
		$this->matched .= $ch;
		$lines = preg_match("/(?:\r\n?|\n).*/", $ch);
		if (count($lines) > 0) {
			$this->yylineno++;
			$this->yyloc['last_line']++;
		} else {
			$this->yyloc['last_column']++;
		}
		if (isset($this->options->ranges)) $this->yyloc['range'][1]++;
		
		$this->_input = array_slice($this->_input, 1);
		return $ch;
	}
	
	function unput($ch)
	{
		$len = strlen($ch);
		$lines = explode("/(?:\r\n?|\n)/", $ch);
		$linesCount = count($lines);
		
		$this->_input = $ch . $this->_input;
		$this->yytext = substr($this->yytext, 0, $len - 1);
		//$this->yylen -= $len;
		$this->offset -= $len;
		$oldLines = explode("/(?:\r\n?|\n)/", $this->match);
		$oldLinesCount = count($oldLines);
		$this->match = substr($this->match, 0, strlen($this->match) - 1);
		$this->matched = substr($this->matched, 0, strlen($this->matched) - 1);
		
		if (($linesCount - 1) > 0) $this->yylineno -= $linesCount - 1;
		$r = $this->yyloc['range'];
		$oldLinesLength = (isset($oldLines[$oldLinesCount - $linesCount]) ? strlen($oldLines[$oldLinesCount - $linesCount]) : 0);
		
		$this->yyloc["first_line"] = $this->yyloc["first_line"];
		$this->yyloc["last_line"] = $this->yylineno + 1;
		$this->yyloc["first_column"] = $this->yyloc['first_column'];
		$this->yyloc["last_column"] = (empty($lines) ?
			($linesCount == $oldLinesCount ? $this->yyloc['first_column'] : 0) + $oldLinesLength :
			$this->yyloc['first_column'] - $len);
		
		if (isset($this->options->ranges)) {
			$this->yyloc['range'] = array($r[0], $r[0] + $this->yyleng - $len);
		}
		
		return $this;
	}
	
	function more()
	{
		$this->more = true;
		return $this;
	}
	
	function pastInput()
	{
		$past = substr($this->matched, 0, strlen($this->matched) - strlen($this->match));
		return (strlen($past) > 20 ? '...' : '') . preg_replace("/\n/", "", substr($past, -20));
	}
	
	function upcomingInput()
	{
		$next = $this->match;
		if (strlen($next) < 20) {
			$next .= substr($this->_input, 0, 20 - strlen($next));
		}
		return preg_replace("/\n/", "", substr($next, 0, 20) . (strlen($next) > 20 ? '...' : ''));
	}
	
	function showPosition()
	{
		$pre = $this->pastInput();

		$c = '';
		for($i = 0, $preLength = strlen($pre); $i < $preLength; $i++) {
			$c .= '-';
		}

		return $pre . $this->upcomingInput() . "\n" . $c . "^";
	}
	
	function next()
	{
		if ($this->done == true) return $this->EOF;
		
		if (empty($this->_input)) $this->done = true;

		if ($this->more == false) {
			$this->yytext = '';
			$this->match = '';
		}

		$rules = $this->_currentRules();
		for ($i = 0, $j = count($rules); $i < $j; $i++) {
			preg_match($this->rules[$rules[$i]], $this->_input, $tempMatch);
            if ($tempMatch && (empty($match) || count($tempMatch[0]) > count($match[0]))) {
                $match = $tempMatch;
                $index = $i;
                if (isset($this->options->flex) && $this->options->flex == false) break;
            }
		}
		if ( $match ) {
			$matchCount = strlen($match[0]);
			$lineCount = preg_match("/\n.*/", $match[0], $lines);

			$this->yylineno += $lineCount;
			$this->yyloc["first_line"] = $this->yyloc['last_line'];
			$this->yyloc["last_line"] = $this->yylineno + 1;
			$this->yyloc["first_column"] = $this->yyloc['last_column'];
			$this->yyloc["last_column"] = $lines ? count($lines[$lineCount - 1]) - 1 : $this->yyloc['last_column'] + $matchCount;
			
			$this->yytext .= $match[0];
			$this->match .= $match[0];
			$this->matches = $match;
			$this->yyleng = strlen($this->yytext);
			if (isset($this->options->ranges)) {
				$this->yyloc['range'] = array($this->offset, $this->offset += $this->yyleng);
			}
			$this->more = false;
			$this->_input = substr($this->_input, $matchCount, strlen($this->_input));
			$this->matched .= $match[0];
			$token = $this->lexer_performAction($this->yy, $this, $rules[$index], $this->conditionStack[$this->conditionStackCount]);

			if ($this->done == true && empty($this->_input) == false) $this->done = false;

			if (empty($token) == false) {
				return $token;
			} else {
				return;
			}
		}
		
		if (empty($this->_input)) {
			return $this->EOF;
		} else {
			$this->parseError("Lexical error on line " . ($this->yylineno + 1) . ". Unrecognized text.\n" . $this->showPosition(), array(
				"text"=> "",
				"token"=> null,
				"line"=> $this->yylineno
			));
		}
	}
	
	function lexer_lex()
	{
		$r = $this->next();
		
		while (empty($r) && $this->done == false) {
			$r = $this->next();
		}
		
		return $r;
	}
	
	function begin($condition)
	{
		$this->conditionStackCount++;
		$this->conditionStack[] = $condition;
	}
	
	function popState()
	{
		$this->conditionStackCount--;
		return array_pop($this->conditionStack);
	}
	
	function _currentRules()
	{
		return $this->conditions[
			$this->conditionStack[
				$this->conditionStackCount
			]
		]['rules'];
	}
	
	function lexer_performAction(&$yy, $yy_, $avoiding_name_collisions, $YY_START = null)
	{
		$YYSTATE = $YY_START;
		


switch($avoiding_name_collisions) {
case 0:return 15;
break;
case 1:return 15;
break;
case 2:
	this.popState();
	this.begin('STRING');
	return 11;

break;
case 3:
	this.popState();
	return 15;

break;
case 4:
	this.begin('SINGLE_QUOTE_ON');
	return 'SINGLE_QUOTE_ON';

break;
case 5:
	this.begin('SINGLE_QUOTE_ON');
	return 10;

break;
case 6:return 15;
break;
case 7:return 15;
break;
case 8:
	this.popState();
	this.begin('STRING');
	return 11;

break;
case 9:
	this.popState();
	return 15;

break;
case 10:
 	this.begin('DOUBLE_QUOTE_ON');
 	return 10;

break;
case 11:
	this.begin('DOUBLE_QUOTE_ON');
	return 10;

break;
case 12:
	return 14;

break;
case 13:
	this.popState();
	return 7;

break;
case 14:
	this.popState();
	return 13;

break;
case 15:return 12;
break;
case 16:return 15;
break;
case 17:return 15;
break;
case 18:return 15;
break;
case 19:return 15;
break;
case 20:return 8;
break;
case 21:
	this.begin('STRING');
	return 15;

break;
case 22:return 5;
break;
}

	}
}