<?php

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);

include_once 'parser.php';
include_once 'handler.php';

global $calculations_engine_inputs, $calculations_engine_outputs;
$calculations_engine_inputs = $_REQUEST;
$calculations_engine_outputs = array();

function calculations_engine_sum($cell, $array)
{
	return array_sum($array);
}

function calculations_engine_divide($cell, $array)
{
	return array_sum($array);
}

function calculations_engine_average($cell, $array)
{
	$total = 0;
	$count = count($array);
	foreach ($array as $value) {
		$total = $total + $value;
	}
	$average = ($total / $count);
	return $average;
}

function calculations_engine_avg($cell, $array)
{
	return calculations_engine_average($cell, $array);
}

function calculations_engine_count($cell, $array)
{
	$count = 0;
	
	foreach ($array as $value) {
		if ($value != null) $count++;
	}
	
	return $count;
}

function calculations_engine_counta($cell, $array)
{
	$count = 0;
	
	foreach ($array as $value) {
		if (!empty($value)) $count++;
	}
	
	return $count;
}

function calculations_engine_max($cell, $array)
{
	return max($array);
}

function calculations_engine_min($cell, $array)
{
	return min($array);
}

function calculations_engine_mean($cell, $array)
{
	sort($array);
	$count = count($array); //total numbers in array
	$middleval = floor(($count-1)/2); // find the middle value, or the lowest middle value
	if($count % 2) { // odd number, middle is the median
		$median = $array[$middleval];
	} else { // even number, calculate avg of 2 medians
		$low = $array[$middleval];
		$high = $array[$middleval+1];
		$median = (($low+$high)/2);
	}
	return $median;
}

function calculations_engine_abs($cell, $array)
{
	return abs($array);
}

function calculations_engine_ceiling($cell, $array)
{
	return ceil($array);
}

function calculations_engine_floor($cell, $array)
{
	return floor($array);
}

function calculations_engine_int($cell, $array)
{
	return floor($array);
}

function calculations_engine_round($cell, $array)
{
	return round($array);
}

function calculations_engine_rand($cell, $array)
{
	return rand();
}

function calculations_engine_rnd($cell, $array)
{
	return calculations_engine_rand();
}

function calculations_engine_true($cell, $array)
{
	return 'TRUE';
}

function calculations_engine_false($cell, $array)
{
	return 'FALSE';
}

function calculations_engine_pi($cell, $array)
{
	return pi();
}

function calculations_engine_power($cell, $array)
{
	return pow($array[0], $array[1]);
}

function calculations_engine_sqrt($cell, $array)
{
	return sqrt($array);
}

function calculations_engine_input($cell, $array)
{
	global $calculations_engine_inputs;
	return (!empty($calculations_engine_inputs[$array[0]]) ? $calculations_engine_inputs[$array[0]] : 0);
}

function calculations_engine_output($cell, $array)
{
	global $calculations_engine_outputs;
	$calculations_engine_outputs[$array[0]] = (!empty($array[1]) ? $array[1] : 0);
	return '';
}

$spreadsheets = array(//Spreadsheets
	array(//Sheet
		array("=AVG(B1 * 100 / 100)",2),	//Row
		array("=(2^8 * A1) / B1 * B2","=A1"),	//Row
		array("=B3","This is B3"),		//Row
		array("=INPUT('tax')", "=OUTPUT('taxes', INPUT('tax'))"),
		array("=A1", "=A2", "=A3"),
		array("=AVG(1,2,3,4,5,6,7)", "")
	)
);

$handler = new ParserHandler($spreadsheets);

$handler->calc(0);

print_r($spreadsheets[0]);
print_r($handler->toArray());
print_r($calculations_engine_outputs);