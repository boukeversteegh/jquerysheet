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
		$this->symbols_ = 		json_decode('{"error":2,"expressions":3,"expression":4,"EOF":5,"VAR":6,"NUMBER":7,"STRING":8,"=":9,"+":10,"(":11,")":12,"<":13,">":14,"NOT":15,"-":16,"*":17,"/":18,"^":19,"%":20,"E":21,"IDENTIFIER":22,"expseq":23,"cell":24,"FIXEDCELL":25,":":26,"CELL":27,"SHEET":28,"!":29,";":30,",":31,"$accept":0,"$end":1}', true);
		$this->terminals_ = 	json_decode('{"2":"error","5":"EOF","6":"VAR","7":"NUMBER","8":"STRING","9":"=","10":"+","11":"(","12":")","13":"<","14":">","15":"NOT","16":"-","17":"*","18":"/","19":"^","20":"%","21":"E","22":"IDENTIFIER","25":"FIXEDCELL","26":":","27":"CELL","28":"SHEET","29":"!","30":";","31":","}', true);
		$this->productions_ = 	json_decode('[0,[3,2],[4,1],[4,1],[4,1],[4,3],[4,3],[4,3],[4,4],[4,4],[4,4],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,2],[4,2],[4,2],[4,1],[4,3],[4,4],[4,1],[24,1],[24,3],[24,1],[24,3],[24,3],[24,5],[23,1],[23,3],[23,3]]', true);
		$this->table = 			json_decode('[{"3":1,"4":2,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"1":[3]},{"5":[1,15],"9":[1,16],"10":[1,17],"13":[1,18],"14":[1,19],"15":[1,20],"16":[1,21],"17":[1,22],"18":[1,23],"19":[1,24]},{"5":[2,2],"9":[2,2],"10":[2,2],"12":[2,2],"13":[2,2],"14":[2,2],"15":[2,2],"16":[2,2],"17":[2,2],"18":[2,2],"19":[2,2],"30":[2,2],"31":[2,2]},{"5":[2,3],"9":[2,3],"10":[2,3],"12":[2,3],"13":[2,3],"14":[2,3],"15":[2,3],"16":[2,3],"17":[2,3],"18":[2,3],"19":[2,3],"20":[1,25],"30":[2,3],"31":[2,3]},{"5":[2,4],"9":[2,4],"10":[2,4],"12":[2,4],"13":[2,4],"14":[2,4],"15":[2,4],"16":[2,4],"17":[2,4],"18":[2,4],"19":[2,4],"30":[2,4],"31":[2,4]},{"4":26,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"4":27,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"4":28,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"5":[2,21],"9":[2,21],"10":[2,21],"12":[2,21],"13":[2,21],"14":[2,21],"15":[2,21],"16":[2,21],"17":[2,21],"18":[2,21],"19":[2,21],"30":[2,21],"31":[2,21]},{"11":[1,29]},{"5":[2,24],"9":[2,24],"10":[2,24],"12":[2,24],"13":[2,24],"14":[2,24],"15":[2,24],"16":[2,24],"17":[2,24],"18":[2,24],"19":[2,24],"30":[2,24],"31":[2,24]},{"5":[2,25],"9":[2,25],"10":[2,25],"12":[2,25],"13":[2,25],"14":[2,25],"15":[2,25],"16":[2,25],"17":[2,25],"18":[2,25],"19":[2,25],"26":[1,30],"30":[2,25],"31":[2,25]},{"5":[2,27],"9":[2,27],"10":[2,27],"12":[2,27],"13":[2,27],"14":[2,27],"15":[2,27],"16":[2,27],"17":[2,27],"18":[2,27],"19":[2,27],"26":[1,31],"30":[2,27],"31":[2,27]},{"29":[1,32]},{"1":[2,1]},{"4":33,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"4":34,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"4":37,"6":[1,3],"7":[1,4],"8":[1,5],"9":[1,35],"10":[1,8],"11":[1,6],"14":[1,36],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"4":39,"6":[1,3],"7":[1,4],"8":[1,5],"9":[1,38],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"4":40,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"4":41,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"4":42,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"4":43,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"4":44,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"5":[2,20],"9":[2,20],"10":[2,20],"12":[2,20],"13":[2,20],"14":[2,20],"15":[2,20],"16":[2,20],"17":[2,20],"18":[2,20],"19":[2,20],"30":[2,20],"31":[2,20]},{"9":[1,16],"10":[1,17],"12":[1,45],"13":[1,18],"14":[1,19],"15":[1,20],"16":[1,21],"17":[1,22],"18":[1,23],"19":[1,24]},{"5":[2,18],"9":[2,18],"10":[2,18],"12":[2,18],"13":[2,18],"14":[2,18],"15":[2,18],"16":[2,18],"17":[1,22],"18":[1,23],"19":[1,24],"30":[2,18],"31":[2,18]},{"5":[2,19],"9":[2,19],"10":[2,19],"12":[2,19],"13":[2,19],"14":[2,19],"15":[2,19],"16":[2,19],"17":[1,22],"18":[1,23],"19":[1,24],"30":[2,19],"31":[2,19]},{"4":48,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"12":[1,46],"16":[1,7],"21":[1,9],"22":[1,10],"23":47,"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"25":[1,49]},{"27":[1,50]},{"27":[1,51]},{"5":[2,5],"9":[2,5],"10":[1,17],"12":[2,5],"13":[1,18],"14":[1,19],"15":[1,20],"16":[1,21],"17":[1,22],"18":[1,23],"19":[1,24],"30":[2,5],"31":[2,5]},{"5":[2,6],"9":[2,6],"10":[2,6],"12":[2,6],"13":[2,6],"14":[2,6],"15":[2,6],"16":[2,6],"17":[1,22],"18":[1,23],"19":[1,24],"30":[2,6],"31":[2,6]},{"4":52,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"4":53,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"5":[2,13],"9":[2,13],"10":[1,17],"12":[2,13],"13":[2,13],"14":[2,13],"15":[2,13],"16":[1,21],"17":[1,22],"18":[1,23],"19":[1,24],"30":[2,13],"31":[2,13]},{"4":54,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"5":[2,12],"9":[2,12],"10":[1,17],"12":[2,12],"13":[2,12],"14":[2,12],"15":[2,12],"16":[1,21],"17":[1,22],"18":[1,23],"19":[1,24],"30":[2,12],"31":[2,12]},{"5":[2,11],"9":[2,11],"10":[1,17],"12":[2,11],"13":[1,18],"14":[1,19],"15":[2,11],"16":[1,21],"17":[1,22],"18":[1,23],"19":[1,24],"30":[2,11],"31":[2,11]},{"5":[2,14],"9":[2,14],"10":[2,14],"12":[2,14],"13":[2,14],"14":[2,14],"15":[2,14],"16":[2,14],"17":[1,22],"18":[1,23],"19":[1,24],"30":[2,14],"31":[2,14]},{"5":[2,15],"9":[2,15],"10":[2,15],"12":[2,15],"13":[2,15],"14":[2,15],"15":[2,15],"16":[2,15],"17":[2,15],"18":[2,15],"19":[1,24],"30":[2,15],"31":[2,15]},{"5":[2,16],"9":[2,16],"10":[2,16],"12":[2,16],"13":[2,16],"14":[2,16],"15":[2,16],"16":[2,16],"17":[2,16],"18":[2,16],"19":[1,24],"30":[2,16],"31":[2,16]},{"5":[2,17],"9":[2,17],"10":[2,17],"12":[2,17],"13":[2,17],"14":[2,17],"15":[2,17],"16":[2,17],"17":[2,17],"18":[2,17],"19":[2,17],"30":[2,17],"31":[2,17]},{"5":[2,7],"9":[2,7],"10":[2,7],"12":[2,7],"13":[2,7],"14":[2,7],"15":[2,7],"16":[2,7],"17":[2,7],"18":[2,7],"19":[2,7],"30":[2,7],"31":[2,7]},{"5":[2,22],"9":[2,22],"10":[2,22],"12":[2,22],"13":[2,22],"14":[2,22],"15":[2,22],"16":[2,22],"17":[2,22],"18":[2,22],"19":[2,22],"30":[2,22],"31":[2,22]},{"12":[1,55]},{"9":[1,16],"10":[1,17],"12":[2,31],"13":[1,18],"14":[1,19],"15":[1,20],"16":[1,21],"17":[1,22],"18":[1,23],"19":[1,24],"30":[1,56],"31":[1,57]},{"5":[2,26],"9":[2,26],"10":[2,26],"12":[2,26],"13":[2,26],"14":[2,26],"15":[2,26],"16":[2,26],"17":[2,26],"18":[2,26],"19":[2,26],"30":[2,26],"31":[2,26]},{"5":[2,28],"9":[2,28],"10":[2,28],"12":[2,28],"13":[2,28],"14":[2,28],"15":[2,28],"16":[2,28],"17":[2,28],"18":[2,28],"19":[2,28],"30":[2,28],"31":[2,28]},{"5":[2,29],"9":[2,29],"10":[2,29],"12":[2,29],"13":[2,29],"14":[2,29],"15":[2,29],"16":[2,29],"17":[2,29],"18":[2,29],"19":[2,29],"26":[1,58],"30":[2,29],"31":[2,29]},{"5":[2,8],"9":[2,8],"10":[1,17],"12":[2,8],"13":[2,8],"14":[2,8],"15":[2,8],"16":[1,21],"17":[1,22],"18":[1,23],"19":[1,24],"30":[2,8],"31":[2,8]},{"5":[2,10],"9":[2,10],"10":[1,17],"12":[2,10],"13":[2,10],"14":[2,10],"15":[2,10],"16":[1,21],"17":[1,22],"18":[1,23],"19":[1,24],"30":[2,10],"31":[2,10]},{"5":[2,9],"9":[2,9],"10":[1,17],"12":[2,9],"13":[2,9],"14":[2,9],"15":[2,9],"16":[1,21],"17":[1,22],"18":[1,23],"19":[1,24],"30":[2,9],"31":[2,9]},{"5":[2,23],"9":[2,23],"10":[2,23],"12":[2,23],"13":[2,23],"14":[2,23],"15":[2,23],"16":[2,23],"17":[2,23],"18":[2,23],"19":[2,23],"30":[2,23],"31":[2,23]},{"4":48,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"23":59,"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"4":48,"6":[1,3],"7":[1,4],"8":[1,5],"10":[1,8],"11":[1,6],"16":[1,7],"21":[1,9],"22":[1,10],"23":60,"24":11,"25":[1,12],"27":[1,13],"28":[1,14]},{"27":[1,61]},{"12":[2,32]},{"12":[2,33]},{"5":[2,30],"9":[2,30],"10":[2,30],"12":[2,30],"13":[2,30],"14":[2,30],"15":[2,30],"16":[2,30],"17":[2,30],"18":[2,30],"19":[2,30],"30":[2,30],"31":[2,30]}]', true);
		$this->defaultActions = json_decode('{"15":[2,1],"59":[2,32],"60":[2,33]}', true);
		
		//lexer
		$this->rules = 			array("/^(?:\\s+)/","/^(?:\"(\\\\[\"]|[^\"])*\")/","/^(?:'(\\\\[']|[^'])*')/","/^(?:SHEET[0-9]+)/","/^(?:\\$[A-Za-z]+\\$[0-9]+)/","/^(?:[A-Za-z]+[0-9]+)/","/^(?:[A-Za-z]+(?=[(]))/","/^(?:[0-9]+(\\.[0-9])?)/","/^(?:([A-Za-z_]+([0-9]?)([.]?))+$)/","/^(?:\\$)/","/^(?: )/","/^(?:\\.)/","/^(?::)/","/^(?:;)/","/^(?:,)/","/^(?:\\*)/","/^(?:\\/)/","/^(?:-)/","/^(?:\\+)/","/^(?:\\^)/","/^(?:\\()/","/^(?:\\))/","/^(?:>)/","/^(?:<)/","/^(?:NOT\\b)/","/^(?:PI\\b)/","/^(?:E\\b)/","/^(?:\")/","/^(?:')/","/^(?:!)/","/^(?:=)/","/^(?:%)/","/^(?:$)/");
		$this->conditions = 	json_decode('{"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32],"inclusive":true}}', true);
		
		$this->options =		json_decode('{}', true);
	}
	
	function trace()
	{
		
	}
	
	function parser_performAction(&$thisS, $yytext, $yyleng, $yylineno, $yystate, $S, $_S, $O)
	{
		


switch ($yystate) {
case 1:return $S[$O-1];
break;
case 2:
			$thisS = $this->var($S[$O]);
		
break;
case 3:$thisS = $S[$O] * 1;
break;
case 4:
			$thisS = substr($S[$O], 1, -1);
		
break;
case 5:$thisS = $S[$O-2] == $S[$O];
break;
case 6:$thisS = $S[$O-2] + $S[$O];
break;
case 7:$thisS = $S[$O-1] * 1;
break;
case 8:$thisS = ($S[$O-3] * 1) <= ($S[$O] * 1);
break;
case 9:$thisS = ($S[$O-3] * 1) >= ($S[$O] * 1);
break;
case 10:$thisS = ($S[$O-3] * 1) != ($S[$O] * 1);
break;
case 11:$thisS = $S[$O-2] != $S[$O];
break;
case 12:$thisS = ($S[$O-2] * 1) > ($S[$O] * 1);
break;
case 13:$thisS = ($S[$O-2] * 1) < ($S[$O] * 1);
break;
case 14:$thisS = ($S[$O-2] * 1) - ($S[$O] * 1);
break;
case 15:$thisS = ($S[$O-2] * 1) * ($S[$O] * 1);
break;
case 16:$thisS = ($S[$O-2] * 1) / ($S[$O] * 1);
break;
case 17:
			$thisS = pow(($S[$O-2] * 1), ($S[$O] * 1));
		
break;
case 18:$thisS = $S[$O] * -1;
break;
case 19:$thisS = $S[$O] * 1;
break;
case 20:$thisS = $S[$O-1] * 0.01;
break;
case 21:/*$thisS = Math.E;*/;
break;
case 22:
			$thisS = $this->callFunction($S[$O-2]);
		
break;
case 23:
			$thisS = $this->callFunction($S[$O-3], $S[$O-1]);
		
break;
case 25:
			$thisS = $this->fixedCellValue($S[$O]);
		
break;
case 26:
			$thisS = $this->fixedCellRangeValue($S[$O-2], $S[$O]);
		
break;
case 27:
			$thisS = $this->cellValue($S[$O]);
		
break;
case 28:
			$thisS = $this->cellRangeValue($S[$O-2], $S[$O]);
		
break;
case 29:
			$thisS = $this->remoteCellValue($S[$O-2], $S[$O]);
		
break;
case 30:
			$thisS = $this->remoteCellRangeValue($S[$O-4], $S[$O-2], $S[$O]);
		
break;
case 31:
		$thisS = array($S[$O]);
	
break;
case 32:
		
		$thisS = (is_array($S[$O]) ? $S[$O] : array());
		$thisS[] = $S[$O-2];
 	
break;
case 33:

		$thisS = (is_array($S[$O]) ? $S[$O] : array());
		$thisS[] = $S[$O-2];
 	
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
case 0:/* skip whitespace */
break;
case 1:return 8;
break;
case 2:return 8;
break;
case 3:return 28;
break;
case 4:return 25;
break;
case 5:return 27;
break;
case 6:return 22;
break;
case 7:return 7;
break;
case 8:return 6;
break;
case 9:/* skip whitespace */
break;
case 10:return ' ';
break;
case 11:return '.';
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

	}
}