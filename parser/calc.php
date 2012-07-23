<?php

ini_set('error_reporting', E_ALL);
ini_set('display_errors', 1);

include_once 'parser.php';
include_once 'handler.php';
include_once 'formulas.php';

$spreadsheets = json_decode($_REQUEST['s']);

$formulas = new formulas();

$handler = ParserHandler::init($spreadsheets, $formulas);
$handler->calc(0);

echo json_encode($handler->toArray());