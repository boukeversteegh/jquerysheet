/*
jQuery.sheet() The Web Based Spreadsheet - Calculations Engine
$Id$
http://code.google.com/p/jquerysheet/
		
Copyright (C) 2010 Robert Plummer
Dual licensed under the LGPL v2 and GPL v2 licenses.
http://www.gnu.org/licenses/
*/

if (!jQuery.sheet) {
	jQuery.sheet = {};
}

var jSE = jQuery.sheet.engine = { //Calculations Engine
	calc: function(tdop, spreadsheets) {
		var parse = function(o) {
			
		};
	},
	cFN: {//cFN = compiler functions, usually mathmatical
		sum: 	function(x, y) { return x + y; },
		max: 	function(x, y) { return x > y ? x: y; },
		min: 	function(x, y) { return x < y ? x: y; },
		count: 	function(x, y) { return (y != null) ? x + 1: x; },
		divide: function(x, y) { return x / y; },
		clean: function(v) {
			if (typeof(v) == 'string') {
				v = v.replace(jSE.regEx.amp, '&')
						.replace(jSE.regEx.nbsp, ' ')
						.replace(/\n/g,'')
						.replace(/\r/g,'');
			}
			return v;
		}
	},
	regEx: {
		n: 					/[\$,\s]/g,
		cell: 				/\$?([a-zA-Z]+)\$?([0-9]+)/g, //A1
		range: 				/\$?([a-zA-Z]+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+)/g, //A1:B4
		remoteCell:			/\$?(SHEET+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+)/g, //SHEET1:A1
		remoteCellRange: 	/\$?(SHEET+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+)/g, //SHEET1:A1:B4
		sheet: 				/SHEET/,
		cellInsensitive: 				/\$?([a-zA-Z]+)\$?([0-9]+)/gi, //a1
		rangeInsensitive: 				/\$?([a-zA-Z]+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+)/gi, //a1:a4
		remoteCellInsensitive:			/\$?(SHEET+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+)/gi, //sheet1:a1
		remoteCellRangeInsensitive: 	/\$?(SHEET+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+)/gi, //sheet1:a1:b4
		sheetInsensitive:	/SHEET/i,
		amp: 				/&/g,
		gt: 				/</g,
		lt: 				/>/g,
		nbsp: 				/&nbsp;/g
	},
	str: {
		amp: 	'&amp;',
		lt: 	'&lt;',
		gt: 	'&gt;',
		nbsp: 	'&nbps;'
	},
	parseFormula: function(formula, dependencies, thisTableI) { // Parse formula (without "=" prefix) like "123+SUM(A1:A6)/D5" into JavaScript expression string.
		var nrows = null;
		var ncols = null;
		if (jSE.calcState.cellProvider != null) {
			nrows = jSE.calcState.cellProvider.nrows;
			ncols = jSE.calcState.cellProvider.ncols;
		}
		
		//Cell References Range - Other Tables
		formula = formula.replace(jSE.regEx.remoteCellRange, 
			function(ignored, TableStr, tableI, startColStr, startRowStr, endColStr, endRowStr) {
				var res = [];
				var startCol = jSE.columnLabelIndex(startColStr);
				var startRow = parseInt(startRowStr);
				var endCol   = jSE.columnLabelIndex(endColStr);
				var endRow   = parseInt(endRowStr);
				if (ncols != null) {
					endCol = Math.min(endCol, ncols);
				}
				if (nrows != null) {
					endRow = Math.min(endRow, nrows);
				}
				for (var r = startRow; r <= endRow; r++) {
					for (var c = startCol; c <= endCol; c++) {
						res.push("SHEET" + (tableI) + ":" + jSE.columnLabelString(c) + r);
					}
				}
				return "[" + res.join(",") + "]";
			}
		);
		
		//Cell References Fixed - Other Tables
		formula = formula.replace(jSE.regEx.remoteCell, 
			function(ignored, tableStr, tableI, colStr, rowStr) {
				tableI = parseInt(tableI) - 1;
				colStr = colStr.toUpperCase();
				if (dependencies != null) {
					dependencies['SHEET' + (tableI) + ':' + colStr + rowStr] = [parseInt(rowStr), jSE.columnLabelIndex(colStr), tableI];
				}
				return "(jSE.calcState.cellProvider.getCell((" + (tableI) + "),(" + (rowStr) + "),\"" + (colStr) + "\").getValue())";
			}
		);
		
		//Cell References Range
		formula = formula.replace(jSE.regEx.range, 
			function(ignored, startColStr, startRowStr, endColStr, endRowStr) {
				var res = [];
				var startCol = jSE.columnLabelIndex(startColStr);
				var startRow = parseInt(startRowStr);
				var endCol   = jSE.columnLabelIndex(endColStr);
				var endRow   = parseInt(endRowStr);
				if (ncols != null) {
					endCol = Math.min(endCol, ncols);
				}
				if (nrows != null) {
					endRow = Math.min(endRow, nrows);
				}
				for (var r = startRow; r <= endRow; r++) {
					for (var c = startCol; c <= endCol; c++) {
						res.push(jSE.columnLabelString(c) + r);
					}
				}
				return "[" + res.join(",") + "]";
			}
		);
		
		//Cell References Fixed
		formula = formula.replace(jSE.regEx.cell, 
			function(ignored, colStr, rowStr) {
				colStr = colStr.toUpperCase();
				if (dependencies != null) {
					dependencies['SHEET' + thisTableI + ':' + colStr + rowStr] = [parseInt(rowStr), jSE.columnLabelIndex(colStr), thisTableI];
				}
				return "(jSE.calcState.cellProvider.getCell((" + thisTableI + "),(" + (rowStr) + "),\"" + (colStr) + "\").getValue())";
			}
		);
		return formula;
	},	
	parseFormulaStatic: function(formula) { // Parse static formula value like "123.0" or "hello" or "'hello world" into JavaScript value.
		if (formula == null) {
			return null;
		} else {
			var formulaNum = formula.replace(jSE.regEx.n, '');
			var value = parseFloat(formulaNum);
			if (isNaN(value)) {
				value = parseInt(formulaNum);
			}
			if (isNaN(value)) {
				value = (formula.charAt(0) == "\'" ? formula.substring(1): formula);
			}
			return value;
		}
	}
};

jQuery.sheet.fn = {//fn = standard functions used in cells
	HTML: function(v) {
		return jQuery(v);
	},
	IMG: function(v) {
		return jS.controlFactory.safeImg(v, jSE.calcState.row, jSE.calcState.col);
	},
	AVERAGE:	function(values) { 
		var arr =arrHelpers.foldPrepare(values, arguments);
		return jSE.fn.SUM(arr) / jSE.fn.COUNT(arr); 
	},
	AVG: 		function(values) { 
		return jSE.fn.AVERAGE(values);
	},
	COUNT: 		function(values) { return arrHelpers.fold(arrHelpers.foldPrepare(values, arguments), jSE.cFN.count, 0); },
	COUNTA:		function(v) {
		var values =arrHelpers.foldPrepare(v, arguments);
		var count = 0;
		for (var i = 0; i < values.length; i++) {
			if (values[i]) {
				count++;
			}
		}
		return count;
	},
	SUM: 		function(values) { return arrHelpers.fold(arrHelpers.foldPrepare(values, arguments), jSE.cFN.sum, 0, true, this.N); },
	MAX: 		function(values) { return arrHelpers.fold(arrHelpers.foldPrepare(values, arguments), jSE.cFN.max, Number.MIN_VALUE, true, this.N); },
	MIN: 		function(values) { return arrHelpers.fold(arrHelpers.foldPrepare(values, arguments), jSE.cFN.min, Number.MAX_VALUE, true, this.N); },
	MEAN:		function(values) { return this.SUM(values) / values.length; },
	ABS	: 		function(v) { return Math.abs(this.N(v)); },
	CEILING: 	function(v) { return Math.ceil(this.N(v)); },
	FLOOR: 		function(v) { return Math.floor(this.N(v)); },
	INT: 		function(v) { return Math.floor(this.N(v)); },
	ROUND: 		function(v, decimals) {
		return jSE.fn.FIXED(v, (decimals ? decimals : 0), false);
	},
	RAND: 		function(v) { return Math.random(); },
	RND: 		function(v) { return Math.random(); },
	TRUE: 		function() { return 'TRUE'; },
	FALSE: 		function() { return 'FALSE'; },
	NOW: 		function() { return new Date ( ); },
	TODAY: 		function() { return Date( Math.floor( new Date ( ) ) ); },
	DAYSFROM: 	function(year, month, day) { 
		return Math.floor( (new Date() - new Date (year, (month - 1), day)) / 86400000);
	},
	DAYS: function(v1, v2) {
		var date1 = new Date(v1);
		var date2 = new Date(v2);
		var ONE_DAY = 1000 * 60 * 60 * 24;
		return Math.round(Math.abs(date1.getTime() - date2.getTime()) / ONE_DAY);
	},
	DATEVALUE: function(v) {
		var d = new Date(v);
		return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
	},
	IF:			function(v, t, f){
		t = jSE.cFN.clean(t);
		f = jSE.cFN.clean(f);
		
		try { v = eval(v); } catch(e) {};
		try { t = eval(t); } catch(e) {};
		try { t = eval(t); } catch(e) {};

		if (v == 'true' || v == true || v > 0 || v == 'TRUE') {
			return t;
		} else {
			return f;
		}
	},
	FIXED: 		function(v, decimals, noCommas) { 
		if (decimals == null) {
			decimals = 2;
		}
		var x = Math.pow(10, decimals);
		var n = String(Math.round(this.N(v) * x) / x); 
		var p = n.indexOf('.');
		if (p < 0) {
			p = n.length;
			n += '.';
		}
		for (var i = n.length - p - 1; i < decimals; i++) {
			n += '0';
		}
		if (noCommas == true) {// Treats null as false.
			return n;
		}
		var arr	= n.replace('-', '').split('.');
		var result = [];
		var first  = true;
		while (arr[0].length > 0) { // LHS of decimal point.
			if (!first) {
				result.unshift(',');
			}
			result.unshift(arr[0].slice(-3));
			arr[0] = arr[0].slice(0, -3);
			first = false;
		}
		if (decimals > 0) {
			result.push('.');
			var first = true;
			while (arr[1].length > 0) { // RHS of decimal point.
				if (!first) {
					result.push(',');
				}
				result.push(arr[1].slice(0, 3));
				arr[1] = arr[1].slice(3);
				first = false;
			}
		}
		if (v < 0) {
			return '-' + result.join('');
		}
		return result.join('');
	},
	TRIM:		function(v) { 
		if (typeof(v) == 'string') {
			v = jQuery.trim(v);
		}
		return v;
	},
	HYPERLINK: function(link, name) {
		name = (name ? name : 'LINK');
		return jQuery('<a href="' + link + '" target="_new" class="clickable">' + name + '</a>');
	},
	DOLLAR: 	function(v, decimals, symbol) { 
		if (decimals == null) {
			decimals = 2;
		}
		
		if (symbol == null) {
			symbol = '$';
		}
		
		var r = jSE.fn.FIXED(v, decimals, false);
		
		if (v >= 0) {
			return symbol + r; 
		} else {
			return '-' + symbol + r.slice(1);
		}
	},
	VALUE: 		function(v) { return parseFloat(v); },
	N: 			function(v) { if (v == null) {return 0;}
					  if (v instanceof Date) {return v.getTime();}
					  if (typeof(v) == 'object') {v = v.toString();}
					  if (typeof(v) == 'string') {v = parseFloat(v.replace(jSE.regEx.n, ''));}
					  if (isNaN(v))		   {return 0;}
					  if (typeof(v) == 'number') {return v;}
					  if (v == true)			 {return 1;}
					  return 0; },
	PI: 		function() { return Math.PI; },
	POWER: 		function(x, y) {
		return Math.pow(x, y);
	},
	SQRT: function(v) {
		return Math.sqrt(v);
	},
	//Note, form objects are experimental, they don't work always as expected
	INPUT: {
		SELECT:	function(v, noBlank) {
			if (s.editable) {
				v = arrHelpers.foldPrepare(v, arguments, true);
				return jS.controlFactory.input.select(v, noBlank);
			} else {
				return jS.controlFactory.input.getValue(v);
			}
		},
		RADIO: function(v) {
			if (s.editable) {
				v = arrHelpers.foldPrepare(v, arguments, true);
				return jS.controlFactory.input.radio(v);
			} else {
				return jS.controlFactory.input.getValue(v);
			}
		},
		CHECKBOX: function(v) {
			if (s.editable) {
				v = arrHelpers.foldPrepare(v, arguments)[0];
				return jS.controlFactory.input.checkbox(v);
			} else {
				return jS.controlFactory.input.getValue(v);
			}
		},
		VAL: function(v) {
			return jS.controlFactory.input.getValue(v);
		},
		SELECTVAL:	function(v) {
			return jS.controlFactory.input.getValue(v);
		},
		RADIOVAL: function(v) {
			return jS.controlFactory.input.getValue(v);
		},
		CHECKBOXVAL: function(v) {
			return jS.controlFactory.input.getValue(v);
		},
		ISCHECKED:		function(v) {
			var val = jS.controlFactory.input.getValue(v);
			var length = jQuery(v).find('input[value="' + val + '"]').length;
			if (length) {
				return 'TRUE';
			} else {
				return 'FALSE';
			}
		}
	},
	CHART: {
		BAR:	function(values, legend, title) {
			return jS.controlFactory.chart({
				type: 'bar',
				data: values,
				legend: legend,
				title: title
			});
		},
		HBAR:	function(values, legend, title) {
			return jS.controlFactory.chart({
				type: 'hbar',
				data: values,
				legend: legend,
				title: title
			});
		},
		LINE:	function(valuesX, valuesY, legendX, legendY, title) {
			return jS.controlFactory.chart({
				type: 'line',
				x: {
					data: valuesX,
					legend: legendX
				},
				y: {
					data: valuesY,
					legend: legendY
				},
				title: title
			});
		},
		PIE:	function(values, legend, title) {
			return jS.controlFactory.chart({
				type: 'pie',
				data: values,
				legend: legend,
				title: title
			});
		},
		DOT:	function(valuesX, valuesY, values,legendX, legendY, title) {
			return jS.controlFactory.chart({
				type: 'dot',
				values: values,
				x: {
					data: valuesX,
					legend: legendX
				},
				y: {
					data: valuesY,
					legend: legendY
				},
				title: title
			});
		}
	},
	CELLREF: function(v, i) {
		var td;
		if (i) {
			td = jS.obj.sheetAll().eq(i).find('td.' + v);
		} else {
			td = jS.obj.sheet().find('td.' + v);
		}
		
		return td.html();
	}
};
