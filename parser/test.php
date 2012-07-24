<?php

include_once 'parser.php';
include_once 'handler.php';
include_once 'formulas.php';


$spreadsheets = array(//Spreadsheets
	array(//Sheet
		array("=AVG(B1 * 100 / 100)",2),	//Row
		array("=(2^8 * A1) / B1 * B2","=A1"),	//Row
		array("=B3","This is B3"),		//Row
		array("=INPUT('tax')", "=OUTPUT('taxes', INPUT('tax'))"),
		array("=A1", "=A2", "=A3"),
		array("=AVG(1,2,3,4,5,6,7)", "")
	),
	array(
		array("=SHEET1!A1")
	)
);

$formulas = new formulas();

$handler = ParserHandler::init($spreadsheets, $formulas);

$handler->calc();

print_r(json_encode($spreadsheets) . "\n");
print_r(json_encode($handler->toArray()) . "\n");

print_r($spreadsheets[0]);
print_r($handler->toArray());
print_r($formulas->outputs);