<?php
/* Jison generated parser */
class parser {
	function parser() {
		$this->parser = (object)array(
			"trace"=> function() {},
			"yy"=> array(),
			"symbols_"=> array(
				"error"=> 2,
				"expressions"=> 3,
				"e"=> 4,
				"EOF"=> 5,
				"<="=> 6,
				">="=> 7,
				"<>"=> 8,
				"NOT"=> 9,
				">"=> 10,
				"<"=> 11,
				"+"=> 12,
				"-"=> 13,
				"*"=> 14,
				"/"=> 15,
				"^"=> 16,
				"("=> 17,
				")"=> 18,
				"PERCENT"=> 19,
				"DATE"=> 20,
				"NUMBER"=> 21,
				"E"=> 22,
				"FIXEDCELL"=> 23,
				"FIXEDCELLRANGE"=> 24,
				"CELL"=> 25,
				"CELLRANGE"=> 26,
				"REMOTECELL"=> 27,
				"REMOTECELLRANGE"=> 28,
				"STRING"=> 29,
				"IDENTIFIER"=> 30,
				"expseq"=> 31,
				";"=> 32,
				","=> 33,
				'$accept'=> 0,
				'$end'=> 1
			),
			"terminals_"=> array(
				"2"=> "error",
				"5"=> "EOF",
				"6"=> "<=",
				"7"=> ">=",
				"8"=> "<>",
				"9"=> "NOT",
				"10"=> ">",
				"11"=> "<",
				"12"=> "+",
				"13"=> "-",
				"14"=> "*",
				"15"=> "/",
				"16"=> "^",
				"17"=> "(",
				"18"=> ")",
				"19"=> "PERCENT",
				"20"=> "DATE",
				"21"=> "NUMBER",
				"22"=> "E",
				"23"=> "FIXEDCELL",
				"24"=> "FIXEDCELLRANGE",
				"25"=> "CELL",
				"26"=> "CELLRANGE",
				"27"=> "REMOTECELL",
				"28"=> "REMOTECELLRANGE",
				"29"=> "STRING",
				"30"=> "IDENTIFIER",
				"32"=> ";",
				"33"=> ","
			),
			"productions_"=> array(0,
				array(3, 2),
				array(4, 3),
				array(4, 3),
				array(4, 3),
				array(4, 3),
				array(4, 3),
				array(4, 3),
				array(4, 3),
				array(4, 3),
				array(4, 3),
				array(4, 3),
				array(4, 3),
				array(4, 2),
				array(4, 3),
				array(4, 1),
				array(4, 1),
				array(4, 1),
				array(4, 1),
				array(4, 1),
				array(4, 1),
				array(4, 1),
				array(4, 1),
				array(4, 1),
				array(4, 1),
				array(4, 1),
				array(4, 3),
				array(4, 4),
				array(31, 1),
				array(31, 3),
				array(31, 3)
			),
			"performAction"=> function($yytext, $yyleng, $yylineno, $yy) {
				$arguments = func_num_args();
				$S = $arguments[5];
				$O = strlen($arguments[5]);
			
				switch ($arguments[4]) {
					case 1:
						return $S[$O- 2 + 1 - 1];
						break;
					case 2:
						$this->S = ($S[$O- 3 + 1 - 1] * 1) <= ($S[$O- 3 + 3 - 1] * 1);
						break;
					case 3:
						$this->S = ($S[$O- 3 + 1 - 1] * 1) >= ($S[$O- 3 + 3 - 1] * 1);
						break;
					case 4:
						$this->S = ($S[$O- 3 + 1 - 1] * 1) != ($S[$O- 3 + 3 - 1] * 1);
						break;
					case 5:
						$this->S = ($S[$O- 3 + 1 - 1] * 1) != ($S[$O- 3 + 3 - 1] * 1);
						break;
					case 6:
						$this->S = ($S[$O- 3 + 1 - 1] * 1) > ($S[$O- 3 + 3 - 1] * 1);
						break;
					case 7:
						$this->S = ($S[$O- 3 + 1 - 1] * 1) < ($S[$O- 3 + 3 - 1] * 1);
						break;
					case 8:
						$this->S = jSE.cFN.sanitize($S[$O- 3 + 1 - 1]) + jSE.cFN.sanitize($S[$O- 3 + 3 - 1]);
						break;
					case 9:
						$this->S = ($S[$O- 3 + 1 - 1] * 1) - ($S[$O- 3 + 3 - 1] * 1);
						break;
					case 10:
						$this->S = ($S[$O- 3 + 1 - 1] * 1) * ($S[$O- 3 + 3 - 1] * 1);
						break;
					case 11:
						$this->S = ($S[$O- 3 + 1 - 1] * 1) / ($S[$O- 3 + 3 - 1] * 1);
						break;
					case 12:
						$this->S = Math.pow(($S[$O- 3 + 1 - 1] * 1), ($S[$O- 3 + 3 - 1] * 1));
						break;
					case 13:
						$this->S = $S[$O- 2 + 2 - 1] * -1;
						break;
					case 14:
						$this->S = $S[$O- 3 + 2 - 1];
						break;
					case 15:
						$this->S = (str_replace("%", "", $S[$O- 1 + 1 - 1]) * 1) / 100;
						break;
					case 16:
						/*this.$ = new Date($S[$0-1+1-1]).toString();*/
						break;
					case 17:
						$this->S = Number(yytext);
						break;
					case 18:
						$this->S = Math.E;
						break;
					case 19:
						//$this->S = $arguments[6].fixedCellValue.apply(arguments[7], [$S[$O- 1 + 1 - 1]]);
						break;
					case 20:
						//$this->S = $arguments[6].fixedCellRangeValue.apply(arguments[7], [$S[$O- 1 + 1 - 1]]);
						break;
					case 21:
						//$this->S = $arguments[6].cellValue.apply(arguments[7], [$S[$O- 1 + 1 - 1]]);
						break;
					case 22:
						//$this->S = $arguments[6].cellRangeValue.apply(arguments[7], [$S[$O- 1 + 1 - 1]]);
						break;
					case 23:
						//$this->S = $arguments[6].remoteCellValue.apply(arguments[7], [$S[$O- 1 + 1 - 1]]);
						break;
					case 24:
						//$this->S = $arguments[6].remoteCellRangeValue.apply(arguments[7], [$S[$O- 1 + 1 - 1]]);
						break;
					case 25:
						//$this->S = $S[$O- 1 + 1 - 1].substring(1, $S[$O- 1 + 1 - 1].length - 1);
						break;
					case 26:
						//$this->S = $arguments[6].callFunction($S[$O- 3 + 1 - 1], '', arguments[7]);
						break;
					case 27:
						//$this->S = $arguments[6].callFunction($S[$O- 4 + 1 - 1], $S[$O- 4 + 3 - 1], arguments[7]);
						break;
					case 29:
						$this->S = (is_array($S[$O- 3 + 3 - 1]) ? $S[$O- 3 + 3 - 1] : array($S[$O- 3 + 3 - 1]));
						$this->S.push($S[$O- 3 + 1 - 1]);
	
						break;
					case 30:
						$this->S = (is_array($S[$O- 3 + 3 - 1]) ? $S[$O- 3 + 3 - 1] : array($S[$O- 3 + 3 - 1]));
						$this->S.push($S[$O- 3 + 1 - 1]);
	
						break;
				}
			},
			"table"=> array(
				array(
					"3"=> 1,
					"4"=> 2,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"1"=> array(3)
				), array(
					"5"=> array(1, 17),
					"6"=> array(1, 18),
					"7"=> array(1, 19),
					"8"=> array(1, 20),
					"9"=> array(1, 21),
					"10"=> array(1, 22),
					"11"=> array(1, 23),
					"12"=> array(1, 24),
					"13"=> array(1, 25),
					"14"=> array(1, 26),
					"15"=> array(1, 27),
					"16"=> array(1, 28)
				), array(
					"4"=> 29,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"4"=> 30,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"5"=> array(2, 15),
					"6"=> array(2, 15),
					"7"=> array(2, 15),
					"8"=> array(2, 15),
					"9"=> array(2, 15),
					"10"=> array(2, 15),
					"11"=> array(2, 15),
					"12"=> array(2, 15),
					"13"=> array(2, 15),
					"14"=> array(2, 15),
					"15"=> array(2, 15),
					"16"=> array(2, 15),
					"18"=> array(2, 15),
					"32"=> array(2, 15),
					"33"=> array(2, 15)
				), array(
					"5"=> array(2, 16),
					"6"=> array(2, 16),
					"7"=> array(2, 16),
					"8"=> array(2, 16),
					"9"=> array(2, 16),
					"10"=> array(2, 16),
					"11"=> array(2, 16),
					"12"=> array(2, 16),
					"13"=> array(2, 16),
					"14"=> array(2, 16),
					"15"=> array(2, 16),
					"16"=> array(2, 16),
					"18"=> array(2, 16),
					"32"=> array(2, 16),
					"33"=> array(2, 16)
				), array(
					"5"=> array(2, 17),
					"6"=> array(2, 17),
					"7"=> array(2, 17),
					"8"=> array(2, 17),
					"9"=> array(2, 17),
					"10"=> array(2, 17),
					"11"=> array(2, 17),
					"12"=> array(2, 17),
					"13"=> array(2, 17),
					"14"=> array(2, 17),
					"15"=> array(2, 17),
					"16"=> array(2, 17),
					"18"=> array(2, 17),
					"32"=> array(2, 17),
					"33"=> array(2, 17)
				), array(
					"5"=> array(2, 18),
					"6"=> array(2, 18),
					"7"=> array(2, 18),
					"8"=> array(2, 18),
					"9"=> array(2, 18),
					"10"=> array(2, 18),
					"11"=> array(2, 18),
					"12"=> array(2, 18),
					"13"=> array(2, 18),
					"14"=> array(2, 18),
					"15"=> array(2, 18),
					"16"=> array(2, 18),
					"18"=> array(2, 18),
					"32"=> array(2, 18),
					"33"=> array(2, 18)
				), array(
					"5"=> array(2, 19),
					"6"=> array(2, 19),
					"7"=> array(2, 19),
					"8"=> array(2, 19),
					"9"=> array(2, 19),
					"10"=> array(2, 19),
					"11"=> array(2, 19),
					"12"=> array(2, 19),
					"13"=> array(2, 19),
					"14"=> array(2, 19),
					"15"=> array(2, 19),
					"16"=> array(2, 19),
					"18"=> array(2, 19),
					"32"=> array(2, 19),
					"33"=> array(2, 19)
				), array(
					"5"=> array(2, 20),
					"6"=> array(2, 20),
					"7"=> array(2, 20),
					"8"=> array(2, 20),
					"9"=> array(2, 20),
					"10"=> array(2, 20),
					"11"=> array(2, 20),
					"12"=> array(2, 20),
					"13"=> array(2, 20),
					"14"=> array(2, 20),
					"15"=> array(2, 20),
					"16"=> array(2, 20),
					"18"=> array(2, 20),
					"32"=> array(2, 20),
					"33"=> array(2, 20)
				), array(
					"5"=> array(2, 21),
					"6"=> array(2, 21),
					"7"=> array(2, 21),
					"8"=> array(2, 21),
					"9"=> array(2, 21),
					"10"=> array(2, 21),
					"11"=> array(2, 21),
					"12"=> array(2, 21),
					"13"=> array(2, 21),
					"14"=> array(2, 21),
					"15"=> array(2, 21),
					"16"=> array(2, 21),
					"18"=> array(2, 21),
					"32"=> array(2, 21),
					"33"=> array(2, 21)
				), array(
					"5"=> array(2, 22),
					"6"=> array(2, 22),
					"7"=> array(2, 22),
					"8"=> array(2, 22),
					"9"=> array(2, 22),
					"10"=> array(2, 22),
					"11"=> array(2, 22),
					"12"=> array(2, 22),
					"13"=> array(2, 22),
					"14"=> array(2, 22),
					"15"=> array(2, 22),
					"16"=> array(2, 22),
					"18"=> array(2, 22),
					"32"=> array(2, 22),
					"33"=> array(2, 22)
				), array(
					"5"=> array(2, 23),
					"6"=> array(2, 23),
					"7"=> array(2, 23),
					"8"=> array(2, 23),
					"9"=> array(2, 23),
					"10"=> array(2, 23),
					"11"=> array(2, 23),
					"12"=> array(2, 23),
					"13"=> array(2, 23),
					"14"=> array(2, 23),
					"15"=> array(2, 23),
					"16"=> array(2, 23),
					"18"=> array(2, 23),
					"32"=> array(2, 23),
					"33"=> array(2, 23)
				), array(
					"5"=> array(2, 24),
					"6"=> array(2, 24),
					"7"=> array(2, 24),
					"8"=> array(2, 24),
					"9"=> array(2, 24),
					"10"=> array(2, 24),
					"11"=> array(2, 24),
					"12"=> array(2, 24),
					"13"=> array(2, 24),
					"14"=> array(2, 24),
					"15"=> array(2, 24),
					"16"=> array(2, 24),
					"18"=> array(2, 24),
					"32"=> array(2, 24),
					"33"=> array(2, 24)
				), array(
					"5"=> array(2, 25),
					"6"=> array(2, 25),
					"7"=> array(2, 25),
					"8"=> array(2, 25),
					"9"=> array(2, 25),
					"10"=> array(2, 25),
					"11"=> array(2, 25),
					"12"=> array(2, 25),
					"13"=> array(2, 25),
					"14"=> array(2, 25),
					"15"=> array(2, 25),
					"16"=> array(2, 25),
					"18"=> array(2, 25),
					"32"=> array(2, 25),
					"33"=> array(2, 25)
				), array(
					"17"=> array(1, 31)
				), array(
					"1"=> array(2, 1)
				), array(
					"4"=> 32,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"4"=> 33,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"4"=> 34,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"4"=> 35,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"4"=> 36,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"4"=> 37,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"4"=> 38,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"4"=> 39,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"4"=> 40,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"4"=> 41,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"4"=> 42,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16)
				), array(
					"5"=> array(2, 13),
					"6"=> array(2, 13),
					"7"=> array(2, 13),
					"8"=> array(2, 13),
					"9"=> array(2, 13),
					"10"=> array(2, 13),
					"11"=> array(2, 13),
					"12"=> array(2, 13),
					"13"=> array(2, 13),
					"14"=> array(1, 26),
					"15"=> array(1, 27),
					"16"=> array(1, 28),
					"18"=> array(2, 13),
					"32"=> array(2, 13),
					"33"=> array(2, 13)
				), array(
					"6"=> array(1, 18),
					"7"=> array(1, 19),
					"8"=> array(1, 20),
					"9"=> array(1, 21),
					"10"=> array(1, 22),
					"11"=> array(1, 23),
					"12"=> array(1, 24),
					"13"=> array(1, 25),
					"14"=> array(1, 26),
					"15"=> array(1, 27),
					"16"=> array(1, 28),
					"18"=> array(1, 43)
				), array(
					"4"=> 46,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"18"=> array(1, 44),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16),
					"31"=> 45
				), array(
					"5"=> array(2, 2),
					"6"=> array(2, 2),
					"7"=> array(2, 2),
					"8"=> array(2, 2),
					"9"=> array(2, 2),
					"10"=> array(1, 22),
					"11"=> array(1, 23),
					"12"=> array(1, 24),
					"13"=> array(1, 25),
					"14"=> array(1, 26),
					"15"=> array(1, 27),
					"16"=> array(1, 28),
					"18"=> array(2, 2),
					"32"=> array(2, 2),
					"33"=> array(2, 2)
				), array(
					"5"=> array(2, 3),
					"6"=> array(2, 3),
					"7"=> array(2, 3),
					"8"=> array(2, 3),
					"9"=> array(2, 3),
					"10"=> array(1, 22),
					"11"=> array(1, 23),
					"12"=> array(1, 24),
					"13"=> array(1, 25),
					"14"=> array(1, 26),
					"15"=> array(1, 27),
					"16"=> array(1, 28),
					"18"=> array(2, 3),
					"32"=> array(2, 3),
					"33"=> array(2, 3)
				), array(
					"5"=> array(2, 4),
					"6"=> array(2, 4),
					"7"=> array(2, 4),
					"8"=> array(2, 4),
					"9"=> array(2, 4),
					"10"=> array(1, 22),
					"11"=> array(1, 23),
					"12"=> array(1, 24),
					"13"=> array(1, 25),
					"14"=> array(1, 26),
					"15"=> array(1, 27),
					"16"=> array(1, 28),
					"18"=> array(2, 4),
					"32"=> array(2, 4),
					"33"=> array(2, 4)
				), array(
					"5"=> array(2, 5),
					"6"=> array(2, 5),
					"7"=> array(2, 5),
					"8"=> array(2, 5),
					"9"=> array(2, 5),
					"10"=> array(1, 22),
					"11"=> array(1, 23),
					"12"=> array(1, 24),
					"13"=> array(1, 25),
					"14"=> array(1, 26),
					"15"=> array(1, 27),
					"16"=> array(1, 28),
					"18"=> array(2, 5),
					"32"=> array(2, 5),
					"33"=> array(2, 5)
				), array(
					"5"=> array(2, 6),
					"6"=> array(2, 6),
					"7"=> array(2, 6),
					"8"=> array(2, 6),
					"9"=> array(2, 6),
					"10"=> array(2, 6),
					"11"=> array(2, 6),
					"12"=> array(1, 24),
					"13"=> array(1, 25),
					"14"=> array(1, 26),
					"15"=> array(1, 27),
					"16"=> array(1, 28),
					"18"=> array(2, 6),
					"32"=> array(2, 6),
					"33"=> array(2, 6)
				), array(
					"5"=> array(2, 7),
					"6"=> array(2, 7),
					"7"=> array(2, 7),
					"8"=> array(2, 7),
					"9"=> array(2, 7),
					"10"=> array(2, 7),
					"11"=> array(2, 7),
					"12"=> array(1, 24),
					"13"=> array(1, 25),
					"14"=> array(1, 26),
					"15"=> array(1, 27),
					"16"=> array(1, 28),
					"18"=> array(2, 7),
					"32"=> array(2, 7),
					"33"=> array(2, 7)
				), array(
					"5"=> array(2, 8),
					"6"=> array(2, 8),
					"7"=> array(2, 8),
					"8"=> array(2, 8),
					"9"=> array(2, 8),
					"10"=> array(2, 8),
					"11"=> array(2, 8),
					"12"=> array(2, 8),
					"13"=> array(2, 8),
					"14"=> array(1, 26),
					"15"=> array(1, 27),
					"16"=> array(1, 28),
					"18"=> array(2, 8),
					"32"=> array(2, 8),
					"33"=> array(2, 8)
				), array(
					"5"=> array(2, 9),
					"6"=> array(2, 9),
					"7"=> array(2, 9),
					"8"=> array(2, 9),
					"9"=> array(2, 9),
					"10"=> array(2, 9),
					"11"=> array(2, 9),
					"12"=> array(2, 9),
					"13"=> array(2, 9),
					"14"=> array(1, 26),
					"15"=> array(1, 27),
					"16"=> array(1, 28),
					"18"=> array(2, 9),
					"32"=> array(2, 9),
					"33"=> array(2, 9)
				), array(
					"5"=> array(2, 10),
					"6"=> array(2, 10),
					"7"=> array(2, 10),
					"8"=> array(2, 10),
					"9"=> array(2, 10),
					"10"=> array(2, 10),
					"11"=> array(2, 10),
					"12"=> array(2, 10),
					"13"=> array(2, 10),
					"14"=> array(2, 10),
					"15"=> array(2, 10),
					"16"=> array(1, 28),
					"18"=> array(2, 10),
					"32"=> array(2, 10),
					"33"=> array(2, 10)
				), array(
					"5"=> array(2, 11),
					"6"=> array(2, 11),
					"7"=> array(2, 11),
					"8"=> array(2, 11),
					"9"=> array(2, 11),
					"10"=> array(2, 11),
					"11"=> array(2, 11),
					"12"=> array(2, 11),
					"13"=> array(2, 11),
					"14"=> array(2, 11),
					"15"=> array(2, 11),
					"16"=> array(1, 28),
					"18"=> array(2, 11),
					"32"=> array(2, 11),
					"33"=> array(2, 11)
				), array(
					"5"=> array(2, 12),
					"6"=> array(2, 12),
					"7"=> array(2, 12),
					"8"=> array(2, 12),
					"9"=> array(2, 12),
					"10"=> array(2, 12),
					"11"=> array(2, 12),
					"12"=> array(2, 12),
					"13"=> array(2, 12),
					"14"=> array(2, 12),
					"15"=> array(2, 12),
					"16"=> array(2, 12),
					"18"=> array(2, 12),
					"32"=> array(2, 12),
					"33"=> array(2, 12)
				), array(
					"5"=> array(2, 14),
					"6"=> array(2, 14),
					"7"=> array(2, 14),
					"8"=> array(2, 14),
					"9"=> array(2, 14),
					"10"=> array(2, 14),
					"11"=> array(2, 14),
					"12"=> array(2, 14),
					"13"=> array(2, 14),
					"14"=> array(2, 14),
					"15"=> array(2, 14),
					"16"=> array(2, 14),
					"18"=> array(2, 14),
					"32"=> array(2, 14),
					"33"=> array(2, 14)
				), array(
					"5"=> array(2, 26),
					"6"=> array(2, 26),
					"7"=> array(2, 26),
					"8"=> array(2, 26),
					"9"=> array(2, 26),
					"10"=> array(2, 26),
					"11"=> array(2, 26),
					"12"=> array(2, 26),
					"13"=> array(2, 26),
					"14"=> array(2, 26),
					"15"=> array(2, 26),
					"16"=> array(2, 26),
					"18"=> array(2, 26),
					"32"=> array(2, 26),
					"33"=> array(2, 26)
				), array(
					"18"=> array(1, 47)
				), array(
					"6"=> array(1, 18),
					"7"=> array(1, 19),
					"8"=> array(1, 20),
					"9"=> array(1, 21),
					"10"=> array(1, 22),
					"11"=> array(1, 23),
					"12"=> array(1, 24),
					"13"=> array(1, 25),
					"14"=> array(1, 26),
					"15"=> array(1, 27),
					"16"=> array(1, 28),
					"18"=> array(2, 28),
					"32"=> array(1, 48),
					"33"=> array(1, 49)
				), array(
					"5"=> array(2, 27),
					"6"=> array(2, 27),
					"7"=> array(2, 27),
					"8"=> array(2, 27),
					"9"=> array(2, 27),
					"10"=> array(2, 27),
					"11"=> array(2, 27),
					"12"=> array(2, 27),
					"13"=> array(2, 27),
					"14"=> array(2, 27),
					"15"=> array(2, 27),
					"16"=> array(2, 27),
					"18"=> array(2, 27),
					"32"=> array(2, 27),
					"33"=> array(2, 27)
				), array(
					"4"=> 46,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16),
					"31"=> 50
				), array(
					"4"=> 46,
					"13"=> array(1, 3),
					"17"=> array(1, 4),
					"19"=> array(1, 5),
					"20"=> array(1, 6),
					"21"=> array(1, 7),
					"22"=> array(1, 8),
					"23"=> array(1, 9),
					"24"=> array(1, 10),
					"25"=> array(1, 11),
					"26"=> array(1, 12),
					"27"=> array(1, 13),
					"28"=> array(1, 14),
					"29"=> array(1, 15),
					"30"=> array(1, 16),
					"31"=> 51
				), array(
					"18"=> array(2, 29)
				), array(
					"18"=> array(2, 30)
				)
			),
			"defaultActions"=> array(
				"17"=> array(2, 1),
				"50"=> array(2, 29),
				"51"=> array(2, 30)
			)
		);
		
		$this->lexer();
	}
	
	function parseError($str, $hash) {
		throw new Error($str);
	}
	
	function parse($input, $fn, $cell) {
		$self = $this;
		$stack = array(0);
		$vstack = array(null);
		// semantic value stack
		$table = $this->parser->table;
		$yytext = '';
		$yylineno = 0;
		$yyleng = 0;
		$shifts = 0;
		$reductions = 0;
		$recovering = 0;
		$TERROR = 2;
		$EOF = 1;

		$this->lexer->setInput($input);
		$this->lexer->yy = $this->yy;
		$this->yy->lexer = $this->lexer;

		$parseError = $this->yy->parseError = (function_exists($this->yy->parseError) ? $this->yy->parseError : $this->parseError);

		function popStack($n) {
			global $stack, $vstack;
			array_slice($stack, 0, 2 * $n);
			array_slice($vstack, 0, $n);
			//$stack.length = $stack.length - 2 * $n;
			//$vstack.length = $vstack.length - $n;
		}

		function lex() {
			$token = $self->lexer->lex() || 1; // $end = 1
			// if token isn't its numeric value, convert
			if (is_numeric($token)) {
				$token = $self->symbols_[$token] || $token;
			}
			return $token;
		}

		//$symbol, $preErrorSymbol, $state, $action, $a, $r, $yyval = array();
		//$p, $len, $newState, $expected, $recovered = false;
		
		$yyval = array();
		$recovered = false;
		
		while (true) {
			// retreive state number from top of stack
			$state = $stack[count($stack) - 1];
	
			// use default actions if available
			if ($this->defaultActions[$state]) {
				$action = $this->defaultActions[$state];
			} else {
				if ($symbol == null) $symbol = lex();
				// read action for current state and first input
				$action = $table[$state] && $table[$state][$symbol];
			}
	
			// handle parse error
			if (!isset($action) || !count($action) || !$action[0]) {
	
				if (!$recovering) {
					// Report error
					$expected = array();
					foreach($table[$state] as $p) if ($this->terminals_[$p] && $p > 2) {
						array_push($expected, "'" + $this->terminals_[$p] + "'");
					}
					$errStr = '';
					if ($this->lexer->showPosition) {
						$errStr = 'Parse error on line ' . ($yylineno + 1) . ":\n" . $this->lexer->showPosition() . '\nExpecting ' . expected.join(', ');
					} else {
						$errStr = 'Parse error on line ' . ($yylineno + 1) . ": Unexpected " . ($symbol == 1 /*EOF*/ ? "end of input" : ("'" . ($this->terminals_[$symbol] || $symbol) . "'"));
					}
					
					$parseError->call($this, $errStr, array(
						text=> $this->lexer->match,
						token=> $this->terminals_[$symbol] || $symbol,
						line=> $this->lexer->yylineno,
						expected=> $expected
					));
				}
	
				// just recovered from another error
				if ($recovering == 3) {
					if ($symbol == $EOF) {
						throw new Error($errStr || 'Parsing halted.');
					}
		
					// discard current lookahead and grab another
					$yyleng = $this->lexer->yyleng;
					$yytext = $this->lexer->yytext;
					$yylineno = $this->lexer->yylineno;
					$symbol = lex();
				}
	
				// try to recover from error
				while (1) {
					// check for error recovery rule in this state
					/*if ((string)$TERROR in $table[$state]) {
						break;
					}*/
					if ($state == 0) {
						throw new Error($errStr || 'Parsing halted.');
					}
					popStack(1);
					$state = $stack[count($stack) - 1];
				}
	
				$preErrorSymbol = $symbol; // save the lookahead token
				$symbol = $TERROR; // insert generic error symbol as new lookahead
				$state = $stack[count($stack) - 1];
				$action = $table[$state] && $table[$state][$TERROR];
				$recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
			}
	
			// this shouldn't happen, unless resolve defaults are off
			if (is_array($action[0]) && count($action) > 1) {
				throw new Error('Parse Error: multiple actions possible at state: ' . state . ', token: ' . symbol);
			}
	
			$a = $action;
	
			switch ($a[0]) {
				case 1:
					// shift
					$shifts++;
		
					array_push($stack, $symbol);
					array_push($vstack, $this->lexer->yytext); // semantic values or junk only, no terminals
					array_push($stack, $a[1]); // push state
					$symbol = null;
					if (!$preErrorSymbol) { // normal execution/no error
						$yyleng = $this->lexer->yyleng;
						$yytext = $this->lexer->yytext;
						$yylineno = $this->lexer->yylineno;
						if ($recovering > 0) $recovering--;
					} else { // error just occurred, resume old lookahead f/ before error
						$symbol = $preErrorSymbol;
						$preErrorSymbol = null;
					}
					break;
		
				case 2:
					// reduce
					$reductions++;
		
					$len = $this->productions_[$a[1]][1];
		
					// perform semantic action
					$yyval->S = $vstack[count($vstack) - $len]; // default to $S = $1
					$r = $this->performAction.call($yyval, $yytext, $yyleng, $yylineno, $this->yy, $a[1], $vstack, $fn, $cell);
		
					if (!isset($r)) {
						return $r;
					}
		
					// pop off stack
					if ($len) {
						$stack = $stack->slice(0, -1 * $len * 2);
						$vstack = $vstack->slice(0, -1 * $len);
					}
		
					array_push($stack, $this->productions_[$a[1]][0]); // push nonterminal (reduce)
					array_push($vstack, $yyval.S);
					// goto new state = table[STATE][NONTERMINAL]
					$newState = $table[$stack[count($stack) - 2]][$stack[count($stack) - 1]];
					array_push($stack, $newState);
					break;
		
				case 3:
					// accept
					$this->reductionCount = $reductions;
					$this->shiftCount = $shifts;
					return true;
			}

		}

		return true;
	}
	
	/* Jison generated lexer */
	function lexer() {
		$this->lexer = (object)array(
			"EOF"=> "",
			"parseError"=> function ($str, $hash) {
				if ($this->yy->parseError) {
					$this->yy->parseError($str, $hash);
				} else {
					throw new Error($str);
				}
			},
			"setInput"=> function ($input) {
				print_r($this->lexer);
				die;
				$this->lexer->_input = $input;
				$this->lexer->_more = $this->lexer->_less = $this->lexer->done = false;
				$this->lexer->yylineno = $this->lexer->yyleng = 0;
				$this->lexer->yytext = $this->lexer->matched = $this->lexer->match = '';
				return $this;
			},
			"input"=> function () {
				$ch = $this->_input[0];
				$this->yytext += $ch;
				$this->yyleng++;
				$this->match += $ch;
				$this->matched += $ch;
				$lines = preg_match("\n", $ch);
				if ($lines) $this->yylineno++;
				array_slice($this->_input, 1);
				return $ch;
			},
			"unput"=> function ($ch) {
				$this->_input = $ch + $this->_input;
				return $this;
			},
			"more"=> function () {
				$this->_more = true;
				return $this;
			},
			"pastInput"=> function () {
				$past = substr($this->matched, 0, count($this->matched) - count($this.match));
				return (strlen($past) > 20 ? '...' : '') . preg_replace("\n", "", substr($past, -20));
			},
			"upcomingInput"=> function () {
				$next = $this->match;
				if (strlen($next) < 20) {
					$next .= substr($this->_input, 0, 20 - strlen($next));
				}
				return preg_replace("\n", "", substr($next, 0, 20) . (strlen($next) > 20 ? '...' : ''));
			},
			"showPosition"=> function () {
				$pre = $this->pastInput();
				$c = implode(array(strlen($pre) + 1), "-");
				return $pre . $this->upcomingInput() . "\n" . c . "^";
			},
			"next"=> function () {
				if ($this->done) {
					return $this->EOF;
				}
				if (!$this->_input) $this->done = true;
		
				//$token, $match, $lines;
				if (!$this->_more) {
					$this->yytext = '';
					$this->match = '';
				}
				for ($i = 0; $i < count($this->rules); $i++) {
					$match = preg_match($this->rules[$i], $this->_input);
					if ($match) {
						$lines = preg_match("\n", $match[0]);
						if ($lines) $this->yylineno += strlen($lines);
						$this->yytext .= $match[0];
						$this->match .= $match[0];
						$this->matches = $match;
						$this->yyleng = strlen($this->yytext);
						$this->_more = false;
						$this->_input = array_slice($this->_input, count($match[0]));
						$this->matched .= $match[0];
						$token = $this->performAction.call($this, $this->yy, $this, $i);
						if ($token) return $token;
						else
						return;
					}
				}
				if ($this->_input == $this->EOF) {
					return $this->EOF;
				} else {
					$this->parseError('Lexical error on line ' . ($this->yylineno + 1) . '. Unrecognized text.\n' . $this->showPosition(), array(
						text=> "",
						token=> null,
						line=> $this->yylineno
					));
				}
			},
			"lex"=> function () {
				$r = $this->next();
				if (isset($r)) {
					return $r;
				} else {
					return $this->lex();
				}
			}
		);
		
		$this->lexer->performAction = function ($yy, $yy_) {
	
			switch ($arguments[2]) {
				case 0:
				/* skip whitespace */
				break;
				case 1:
				return 29;
				break;
				case 2:
				return 29;
				break;
				case 3:
				return 24;
				break;
				case 4:
				return 23;
				break;
				case 5:
				return 28;
				break;
				case 6:
				return 27;
				break;
				case 7:
				return 26;
				break;
				case 8:
				return 25;
				break;
				case 9:
				return 30;
				break;
				case 10:
				return 20;
				break;
				case 11:
				return 19;
				break;
				case 12:
				return 21;
				break;
				case 13:
				/* skip whitespace */
				break;
				case 14:
				return ' ';
				break;
				case 15:
				return '.';
				break;
				case 16:
				return ':';
				break;
				case 17:
				return 32;
				break;
				case 18:
				return 33;
				break;
				case 19:
				return 14;
				break;
				case 20:
				return 15;
				break;
				case 21:
				return 13;
				break;
				case 22:
				return 12;
				break;
				case 23:
				return 16;
				break;
				case 24:
				return 17;
				break;
				case 25:
				return 18;
				break;
				case 26:
				return 10;
				break;
				case 27:
				return 11;
				break;
				case 28:
				return 7;
				break;
				case 29:
				return 6;
				break;
				case 30:
				return 8;
				break;
				case 31:
				return 9;
				break;
				case 32:
				return 'PI';
				break;
				case 33:
				return 22;
				break;
				case 34:
				return '"';
				break;
				case 35:
				return "'";
				break;
				case 36:
				return "!";
				break;
				case 37:
				return 5;
				break;
				case 38:
				return '=';
				break;
			}
		};
		
		$this->lexer->rules = array(
			'^\s+/,/^"(\\["]|[^"])*"',
			"^'(\\[']|[^'])*'",
			'^\$[A-Za-z]+\$[0-9]+[:]\$[A-Za-z]+\$[0-9]+',
			'^\$[A-Za-z]+\$[0-9]+',
			"^SHEET[0-9]+[:!][A-Za-z]+[0-9]+[:][A-Za-z]+[0-9]+",
			"^SHEET[0-9]+[:!][A-Za-z]+[0-9]+",
			"^[A-Za-z]+[0-9]+[:][A-Za-z]+[0-9]+",
			"^[A-Za-z]+[0-9]+",
			"^[A-Za-z]+",
			"^[0-9]([0-9]?)[-/][0-9]([0-9]?)[-/][0-9]([0-9]?)([0-9]?)([0-9]?)",
			"^[0-9]+[%]",
			"^[0-9]+(\.[0-9]+)?",
			'^\$',
			"^ ",
			"^\.",
			"^:",
			"^;",
			"^,",
			"^\*",
			"^\/",
			"^-",
			"^\+",
			"^\^",
			"^\(",
			"^\)",
			"^>",
			"^<",
			"^>=",
			"^<=",
			"^<>",
			"^NOT\b",
			"^PI\b",
			"^E\b",
			'^"',
			"^'",
			"^!",
			'^$',
			"^="
		);
	}
}

if (isset($require)) {
	$exports = array(
		"parser"=> $parser,
		"parse"=> function () {
			return $parser->parse.apply($parser, $arguments);
		},
		"main"=> function ($args) {
			if (!$args[1]) throw new Error('Usage: ' + $args[0] + ' FILE');
			if (isset($process)) {
				$source = require('fs').readFileSync(require('path').join($process.cwd(), $args[1]), "utf8");
			} else {
				/*$cwd = require("file")->path(require("file").cwd());
				$source = $cwd.join(args[1]).read({
					charset: "utf-8"
				});*/
			}
			return $exports->parser->parse($source);
		}
	);
	
	if (isset($module) && $require->main === $module) {
		$exports->main(isset($process) ? array_slice($process->argv, 1) : $require("system")->args);
	}
}

$parser = new parser;
print_r($parser->parse("100+100","",""));
