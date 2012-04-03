<?php
require_once("parser.php");

Class ParserHandler extends Parser
{
	var $callStack = 0;
	var $spreadsheets = array();
	var $calcLast = 0;
	var $sheet = 0;
	var $COLCHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var $parser;
	var $cell;

	function __construct($spreadsheets = array())
	{
		parent::__construct();
		$this->spreadsheets = $spreadsheets;
	}

	function setSheet($sheet)
	{
		$this->sheet = $sheet;
	}

	function updateCellValue($sheet, $row, $col)
	{
		//first detect if the cell exists if not return nothing
		if (!$this->spreadsheets[$sheet]) return 'Error: Sheet not found';
		if (!$this->spreadsheets[$sheet][$row]) return 'Error: Row not found';
		if (!$this->spreadsheets[$sheet][$row][$col]) return 'Error: Column not found';

		$cell = $this->spreadsheets[$sheet][$row][$col];

		if (!empty($cell->state)) throw new Exception("Error: Loop Detected");
		$cell->state = "red";

		if (!isset($cell->calcLast)) $cell->calcLast = 0;

		if ($cell->calcCount < 1 && $cell->calcLast != $this->calcLast) {
			$cell->calcLast = $this->calcLast;
			$cell->calcCount++;
			if (isset($cell->formula)) {
				try {
					if ($cell->formula[0] == '=') {
						$cell->formula = substr($cell->formula, 1);
					}

					if ($this->callStack) { //we prevent parsers from overwriting each other
						if (!$cell->parser) { //cut down on un-needed parser creation
							$cell->parser = (new self());
						}
						$Parser = $cell->parser;
					} else {//use the sheet's parser if there aren't many calls in the callStack
						$Parser = $this;
					}

					$this->callStack++;

					$Parser->cell = array(
						"sheet"=> $sheet,
						"row"=> $row,
						"col"=> $col,
						"cell"=> $cell,
					);

					$cell->value = $Parser->parse($cell->formula);
				} catch(Exception $e) {
					$cell->value = $e->getMessage();
					$this->alertFormulaError($cell->value);
				}

				$this->callStack--;
			}
		}


		$cell->state = null;

		return $cell->value;
	}

	private function alertFormulaError($value)
	{
		print_r($value);
	}

	function cellValue($id) { //Example: A1
		$loc = $this->parseLocation($id);
		return $this->updateCellValue($this->sheet, $loc->row, $loc->col);
	}

	function cellRangeValue($start, $end) {//Example: A1:B1
		$start = $this->parseLocation($start);
		$end = $this->parseLocation($end);

		$result = array();

		for ($i = $start->row; $i <= $end->row; $i++) {
			for ($j = $start->col; $j <= $end->col; $j++) {
				array_push($result, $this->updateCellValue($this->sheet, $i, $j));
			}
		}
		return array($result);
	}

	function fixedCellValue($id) {
		$id = str_replace('$', '', $id);
		//return $this->apply($this->cellValue.apply(this, [id]); TODO?
	}

	function fixedCellRangeValue($start, $end) {
		$start = str_replace('$', '', $start);
		$end = str_replace('$', '', $end);
		//return $this->cellRangeValue.apply(this, [$start, $end]); TODO?
	}

	function remoteCellValue($sheet, $id) {//Example: SHEET1:A1
		$loc = $this->parseLocation($id);
		$sheet = str_replace($sheet, 'SHEET','') - 1;
		return $this->updateCellValue($sheet, $loc->row, $loc->col);
	}

	function remoteCellRangeValue($sheet, $start, $end) {//Example: SHEET1:A1:B2
		$sheet = str_replace($sheet, 'SHEET','') - 1;
		$start = $this->parseLocation($start);
		$end = $this->parseLocation($end);

		$result = array();

		for ($i = $start->row; $i <= $end->row; $i++) {
			for ($j = $start->col; $j <= $end->col; $j++) {
				array_push($result, $this->updateCellValue($sheet, $i, $j));
			}
		}

		return array($result);
	}

	function callFunction($fn, $args) {
		if (!$args) {
			$args = array('');
		} else if (is_array($args)) {
			$args = array_reverse($args);
		} else {
			$args = array($args);
		}

		if (function_exists('calculations_engine_' . $fn)) {
			return call_user_func_array('calculations_engine_' . $fn, array($this->cell, $args));
		} else {
			return "Error: Function Not Found";
		}
	}

	function parseLocation($locStr) { // With input of "A1", "B4", "F20", will return {row: 0,col: 0}, {row: 3,col: 1}, {row: 19,col: 5}.
		return (object)array(
			"row"=> $this->getRowIndex($locStr),
			"col"=> $this->columnLabelIndex($this->getColIndex($locStr))
		);
	}

	function columnLabelIndex($str) {
		// Converts A to 0, B to 1, Z to 25, AA to 26.
		$num = 0;
		for ($i = 0; $i < strlen($str); $i++) {
			$char =  strtoupper($str[$i]);	   // 65 == 'A'.
			$digit = strpos($this->COLCHAR, $char) + 1;
			$num = ($num * 26) + $digit;
		}
		return ($num >= 1 ? $num : 1) - 1;
	}

	function getRowIndex( $id )
	{
		if ( !preg_match( "/^([A-Z]+)([0-9]+)$/", $id, $parts ) )
			return false;

		return $parts[2] - 1;
	}

	function getColIndex( $id )
	{
		if ( !preg_match( "/^([A-Z]+)([0-9]+)$/", $id, $parts ) )
			return false;

		return $parts[1];
	}

	function apply( $fn, $cell, $arguments = array() )
	{
		return call_user_func_array(array($this, $fn), $arguments);
	}

	function call(){
		$arguments  = func_get_args();
		return  call_user_func_array(array_shift($arguments), $arguments);
	}

	function toArray()
	{
		$result = array();
		foreach($this->spreadsheets as $spreadsheet) {
			$toSpreadsheet = array();
			foreach($spreadsheet as $row) {
				$toRow = array();
				foreach($row as $cell) {
					$toRow[] = $cell->value;
				}
				$toSpreadsheet[] = $toRow;
			}
			$result[] = $toSpreadsheet;
		}
		return $toSpreadsheet;
	}

	function calc($tableI) { //spreadsheets are array, [spreadsheet][row][cell], like A1 = o[0][0][0];
		$this->calcLast = time();
		for ($j = 0; $j < count($this->spreadsheets); $j++) {
			for ($k = 0; $k < count($this->spreadsheets[$j]); $k++) {
				for ($l = 0; $l < count($this->spreadsheets[$j][$k]); $l++) {
					$this->spreadsheets[$j][$k][$l] = (object)$this->spreadsheets[$j][$k][$l];
					$this->spreadsheets[$j][$k][$l]->value = $this->spreadsheets[$j][$k][$l]->scalar;
					if ($this->spreadsheets[$j][$k][$l]->value[0] == '=') $this->spreadsheets[$j][$k][$l]->formula = $this->spreadsheets[$j][$k][$l]->value;
					$this->spreadsheets[$j][$k][$l]->calcCount = 0;
				}
			}
		}

		for ($j = 0; $j < count($this->spreadsheets); $j++) {
			for ($k = 0; $k < count($this->spreadsheets[$j]); $k++) {
				for ($l = 0; $l < count($this->spreadsheets[$j][$k]); $l++) {
					$this->updateCellValue($j, $k, $l);
				}
			}
		}
	}
}