<?php
include_once "handler.php";


function calculations_engine_sum($array)
{
	return array_sum($array);
}

$ce = new calculations_engine(array(array(array("=SUM(B1 + 100)",2),array(2,"=A1"))));
$ce->calc(0);
print_r($ce->toArray());
