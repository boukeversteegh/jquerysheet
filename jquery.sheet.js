/*
jQuery.sheet() The Web Based Spreadsheet
$Id$
http://code.google.com/p/jquerysheet/

Copyright (c) 2012 Robert Plummer, RobertLeePlummerJr@gmail.com
Licensed under MIT
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
jQuery.fn.extend({
	sheet: function(settings) {
		jQuery(this).each(function() {
			var parent = jQuery(this);
			var set = jQuery.extend({
				urlGet: 			"sheets/enduser.documentation.html", //local url, if you want to get a sheet from a url
				urlSave: 			"save.html", 					//local url, for use only with the default save for sheet
				editable: 			true, 							//bool, Makes the jSheetControls_formula & jSheetControls_fx appear
				editableTabs:		true,							//bool, If sheet is editable, this allows users to change the tabs by second click
				barMenus:			true,							//bool, if sheet is editable, this will show the mini menu in barTop and barLeft for sheet manipulation
				freezableCells:		true,							//bool, if sheet is editable, this will show the barHandles and allow user to drag them to freeze cells, not yet working.
				allowToggleState: 	true,							//allows the function that changes the spreadsheet's state from static to editable and back
				urlMenu: 			"menu.html", 					//local url, for the menu to the left of title
				menu:			'',							//menu AS STRING!, overrides urlMenu
				newColumnWidth: 	120, 							//int, the width of new columns or columns that have no width assigned
				title: 				null, 							//html, general title of the sheet group
				inlineMenu:			null, 							//html, menu for editing sheet
				buildSheet: 		false,							//bool, string, or object
																		//bool true - build sheet inside of parent
																		//bool false - use urlGet from local url
																		//string  - '{number_of_cols}x{number_of_rows} (5x100)
																		//object - table
				calcOff: 			false, 							//bool, turns calculationEngine off (no spreadsheet, just grid)
				log: 				false, 							//bool, turns some debugging logs on (jS.log('msg'))
				lockFormulas: 		false, 							//bool, turns the ability to edit any formula off
				parent: 			parent, 					//object, sheet's parent, DON'T CHANGE
				colMargin: 			18, 							//int, the height and the width of all bar items, and new rows
				fnSave: 			function() { parent.getSheet().saveSheet(); }, //fn, default save function, more of a proof of concept
				fnOpen: 			function() { 					//fn, by default allows you to paste table html into a javascript prompt for you to see what it looks likes if you where to use sheet
										var t = prompt('Paste your table html here');
										if (t) {
											parent.getSheet().openSheet(t);
										}
				},
				fnClose: 			function() {}, 					//fn, default clase function, more of a proof of concept
				
				boxModelCorrection: 2, 								//int, attempts to correct the differences found in heights and widths of different browsers, if you mess with this, get ready for the must upsetting and delacate js ever
				calculations:		{},								//object, used to extend the standard functions that come with sheet
				cellSelectModel: 	'excel',						//string, 'excel' || 'oo' || 'gdocs' Excel sets the first cell onmousedown active, openoffice sets the last, now you can choose how you want it to be ;)
				autoAddCells:		true,							//bool, when user presses enter on the last row/col, this will allow them to add more cells, thus improving performance and optimizing modification speed
				resizable: 			true,							//bool, makes the $(obj).sheet(); object resizeable, also adds a resizable formula textarea at top of sheet
				autoFiller: 		false,							//bool, the little guy that hangs out to the bottom right of a selected cell, users can click and drag the value to other cells
				minSize: 			{rows: 15, cols: 5},			//object - {rows: int, cols: int}, Makes the sheet stay at a certain size when loaded in edit mode, to make modification more productive
				forceColWidthsOnStartup:true,						//bool, makes cell widths load from pre-made colgroup/col objects, use this if you plan on making the col items, makes widths more stable on startup
				alertFormulaErrors:	false,
				error:              function(e) { return e.error; },
				encode:             function(val) {
					switch( typeof val ) {
						case 'object':
						case 'number': return val;
					}
					return val
						.replace(/&/gi, '&amp;')
						.replace(/>/gi, '&gt;')
						.replace(/</gi, '&lt;')
						.replace(/\n/g, '\n<br>');
				},
				allowCellsLineBreaks: true,
				frozenAt: {
					row: 0,
					col: 0
				}
			}, settings);
			
			var jS = parent.getSheet();
			if (jS) {
				parent.html(jS.obj.sheetAll()); //degrade to just sheets in parent
				jS.obj.tabContainer().remove();
				delete jS;
			}
			
			if (jQuery.sheet.instance) {
				parent.sheetInstance = jQuery.sheet.createInstance(jQuery, set, jQuery.sheet.instance.length, parent);
				jQuery.sheet.instance.push(parent.sheetInstance);
			} else {
				parent.sheetInstance = jQuery.sheet.createInstance(jQuery, set, 0, parent);
				jQuery.sheet.instance = [parent.sheetInstance];
			}
			parent.attr('sheetInstance', jQuery.sheet.instance.length - 1);
		});
		return this;
	},
	disableSelectionSpecial : function() { 
			this.each(function() { 
					this.onselectstart = function() { return false; }; 
					this.unselectable = "on"; 
					jQuery(this).css('-moz-user-select', 'none'); 
			});
			return this;
	},
	getSheet: function() {
		var I = parseInt(jQuery(this).attr('sheetInstance'));
		if (!isNaN(I)) {
			return jQuery.sheet.instance[I];
		}
		return false;
	},
	getCellValue: function(row, col, sheet) {
		var jS = $(this).getSheet();
		sheet = (sheet ? sheet : 0);
		try {
			return jS.updateCellValue(sheet, row, col);
		} catch(e) {
			return "";
		}
	},
	setCellValue: function(value, row, col, sheet) {
		var jS = $(this).getSheet();
		sheet = (sheet ? sheet : 0);
		try {
			jS.spreadsheets[sheet][row][col].value = value;
		} catch(e) {}
	},
	setCellFormula: function(formula, row, col, sheet) {
		var jS = $(this).getSheet();
		sheet = (sheet ? sheet : 0);
		try {
			jS.spreadsheets[sheet][row][col].formula = formula;
		} catch(e) {}
	},
	setCellHtml: function(html, row, col, sheet) {
		var jS = $(this).getSheet();
		sheet = (sheet ? sheet : 0);
		try {
			jS.spreadsheets[sheet][row][col].html = html;
		} catch(e) {}
	}
});

jQuery.sheet = {
	createInstance: function($, s, I, origParent) { //s = jQuery.sheet settings, I = jQuery.sheet Instance Integer
		var jS = {
			version: 'trunk',
			i: 0,
			I: I,
			sheetCount: 0,
			spreadsheets: [], //the actual spreadsheets are going to be populated here
			obj: {//obj = object references
				//Please note, class references use the tag name because it's about 4 times faster
				autoFiller:			function() { return $('#' + jS.id.autoFiller + jS.i); },
				barCorner:			function() { return $('#' + jS.id.barCorner + jS.i); },
				barCornerAll:		function() { return s.parent.find('div.' + jS.cl.barCorner); },
				barCornerParent:	function() { return $('#' + jS.id.barCornerParent + jS.i); },
				barCornerParentAll: function() { return s.parent.find('td.' + jS.cl.barCornerParent); },
				barHelper:			function() { return $('div.' + jS.cl.barHelper); },
				barLeft: 			function(i) { return $('#' + jS.id.barLeft + i + '_' + jS.i); },
				barLeftAll:			function() { return s.parent.find('td.' + jS.cl.barLeft + '_' + jS.i); },
				barLeftParent: 		function() { return $('#' + jS.id.barLeftParent + jS.i); },
				barLeftParentAll:	function() { return s.parent.find('div.' + jS.cl.barLeftParent); },
				barHandleLeft:		function() { return $('#' + jS.id.barHandleLeft); },
				barMenuLeft:		function() { return $('#' + jS.id.barMenuLeft); },
				barTop: 			function(i) { return $('#' + jS.id.barTop + i + '_' + jS.i); },
				barTopAll:			function() { return s.parent.find('td.' + jS.cl.barTop + '_' + jS.i); },
				barTopParent: 		function() { return $('#' + jS.id.barTopParent + jS.i); },
				barTopParentAll:	function() { return s.parent.find('div.' + jS.cl.barTopParent); },
				barHandleTop:		function() { return $('#' + jS.id.barHandleTop); },
				barMenuParentTop:	function() { return $('#' + jS.id.barMenuParentTop); },
				barMenuTop:			function() { return $('#' + jS.id.barMenuTop); },
				cellActive:			function() { return $(jS.cellLast.td); },
				cellMenu:			function() { return $('#' + jS.id.cellMenu); },
				cellHighlighted:	function() { return $(jS.highlightedLast.td); },
				chart:				function() { return $('div.' + jS.cl.chart); },
				controls:			function() { return $('#' + jS.id.controls); },
				formula: 			function() { return $('#' + jS.id.formula); },
				fullScreen:			function() { return $('div.' + jS.cl.fullScreen); },
				inlineMenu:			function() { return $('#' + jS.id.inlineMenu); },
				inPlaceEdit:		function() { return $('#' + jS.id.inPlaceEdit); },
				label: 				function() { return $('#' + jS.id.label); },
				menu:				function() { return $('#' + jS.id.menu); },
				pane: 				function() { return $('#' + jS.id.pane + jS.i); },
				paneAll:			function() { return s.parent.find('div.' + jS.cl.pane); },
				parent: 			function() { return s.parent; },
				scrollerMasterLeft: function() { return $('#' + jS.id.scrollerMasterLeft + jS.i); },
				scrollerMasterTop:  function() { return $('#' + jS.id.scrollerMasterTop + jS.i); },
				scrollerMaster:		function() { return $('#' + jS.id.scrollerMaster + jS.i); },
				sheet: 				function() { return $('#' + jS.id.sheet + jS.i); },
				sheetPaneTd:		function() { return $('#' + jS.id.sheetPaneTd + jS.i); },
				sheetAll: 			function() { return s.parent.find('table.' + jS.cl.sheet); },
				tab:				function() { return $('#' + jS.id.tab + jS.i); },
				tabAll:				function() { return this.tabContainer().find('a.' + jS.cl.tab); },
				tabContainer:		function() { return $('#' + jS.id.tabContainer); },
				tableBody: 			function() { return document.getElementById(jS.id.sheet + jS.i); },
				tableControl:		function() { return $('#' + jS.id.tableControl + jS.i); },
				tableControlAll:	function() { return s.parent.find('table.' + jS.cl.tableControl); },
				title:				function() { return $('#' + jS.id.title); },
				ui:					function() { return $('#' + jS.id.ui); },
				uiActive:			function() { return s.parent.find('div.' + jS.cl.uiActive); }
			},
			id: {
				/*
					id = id's references
					Note that these are all dynamically set
				*/
				autoFiller:			'jSheetAutoFiller_' + I + '_',
				barCorner:			'jSheetBarCorner_' + I + '_',
				barCornerParent:	'jSheetBarCornerParent_' + I + '_',
				barLeft: 			'jSheetBarLeft_' + I + '_',
				barHandleLeft:		'jSheetBarHandleLeft_' + I,
				barMenuLeft:		'jSheetBarMenuLeft_' + I,
				barTop: 			'jSheetBarTop_' + I + '_',
				barTopParent: 		'jSheetBarTopParent_' + I + '_',
				barHandle:			'jSheetBarHandleTop',
				barMenuTop:			'jSheetBarMenuTop_' + I,
				barMenuParentTop:	'jSheetBarMenuParentTop_' + I,
				cellMenu:			'jSheetCellMenu_' + I,
				controls:			'jSheetControls_' + I,
				formula: 			'jSheetControls_formula_' + I,
				inlineMenu:			'jSheetInlineMenu_' + I,
				inPlaceEdit:		'jSheetInPlaceEdit_' + I,
				label: 				'jSheetControls_loc_' + I,
				menu:				'jSheetMenu_' + I,
				pane: 				'jSheetEditPane_' + I + '_',
				scrollerMasterLeft: 'jSheetScrollerMasterLeft_' + I + '_',
				scrollerMasterTop:  'jSheetScrollerMasterTop_' + I + '_',
				scrollerMaster:		'jSheetScrollerMaster_' + I + '_',
				sheet: 				'jSheet_' + I + '_',
				sheetPaneTd: 		'jSheetEditSheetPaneTd_' + I + '_',
				tableControl:		'tableControl_' + I + '_',
				tab:				'jSheetTab_' + I + '_',
				tabContainer:		'jSheetTabContainer_' + I,
				title:				'jSheetTitle_' + I,
				ui:					'jSheetUI_' + I
			},
			cl: {
				/*
					cl = class references
				*/
				autoFiller:				'jSheetAutoFiller',
				autoFillerHandle:		'jSheetAutoFillerHandle',
				autoFillerConver:		'jSheetAutoFillerCover',
				barCorner:				'jSheetBarCorner',
				barCornerParent:		'jSheetBarCornerParent',
				barHelper:				'jSheetBarHelper',
				barLeftTd:				'jSheetBarLeftTd',
				barLeft: 				'jSheetBarLeft',
				barHandleLeft:			'jSheetBarHandleLeft',
				barLeftParent: 			'jSheetBarLeftParent',
				barTop: 				'jSheetBarTop',
				barHandleTop:			'jSheetBarHandleTop',
				barTopParent: 			'jSheetBarTopParent',
				barTopTd:				'jSheetBarTopTd',
				cellActive:				'jSheetCellActive',
				cellHighlighted: 		'jSheetCellHighighted',
				chart:					'jSheetChart',
				controls:				'jSheetControls',
				error:					'jSheetError',
				formula: 				'jSheetControls_formula',
				formulaParent:			'jSheetControls_formulaParent',
				inlineMenu:				'jSheetInlineMenu',
				fullScreen:				'jSheetFullScreen',
				inPlaceEdit:			'jSheetInPlaceEdit',
				menu:					'jSheetMenu',
				parent:					'jSheetParent',
				scrollerRight:			'jSheetScrollerRight',
				scrollerBottom:			'jSheetScrollerBottom',
				scrollerMaster:			'jSheetScrollerMaster',
				scrollerParentRight:	'jSheetScrollerParentRight',
				scrollerParentBottom:	'jSheetScrollerParentBottom',
				sheet: 					'jSheet',
				sheetPaneTd:			'sheetPane',
				label: 					'jSheetControls_loc',
				pane: 					'jSheetEditPane',
				tab:					'jSheetTab',
				tabContainer:			'jSheetTabContainer',
				tabContainerFullScreen: 'jSheetFullScreenTabContainer',
				tableControl:			'tableControl',
				title:					'jSheetTitle',
				toggle:					'cellStyleToggle',
				ui:						'jSheetUI',
				uiAutoFiller:			'ui-state-active',
				uiActive:				'ui-state-active',
				uiBar: 					'ui-widget-header',
				uiBarHighlight: 		'ui-state-active',
				uiBarHandleLeft:		'ui-state-default',
				uiBarMenuLeft:			'ui-state-default ui-corner-top',
				uiBarHandleTop:			'ui-state-default',
				uiBarMenuTop:			'ui-state-default',
				uiCellActive:			'ui-state-active',
				uiCellHighlighted: 		'ui-state-highlight',
				uiControl: 				'ui-widget-header ui-corner-top',
				uiControlTextBox:		'ui-widget-content',
				uiError:				'ui-state-error',
				uiFullScreen:			'ui-widget-content ui-corner-all',
				uiInPlaceEdit:			'ui-state-highlight',
				uiMenu:					'ui-widget-header',
				uiMenuUl: 				'ui-widget-header',
				uiMenuLi: 				'ui-widget-header',
				uiMenuHighlighted: 		'ui-state-highlight',
				uiPane: 				'ui-widget-content',
				uiParent: 				'ui-widget-content ui-corner-all',
				uiScroller:				'ui-state-default',
				uiScrollerParent:		'ui-widget-content',
				uiSheet:				'ui-widget-content',
				uiTab:					'ui-widget-header',
				uiTabActive:			'ui-state-highlight'
			},
			msg: { /*msg = messages used throught sheet, for easy access to change them for other languages*/
				addRowMulti: 			"How many rows would you like to add?",
				addColumnMulti: 		"How many columns would you like to add?",
				newSheet: 				"What size would you like to make your spreadsheet? Example: '5x10' creates a sheet that is 5 columns by 10 rows.",
				openSheet: 				"Are you sure you want to open a different sheet?  All unsaved changes will be lost.",
				cellFind: 				"No results found.",
				toggleHideRow:			"No row selected.",
				toggleHideColumn: 		"Now column selected.",
				merge:					"Merging is not allowed on the first row.",
				evalError:				"Error, functions as formulas not supported.",
				menuFreezeColumnToHere: "Toggle freeze columns to here",
				menuFreezeRowToHere:    "Toggle freeze rows to here",
				menuInsertColumnAfter: 	"Insert column after",
				menuInsertColumnBefore: "Insert column before",
				menuAddColumnEnd:		"Add column to end",
				menuDeleteColumn:		"Delete this column",
				menuInsertRowAfter: 	"Insert row after",
				menuInsertRowBefore:	"Insert row before",
				menuAddRowEnd:			"Add row to end",
				menuDeleteRow:			"Delete this row",
				menuAddSheet:			"Add spreadsheet",
				menuDeleteSheet:		"Delete spreadsheet"
			},
			kill: function() { /* For ajax manipulation, kills this instance of sheet entirley */
				jS.obj.tabContainer().remove();
				jS.obj.fullScreen().remove();
				jS.obj.inPlaceEdit().remove();
				origParent
					.removeClass(jS.cl.uiParent)
					.html('')
					.removeAttr('sheetInstance');
				cE = s = $.sheet.instance[I] = jS = null;
				delete cE;
				delete s;
				delete $.sheet.instance[I];
				delete jS;
			},
			masterScrollerStates: [],
			trigger: function(eventType, extraParameters) {
				//wrapper for $ trigger of origParent, in case of further mods in the future
				extraParameters = (extraParameters ? extraParameters : []);
				origParent.trigger(eventType, [jS].concat(extraParameters));
			},
			spreadsheetsToArray: function(forceRebuild) {
				if (forceRebuild || jS.spreadsheets.length == 0) {
					jS.cycleCellsAll(function(sheet, row, col) {
						var td = $(this);
						jS.createCell(sheet, row, col, td.text(), td.attr('formula'));
					});
				}
				return jS.spreadsheets;
			},
			spreadsheetToArray: function(forceRebuild, i) {
				i = (i ? i : jS.i);
				if (forceRebuild || !jS.spreadsheets[i]) {
					jS.cycleCells(function(sheet, row, col) {
						var td = $(this);
						jS.createCell(sheet, row, col, td.text(), td.attr('formula'));
					});
				}
			},
			createCell: function(sheet, row, col, value, formula, calcCount, calcLast) {
				if (!jS.spreadsheets[sheet]) jS.spreadsheets[sheet] = [];
				if (!jS.spreadsheets[sheet][row]) jS.spreadsheets[sheet][row] = [];
				

				jS.spreadsheets[sheet][row][col] = {
					formula: formula,
					value: value,
					calcCount: (calcCount ? calcCount : 0),
					calcLast: (calcLast ? calcLast : -1),
					html: []
				};
				
				return jS.spreadsheets[sheet][row][col];
			},
			nav: false,
			setNav: function(nav) {
				$($.sheet.instance).each(function() {
					this.nav = false;
				});
			
				jS.nav = nav;
			},
			controlFactory: { /* controlFactory creates the different objects requied by sheet */
				addRowMulti: function(qty, isBefore, skipFormulaReparse) { /* creates multi rows
															qty: int, the number of cells you'd like to add, if not specified, a dialog will ask; 
															isBefore: bool, places cells before the selected cell if set to true, otherwise they will go after, or at end
															skipFormulaReparse: bool, re-parses formulas if needed
														*/
					if (!qty) {
						qty = prompt(jS.msg.addRowMulti);
					}
					if (qty) {
						if (!isNaN(qty))
							jS.controlFactory.addCells(null, isBefore, null, parseInt(qty), 'row', skipFormulaReparse);
					}
				},
				addColumnMulti: function(qty, isBefore, skipFormulaReparse) { /* creates multi columns
															qty: int, the number of cells you'd like to add, if not specified, a dialog will ask; 
															isBefore: bool, places cells before the selected cell if set to true, otherwise they will go after, or at end
															skipFormulaReparse: bool, re-parses formulas if needed
														*/
					if (!qty) {
						qty = prompt(jS.msg.addColumnMulti);
					}
					if (qty) {
						if (!isNaN(qty))
							jS.controlFactory.addCells(null, isBefore, null, parseInt(qty), 'col', skipFormulaReparse);
					}
				},
				addCells: function(eq, isBefore, eqO, qty, type, skipFormulaReparse) { /*creates cells for sheet and the bars that go along with them
																		eq: int, position where cells should be added;
																		isBefore: bool, places cells before the selected cell if set to true, otherwise they will go after, or at end;
																		eq0: no longer used, kept for legacy;
																		qty: int, how many rows/columsn to add;
																		type: string - "col" || "row", determans the type of cells to add;
																		skipFormulaReparse: bool, re-parses formulas if needed
																*/
					//hide the autoFiller, it can get confused
					jS.autoFillerHide();
					
					jS.setDirty(true);
					jS.obj.barHelper().remove();
					
					var sheet = jS.obj.sheet(),
						sheetWidth = sheet.width().
							isLast = false;
					
					//jS.evt.cellEditAbandon();
					
					qty = (qty ? qty : 1);
					type = (type ? type : 'col');
					
					//var barLast = (type == 'row' ? jS.rowLast : jS.colLast);
					var cellLastBar = (type == 'row' ? jS.cellLast.row : jS.cellLast.col);
					
					if (!eq) {
						if (cellLastBar != 0) {
							eq = cellLastBar;
							isLast = true;
						}
					}

					var o;
					switch (type) {
						case "row":
							o = {
								cells: function() {
									//table / tbody / tr / td
									var cells = jS.rowCells(sheet, eq);
									return cells[0].parentNode;
								},
								col: function() { return ''; },
								size: function() {
									var cells = o.cells();
									return cells.children.length - 1;
								},
								loc: function() {
									var cells = o.cells();
									return jS.getTdLocation(cells.children[0]);
								},
								newCells: function() {
									var j = o.size();
									var newCells = '';

									for (var i = 0; i <= j; i++) {
										if (i == 0) {
											newCells += '<td class="' + jS.cl.barLeft + '_' + jS.i + '" />';
										} else {
											newCells += '<td />';
										}
									}
									
									return '<tr style="height: ' + s.colMargin + 'px;">' + newCells + '</tr>';
								},
								newCol: '',
								dimensions: function(cell, col) {},
								offset: {row: qty,col: 0}
							};
							break;
						case "col":
							o = {
								cells: function() {
									var cellStart = jS.rowCells(sheet, 0)[eq];
									var lastRow = jS.rowCells(sheet);
									var cellEnd = lastRow[lastRow.length - 1];

									var loc1 = jS.getTdLocation(cellStart);
									var loc2 = jS.getTdLocation(cellEnd);
									
									//we get the first cell then get all the other cells directly... faster ;)
									var cells = jS.obj.barTop(loc1.col);
									for (var i = 1; i <= loc2.row; i++) {
										cells.push(jS.getTd(jS.i, i, loc1.col));
									}
									
									return cells;
								},
								col: function() {
									return jS.col(sheet, eq);
								},
								newCol: '<col />',
								loc: function(cells) {
									cells = (cells ? cells : o.cells());
									return jS.getTdLocation(cells.first());
								},
								newCells: function() {
									return '<td />';
								},
								dimensions: function(cell, col) {								
									var w = s.newColumnWidth;
									col
										.data('width', w)
										.css('width', w + 'px')
										.attr('width', w + 'px')
										.width(w);
									
									sheet.width(sheetWidth + (w * qty));
								},
								offset: {row: 0, col: qty}
							};
							break;
					}
					
					//make undoable
					jS.cellUndoable.add(sheet);
					
					var cells = $(o.cells());
					var loc = o.loc(cells);	
					var col = o.col();
					
					var newCell = o.newCells();
					var newCol = o.newCol;
					
					var newCols = '';
					var newCells = '';
					
					for (var i = 0; i < qty; i++) { //by keeping these variables strings temporarily, we cut down on using system resources
						newCols += newCol;
						newCells += newCell;
					}
					
					newCols = $(newCols);
					newCells = $(newCells);
					
					if (isBefore) {
						cells.before(newCells);
						$(col).before(newCols);
					} else {
						cells.after(newCells);
						$(col).after(newCols);
					}
					
					jS.setTdIds(sheet, jS.i);
					
					o.dimensions(newCells, newCols);
					
					if (!skipFormulaReparse && isLast != true) { //TODO: replace ':last' here
						//offset formulas
						jS.offsetFormulas(loc, o.offset, isBefore);
					}
					
					//Let's make it redoable
					jS.cellUndoable.add(sheet);

					jS.sheetSyncSize();
				},
				addRow: function(atRow, isBefore, atRowQ) {/* creates single row
															qty: int, the number of cells you'd like to add, if not specified, a dialog will ask; 
															isBefore: bool, places cells before the selected cell if set to true, otherwise they will go after, or at end
														*/
					jS.controlFactory.addCells(atRow, isBefore, atRowQ, 1, 'row');
					jS.trigger('addRow', [atRow, isBefore, atRowQ, 1]);
				},
				addColumn: function(atColumn, isBefore, atColumnQ) {/* creates single column
															qty: int, the number of cells you'd like to add, if not specified, a dialog will ask; 
															isBefore: bool, places cells before the selected cell if set to true, otherwise they will go after, or at end
														*/
					jS.controlFactory.addCells(atColumn, isBefore, atColumnQ, 1, 'col');
					jS.trigger('addColumn', [atColumn, isBefore, atColumnQ, 1]);
				},
				barLeft: function(o) { /* creates all the bars to the left of the spreadsheet
															reloadHeights: bool, reloads all the heights of each bar from the cells of the sheet;
															o: object, the table/spreadsheeet object
													*/
					jS.obj.barLeftAll().remove();
					
					o.find('tr').each(function(i) {
						if (i > 0) {//top loads first, then we load barleft, the first cell is corner
							$(this).prepend('<td  />');
						}
					});
				},
				barTop: function(o) { /* creates all the bars to the top of the spreadsheet
															reloadWidths: bool, reloads all the widths of each bar from the cells of the sheet;
															o: object, the table/spreadsheeet object
													*/
					var colgroup = o.find('colgroup');
					var col = $('<col />')
						.attr('width', s.colMargin)
						.css('width', s.colMargin + 'px')
						.prependTo(colgroup);
					
					jS.obj.barTopAll().remove();
					var barTopParent = $('<tr class="' + jS.cl.barTopParent + '" />');
					
					var parent = o.find('tr:first');
					
					//corner
					barTopParent.append('<td />'); 
					
					parent.find('td').each(function(i) {
						var v = jSE.columnLabelString(i);
						
						barTopParent.append('<td />');
					});
					
					barTopParent.insertBefore(parent);
				},
				barHandle: {
					top : function(bar, i) {
						if (jS.busy) return false;
						if (i != 0) return false;
						jS.obj.barHelper().remove();
						
						var target = jS.obj.barTop(i);
						
						var pos = target.position();
	
						var barHandleTop = $('<div id="' + jS.id.barHandleTop + '" class="' + jS.cl.uiBarHandleTop + ' ' + jS.cl.barHelper + ' ' + jS.cl.barHandleTop + '" />')
							.height(s.colMargin - 2)
							.css('left', pos.left + 'px')
							.appendTo(bar);
						
						jS.draggable(barHandleTop, {
							axis: 'x',
							start: function() {
								jS.busy = true;
							},
							stop: function() {
								jS.busy = false;
							}
						});
					},
					left: function(bar, i) {
						if (jS.busy) return false;
						if (i != 0) return false;
						jS.obj.barHelper().remove();
						
						var target = jS.obj.barLeft(i);
						
						var pos = target.position();
	
						var barHandleLeft = $('<div id="' + jS.id.barHandleLeft + '" class="' + jS.cl.uiBarHandleLeft + ' ' + jS.cl.barHelper + ' ' + jS.cl.barHandleLeft + '" />')
							.width(s.colMargin - 6)
							.height(s.colMargin / 3)
							.css('top', pos.top + 'px')
							.appendTo(bar);
						
						jS.draggable(barHandleLeft, {
							axis: 'y',
							start: function() {
								jS.busy = true;
							},
							stop: function() {
								jS.busy = false;
							}
						});
					},
					corner: function() {}
				},
				makeMenu: function(bar, menuItems) {
					var menu;
					function addLink(msg, fn) {
						switch (msg) {
							case "line":
								$('<hr />').appendTo(menu);
								break;
							default:
								$('<div>' + msg + '</div>').click(function() {
									fn();
									return false;
								}).appendTo(menu);
						}
							
					}
					
					switch (bar) {
						case "top":
							menu = $('<div id="' + jS.id.barMenuTop + '" class="' + jS.cl.uiMenu + ' ' + jS.cl.menu + '" />');
							break;
						case "left":
							menu = $('<div id="' + jS.id.barMenuLeft + '" class="' + jS.cl.uiMenu + ' ' + jS.cl.menu + '" />');
							break;
						case "cell":
							menu = $('<div id="' + jS.id.cellMenu + '" class="' + jS.cl.uiMenu + ' ' + jS.cl.menu + '" />');
							break;
					}
					
					menu
						.mouseleave(function() {
							menu.hide();
						})
						.appendTo($body)
						.hide();
					
					$(menuItems).each(function() {
						addLink(this.msg, this.fn);
					});
					
					return menu;
				},
				barMenu: {
					top: function(e, i, target) {
						if (jS.busy) return false;
						var menu = jS.obj.barMenuTop().hide();
						
						if (i) jS.obj.barHandleTop().remove();
						var menu;
						
						if (!menu.length) {
							menu = jS.controlFactory.makeMenu('top', [{
								msg: jS.msg.menuFreezeColumnToHere,
								fn: function() {
									var col = jS.getTdLocation(jS.obj.cellActive()).col;
									jS.s.frozenAt.col = (jS.s.frozenAt.col == col ? 0 : col);
								}
							},{
								msg: jS.msg.menuInsertColumnAfter,
								fn: function(){
									jS.controlFactory.addColumn();
									return false;
								}
							}, {
								msg: jS.msg.menuInsertColumnBefore,
								fn: function(){
									jS.controlFactory.addColumn(null, true);
									return false;
								}
							}, {
								msg: jS.msg.menuAddColumnEnd,
								fn: function(){
									jS.controlFactory.addColumn();
									return false;
								}
							}, {
								msg: jS.msg.menuDeleteColumn,
								fn: function(){
									jS.deleteColumn();
									return false;
								}
							}]);
						}
						
						if (!target) {
							menu
								.css('left', (e.pageX - 5) + 'px')
								.css('top', (e.pageY - 5) + 'px')
								.show();
							return menu;
						}
	
						var barMenuParentTop = jS.obj.barMenuParentTop().hide();
						
						if (!barMenuParentTop.length) {
						
							barMenuParentTop = $('<div id="' + jS.id.barMenuParentTop + '" class="' + jS.cl.uiBarMenuTop + ' ' + jS.cl.barHelper + '">' +
									'<span class="ui-icon ui-icon-triangle-1-s" /></span>' +
								'</div>')
								.click(function(e) {
									barMenuParentTop.parent()
										.mousedown()
										.mouseup();
									
									var offset = barMenuParentTop.offset();
									
									menu
										.css('left', (e.pageX - 5) + 'px')
										.css('top', (e.pageY - 5) + 'px')
										.show();
								})
								.blur(function() {
									if (menu) menu.hide();
								})
								.css('padding-left', target.position().left + target.width() - s.colMargin)
						}
						
						barMenuParentTop
							.prependTo(target)
							.show();
					},
					left: function(e, i) {
						if (jS.busy) return false;
						jS.obj.barMenuLeft().hide();
						
						if (i) jS.obj.barHandleLeft().remove();
						var menu;
						
						menu = jS.obj.barMenuLeft();
						
						if (!menu.length) {
							menu = jS.controlFactory.makeMenu('left', [{
									msg: jS.msg.menuFreezeRowToHere,
									fn: function() {
										var row = jS.getTdLocation(jS.obj.cellActive()).row;
										jS.s.frozenAt.row = (jS.s.frozenAt.row == row ? 0 : row);
									}
								}, {
									msg: jS.msg.menuInsertRowAfter,
									fn: function(){
										jS.controlFactory.addRow();
										return false;
									}
								}, {
									msg: jS.msg.menuInsertRowBefore,
									fn: function(){
										jS.controlFactory.addRow(null, true);
										return false;
									}
								}, {
									msg: jS.msg.menuAddRowEnd,
									fn: function(){
										jS.controlFactory.addRow();
										return false;
									}
								}, {
									msg: jS.msg.menuDeleteRow,
									fn: function(){
										jS.deleteRow();
										return false;
									}
								}]);
						}
						
						menu
							.css('left', (e.pageX - 5) + 'px')
							.css('top', (e.pageY - 5) + 'px')
							.show();
					},
					corner: function() {}
				},
				cellMenu: function(e) {
					if (jS.busy) return false;
					jS.obj.cellMenu().hide();
					
					var menu = jS.obj.cellMenu();
					
					if (!menu.length) {
						menu = jS.controlFactory.makeMenu('cell', [{
								msg: jS.msg.menuInsertColumnAfter,
								fn: function(){
									jS.controlFactory.addColumn();
									return false;
								}
							}, {
								msg: jS.msg.menuInsertColumnBefore,
								fn: function(){
									jS.controlFactory.addColumn(null, true);
									return false;
								}
							}, {
								msg: jS.msg.menuAddColumnEnd,
								fn: function(){
									jS.controlFactory.addColumn();
									return false;
								}
							}, {
								msg: jS.msg.menuDeleteColumn,
								fn: function(){
									jS.deleteColumn();
									return false;
								}
							}, {
								msg: "line"
							},{
								msg: jS.msg.menuInsertRowAfter,
								fn: function(){
									jS.controlFactory.addRow();
									return false;
								}
							}, {
								msg: jS.msg.menuInsertRowBefore,
								fn: function(){
									jS.controlFactory.addRow(null, true);
									return false;
								}
							}, {
								msg: jS.msg.menuAddRowEnd,
								fn: function(){
									jS.controlFactory.addRow();
									return false;
								}
							}, {
								msg: jS.msg.menuDeleteRow,
								fn: function(){
									jS.deleteRow();
									return false;
								}
							}, {
								msg: 'line'
							}, {
								msg: jS.msg.menuAddSheet,
								fn: function() {
									jS.addSheet('5x10');
								}
							}, {
								msg: jS.msg.menuDeleteSheet,
								fn: function() {
									jS.deleteSheet();
								}
							}]);
					}
					
					menu
						.css('left', (e.pageX - 5) + 'px')
						.css('top', (e.pageY - 5) + 'px')
						.show();
				},
				header: function() { /* creates the control/container for everything above the spreadsheet */
					jS.obj.controls().remove();
					jS.obj.tabContainer().remove();
					
					var header = $('<div id="' + jS.id.controls + '" class="' + jS.cl.controls + '"></div>');
					
					var firstRow = $('<table><tr /></table>').prependTo(header);
					var firstRowTr = $('<tr />');
					
					if (s.title) {
						var title;
						if ($.isFunction(s.title)) {
							title = jS.title(jS);
						} else {
							title = s.title;
						}
						firstRowTr.append($('<td id="' + jS.id.title + '" class="' + jS.cl.title + '" />').html(title));
					}
					
					if (s.inlineMenu && jS.isSheetEditable()) {
						var inlineMenu;
						if ($.isFunction(s.inlineMenu)) {
							inlineMenu = s.inlineMenu(jS);
						} else {
							inlineMenu = s.inlineMenu;
						}
						firstRowTr.append($('<td id="' + jS.id.inlineMenu + '" class="' + jS.cl.inlineMenu + '" />').html(inlineMenu));
					}
					
					if (jS.isSheetEditable()) {
						//Sheet Menu Control
						function makeMenu(ulMenu) {
							var menu = $('<td id="' + jS.id.menu + '" class="' + jS.cl.menu + '" />')
								.html(
									ulMenu
										.replace(/sheetInstance/g, "jQuery.sheet.instance[" + I + "]")
										.replace(/menuInstance/g, I));
										
								menu
									.prependTo(firstRowTr)
									.find("ul").hide()
									.addClass(jS.cl.uiMenuUl)
									.first().show();
								
								menu
									.find("li")
										.addClass(jS.cl.uiMenuLi)
										.hover(function(){
											$(this).find('ul:first')
												.hide()
												.show();
										},function(){
											$(this).find('ul:first')
												.hide();
										});
							return menu;
						}
						
						if (s.menu) {
							makeMenu(s.menu);
						} else {
							$('<div />').load(s.urlMenu, function() {
								makeMenu($(this).html());
								jS.sheetSyncSize();
							});
						}
						
						//Edit box menu
						var secondRow = $('<table cellpadding="0" cellspacing="0" border="0">' +
								'<tr>' +
									'<td id="' + jS.id.label + '" class="' + jS.cl.label + '"></td>' +
									'<td class="' + jS.cl.formulaParent + '">' +
										'<textarea id="' + jS.id.formula + '" class="' + jS.cl.formula + '"></textarea>' +
									'</td>' +
								'</tr>' +
							'</table>')
							.appendTo(header)
							.find('textarea')
								.keydown(jS.evt.keyDownHandler.formulaKeydown)
								.keyup(function() {
									jS.obj.inPlaceEdit().val(jS.obj.formula().val());
								})
								.change(function() {
									jS.obj.inPlaceEdit().val(jS.obj.formula().val());
								})
								.bind('paste', jS.evt.pasteOverCells)
								.focus(function() {
									jS.setNav(false);
								})
								.focusout(function() {
									jS.setNav(true);
								})
								.blur(function() {
									jS.setNav(true);
								});
						
						$($.sheet.instance).each(function() {
							this.nav = false;
						});
						
						jS.setNav(true);
						
						$document
							.unbind('keydown')
							.keydown(jS.evt.keyDownHandler.documentKeydown);
					}
					
					firstRowTr.appendTo(firstRow);
					
					var tabParent = $('<div id="' + jS.id.tabContainer + '" class="' + jS.cl.tabContainer + '" />')
						.mousedown(function(e) {
							jS.trigger('switchSpreadsheet', [$(e.target).attr('i') * 1]);
							return false;
						})
						.dblclick(function(e) {
							jS.trigger('renameSpreadsheet', [$(e.target).attr('i') * 1]);
							return 
						});
					
					
					if (jS.isSheetEditable()) {
						var addSheet = $('<span class="' + jS.cl.uiTab + ' ui-corner-bottom" title="Add a spreadsheet" i="-1">+</span>').appendTo(tabParent);
						
						if ($.fn.sortable) {
							var startPosition;
							
							tabParent.sortable({
								placeholder: 'ui-state-highlight',
								axis: 'x',
								forceHelperSize: true,
								forcePlaceholderSize: true,
								opacity: 0.6,
								cancel: 'span[i="-1"]',
								start: function(e, ui) {
									startPosition = ui.item.index();
									jS.trigger('tabSortstart', [e, ui]);
								},
								update: function(e, ui) {
									jS.trigger('tabSortupdate', [e, ui, startPosition]);
								}
							});
						}
					} else {
						$('<span />').appendTo(tabParent);
					}

					s.parent
						.html('')
						.append(header) //add controls header
						.append('<div id="' + jS.id.ui + '" class="' + jS.cl.ui + '">') //add spreadsheet control
						.after(tabParent);
				},
				scrollers: function(table, pane, sheet) { /* makes the bars scroll as the sheet is scrolled
												table: object, the sheet pane's table;
												pane: object, the sheet's pane;
												sheet: object, the current active sheet;
											*/

					var parent = pane.parent(),
						currentScrollTop = 0,
						disable = false,
						target,
						scrollMaster = $('<div id="' + jS.id.scrollerMaster + jS.i + '" class="' + jS.cl.scrollerMaster + '">' +
								'<div></div>' +
							'</div>')
							.scroll(function() {
								jS.evt.scrollHorizontal.scroll({pixel: this.scrollLeft}, 0);
								jS.evt.scrollVertical.scroll({pixel: this.scrollTop}, 0);

								jS.autoFillerGoToTd();
							})
							.appendTo(parent)
							.disableSelectionSpecial();

					pane.append('<style id="' + jS.id.scrollerMasterLeft + jS.i + '"></style>');
					pane.append('<style id="' + jS.id.scrollerMasterTop + jS.i + '"></style>');

					pane.mousewheel(function(e,o) {
						var E = e.originalEvent, e, c;

						var div = function(a, b) {
							return 0 != a % b ? a : a / b;
						};


						if ("mousewheel" == E.type) {
							var scrollNoXY = 1,
							setPixels = div(-E.wheelDelta, scrollNoXY), x,y;

							if (E.wheelDeltaX !== undefined) {
								scrollMaster
									.scrollTop(scrollMaster.scrollTop() + div(-E.wheelDeltaY, scrollNoXY))
									.scrollLeft(scrollMaster.scrollLeft() + div(-E.wheelDeltaX, scrollNoXY))
									.scroll();
							} else {
								scrollMaster
									.scrollTop(scrollMaster.scrollTop() + setPixels)
									.scroll();
							}

						} else {
							e = E.detail, 100 < e ? e = 3 : -100 > e && (e = -3);

							var top = 0, left = 0;
							switch(e) {
								case 1:
								case -1:
									left = e * 100;
									break;
								case 3:
								case -3:
									top = e * 33;
									break;
							}

							scrollMaster
								.scrollTop(scrollMaster.scrollTop() + top)
								.scrollLeft(scrollMaster.scrollLeft() + left)
								.scroll();
						}

						return false;
					});
				},
				sheetUI: function(o, i, fn, reloadBars) { /* creates the spreadsheet user interface
															o: object, table object to be used as a spreadsheet;
															i: int, the new count for spreadsheets in this instance;
															fn: function, called after the spreadsheet is created and tuned for use;
															reloadBars: bool, if set to true reloads id bars on top and left;
														*/
					if (!i) {
						jS.sheetCount = 0;
						jS.i = 0;
					} else {
						jS.sheetCount = parseInt(i);
						jS.i = jS.sheetCount;
						i = jS.i;
					}
					
					o = jS.tuneTableForSheetUse(o);
					
					jS.readOnly[i] = o.hasClass('readonly');

					var table = jS.controlFactory.table().appendTo(jS.obj.ui());
					var pane = jS.obj.pane().html(o);

					jS.controlFactory.scrollers(table, pane, o);

					if (jS.isSheetEditable()) {
						var autoFiller = jS.controlFactory.autoFiller();
						if (autoFiller) {
							pane.append(autoFiller);
						}
					}
								
					jS.sheetDecorate(o);
					
					jS.controlFactory.barTop(o);
					jS.controlFactory.barLeft(o);
				
					jS.sheetTab(true);
					
					if (jS.isSheetEditable()) {
						var formula = jS.obj.formula();

						pane
							.mousedown(function(e, target) {
								if (jS.busy) return false;

								e.target = target || e.target;

								if (jS.isTd(e.target)) {
									jS.evt.cellOnMouseDown(e);
									return false;
								}
								
								if (jS.isBar(e.target)){ //possibly a bar
									jS.evt.barInteraction.select(e.target);
									return false;
								}
							})
							.mouseover(function(e, target) {
								//This manages bar resize, bar menu, and bar selection
								if (jS.busy) return false;

								e.target = target || e.target;

								if (!jS.isBar(e.target)) return;
								var bar = $(e.target);
								var entity = bar.data('entity');
								var i = jS.getBarIndex[entity](e.target);
								if (i == 0) return false;
								
								if (jS.evt.barInteraction.selecting) {
									jS.evt.barInteraction.last = i;
									
									jS.cellSetActiveBar(entity, jS.evt.barInteraction.first, jS.evt.barInteraction.last);
								} else {
									jS.resizeBar[entity](bar, i, o);
									
									if (jS.isSheetEditable()) {
										jS.controlFactory.barHandle[entity](bar, i, o);
										
										if (entity == "top") {
											jS.controlFactory.barMenu[entity](e, i, bar);
										}
									}
								}
							})
							.bind('contextmenu', function(e, target) {
								if (jS.busy) return false;

								e.target = target || e.target;

								if (jS.isBar(e.target)) {
									var o = $(e.target);
									var entity = o.data('entity');
									var i = jS.getBarIndex[entity](e.target);
									if (i == 0) return false;
									
									if (jS.evt.barInteraction.first == jS.evt.barInteraction.last) {
										jS.controlFactory.barMenu[entity](e, i);
									}
								} else {
									jS.controlFactory.cellMenu(e);
								}
								return false;
							})
							.disableSelectionSpecial()
							.dblclick(jS.evt.cellOnDblClick);
					}
					
					jS.themeRoller.start(i);

					jS.setTdIds(o, jS.i);
					
					var size = jS.sheetSize(o);
					
					jS.checkMinSize(o);
					
					jS.addTab();
					
					if (fn) {
						fn(table, pane);
					}
					
					//jS.log('Sheet Initialized');
					
					return table;
				},
				table: function() { /* creates the table control the will contain all the other controls for this instance */
					return $('<table cellpadding="0" cellspacing="0" border="0" id="' + jS.id.tableControl + jS.i + '" class="' + jS.cl.tableControl + '">' +
						'<tbody>' +
							'<tr>' +
								'<td id="' + jS.id.sheetPaneTd + jS.i + '" class="' + jS.cl.sheetPaneTd + '">' + //pane
									'<div id="' + jS.id.pane + jS.i + '" class="' + jS.cl.pane + '"></div>' +
								'</td>' +
							'</tr>' +
						'</tbody>' +
					'</table>');
				},
				chartCache: [],
				safeImg: function(src, row) { /* creates and image and then resizes the cell's row for viewing
												src: string, location of image;
												row: int, the row number where the image is located;
											*/
					return $('<img />')
						.hide()
						.load(function() { //prevent the image from being too big for the row
							$(this).fadeIn(function() {
								$(this).addClass('safeImg');
								jS.attrH.setHeight(parseInt(row), 'cell', false);
							});
						})
						.attr('src', src);
				},
				inPlaceEdit: function(td) { /* creates a teaxtarea for a user to put a value in that floats on top of the current selected cell
												td: object, the cell to be edited
											*/
					if (!td) td = jS.obj.cellActive();
					
					jS.obj.inPlaceEdit().remove();
					var formula = jS.obj.formula();					
					var offset = td.offset();
					var style = td.attr('style');
					var w = td.width();
					var h = td.height();
					var textarea = $('<textarea id="' + jS.id.inPlaceEdit + '" class="' + jS.cl.inPlaceEdit + ' ' + jS.cl.uiInPlaceEdit + '" />')
						.css('left', offset.left)
						.css('top', offset.top)
						.width(w)
						.height(h)
						.keydown(jS.evt.inPlaceEditOnKeyDown)
						.keyup(function() {
							formula.val(textarea.val());
						})
						.change(function() {
							formula.val(textarea.val());
						})
						.focus(function() {
							jS.setNav(false);
						})
						.focusout(function() {
							jS.setNav(true);
						})
						.blur(function() {
							jS.setNav(true);
						})
						.bind('paste', jS.evt.pasteOverCells)
						.appendTo($body)
						.val(formula.val())
						.focus()
						.select();
					
					//Make the textarrea resizable automatically
					if ($.fn.elastic) {
						textarea.elastic();
					}
				},
				autoFiller: function() { /* created the autofiller object */
					if (!s.autoFiller) return;

					return $('<div id="' + (jS.id.autoFiller + jS.i) + '" class="' + jS.cl.autoFiller + ' ' + jS.cl.uiAutoFiller + '">' +
									'<div class="' + jS.cl.autoFillerHandle + '" />' +
									'<div class="' + jS.cl.autoFillerCover + '" />' +
							'</div>')
							.mousedown(function(e) {
								var td = jS.obj.cellActive();
								if (td) {
									var loc = jS.getTdLocation(td);
									jS.cellSetActive(td, loc, true, jS.autoFillerNotGroup, function() {										
										var hlighted = jS.obj.cellHighlighted();
										var hLoc = jS.getTdLocation(hlighted.first());
										jS.fillUpOrDown(hLoc.row < loc.row || hLoc.col < loc.col);
										jS.autoFillerGoToTd(hlighted.last());
										jS.autoFillerNotGroup = false;
									});
								}
							});
				}
			},
			autoFillerNotGroup: true,
			updateCellsAfterPasteToFormula: function(oldVal) { /* oldVal is what formula should be when this is done working with all the values */
				var newValCount = 0;
				var formula = jS.obj.formula();
				
				oldVal = (oldVal ? oldVal : formula.val());
				
				var loc = {row: jS.cellLast.row,col: jS.cellLast.col};								
				var val = formula.val(); //once ctrl+v is hit formula now has the data we need
				var firstValue = val;
		
				if (loc.row == 0 && loc.col == 0) return false; //at this point we need to check if there is even a cell selected, if not, we can't save the information, so clear formula editor
		
				var tdsBefore = $('<div />');
				var tdsAfter = $('<div />');
		
				var row = val.split(/\n/g); //break at rows
		
				for (var i = 0; i < row.length; i++) {
					var col = row[i].split(/\t/g); //break at columns
					for (var j = 0; j < col.length; j++) {
						newValCount++;
						var td = $(jS.getTd(jS.i, i + loc.row, j + loc.col));

						if (td.length) {
							var cell = jS.spreadsheets[jS.i][i + loc.row][j + loc.col];
							tdsBefore.append(td.clone());
				
							if ((col[j] + '').charAt(0) == '=') { //we need to know if it's a formula here
								cell.formula = col[j];
								td.attr('formula', col[j]);
							} else {
								cell.formula = null;
								cell.value = col[j];
					
								td
									.html(col[j])
									.removeAttr('formula');
							}
				
							tdsAfter.append(td.clone());
				
							if (i == 0 && j == 0) { //we have to finish the current edit
								firstValue = col[j];
							}
						}
					}
				}
				
				if (val != firstValue) {
					formula.val(firstValue);
				}
				
				jS.cellUndoable.add(tdsBefore.children());
				jS.fillUpOrDown(false, false, firstValue);
				jS.cellUndoable.add(tdsAfter.children());
		
				jS.setDirty(true);
				jS.evt.cellEditDone(true);
			},
			evt: { /* event handlers for sheet; e = event */
				keyDownHandler: {
					enterOnInPlaceEdit: function(e) {
						if (!e.shiftKey) {
							return jS.evt.cellSetFocusFromKeyCode(e);
						} else {
							return true;
						}
					},
					enter: function(e) {
						if (!jS.cellLast.isEdit && !e.ctrlKey) {
							jS.obj.cellActive().dblclick();
							return false;
						} else {
							return this.enterOnInPlaceEdit(e);
						}
					},
					tab: function(e) {
						return jS.evt.cellSetFocusFromKeyCode(e);
					},
					findCell: function(e) {
						if (e.ctrlKey) { 
							jS.cellFind();
							return false;
						}
						return true;
					},
					redo: function(e) {
						if (e.ctrlKey && !jS.cellLast.isEdit) { 
							jS.cellUndoable.undoOrRedo();
							return false;
						}
						return true;
					},
					undo: function(e) {
						if (e.ctrlKey && !jS.cellLast.isEdit) {
							jS.cellUndoable.undoOrRedo(true);
							return false;
						}
						return true;
					},
					pageUpDown: function(reverse) {
						var size = jS.sheetSize(),
						pane = jS.obj.pane(),
						paneHeight = pane.height(),
						prevRowsHeights = 0,
						thisRowHeight = 0,
						td;
						
						if (reverse) { //go up
							for(var i = jS.cellLast.row; i > 0 && prevRowsHeights < paneHeight; i--) {
								td = $(jS.getTd(jS.i, i, 1));
								if (!td.data('hidden') && td.is(':hidden')) td.show();
								prevRowsHeights += td.parent().height();
							}
						} else { //go down
							for(var i = jS.cellLast.row; i < size.height && prevRowsHeights < paneHeight; i++) {
								td = $(jS.getTd(jS.i, i, 1));
								prevRowsHeights += td.parent().height();
							}
						}
						jS.cellEdit(td);
						
						return false;
					},
					formulaKeydown: function(e) {
						if (jS.readOnly[jS.i]) return false;
						if (jS.cellLast.row < 0 || jS.cellLast.col < 0) return false;
						
						switch (e.keyCode) {
							case key.ESCAPE: 	jS.evt.cellEditAbandon();
								break;
							case key.ENTER:		jS.evt.cellSetFocusFromKeyCode(e); return false;
								break;							
							default: 			jS.cellLast.isEdit = true;
						}
					},
					formulaKeydownIf: function(ifTrue, e) {
						if (ifTrue) {
							jS.obj.cellActive().dblclick();
							return true;
						}
						return false;
					},
					documentKeydown: function(e) {
						if (jS.readOnly[jS.i]) return false;
						if (jS.cellLast.row < 0 || jS.cellLast.col < 0) return false;
						
						if (jS.nav) {
							switch (e.keyCode) {
								case key.TAB: 		jS.evt.keyDownHandler.tab(e);
									break;
								case key.ENTER:
								case key.LEFT:
								case key.UP:
								case key.RIGHT:
								case key.DOWN:		(e.shiftKey ? jS.evt.cellSetHighlightFromKeyCode(e) : jS.evt.cellSetFocusFromKeyCode(e));
									break;
								case key.PAGE_UP:	jS.evt.keyDownHandler.pageUpDown(true);
									break;
								case key.PAGE_DOWN:	jS.evt.keyDownHandler.pageUpDown();
									break;
								case key.HOME:
								case key.END:		jS.evt.cellSetFocusFromKeyCode(e);
									break;
								case key.V:		return jS.evt.keyDownHandler.formulaKeydownIf(!jS.evt.pasteOverCells(e), e);
									break;
								case key.Y:		return jS.evt.keyDownHandler.formulaKeydownIf(!jS.evt.keyDownHandler.redo(e), e);
									break;
								case key.Z:		return jS.evt.keyDownHandler.formulaKeydownIf(!jS.evt.keyDownHandler.undo(e), e);
									break;
								case key.ESCAPE: 	jS.evt.cellEditAbandon();
									break;
								case key.F:		return jS.evt.keyDownHandler.formulaKeydownIf(jS.evt.keyDownHandler.findCell(e), e);
									break;
								case key.CONTROL: //we need to filter these to keep cell state
								case key.CAPS_LOCK:
								case key.SHIFT:
								case key.ALT:
												jS.obj.formula().focus().select(); return true;
									break;
								default:		jS.obj.cellActive().dblclick(); return true;
							}
							return false;
						}
					}
				},
				pasteOverCells: function(e) { //used for pasting from other spreadsheets
					if (e.ctrlKey || e.type == "paste") {
						var fnAfter = function() {
							jS.updateCellsAfterPasteToFormula();
						};
						
						var doc = $document
							.one('keyup', function() {
								fnAfter();
								fnAfter = function() {};
								doc.mouseup();
							})
							.one('mouseup', function() {
								fnAfter();
								fnAfter = function() {};
								doc.keyup();
							});
						
						jS.setDirty(true);
						return true;
					}
				},
				inPlaceEditOnKeyDown: function(e) {
					switch (e.keyCode) {
						case key.ENTER: 	return jS.evt.keyDownHandler.enterOnInPlaceEdit(e);
							break;
						case key.TAB: 		return jS.evt.keyDownHandler.tab(e);
							break;
						case key.ESCAPE:	jS.evt.cellEditAbandon(); return false;
							break;
					}
				},
				formulaChange: function(e) {
					jS.obj.inPlaceEdit().val(jS.obj.formula().val());
				},
				inPlaceEditChange: function(e) {
					jS.obj.formula().val(jS.obj.inPlaceEdit().val());
				},
				cellEditDone: function(forceCalc) { /* called to edit a cells value from jS.obj.formula(), afterward setting "fnAfterCellEdit" is called w/ params (td, row, col, spreadsheetIndex, sheetIndex)
														forceCalc: bool, if set to true forces a calculation of the selected sheet
													*/
					switch (jS.cellLast.isEdit || forceCalc) {
						case true:
							jS.obj.inPlaceEdit().remove();
							var formula = jS.obj.formula();
							//formula.unbind('keydown'); //remove any lingering events from inPlaceEdit
							var td = jS.obj.cellActive();
							switch(jS.isFormulaEditable(td)) {
								case true:
									//Lets ensure that the cell being edited is actually active
									if (td && jS.cellLast.row > 0 && jS.cellLast.col > 0) {
										//first, let's make it undoable before we edit it
										jS.cellUndoable.add(td);
										
										//This should return either a val from textbox or formula, but if fails it tries once more from formula.
										var v = formula.val();
										var prevVal = td.text();
										var cell = jS.spreadsheets[jS.i][jS.cellLast.row][jS.cellLast.col];
										if (v.charAt(0) == '=') {
											td
												.attr('formula', v)
												.html('');
											cell.value = v;
											cell.formula = v;
										} else {
											td
												.removeAttr('formula')
												.html(s.encode(v));
											cell.value = v;
											cell.formula = null;
										}
										
										//reset the cell's value
										cell.calcCount = 0;
										
										if (v != prevVal || forceCalc) {
											jS.calc();
										}
										
										//jS.attrH.setHeight(jS.cellLast.row, 'cell');

										jS.sheetSyncSize();

										//Save the newest version of that cell
										jS.cellUndoable.add(td);
										
										//formula.focus().select();
										jS.cellLast.isEdit = false;
										
										jS.setDirty(true);
										
										//perform final function call
										jS.trigger('afterCellEdit', [{
											td: jS.cellLast.td,
											row: jS.cellLast.row,
											col: jS.cellLast.col,
											spreadsheetIndex: jS.i,
											sheetIndex: I
										}]);
									}
							}
							break;
						default:
							jS.attrH.setHeight(jS.cellLast.row, 'cell', false);
					}
				},
				cellEditAbandon: function(skipCalc) { /* removes focus of a selected cell and doesn't change it's value
															skipCalc: bool, if set to true will skip sheet calculation;
														*/
					jS.obj.inPlaceEdit().remove();
					jS.themeRoller.cell.clearActive();
					jS.themeRoller.bar.clearActive();
					jS.themeRoller.cell.clearHighlighted();
					
					if (!skipCalc) {
						jS.calc();
					}
					
					jS.cellLast.td = [];
					jS.cellLast.row = 0;
					jS.cellLast.col = 0;
					jS.rowLast = 0;
					jS.colLast = 0;
					
					jS.labelUpdate('', true);
					jS.obj.formula()
						.val('');
					
					jS.autoFillerHide();
					
					return false;
				},
				cellSetFocusFromXY: function(left, top) { /* a handy function the will set a cell active by it's location on the browser;
																		left: int, pixels left;
																		top: int, pixels top;
																	*/
					var td = jS.getTdFromXY(left, top);
					if (jS.isTd(td)) {
						td = $(td);
						jS.cellEdit(td);
						return false;
					}
					return true;
				},
				cellSetHighlightFromKeyCode: function(e) {
					var c = jS.highlightedLast.colLast;
					var r = jS.highlightedLast.rowLast;
					var size = jS.sheetSize();
					jS.obj.cellActive().mousedown();
					
					switch (e.keyCode) {
						case key.UP: 		r--; break;
						case key.DOWN: 		r++; break;
						case key.LEFT: 		c--; break;
						case key.RIGHT: 	c++; break;
					}
					
					function keepInSize(i, size) {
						if (i < 1) return 1;
						if (i > size) return size;
						return i;
					}
					r = keepInSize(r, size.height);
					c = keepInSize(c, size.width);
					
					td = jS.getTd(jS.i, r, c);
					$(td).mousemove().mouseup();
					
					jS.highlightedLast.rowLast = r;
					jS.highlightedLast.colLast = c;
					return false;
				},
				cellSetFocusFromKeyCode: function(e) { /* invoke a click on next/prev cell */
					var c = jS.cellLast.col; //we don't set the cellLast.col here so that we never go into indexes that don't exist
					var r = jS.cellLast.row;
					var overrideIsEdit = false;
					switch (e.keyCode) {
						case key.UP: 		r--; break;
						case key.DOWN: 		r++; break;
						case key.LEFT: 		c--; break;
						case key.RIGHT: 	c++; break;
						case key.ENTER:		r++;
							overrideIsEdit = true;
							if (jS.highlightedLast.td.length > 1) {
								var inPlaceEdit = jS.obj.inPlaceEdit();
								var v = inPlaceEdit.val();
								inPlaceEdit.remove();
								jS.updateCellsAfterPasteToFormula(v);
								return true;
							} else if (s.autoAddCells) {
								if (jS.cellLast.row == jS.sheetSize().height) {
									jS.controlFactory.addRow();
								}
							}
							break;
						case key.TAB:
							overrideIsEdit = true;
							if (e.shiftKey) {
								c--;
							} else {
								c++;
							}
							if (s.autoAddCells) {
								if (jS.cellLast.col == jS.sheetSize().width) {
									jS.controlFactory.addColumn();
								}
							}
							break;
						case key.HOME:		c = 1; break;
						case key.END:		c = jS.obj.cellActive().parent().find('td').length - 1; break;
					}
					
					//we check here and make sure all values are above 0, so that we get a selected cell
					c = (c ? c : 1);
					r = (r ? r : 1);
					
					//to get the td could possibly make keystrokes slow, we prevent it here so the user doesn't even know we are listening ;)
					if (!jS.cellLast.isEdit || overrideIsEdit) {
						//get the td that we want to go to
						var td = jS.getTd(jS.i, r, c);
						
						//if the td exists, lets go to it
						if (td) {
							jS.themeRoller.cell.clearHighlighted();
							td = $(td);
							if (td.data('hidden')) {
								function getNext(o, reverse) {
									if (reverse) {
										c++;
										o = o.next()
									}
									else {
										c--;
										o = o.prev();
									}
									
									if (o.data('hidden') && o.length) {
										return getNext(o, reverse);
									}
									return o;
								}
								
								td = getNext(td, c > jS.cellLast.col);
							}
							jS.cellEdit(td);
							return false;
						}
					}
					
					//default, can be overridden above
					return true;
				},
				cellOnMouseDown: function(e) {


					jS.obj.formula().blur();
					if (e.shiftKey) {
						jS.getTdRange(e, jS.obj.formula().val());
					} else {
						jS.cellEdit($(e.target), true);
					}			
				},
				cellOnDblClick: function(e) {
					jS.cellLast.isEdit = jS.isSheetEdit = true;
					jS.controlFactory.inPlaceEdit();
					//jS.log('click, in place edit activated');
				},
				barInteraction: { /* handles bar events, including resizing */
					first: 0,
					last: 0,
					selecting: false,
					select: function(o, e, selectFn) {
						if (!o) return;
						if (!jS.isBar(o)) return;
						o = $(o);
						var entity = o.data('entity'); //returns "top" or "left";
						var i = jS.getBarIndex[entity](o);
						if (!i) return false;
						
						jS[entity + 'Last'] = i; //keep track of last column for inserting new columns
						jS.evt.barInteraction.last = jS.evt.barInteraction.first = i;
						
						jS.cellSetActiveBar(entity, jS.evt.barInteraction.first, jS.evt.barInteraction.last);
						jS.evt.barInteraction.first = jS.evt.barInteraction.last = jS[entity + 'Last'] = i;

						jS.evt.barInteraction.selecting = true;
						$document
							.one('mouseup', function() {
								jS.evt.barInteraction.selecting = false;
							});
						
						return false;
					}
				},
				scrollVertical: {
					start: function(pane, sheet) {
						jS.autoFillerHide();
						
						if (!pane) pane = jS.obj.pane();
						if (!sheet) sheet = jS.obj.sheet();
						
						this.pane = pane,
						this.sheet = sheet,
						this.v = [],
						this.p = [],
						this.size = jS.sheetSize(sheet),
						this.offset = 0,
						this.td = jS.obj.cellActive(),
						this.max = this.size.height,
						this.height = jS.obj.pane().height() - 50,
						this.sheetHeight = sheet.height(),
						this.master = jS.obj.scrollerMasterLeft();

						var alwaysShowRowHeight = 0;

						for(var i = this.size.height; i > 1; i--) {
							var rowHeight = $(jS.getTd(jS.i, i, 1)).parent().andSelf().height();
							if (alwaysShowRowHeight + rowHeight < this.height) {
								alwaysShowRowHeight += rowHeight;
								this.max--;
							}
						}
						this.max++;
						this.max++;

						this.gridSize = parseInt(100 / this.max);
						for(var i = 1; i <= this.max; i++) {
							this.v[i] = this.gridSize * i;
							this.p[this.gridSize * i] = i + 1;
						}
					},
					scroll: function(pos, offset) {
						offset = offset || 0;
						this.value += offset;
						if (pos.value == this.value && this.value !== undefined) return;
						if (!pos) pos = {};
						if (!pos.pixel) pos.pixel = 1;

						if (!pos.value) {
							if (!this.p) {
								this.start();
							}
							pos.value = this.p[arrHelpers.getClosestValues(this.v, Math.abs(pos.pixel / (this.sheetHeight - this.height)) * 100)];
						}

						if (pos.value > this.max) pos.value = this.max;

						var i = 1;
						this.ids = [];
						while (i <= this.max) {
							if (i < pos.value && i > (1 + jS.s.frozenAt.row)) {
								this.ids.push('#' + jS.id.sheet + jS.i + ' tr:nth-child(' + i + ')');
							}
							i++;
						}

						this.master.html(
							this.ids.join(',') + '{' +
								'display: none;' +
							'}'
						);

						this.value = pos.value;
					},
					stop: function() {
						jS.obj.scrollerMaster().children().scrollTop(this.gridSize * (this.value - 1));

						if (this.td) {
							jS.evt.scrollHorizontal.td = null;
							jS.autoFillerGoToTd();
						}
					}
				},
				scrollHorizontal: {
					start: function(pane, sheet) {
						jS.autoFillerHide();
						
						if (!pane) pane = jS.obj.pane();
						if (!sheet) sheet = jS.obj.sheet();
						
						this.pane = pane,
						this.sheet = sheet,
						this.cols = $(jS.cols()),
						this.v = [],
						this.p = [],
						this.size = jS.sheetSize(sheet),
						this.offset = 0,
						this.td = jS.obj.cellActive(),
						this.tdLoc = jS.getTdLocation(this.td),
						this.sheetWidth = sheet.width(),
						this.max = this.size.width,
						this.width = pane.width() - 100,
						this.master = jS.obj.scrollerMasterTop();
						
						var alwaysShowColWidth = 0;
						for(var i = this.cols.length - 1; i > 1; i--) {
							var colWidth = this.cols.eq(i).width();
							if (alwaysShowColWidth + colWidth < this.width) {
								alwaysShowColWidth += colWidth;
								if (alwaysShowColWidth < this.width) this.max--;
							}
						}
						this.max++;
						this.gridSize = parseInt(100 / this.max);

						for(var i = 0; i <= this.max; i++) {
							this.v[i] = this.gridSize * i;
							this.p[this.gridSize * i] = i + 1;
						}
					},
					scroll: function(pos, offset) {
						offset = offset || 0;
						this.value += offset;

						if (pos.value == this.value && this.value !== undefined) return;
						if (!pos) pos = {};
						if (!pos.pixel) pos.pixel = 1;
						if (!pos.value) {
							if (!this.p) {
								this.start();
							}
							pos.value = this.p[arrHelpers.getClosestValues(this.v, Math.abs(pos.pixel / (this.sheetWidth - this.width)) * 100)];
						}

						if (pos.value > this.max) pos.value = this.max;

						var i = 1;
						this.ids = [];
						while (i <= this.max) {
							if (i <= pos.value && i > (1 + jS.s.frozenAt.col)) {
								this.ids.push('#' + jS.id.sheet + jS.i + ' tr td:nth-child(' + i + ')');
								this.ids.push('#' + jS.id.sheet + jS.i + ' col:nth-child(' + i + ')');
							}
							i++;
						}

						this.master.html(
							this.ids.join(',') + '{' +
								'display: none;' +
							'}'
						)

						this.value = pos.value;
					},
					stop: function() {
						jS.obj.scrollerMaster().scrollLeft(this.gridSize * this.value);
						
						if (this.td) {
							jS.evt.scrollVertical.td = null;
							jS.autoFillerGoToTd();
						}
					}
				}
			},
			scrollRefresh: function(pos) {
				if (!pos) return;
				if (pos.row) {
					jS.evt.scrollVertical.start();
					jS.evt.scrollVertical.scroll({value: pos.row});
					jS.evt.scrollVertical.stop();
				}

				if (pos.col) {
					jS.evt.scrollHorizontal.start();
					jS.evt.scrollHorizontal.scroll({value: pos.col});
					jS.evt.scrollHorizontal.stop();
				}
			},
			isTd: function(o) { /* ensures the the object selected is actually a td that is in a sheet
									o: object, cell object;
								*/
				if (!o) return false;

				o = (o[0] ? o[0] : [o]);
				if (o[0]) {
					if (!isNaN(o[0].cellIndex)) {
						if (o[0].cellIndex > 0 && o[0].parentNode.rowIndex > 0) { 
							return true;
						}
					}
				}
				return false;
			},
			isBar: function(o) {
				o = (o[0] ? o[0] : [o]);
				if (o[0]) {
					if (!isNaN(o[0].cellIndex)) {
						if (o[0].cellIndex == 0 || o[0].parentNode.rowIndex == 0) { 
							return true;
						}
					}
				}
				return false;
			},
			readOnly: [],
			isSheetEditable: function(i) {
				i = (i == null ? jS.i : i);
				return (
					s.editable == true && !jS.readOnly[i]
				);
			},
			isFormulaEditable: function(o) { /* ensures that formula attribute of an object is editable
													o: object, td object being used as cell
											*/
				if (s.lockFormulas) {
					if(o.attr('formula') !== undefined) {
						return false;
					}
				}
				return true;
			},
			toggleFullScreen: function() { /* toggles full screen mode */
				if (jS.obj.fullScreen().is(':visible')) { //here we remove full screen
					$body.removeClass('bodyNoScroll');
					s.parent = origParent;
					
					var w = s.parent.width();
					var h = s.parent.height();
					s.width = w;
					s.height = h;
					
					jS.obj.tabContainer().insertAfter(
						s.parent.append(jS.obj.fullScreen().children())
					).removeClass(jS.cl.tabContainerFullScreen);
					
					jS.obj.fullScreen().remove();
					
					jS.sheetSyncSize();
				} else { //here we make a full screen
					$body.addClass('bodyNoScroll');
					
					var w = $window.width() - 15;
					var h = $window.height() - 35;
					
					
					s.width = w;
					s.height = h;
					
					jS.obj.tabContainer().insertAfter(
						$('<div class="' + jS.cl.fullScreen + ' ' + jS.cl.uiFullScreen + '" />')
							.append(s.parent.children())
							.appendTo($body)
					).addClass(jS.cl.tabContainerFullScreen);
					
					s.parent = jS.obj.fullScreen();
					
					jS.sheetSyncSize();
				}
			},
			renameSpreadsheet: function(i) {
				if (isNaN(i)) return false;
				
				if (i > -1)
					jS.sheetTab();
			},
			switchSpreadsheet: function(i) {
				if (isNaN(i)) return false;
				
				if (i == -1) {
					jS.addSheet('5x10');
				} else if (i != jS.i) {
					jS.setActiveSheet(i);
					jS.calc(i);
				}
				
				jS.trigger('switchSheet', [i]);
				return false;
			},
			tuneTableForSheetUse: function(o) { /* makes table object usable by sheet
													o: object, table object;
												*/
				o
					.addClass(jS.cl.sheet)
					.attr('id', jS.id.sheet + jS.i)
					.attr('border', '1px')
					.attr('cellpadding', '0')
					.attr('cellspacing', '0');
					
				o.find('td.' + jS.cl.cellActive).removeClass(jS.cl.cellActive);
				
				return o;
			},
			attrH: {/* Attribute Helpers
						I created this object so I could see, quickly, which attribute was most stable.
						As it turns out, all browsers are different, thus this has evolved to a much uglier beast
					*/
				width: function(o, skipCorrection) {
					return $(o).outerWidth() - (skipCorrection ? 0 : s.boxModelCorrection);
				},
				widthReverse: function(o, skipCorrection) {
					return $(o).outerWidth() + (skipCorrection ? 0 : s.boxModelCorrection);
				},
				height: function(o, skipCorrection) {
					return $(o).outerHeight() - (skipCorrection ? 0 : s.boxModelCorrection);
				},
				heightReverse: function(o, skipCorrection) {
					return $(o).outerHeight() + (skipCorrection ? 0 : s.boxModelCorrection);
				},
				setHeight: function(i, from, skipCorrection, o) {
					var correction = 0;
					var h = 0;
					var fn;
					
					switch(from) {
						case 'cell':
							o = (o ? o : jS.obj.barLeft(i));
							h = jS.attrH.height(jQuery(jS.getTd(jS.i, i, 0)).parent().andSelf(), skipCorrection);
							break;
						case 'bar':
							if (!o) {
								var tr = jQuery(jS.getTd(jS.i, i, 0)).parent();
								var td = tr.children();
								o = tr.add(td);
							} 
							h = jS.attrH.heightReverse(jS.obj.barLeft(i), skipCorrection);
							break;
					}
					
					if (h) {
						jQuery(o)
							.height(h)
							.css('height', h + 'px')
							.attr('height', h + 'px');
					}

					return o;
				}
			},
			setTdIds: function(sheet, i) { /* cycles through all the td in a sheet and sets their id & virtual spreadsheet so it can be quickly referenced later
										sheet: object, table object;
										i: integer, sheet index
									*/
				if (!sheet) {
					sheet = jS.obj.sheet();
					i = jS.i;
				}
				
				jS.spreadsheets[i] = []; //reset the sheet's spreadsheet
				
				sheet.find('tr').each(function(row) {
					jQuery(this).children().each(function(col) {
						var td = jQuery(this);
						
						if (row > 0 && col > 0) {
							td.attr('id', jS.getTdId(i, row, col));
							jS.createCell(i, row, col, td.text(), td.attr('formula'));
						} else {
							if (col == 0 && row > 0) { //barleft
								td
									.data('type', 'bar')
									.data('entity', 'left')
									.text(row)
									.attr('id', jS.id.barLeft + row + '_' + jS.i)
									.attr('class', jS.cl.barLeft + ' ' + jS.cl.barLeft + '_' + jS.i + ' ' + jS.cl.uiBar);
							}
							
							if (row == 0 && col > 0) { //bartop
								td
									.data('type', 'bar')
									.data('entity', 'top')
									.text(jSE.columnLabelString(col))
									.attr('id', jS.id.barTop + col + '_' + jS.i)
									.attr('class', jS.cl.barTop + ' ' + jS.cl.barTop + '_' + jS.i + ' ' + jS.cl.uiBar);
							}
							
							if (row == 0 && col == 0) { //corner
								td
									.data('type', 'bar')
									.data('entity', 'corner')
									.attr('id', jS.id.barCorner + jS.i)
									.attr('class', jS.cl.uiBar + ' ' + ' ' + jS.cl.barCorner);
							}
						}
					});
				});
			},
			setControlIds: function() { /* resets the control ids, useful for when adding new sheets/controls between sheets/controls :) */
				var resetIds = function(o, id) {
					o.each(function(i) {
						jQuery(this).attr('id', id + i);
					});
				};
				
				resetIds(jS.obj.sheetAll().each(function(i) {
					jS.setTdIds(jQuery(this), i);
				}), jS.id.sheet);
				
				resetIds(jS.obj.barTopAll(), jS.id.barTop);
				resetIds(jS.obj.barTopParentAll(), jS.id.barTopParent);
				resetIds(jS.obj.barLeftAll(), jS.id.barLeft);
				resetIds(jS.obj.barLeftParentAll(), jS.id.barLeftParent);
				resetIds(jS.obj.barCornerAll(), jS.id.barCorner);
				resetIds(jS.obj.barCornerParentAll(), jS.id.barCornerParent);
				resetIds(jS.obj.tableControlAll(), jS.id.tableControl);
				resetIds(jS.obj.paneAll(), jS.id.pane);
				resetIds(jS.obj.tabAll().each(function(j) {
					jQuery(this).attr('i', j);
				}), jS.id.tab);
			},
			toggleHide: {//These are not ready for prime time
				row: function(i) {
					if (!i) {//If i is empty, lets get the current row
						i = jS.obj.cellActive().parent().attr('rowIndex');
					}
					if (i) {//Make sure that i equals something
						var o = jS.obj.barLeft(i);
						if (o.is(':visible')) {//This hides the current row
							o.hide();
							jS.obj.sheet().find('tr').eq(i).hide();
						} else {//This unhides
							//This unhides the currently selected row
							o.show();
							jS.obj.sheet().find('tr').eq(i).show();
						}
					} else {
						alert(jS.msg.toggleHideRow);
					}
				},
				rowAll: function() {
					jS.obj.sheet().find('tr').show();
					jS.obj.barLeftAll().show();
				},
				column: function(i) {
					if (!i) {
						i = jS.obj.cellActive().attr('cellIndex');
					}
					if (i) {
						//We need to hide both the col and td of the same i
						var o = jS.obj.barTop(i);
						if (o.is(':visible')) {
							jS.obj.sheet().find('tbody tr').each(function() {
								jQuery(this).children().eq(i).hide();
							});
							o.hide();
							jS.obj.sheet().find('colgroup col').eq(i).hide();
							jS.toggleHide.columnSizeManage();
						}
					} else {
						alert(jS.msg.toggleHideColumn);
					}
				},
				columnAll: function() {
				
				},
				columnSizeManage: function() {
					var w = jS.obj.barTopAll().width();
					var newW = 0;
					var newW = 0;
					jS.obj.barTopAll().each(function() {
						var o = jQuery(this);
						if (o.is(':hidden')) {
							newW += o.width();
						}
					});
					jS.obj.sheet().width(w);
				}
			},
			merge: function() { /* merges cells */
				var cellsValue = "";
				var cellValue = "";
				var cells = jS.obj.cellHighlighted();
				var formula;
				var cellFirstLoc = jS.getTdLocation(cells.first());
				var cellLastLoc = jS.getTdLocation(cells.last());
				var colI = (cellLastLoc.col - cellFirstLoc.col);
				
				if (cells.length > 1 && cellFirstLoc.row) {
					for (var i = cellFirstLoc.col; i <= cellLastLoc.col; i++) {
						var td = jQuery(jS.getTd(jS.i, cellFirstLoc.row, i)).hide();
						var cell = jS.spreadsheets[jS.i][cellFirstLoc.row][i];
						
						cellsValue = (cell.formula ? "(" + cell.formula.replace('=', '') + ")" : cell.value) + cellsValue;
						
						if (i != cellFirstLoc.col) {
							cell.formula = null;
							cell.value;
							td
								.attr('formula', '')
								.html('')
								.hide();
						}
					}
					
					var cell = cells.first()
						.show()
						.attr('colspan', colI)
						.html(cellsValue);
					
					jS.setDirty(true);
					jS.calc();
				} else if (!cellFirstLoc.row) {
					alert(jS.msg.merge);
				}
			},
			unmerge: function() { /* unmerges cells */
				var cell = jS.obj.cellHighlighted().first();
				var loc = jS.getTdLocation(cell);
				var formula = cell.attr('formula');
				var v = cell.text();
				v = (formula ? formula : v);
				
				var rowI = cell.attr('rowspan');
				var colI = cell.attr('colspan');
				
				//rowI = parseInt(rowI ? rowI : 1); //we have to have a minimum here;
				colI = parseInt(colI ? colI : 1);
				
				var td = '<td />';
				
				var tds = '';
				
				if (colI) {
					for (var i = 0; i < colI; i++) {
						tds += td;
					}
				}
				
				for (var i = loc.col; i < colI; i++) {
					jQuery(jS.getTd(jS.i, loc.row, i)).show();
				}
				
				cell.removeAttr('colspan');
				
				jS.setDirty(true);
				jS.calc();
			},
			fillUpOrDown: function(goUp, skipOffsetForumals, v) { /* fills values down or up to highlighted cells from active cell;
																	goUp: bool, default is down, when set to true value are filled from bottom, up;
																	skipOffsetForumals: bool, default is formulas will offest, when set to true formulas will stay static;
																	v: string, the value to set cells to, if not set, formula will be used;
																*/
				var cells = jS.obj.cellHighlighted();
				var cellActive = jS.obj.cellActive();
				//Make it undoable
				jS.cellUndoable.add(cells);
				
				var startFromActiveCell = cellActive.hasClass(jS.cl.uiCellHighlighted);
				var startLoc = jS.getTdLocation(cells.first());
				var endLoc = jS.getTdLocation(cells.last());
				
				v = (v ? v : jS.obj.formula().val()); //allow value to be overridden
				
				var offset = {
					row: 0,
					col: 0
				};
				var td;
				var newV = v;
				var fn;
				if (v.charAt(0) == '=') {
					fn = function(sheet, row, col){
						td = jQuery(this);
						
						if (goUp) {
							offset.row = -endLoc.row + row;
							offset.col = -endLoc.col + col;
						}
						else {
							offset.row = row - startLoc.row;
							offset.col = col - startLoc.col;
						}
						
						newV = jS.reparseFormula(v, offset);
						
						jS.spreadsheets[sheet][row][col].formula = newV;
						
						td.attr('formula', newV).html('');
					};
				} else {
					if (goUp && !isNaN(newV)) {
						newV *= 1;
						newV -= endLoc.row;
						newV -= endLoc.col;
					}
					fn = function(sheet, row, col){
						td = jQuery(this);
						
						jS.spreadsheets[sheet][row][col].formula = null;
						jS.spreadsheets[sheet][row][col].value = newV;
						
						td.removeAttr('formula').html(newV);
						if (!isNaN(newV) && newV != '') newV++;
					};
				}
				
				jS.cycleCells(fn, startLoc, endLoc);
				
				jS.setDirty(true);
				jS.calc();
				
				//Make it redoable
				jS.cellUndoable.add(cells);
			},
			offsetFormulas: function(loc, offset, isBefore) {/* makes cell formulas increment in a range
																						loc: {row: int, col: int}
																						offset: {row: int,col: int} offsets increment;
																						isBefore: bool, inserted before location
																					*/
				var size = jS.sheetSize();
				//shifted range is the range of cells that are moved
				var shiftedRange = {
					first: loc,
					last: {
						row: size.height,
						col: size.width
					}
				};
				//effected range is the entire spreadsheet
				var affectedRange = {
					first: {
						row: 0,
						col: 0
					},
					last: {
						row: size.height,
						col: size.width
					}
				};
				
				jS.log("offsetFormulas from - Col:" + loc.col + ',Row:' + loc.row);
				jS.log("Is before loc:" + (isBefore ? 'true' : 'false'));
				jS.log("Offset: - Col:" + offset.col + ',Row:' + offset.row);
				
				function isInFormula(thisLoc, rowOrCol) {
					var move = false;
					
					if (isBefore) {
						if (thisLoc >= rowOrCol)
							move = true;
					} else {
						if (thisLoc > rowOrCol) 
							move = true;
					}
					
					return move;
				}

				jS.cycleCells(function (sheet, row, col) {
					var td = jQuery(this);
					var formula = td.attr('formula');

					if (formula && jS.isFormulaEditable(td)) {
						formula = jS.reparseFormula(formula, offset, function(thisLoc){
							return {
								row: isInFormula(thisLoc.row, loc.row),
								col: isInFormula(thisLoc.col, loc.col)
							};
						});
						
						jS.spreadsheets[sheet][row][col].formula = formula;
						td.attr('formula', formula);
					}

				}, affectedRange.first, affectedRange.last);
				
				
				jS.evt.cellEditDone();
				jS.calc();
			},
			reparseFormula: function(formula, offset, fn) {
				return formula.replace(jSE.regEx.cell, function(ignored, col, row, pos) {
					if (col == "SHEET") return ignored;
					
					var loc = jSE.parseLocation(ignored);
					
					if (fn) {
						var move = fn(loc);
						
						
						if (move.col || move.row) {
							if (move.col) loc.col += offset.col;
							if (move.row) loc.row += offset.row;
							
							return jS.makeFormula(loc);
						}
					} else {
						return jS.makeFormula(loc, offset);
					}
											
					return ignored;
				});
			},
			makeFormula: function(loc, offset) {
				offset = jQuery.extend({row: 0, col: 0}, offset);
				
				//set offsets
				loc.col += offset.col;
				loc.row += offset.row;
				
				//0 based now
				if (loc.col < 0) loc.col = 0;
				if (loc.row < 0) loc.row = 0;
				
				return jSE.parseCellName(loc.col, loc.row);
			},
			cycleCells: function(fn, firstLoc, lastLoc, sheet) { /* cylces through a certain group of cells in a spreadsheet and applies a function to them
															fn: function, the function to apply to a cell;
															firstLoc: array of int - [col, row], the group to start;
															lastLoc: array of int - [col, row], the group to end;
														*/
				sheet = (sheet ? sheet : jS.i);
				firstLoc = (firstLoc ? firstLoc : {row: 0, col: 0});
				
				if (!lastLoc) {
					var size = jS.sheetSize(jQuery('#' + jS.id.sheet + sheet));
					lastLoc = {row: size.height, col: size.width};
				}
				
				for (var row = firstLoc.row; row <= lastLoc.row; row++) {
					for (var col = firstLoc.col; col <= lastLoc.col; col++) {
						var td = jS.getTd(sheet, row, col);
						if (td) {
							fn.apply(td, [sheet, row, col]);
						}
					}
				}
			},
			cycleCellsAll: function(fn) {
				for (var i = 0; i <= jS.sheetCount; i++) {
					var size = jS.sheetSize(jQuery('#' + jS.id.sheet + i));
					var endLoc = {row: size.height, col: size.width};
					jS.cycleCells(fn, {row: 0, col: 0}, endLoc, i);
				}
			},
			cycleCellsAndMaintainPoint: function(fn, firstLoc, lastLoc) { /* cylces through a certain group of cells in a spreadsheet and applies a function to them, firstLoc can be bigger then lastLoc, this is more dynamic
																			fn: function, the function to apply to a cell;
																			firstLoc: array of int - [col, row], the group to start;
																			lastLoc: array of int - [col, row], the group to end;
																		*/
				var o = [];
				for (var i = (firstLoc.row < lastLoc.row ? firstLoc.row : lastLoc.row) ; i <= (firstLoc.row > lastLoc.row ? firstLoc.row : lastLoc.row); i++) {
					for (var j = (firstLoc.col < lastLoc.col ? firstLoc.col : lastLoc.col); j <= (firstLoc.col > lastLoc.col ? firstLoc.col : lastLoc.col); j++) {
						o.push(jS.getTd(jS.i, i, j));
						fn(o[o.length - 1]);
					}
				}
				return o;
			},
			addTab: function() { /* Adds a tab for navigation to a spreadsheet */
				jQuery('<span class="' + jS.cl.uiTab + ' ui-corner-bottom">' + 
						'<a class="' + jS.cl.tab + '" id="' + jS.id.tab + jS.i + '" i="' + jS.i + '">' + jS.sheetTab(true) + '</a>' + 
					'</span>')
						.insertBefore(
							jS.obj.tabContainer().find('span:last')
						);
			},
			sheetDecorate: function(o) { /* preps a table for use as a sheet;
											o: object, table object;
										*/
				jS.formatSheet(o);
				jS.sheetSyncSizeToCols(o);
				jS.sheetDecorateRemove(false, o);
			},
			formatSheet: function(o) { /* adds tbody, colgroup, heights and widths to different parts of a spreadsheet
											o: object, table object;
										*/
				var tableWidth = 0;
				if (o.find('tbody').length < 1) {
					o.wrapInner('<tbody />');
				}
				
				if (o.find('colgroup').length < 1 || o.find('col').length < 1) {
					o.remove('colgroup');
					var colgroup = jQuery('<colgroup />');
					o.find('tr:first').children().each(function() {
						var w = s.newColumnWidth;
						jQuery('<col />')
							.width(w)
							.css('width', (w) + 'px')
							.attr('width', (w) + 'px')
							.appendTo(colgroup);
						
						tableWidth += w;
					});
					o.find('tr').each(function() {
						jQuery(this)
							.height(s.colMargin)
							.css('height', s.colMargin + 'px')
							.attr('height', s.colMargin + 'px');
					});
					colgroup.prependTo(o);
				}
				
				o
					.removeAttr('width')
					.css('width', '')
					.width(tableWidth);
			},
			checkMinSize: function(o) { /* ensure sheet minimums have been met, if not add columns and rows
											o: object, table object;
										*/
				var size = jS.sheetSize();
				
				var addRows = 0;
				var addCols = 0;
				
				if ((size.width) < s.minSize.cols) {
					addCols = s.minSize.cols - size.width;
				}
				
				if (addCols) {
					jS.controlFactory.addColumnMulti(addCols, false, true);
				}
				
				if ((size.height) < s.minSize.rows) {
					addRows = s.minSize.rows - size.height;
				}
				
				if (addRows) {
					jS.controlFactory.addRowMulti(addRows, false, true);
				}
			},
			themeRoller: { /* jQuery ui Themeroller integration	*/
				start: function() {
					//Style sheet			
					s.parent.addClass(jS.cl.uiParent);
					jS.obj.sheet().addClass(jS.cl.uiSheet);
					
					jS.obj.controls().addClass(jS.cl.uiControl);
					jS.obj.label().addClass(jS.cl.uiControl);
					jS.obj.formula().addClass(jS.cl.uiControlTextBox);
				},
				cell: {
					setActive: function() {
						this.clearActive();
						this.setHighlighted(
							jS.obj.cellActive()
								.addClass(jS.cl.cellActive)
						);
					},
					setHighlighted: function(td) {
						jQuery(td)
							.addClass(jS.cl.cellHighlighted + ' ' + jS.cl.uiCellHighlighted);
					},
					clearActive: function() {
						jS.obj.cellActive()
							.removeClass(jS.cl.cellActive);
					},
					isHighlighted: function() {
						return (jS.highlightedLast.td ? true : false);
					},
					clearHighlighted: function() {
						if (jS.themeRoller.cell.isHighlighted()) {
							jS.obj.cellHighlighted()
								.removeClass(jS.cl.cellHighlighted + ' ' + jS.cl.uiCellHighlighted);
						}
						
						jS.highlightedLast.rowStart = 0;
						jS.highlightedLast.colStart = 0;
						
						jS.highlightedLast.rowEnd = 0;
						jS.highlightedLast.colEnd = 0;
						jS.highlightedLast.td = [];
					}
				},
				bar: {
					style: function(o) {
						jQuery(o).addClass(jS.cl.uiBar);
					},
					setActive: function(direction, i) {
						//We don't clear here because we can have multi active bars
						switch(direction) {
							case 'top': jS.obj.barTop(i).addClass(jS.cl.uiBarHighlight);
								break;
							case 'left': jS.obj.barLeft(i).addClass(jS.cl.uiBarHighlight);
								break;
						}
					},
					clearActive: function() {
						jS.obj.barTopAll().add(jS.obj.barLeftAll())
							.removeClass(jS.cl.uiBarHighlight);
					}
				},
				tab: {
					setActive: function(o) {
						this.clearActive();
						jS.obj.tab().parent().addClass(jS.cl.uiTabActive);
					},
					clearActive: function () {
						jS.obj.tabContainer().find('span.' + jS.cl.uiTabActive)
							.removeClass(jS.cl.uiTabActive);
					}
				},
				resize: function() {// add resizable jquery.ui if available
					// resizable container div
					jS.resizable(s.parent, {
						minWidth: s.width * 0.5,
						minHeight: s.height * 0.5,

						start: function() {
							jS.obj.ui().hide();
						},
						stop: function() {
							jS.obj.ui().show();
							s.width = s.parent.width();
							s.height = s.parent.height();
							jS.sheetSyncSize();
						}
					});
					// resizable formula area - a bit hard to grab the handle but is there!
					var formulaResizeParent = jQuery('<span />');
					jS.resizable(jS.obj.formula().wrap(formulaResizeParent).parent(), {
						minHeight: jS.obj.formula().height(), 
						maxHeight: 78,
						handles: 's',
						resize: function(e, ui) {
							jS.obj.formula().height(ui.size.height);
							jS.sheetSyncSize();
						}
					});
				}
			},
			resizable: function(o, settings) { /* jQuery ui resizeable integration
													o: object, any object that neds resizing;
													settings: object, the settings used with jQuery ui resizable;
												*/
				if (!o.data('resizable')) {
					o.resizable(settings);
				}
			},
			busy: false,
			draggable: function(o, settings) {
				if (!o.data('draggable')) {
					o
						.draggable(settings)
						.data('draggable', true)
				}
			},
			resizeBar: {
				top: function(bar, i, sheet) {
					bar.find('.barController').remove();
					var barController = jQuery('<div class="barController" />')
						.width(bar.width())
						.height(0)
						.prependTo(bar);
					
					jS.resizable(barController, {
						handles: 'e',
						start: function(e, ui) {
							jS.autoFillerHide();
							jS.busy = true;
							this.col = $(jS.col(sheet, i));
						},
						resize: function(e, ui) {
							this.col
								.width(ui.size.width)
								.attr('width', ui.size.width + 'px')
								.css('width', ui.size.width + 'px');
						},
						stop: function(e, ui) {
							jS.busy = false;
							jS.followMe();
						}
					});
				},
				left: function(bar, i) {
					bar.find('.barController').remove();
					var barController = jQuery('<div class="barController" />')
						.width(0)
						.height(bar.height())
						.prependTo(bar);
					
					var parent = bar.parent().add(bar);
					jS.resizable(barController, {
						handles: 's',
						start: function() {
							jS.autoFillerHide();
							jS.busy = true;
						},
						resize: function(e, ui) {
							parent
								.height(ui.size.height)
								.attr('height', (ui.size.height))
								.css('height', ui.size.height + 'px');
						},
						stop: function(e, ui) {
							jS.busy = false;

							jS.followMe();
						}
					});
				},
				corner: function() {}
			},
			sheetDecorateRemove: function(makeClone, o) { /* removes sheet decorations
															makesClone: bool, creates a clone rather than the actual object;
														*/
				o = (o ? o : jS.obj.sheetAll());
				o = (makeClone ? o.clone() : o);
				
				//Get rid of highlighted cells and active cells
				o.find('td.' + jS.cl.cellActive)
					.removeClass(jS.cl.cellActive + ' ' + jS.cl.uiCellActive);
					
				o.find('td.' + jS.cl.cellHighlighted)
					.removeClass(jS.cl.cellHighlighted + ' ' + jS.cl.uiCellHighlighted);
				return o;
			},
			sheetBarsRemove: function(o) {
				o = jQuery(o ? o : jS.obj.sheetAll());
				o.find('tr.' + jS.cl.barTopParent).remove();
				o.find('td.' + jS.cl.barLeft).remove();
				return o;
			},
			labelUpdate: function(v, setDirect) { /* updates the label so that the user knows where they are currently positioned
													v: string or array of ints, new location value;
													setDirect: bool, converts the array of a1 or [0,0] to "A1";
												*/
				if (!setDirect) {
					jS.obj.label().html(jSE.parseCellName(v.col, v.row));
				} else {
					jS.obj.label().html(v);
				}
			},
			cellEdit: function(td, isDrag) { /* starts cell to be edited
												td: object, td object;
												isDrag: bool, should be determained by if the user is dragging their mouse around setting cells;
												*/
				jS.autoFillerNotGroup = true; //make autoFiller directional again.
				//This finished up the edit of the last cell
				jS.evt.cellEditDone();
				
				jS.followMe(td);
				
				var loc = jS.getTdLocation(td);
				
				//Show where we are to the user
				jS.labelUpdate(loc);
				
				var v = td.attr('formula');
				if (!v) {
					v = td.text();
				}
				
				var formula = jS.obj.formula()
					.val(v)
					.blur();
				
				jS.cellSetActive(td, loc, isDrag);
			},
			cellSetActive: function(td, loc, isDrag, directional, fnDone) { /* cell cell active to sheet, and highlights it for the user, shouldn't be called directly, should use cellEdit
																				td: object, td object;
																				loc: array of ints - [col, row];
																				isDrag: bool, should be determained by if the user is dragging their mouse around setting cells;
																				directional: bool, makes highlighting directional, only left/right or only up/down;
																				fnDone: function, called after the cells are set active;
																			*/
				if (typeof(loc.col) != 'undefined') {
					jS.cellLast.td = td; //save the current cell/td
					
					jS.cellLast.row = jS.rowLast = loc.row;
					jS.cellLast.col = jS.colLast = loc.col;
					
					jS.themeRoller.bar.clearActive();
					jS.themeRoller.cell.clearHighlighted();
					
					jS.highlightedLast.td = td;
					
					jS.themeRoller.cell.setActive(); //themeroll the cell and bars
					jS.themeRoller.bar.setActive('left', jS.cellLast.row);
					jS.themeRoller.bar.setActive('top', jS.cellLast.col);
					
					var selectModel;
					var clearHighlightedModel;
					
					jS.highlightedLast.rowStart = loc.row;
					jS.highlightedLast.colStart = loc.col;
					jS.highlightedLast.rowLast = loc.row;
					jS.highlightedLast.colLast = loc.col;
					
					switch (s.cellSelectModel) {
						case 'excel':
						case 'gdocs':
							selectModel = function() {};
							clearHighlightedModel = jS.themeRoller.cell.clearHighlighted;
							break;
						case 'oo':
							selectModel = function(target) {
								var td = jQuery(target);
								if (jS.isTd(td)) {
									jS.cellEdit(td);
								}
							};
							clearHighlightedModel = function() {};
							break;
					}
					
					if (isDrag) {
						var lastLoc = loc; //we keep track of the most recent location because we don't want tons of recursion here
						jS.obj.pane()
							.mousemove(function(e, target) {
								if (jS.busy) return false;

								target = target || e.target;

								var endLoc = jS.getTdLocation([target]);

								if (endLoc.col < 1 || endLoc.row < 1) return false; //bar

								var ok = true;
								
								if (directional) {
									ok = false;
									if (loc.col == endLoc.col || loc.row == endLoc.row) {
										ok = true;
									}
								}
								
								if ((lastLoc.col != endLoc.col || lastLoc.row != endLoc.row) && ok) { //this prevents this method from firing too much
									//clear highlighted cells if needed
									clearHighlightedModel();
									
									//set current bars
									jS.highlightedLast.colEnd = endLoc.col;
									jS.highlightedLast.rowEnd = endLoc.row;
									
									//select active cell if needed
									selectModel(target);
									
									//highlight the cells
									jS.highlightedLast.td = jS.cycleCellsAndMaintainPoint(jS.themeRoller.cell.setHighlighted, loc, endLoc);
								}
								
								lastLoc = endLoc;
							});
						
						$document
							.one('mouseup', function() {
	
								jS.obj.pane()
									.unbind('mousemove')
									.unbind('mouseup');
								
								if (jQuery.isFunction(fnDone)) {
									fnDone();
								}
							});
					}
				}
			},
			colLast: 0, /* the most recent used column */
			rowLast: 0, /* the most recent used row */
			cellLast: { /* the most recent used cell */
				td: [], //this is a dud td, so that we don't get errors
				row: 0,
				col: 0,
				isEdit: false
			}, /* the most recent highlighted cells */
			highlightedLast: {
				td: [],
				rowStart: 0,
				colStart: 0,
				rowEnd: 0,
				colEnd: 0
			},
			cellStyleToggle: function(setClass, removeClass) { /* sets a cells class for styling
																	setClass: string, class(es) to set cells to;
																	removeClass: string, class(es) to remove from cell if the setClass would conflict with;
																*/
				//Lets check to remove any style classes
				var uiCell = jS.obj.cellHighlighted();
				
				jS.cellUndoable.add(uiCell);
				
				if (removeClass) {
					uiCell.removeClass(removeClass);
				}
				//Now lets add some style
				if (uiCell.hasClass(setClass)) {
					uiCell.removeClass(setClass);
				} else {
					uiCell.addClass(setClass);
				}
				
				jS.cellUndoable.add(uiCell);
				
				//jS.obj.formula()
					//.focus()
					//.select();
				return false;
			},
			fontReSize: function (direction) { /* resizes fonts in a cell by 1 pixel
													direction: string, "up" || "down"
												*/
				var resize=0;
				switch (direction) {
					case 'up':
						resize=1;
						break;
					case 'down':
						resize=-1;
						break;
				}
				
				//Lets check to remove any style classes
				var uiCell = jS.obj.cellHighlighted();
				
				jS.cellUndoable.add(uiCell);
				
				uiCell.each(function(i) {
					cell = jQuery(this);
					var curr_size = (cell.css("font-size") + '').replace("px","")
					var new_size = parseInt(curr_size ? curr_size : 10) + resize;
					cell.css("font-size", new_size + "px");
				});
				
				jS.cellUndoable.add(uiCell);
			},
			callStack: 0,
			updateCellValue: function(sheet, row, col) {
				//first detect if the cell exists if not return nothing
				if (!jS.spreadsheets[sheet]) return s.error({error: 'Sheet not found'});
				if (!jS.spreadsheets[sheet][row]) return s.error({error: 'Row not found'});
				if (!jS.spreadsheets[sheet][row][col]) return s.error({error: 'Column not found'});
				
				var cell = jS.spreadsheets[sheet][row][col];
				cell.oldValue = cell.value; //we detect the last value, so that we don't have to update all cell, thus saving resources

				if (cell.result) { //unset the last result if it is set
					delete cell.result;
				}

				if (cell.state) {
					return s.error({error: 'Loop Detected'});
				}
				
				cell.state = "red";
				cell.html = [];
				cell.fnCount = 0;
				
				if (cell.calcCount < 1 && cell.calcLast != jS.calcLast) {
					cell.calcLast = jS.calcLast;
					cell.calcCount++;
					if (cell.formula) {
						try {
							if (cell.formula.charAt(0) == '=') {
								cell.formula = cell.formula.substring(1, cell.formula.length);
							}
							
							var Parser;
							if (jS.callStack) { //we prevent parsers from overwriting each other
								if (!cell.parser) { //cut down on un-needed parser creation
									cell.parser = (new jS.parser);
								}
								Parser = cell.parser
							} else {//use the sheet's parser if there aren't many calls in the callStack
								Parser = jS.Parser;
							}
							
							jS.callStack++
							Parser.lexer.obj = {
								type: 'cell',
								sheet: sheet,
								row: row,
								col: col,
								obj: cell,
								s: s,
								editable: s.editable,
								jS: jS,
								error: s.error
							};
							Parser.lexer.handler = jS.cellHandler;
							cell.result = Parser.parse(cell.formula);
						} catch(e) {
							console.log(e);
							cell.result = e.toString().replace(/\n/g, '<br />'); //error
							
							origParent.one('calculation', function() { // the error size may be bigger than that of the cell, so adjust the height accordingly
								jS.attrH.setHeight(row, 'cell', false);
							});
							
							jS.alertFormulaError(cell.value);
						}
						jS.callStack--;
					}

					cell = jS.filterValue(cell, sheet, row, col);
					cell = jS.filterValue(cell, sheet, row, col);
				}
				
				cell.state = null;
				return cell.value;
			},
			filterValue: function(cell, sheet, row, col) {

				if (typeof cell.result != 'undefined') {
					cell.value = cell.result;
					$(jS.getTd(sheet, row, col)).html(cell.html.length > 0 ? cell.html : s.encode(cell.value));
				} else if (cell.html.length > 0) {
					$(jS.getTd(sheet, row, col)).html(cell.html);
				} else {
					$(jS.getTd(sheet, row, col)).html(s.encode(cell.value));
				}
				return cell;
			},
			cellHandler: {
				variable: function() {
					if (arguments.length) {
						switch(arguments[0].toLowerCase()) {
							case 'true': return jFN.TRUE();
							case 'false': return jFN.FALSE();
						}
					}
				},
				time: function(time, isAMPM) {
					return times.fromString(time, isAMPM);
				},
				concatenate: function() {
					jS.spreadsheets[this.sheet][this.row][this.col].html = [];
					return jFN.CONCATENATE.apply(this, arguments).value;
				},
				cellValue: function(id) { //Example: A1
					var loc = jSE.parseLocation(id);
					return jS.updateCellValue(this.sheet, loc.row, loc.col);
				},
				cellRangeValue: function(start, end) {//Example: A1:B1
					start = jSE.parseLocation(start);
					end = jSE.parseLocation(end);
					var result = [];
					
					for (var i = start.row; i <= end.row; i++) {
						for (var j = start.col; j <= end.col; j++) {
							result.push(jS.updateCellValue(this.sheet, i, j));
						}
					}
					return [result];
				},
				fixedCellValue: function(id) {
					id = id.replace(/\$/g, '');
					return jS.cellHandler.cellValue.apply(this, [id]);
				},
				fixedCellRangeValue: function(start, end) {
					start = start.replace(/\$/g, '');
					end = end.replace(/\$/g, '');
					return jS.cellHandler.cellRangeValue.apply(this, [start, end]);
				},
				remoteCellValue: function(sheet, id) {//Example: SHEET1:A1
					var loc = jSE.parseLocation(id);
					sheet = jSE.parseSheetLocation(sheet);
					return jS.updateCellValue(sheet, loc.row, loc.col);
				},
				remoteCellRangeValue: function(sheet, start, end) {//Example: SHEET1:A1:B2
					sheet = jSE.parseSheetLocation(sheet);
					start = jSE.parseLocation(start);
					end = jSE.parseLocation(end);
					
					var result = [];
					
					for (var i = start.row; i <= end.row; i++) {
						for (var j = start.col; j <= end.col; j++) {
							result.push(jS.updateCellValue(sheet, i, j));
						}
					}

					return [result];
				},
				callFunction: function(fn, args, cell) {
					fn = fn.toUpperCase();
					if (!args) {
						args = [''];
					} else if ($.isArray(args)) {
						args = args.reverse();
					} else {
						args = [args];
					}
					
					if ($.sheet.fn[fn]) {
						jS.spreadsheets[cell.sheet][cell.row][cell.col].fnCount++;
						var values = [],
							html = [];

						for(i in args) {
							if (args[i]) {
								if (args[i].value || args[i].html) {
									values.push(args[i].value);
									html.push(args[i].html);
								} else {
									values.push(args[i]);
									html.push(args[i]);
								}
							}
						}

						cell.html = html;
						var result = $.sheet.fn[fn].apply(cell, values);
						if (result != null) {
							if (typeof result.html != 'undefined') {
								jS.spreadsheets[cell.sheet][cell.row][cell.col].html = result.html;
							}
							if (typeof result.value != 'undefined') {
								return result.value;
							}
						}
						return result;
					} else {
						return s.error({error: "Function " + fn + " Not Found"});
					}
				}
			},
			cellLookupHandlers: {
				fixedCellValue: function(id) {
					return [jS.sheet, jSE.parseLocation(id), jSE.parseLocation(id)];
				},
				fixedCellRangeValue: function(sheet, start, end) {
					return [jSE.parseSheetLocation(sheet), jSE.parseLocation(start), jSE.parseLocation(end)];
				},
				cellValue: function(id) {
					
				},
				cellRangeValue: function(sheet, start, end) {
					return [jS.sheet, jSE.parseLocation(start), jSE.parseLocation(end)];
				},
				remoteCellValue: function(sheet, id) {
					return [jS.sheet, jSE.parseLocation(id), jSE.parseLocation(id)];
				},
				remoteCellRangeValue: function(sheet, start, end) {
					return [jSE.parseSheetLocation(sheet), jSE.parseLocation(start), jSE.parseLocation(end)];
				},
				callFunction: function() {
					if (arguments[0] == "VLOOKUP" || arguments[0] == "HLOOKUP" && arguments[1]) {
						return arguments[1].reverse()[1];
					}
				}
			},
			cellLookup: function() {
				var parser = (new jS.parser);
				parser.lexer.obj = this.obj;
				parser.lexer.handler = $.extend(parser.lexer.handler, jS.cellLookupHandlers);
				
				var args = parser.parse(this.obj.formula);
				var lookupTable = [];
				
				for(var row = args[1].row; row <= args[2].row; row++) {
					for(var col = args[1].col; col <= args[2].col; col++) {
						lookupTable.push({
							sheet: args[0],
							row: row,
							col: col
						});
					}
				}
				
				return lookupTable;
			},
			alertFormulaError: function(msg) {
				alert(
					'cell:' + row + ' ;' + col + '\n' +
					'value: "' + cell.formula + '"\n' + 
					'error: \n' + e
				);
			},
			context: {},
			calcLast: 0,
			calc: function(tableI) { /* harnesses calculations engine's calculation function
												tableI: int, the current table integer;
												fuel: variable holder, used to prevent memory leaks, and for calculations;
											*/
				tableI = (tableI ? tableI : jS.i);
				if (jS.readOnly[tableI]) return; //readonly is no calc at all
				
				jS.log('Calculation Started');
				jS.calcLast = new Date();
				jSE.calc(tableI, jS.spreadsheetsToArray()[tableI], jS.updateCellValue);
				jS.trigger('calculation');
				jS.isSheetEdit = false;
				jS.log('Calculation Ended');
			},
			addSheet: function(size) { /* adds a spreadsheet
											size: string example "10x100" which means 10 columns by 100 rows;
										*/
				size = (size ? size : prompt(jS.msg.newSheet));
				if (size) {
					jS.evt.cellEditAbandon();
					jS.setDirty(true);
					var newSheetControl = jS.controlFactory.sheetUI($.sheet.makeTable.fromSize(size), jS.sheetCount + 1, function(o) {
						jS.setActiveSheet(jS.sheetCount);
					}, true);
					
					jS.trigger('addSheet', [jS.i]);
				}
			},
			deleteSheet: function() { /* removes the currently selected sheet */
				var oldI = jS.i;
				
				jS.obj.barHelper().remove();

				jS.obj.tableControl().remove();
				jS.obj.tabContainer().children().eq(jS.i).remove();
				jS.i = 0;
				jS.sheetCount--;
				
				jS.setControlIds();
				
				jS.setActiveSheet(jS.i);
				jS.setDirty(true);
				
				jS.trigger('deleteSheet', [oldI]);
			},
			deleteRow: function(skipCalc) { /* removes the currently selected row */
				$(jS.getTd(jS.i, jS.rowLast, 1)).parent().remove();
				
				jS.setTdIds();
				
				jS.offsetFormulas({
					row: jS.rowLast,
					col: 0
				}, {
					row: -1,
					col: 0
				});
				
				jS.setDirty(true);
				
				jS.evt.cellEditAbandon();

				jS.sheetSyncSize();
				
				jS.trigger('deleteRow', jS.rowLast);
			},
			deleteColumn: function(skipCalc) { /* removes the currently selected column */
				console.log(jS.colLast);
				if (jS.colLast < 1) return;
				jS.obj.barHelper().remove();
				var col = jS.obj.sheet().find('colgroup col').eq(jS.colLast);
				var colWidth = col.width();
				var sheet = jS.obj.sheet();
				//var sheetWidth = sheet.width() - colWidth;
				col.remove();
				
				var size = jS.sheetSize();
				jS.obj.barTop(jS.colLast).remove();
				for (var i = 1; i <= size.height; i++) {
					$(jS.getTd(jS.i, i, jS.colLast)).remove();
				}
				
				jS.setTdIds();
				
				jS.offsetFormulas({
					row: 0,
					col: jS.colLast
				}, {
					row: 0,
					col: -1
				});
				
				jS.setDirty(true);
				
				jS.evt.cellEditAbandon();
				
				//sheet.width(sheetWidth);

				jS.sheetSyncSize();

				jS.trigger('deleteColumn', jS.colLast);
			},
			sheetTab: function(get) { /* manages a tabs inner value
											get: bool, makes return the current value of the tab;
										*/
				var sheetTab = '';
				if (get) {
					sheetTab = jS.obj.sheet().attr('title');
					sheetTab = (sheetTab ? sheetTab : 'Spreadsheet ' + (jS.i + 1));
				} else if (jS.isSheetEditable() && s.editableTabs) { //ensure that the sheet is editable, then let them change the sheet's name
					var newTitle = prompt("What would you like the sheet's title to be?", jS.sheetTab(true));
					if (!newTitle) { //The user didn't set the new tab name
						sheetTab = jS.obj.sheet().attr('title');
						newTitle = (sheetTab ? sheetTab : 'Spreadsheet' + (jS.i + 1));
					} else {
						jS.setDirty(true);
						jS.obj.sheet().attr('title', newTitle);
						jS.obj.tab().html(newTitle);
						
						sheetTab = newTitle;
					}
				}
				return $('<div />').text(sheetTab).html();
			},
			print: function(o) { /* prints a value in a new window
									o: string, any string;
								*/
				var w = window.open();
				w.document.write("<html><body><xmp>" + o + "\n</xmp></body></html>");
				w.document.close();
			},
			viewSource: function(pretty) { /* prints the source of a sheet for a user to see
												pretty: bool, makes html a bit easier for the user to see;
											*/
				var sheetClone = jS.sheetDecorateRemove(true);
				sheetClone = jS.sheetBarsRemove(sheetClone);
				
				var s = "";
				if (pretty) {
					$(sheetClone).each(function() {
						s += jS.HTMLtoPrettySource(this);
					});
				} else {
					s += $('<div />').html(sheetClone).html();
				}
				
				jS.print(s);
				
				return false;
			},
			saveSheet: function() { /* saves the sheet */
				var v = jS.sheetDecorateRemove(true);
				v = jS.sheetBarsRemove(v);
				var d = $('<div />').html(v).html();

				$.ajax({
					url: s.urlSave,
					type: 'POST',
					data: 's=' + d,
					dataType: 'html',
					success: function(data) {
						jS.setDirty(false);
						jS.trigger('saveSheet');
					}
				});
			},
			HTMLtoCompactSource: function(node) { /* prints html to 1 line
													node: object;
												*/
				var result = "";
				if (node.nodeType == 1) {
					// ELEMENT_NODE
					result += "<" + node.tagName;
					hasClass = false;
					
					var n = node.attributes.length;
					for (var i = 0, hasClass = false; i < n; i++) {
						var key = node.attributes[i].name;
						var val = node.getAttribute(key);
						if (val) {
							if (key == "contentEditable" && val == "inherit") {
								continue;
								// IE hack.
							}
							if (key == "class") {
								hasClass = true;
							}
							
							if (typeof(val) == "string") {
								result += " " + key + '="' + val.replace(/"/g, "'") + '"';
							} else if (key == "style" && val.cssText) {
								result += ' style="' + val.cssText + '"';
							}
						}
					}

					if (node.tagName == "COL") {
						// IE hack, which doesn't like <COL..></COL>.
						result += '/>';
					} else {
						result += ">";
						var childResult = "";
						$(node.childNodes).each(function() {
							childResult += jS.HTMLtoCompactSource(this);
						});
						result += childResult;
						result += "</" + node.tagName + ">";
					}

				} else if (node.nodeType == 3) {
					// TEXT_NODE
					result += node.data.replace(/^\s*(.*)\s*$/g, "$1");
				}
				return result;
			},
			HTMLtoPrettySource: function(node, prefix) {/* prints html to manu lines, formatted for easy viewing
															node: object;
															prefix: string;
														*/
				if (!prefix) {
					prefix = "";
				}
				var result = "";
				if (node.nodeType == 1) {
					// ELEMENT_NODE
					result += "\n" + prefix + "<" + node.tagName;
					var n = node.attributes.length;
					for (var i = 0; i < n; i++) {
						var key = node.attributes[i].name;
						var val = node.getAttribute(key);
						if (val) {
							if (key == "contentEditable" && val == "inherit") {
								continue; // IE hack.
							}
							if (typeof(val) == "string") {
								result += " " + key + '="' + val.replace(/"/g, "'") + '"';
							} else if (key == "style" && val.cssText) {
								result += ' style="' + val.cssText + '"';
							}
						}
					}
					if (node.childNodes.length <= 0) {
						result += "/>";
					} else {
						result += ">";
						var childResult = "";
						var n = node.childNodes.length;
						for (var i = 0; i < n; i++) {
							childResult += jS.HTMLtoPrettySource(node.childNodes[i], prefix + "  ");
						}
						result += childResult;
						if (childResult.indexOf('\n') >= 0) {
							result += "\n" + prefix;
						}
						result += "</" + node.tagName + ">";
					}
				} else if (node.nodeType == 3) {
					// TEXT_NODE
					result += node.data.replace(/^\s*(.*)\s*$/g, "$1");
				}
				return result;
			},
			followMe: function(td) { /* scrolls the sheet to the selected cell
										td: object, td object;
									*/
				td = td || jS.obj.cellActive();
				if (!td.length) return;
				
				var rowWasHidden = false;
				var colWasHidden = false;
				
				if (td.is(':hidden')) {
					jS.scrollRefresh(jS.getTdLocation(td));
					rowWasHidden = true;
				}

				var sheet = jS.obj.sheet(),
					pane = jS.obj.pane(),
					panePos = pane.offset(),
					paneWidth = pane.width(),
					paneHeight = pane.height(),

					tdLoc = jS.getTdLocation(td),
					tdWidth = td.width(),
					tdHeight = td.height();

				var visibleFold = {
					top: panePos.top,
					bottom: panePos.top + paneHeight,
					left: panePos.left,
					right: panePos.left + paneWidth
				};

				var move = true, i = 0, iVert = 0, iHoriz = 0, max = 3, tdPos, tdLocation, directions;
				while (move == true && i < max) {
					td = td;
					move = false;
					tdPos = td.offset();
					tdLocation = {
						top: tdPos.top,
						bottom: tdPos.top + tdHeight,
						left: tdPos.left,
						right: tdPos.left + tdWidth
					};
					directions = {
						up: tdLocation.top < visibleFold.top,
						down: tdLocation.bottom > visibleFold.bottom,
						left: tdLocation.left < visibleFold.left,
						right: tdLocation.right > visibleFold.right
					};

					if (directions.up || directions.down && directions.up != directions.down) {
						jS.evt.scrollVertical.start(pane, sheet);
						jS.evt.scrollVertical.scroll({value: tdLoc.row}, (!directions.down ? iVert : -iVert));
						jS.evt.scrollVertical.stop();
						move = true;
						iVert++;
					}

					if (directions.left || directions.right && directions.left != directions.right) {
						jS.evt.scrollHorizontal.start(pane, sheet);
						jS.evt.scrollHorizontal.scroll({value: tdLoc.col}, (directions.right ? iHoriz : -iHoriz));
						jS.evt.scrollHorizontal.stop();
						move = true;
						iHoriz++;
					}

					i++;
				}

				jS.autoFillerGoToTd(td, tdHeight, tdWidth);
			},
			autoFillerGoToTd: function(td, tdHeight, tdWidth) { /* moves autoFiller to a selected cell
																	td: object, td object;
																	tdHeight: height of a td object;
																	tdWidth: width of a td object;
																*/
				if (!s.autoFiller) return;

				td = td || jS.obj.cellActive();
				tdHeight = tdHeight || td.height();
				tdWidth = tdWidth || td.width();

				if (jS.isTd(td[0])) { //ensure that it is a usable cell
					var tdPos = td.position();
					jS.obj.autoFiller()
						.show()
						.css('top', ((tdPos.top + (tdHeight || td.height()) - 3) + 'px'))
						.css('left', ((tdPos.left + (tdWidth || td.width()) - 3) + 'px'));
				}
			},
			autoFillerHide: function() {
				if (!s.autoFiller) return;

				jS.obj.autoFiller().hide();
			},
			isRowHeightSync: [],
			setActiveSheet: function(i) { /* sets active a spreadsheet inside of a sheet instance 
											i: int, a sheet integer desired to show;
											*/
				i = (i ? i : 0);
				
				if (jS.cellLast.row > 0 || jS.cellLast.col > 0) {
					jS.evt.cellEditDone();
					jS.obj.formula().val('');
				}
				
				jS.obj.tableControlAll().hide().eq(i).show();
				jS.i = i;			
				
				jS.themeRoller.tab.setActive();
				
				if (!jS.isRowHeightSync[i]) { //this makes it only run once, no need to have it run every time a user changes a sheet
					jS.isRowHeightSync[i] = true;
					jS.obj.sheet().find('tr').each(function(j) {
						jS.attrH.setHeight(j, 'cell');
						/*
						fixes a wired bug with height in chrome and ie
						It seems that at some point during the sheet's initializtion the height for each
						row isn't yet clearly defined, this ensures that the heights for barLeft match 
						that of each row in the currently active sheet when a user uses a non strict doc type.
						*/
					});
				}
				
				jS.readOnly[i] = jS.obj.sheet().hasClass('readonly');
				
				jS.sheetSyncSize();
				//jS.replaceWithSafeImg();
			},
			openSheetURL: function ( url ) { /* opens a table object from a url, then opens it
												url: string, location;
											*/
				s.urlGet = url;
				return jS.openSheet();
			},
			openSheet: function(o, reloadBarsOverride) { /* opens a spreadsheet into the active sheet instance \
															o: object, a table object;
															reloadBarsOverride: if set to true, foces bars on left and top not be reloaded;
														*/
				if (!jS.isDirty ? true : confirm(jS.msg.openSheet)) {
					jS.controlFactory.header();
					
					var fnAfter = function(i, l) {
						if (i == l) {
							jS.i = 0;
							jS.setActiveSheet();
							jS.themeRoller.resize();

							jS.trigger('sheetOpened', [i]);

							for (var i = 0; i <= jS.sheetCount; i++) {
								jS.calc(i);
							}
						}
					};
					
					if (!o) {
						$('<div />').load(s.urlGet, function() {
							var sheets = $(this).find('table');
							sheets.each(function(i) {
								jS.controlFactory.sheetUI($(this), i, function() {
									fnAfter(i, sheets.length - 1);
								}, true);
							});
							
							jS.sheetSyncSize();
						});
					} else {
						var sheets = $('<div />').html(o).children('table');
						sheets.show().each(function(i) {
							jS.controlFactory.sheetUI($(this), i,  function() {
								fnAfter(i, sheets.length);
							}, (reloadBarsOverride ? true : false));
						});
					}
					
					jS.setDirty(false);
					
					return true;
				} else {
					return false;
				}
			},
			newSheet: function() { /* creates a new shet from size */
				var size = prompt(jS.msg.newSheet);
				if (size) {
					jS.openSheet($.sheet.makeTable.fromSize(size));
				}
			},
			importRow: function(rowArray) { /* creates a new row and then applies an array's values to each of it's new values
												rowArray: array;
											*/
				jS.controlFactory.addRow(null, null, null);

				var error = "";
				jS.obj.sheet().find('tr:last td').each(function(i) {
					$(this).removeAttr('formula');
					try {
						//To test this, we need to first make sure it's a string, so converting is done by adding an empty character.
						if ((rowArray[i] + '').charAt(0) == "=") {
							$(this).attr('formula', rowArray[i]);
						} else {
							$(this).html(rowArray[i]);
						}
					} catch(e) {
						//We want to make sure that is something bad happens, we let the user know
						error += e + ';\n';
					}
				});
				
				if (error) {//Show them the errors
					alert(error);
				}
				//Let's recalculate the sheet just in case
				jS.setTdIds();
				jS.calc();
			},
			importColumn: function(columnArray) { /* creates a new column and then applies an array's values to each of it's new values
													columnArray: array;
												*/
				jS.controlFactory.addColumn();

				var error = "";
				jS.obj.sheet().find('tr').each(function(i) {
					var o = $(this).find('td:last');
					try {
						//To test this, we need to first make sure it's a string, so converting is done by adding an empty character.
						if ((columnArray[i] + '').charAt(0) == "=") {
							o.attr('formula', columnArray[i]);					
						} else {
							o.html(columnArray[i]);
						}
					} catch(e) {
						//We want to make sure that is something bad happens, we let the user know
						error += e + ';\n';
					}
				});
				
				if (error) {//Show them the errors
					alert(error);
				}
				//Let's recalculate the sheet just in case
				jS.setTdIds();
				jS.calc();
			},
			exportSheet: { /* exports sheets into xml, json, or html formats */
				xml: function (skipCData) {
					var sheetClone = jS.sheetDecorateRemove(true);
					sheetClone = jS.sheetBarsRemove(sheetClone);
							
					var document = "";
					
					var cdata = ['<![CDATA[',']]>'];
					
					if (skipCData) {
						cdata = ['',''];
					}

					$(sheetClone).each(function() {
						var row = '';
						var table = $(this);
						var colCount = 0;
						var col_widths = '';

						table.find('colgroup').children().each(function (i) {
							col_widths += '<c' + i + '>' + ($(this).attr('width') + '').replace('px', '') + '</c' + i + '>';
						});
						
						var trs = table.find('tr');
						var rowCount = trs.length;
						
						trs.each(function(i){
							var col = '';
							
							var tr = $(this);
							var h = tr.attr('height');
							var height = (h ? h : s.colMargin);
							var tds = tr.find('td');
							colCount = tds.length;
							
							tds.each(function(j){
								var td = $(this);
								var colSpan = td.attr('colspan');
								colSpan = (colSpan > 1 ? colSpan : '');
								
								var formula = td.attr('formula');
								var text = (formula ? formula : td.text());
								var cl = td.attr('class');
								var style = td.attr('style');
									
								//Add to current row
								col += '<c' + j +
									(style ? ' style=\"' + style + '\"' : '') + 
									(cl ? ' class=\"' + cl + '\"' : '') + 
									(colSpan ? ' colspan=\"' + colSpan + '\"' : '') +
								'>' + text + '</c' + j + '>';
							});
							
							row += '<r' + i + ' h=\"' + height + '\">' + col + '</r' + i + '>';
						});

						document += '<document title="' + table.attr('title') + '">' +
									'<metadata>' +
										'<columns>' + colCount + '</columns>' +  //length is 1 based, index is 0 based
										'<rows>' + rowCount + '</rows>' +  //length is 1 based, index is 0 based
										'<col_widths>' + col_widths + '</col_widths>' +
									'</metadata>' +
									'<data>' + row + '</data>' +
								'</document>';
					});

					return '<documents>' + document + '</documents>';
				},
				json: function() {
					var sheetClone = jS.sheetDecorateRemove(true);
					sheetClone = jS.sheetBarsRemove(sheetClone);
					var documents = []; //documents
					
					$(sheetClone).each(function() {
						var document = {}; //document
						document['metadata'] = {};
						document['data'] = {};
						
						var table = $(this);
						
						var trs = table.find('tr');
						var rowCount = trs.length;
						var colCount = 0;
						var col_widths = '';
						
						trs.each(function(i) {
							var tr = $(this);
							var tds = tr.find('td');
							colCount = tds.length;
							
							document['data']['r' + i] = {};
							document['data']['r' + i]['h'] = tr.attr('height');
							
							tds.each(function(j) {
								var td = $(this);
								var colSpan = td.attr('colspan');
								colSpan = (colSpan > 1 ? colSpan : null);
								var formula = td.attr('formula');

								document['data']['r' + i]['c' + j] = {
									'value': (formula ? formula : td.text()),
									'style': td.attr('style'),
									'colspan': colSpan,
									'cl': td.attr('class')
								};
							});
						});
						document['metadata'] = {
							'columns': colCount, //length is 1 based, index is 0 based
							'rows': rowCount, //length is 1 based, index is 0 based
							'title': table.attr('title'),
							'col_widths': {}
						};
						
						table.find('colgroup').children().each(function(i) {
							document['metadata']['col_widths']['c' + i] = ($(this).attr('width') + '').replace('px', '');
						});
						
						documents.push(document); //append to documents
					});
					return documents;
				},
				html: function() {
					var sheetClone = jS.sheetDecorateRemove(true);
					sheetClone = jS.sheetBarsRemove(sheetClone);
					return sheetClone;
				}
			},
			sheetSyncSizeToCols: function(o) { /* syncs a sheet's size from it's col objects
													o: object, sheet object;
												*/
				var newSheetWidth = 0;
				o = (o ? o : jS.obj.sheet());
				o.find('colgroup col').each(function() {
					newSheetWidth += $(this).width();
				});
				o.width(newSheetWidth);
			},
			sheetSyncSize: function() { /* syncs a sheet's size to that of the $().sheet() caller object */
				var h = s.height;
				if (!h) {
					h = 400; //Height really needs to be set by the parent
				} else if (h < 200) {
					h = 200;
				}
				s.parent
					.height(h)
					.width(s.width);
					
				var w = s.width - jS.attrH.width(jS.obj.barLeftParent()) - (s.boxModelCorrection);
				
				h = h - jS.attrH.height(jS.obj.controls()) - jS.attrH.height(jS.obj.barTopParent()) - (s.boxModelCorrection * 3);
				
				jS.obj.pane()
					.height(h - window.scrollerSize.height)
					.width(w - window.scrollerSize.width)
					.parent()
						.width(w);
				
				jS.obj.sheetPaneTd()
					.height(h)
					.width(w);
					
				jS.obj.ui()
					.width(w + jS.attrH.width(jS.obj.barLeftParent()));
						
				jS.obj.barLeftParent()
					.height(h);
				
				jS.obj.barTopParent()
					.width(w)
					.parent()
						.width(w);

				jS.obj.scrollerMaster().find('div')
					.height(jS.obj.sheet().height())
					.width(jS.obj.sheet().width());
			},
			cellChangeStyle: function(style, value) { /* changes a cell's style and makes it undoable/redoable
														style: string, css style name;
														value: string, css setting;
													*/
				jS.cellUndoable.add(jS.obj.cellHighlighted()); //save state, make it undoable
				jS.obj.cellHighlighted().css(style, value);
				jS.cellUndoable.add(jS.obj.cellHighlighted()); //save state, make it redoable

			},
			cellFind: function(v) { /* finds a cell in a sheet from a value
										v: string, value in a cell to find;
									*/
				if(!v) {
					v = prompt("What are you looking for in this spreadsheet?");
				}
				if (v) {//We just do a simple uppercase/lowercase search.
					var o = jS.obj.sheet().find('td:contains("' + v + '")');
					
					if (o.length < 1) {
						o = jS.obj.sheet().find('td:contains("' + v.toLowerCase() + '")');
					}
					
					if (o.length < 1) {
						o = jS.obj.sheet().find('td:contains("' + v.toUpperCase() + '")');
					}
					
					o = o.eq(0);
					if (o.length > 0) {
						jS.cellEdit(o);
					} else {
						alert(jS.msg.cellFind);
					}
				}
			},
			cellSetActiveBar: function(type, start, end) { /* sets a bar active
																type: string, "col" || "row" || "all";
																start: int, int to start highlighting from;
																start: int, int to end highlighting to;
															*/
				var size = jS.sheetSize();
				var first = (start < end ? start : end);
				var last = (start < end ? end : start);
				
				var setActive = function(td, rowStart, colStart, rowFollow, colFollow) {
					switch (s.cellSelectModel) {
						case 'oo': //follow cursor behavior
							jS.cellEdit($(jS.getTd(jS.i, rowFollow, colFollow)));
							break;
						default: //stay at initial cell
							jS.cellEdit($(jS.getTd(jS.i, rowStart, colStart)));
							break;
					}
					
					setActive = function(td) { //save resources
						return td;
					};
					
					return td;
				};

				var cycleFn;

				var td = [];
				
				switch (type) {
					case 'top':
						cycleFn = function() {
							for (var i = 1; i <= size.height; i++) { //rows
								for (var j = first; j <= last; j++) { //cols
									td.push(jS.getTd(jS.i, i, j));
									jS.themeRoller.cell.setHighlighted(setActive(td[td.length - 1], 1, start, 1, end));
								}
							}
						};
						break;
					case 'left':
						cycleFn = function() {
							for (var i = first; i <= last; i++) { //rows
								for (var j = 1; j <= size.width; j++) { //cols
									td.push(jS.getTd(jS.i, i, j));
									jS.themeRoller.cell.setHighlighted(setActive(td[td.length - 1], start, 1, end, 1));
								}
							}
						};
						break;
					case 'corner': //all
						cycleFn = function() {
							setActive = function(td) {
								jS.cellEdit($(td));
								setActive = function() {};
							};
							for (var i = 1; i <= size.height; i++) {
								for (var j = 1; j <= size.width; j++) {
									td.push(jS.getTd(jS.i, i, j));
									setActive(td[td.length - 1]);
									jS.themeRoller.cell.setHighlighted(td[td.length - 1]);
								}
							}
							first = {row: 1,col: 1};
							last = {
								row: size.height,
								col: size.width
							}
						};
						break;
				}
				
				cycleFn();
				
				jS.highlightedLast.td = td;
				jS.highlightedLast.rowStart = first.row;
				jS.highlightedLast.colStart = first.col;
				jS.highlightedLast.rowEnd = last.row;
				jS.highlightedLast.colEnd = last.col;
			},
			getTdRange: function(e, v, newFn, notSetFormula) { /* gets a range of selected cells, then returns it */
				jS.cellLast.isEdit = true;
				
				var range = function(loc) {
					if (loc.first.col > loc.last.col ||
						loc.first.row > loc.last.row
					) {
						return {
							first: jSE.parseCellName(loc.last.col, loc.last.row),
							last: jSE.parseCellName(loc.first.col, loc.first.row)
						};
					} else {
						return {
							first: jSE.parseCellName(loc.first.col, loc.first.row),
							last: jSE.parseCellName(loc.last.col, loc.last.row)
						};
					}
				};
				var label = function(loc) {
					var rangeLabel = range(loc);
					var v2 = v + '';
					v2 = (v2.match(/=/) ? v2 : '=' + v2); //make sure we can use this value as a formula
					
					if (newFn || v2.charAt(v2.length - 1) != '(') { //if a function is being sent, make sure it can be called by wrapping it in ()
						v2 = v2 + (newFn ? newFn : '') + '(';
					}
					
					var formula;
					var lastChar = '';
					if (rangeLabel.first != rangeLabel.last) {
						formula = rangeLabel.first + ':' + rangeLabel.last;
					} else {
						formula = rangeLabel.first;
					}
					
					if (v2.charAt(v2.length - 1) == '(') {
						lastChar = ')';
					}
					
					return v2 + formula + lastChar;
				};
				var newVal = '';
				
				if (e) { //if from an event, we use mousemove method
					var loc = {
						first: jS.getTdLocation([e.target])
					};
					
					var sheet = jS.obj.sheet().mousemove(function(e) {
						loc.last = jS.getTdLocation([e.target]);
						
						newVal = label(loc);
						
						if (!notSetFormula) {
							jS.obj.formula().val(newVal);
							jS.obj.inPlaceEdit().val(newVal);
						}
					});
					
					$document.one('mouseup', function() {
						sheet.unbind('mousemove');
						return newVal;
					});
				} else {
					var cells = jS.obj.cellHighlighted().not(jS.obj.cellActive());
					
					if (cells.length) {
						var loc = { //tr/td column and row index
							first: jS.getTdLocation(cells.first()),
							last: jS.getTdLocation(cells.last())
						};
						
						newVal = label(loc);
						
						if (!notSetFormula) {
							jS.obj.formula().val(newVal);
							jS.obj.inPlaceEdit().val(newVal);
						}
						
						return newVal;
					} else {
						return '';
					}
				}
			},
			getTdId: function(tableI, row, col) { /* makes a td if from values given
													tableI: int, table integer;
													row: int, row integer;
													col: int, col integer;
												*/
				return I + '_table' + tableI + '_cell_c' + col + '_r' + row;
			},
			getTd: function(tableI, row, col) { /* gets a td
													tableI: int, table integer;
													row: int, row integer;
													col: int, col integer;
												*/
				return document.getElementById(jS.getTdId(tableI, row, col));
			},
			getTdLocation: function(td) { /* gets td column and row int
												td: object, td object;
											*/
				var result = {col: 0, row: 0};
				if (!td && !td[0]) return result;

				if (td[0]) {
					return {
						col: parseInt(td[0].cellIndex),
						row: parseInt(td[0].parentNode.rowIndex)
					};
				} else {
					if (!td.cellIndex) return result;
					return {
						col: parseInt(td.cellIndex),
						row: parseInt(td.parentNode.rowIndex)
					};
				}
			},
			getTdFromXY: function(left, top) { /* gets cell from point
																left: int, pixels left;
																top: int, pixels top;
															*/
				var pane = jS.obj.pane();
				var paneOffset = pane.offset();
				
				top += paneOffset.top;
				left += paneOffset.left;
				
				//here we double check that the coordinates are inside that of the pane, if so then we can continue
				if (
						(
							top >= paneOffset.top && 
							top <= paneOffset.top + pane.height()
						)
							&&
						(
							left >= paneOffset.left && 
							left <= paneOffset.left + pane.width()
						)
				) {
					var td = document.elementFromPoint(left, top);
					
					//I use this snippet to help me know where the point was positioned
					/*jQuery('<div class="ui-widget-content" style="position: absolute;">TESTING TESTING</div>')
						.css('top', top + 'px')
						.css('left', left + 'px')
						.appendTo('body');
					*/
					
					if (jS.isTd(td)) {
						return td;
					}
					return false;
				}
			},
			getBarIndex: {
				left: function(o) {/* get's index from object */
					var i = $.trim($(o).text());
					if (isNaN(i)) {
						return 0;
					} else {
						return i;
					}
				},
				top: function(o) {/* get's index from object */
					var v = $.trim($(o).text());
					if (!v) return 0;
					
					var i = jSE.columnLabelIndex(v);
					i = parseInt(i);
					
					if (isNaN(i)) {
						return 0;
					} else {
						return i;
					}
				},
				corner: function() {
					return 0;
				}
			},
			EMPTY_VALUE: {},
			time: { /* time loggin used with jS.log, useful for finding out if new methods are faster */
				now: new Date(),
				last: new Date(),
				diff: function() {
					return Math.abs(Math.ceil(this.last.getTime() - this.now.getTime()) / 1000).toFixed(5);
				},
				set: function() {
					this.last = this.now;
					this.now = new Date();
				},
				get: function() {
					return this.now.getHours() + ':' + this.now.getMinutes() + ':' + this.now.getSeconds();
				}
			},
			log: function(msg) {  //The log prints: {Current Time}, {Seconds from last log};{msg}
				jS.time.set();
				console.log(jS.time.get() + ', ' + jS.time.diff() + '; ' + msg);
			},
			replaceWithSafeImg: function(o) {  //ensures all pictures will load and keep their respective bar the same size.
				(o ? o : jS.obj.sheet().find('img')).each(function() {			
					var src = $(this).attr('src');
					$(this).replaceWith(jS.controlFactory.safeImg(src, jS.getTdLocation($(this).parent()).row));
				});
			},
			
			isDirty:  false,
			setDirty: function(dirty) { jS.isDirty = dirty; },
			appendToFormula: function(v, o) {
				var formula = jS.obj.formula();
				
				var fV = formula.val();
				
				if (fV.charAt(0) != '=') {
					fV = '=' + fV;
				}
				
				formula.val(fV + v);
			},
			cellUndoable: { /* makes cell editing undoable and redoable
								there should always be 2 cellUndoable.add()'s every time used, one to save the current state, the second to save the new
							*/
				undoOrRedo: function(undo) {
					//hide the autoFiller, it can get confused
					jS.autoFillerHide();
					
					if (undo && this.i > 0) {
						this.i--;
						this.i--;
					} else if (!undo && this.i < this.stack.length) {
						this.i++;
						this.i++;
					}
					
					this.get().clone().each(function() {
						var o = $(this);
						var id = o.attr('undoable');
						if (id) {
							$('#' + id).replaceWith(
								o
									.removeAttr('undoable')
									.attr('id', id)
							);
						} else {
							jS.log('Not available.');
						}
					});
					
					jS.themeRoller.cell.clearActive();
					jS.themeRoller.bar.clearActive();
					jS.themeRoller.cell.clearHighlighted();
					
					jS.calc();
				},
				get: function() { //gets the current cell
					return $(this.stack[this.i]);
				},
				add: function(tds) {
					var oldTds = tds.clone().each(function() {
						var o = $(this);
						var id = o.attr('id');
						if (!id) return;
						o
							.removeAttr('id') //id can only exist in one location, on the sheet, so here we use the id as the attr 'undoable'
							.attr('undoable', id)
							.removeClass(jS.cl.cellHighlighted + ' ' + jS.cl.uiCellHighlighted);
					});
					
					this.stack[this.i++] = oldTds;
						
					if (this.stack.length > this.i) {
						for (var i = this.stack.length; i > this.i; i--) {
							this.stack.pop();
						}
					}
					
					
					if (this.stack.length > 20) { //undoable count, we want to be careful of too much memory consumption
						this.stack.shift(); //drop the first value
					}
						
				},
				i: 0,
				stack: []
			},
			cols: function(o) {
				o = o || jS.obj.sheet();

				//table / colgroup / col
				if (!o[0]) return [];
				if (!o[0].children) return [];
				if (!o[0].children[0]) return [];
				if (!o[0].children[0].children) return [];

				return o[0].children[0].children
			},
			col: function(o, eq) {
				o = o || jS.obj.sheet();

				var cols = jS.cols(o);

				if (eq === undefined) {
					eq = cols.length - 1;
				}

				return cols[eq];
			},
			rowCells: function(o, row) {
				o = o || jS.obj.sheet();
				if (!o[0].children) return {}; //table
				if (!o[0].children[1]) return {}; //tbody
				if (!o[0].children[1].children) return {}; //tr

				if (row == undefined) {
					row = o[0].children[1].children.length - 1;
				}

				if (!o[0].children[1].children[row]) return {}; //tr
				if (!o[0].children[1].children[row].children) return {}; //td

				return o[0].children[1].children[row].children;
			},
			sheetSize: function(o) {
				o = o || jS.obj.sheet();
				//table / tbody / tr / td
				var result = {
					width: 0,
					height: 0
				};


				var lastRow = jS.rowCells(o);
				var loc = jS.getTdLocation(lastRow[lastRow.length - 1]);
				return {
					width: loc.col,
					height: loc.row
				};
			},
			toggleState:  function(replacementSheets) {
				if (s.allowToggleState) {
					if (s.editable) {
						jS.evt.cellEditAbandon();
						jS.saveSheet();
					}
					jS.setDirty(false);
					s.editable = !s.editable;
					jS.obj.tabContainer().remove();
					var sheets = (replacementSheets ? replacementSheets : jS.obj.sheetAll().clone());
					origParent.children().remove();
					jS.openSheet(sheets, true);
				}
			},
			setCellRef: function(ref) {
				var td = jS.obj.cellActive();
				loc = jS.getTdLocation(td);
				
				cellRef = (ref ? ref : prompt('Enter the name you would like to reference the cell by.'));
				
				if (cellRef) {
					jS.spreadsheets[cellRef] = jS.spreadsheets[jS.i][loc.row][loc.col];
				}
				
				jS.calc();
			},
			buildSheet: function() {
				if (jS.s.buildSheet) {//override urlGet, this has some effect on how the topbar is sized
					if (typeof(jS.s.buildSheet) == 'object') {
						return jS.s.buildSheet;
					} else if (jS.s.buildSheet == true || jS.s.buildSheet == 'true') {
						return $(jS.s.origHtml);
					} else if (jS.s.buildSheet.match(/x/i)) {
						return $.sheet.makeTable.fromSize(jS.s.buildSheet);
					}
				}
			}
		};
		
		if (!window.scrollerSize) {
			window.scrollerSize = jQuery.sheet.getScrollBarSize();
		}

		var $window = $(window),
			$document = $(document),
			$body = $('body'),
			emptyFN = function() {};
		
		//ready the sheet's parser
		jS.lexer = function() {};
		jS.lexer.prototype = parser.lexer;
		jS.parser = function() {
			this.lexer = new jS.lexer();
			this.yy = {};
		};
		jS.parser.prototype = parser;
		
		jS.Parser = new jS.parser;
		
		//We need to take the sheet out of the parent in order to get an accurate reading of it's height and width
		//jQuery(this).html(s.loading);
		s.origParent = origParent;
		s.origHtml = origParent.html();
		s.parent
			.html('')
			.addClass(jS.cl.parent);
		
		origParent
			.unbind('switchSpreadsheet')
			.bind('switchSpreadsheet', function(e, js, i){
				jS.switchSpreadsheet(i);
			})
			.unbind('renameSpreadsheet')
			.bind('renameSpreadsheet', function(e, js, i){
				jS.renameSpreadsheet(i);
			});
		
		//Use the setting height/width if they are there, otherwise use parent's
		s.width = (s.width ? s.width : s.parent.width());
		s.height = (s.height ? s.height : s.parent.height());
		
		
		// Drop functions if they are not needed & save time in recursion
		if (!s.log) {
			jS.log = emptyFN;
		}
		
		if (!$.ui || !s.resizable) {
			jS.resizable = jS.draggable = emptyFN;
		}
		
		if (!$.support.boxModel) {
			s.boxModelCorrection = 0;
		}
		
		if (!s.barMenus) {
			jS.controlFactory.barMenuTop = jS.controlFactory.barMenuLeft = emptyFN;
		}
		
		if (!s.freezableCells) {
			jS.controlFactory.barHandle.top = jS.controlFactory.barHandle.left = emptyFN;
		}
		
		if (s.calcOff) {
			jS.calc = emptyFN;
		}
		
		if (!window.Raphael) {
			jSE.chart = emptyFN;
		}
		
		//jS.log('Startup');
		
		$window
			.resize(function() {
				if (jS) { //We check because jS might have been killed
					s.width = s.parent.width();
					s.height = s.parent.height();
					jS.sheetSyncSize();
				}
			});
		
		
		if ($.sheet.fn) { //If the new calculations engine is alive, fill it too, we will remove above when no longer needed.
			//Extend the calculation engine plugins
			$.sheet.fn = $.extend($.sheet.fn, s.calculations);
		
			//Extend the calculation engine with advanced functions
			if ($.sheet.advancedfn) {
				$.sheet.fn = $.extend($.sheet.fn, $.sheet.advancedfn);
			}
		
			//Extend the calculation engine with finance functions
			if ($.sheet.financefn) {
				$.sheet.fn = $.extend($.sheet.fn, $.sheet.financefn);
			}
		}
		
		if (!s.alertFormulaErrors) {
			jS.alertFormulaError = emptyFN;
		}

		if (!s.allowCellsLineBreaks) {
			origParent.addClass('noBreak');
		}
		
		jS.s = s;
		jS.openSheet(jS.buildSheet(), s.forceColWidthsOnStartup);
		
		return jS;
	},
	makeTable : {
		xml: function (data) { /* creates a table from xml, note: will not accept CDATA tags
								data: object, xml object;
								*/
			var tables = jQuery('<div />');
		
			jQuery(data).find('document').each(function(i) { //document
				var table = jQuery('<table />');
				var tableWidth = 0;
				var colgroup = jQuery('<colgroup />').appendTo(table);
				var tbody = jQuery('<tbody />');
			
				var metaData = jQuery(this).find('metadata');
				var columnCount = metaData.find('columns').text();
				var rowCount = metaData.find('rows').text();
				var title = jQuery(this).attr('title');
				var data = jQuery(this).find('data');
				var col_widths = metaData.find('col_widths').children();
				
				//go ahead and make the cols for colgroup
				for (var i = 0; i < parseInt(jQuery.trim(columnCount)); i++) {
					var w = parseInt(col_widths.eq(i).text().replace('px', ''));
					w = (w ? w : 120); //if width doesn't exist, grab default
					tableWidth += w;
					colgroup.append('<col width="' + w + 'px" style="width: ' + w + 'px;" />');
				}
				
				table
					.width(tableWidth)
					.attr('title', title);
				
				for (var i = 0; i < rowCount; i++) { //rows
					var tds = data.find('r' + i);
					var height = (data.attr('h') + '').replace('px', '');
					height = parseInt(height);
					
					var thisRow = jQuery('<tr height="' + (height ? height : 18) + 'px" />');
					
					for (var j = 0; j < columnCount; j++) { //cols, they need to be counted because we don't send them all on export
						var newTd = '<td />'; //we give td a default empty td
						var td = tds.find('c' + j);
						
						if (td) {
							var text = td.text() + '';
							var cl = td.attr('class');
							var style = td.attr('style');
							var colSpan = td.attr('colspan');

							
							var formula = '';
							if (text.charAt(0) == '=') {
								formula = ' formula="' + text + '"';
							}
							
							newTd = '<td' + formula + 
								(style ? ' style=\"' + style + '\"' : '') + 
								(cl ? ' class=\"' + cl + '\"' : '') +
								(colSpan ? ' colspan=\"' + colSpan + '\"' : '') +
								(height ? ' height=\"' + height + 'px\"' : '') +
							'>' + text + '</td>';
						}
						thisRow.append(newTd);
					}	
					tbody.append(thisRow);
				}
				table
					.append(tbody)
					.appendTo(tables);
			});
			
			return tables.children();
		},
		json: function(data, makeEval) { /* creates a sheet from json data, for format see top
											data: json;
											makeEval: bool, if true evals json;
										*/
			sheet = (makeEval == true ? eval('(' + data + ')') : data);
			
			var tables = jQuery('<div />');
			
			sheet = (jQuery.isArray(sheet) ? sheet : [sheet]);
			
			for (var i = 0; i < sheet.length; i++) {
				var colCount = parseInt(sheet[i].metadata.columns);
				var rowCount = parseInt(sheet[i].metadata.rows);
				title = sheet[i].metadata.title;
				title = (title ? title : "Spreadsheet " + i);
			
				var table = jQuery("<table />");
				var tableWidth = 0;
				var colgroup = jQuery('<colgroup />').appendTo(table);
				var tbody = jQuery('<tbody />');
				
				//go ahead and make the cols for colgroup
				if (sheet[i]['metadata']['col_widths']) {
					for (var x = 0; x < colCount; x++) {
						var w = 120;
						if (sheet[i]['metadata']['col_widths']['c' + x]) {
							var newW = parseInt(sheet[i]['metadata']['col_widths']['c' + x].replace('px', ''));
							w = (newW ? newW : 120); //if width doesn't exist, grab default
							tableWidth += w;
						}
						colgroup.append('<col width="' + w + 'px" style="width: ' + w + 'px;" />');
					}
				}
				
				table
					.attr('title', title)
					.width(tableWidth);
				
				for (var x = 0; x < rowCount; x++) { //tr
					var tr = jQuery('<tr />').appendTo(table);
					tr.attr('height', (sheet[i]['data']['r' + x].h ? sheet[i]['data']['r' + x].h : 18));
					
					for (var y = 0; y < colCount; y++) { //td
						var cell = sheet[i]['data']['r' + x]['c' + y];
						var cur_val;
						var colSpan;
						var style;
						var cl;
						
						if (cell) {
							cur_val = cell.value + '';
							colSpan = cell.colSpan + '';
							style = cell.style + '';
							cl = cell.cl + '';
						}

						var cur_td = jQuery('<td' + 
								(style ? ' style=\"' + style + '\"' : '' ) + 
								(cl ? ' class=\"' + cl + '\"' : '' ) + 
								(colSpan ? ' colspan=\"' + colSpan + '\"' : '' ) + 
							' />');
						try {
							if(typeof(cur_val) == "number") {
								cur_td.html(cur_val);
							} else {
								if (cur_val.charAt(0) == '=') {
									cur_td.attr("formula", cur_val);
								} else {
									cur_td.html(cur_val);
								}
							}
						} catch (e) {}
					
						tr.append(cur_td);

					}
				}
				
				tables.append(table);
			}
			return tables.children();
		},
		fromSize: function(size, h, w) { /* creates a spreadsheet object from a size given 
											size: string, example "10x100" which means 10 columns by 100 rows;
											h: int, height for each new row;
											w: int, width of each new column;
										*/
			if (!size) {
				size = "5x10";
			}
			size = size.toLowerCase().split('x');

			var columnsCount = parseInt(size[0]);
			var rowsCount = parseInt(size[1]);
			
			//Create elements before loop to make it faster.
			var newSheet = jQuery('<table />');
			var standardTd = '<td></td>';
			var tds = '';
			
			//Using -- is many times faster than ++
			for (var i = columnsCount; i >= 1; i--) {
				tds += standardTd;
			}

			var standardTr = '<tr' + (h ? ' height="' + h + 'px" style="height: ' + h + 'px;"' : '') + '>' + tds + '</tr>';
			var trs = '';
			for (var i = rowsCount; i >= 1; i--) {
				trs += standardTr;
			}
			
			newSheet.html('<tbody>' + trs + '</tbody>');
			
			if (w) {
				newSheet.width(columnsCount * w);
			}
			
			return newSheet;
		}
	},
	killAll: function() { /* removes all sheets */
		if (jQuery.sheet) {
			if (jQuery.sheet.instance) {
				for (var i = 0; i < jQuery.sheet.instance.length; i++) {
					if (jQuery.sheet.instance[i]) {
						if (jQuery.sheet.instance[i].kill) {
							jQuery.sheet.instance[i].kill();
						}
					}
				}
			}
		}
	},
	paneScrollLocker: function(e, jS) { //This can be used with setting fnPaneScroll to lock all loaded sheets together when scrolling, useful in history viewing
		var pane = jS.obj.pane();
		
		jQuery(jQuery.sheet.instance).each(function(i) {
			if (jS.I == i) return;
			
			this.obj.pane()
				.scrollLeft(pane.scrollLeft())
				.scrollTop(pane.scrollTop());
		});
	},
	switchSheetLocker: function(e, jS) { //This can be used with event switchSheet to locks sheets together when switching, useful in history viewing
		jQuery(jQuery.sheet.instance).each(function(i) {
			if (jS.I == i) return;
			
			this.setActiveSheet(jS.i);
		});
	},
	I: function() {
		var I = 0;
		if ( this.instance ) {
			I = (this.instance.length === 0 ? 0 : this.instance.length - 1); //we use length here because we havent yet created sheet, it will append 1 to this number thus making this the effective instance number
		} else {
			this.instance = [];
		}
		return I;
	},
	getScrollBarSize: function() {
		var inner = $('<p></p>').css({
			width:'100%',
			height:'100%'
		});
		var outer = $('<div></div>').css({
			position:'absolute',
			width:'100px',
			height:'100px',
			top:'0',
			left:'0',
			visibility:'hidden',
			overflow:'hidden'
		}).append(inner);

		jQuery(document.body).append(outer);

		var w1 = inner.width(),
			h1 = inner.height();
		
		outer.css('overflow','scroll');
		
		var w2 = inner.width(),
			h2 = inner.height();
			
		if (w1 == w2 && outer[0].clientWidth) {
			w2 = outer[0].clientWidth;
		}
		if (h1 == h2 && outer[0].clientHeight) {
			h2 = outer[0].clientHeight;
		}

		outer.detach();

		return {
			width: w1 - w2,
			height: h1 - h2
		};
	}
};

var jSE = jQuery.sheet.engine = { //Formula Engine
	calc: function(tableI, spreadsheets, ignite, freshCalc) { //spreadsheets are array, [spreadsheet][row][cell], like A1 = o[0][0][0];
		for (var j = 1; j < spreadsheets.length; j++) {
			for (var k = 1; k < spreadsheets[j].length; k++) {
				spreadsheets[j][k].calcCount = 0;
			}
		}
		
		for (var j = 1; j < spreadsheets.length; j++) {
			for (var k = 1; k < spreadsheets[j].length; k++) {
				ignite(tableI, j, k);
			}
		}
	},
	parseLocation: function(locStr) { // With input of "A1", "B4", "F20", will return {row: 0,col: 0}, {row: 3,col: 1}, {row: 19,col: 5}.
		for (var firstNum = 0; firstNum < locStr.length; firstNum++) {
			if (locStr.charCodeAt(firstNum) <= 57) {// 57 == '9'
				break;
			}
		}
		return {
			row: parseInt(locStr.substring(firstNum)), 
			col: jSE.columnLabelIndex(locStr.substring(0, firstNum))
		};
	},
	parseSheetLocation: function(locStr) {
		return ((locStr + '').replace('SHEET','') * 1) - 1;
	},
	parseCellName: function(col, row){
		return jSE.columnLabelString(col) + (row);
	},
	labels: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	columnLabelIndex: function(str) {
		// Converts A to 1, B to 2, Z to 26, AA to 27

		var num = 0,
			str = str.toUpperCase();

		for (var i = 0; i < str.length; i++) {
			var digit = this.labels.indexOf(str[i]);
			num = (num * 26) + digit;
		}
		return (num >= 0 ? num : 0) + 1;
	},
	indexes: [],
	columnLabelString: function(index) {//1 = A, 2 = B
		if (!this.indexes.length) { //cache the indexes to save on processing
			var s = '', i, j, k, l;
			i = j = k = -1;
			for (l = 1; l < 16385; ++l) {
				s = '';
				++k;
				if (k == 26) {
					k = 0;
					++j;
					if (j == 26) {
						j = 0;
						++i;
					}
				}
				if (i >= 0) s += this.labels[i];
				if (j >= 0) s += this.labels[j];
				if (k >= 0) s += this.labels[k];
				this.indexes[l] = s;
			}
		}

		return this.indexes[index];
	},
	regEx: {
		n: 			/[\$,\s]/g,
		cell: 			/\$?([a-zA-Z]+)\$?([0-9]+)/gi, //a1
		range: 			/\$?([a-zA-Z]+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+)/gi, //a1:a4
		remoteCell:		/\$?(SHEET+)\$?([0-9]+)[:!]\$?([a-zA-Z]+)\$?([0-9]+)/gi, //sheet1:a1
		remoteCellRange: 	/\$?(SHEET+)\$?([0-9]+)[:!]\$?([a-zA-Z]+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+)/gi, //sheet1:a1:b4
		sheet:			/SHEET/i,
		amp: 			/&/g,
		gt: 			/</g,
		lt: 			/>/g,
		nbsp: 			/&nbsp;/g
	},
	chart: function(o) { /* creates a chart for use inside of a cell
													piggybacks RaphealJS
							options:
								type

								data
								legend
								title
								x {data, legend}

								y {data, legend}
								owner
												*/
		var jS = this.jS,
			owner = this;
		
		function sanitize(v, toNum) {
			if (!v) {
				if (toNum) {
					v = 0;
				} else {
					v = "";
				}
			} else {
				if (toNum) {
					v = arrHelpers.toNumbers(v);
				} else {
					v = arrHelpers.flatten(v);
				}
			}
			return v;
		}

		o = jQuery.extend({
			x: { legend: "", data: [0]},
			y: { legend: "", data: [0]},
			title: "",
			data: [0],
			legend: "",
			cell: jQuery(jS.getTd(this.sheet, this.row, this.col)),
			chart: jQuery('<div class="' + jS.cl.chart + '" />')
				.mousedown(function() {
					o.cell.mousedown();
				}),
			gR: {}
		}, o);
	
		o.data = sanitize(o.data, true);
		o.x.data = sanitize(o.x.data, true);
		o.y.data = sanitize(o.y.data, true);
		o.legend = sanitize(o.legend);
		o.x.legend = sanitize(o.x.legend);
		o.y.legend = sanitize(o.y.legend);
	
		o.legend = (o.legend ? o.legend : o.data);

		this.s.origParent.one('calculation', function() {
			var width = o.chart.width();
			var height = o.chart.height();
			var r = Raphael(o.chart[0]);			
			if (o.title) r.text(width / 2, 10, o.title).attr({"font-size": 20});
			switch (o.type) {
			case "bar":
				o.gR = r.barchart(width / 8, height / 8, width * 0.8, height * 0.8, o.data, o.legend)
					.hover(function () {
						this.flag = r.popup(
							this.bar.x,
							this.bar.y,
							this.bar.value || "0"
						).insertBefore(this);
					},function () {
						this.flag.animate({
							opacity: 0
							},300, 

							function () {
								this.remove();
								}
							);
					});
				break;
			case "hbar":
				o.gR = r.hbarchart(width / 8, height / 8, width * 0.8, height * 0.8, o.data, o.legend)
					.hover(function () {
						this.flag = r.popup(this.bar.x, this.bar.y, this.bar.value || "0").insertBefore(this);
					},function () {
						this.flag.animate({
							opacity: 0
							},300, 
							function () {
								this.remove();
								}
							);
					});
				break;
			case "line":
				o.gR = r.linechart(width / 8, height / 8, width * 0.8, height * 0.8, o.x.data, o.y.data, {
					nostroke: false, 
					axis: "0 0 1 1", 
					symbol: "circle", 
					smooth: true
				})
				.hoverColumn(function () {
					this.tags = r.set();
					if (this.symbols.length) {
						for (var i = 0, ii = this.y.length; i < ii; i++) {
							this.tags.push(
								r
									.tag(this.x, this.y[i], this.values[i], 160, 10)
									.insertBefore(this)
									.attr([{ fill: "#fff" }, { fill: this.symbols[i].attr("fill") }])
							);
						}
					}
				}, function () {
					this.tags && this.tags.remove();
				});

				break;
			case "pie":
				o.gR = r.piechart(width / 2, height / 2, (width < height ? width : height) / 2, o.data, {legend: o.legend})
					.hover(function () {
						this.sector.stop();
						this.sector.scale(1.1, 1.1, this.cx, this.cy);

						if (this.label) {
							this.label[0].stop();
							this.label[0].attr({ r: 7.5 });
							this.label[1].attr({ "font-weight": 800 });
						}
					}, function () {
						this.sector.animate({ transform: 's1 1 ' + this.cx + ' ' + this.cy }, 500, "bounce");

						if (this.label) {
							this.label[0].animate({ r: 5 }, 500, "bounce");
							this.label[1].attr({ "font-weight": 400 });
						}
					});
				break;
			case "dot":
				o.gR = r.dotchart(width / 8, height / 8, width * 0.8, height * 0.8, o.x.data, o.y.data, o.data, {
					symbol: "o",
					max: 10,
					heat: true,
					axis: "0 0 1 1",
					axisxstep: o.x.data.length - 1,
					axisystep: o.y.data.length - 1,
					axisxlabels: (o.x.legend ? o.x.legend : o.x.data),
					axisylabels: (o.y.legend ? o.y.legend : o.y.data),
					axisxtype: " ",
					axisytype: " "
				})
					.hover(function () {
						this.marker = this.marker || r.tag(this.x, this.y, this.value, 0, this.r + 2).insertBefore(this);
						this.marker.show();
					}, function () {
						this.marker && this.marker.hide();
					});

				break;
			}

			o.gR
				.mousedown(function() {
					o.cell.mousedown().mouseup();
				});

			o.chart.mousemove(function() {
				o.cell.mousemove();
				return false;
			});

			jS.attrH.setHeight(owner.row, 'cell', false);
		});
		
		return o.chart;
	}
};

var jFN = jQuery.sheet.fn = {//fn = standard functions used in cells
	//information functions
	ISNUMBER: function(v) {
		if (!isNaN(v)) {
			return jFN.TRUE();
		}
		return jFN.FALSE();
	},
	N: function(v) {
		if (v == null) {return 0;}
		if (v instanceof Date) {return v.getTime();}
		if (typeof(v) == 'object') {v = v.toString();}
		if (typeof(v) == 'string') {v = parseFloat(v.replace(jSE.regEx.n, ''));}
		if (isNaN(v)) {return 0;}
		if (typeof(v) == 'number') {return v;}
		if (v == true) {return 1;}
		return 0;
	},
	VERSION: function() {
		return this.jS.version;
	},
	//math functions
	ABS: function(v) {
		return Math.abs(jFN.N(v));
	},
	CEILING: 	function(value, significance) {
		significance = significance || 1;
		return (parseInt(value / significance) * significance) + significance;
	},
	EVEN: function(v) {
		v = Math.round(v);
		var even = (v % 2 == 0);
		if (!even) {
			if (v > 0) {
				v++;
			} else {
				v--;
			}
		}
		return v;
	},
	EXP: function(v) {
		return Math.exp(v);
	},
	FLOOR: function(value, significance) {
		significance = significance || 1;
		if (
			(value < 0 && significance > 0 ) ||
			(value > 0 && significance < 0 )) {
			return {
				value: 0,
				html: "#NUM"
			};
		}
		if (value >= 0) {
			return Math.floor(value / significance) * significance;
		} else {
			return Math.ceil(value / significance) * significance;
		}
	},
	INT: 		function(v) { return Math.floor(jFN.N(v)); },
	LN: function(v) {
		return Math.log(v);
	},
	LOG: function(v,n) {
		n = n || 10;
		return Math.log(v) / Math.log(n);
	},
	LOG10: function(v) {
		return jFN.LOG(v);
	},
	MOD: function(x, y) {
		var modulus = x % y;
		if (y < 0) {
			modulus *= -1;
		}
		return modulus;
	},
	ODD: function(v) {
		var gTZ = false;
		if (v > 0) {
			v = Math.floor(Math.round(v));
			gTZ = true;
		} else {
			v = Math.ceil(v);
		}

		var vTemp = Math.abs(v);
		if ((vTemp % 2) == 0) { //even
			vTemp++;
		}

		if (gTZ) {
			return vTemp;
		} else {
			return -vTemp;
		}
	},
	PI: function() { return Math.PI; },
	POWER: function(x, y) {
		return Math.pow(x, y);
	},
	SQRT: function(v) {
		return Math.sqrt(v);
	},
	RAND: 		function() { return Math.random(); },
	RND: 		function() { return Math.random(); },
	ROUND: 		function(v, decimals) {
		return jFN.FIXED(v, (decimals ? decimals : 0), false);
	},
	ROUNDDOWN: function(v, decimals) {
		var neg = (v < 0);
		v = Math.abs(v);
		decimals = decimals || 0;
		v = Math.floor(v * Math.pow(10, decimals)) / Math.pow(10, decimals);
		return (neg ? -v : v);
	},
	ROUNDUP: function(v, decimals) {
		var neg = (v < 0);
		v = Math.abs(v);
		decimals = decimals || 0;
		v = Math.ceil(v * Math.pow(10, decimals)) / Math.pow(10, decimals);
		return (neg ? -v : v);
	},
	SUM: 		function() {
		var sum = 0;
		var v = arrHelpers.toNumbers(arguments);

		for(i in v) {
			sum += v[i] * 1;
		}
		return sum;
	},
	TRUNC: function(number, digits) {
		digits = digits || 0;
		number = number + '';

		if (digits == 0) {
			return number.split('.').shift();
		}

		if (number.match('.')) {
			if (digits == 1) {
				number = number.substr(0,number.length - 1);
			} else if (digits == -1) {
				number = number.split('.').shift();
				number = number.substr(0,number.length - 1) + '0';
			}
		}

		return number;
	},
	//statistical functions
	AVERAGE:	function(v) {
		return jFN.SUM(arguments) / jFN.COUNT(arguments);
	},
	AVG: 		function(v) {
		return jFN.AVERAGE(v);
	},
	COUNT: 		function() {
		var count = 0;
		var v = arrHelpers.toNumbers(arguments);

		for (i in v) {
			if (v[i] != null) count++;
		}

		return count;
	},
	COUNTA:		function() {
		var count = 0;
		var v = arrHelpers.flatten(arguments);

		for (i in v) {
			if (v[i]) {
				count++;
			}
		}

		return count;
	},
	MAX: 		function() {
		var v = arrHelpers.toNumbers(arguments);
		var max = v[0];

		for(i in v) {
			max = (v[i] > max ? v[i]: max);
		}
		return max;
	},
	MIN: 		function() {
		var v = arrHelpers.toNumbers(arguments);
		var min = v[0];

		for(i in v) {
			min = (v[i] < min ? v[i]: min);
		}
		return min;
	},
	//string functions
	ASC: function(v) {
		return v.charCodeAt(0);
	},
	CHAR: function(v) {
		return String.fromCharCode(v);
	},
	CLEAN: function(v) {
		var exp = new RegExp("[\cG\x1B\cL\cJ\cM\cI\cK\x07\x1B\f\n\r\t\v]","g");
		return v.replace(exp, '');
	},
	CODE: function(v) {
		return jFN.ASC(v);
	},
	CONCATENATE: function() {
		var arr = arrHelpers.flatten(arguments),
			result = '';
		jQuery.each(arr, function (i) {
			result += arr[i];
		});
		return {
			value: result,
			html: result
		};
	},
	DOLLAR: function(v, decimals, symbol) {
		if (decimals == null) {
			decimals = 2;
		}

		if (symbol == null) {
			symbol = '$';
		}

		var r = jFN.FIXED(v, decimals, false),
			html;
		if (v >= 0) {
			html = symbol + r;
		} else {
			html = '-' + symbol + r.slice(1);
		}
		return {
			value: v,
			html: html
		};
	},
	FIXED: function(v, decimals, noCommas) {
		if (decimals == null) {
			decimals = 2;
		}
		var x = Math.pow(10, decimals),
			n = String(Math.round(jFN.N(v) * x) / x),
			p = n.indexOf('.'),
			commaPreDecimal = (noCommas ? '' : ''),
			commaPostDecimal = (noCommas ? '' : ',');

		if (p < 0) {
			p = n.length;
			n += '.';
		}
		for (var i = n.length - p - 1; i < decimals; i++) {
			n += '0';
		}

		var arr	= n.replace('-', '').split('.');
		var result = [];
		var first  = true;
		while (arr[0].length > 0) { // LHS of decimal point.
			if (!first) {
				result.unshift(commaPostDecimal);
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
					result.push(commaPreDecimal);
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
	LEFT: function(v, numberOfChars) {
		numberOfChars = numberOfChars || 1;
		return v.substring(0, numberOfChars);
	},
	LEN: function(v) {
		if (!v) {
			return 0;
		}
		return v.length;
	},
	LOWER: function(v) {
		return v.toLowerCase();
	},
	MID: function(v, start, end) {
		if (!v || !start || !end) {
			return this.error({error: 'ERROR'});
		}
		return v.substring(start - 1, end + start - 1);
	},
	REPLACE: function(oldText, start, numberOfChars, newText) {
		if (!oldText || !start || !numberOfChars || !newText) {
			return this.error({error: 'ERROR'});
		}
		var result = oldText.split('');
		result.splice(start - 1, numberOfChars);
		result.splice(start - 1, 0, newText);
		return result.join('');
	},
	REPT: function(v, times) {
		var result = '';
		for(var i = 0;i < times; i++) {
			result += v;
		}
		return result;
	},
	RIGHT: function(v, numberOfChars) {
		numberOfChars = numberOfChars || 1;
		return v.substring(v.length - numberOfChars, v.length);
	},
	SEARCH: function(find, body, start) {
		start = start || 0;
		if (start) {
			body = body.split('');
			body.splice(0, start - 1);
			body = body.join('');
		}
		var i = body.search(find);

		if (i < 0) {
			return this.error({error: '#VALUE!'});
		}

		return start + (start ? 0 : 1) + i;
	},
	SUBSTITUTE: function(text, oldText, newText, nthAppearance) {
		nthAppearance = nthAppearance || 0;
		oldText = new RegExp(oldText, 'g');
		var i = 1;
		text = text.replace(oldText, function(match, contents, offset, s) {
			var result = match;
			if (nthAppearance) {
				if (i >= nthAppearance) {
					result = newText;
				}
			} else {
				result = newText;
			}

			i++;
			return result;
		});
		return text;
	},
	TEXT: function() {
		return this.error({error: 'Not Yet Implemented'});
	},
	UPPER: function(v) {
		return v.toUpperCase();
	},
	VALUE: function(v) {
		if (jQuery.isNumeric(v)) {
			return v *= 1;
		} else {
			return this.error({error: "#VALUE!"})
		}
	},
	//date/time functions
	NOW: 		function() {
		var today = new Date();
		return {
			value: today,
			html: dates.toString(today)
		};
	},
	TODAY: 		function() {
		var today = new Date();
		return {
			value: dates.toCentury(today) - 1,
			html: dates.toString(today, 'd')
		};
	},
	WEEKENDING: function(weeksBack) {
		var date = new Date();
		date = new Date( 
			date.getFullYear(), 
			date.getMonth(), 
			date.getDate() + 5 - date.getDay() - ((weeksBack || 0) * 7)
		);
		
		return {
			value: date,
			html: dates.toString(date, 'd')
		};
	},
	WEEKDAY: 	function(date, returnValue) {
		date = dates.get(date);
		var day = date.getDay();
		
		returnValue = (returnValue ? returnValue : 1);
		switch (returnValue) {
			case 3:
				switch (day) {
					case 0:return 7;
					case 1:return 1;
					case 2:return 2;
					case 3:return 3;
					case 4:return 4;
					case 5:return 5;
					case 6:return 6;
				}
				break;
			case 2:
				switch (day) {
					case 0:return 6;
					case 1:return 0;
					case 2:return 1;
					case 3:return 2;
					case 4:return 3;
					case 5:return 4;
					case 6:return 5;
				}
				break;
			case 1:
				day++;
				break;
		}
		
		return day;
	},
	WEEKNUM: function(date) {//TODO: implement week starting
		date = dates.get(date);
		return dates.week(date) + 1;
	},
	YEAR: function(date) {
		date = dates.get(date);
		return date.getFullYear();
	},
	DAYSFROM: 	function(year, month, day) { 
		return Math.floor( (new Date() - new Date (year, (month - 1), day)) / dates.dayDiv);
	},
	DAYS: function(v1, v2) {
		var date1 = dates.get(v1);
		var date2 = dates.get(v2);
		var ONE_DAY = 1000 * 60 * 60 * 24;
		return Math.round(Math.abs(date1.getTime() - date2.getTime()) / ONE_DAY);
	},
	DAY: function(date) {
		date = dates.get(date);
		return date.getDate();
	},
	DAYS360: function(date1, date2, method) {
		date1 = dates.get(date1);
		date2 = dates.get(date2);

		var startDate = date1.getDate(),
			endDate = date2.getDate(),
			startIsLastDay = dates.isLastDayOfMonth(date1),
			endIsLastDay = dates.isLastDayOfMonth(date2),
			monthCount = dates.diffMonths(date1, date2);

		if (method) {//Euro method
			startDate = Math.min(startDate, 30);
			endDate = Math.min(endDate, 30);
		} else { //Standard
			if (startIsLastDay) {
				startDate = 30;
			}
			if (endIsLastDay) {
				if (startDate < 30) {
					monthCount++;
					endDate = 1;
				} else {
					endDate = 30;
				}
			}
		}

		return (monthCount * 30) + (endDate - startDate);
	},
	DATE: function(year, month, day) {
		var date = new Date(year, month - 1, day);
		return {
			html: dates.toString(date, 'd'),
			value: dates.toCentury(date)
		};
	},
	DATEVALUE: function(date) {
		date = dates.get(date);
		return {
			html: dates.toString(date, 'd'),
			value: dates.toCentury(date)
		}
	},
	EDATE: function(date, months) {
		date = dates.get(date),
		date.setMonth(date.getMonth() + months);
		return {
			html: dates.toString(date, 'd'),
			value: dates.toCentury(date)
		};
	},
	EOMONTH: function(date, months) {
		date = dates.get(date),
		date.setMonth(date.getMonth() + months + 1);
		date = new Date(date.getFullYear(), date.getMonth(), 0);
		return {
			html: dates.toString(date, 'd'),
			value: dates.toCentury(date)
		};
	},
	HOUR: function(time) {
		return times.fromMath(time).hour;
	},
	MINUTE: function(time) {
		return times.fromMath(time).minute;
	},
	MONTH: function(date) {
		date = dates.get(date);
		return date.getMonth() + 1;
	},
	SECOND: function(time) {
		return times.fromMath(time).second;
	},
	TIME: function(hour, minute, second) {
		var date = new Date();
			second = (second ? second : 0),
			minute = (minute ? minute : 0),
			hour = (hour ? hour : 0);

		if (second && second > 60) {
			var minuteFromSecond = (((second / 60) + '').split('.')[0]) * 1;
			second = second - (minuteFromSecond * 60);
			minute += minuteFromSecond;
		}

		if (minute && minute > 60) {
			var hourFromMinute = (((minute / 60) + '').split('.')[0]) * 1;
			minute = minute - (hourFromMinute * 60);
			hour += hourFromMinute;
		}

		var millisecond = (hour * 60 * 60 * 1000) + (minute * 60 * 1000) + (second * 1000);

		return millisecond / dates.dayDiv;
	},
	TIMEVALUE: function (time) {
		if (!isNaN(time)) {
			return time;
		}
		if (/([0]?[1-9]|1[0-2])[:][0-5][0-9]([:][0-5][0-9])?[ ]?(AM|am|aM|Am|PM|pm|pM|Pm)/.test(time)) {
			return times.fromString(time, true);
		} else if (/([0]?[0-9]|1[0-9]|2[0-3])[:][0-5][0-9]([:][0-5][0-9])?/.test(time)) {
			return times.fromString(time);
		}
		return 0;
	},
	WORKDAY: function(startDate, days, holidays) {
		var workDays = {1:true, 2:true, 3:true, 4:true, 5:true},
			startDate = dates.get(startDate),
			days = (days && !isNaN(days) ? days : 0),
			dayCounter = 0,
			daysSoFar = 0,
			workingDate = new Date();

		workingDate = startDate;

		if (holidays) {
			if (!jQuery.isArray(holidays)) {
				holidays = [holidays];
			}
			holidays = arrHelpers.flatten(holidays);
			var holidaysTemp = {};
			jQuery.each(holidays, function(i) {
				if (holidays[i]) {
					holidaysTemp[dates.toString(dates.get(holidays[i]), 'd')] = true;
				}
			});
			holidays = holidaysTemp;
		} else {
			holidays = {};
		}

		while( daysSoFar < days ){
			workingDate = new Date(workingDate.setDate(workingDate.getDate() + 1));
			if( workDays[workingDate.getDay()] ){
				if (!holidays[dates.toString(workingDate, 'd')]) {
					daysSoFar++;
				}
			}
			dayCounter++;
		}

		return {
			html: dates.toString(workingDate, 'd'),
			value: dates.toCentury(workingDate)
		};
	},
	YEARFRAC: function(startDate, endDate, basis) {
		startDate = dates.get(startDate);
		endDate = dates.get(endDate);

		if (!startDate || !endDate) {
			return this.error({error: '#VALUE!'});
		}

		basis = (basis ? basis : 0);

		var numerator = dates.diff( startDate , endDate , basis );
		var denom = dates.calcAnnualBasis( startDate , endDate , basis );
		return numerator / denom;
	},
	//logical functions
	AND: function() {
		var args = arguments,
			res;
		jQuery.each(args, function(i) {
			if (args[i] !== true && res == undefined) {
				res = jFN.FALSE();
			}
		});
		if (!res) {
			res = jFN.TRUE();
		}
		return res;
	},
	FALSE: 		function() {
		return {
			value: false,
			html: 'FALSE'
		};
	},
	IF: function(expression, resultTrue, resultFalse){
		var value, html;
		if (expression) {
			value = resultTrue;
			html = this.html[1];
		} else {
			value = resultFalse;
			html = this.html[2];
		}

		return {
			value: value,
			html: html
		};
	},
	NOT: function(v) {
		if (v) {
			return jFN.FALSE();
		}
		return jFN.TRUE();
	},
	OR: function() {
		var args = arguments,
			or;
		jQuery.each(args, function(i) {
			if (args[i] === true && or == undefined) {
				or = jFN.TRUE();
			}
		});
		if (!or) {
			or = jFN.FALSE();
		}
		return or;
	},
	TRUE: 		function() {
		return {
			value: true,
			html: 'TRUE'
		};
	},
	//html function
	IMG: function(v) {
		return jQuery('<img />')
			.attr('src', v);
	},
	GETHTML: function() {
		return this.html[0];
	},
	TRIM: function(v) { 
		if (typeof(v) == 'string') {
			v = jQuery.trim(v);
		}
		return v;
	},
	HYPERLINK: function(link, name) {
		name = (name ? name : 'LINK');
		return jQuery('<a href="' + link + '" target="_new">' + name + '</a>');
	},
	DROPDOWN: function() {
		var cell = this.obj,
			jS = this.jS,
			v = arrHelpers.flatten(arguments),
			html;
		v = arrHelpers.unique(v);
		
		if (this.s.editable) {
			
			var id = "dropdown" + this.sheet + "_" + this.row + "_" + this.col + '_' + this.jS.I;
			html = jQuery('<select style="width: 100%;" name="' + id + '" id="' + id + '" />')
				.mousedown(function() {
					jS.cellEdit(jQuery(this).parent(), null, true);
				});
		
			for (var i = 0; i < (v.length <= 50 ? v.length : 50); i++) {
				if (v[i]) {
					html.append('<option value="' + v[i] + '">' + v[i] + '</option>');
				}
			}
			
			//here we find out if it is on initial calc, if it is, the value we an use to set the dropdown
			if (jQuery(jS.getTd(this.sheet, this.row, this.col)).find('#' + id).length == 0) {
				cell.value = jS.spreadsheets[this.sheet][this.row][this.col].value;
			}
			
			jS.s.origParent.one('calculation', function() {
				jQuery('#' + id)
					.change(function() {
						cell.value = jQuery(this).val();
						jS.calc();
					});
				jS.attrH.setHeight(jS.getTdLocation(html.parent()).row, 'cell', false);
			});
					
			html.val(cell.value);
		}
		return {value: cell.value, html: html};
	},
	RADIO: function() {
		var cell = this.obj,
			jS = this.jS,
			v = arrHelpers.flatten(arguments),
			html;
		v = arrHelpers.unique(v);
		

		if (this.s.editable) {
			var id = "radio" + this.sheet + "_" + this.row + "_" + this.col + '_' + this.jS.I;
			
			html = jQuery('<span />')
				.mousedown(function() {
					jS.cellEdit(jQuery(this).parent());
				});
			
			for (var i = 0; i < (v.length <= 25 ? v.length : 25); i++) {
				if (v[i]) {
					var input = jQuery('<input type="radio" name="' + id + '" class="' + id + '" />')
						.val(v[i]);
					
					if (v[i] == cell.value) {
						input.attr('checked', 'true');
					}
					
					html
						.append(input)
						.append('<span>' + v[i] + '</span>')
						.append('<br />');
					
					jS.s.origParent.one('calculation', function() {
						jQuery('.' + id)
							.change(function() {
								cell.value = jQuery(this).val();
								jS.calc();
							});
						jS.attrH.setHeight(jS.getTdLocation(html.parent()).row, 'cell', false);
					});
				}
			}

			//here we find out if it is on initial calc, if it is, the value we an use to set the radio
			if (jQuery(jS.getTd(this.sheet, this.row, this.col)).find('.' + id).length == 0) {
				cell.value = jS.spreadsheets[this.sheet][this.row][this.col].value;
			}
		}
		return {value: cell.value, html: html};
	},
	CHECKBOX: function(v) {
		if (jQuery.isArray(v)) v = v[0];
		
		var cell = this.obj,
			jS = this.jS,
			html;
		
		if (this.s.editable) {
			
			var id = "checkbox" + this.sheet + "_" + this.row + "_" + this.col + '_' + this.jS.I,
				checkbox = jQuery('<input type="checkbox" name="' + id + '" class="' + id + '" />')
					.val(v);

			html = jQuery('<span />')
				.append(checkbox)
				.append('<span>' + v + '</span><br />')
				.mousedown(function() {
					jS.cellEdit(jQuery(this).parent());
				});
			
			if (v == cell.value) {
				checkbox.attr('checked', true);
			}
			
			var td = jQuery(jS.getTd(this.sheet, this.row, this.col));
			if (!td.children().length) {
				if (td.html() == cell.value) {
					checkbox.attr('checked', true);
				}
			}
			
			jS.s.origParent.one('calculation', function() {
				jQuery('.' + id)
					.change(function() {
						cell.value = (jQuery(this).is(':checked') ? jQuery(this).val() : '');
						jS.calc();
					});
			});
			
			//here we find out if it is on initial calc, if it is, the value we an use to set the checkbox
			if (jQuery(jS.getTd(this.sheet, this.row, this.col)).find('.' + id).length == 0) {
				var checked = jS.spreadsheets[this.sheet][this.row][this.col].value;
				cell.value = (checked == 'true' || checked == true ? v : '');
			}
		}
		return {value: cell.value, html: html};
	},
	BARCHART:	function(values, legend, title) {
		return {
			value: '',
			html: jSE.chart.apply(this, [{
				type: 'bar',
				data: values,
				legend: legend,
				title: title
			}])
		};
	},
	HBARCHART:	function(values, legend, title) {
		return {
			value: '',
			html:jSE.chart.apply(this, [{
				type: 'hbar',
				data: values,
				legend: legend,
				title: title
			}])
		};
	},
	LINECHART:	function(valuesX, valuesY) {
		return {
			value: '',
			html:jSE.chart.apply(this, [{
				type: 'line',
				x: {
					data: valuesX
				},
				y: {
					data: valuesY
				},
				title: ""
			}])
		};
	},
	PIECHART:	function(values, legend, title) {
		return {
			value: '',
			html: jSE.chart.apply(this, [{
				type: 'pie',
				data: values,
				legend: legend,
				title: title
			}])
		};
	},
	DOTCHART:	function(valuesX, valuesY, values, legendX, legendY, title) {
		return {
			value: '',
			html: jSE.chart.apply(this, [{
				type: 'dot',
				data: (values ? values : valuesX),
				x: {
					data: valuesX,
					legend: legendX
				},
				y: {
					data: (valuesY ? valuesY : valuesX),
					legend: (legendY ? legendY : legendX)
				},
				title: title
			}])
		};
	},
	CELLREF: function(v) {
		return (this.jS.spreadsheets[v] ? this.jS.spreadsheets[v] : 'Cell Reference Not Found');
	},
	CALCTIME: function() {
		var owner = this;
		this.s.origParent.one('calculation', function() {
			jQuery(owner.jS.getTd(owner.sheet, owner.row, owner.col))
				.text(owner.jS.time.diff());
		});
		return "";
	},
	//cell functions
	HLOOKUP: function ( value, tableArray, indexNumber, notExactMatch ) {
		var lookupTable = this.jS.cellLookup.apply(this);
		
		for(var i = 0; i < tableArray[0].length; i++) {
			if (tableArray[0][i] == value) {
				return this.jS.updateCellValue(lookupTable[i].sheet, indexNumber - 1, lookupTable[i].col);
			}
		}
		
		return notExactMatch;
	},
	VLOOKUP: function ( value, tableArray, indexNumber, notExactMatch ) {
		var lookupTable = this.jS.cellLookup.apply(this);
		
		for(var i = 0; i < tableArray[0].length; i++) {
			if (tableArray[0][i] == value) {
				return this.jS.updateCellValue(lookupTable[i].sheet, lookupTable[i].row, indexNumber);
			}
		}
		
		return notExactMatch;
	},
	THISROWCELL: function(col) {
		if (isNaN(col)) {
			col = jSE.columnLabelIndex(col);
		}
		return this.jS.updateCellValue(this.sheet, this.row, col);
	},
	THISCOLCELL: function(row) {
		return this.jS.updateCellValue(this.sheet, row, this.col);
	}
};

var key = { /* key objects, makes it easier to develop */
	BACKSPACE: 			8,
	CAPS_LOCK: 			20,
	COMMA: 				188,
	CONTROL: 			17,
	ALT:				18,
	DELETE: 			46,
	DOWN: 				40,
	END: 				35,
	ENTER: 				13,
	ESCAPE: 			27,
	HOME: 				36,
	INSERT: 			45,
	LEFT: 				37,
	NUMPAD_ADD: 		107,
	NUMPAD_DECIMAL: 	110,
	NUMPAD_DIVIDE: 		111,
	NUMPAD_ENTER: 		108,
	NUMPAD_MULTIPLY: 	106,
	NUMPAD_SUBTRACT: 	109,
	PAGE_DOWN: 			34,
	PAGE_UP: 			33,
	PERIOD: 			190,
	RIGHT: 				39,
	SHIFT: 				16,
	SPACE: 				32,
	TAB: 				9,
	UP: 				38,
	F:					70,
	V:					86,
	Y:					89,
	Z:					90
};

var arrHelpers = {
	foldPrepare: function(firstArg, theArguments, unique) { // Computes the best array-like arguments for calling fold().
		var result;
		if (firstArg != null &&
			firstArg instanceof Object &&
			firstArg["length"] != null) {
			result = firstArg;
		} else {
			result = theArguments;
		}
		
		if (unique) {
			result = this.unique(result);
		}
		
		return result;
	},
	fold: function(arr, funcOfTwoArgs, result, castToN, N) {
		for (var i = 0; i < arr.length; i++) {
			result = funcOfTwoArgs(result, (castToN == true ? N(arr[i]): arr[i]));
		}
		return result;
	},
	toNumbers: function(arr) {
		arr = this.flatten(arr);
		
		for (i in arr) {
			if (arr[i]) {
				arr[i] = jQuery.trim(arr[i]);
				if (isNaN(arr[i])) {
					arr[i] = 0;
				} else {
					arr[i] = arr[i] * 1;
				}
			} else {
				arr[i] = 0;
			}
		}
		
		return arr;
	},
	unique: function(arr) {
		var a = [];
		var l = arr.length;
		for (var i=0; i<l; i++) {
			for(var j=i+1; j<l; j++) {
				// If this[i] is found later in the array
				if (arr[i] === arr[j])
					j = ++i;
			}
			a.push(arr[i]);
		}
		return a;
	},
	flatten: function(arr) {
		var flat = [];
		for (var i = 0, l = arr.length; i < l; i++){
			var type = Object.prototype.toString.call(arr[i]).split(' ').pop().split(']').shift().toLowerCase();
			if (type) {
				flat = flat.concat(/^(array|collection|arguments|object)$/.test(type) ? this.flatten(arr[i]) : arr[i]);
			}
		}
		return flat;
	},
	insertAt: function(arr, val, index){
		jQuery(val).each(function(){
			if (index > -1 && index <= arr.length) {
				arr.splice(index, 0, this);
			}
		});
		return arr;
	},
	getClosestValues: function(a, x) {
		var closest = null;
		a = a || [];
		x = x || 0;
		for (var i = 0; i < a.length;i++) {
			if (closest == null || Math.abs(a[i] - x) < Math.abs(closest - x)) {
				closest = a[i];
			}
		}
		
		return closest;
	}
};

var dates = {
	dayDiv: 86400000,
	toCentury: function(date) {
		return Math.round(Math.abs((new Date(1900,0,-1)) - date) / this.dayDiv);
	},
	get: function(date) {
		if (date.getMonth) {
			return date;
		} else if (isNaN(date)) {
			return new Date(Globalize.parseDate( date ));
		} else {
			date *= this.dayDiv;
			//date = new Date(date);
			var newDate = (new Date(1900,0,-1)) * 1;
			date += newDate;
			date = new Date(date);
			return date;
		}
	},
	week: function(date) {
		var onejan = new Date(date.getFullYear(),0,1);
		return Math.ceil((((date - onejan) / this.dayDiv) + onejan.getDay()+1)/7);
	},
	toString: function(date, pattern) {
		if (!pattern) {
			return Globalize.format(date);
		}
		return Globalize.format(date, Globalize.culture().calendar.patterns[pattern]);
	},
	diff: function(start, end, basis) {
		switch (basis) {
			case 0: return this.days360Nasd(start, end, 0, true);
			case 1:
			case 2:
			case 3:
				var result = Math.abs(end - start) / this.dayDiv;
				return result;
			case 4: return this.days360Euro(start, end);
		}
	},
	diffMonths: function(start, end) {
		var months;
		months = (end.getFullYear() - start.getFullYear()) * 12;
		months -= start.getMonth() + 1;
		months += end.getMonth() + 1;
		return months;
	},
	days360: function(startYear, endYear, startMonth, endMonth, startDate, endDate) {
		return ((endYear - startYear) * 360) + ((endMonth - startMonth) * 30) + (endDate - startDate)
	},
	days360Nasd: function(start, end, method, useEom) {
		var startDate = start.getDate(),
			startMonth = start.getMonth(),
			startYear = start.getFullYear(),
			endDate = end.getDate(),
			endMonth = end.getMonth(),
			endYear = end.getFullYear();

		if (
			(endMonth==2 && this.isEndOfMonth(endDate, endMonth, endYear)) &&
			(
				(startMonth==2 && this.isEndOfMonth(startDate, startMonth, startYear)) ||
				method==3
			)
		) {
			endDate = 30;
		}

		if (endDate==31 && (startDate >= 30 || method==3)) {
			endDate = 30;
		}

		if (startDate==31) {
			startDate = 30;
		}

		if (useEom && startMonth==2 && this.isEndOfMonth(startDate, startMonth, startYear)) {
			startDate = 30;
		}

		return this.days360(startYear, endYear, startMonth, endMonth, startDate, endDate);
	},
	days360Euro: function(start, end) {
		var startDate = start.getDate(),
			startMonth = start.getMonth(),
			startYear = start.getFullYear(),
			endDate = end.getDate(),
			endMonth = end.getMonth(),
			endYear = end.getFullYear();

		if (startDate==31) startDate = 30;
		if (endDate==31) endDate = 30;

		return this.days360(startYear, endYear, startMonth, endMonth, startDate, endDate);
	},
	isEndOfMonth: function(day, month, year) {
		return day == (new Date(year, month + 1, 0, 23, 59, 59)).getDate();
	},
	isLeapYear: function(year) {
		return new Date(year, 1, 29).getMonth() == 1;
	},
	calcAnnualBasis: function(start, end, basis) {
		switch (basis) {
			case 0:
			case 2:
			case 4: return 360;
			case 3: return 365;
			case 1:
				var startDate = start.getDate(),
					startMonth = start.getMonth(),
					startYear = start.getFullYear(),
					endDate = end.getDate(),
					endMonth = end.getMonth(),
					endYear = end.getFullYear(),
					result;

				if (startYear == endYear) {
					if (this.isLeapYear(startYear)) {
						result = 366;
					} else {
						result = 365;
					}
				} else if (((endYear-1) == startYear) && ((startMonth>endMonth) || ((startMonth==endMonth) && startDate>=endDate))) {
					if (this.isLeapYear(startYear)) {
						if (startMonth<2 || (startMonth==2 && startDate<=29)) {
							result = 366;
						} else {
							result = 365;
						}
					} else if (this.isLeapYear(endYear)) {
						if (endMonth>2 || (endMonth==2 && endDate==29)) {
							result = 366;
						} else {
							result = 365;
						}
					} else {
						result = 365;
					}
				} else {
					for(var iYear = startYear; iYear <= endYear; iYear++) {
						if (this.isLeapYear(iYear)) {
							result += 366;
						} else {
							result += 365;
						}
					}
					result = result / (endYear - startYear + 1);
				}
				return result;
		}
	},
	lastDayOfMonth: function(date) {
		date.setDate(0);
		return date.getDate();
	},
	isLastDayOfMonth: function(date) {
		return (date.getDate() == this.lastDayOfMonth(date));
	}
};

var times = {
	fromMath: function(time) {
		var result = {};

		result.hour = ((time * 24) + '').split('.')[0];

		result.minute = function(time) {
			time = Math.round(time * 24 * 100)/100;
			time = (time + '').split('.');
			var minute = 0;
			if (time[1]) {
				if (time[1].length < 2) {
					time[1] += '0';
				}
				minute = time[1] * 0.6;
			}
			return Math.round(minute);
		}(time);

		result.second = function(time) {
			time = Math.round(time * 24 * 10000)/10000;
			time = (time + '').split('.');
			var second = 0;
			if (time[1]) {
				for(var i = 0; i < 4; i++) {
					if (!time[1].charAt(i)) {
						time[1] += '0';
					}
				}
				var secondDecimal = ((time[1] * 0.006) + '').split('.');
				if (secondDecimal[1]) {
					if (secondDecimal[1] && secondDecimal[1].length > 2) {
						secondDecimal[1] = secondDecimal[1].substr(0,2);
					}

					return Math.round(secondDecimal[1] * 0.6);
				}
			}
			return second;
		}(time);

		return result;
	},
	fromString: function(time, isAMPM) {
		var date = new Date(), timeParts = time, timeValue, hour, minute, second, meridiem;
		if (isAMPM) {
			meridiem = timeParts.substr(-2).toLowerCase(); //get ampm;
			timeParts = timeParts.replace(/(am|pm)/i,'');
		}

		timeParts = timeParts.split(':');
		hour = timeParts[0] * 1;
		minute = timeParts[1] * 1;
		second = (timeParts[2] ? timeParts[2] : 0) * 1;

		if (isAMPM && meridiem == 'pm') {
			hour += 12;
		}

		return jFN.TIME(hour, minute, second);
	}
};

var math = {
	log10: function (arg) {
		// http://kevin.vanzonneveld.net
		// +   original by: Philip Peterson
		// +   improved by: Onno Marsman
		// +   improved by: Tod Gentille
		// +   improved by: Brett Zamir (http://brett-zamir.me)
		// *	 example 1: log10(10);
		// *	 returns 1: 1
		// *	 example 2: log10(1);
		// *	 returns 2: 0
		return Math.log(arg) / 2.302585092994046; // Math.LN10
	},
	signum: function(x) {
		return (x/Math.abs(x))||x;
	}
};