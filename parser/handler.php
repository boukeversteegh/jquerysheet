<?php
Class ParserHandler extends Parser
{
	var $spreadsheets = array();
	var $formulas;
	var $calcLast = 0;
	var $calcTime = 0;
	var $sheet = 0;
	var $COLCHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var $parser;
	var $cell;
	static $spareParsers = array();
	var $parsing = false;

	function parse($input)
	{
		if (empty($input)) return $input;

		if ($this->parsing == true) {
			$parser = end(self::$spareParsers);
			if (!empty($parser) && $parser->parsing == false) {
				$result = $parser->parse($input);
			} else {
				self::$spareParsers[] = $parser = self::init($this->spreadsheets, $this->formulas);
				$result = $parser->parse($input);
			}
		} else {
			$this->parsing = true;
			$result = parent::parse($input);
			$this->parsing = false;

		}

		return $result;
	}

	static function init($spreadsheets, $formulas)
	{
		$me = new self();
		$me->spreadsheets = $spreadsheets;
		$me->formulas = $formulas;
		return $me;
	}

	function setSpreadsheets($spreadsheets)
	{
		$this->spreadsheets = $spreadsheets;
		return $this;
	}

	function setSheet($sheet)
	{
		$this->sheet = (int)$sheet;
		return $this;
	}

	function setFormulas($formulas)
	{
		$this->formulas = $formulas;
		return $this;
	}

	function updateCellValue($sheet, $row, $col)
	{
		//first detect if the cell exists if not return nothing
		if (empty($this->spreadsheets[$sheet]) == true) 		        return 'Error: Sheet not found';
		if (empty($this->spreadsheets[$sheet][$row]) == true) 		    return 'Error: Row not found';
		if (empty($this->spreadsheets[$sheet][$row][$col]) == true) 	return 'Error: Column not found';

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

					$this->cell = array(
						"sheet"=> $sheet,
						"row"=> $row,
						"col"=> $col,
						"cell"=> $cell,
					);

					$cell->value = $this->parse($cell->formula);
				} catch(Exception $e) {
					$cell->value = $e->getMessage();
					$this->alertFormulaError($cell->value);
				}
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
			$row = array();
			for ($j = $start->col; $j <= $end->col; $j++) {
				$row[] = $this->updateCellValue($this->sheet, $i, $j);
			}
			$result[] = $row;
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
		$sheet = $this->parseSheet($sheet);
		return $this->updateCellValue($sheet, $loc->row, $loc->col);
	}

	function remoteCellRangeValue($sheet, $start, $end) {//Example: SHEET1:A1:B2
		$sheet = $this->parseSheet($sheet);
		$start = $this->parseLocation($start);
		$end = $this->parseLocation($end);

		$result = array();

		for ($i = $start->row; $i <= $end->row; $i++) {
			for ($j = $start->col; $j <= $end->col; $j++) {
				$result[] = $this->updateCellValue($sheet, $i, $j);
			}
		}

		return array($result);
	}

	function callFunction($fn, $args = array()) {
		if (is_array($args)) {
			$args = array_reverse($args);
		} else {
			$args = array($args);
		}

		if (method_exists($this->formulas, $fn)) {
			return $this->formulas->$fn($this->cell, $args);
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

	function parseSheet($sheet)
	{
		return (int)(str_replace('SHEET','', $sheet) - 1);
	}

	function columnLabelIndex($str) {
		// Converts A to 0, B to 1, Z to 25, AA to 26.
		$num = 0;
		for ($i = 0; $i < strlen($str); $i++) {
			$char =  strtoupper($str[$i]);
			$digit = strpos($this->COLCHAR, $char) + 1;
			$num = ($num * 26) + $digit;
		}
		return ($num >= 0 ? $num : 1) - 1;
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

	function toArray($sheet = null)
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

		if (isset($sheet)) {
			return $result[$sheet];
		}

		return $result;
	}

	function calc() { //spreadsheets are array, [spreadsheet][row][cell], like A1 = o[0][0][0];
		$this->calcLast = time();

		$this->preCalc();

		for ($j = 0, $spreadsheetCount = count($this->spreadsheets);            $j < $spreadsheetCount; $j++) {
			for ($k = 0, $rowCount = count($this->spreadsheets[$j]);            $k < $rowCount; $k++) {
				for ($l = 0, $colCount = count($this->spreadsheets[$j][$k]);    $l < $colCount; $l++) {
					$this->updateCellValue($j, $k, $l);
				}
			}
		}

		$calcEnded = time();
		$this->calcTime = $calcEnded - $this->calcLast;
	}

	private function preCalc()
	{
		for($j = 0, $spreadsheetCount = count($this->spreadsheets);            $j < $spreadsheetCount; $j++) {
			for ($k = 0, $rowCount = count($this->spreadsheets[$j]);            $k < $rowCount; $k++) {
				for ($l = 0, $cellCount = count($this->spreadsheets[$j][$k]);   $l < $cellCount; $l++) {
					$this->spreadsheets[$j][$k][$l] = (object)$this->spreadsheets[$j][$k][$l];
					$this->spreadsheets[$j][$k][$l]->value = $this->spreadsheets[$j][$k][$l]->scalar;
					if (!empty($this->spreadsheets[$j][$k][$l]->value[0]) && $this->spreadsheets[$j][$k][$l]->value[0] == '=') $this->spreadsheets[$j][$k][$l]->formula = $this->spreadsheets[$j][$k][$l]->value;
					$this->spreadsheets[$j][$k][$l]->calcCount = 0;
				}
			}
		}
	}
}


