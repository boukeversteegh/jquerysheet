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
	calc: function(spreadsheets, options) { //spreadsheets are array, [spreadsheet][cell], like o['TABLE1']['A1];
		//var parser = this.parser();
		//The following is grabbed from parser.js
		for (var i = 0; i < spreadsheets.length; i++) {
			for (var j = 0; j < spreadsheets[i].length; j++) {
				for (var k = 0; k < spreadsheets[i][j].length; k++) {
					var cell = spreadsheets[i][j][k];
					
					cell.valueOld = cell.value;
					var oO = '';
					if (cell.formula) {
						try {
							cell.value = parser.parse(cell.formula, options);
						} catch(e) {
							cell.value = '<pre>' + e + '</pre>'; //error
						}
					}
				
					if (cell.valueOld != cell.value) {
						cell.td.html(cell.value);
					}
				}
			}
		}
	},
	parseLocation: function(locStr) { // With input of "A1", "B4", "F20", will return [0,0], [3,1], [19,5].
		for (var firstNum = 0; firstNum < locStr.length; firstNum++) {
			if (locStr.charCodeAt(firstNum) <= 57) {// 57 == '9'
				break;
			}
		}
		return {row: parseInt(locStr.substring(firstNum)) - 1, col: this.columnLabelIndex(locStr.substring(0, firstNum)) - 1};
	},
	columnLabelIndex: function(str) {
		// Converts A to 1, B to 2, Z to 26, AA to 27.
		var num = 0;
		for (var i = 0; i < str.length; i++) {
			var digit = str.toUpperCase().charCodeAt(i) - 65 + 1;	   // 65 == 'A'.
			num = (num * 26) + digit;
		}
		return num;
	},
	columnLabelString: function(index) {
		// The index is 1 based.  Convert 1 to A, 2 to B, 25 to Y, 26 to Z, 27 to AA, 28 to AB.
		// TODO: Got a bug when index > 676.  675==YZ.  676==YZ.  677== AAA, which skips ZA series.
		//	   In the spirit of billg, who needs more than 676 columns anyways?
		var b = (index - 1).toString(26).toUpperCase();   // Radix is 26.
		var c = [];
		for (var i = 0; i < b.length; i++) {
			var x = b.charCodeAt(i);
			if (i <= 0 && b.length > 1) {				   // Leftmost digit is special, where 1 is A.
				x = x - 1;
			}
			if (x <= 57) {								  // x <= '9'.
				c.push(String.fromCharCode(x - 48 + 65)); // x - '0' + 'A'.
			} else {
				c.push(String.fromCharCode(x + 10));
			}
		}
		return c.join("");
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
	}
};

jQuery.sheet.fn = {//fn = standard functions used in cells
	HTML: function(v) {
		return jQuery(v);
	},
	IMG: function(v) {
		return jQuery('<img />')
			.attr('src', v);
	},
	AVERAGE:	function(values) { 
		var arr =arrHelpers.foldPrepare(values, arguments);
		return this.SUM(arr) / this.COUNT(arr); 
	},
	AVG: 		function(values) { 
		return this.AVERAGE(values);
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
		return this.FIXED(v, (decimals ? decimals : 0), false);
	},
	RAND: 		function() { return Math.random(); },
	RND: 		function() { return Math.random(); },
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
	IF:			function(expression, resultTrue, resultFalse){
		return (expression ? resultTrue : resultFalse);
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
	HYPERLINK: function(o) {
		var link = o[0];
		var name = o[1];
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
		
		var r = this.FIXED(v, decimals, false);
		
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
	SELECTINPUT:	function(v, noBlank) {
		if (s.editable) {
			v = arrHelpers.foldPrepare(v, arguments, true);
			return jS.controlFactory.input.select(v, noBlank);
		} else {
			return jS.controlFactory.input.getValue(v);
		}
	},
	RADIOINPUT: function(v) {
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
	ISCHECKED:		function(v) {
		var val = jS.controlFactory.input.getValue(v);
		var length = jQuery(v).find('input[value="' + val + '"]').length;
		if (length) {
			return 'TRUE';
		} else {
			return 'FALSE';
		}
	},
	BARCHART:	function(values, legend, title) {
		return jQuery.sheet.instance[0].controlFactory.chart({
			type: 'bar',
			data: values,
			legend: legend,
			title: title
		});
	},
	HBARCHART:	function(values, legend, title) {
		return jS.controlFactory.chart({
			type: 'hbar',
			data: values,
			legend: legend,
			title: title
		});
	},
	LINECHART:	function(valuesX, valuesY, legendX, legendY, title) {
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
	PIECHART:	function(values, legend, title) {
		return jS.controlFactory.chart({
			type: 'pie',
			data: values,
			legend: legend,
			title: title
		});
	},
	DOTCHART:	function(valuesX, valuesY, values,legendX, legendY, title) {
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
