<?php

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);

include_once "handler.php";


function calculations_engine_sum($cell, $array)
{
	print_r($array);
	return array_sum($array);
}

$handler = new ParserHandler(
	array(
		array(
			array("=SUM(B1 + 100)",2),
			array(2,"=A1")
		)
	)
);

//print_r($handler);
$handler->calc(0);
print_r($handler->toArray());
