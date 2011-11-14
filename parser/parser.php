<?php
/* Jison generated parser */
class Parser {
	function __construct($lexer = null) {
		
		$this->lexer = (!empty($lexer) ? $lexer : new ParserLexer);
	}
	
	function trace() {}
	
	var $yy;

	var $symbols_ = array("error"=>2,"expressions"=>3,"e"=>4,"EOF"=>5,"="=>6,"<"=>7,">"=>8,"NOT"=>9,"+"=>10,"-"=>11,"*"=>12,"/"=>13,"^"=>14,"("=>15,")"=>16,"%"=>17,"NUMBER"=>18,"E"=>19,"FIXEDCELL"=>20,"=>"=>21,"CELL"=>22,"SHEET"=>23,"!"=>24,"STRING"=>25,"IDENTIFIER"=>26,"expseq"=>27,";"=>28,","=>29,"accept"=>0,"end"=>1);
	
	var $terminals_ = array("2"=>"error","5"=>"EOF","6"=>"=","7"=>"<","8"=>">","9"=>"NOT","10"=>"+","11"=>"-","12"=>"*","13"=>"/","14"=>"^","15"=>"(","16"=>")","17"=>"%","18"=>"NUMBER","19"=>"E","20"=>"FIXEDCELL","21"=>"=>","22"=>"CELL","23"=>"SHEET","24"=>"!","25"=>"STRING","26"=>"IDENTIFIER","28"=>";","29"=>",");
	
	var $productions_ = array(0,array(3,2),array(4,3),array(4,4),array(4,4),array(4,4),array(4,3),array(4,3),array(4,3),array(4,3),array(4,3),array(4,3),array(4,3),array(4,3),array(4,2),array(4,2),array(4,3),array(4,2),array(4,1),array(4,1),array(4,1),array(4,3),array(4,1),array(4,3),array(4,3),array(4,5),array(4,1),array(4,3),array(4,4),array(27,1),array(27,3),array(27,3));
	
	var $debug = false;
	
	function performAction(&$thisS, $yytext, $yyleng, $yylineno, $yy, $yystate, $S, $_S) {
		$O = count($S) - 1;
		


switch ($yystate) {
case 1:return $S[$O-1];
break;
case 2:$thisS = ($S[$O-2] * 1) == ($S[$O] * 1);
break;
case 3:$thisS = ($S[$O-3] * 1) <= ($S[$O] * 1);
break;
case 4:$thisS = ($S[$O-3] * 1) >= ($S[$O] * 1);
break;
case 5:$thisS = ($S[$O-3] * 1) != ($S[$O] * 1);
break;
case 6:$thisS = ($S[$O-2] * 1) != ($S[$O] * 1);
break;
case 7:$thisS = ($S[$O-2] * 1) > ($S[$O] * 1);
break;
case 8:$thisS = ($S[$O-2] * 1) < ($S[$O] * 1);
break;
case 9:$thisS = ($S[$O-2] * 1) + ($S[$O] * 1);
break;
case 10:$thisS = ($S[$O-2] * 1) - ($S[$O] * 1);
break;
case 11:$thisS = ($S[$O-2] * 1) * ($S[$O] * 1);
break;
case 12:$thisS = ($S[$O-2] * 1) / ($S[$O] * 1);
break;
case 13:$thisS = pow(($S[$O-2] * 1), ($S[$O] * 1));
break;
case 14:$thisS = $S[$O] * -1;
break;
case 15:$thisS = $S[$O] * 1;
break;
case 16:$thisS = $S[$O-1];
break;
case 17:$thisS = $S[$O-1] * 0.01;
break;
case 18:$thisS = $yytext;
break;
case 19:/*$thisS = Math->E;*/;
break;
case 20:$thisS = $yy->lexer->cellHandlers->apply('fixedCellValue', $yy->lexer->cell, array($S[$O]));
break;
case 21:$thisS = $yy->lexer->cellHandlers->apply('fixedCellRangeValue', $yy->lexer->cell, array($S[$O-2], $S[$O]));
break;
case 22:$thisS = $yy->lexer->cellHandlers->apply('cellValue', $yy->lexer->cell, array($S[$O]));
break;
case 23:$thisS = $yy->lexer->cellHandlers->apply('cellRangeValue', $yy->lexer->cell, array($S[$O-2], $S[$O]));
break;
case 24:$thisS = $yy->lexer->cellHandlers->apply('remoteCellValue', $yy->lexer->cell, array($S[$O-2], $S[$O]));
break;
case 25:$thisS = $yy->lexer->cellHandlers->apply('remoteCellRangeValue', $yy->lexer->cell, array($S[$O-4], $S[$O-2], $S[$O]));
break;
case 26:$thisS = $S[$O]->substring(1, $S[$O]->length - 1);
break;
case 27:$thisS = $yy->lexer->cellHandlers->callFunction($S[$O-2], '', $yy->lexer->cell);
break;
case 28:$thisS = $yy->lexer->cellHandlers->callFunction($S[$O-3], $S[$O-1], $yy->lexer->cell);
break;
case 30:
 		$thisS = (is_array($S[$O]) ? $S[$O] : array($S[$O]));
	 	$thisS->push($S[$O-2]);
 	
break;
case 31:
 		$thisS = (is_array($S[$O]) ? $S[$O] : array($S[$O]));
	 	$thisS->push($S[$O-2]);
 	
break;
}

	}

	var $table = array(array("3"=>1,"4"=>2,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("1"=>array(3)),array("5"=>array(1,13),"6"=>array(1,14),"7"=>array(1,15),"8"=>array(1,16),"9"=>array(1,17),"10"=>array(1,18),"11"=>array(1,19),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"17"=>array(1,23)),array("4"=>24,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("4"=>25,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("4"=>26,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("5"=>array(2,18),"6"=>array(2,18),"7"=>array(2,18),"8"=>array(2,18),"9"=>array(2,18),"10"=>array(2,18),"11"=>array(2,18),"12"=>array(2,18),"13"=>array(2,18),"14"=>array(2,18),"16"=>array(2,18),"17"=>array(2,18),"28"=>array(2,18),"29"=>array(2,18)),array("5"=>array(2,19),"6"=>array(2,19),"7"=>array(2,19),"8"=>array(2,19),"9"=>array(2,19),"10"=>array(2,19),"11"=>array(2,19),"12"=>array(2,19),"13"=>array(2,19),"14"=>array(2,19),"16"=>array(2,19),"17"=>array(2,19),"28"=>array(2,19),"29"=>array(2,19)),array("5"=>array(2,20),"6"=>array(2,20),"7"=>array(2,20),"8"=>array(2,20),"9"=>array(2,20),"10"=>array(2,20),"11"=>array(2,20),"12"=>array(2,20),"13"=>array(2,20),"14"=>array(2,20),"16"=>array(2,20),"17"=>array(2,20),"21"=>array(1,27),"28"=>array(2,20),"29"=>array(2,20)),array("5"=>array(2,22),"6"=>array(2,22),"7"=>array(2,22),"8"=>array(2,22),"9"=>array(2,22),"10"=>array(2,22),"11"=>array(2,22),"12"=>array(2,22),"13"=>array(2,22),"14"=>array(2,22),"16"=>array(2,22),"17"=>array(2,22),"21"=>array(1,28),"28"=>array(2,22),"29"=>array(2,22)),array("24"=>array(1,29)),array("5"=>array(2,26),"6"=>array(2,26),"7"=>array(2,26),"8"=>array(2,26),"9"=>array(2,26),"10"=>array(2,26),"11"=>array(2,26),"12"=>array(2,26),"13"=>array(2,26),"14"=>array(2,26),"16"=>array(2,26),"17"=>array(2,26),"28"=>array(2,26),"29"=>array(2,26)),array("15"=>array(1,30)),array("1"=>array(2,1)),array("4"=>31,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("4"=>34,"6"=>array(1,32),"8"=>array(1,33),"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("4"=>36,"6"=>array(1,35),"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("4"=>37,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("4"=>38,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("4"=>39,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("4"=>40,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("4"=>41,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("4"=>42,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("5"=>array(2,17),"6"=>array(2,17),"7"=>array(2,17),"8"=>array(2,17),"9"=>array(2,17),"10"=>array(2,17),"11"=>array(2,17),"12"=>array(2,17),"13"=>array(2,17),"14"=>array(2,17),"16"=>array(2,17),"17"=>array(2,17),"28"=>array(2,17),"29"=>array(2,17)),array("5"=>array(2,14),"6"=>array(2,14),"7"=>array(2,14),"8"=>array(2,14),"9"=>array(2,14),"10"=>array(2,14),"11"=>array(2,14),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(2,14),"17"=>array(1,23),"28"=>array(2,14),"29"=>array(2,14)),array("5"=>array(2,15),"6"=>array(2,15),"7"=>array(2,15),"8"=>array(2,15),"9"=>array(2,15),"10"=>array(2,15),"11"=>array(2,15),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(2,15),"17"=>array(1,23),"28"=>array(2,15),"29"=>array(2,15)),array("6"=>array(1,14),"7"=>array(1,15),"8"=>array(1,16),"9"=>array(1,17),"10"=>array(1,18),"11"=>array(1,19),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(1,43),"17"=>array(1,23)),array("20"=>array(1,44)),array("22"=>array(1,45)),array("22"=>array(1,46)),array("4"=>49,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"16"=>array(1,47),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12),"27"=>48),array("5"=>array(2,2),"6"=>array(2,2),"7"=>array(1,15),"8"=>array(1,16),"9"=>array(1,17),"10"=>array(1,18),"11"=>array(1,19),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(2,2),"17"=>array(1,23),"28"=>array(2,2),"29"=>array(2,2)),array("4"=>50,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("4"=>51,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("5"=>array(2,8),"6"=>array(2,8),"7"=>array(2,8),"8"=>array(2,8),"9"=>array(2,8),"10"=>array(1,18),"11"=>array(1,19),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(2,8),"17"=>array(1,23),"28"=>array(2,8),"29"=>array(2,8)),array("4"=>52,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12)),array("5"=>array(2,7),"6"=>array(2,7),"7"=>array(2,7),"8"=>array(2,7),"9"=>array(2,7),"10"=>array(1,18),"11"=>array(1,19),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(2,7),"17"=>array(1,23),"28"=>array(2,7),"29"=>array(2,7)),array("5"=>array(2,6),"6"=>array(2,6),"7"=>array(1,15),"8"=>array(1,16),"9"=>array(2,6),"10"=>array(1,18),"11"=>array(1,19),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(2,6),"17"=>array(1,23),"28"=>array(2,6),"29"=>array(2,6)),array("5"=>array(2,9),"6"=>array(2,9),"7"=>array(2,9),"8"=>array(2,9),"9"=>array(2,9),"10"=>array(2,9),"11"=>array(2,9),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(2,9),"17"=>array(1,23),"28"=>array(2,9),"29"=>array(2,9)),array("5"=>array(2,10),"6"=>array(2,10),"7"=>array(2,10),"8"=>array(2,10),"9"=>array(2,10),"10"=>array(2,10),"11"=>array(2,10),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(2,10),"17"=>array(1,23),"28"=>array(2,10),"29"=>array(2,10)),array("5"=>array(2,11),"6"=>array(2,11),"7"=>array(2,11),"8"=>array(2,11),"9"=>array(2,11),"10"=>array(2,11),"11"=>array(2,11),"12"=>array(2,11),"13"=>array(2,11),"14"=>array(1,22),"16"=>array(2,11),"17"=>array(1,23),"28"=>array(2,11),"29"=>array(2,11)),array("5"=>array(2,12),"6"=>array(2,12),"7"=>array(2,12),"8"=>array(2,12),"9"=>array(2,12),"10"=>array(2,12),"11"=>array(2,12),"12"=>array(2,12),"13"=>array(2,12),"14"=>array(1,22),"16"=>array(2,12),"17"=>array(1,23),"28"=>array(2,12),"29"=>array(2,12)),array("5"=>array(2,13),"6"=>array(2,13),"7"=>array(2,13),"8"=>array(2,13),"9"=>array(2,13),"10"=>array(2,13),"11"=>array(2,13),"12"=>array(2,13),"13"=>array(2,13),"14"=>array(2,13),"16"=>array(2,13),"17"=>array(1,23),"28"=>array(2,13),"29"=>array(2,13)),array("5"=>array(2,16),"6"=>array(2,16),"7"=>array(2,16),"8"=>array(2,16),"9"=>array(2,16),"10"=>array(2,16),"11"=>array(2,16),"12"=>array(2,16),"13"=>array(2,16),"14"=>array(2,16),"16"=>array(2,16),"17"=>array(2,16),"28"=>array(2,16),"29"=>array(2,16)),array("5"=>array(2,21),"6"=>array(2,21),"7"=>array(2,21),"8"=>array(2,21),"9"=>array(2,21),"10"=>array(2,21),"11"=>array(2,21),"12"=>array(2,21),"13"=>array(2,21),"14"=>array(2,21),"16"=>array(2,21),"17"=>array(2,21),"28"=>array(2,21),"29"=>array(2,21)),array("5"=>array(2,23),"6"=>array(2,23),"7"=>array(2,23),"8"=>array(2,23),"9"=>array(2,23),"10"=>array(2,23),"11"=>array(2,23),"12"=>array(2,23),"13"=>array(2,23),"14"=>array(2,23),"16"=>array(2,23),"17"=>array(2,23),"28"=>array(2,23),"29"=>array(2,23)),array("5"=>array(2,24),"6"=>array(2,24),"7"=>array(2,24),"8"=>array(2,24),"9"=>array(2,24),"10"=>array(2,24),"11"=>array(2,24),"12"=>array(2,24),"13"=>array(2,24),"14"=>array(2,24),"16"=>array(2,24),"17"=>array(2,24),"21"=>array(1,53),"28"=>array(2,24),"29"=>array(2,24)),array("5"=>array(2,27),"6"=>array(2,27),"7"=>array(2,27),"8"=>array(2,27),"9"=>array(2,27),"10"=>array(2,27),"11"=>array(2,27),"12"=>array(2,27),"13"=>array(2,27),"14"=>array(2,27),"16"=>array(2,27),"17"=>array(2,27),"28"=>array(2,27),"29"=>array(2,27)),array("16"=>array(1,54)),array("6"=>array(1,14),"7"=>array(1,15),"8"=>array(1,16),"9"=>array(1,17),"10"=>array(1,18),"11"=>array(1,19),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(2,29),"17"=>array(1,23),"28"=>array(1,55),"29"=>array(1,56)),array("5"=>array(2,3),"6"=>array(2,3),"7"=>array(2,3),"8"=>array(2,3),"9"=>array(2,3),"10"=>array(1,18),"11"=>array(1,19),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(2,3),"17"=>array(1,23),"28"=>array(2,3),"29"=>array(2,3)),array("5"=>array(2,5),"6"=>array(2,5),"7"=>array(2,5),"8"=>array(2,5),"9"=>array(2,5),"10"=>array(1,18),"11"=>array(1,19),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(2,5),"17"=>array(1,23),"28"=>array(2,5),"29"=>array(2,5)),array("5"=>array(2,4),"6"=>array(2,4),"7"=>array(2,4),"8"=>array(2,4),"9"=>array(2,4),"10"=>array(1,18),"11"=>array(1,19),"12"=>array(1,20),"13"=>array(1,21),"14"=>array(1,22),"16"=>array(2,4),"17"=>array(1,23),"28"=>array(2,4),"29"=>array(2,4)),array("22"=>array(1,57)),array("5"=>array(2,28),"6"=>array(2,28),"7"=>array(2,28),"8"=>array(2,28),"9"=>array(2,28),"10"=>array(2,28),"11"=>array(2,28),"12"=>array(2,28),"13"=>array(2,28),"14"=>array(2,28),"16"=>array(2,28),"17"=>array(2,28),"28"=>array(2,28),"29"=>array(2,28)),array("4"=>49,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12),"27"=>58),array("4"=>49,"10"=>array(1,4),"11"=>array(1,3),"15"=>array(1,5),"18"=>array(1,6),"19"=>array(1,7),"20"=>array(1,8),"22"=>array(1,9),"23"=>array(1,10),"25"=>array(1,11),"26"=>array(1,12),"27"=>59),array("5"=>array(2,25),"6"=>array(2,25),"7"=>array(2,25),"8"=>array(2,25),"9"=>array(2,25),"10"=>array(2,25),"11"=>array(2,25),"12"=>array(2,25),"13"=>array(2,25),"14"=>array(2,25),"16"=>array(2,25),"17"=>array(2,25),"28"=>array(2,25),"29"=>array(2,25)),array("16"=>array(2,30)),array("16"=>array(2,31)));
	
	var $defaultActions = array("13"=>array(2,1),"58"=>array(2,30),"59"=>array(2,31));
	
	function popStack($n, $stack, $vstack, $lstack) {
		array_slice($stack, 0, 2 * $n);
		array_slice($vstack, 0, $n);
		array_slice($lstack, 0, $n);
	}
	
	function lex() {
		$token = $this->lexer->lex(); // $end = 1
		$token = (empty($token) ? 1 : $token);
		// if token isn't its numeric value, convert
		if (!is_numeric($token)) {
			$token = (array_key_exists($token, $this->symbols_) ? $this->symbols_[$token] : $token);
		}
		return $token;
	}
	
	function parseError($str, $hash = "") {
		throw new Exception($str);
	}
	
	function parse($input) {
		$self = $this;
		$stack = array(0);
		$vstack = array(null);
		// semantic value stack
		$lstack = array();
		//location stack
		$table = $this->table;
		$yytext = '';
		$yylineno = 0;
		$yyleng = 0;
		$shifts = 0;
		$reductions = 0;
		$recovering = 0;
		$TERROR = 2;
		$EOF = 1;
		
		$this->yy = (object)array();
		$this->lexer->setInput($input);
		$this->lexer->yy = $this->yy;
		$this->yy->lexer = $this->lexer;
		if (empty($this->lexer->yylloc)) $this->lexer->yylloc = (object)array();
		$yyloc = $this->lexer->yylloc;
		array_push($lstack, $yyloc);
		
		if (!empty($this->yy->parseError) && function_exists($this->yy->parseError)) $this->parseError = $this->yy->parseError;

		//$symbol, $preErrorSymbol, $state, $action, $a, $r, $yyval = array();
		//$p, $len, $newState, $expected, $recovered = false;
		
		$yyval = (object)array();
		$recovered = false;
		
		while (true) {
			// retreive state number from top of stack
			$state = $stack[count($stack) - 1];
			// use default actions if available
			if (array_key_exists($state, $this->defaultActions)) {
				$action = $this->defaultActions[$state];		
			} else {
				if (empty($symbol)) {
					$symbol = $this->lex();
				}
				// read action for current state and first input
				if (array_key_exists($state, $table)) {
					if (array_key_exists($symbol, $table[$state])) {
						$action = $table[$state][$symbol];
					}
				}
			}
			
			if (empty($action) == true) {
				if (empty($recovering) == false) {
					// Report error
					$expected = array();
					foreach($table[$state] as $p) {
						if ($p > 2) {
							array_push($expected, implode($p));
						}
					}
					
					$errStr = 'Parse error on line ' . ($yylineno + 1) . ":\n" . $this->lexer->showPosition() . '\nExpecting ' . implode(', ', $expected);
			
					$this->lexer->parseError($errStr, array(
						"text"=> $this->lexer->match,
						"token"=> $symbol,
						"line"=> $this->lexer->yylineno,
						"loc"=> $yyloc,
						"expected"=> $expected
					));
				}
	
				// just recovered from another error
				if ($recovering == 3) {
					if ($symbol == $EOF) {
						$this->parseError(isset($errStr) ? $errStr : 'Parsing halted.');
					}
		
					// discard current lookahead and grab another
					$yyleng = $this->lexer->yyleng;
					$yytext = $this->lexer->yytext;
					$yylineno = $this->lexer->yylineno;
					$yyloc = $this->lexer->yylloc;
					$symbol = $this->lex();
				}
	
				// try to recover from error
				while (true) {
					// check for error recovery rule in this state
					if (array_key_exists($TERROR, $table[$state])) {
						break 2;
					}
					if ($state == 0) {
						$this->parseError(isset($errStr) ? $errStr : 'Parsing halted.');
					}
					$this->popStack(1, $stack, $vstack);
					
					array_slice($stack, 0, 2 * 1);
					array_slice($vstack, 0, 1);
					
					$lenn = count($stack) - 1;
					
					$state = $stack[count($stack) - 1];
				}
	
				$preErrorSymbol = $symbol; // save the lookahead token
				$symbol = $TERROR; // insert generic error symbol as new lookahead
				$state = $stack[count($stack) - 1];
				if (array_key_exists($state, $table)) {
					if (array_key_exists($TERROR, $table[$state])) {
						$action = $table[$state][$TERROR];
					}
				}
				$recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
			}
	
			// this shouldn't happen, unless resolve defaults are off
			if (is_array($action[0]) && count($action) > 1) {
				$this->parseError('Parse Error: multiple actions possible at state: ' . $state . ', token: ' . $symbol);
			}
			
			switch ($action[0]) {
				case 1:
					// shift
					//$this->shiftCount++;
					array_push($stack, $symbol);
					array_push($vstack, $this->lexer->yytext);
					array_push($lstack, $this->lexer->yylloc);
					array_push($stack, $action[1]); // push state
					$symbol = "";
					if (empty($preErrorSymbol)) { // normal execution/no error
						$yyleng = $this->lexer->yyleng;
						$yytext = $this->lexer->yytext;
						$yylineno = $this->lexer->yylineno;
						$yyloc = $this->lexer->yylloc;
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
					$yyval->S = $vstack[count($vstack) - $len];// default to $S = $1
					// default location, uses first token for firsts, last for lasts
					$yyval->_S = (object)array(
                        "first_line"=> $lstack[count($lstack) - ($len || 1)]->first_line,
                        "last_line"=> $lstack[count($lstack) - 1]->last_line,
                        "first_column"=> $lstack[count($lstack) - ($len || 1)]->first_column,
                        "last_column"=> $lstack[count($lstack) - 1]->last_column
                    );
					
					$r = $this->performAction($yyval->S, $yytext, $yyleng, $yylineno, $this->yy, $action[1], $vstack, $lstack);
					
					if (empty($r) == false) {
						return $r;
					}
					
					// pop off stack		
					if ($len > 0) {
						$stack = array_slice($stack, 0, -1 * $len * 2);
						$vstack = array_slice($vstack, 0, -1 * $len);
						$lstack = array_slice($lstack, 0, -1 * $len);
					}
					
					array_push($stack, $this->productions_[$action[1]][0]); // push nonterminal (reduce)
					array_push($vstack, $yyval->S);
					array_push($lstack, $yyval->_S);
					
					// goto new state = table[STATE][NONTERMINAL]
					$newState = $table[$stack[count($stack) - 2]][$stack[count($stack) - 1]];
					array_push($stack, $newState);
					break;
		
				case 3:
					// accept
					return true;
			}

		}

		return true;
	}
}

/* Jison generated lexer */
class ParserLexer {
	var $EOF = 1;
	var $S = "";
	var $yy = "";
	var $yylineno = "";
	var $yyleng = "";
	var $yytext = "";
	var $matched = "";
	var $match = "";
	var $conditionsStack = array();
	
	function ParserLexer() {}
	
	function parseError($str, $hash = "") {
		throw new Exception($str);
	}
	
	function setInput($input) {
		$this->_input = $input;
		$this->_more = $this->_less = $this->done = false;
		$this->yylineno = $this->yyleng = 0;
		$this->yytext = $this->matched = $this->match = '';
		$this->conditionStack = array('INITIAL');
		$this->yylloc = (object)array(
			"first_line"=> 1,
			"first_column"=> 0,
			"last_line"=> 1,
			"last_column"=> 0
		);
		return $this;
	}
	
	function input() {
		$ch = $this->_input[0];
		$this->yytext += $ch;
		$this->yyleng++;
		$this->match += $ch;
		$this->matched += $ch;
		$lines = preg_match("\n", $ch);
		if (count($lines) > 0) $this->yylineno++;
		array_slice($this->_input, 1);
		return $ch;
	}
	
	function unput($ch) {
		$this->_input = $ch + $this->_input;
		return $this;
	}
	
	function more() {
		$this->_more = true;
		return $this;
	}
	
	function pastInput() {
		$past = substr($this->matched, 0, count($this->matched) - count($this->match));
		return (strlen($past) > 20 ? '...' : '') . preg_replace("/\n/", "", substr($past, -20));
	}
	
	function upcomingInput() {
		$next = $this->match;
		if (strlen($next) < 20) {
			$next .= substr($this->_input, 0, 20 - strlen($next));
		}
		return preg_replace("/\n/", "", substr($next, 0, 20) . (strlen($next) > 20 ? '...' : ''));
	}
	
	function showPosition() {
		$pre = $this->pastInput();
		$c = implode(array(strlen($pre) + 1), "-");
		return $pre . $this->upcomingInput() . "\n" . $c . "^";
	}
	
	function next() {
		if ($this->done == true) {
			return $this->EOF;
		}
		
		if ($this->_input == false) $this->_input = "";
		if (empty($this->_input)) $this->done = true;

		if ($this->_more == false) {
			$this->yytext = '';
			$this->match = '';
		}
		
		$rules = $this->_currentRules();
		for ($i = 0; $i < count($rules); $i++) {
			preg_match($this->rules[$rules[$i]], $this->_input, $match);
			if ( isset($match) && isset($match[0]) ) {
				preg_match_all("/\n/", $match[0], $lines, PREG_PATTERN_ORDER);
				if (count($lines) > 1) $this->yylineno += count($lines);
				$this->yylloc = (object)array(
					"first_line"=> $this->yylloc->last_line,
					"last_line"=> $this->yylineno + 1,
					"first_column"=> $this->yylloc->last_column,
					"last_column"=> $lines ? count($lines[count($lines) - 1]) - 1 : $this->yylloc->last_column + count($match[0])
				);
				$this->yytext .= $match[0];
				$this->match .= $match[0];
				$this->matches = $match[0];
				$this->yyleng = strlen($this->yytext);
				$this->_more = false;
				$this->_input = substr($this->_input, strlen($match[0]), strlen($this->_input));
				$this->matched .= $match[0];
				$token = $this->performAction($this->yy, $this, $rules[$i],$this->conditionStack[count($this->conditionStack) - 1]);
				
				if (empty($token) == false) {
					return $token;
				} else {
					return;
				}
			}
		}
		
		if (empty($this->_input)) {
			return $this->EOF;
		} else {
			$this->parseError('Lexical error on line ' . ($this->yylineno + 1) . '. Unrecognized text.\n' . $this->showPosition(), array(
				"text"=> "",
				"token"=> null,
				"line"=> $this->yylineno
			));
		}
	}
	
	function lex() {
		$r = $this->next();
		if (empty($r) == false) {
			return $r;
		} else if ($this->done != true) {
			return $this->lex();
		}
	}
	
	function begin($condition) {
		array_push($this->conditionStack, $condition);
	}
	
	function popState() {
		return array_pop($this->conditionStack);
	}
	
	function _currentRules() {
		return $this->conditions[
			$this->conditionStack[
				count($this->conditionStack) - 1
			]
		]['rules'];
	}
	
	function performAction(&$yy, $yy_, $avoiding_name_collisions, $YY_START = null) {
		$YYSTATE = $YY_START;
		


switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 25;
break;
case 2:return 25;
break;
case 3:return 23;
break;
case 4:return 20;
break;
case 5:return 22;
break;
case 6:return 26;
break;
case 7:return 18;
break;
case 8:/* skip whitespace */
break;
case 9:return ' ';
break;
case 10:return '.';
break;
case 11:return 21;
break;
case 12:return 28;
break;
case 13:return 29;
break;
case 14:return 12;
break;
case 15:return 13;
break;
case 16:return 11;
break;
case 17:return 10;
break;
case 18:return 14;
break;
case 19:return 15;
break;
case 20:return 16;
break;
case 21:return 8;
break;
case 22:return 7;
break;
case 23:return 9;
break;
case 24:return 'PI';
break;
case 25:return 19;
break;
case 26:return '"';
break;
case 27:return "'";
break;
case 28:return "!";
break;
case 29:return 6;
break;
case 30:return 17;
break;
case 31:return 5;
break;
}

	}

	var $rules = array("/^\\s+/","/^\"(\\\\[\"]|[^\"])*\"/","/^'(\\\\[']|[^'])*'/","/^SHEET[0-9]+/","/^\\$[A-Za-z]+\\$[0-9]+/","/^[A-Za-z]+[0-9]+/","/^[A-Za-z]+/","/^[0-9]+(\\.[0-9]+)?/","/^\\$/","/^ /","/^\\./","/^:/","/^;/","/^,/","/^\\*/","/^\\//","/^-/","/^\\+/","/^\\^/","/^\\(/","/^\\)/","/^>/","/^</","/^NOT\\b/","/^PI\\b/","/^E\\b/","/^\"/","/^'/","/^!/","/^=/","/^%/","/^$/");
	
	var $conditions = array("INITIAL"=>array("rules"=>array(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31),"inclusive"=>true));
}
