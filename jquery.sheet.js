/*
jQuery.sheet() Spreadsheet with Calculations Plugin
Version: 1.1.0 SVN
http://code.google.com/p/jquerysheet/
		
Copyright (C) 2010 Robert Plummer
Dual licensed under the LGPL v2 and GPL v2 licenses.
http://www.gnu.org/licenses/
*/

/*
	Dimensions Info:
		When dealing with size, it seems that outerHeight is generally the most stable cross browser
		attribute to use for bar sizing.  We try to use this as much as possible.  But because col's
		don't have boarders, we subtract or add jS.s.boxModelCorrection for those browsers.
	tr/td column and row Index VS cell/column/row index
		DOM elements are all 0 based (tr/td/table)
		Spreadsheet elements are all 1 based (A1, A1:B4, TABLE2:A1, TABLE2:A1:B4)
		Column/Row/Cell
	sheet import and export methods structure (jS.importSheet.xml(obj), jS.importSheet.json(obj), jS.exportSheet.xml(), jS.exportSheet.json());
		xml structure:
			//xml
			<documents>
				<document> //repeats
					<metadata>
						<columns>{Column_Count}</columns>
						<rows>{Row_Count}</rows>
						<title></title>
					</metadata>
					<data>
						<r{Row_Index}> //repeats
							<c{Column_Index} style=""></c{Column_Index}> //repeats
						</r{Row_Index}>
					</data>
				</document>
			</documents>
		json structure:
			[//documents
				{ //document repeats
					metadata: {
						columns: Column_Count,
						rows: Row_Count,
						title: ''
					},
					data: {
						r{Row_Index}: { //repeats
							c{Column_Index}: { //repeats
								value: '',
								style: ''
							}
						}
					}
				}
			];
	DOCTYPE:
		It is recommended to use STRICT doc types on the viewing page when using sheet to ensure that the heights/widths of bars and sheet rows show up correctly
		Example of recommended doc type: <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
*/
var jQuerySheetInstanceI = 0;

jQuery.fn.extend({
	sheet: function(settings) {
		settings = jQuery.extend({
			urlGet: 		"documentation.html", 			//local url, if you want to get a sheet from a url
			urlSave: 		"save.html", 					//local url, for use only with the default save for sheet
			editable: 		true, 							//bool, Makes the jSheetControls_formula & jSheetControls_fx appear
			urlMenu: 		"menu.html", 					//local url, for the menu to the right of title
			newColumnWidth: 120, 							//int, the width of new columns or columns that have no width assigned
			title: 			null, 							//html, general title of the sheet group
			inlineMenu:		null, 							//html, menu for editing sheet
			buildSheet: 	false,							//bool, string, or object
																//bool true - build sheet inside of parent
																//bool false - use urlGet from local url
																//string  - '{number_of_cols}x{number_of_rows} (5x100)
																//object - table
			calcOff: 		false, 							//bool, turns calculationEngine off (no spreadsheet, just grid)
			log: 			false, 							//bool, turns some debugging logs on (jS.log('msg'))
			lockFormulas: 	false, 							//bool, turns the ability to edit any formula off
			parent: 		jQuery(this), 							//object, sheet's parent, DON'T CHANGE
			colMargin: 		18, 							//int, the height and the width of all bar items, and new rows
			fnBefore: 		function() {}, 					//fn, fires just before jQuery.sheet loads
			fnAfter: 			function() {}, 				//fn, fires just after all sheets load
			fnSave: 		function() { jS.saveSheet(); }, //fn, default save function, more of a proof of concept
			fnOpen: 		function() { 					//fn, by default allows you to paste table html into a javascript prompt for you to see what it looks likes if you where to use sheet
				var t = prompt('Paste your table html here');
				if (t) {
					jS.openSheet(t);
				}
			},
			fnClose: 		function() {}, 					//fn, default clase function, more of a proof of concept
			fnAfterCellEdit:	function() {},				//fn, fires just after someone edits a cell
			joinedResizing: false, 							//bool, this joins the column/row with the resize bar
			boxModelCorrection: 2, 							//int, attempts to correct the differences found in heights and widths of different browsers, if you mess with this, get ready for the must upsetting and delacate js ever
			showErrors:		true							//bool, will make cells value an error if spreadsheet function isn't working correctly or is broken
		}, settings);
		
		jQuerySheetInstanceI++;
		var o = jQuery(this);
		o.sheetInstance = createSheetInstance(settings, jQuerySheetInstanceI);
		return o;
	}
});

function createSheetInstance(s, I) { //s = jQuery.sheet settings, I = jQuery.sheet Instance Integer
	var jS = {
		version: '1.1.0',
		i: 0,
		I: I,
		sheetCount: 0,
		s: {},//s = settings object, used for shorthand, populated from jQuery.sheet
		obj: {//obj = object references
			//Please note, class references use the tag name because it's about 4 times faster
			barCorner:			function() { return jQuery('#' + jS.id.barCorner + jS.i); },
			barCornerAll:		function() { return jQuery('div.' + jS.cl.barCorner); },
			barCornerParent:	function() { return jQuery('#' + jS.id.barCornerParent + jS.i); },
			barCornerParentAll: function() { return jQuery('td.' + jS.cl.barCornerParent); },
			barTop: 			function() { return jQuery('#' + jS.id.barTop + jS.i); },
			barTopAll:			function() { return jQuery('div.' + jS.cl.barTop); },
			barTopParent: 		function() { return jQuery('#' + jS.id.barTopParent + jS.i); },
			barTopParentAll:	function() { return jQuery('div.' + jS.cl.barTopParent); },
			barLeft: 			function() { return jQuery('#' + jS.id.barLeft + jS.i); },
			barLeftAll:			function() { return jQuery('div.' + jS.cl.barLeft); },
			barLeftParent: 		function() { return jQuery('#' + jS.id.barLeftParent + jS.i); },
			barLeftParentAll:	function() { return jQuery('div.' + jS.cl.barLeftParent); },
			cell: 				function() { return jQuery('td.' + jS.cl.cellActive); },
			cellActive:			function() { return jQuery('td.' + jS.cl.cellActive); },
			cellHighlighted:	function() { return jQuery('td.' + jS.cl.cellHighlighted); },
			controls:			function() { return jQuery('#' + jS.id.controls); },
			formula: 			function() { return jQuery('#' + jS.id.formula); },
			fx:					function() { return jQuery('#' + jS.id.fx); },
			inPlaceEdit:		function() { return jQuery('#' + jS.id.inPlaceEdit); },
			label: 				function() { return jQuery('#' + jS.id.label); },
			log: 				function() { return jQuery('#' + jS.id.log); },
			menu:				function() { return jQuery('#' + jS.id.menu); },
			pane: 				function() { return jQuery('#' + jS.id.pane + jS.i); },
			paneAll:			function() { return jQuery('div.' + jS.cl.pane); },
			parent: 			function() { return s.parent; },
			sheet: 				function() { return jQuery('#' + jS.id.sheet + jS.i); },
			sheetAll: 			function() { return jQuery('table.' + jS.cl.sheet); },
			tab:				function() { return jQuery('#' + jS.id.tab + jS.i); },
			tabAll:				function() { return jQuery('a.' + jS.cl.tab); },
			tabContainer:		function() { return jQuery('#' + jS.id.tabContainer); },
			tableBody: 			function() { return document.getElementById(jS.id.sheet + jS.i); },
			tableControl:		function() { return jQuery('#' + jS.id.tableControl + jS.i); },
			tableControlAll:	function() { return jQuery('table.' + jS.cl.tableControl); },
			ui:					function() { return jQuery('#' + jS.id.ui); },
			uiActive:			function() { return jQuery('div.' + jS.cl.uiActive); }
		},
		id: {//id = id's references
			barCorner:			'jSheetBarCorner_' + I + '_',
			barCornerParent:	'jSheetBarCornerParent_' + I + '_',
			barTop: 			'jSheetBarTop_' + I + '_',
			barTopParent: 		'jSheetBarTopParent_' + I + '_',
			barLeft: 			'jSheetBarLeft_' + I + '_',
			barLeftParent: 		'jSheetBarLeftParent_' + I + '_',
			controls:			'jSheetControls_' + I,
			formula: 			'jSheetControls_formula_' + I,
			fx:					'jSheetControls_fx_' + I,
			inPlaceEdit:		'jSheetInPlaceEdit_' + I,
			label: 				'jSheetControls_loc_' + I,
			log: 				'jSheetLog_' + I,
			menu:				'jSheetMenu_' + I,
			pane: 				'jSheetEditPane_' + I + '_',
			sheet: 				'jSheet_' + I + '_',
			tableControl:		'tableControl_' + I + '_',
			tab:				'jSheetTab_' + I,
			tabContainer:		'jSheetTabContainer_' + I,
			ui:					'jSheetUI_' + I
		},
		cl: {//cl = class references
			barCorner:			'jSheetBarCorner',
			barCornerParent:	'jSheetBarCornerParent',
			barLeftTd:			'barLeft',
			barLeft: 			'jSheetBarLeft',
			barLeftParent: 		'jSheetBarLeftParent',
			barTop: 			'jSheetBarTop',
			barTopParent: 		'jSheetBarTopParent',
			barTopTd:			'barTop',
			cellActive:			'jSheetCellActive',
			cellHighlighted: 	'jSheetCellHighighted',
			controls:			'jSheetControls',
			formula: 			'jSheetControls_formula',
			fx:					'jSheetControls_fx',
			inPlaceEdit:		'jSheetInPlaceEdit',
			menu:				'jSheetMenu',
			sheet: 				'jSheet',
			sheetPaneTd:		'sheetPane',
			label: 				'jSheetControls_loc',
			log: 				'jSheetLog',
			pane: 				'jSheetEditPane',
			tab:				'jSheetTab',
			tabContainer:		'jSheetTabContainer',
			tableControl:		'tableControl',
			toggle:				'cellStyleToggle',
			ui:					'jSheetUI',
			uiActive:			'ui-state-active',
			uiBar: 				'ui-widget-header',
			uiCellActive:		'ui-state-active',
			uiCellHighlighted: 	'ui-state-highlight',
			uiControl: 			'ui-widget-header ui-corner-top',
			uiControlTextBox:	'ui-widget-content',
			uiInPlaceEdit:		'ui-state-active',
			uiMenu:				'ui-state-highlight',
			uiMenuUl: 			'ui-widget-header',
			uiMenuLi: 			'ui-widget-header',
			uiMenuHighlighted: 	'ui-state-highlight',
			uiPane: 			'ui-widget-content',
			uiParent: 			'ui-widget-content ui-corner-all',
			uiSheet:			'ui-widget-content',
			uiTab:				'ui-widget-header',
			uiTabActive:		'ui-state-highlight'
		},
		controlFactory: {
			addRowMulti: function(qty) {
				if (!qty) {
					qty = prompt('How many rows would you like to add?');
				}
				if (qty) {
					for (var i = 0; i <= qty; i++) {
						jS.controlFactory.addRow();
					}
				}
				jS.setTdIds();
			},
			addColumnMulti: function(qty) {
				if (!qty) {
					qty = prompt('How many columns would you like to add?');
				}
				if (qty) {
					for (var i = 0; i <= qty; i++) {
						jS.controlFactory.addColumn();
					}
				}
				jS.setTdIds();
			},
			addRow: function(atRow, insertBefore, atRowQ) {
				if (!atRowQ) {
					if (!atRow && jS.rowLast > -1) {
						atRowQ = ':eq(' + jS.rowLast + ')';
					} else if (!atRow || jS.cellLast.row < 1) {
						//if atRow has no value, lets just add it to the end.
						atRowQ = ':last';
						atRow = false;
					} else if (atRow === true) {//if atRow is boolean, then lets add it just after the currently selected row.
						atRowQ = ':eq(' + (jS.cellLast.row - 1) + ')';
					} else {
						//If atRow is a number, lets add it at that row
						atRowQ = ':eq(' + (atRow - 1) + ')';
					}
				}
				
				jS.evt.cellEditAbandon();
				
				var sheet = jS.obj.sheet();
				
				var currentRow = sheet.find('tr' + atRowQ);
				var newRow = currentRow.clone();
				newRow.find('td').andSelf().height(jS.attrH.height(currentRow.find('td:first'), true));
				
				jQuery(newRow).find('td')
					.html('')
					.attr('class', '')
					.removeAttr('formula');
				if (insertBefore) {
					newRow.insertBefore(currentRow);
				} else {
					newRow.insertAfter(currentRow);
				}
				
				var currentBar = jS.obj.barLeft().find('div' + atRowQ);
				var newBar = currentBar.clone();
				
				jS.themeRoller.bar.style(newBar);
				
				newBar
					.html(parseInt(currentBar.text()) + 1)
					.removeClass(jS.cl.uiActive)
					.height(jS.attrH.height(newRow));
				
				//jS.log('New row at: ' + (parseInt(currentBar.text()) + 1));
				
				if (insertBefore) {
					newBar.insertBefore(currentBar);
				} else {
					newBar.insertAfter(currentBar);
				}
				
				if (atRow || atRowQ) {//If atRow equals anything it means that we inserted at a point, because of this we need to update the labels
					jS.obj.barLeft().find('div').each(function(i) {
						jQuery(this).text(i + 1);
					});
				}

				jS.setTdIds(sheet);
				jS.obj.pane().scroll();
				
				//offset formulas
				var loc = jS.getTdLocation(sheet.find('tr:first').find('td' + atRowQ));
				jS.offsetFormulaRange(loc[0], loc[1], 1, 0, insertBefore);
			},
			addColumn: function(atColumn, insertBefore, atColumnQ) {
				if (!atColumnQ) {
					if (!atColumn && jS.colLast > -1) {
						atColumn = ':eq(' + jS.colLast + ')';
					} else if (!atColumn || jS.cellLast.col < 1) {
						//if atColumn has no value, lets just add it to the end.
						atColumn = ':last';
					} else if (atColumn === true) {
						//if atColumn is boolean, then lets add it just after the currently selected row.
						atColumn = ':eq(' + (jS.cellLast.col - 1) + ')';
					} else {
						//If atColumn is a number, lets add it at that row
						atColumn = ':eq(' + (atColumn - 1) + ')';
					}
				} else {
					atColumn = atColumnQ;
				}

				jS.evt.cellEditAbandon();
				
				var sheet = jS.obj.sheet();
				
				//there are 3 obj that need managed here div, col, and each tr's td
				//Lets get the current div & col, then later we go through each row
				var currentBar = jS.obj.barTop().find('div' + atColumn);
				var currentCol = sheet.find('col' + atColumn);
				
				//Lets create our new bar, cell, and col
				var newBar = jQuery('<div class="' + jS.cl.uiBar + '" />').width(s.newColumnWidth - s.boxModelCorrection);
				var newCol = jQuery('<col />').width(s.newColumnWidth);
				var newCell = '<td />';
				
				//This is just to get the new label
				var currentIndex = cE.columnLabelIndex(currentBar.text());
				var newLabel = cE.columnLabelString(currentIndex + 1);
				jS.log('New Column: ' + currentIndex + ', ' + newLabel);
				
				if (insertBefore) {
					currentCol.before(newCol);
					currentBar.before(newBar);
				} else {
					currentCol.after(newCol);
					currentBar.after(newBar);
				}
					
				//Add new spreadsheet column to top
				
				var j = 0;
				var addNewCellFn;
				if (insertBefore) {
					addNewCellFn = function(o) {
						jQuery(o).find('td' + atColumn).before(newCell);
					};
				} else {
					addNewCellFn = function(o) {
						jQuery(o).find('td' + atColumn).after(newCell);
					};
				}
				
				sheet.find('tr').each(function(i) {
					addNewCellFn(this);
					j++;
				});
				
				//jS.log('Sheet length: ' + j);		
				
				if (atColumn) {//If atColumn equals anything it means that we inserted at a point, because of this we need to update the labels
					jS.obj.barTop().find('div').each(function(i) {
						jQuery(this).text(cE.columnLabelString(i + 1));
					});
				}
				
				jS.attrH.syncSheetWidthFromTds();
				
				jS.setTdIds(sheet);
				jS.obj.pane().scroll();
				
				//offset formulas
				var loc = jS.getTdLocation(sheet.find('tr:first').find('td' + atColumn));
				jS.offsetFormulaRange(loc[0], loc[1], 0, 1, insertBefore);
			},
			barLeft: function(reload, o) {//Works great!
				jS.obj.barLeft().remove();
				var barLeft = jQuery('<div border="1px" id="' + jS.id.barLeft + jS.i + '" class="' + jS.cl.barLeft + '" />').height('10000px');
				var heightFn;
				if (reload) { //This is our standard way of detecting height when a sheet loads from a url
					heightFn = function(i, objSource, objBar) {
						objBar.height(parseInt(objSource.outerHeight()) - s.boxModelCorrection);
					};
				} else { //This way of detecting height is used becuase the object has some problems getting
						//height because both tr and td have height set
						//This corrects the problem
						//This is only used when a sheet is already loaded in the pane
					heightFn = function(i, objSource, objBar) {
						objBar.height(parseInt(objSource.css('height').replace('px','')) - s.boxModelCorrection);
					};
				}
				
				jS.evt.barMouseDown.height(barLeft);
				
				o.find('tr').each(function(i) {
					var child = jQuery('<div>' + (i + 1) + '</div>');
					jQuery(barLeft).append(child);
					heightFn(i, jQuery(this), child);
				});
				barLeft.appendTo(jS.obj.barLeftParent());
			},
			barTop: function(reload, o) { //Works great!
				jS.obj.barTop().remove();
				var barTop = jQuery('<div id="' + jS.id.barTop + jS.i + '" class="' + jS.cl.barTop + '" />').width('10000px');
				barTop.height(s.colMargin);
				
				var parents;
				var widthFn;
				
				if (reload) {
					parents = o.find('tr:first td');
					widthFn = function(obj) {
						return jS.attrH.width(obj);
					};
				} else {
					parents = o.find('col');
					widthFn = function(obj) {
						return parseInt(jQuery(obj).css('width').replace('px','')) - s.boxModelCorrection;
					};
				}
				
				jS.evt.barMouseDown.width(barTop);
				
				parents.each(function(i) {
					var v = cE.columnLabelString(i + 1);
					var w = widthFn(this);
					
					var child = jQuery("<div>" + v + "</div>")
						.width(w)
						.height(s.colMargin);
					barTop.append(child);
				});
				
				jS.obj.barTopParent().append(barTop);
			},
			header: function() {
				jS.obj.controls().remove();
				jS.obj.tabContainer().remove();
				
				var header = jQuery('<div id="' + jS.id.controls + '" class="' + jS.cl.controls + '"></div>');
				
				var firstRow = jQuery('<table cellpadding="0" cellspacing="0" border="0"><tr /></table>').prependTo(header);
				var firstRowTr = jQuery('<tr />');
				
				if (s.title) {
					firstRowTr.append(jQuery('<td style="width: auto;text-align: center;" />').html(s.title));
				}
				
				if (s.inlineMenu && s.editable) {
					var inlineMenu = jQuery('<td style="text-align: center;" />').html(s.inlineMenu);
					jS.makeMenuFunctions(inlineMenu);
					firstRowTr.append(inlineMenu);
				}
				
				if (s.editable) {
					//Page Menu Control	
					if (jQuery.mbMenu) {
						jQuery('<div />').load(s.urlMenu, function(o) {
							jQuery('<td style="width: 50px; text-align: center;" id="' + jS.id.menu + '" class="rootVoices ui-corner-tl ' + jS.cl.menu + '" />')
								.html(o)
								.prependTo(firstRowTr)
								.buildMenu({
									menuWidth:		100,
									openOnRight:	false,
									containment: 	s.parent.id,
									hasImages:		false,
									fadeInTime:		0,
									fadeOutTime:	0,
									adjustLeft:		2,
									minZindex:		"auto",
									adjustTop:		10,
									opacity:		.95,
									shadow:			false,
									closeOnMouseOut:true,
									closeAfter:		1000,
									hoverIntent:	0, //if you use jquery.hoverIntent.js set this to time in milliseconds; 0= false;
									submenuHoverIntent: 0
								})
								.hover(function() {
									//not going to add to jS.cl because this isn't our control
									jQuery(this).addClass(jS.cl.uiMenu);
								}, function() {
									jQuery(this).removeClass(jS.cl.uiMenu);
								});
						});
					}
					
					//Edit box menu
					var secondRow = jQuery('<table cellpadding="0" cellspacing="0" border="0">' +
							'<tr>' +
								'<td style="width: 35px; text-align: right;" id="' + jS.id.label + '" class="' + jS.cl.label + '"></td>' +
								'<td style="width: 10px;" id="' + jS.id.fx + '" class="' + jS.cl.fx + '">fx</td>' + 
								'<td>' +
									'<textarea id="' + jS.id.formula + '" class="' + jS.cl.formula + '"></textarea>' +
								'</td>' +
							'</tr>' +
						'</table>')
						.keydown(jS.evt.keyDownHandler.formulaOnKeyDown)
						.keyup(function() {
							jS.obj.inPlaceEdit().val(jS.obj.formula().val());
						})
						.change(function() {
							jS.obj.inPlaceEdit().val(jS.obj.formula().val());
						})
						.appendTo(header);
				}
				
				firstRowTr.appendTo(firstRow);
				
				var tabParent = jQuery('<div id="' + jS.id.tabContainer + '" class="' + jS.cl.tabContainer + '">' + 
								(s.editable ? '<span class="' + jS.cl.uiTab + ' ui-corner-bottom" title="Add a spreadsheet" i="-1">+</span>' : '<span />') + 
							'</div>')
						.mousedown(jS.evt.tabOnMouseDown);

				s.parent
					.html('')
					.append(header) //add controls header
					.append('<div id="' + jS.id.ui + '" class="' + jS.cl.ui + '">') //add spreadsheet control
					.after(tabParent);
			},
			sheet: function(size) {
				if (!size) {
					size = s.buildSheet;
				}
				size = size.toLowerCase().split('x');

				var columnsCount = parseInt(size[0]);
				var rowsCount = parseInt(size[1]);
				
				//Create elements before loop to make it faster.
				var newSheet = jQuery('<table border="1px" class="' + jS.cl.sheet + '" id="' + jS.id.sheet + jS.i + '"></table>');
				var standardTd = '<td> </td>';
				var tds = '';
				
				//Using -- is many times faster than ++
				for (var i = columnsCount; i >= 1; i--) {
					tds += standardTd;
				}

				var standardTr = '<tr height="' + s.colMargin + '" style="height: ' + s.colMarg + ';">' + tds + '</tr>';
				var trs = '';
				for (var i = rowsCount; i >= 1; i--) {
					trs += standardTr;
				}
				
				newSheet.html('<tbody>' + trs + '</tbody>');
				
				newSheet.width(columnsCount * s.newColumnWidth);
				
				return newSheet;
			},
			sheetUI: function(o, i, fn, reloadBars) {
				if (!i) {
					//jQuery('.tableControl').remove();
					jS.sheetCount = 0;
					jS.i = 0;
				} else {
					jS.sheetCount++;
					jS.i = jS.sheetCount;
					i = jS.i;
				}
				
				var objContainer = jS.controlFactory.table().appendTo(jS.obj.ui());
				jS.obj.pane().html(o);
						
				jS.tuneTableForSheetUse(o);
							
				jS.sheetDecorate(o);
				
				jS.controlFactory.barTop(reloadBars, o);
				jS.controlFactory.barLeft(reloadBars, o);
			
				jS.sheetTab(true);
				
				if (s.editable) {
					o
						.mousedown(jS.evt.cellOnMouseDown);
					if (s.lockFormulas) {
						o
							.click(jS.evt.cellOnClickLocked);
					} else {
						o
							.click(jS.evt.cellOnClickReg)
							.dblclick(jS.evt.cellOnDblClick);
					}
				}
				
				jS.themeRoller.start(i);

				jS.setTdIds(o);
				
				jS.evt.scrollBars();
				
				jS.addTab();
				
				if (fn) {
					fn();
				}
				
				jS.log('Sheet Initialized');
				
				return objContainer;
			},
			table: function() {
				return jQuery('<table cellpadding="0" cellspacing="0" border="0" id="' + jS.id.tableControl + jS.i + '" class="' + jS.cl.tableControl + '">' +
					'<tbody>' +
						'<tr>' + 
							'<td id="' + jS.id.barCornerParent + jS.i + '" class="' + jS.cl.barCornerParent + '">' + //corner
								'<div style="height: ' + s.colMargin + '; width: ' + s.colMargin + ';" id="' + jS.id.barCorner + jS.i + '" class="' + jS.cl.barCorner +'" onClick="jS.cellSetActiveAll();" title="Select All">&nbsp;</div>' +
							'</td>' + 
							'<td class="' + jS.cl.barTopTd + '">' + //barTop
								'<div id="' + jS.id.barTopParent + jS.i + '" class="' + jS.cl.barTopParent + '"></div>' +
							'</td>' +
						'</tr>' +
						'<tr>' +
							'<td class="' + jS.cl.barLeftTd + '">' + //barLeft
								'<div style="width: ' + s.colMargin + ';" id="' + jS.id.barLeftParent + jS.i + '" class="' + jS.cl.barLeftParent + '"></div>' +
							'</td>' +
							'<td class="' + jS.cl.sheetPaneTd + '">' + //pane
								'<div id="' + jS.id.pane + jS.i + '" class="' + jS.cl.pane + '"></div>' +
							'</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>');
			},
			chart: function(type, data, legend, axisLabels, w, h, row) {
				if (jGCharts) {
					var api = new jGCharts.Api();
					function refine(v) {
						var refinedV = new Array();
						jQuery(v).each(function(i) {
							refinedV[i] = jS.manageHtmlToText(v[i] + '');
						});
						return refinedV;
					}
					var o = {};
					
					if (type) {
						o.type = type;
					}
					
					if (data) {
						data = data.filter(function(v) { return (v ? v : 0); }); //remove nulls
						o.data = data;
					}
					
					if (legend) {
						o.legend = refine(legend);
					}
					
					if (axisLabels) {
						o.axis_labels = refine(axisLabels);
					}
					
					if (w || h) {
						o.size = w + 'x' + h;
					}
					
					return jS.controlFactory.safeImg(api.make(o), row);
				} else {
					return jQuery('<div>Charts are not enabled</div>');
				}
			},
			safeImg: function(src, row) {
				return jQuery('<img />')
					.hide()
					.load(function() { //prevent the image from being too big for the row
						jQuery(this).fadeIn(function() {
							jQuery(this).addClass('safeImg');
							jS.attrH.setHeight(parseInt(row), 'cell', false);
						});
					})
					.attr('src', src);
			},
			inPlaceEdit: function(td) {
				jS.obj.inPlaceEdit().remove();
				var formula = jS.obj.formula();
				var offset = td.offset();
				var style = td.attr('style');
				var w = td.width();
				var h = td.height();
				var textarea = jQuery('<textarea id="' + jS.id.inPlaceEdit + '" class="' + jS.cl.inPlaceEdit + ' ' + jS.cl.uiInPlaceEdit + '" />')
					.css('left', offset.left)
					.css('top', offset.top)
					.width(w)
					.height(h)
					.keydown(jS.evt.inPlaceEditOnKeyDown)
					.keyup(function() {
						formula.val(jQuery(this).val());
					})
					.change(function() {
						formula.val(jQuery(this).val());
					})
					.appendTo('body')
					.val(formula.val())
					.focus()
					.select();
				
				//Make the textarrea resizeable automatically
				if (jQuery.fn.elastic) {
					textarea.elastic();
				}
			}
		},
		sizeSync: {
		
		},
		evt: {
			keyDownHandler: {
				enterOnInPlaceEdit: function(e) {
					if (!e.shiftKey) {
						return jS.evt.cellSetFocus(key.DOWN);
					} else {
						return true;
					}
				},
				enter: function(e) {
					if (!jS.cellLast.isEdit && !e.ctrlKey) {
						jS.cellLast.td.dblclick();
						return false;
					} else {
						return jS.evt.cellSetFocus(key.DOWN);
					}
				},
				tab: function(e) {
					if (e.shiftKey) {
						return jS.evt.cellSetFocus(key.LEFT);
					} else {
						return jS.evt.cellSetFocus(key.RIGHT);
					}
				},
				pasteOverCells: function(e) { //used for pasting from other spreadsheets
					if (e.ctrlKey) {
						var formula = jS.obj.formula(); //so we don't have to keep calling the function and wasting memory
						var oldVal = formula.val();
						formula.val('');  //we use formula to catch the pasted data
						jQuery(document).one('keyup', function() {
							var loc = jS.getTdLocation(jS.cellLast.td); //save the currrent cell
							var val = formula.val(); //once ctrl+v is hit formula now has the data we need
							var firstValue = '';
							formula.val(''); 
							
							var row = val.split(/\n/g); //break at rows
							for (var i = 0; i < row.length; i++) {
								var col = row[i].split(/\t/g); //break at columns
								for (var j = 0; j < col.length; j++) {
									if (col[j]) {
										var td = jQuery(jS.getTd(jS.i, i + loc[0], j + loc[1]));
											
										if ((col[j] + '').charAt(0) == '=') { //we need to know if it's a formula here
											td.attr('formula', col[j]);
										} else {
											td
												.html(col[j])
												.removeAttr('formula'); //we get rid of formula because we don't know if it was a formula, to check may take too long
										}
										
										if (i == 0 && j == 0) { //we have to finish the current edit
											firstValue = col[j];
										}
									}
								}
							}
							
							
							formula.val(firstValue);
							jS.setDirty(true);
							jS.evt.cellEditDone(true);
						});
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
				formulaOnKeyDown: function(e) {
					switch (e.keyCode) {
						case key.ESCAPE: 	jS.evt.cellEditAbandon();
							break;
						case key.TAB: 		return jS.evt.keyDownHandler.tab(e);
							break;
						case key.ENTER: 	return jS.evt.keyDownHandler.enter(e);
							break;
						case key.LEFT:
						case key.UP:
						case key.RIGHT:
						case key.DOWN:		return jS.evt.cellSetFocus(e.keyCode);
							break;
						case key.V:			return jS.evt.keyDownHandler.pasteOverCells(e);
							break;
						case key.Y:			return jS.evt.keyDownHandler.redo(e);
							break;
						case key.Z:			return jS.evt.keyDownHandler.undo(e);
							break;
						case key.CONTROL: //we need to filter these to keep cell state
						case key.CAPS_LOCK:
						case key.SHIFT:
						case key.ALT:
						case key.UP:
						case key.DOWN:
						case key.LEFT:
						case key.RIGHT:
							break;
						case key.HOME:		jS.cellLast.td.parent()
												.find('td:first').click();
							break;
						case key.END:
											jS.cellLast.td.parent()
												.find('td:last').click();
							break;
						default: 			jS.cellLast.isEdit = true;
					}
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
			cellEditDone: function(forceCalc) {
				switch (jS.cellLast.isEdit) {
					case true:
						// Any changes to the input controls are stored back into the table, with a recalc.
						jS.obj.inPlaceEdit().remove();
						var td = jS.cellLast.td;
						var recalc = false;
						
						//Lets ensure that the cell being edited is actually active
						if (td) { 
							//first, let's make it undoable before we edit it
							jS.cellUndoable.add(td);
							
							//This should return either a val from textbox or formula, but if fails it tries once more from formula.
							var formula = jS.obj.formula();
							var v = jS.manageTextToHtml(formula.val());
							var prevVal = td.html();

							if (v.charAt(0) == '=') {
								td
									.attr('formula', v)
									.html('');
							} else {
								td
									.removeAttr('formula')
									.html(v);
							}
							
							if (v != prevVal || forceCalc) {
								jS.calc(jS.i);
							}
							
							jS.attrH.setHeight(jS.cellLast.row, 'cell');
							
							//Save the newest version of that cell
							jS.cellUndoable.add(td);
							
							formula.focus().select();
							jS.cellLast.isEdit = false;
							s.fnAfterCellEdit(jS.cellLast);
							jS.setDirty(true);
						}
						break;
					default:
						jS.attrH.setHeight(jS.cellLast.row, 'cell', false);
				}
			},
			cellEditAbandon: function(skipCalc) {
				jS.obj.inPlaceEdit().remove();
				jS.themeRoller.cell.clearActive();
				jS.themeRoller.bar.clearActive();
				if (!skipCalc) {
					jS.calc(jS.i);
				}
				
				jS.cellLast.td = jQuery('<td />');
				jS.cellLast.row = jS.cellLast.col = 0;
				jS.rowLast = jS.colLast = -1;
				
				jS.fxUpdate('', true);
				jS.obj.formula()
					.val('');
				return false;
			},
			cellSetFocus: function(keyCode) { //invoces a click on next/prev cell
				var c = jS.cellLast.col;
				var r = jS.cellLast.row;
				
				switch (keyCode) {
					case key.UP: 		r--; break;
					case key.DOWN: 		r++; break;
					case key.LEFT: 		c--; break;
					case key.RIGHT: 	c++; break;
				}
				
				jQuery(jS.getTd(jS.i, r, c)).click();
				
				return false;
			},
			cellOnMouseDown: function(e) {
				if (e.shiftKey) {
					jS.cellSetActiveMulti(e);
					jQuery(document).one('mouseup', function() {
						var v = jS.obj.formula().val();
						jS.obj.formula().val(v + jS.getTdRange());
					});
					
					return false;
				} else {
					return jS.cellSetActiveMulti(e);
				}			
			},
			cellOnClickLocked: function(e) {
				if (!isNaN(e.target.cellIndex)) {
					if (!jQuery(e.target).attr('formula')) {
						jS.cellEdit(jQuery(e.target));
					}
				} else {
					jS.evt.cellEditAbandon();
					jS.obj.formula().focus().select();
				}
			},
			cellOnClickReg: function(e) {
				if (!isNaN(e.target.cellIndex)) {
					jS.cellEdit(jQuery(e.target));
				} else { //this won't be a cell
					var clickable = jQuery(e.target).hasClass('clickable');
					if (!clickable) {
						jS.obj.formula().focus().select();
					}
				}
			},
			cellOnDblClick: function(e) {
				jS.cellLast.isEdit = jS.isSheetEdit = true;
				jS.controlFactory.inPlaceEdit(jS.cellLast.td);
				jS.log('click, in place edit activated');
			},
			tabOnMouseDown: function(e) {
				var i = jQuery(e.target).attr('i');
				
				if (i != '-1' && i != jS.i) {
					jS.setActiveSheet(jQuery('#' + jS.id.tableControl + i), i); jS.calc(i);
				} else if (i != '-1' && jS.i == i) {
					jS.sheetTab();
				} else {
					jS.addSheet();
				}
				return false;
			},
			resizeBar: function(e, o) {
				//Resize Column & Row & Prototype functions are private under class jSheet		
				var target = jQuery(e.target);
				var resizeBar = {
					start: function(e) {
						
						jS.log('start resize');
						//I never had any problems with the numbers not being ints but I used the parse method
						//to ensuev non-breakage
						o.offset = target.offset();
						o.tdPageXY = [o.offset.left, o.offset.top][o.xyDimension];
						o.startXY = [e.pageX, e.pageY][o.xyDimension];
						o.i = o.getIndex(target);
						o.srcBarSize = o.getSize(target);
						o.edgeDelta = o.startXY - (o.tdPageXY + o.srcBarSize);
						o.min = 10;
						
						if (s.joinedResizing) {
							o.resizeFn = function(size) {
								o.setDesinationSize(size);
								o.setSize(target, size);
							};
						} else {
							o.resizeFn = function(size) {
								o.setSize(target, size);
							};
						}
						
						//We start the drag sequence
						if (Math.abs(o.edgeDelta) <= o.min) {
							//some ui enhancements, lets the user know he's resizing
							jQuery(e.target).parent().css('cursor', o.cursor);
							
							jQuery(document)
								.mousemove(resizeBar.drag)
								.mouseup(resizeBar.stop);
							
							return true; //is resizing
						} else {
							return false; //isn't resizing
						}
					},
					drag: function(e) {
						var newSize = o.min;

						var v = o.srcBarSize + ([e.pageX, e.pageY][o.xyDimension] - o.startXY);
						if (v > 0) {// A non-zero minimum size saves many headaches.
							newSize = Math.max(v, o.min);
						}

						o.resizeFn(newSize);
						return false;
					},
					stop: function(e) {
						o.setDesinationSize(o.getSize(target));
						
						jQuery(document)
							.unbind('mousemove')
							.unbind('mouseup');

						jS.obj.formula()
							.focus()
							.select();
						
						target.parent().css('cursor', 'pointer');
						
						jS.log('stop resizing');
					}
				};
				
				return resizeBar.start(e);
			},
			scrollBars: function(killTimer) {
				var o = { //cut down on recursion, grabe them once
					pane: jS.obj.pane(), 
					barLeft: jS.obj.barLeftParent(), 
					barTop: jS.obj.barTopParent()
				};
				
				jS.obj.pane().scroll(function() {
					o.barTop.scrollLeft(o.pane.scrollLeft());//2 lines of beautiful jQuery js
					o.barLeft.scrollTop(o.pane.scrollTop());
				});
			},
			barMouseDown: {
				select: function(o, e, selectFn, resizeFn) {
					var isResizing = jS.evt.resizeBar(e, resizeFn);
							
					if (!isResizing) {
						selectFn(e.target);
						o
							.unbind('mouseover')
							.mouseover(function(e) {
								selectFn(e.target);
							})
							.mouseup(function() {
								o
									.unbind('mouseover')
									.unbind('mouseup');
							});
					}
					
					return false;
				},
				first: 0,
				last: 0,
				height: function(o) {			
					var selectRow = function () {};
					
					o //let any user resize
						.unbind('mousedown')
						.mousedown(function(e) {
							jS.evt.barMouseDown.first = jS.evt.barMouseDown.last = jS.rowLast = jS.getBarLeftIndex(e.target);
							jS.evt.barMouseDown.select(o, e, selectRow, jS.rowResizer);
							
							return false;
						});
					if (s.editable) { //only let editable select
						selectRow = function(o, keepCurrent) {
							if (!keepCurrent) { 
								jS.themeRoller.cell.clearHighlighted();
								jS.themeRoller.bar.clearActive();
							}
							
							var i = jS.getBarLeftIndex(o);
							
							jS.rowLast = i; //keep track of last row for inserting new rows
							
							jS.evt.barMouseDown.last = i;
							
							jS.cellSetActiveMultiRow(jS.evt.barMouseDown.first, jS.evt.barMouseDown.last);
						};
					}
				},
				width: function(o) {
					var selectColumn = function() {};
					
					o //let any user resize
						.unbind('mousedown')
						.mousedown(function(e) {
							jS.evt.barMouseDown.first = jS.evt.barMouseDown.last = jS.colLast = jS.getBarTopIndex(e.target);
							jS.evt.barMouseDown.select(o, e, selectColumn, jS.columnResizer);
							
							return false;
						});
					if (s.editable) { //only let editable select
						selectColumn = function(o, keepCurrent) {
							if (!keepCurrent) { 
								jS.themeRoller.cell.clearHighlighted();
								jS.themeRoller.bar.clearActive();
							}
							var i = jS.getBarTopIndex(o);
							
							jS.colLast = i; //keep track of last column for inserting new columns
							
							jS.evt.barMouseDown.last = i;
							
							jS.cellSetActiveMultiColumn(jS.evt.barMouseDown.first, jS.evt.barMouseDown.last);
						};
					}
				}
			}
		},
		makeMenuFunctions: function(o) {
			o.find(".addRowAfter").click(function() { jS.controlFactory.addRow(); });
			o.find(".addRowBefore").click(function() { jS.controlFactory.addRow(null, true); });
			o.find(".addRowEnd").click(function() { jS.controlFactory.addRow(null, null, ':last'); });
			o.find(".addRowMulti").click(function() { jS.controlFactory.addRowMulti(); });
			o.find(".deleteRow").click(function() { jS.deleteRow(); });
			o.find(".addColAfter").click(function() { jS.controlFactory.addColumn(); });
			o.find(".addColBefore").click(function() { jS.controlFactory.addColumn(null, true); });
			o.find(".addColEnd").click(function() { jS.controlFactory.addColumn(null, null, ':last'); });
			o.find(".addColMulti").click(function() { jS.controlFactory.addColumnMulti(); });
			o.find(".deleteCol").click(function() { jS.deleteColumn(); });
			o.find(".getCellRange").click(function() { jS.appendToFormula("(" + jS.getTdRange() + ")"); });
			o.find(".saveSheets").click(function() { s.fnSave(); });
			o.find(".deleteSheet").click(function() { jS.deleteSheet(); });
			o.find(".refreshCalc").click(function() { jS.calc(jS.i); });
			o.find(".cellFind").click(function() { jS.cellFind(); });
			o.find(".styleBold").click(function() { jS.cellStyleToggle('styleBold'); });
			o.find(".styleItalic").click(function() { jS.cellStyleToggle('styleItalics'); });
			o.find(".styleUnderline").click(function() { jS.cellStyleToggle('styleUnderline', 'styleLineThrough'); });
			o.find(".styleStrikethrough").click(function() { jS.cellStyleToggle('styleLineThrough', 'styleUnderline'); });
			o.find(".styleLeft").click(function() { jS.cellStyleToggle('styleLeft', 'styleCenter styleRight'); });
			o.find(".styleCenter").click(function() { jS.cellStyleToggle('styleCenter', 'styleLeft styleRight'); });
			o.find(".styleRight").click(function() { jS.cellStyleToggle('styleRight', 'styleLeft styleCenter'); });
			o.find(".fillDown").click(function() { jS.fillUpOrDown(); });
			o.find(".fillUp").click(function() { jS.fillUpOrDown(true); });
			o.find(".addLink").click(function() { jS.obj.formula().val('=HYPERLINK(\'' + prompt('Enter Web Address', 'http://www.visop-dev.com/') + '\')').keydown(); });
		},
		tuneTableForSheetUse: function(o) {
			o
				.addClass(jS.cl.sheet)
				.attr('id', jS.id.sheet + jS.i)
				.attr('border', '1px');
			o.find('td.' + jS.cl.cellActive).removeClass(jS.cl.cellActive);
		},
		attrH: {//Attribute Helpers
		//I created this object so I could see, quickly, which attribute was most stable.
		//As it turns out, all browsers are different, thus this has evolved to a much uglier beast
			width: function(o, skipCorrection) {
				return jQuery(o).outerWidth() - (skipCorrection ? 0 : s.boxModelCorrection);
			},
			widthReverse: function(o, skipCorrection) {
				return jQuery(o).outerWidth() + (skipCorrection ? 0 : s.boxModelCorrection);
			},
			height: function(o, skipCorrection) {
				return jQuery(o).outerHeight() - (skipCorrection ? 0 : s.boxModelCorrection);
			},
			heightReverse: function(o, skipCorrection) {
				return jQuery(o).outerHeight() + (skipCorrection ? 0 : s.boxModelCorrection);
			},
			syncSheetWidthFromTds: function(o) {
				var w = 0;
				o = (o ? o : jS.obj.sheet());
				o.find('col').each(function() {
					w += jQuery(this).width();
				})
				o.width(w);
				return w;
			},
			setHeight: function(i, from, skipCorrection, o) {
				var correction = 0;
				var h = 0;
				var fn;
				
				switch(from) {
					case 'cell':
						o = (o ? o : jS.obj.barLeft().find('div').eq(i));
						h = jS.attrH.height(jQuery(jS.getTd(jS.i, i, 0)).parent().andSelf(), skipCorrection);
						break;
					case 'bar':
						o = (o ? o : jQuery(jS.getTd(jS.i, i, 0)).parent().andSelf());
						h = jS.attrH.heightReverse(jS.obj.barLeft().find('div').eq(i), skipCorrection);
						break;
				}
				
				if (h) {
					jQuery(o)
						.height(h)
						.css('height', h)
						.attr('height', h);
				}

				return o;
			}
		},
		setTdIds: function(o) {
			o = (o ? o : jS.obj.sheet());
			o.find('tr').each(function(row) {
				jQuery(this).find('td').each(function(col) {
					jQuery(this).attr('id', jS.getTdId(jS.i, row, col));
				});
			});
		},
		setControlIds: function() {
			var resetIds = function(o, id) {
				o.each(function(i) {
					jQuery(this).attr('id', id + i);
				});
			};
			
			resetIds(jS.obj.sheetAll().each(function() {
				jS.setTdIds(jQuery(this));
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
		columnResizer: {
			xyDimension: 0,
			getIndex: function(td) {
				return jS.getBarTopIndex(td);
			},
			getSize: function(o) {
				return jS.attrH.width(o, true);
			},
			setSize: function(o, v) {
				o.width(v);
			},
			setDesinationSize: function(w) {
				jS.sheetSyncSizeToDivs();
				
				jS.obj.sheet().find('col').eq(this.i)
					.width(w)
					.css('width', w)
					.attr('width', w);
				
				jS.obj.pane().scroll();
			},
			cursor: 'w-resize'
		},
		rowResizer: {
			xyDimension: 1,
				getIndex: function(o) {
					return jS.getBarLeftIndex(o);
				},
				getSize: function(o) {
					return jS.attrH.height(o, true);
				},
				setSize: function(o, v) {
					if (v) {
					o
						.height(v)
						.css('height', v)
						.attr('height', v);
					}
					return jS.attrH.height(o);
				},
				setDesinationSize: function() {
					//Set the cell height
					jS.attrH.setHeight(this.i, 'bar', true);
					
					//Reset the bar height if the resized row don't match
					jS.attrH.setHeight(this.i, 'cell', false);
					
					jS.obj.pane().scroll();
				},
				cursor: 's-resize'
		},
		toggleHide: {//These are not ready for prime time
			row: function(i) {
				if (!i) {//If i is empty, lets get the current row
					i = jS.obj.cell().parent().attr('rowIndex');
				}
				if (i) {//Make sure that i equals something
					var o = jS.obj.barLeft().find('div').eq(i);
					if (o.is(':visible')) {//This hides the current row
						o.hide();
						jS.obj.sheet().find('tr').eq(i).hide();
					} else {//This unhides
						//This unhides the currently selected row
						o.show();
						jS.obj.sheet().find('tr').eq(i).show();
					}
				} else {
					alert('No row selected.');
				}
			},
			rowAll: function() {
				jS.obj.sheet().find('tr').show();
				jS.obj.barLeft().find('div').show();
			},
			column: function(i) {
				if (!i) {
					i = jS.obj.cell().attr('cellIndex');
				}
				if (i) {
					//We need to hide both the col and td of the same i
					var o = jS.obj.barTop().find('div').eq(i);
					if (o.is(':visible')) {
						jS.obj.sheet().find('tbody tr').each(function() {
							jQuery(this).find('td').eq(i).hide();
						});
						o.hide();
						jS.obj.sheet().find('colgroup col').eq(i).hide();
						jS.toggleHide.columnSizeManage();
					}
				} else {
					alert('Now column selected.');
				}
			},
			columnAll: function() {
			
			},
			columnSizeManage: function() {
				var w = jS.obj.barTop().width();
				var newW = 0;
				var newW = 0;
				jS.obj.barTop().find('div').each(function() {
					var o = jQuery(this);
					if (o.is(':hidden')) {
						newW += o.width();
					}
				});
				jS.obj.barTop().width(w);
				jS.obj.sheet().width(w);
			}
		},
		merge: function() {
			var cellsValue = "";
			var cellValue = "";
			var cells = jS.obj.cellHighlighted();
			var formula;
			var cellFirstLoc = jS.getTdLocation(cells.first());
			var cellLastLoc = jS.getTdLocation(cells.last());
			var colI = (cellLastLoc[1] - cellFirstLoc[1]) + 1;
			
			if (cells.length > 1 && cellFirstLoc[0]) {
				for (var i = cellFirstLoc[1]; i <= cellLastLoc[1]; i++) {
					var cell = jQuery(jS.getTd(jS.i, cellFirstLoc[0], i)).hide();
					formula = cell.attr('formula');
					cellValue = cell.html();
					
					cellValue = (cellValue ? cellValue + ' ' : '');
					
					cellsValue = (formula ? "(" + formula.replace('=', '') + ")" : cellValue) + cellsValue;
					
					if (i != cellFirstLoc[1]) {
						cell
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
				jS.calc(jS.i);
			} else if (!cellFirstLoc[0]) {
				alert('Merging is not allowed on the first row.');
			}
		},
		unmerge: function() {
			var cell = jS.obj.cellHighlighted().first();
			var loc = jS.getTdLocation(cell);
			var formula = cell.attr('formula');
			var v = cell.html();
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
			
			for (var i = loc[1]; i < colI; i++) {
				jQuery(jS.getTd(jS.i, loc[0], i)).show();
			}
			
			cell.removeAttr('colspan');
			
			jS.setDirty(true);
			jS.calc(jS.i);
		},
		fillUpOrDown: function(goUp, skipOffsetForumals) { //default behavior is to go down var goUp changes it
			var cells = jS.obj.cellHighlighted();
			var cellActive = jS.obj.cellActive();
			var cellActiveClone = cellActive.clone();
			var startFromActiveCell = cellActive.hasClass(jS.cl.uiCellHighlighted);
			var locFirst = jS.getTdLocation(cells.first());
			var locLast = jS.getTdLocation(cells.last());
			
			var v = jS.obj.formula().val();
			var fn;
			
			var formulaOffset = (startFromActiveCell ? 0 : 1);
			
			if ((v + '').charAt(0) == '=') {
				fn = function(o, i) {
					o
						.attr('formula', (skipOffsetForumals ? v : jS.offsetFormula(v, i + formulaOffset, 0)))
						.html(''); //we subtract one here because cells are 1 based and indexes are 0 based
				}
			} else {
				fn = function (o) {
					o
						.removeAttr('formula')
						.html(v);
				}
			}
			
			function fill(r, c, i) {
				var td = jQuery(jS.getTd(jS.i, r, c));
				fn(td, i);
			}
			
			var k = 0;
			if (goUp) {
				for (var i = locLast[0]; i >= locFirst[0]; i--) {
					for (var j = locLast[1]; j >= locFirst[1]; j--) {
						fill(i, j, k);
						k++;
					}
				}
			} else {
				for (var i = locFirst[0]; i <= locLast[0]; i++) {
					for (var j = locFirst[1]; j <= locLast[1]; j++) {
						fill(i, j, k);
						k++;
					}
				}
			}
			
			cellActive.replaceWith(cellActiveClone); //this is to make sure the original doesn't increment;
			
			jS.calc(jS.i);
		},
		offsetFormulaRange: function(row, col, rowOffset, colOffset, isBefore) {//col = int; offset = int
			var shiftedRange = {
				first: [(row ? row : 0), (col ? col : 0)],
				last: jS.sheetSize()
			};
			
			if (!isBefore && rowOffset) { //this shift is from a row
				shiftedRange.first[0]++;
				shiftedRange.last[0]++;
			}
			
			if (!isBefore && colOffset) { //this shift is from a col
				shiftedRange.first[1]++;
				shiftedRange.last[1]++;
			}
			
			function isInFormula(loc) {
				if ((loc[0]) >= shiftedRange.first[0] &&
					(loc[1]) >= shiftedRange.first[1] &&
					(loc[0]) <= shiftedRange.last[0] &&
					(loc[1]) <= shiftedRange.last[1]
				) {
					return true;
				} else {
					return false;
				}
			}
			
			function isInFormulaRange(startLoc, endLoc) {
				if (
					(
						(startLoc[0] - 1) > shiftedRange.first[0] &&
						(startLoc[1] - 1) > shiftedRange.first[1]
					) && (
						(startLoc[0] - 1) < shiftedRange.last[0] &&
						(startLoc[1] - 1) < shiftedRange.last[1]
					) && (
						(endLoc[0] - 1) > shiftedRange.first[0] &&
						(endLoc[1] - 1) > shiftedRange.first[1]
					) && (
						(endLoc[0] - 1) < shiftedRange.last[0] &&
						(endLoc[1] - 1) < shiftedRange.last[1]
					)
				) {
					return true;
				} else {
					return false;
				}
			}
			
			function reparseFormula(loc) {
				return ( //A1
					cE.columnLabelString(loc[1] + colOffset) + (loc[0] + rowOffset)
				);
			}
			
			function reparseFormulaRange(startLoc, endLoc) {
				return ( //A1:B4
					(cE.columnLabelString(startLoc[1] + colOffset) + (startLoc[0] + rowOffset)) + ':' + 
					(cE.columnLabelString(endLoc[1] + colOffset) + (endLoc[0] + rowOffset))
				);
			}
			
			jS.cylceCells(function (td) {
				var formula = td.attr('formula');
				
				if (formula) {
					formula = formula.replace(cE.regEx.cell, 
						function(ignored, colStr, rowStr, pos) {
							var charAt = [formula.charAt(pos - 1), formula.charAt(ignored.length + pos)]; //find what is exactly before and after formula
							if (!colStr.match('SHEET') &&
								charAt[0] != ':' &&
								charAt[1] != ':'
							) { //verify it's not a range or an exact location
								
								var colI = cE.columnLabelIndex(colStr);
								var rowI = parseInt(rowStr);
								
								if (isInFormula([rowI, colI])) {
									return reparseFormula([rowI, colI]);
								} else {
									return ignored;
								}
							} else {
								return ignored;
							}
					});
					formula = formula.replace(cE.regEx.range, 
						function(ignored, startColStr, startRowStr, endColStr, endRowStr, pos) {
							var charAt = [formula.charAt(pos - 1), formula.charAt(ignored.length + pos)]; //find what is exactly before and after formula
							if (!startColStr.match('SHEET') &&
								charAt[0] != ':'
							) {
								
								var startRowI = parseInt(startRowStr);
								var startColI = cE.columnLabelIndex(startColStr);
								
								var endRowI = parseInt(endRowStr);
								var endColI = cE.columnLabelIndex(endColStr);
								
								if (isInFormulaRange([startRowI, startColI], [endRowI, endColI])) {
									return reparseFormulaRange([startRowI, startColI], [endRowI, endColI]);
								} else {
									return ignored;
								}
							} else {
								return ignored;
							}
					});
					
					td.attr('formula', formula);
				}

			}, [0, 0], shiftedRange.last);
			
			jS.calc(jS.i);
		},
		cylceCells: function(fn, firstLoc, lastLoc) {
			for (var i = firstLoc[0]; i < lastLoc[0]; i++) {
				for (var j = firstLoc[1]; j < lastLoc[1]; j++) {
					fn(jQuery(jS.getTd(jS.i, i, j)));
				}
			}
		},
		offsetFormula: function(formula, rowOffset, colOffset, includeRanges) {		
			//Cell References Fixed
			var charAt = [];
			var col = '';
			var row = '';
			formula = formula.replace(cE.regEx.cell, 
				function(ignored, colStr, rowStr, pos) {
					charAt[0] = formula.charAt(pos - 1);
					charAt[1] = formula.charAt(ignored.length + pos);
					
					charAt[0] = (charAt[0] ? charAt[0] : '');
					charAt[1] = (charAt[1] ? charAt[1] : '');
					
					if (colStr.match('SHEET') || 
						charAt[0] == ':' || 
						charAt[1] == ':'
					) { //verify it's not a range or an exact location
						return ignored;
					} else {
						row = parseInt(rowStr) + rowOffset;
						col = cE.columnLabelIndex(colStr) + colOffset;
						row = (row > 0 ? row : '1'); //table rows are never negative
						col = (col > 0 ? col : '1'); //table cols are never negative
						
						return cE.columnLabelString(col) + row;
					}
				}
			);
			return formula;
		},
		addTab: function() {
			jQuery('<span class="' + jS.cl.uiTab + ' ui-corner-bottom">' + 
					'<a class="' + jS.cl.tab + '" id="' + jS.id.tab + jS.i + '" i="' + jS.i + '">' + jS.sheetTab(true) + '</a>' + 
				'</span>')
					.insertBefore(
						jS.obj.tabContainer().find('span:last')
					);
		},
		sheetDecorate: function(o) {	
			jS.formatSheet(o);
			jS.sheetSyncSizeToCols(o);
			jS.sheetDecorateRemove();
		},
		formatSheet: function(o) {
			if (o.find('tbody').length < 1) {
				o.wrapInner('<tbody />');
			}
			
			if (o.find('colgroup').length < 1 || o.find('col').length < 1) {
				o.remove('colgroup');
				var colgroup = jQuery('<colgroup />');
				o.find('tr:first').find('td').each(function() {
					var w = jQuery(this).outerWidth() + (s.boxModelCorrection * 2);
					jQuery('<col />')
						.width(w)
						.css('width', (w) + 'px')
						.attr('width', (w) + 'px')
						.appendTo(colgroup);
				});
				o.find('tr').each(function() {
					jQuery(this)
						.height(s.colMargin)
						.css('height', s.colMargin + 'px')
						.attr('height', s.colMargin + 'px');
				});
				colgroup.prependTo(o);
			}
		},
		themeRoller: {
			start: function() {
				//Style sheet			
				jS.obj.parent().addClass(jS.cl.uiParent);
				jS.obj.sheet().addClass(jS.cl.uiSheet);
				//Style bars
				jS.obj.barLeft().find('div').addClass(jS.cl.uiBar);
				jS.obj.barTop().find('div').addClass(jS.cl.uiBar);
				jS.obj.barCornerParent().addClass(jS.cl.uiBar);
				
				jS.obj.controls().addClass(jS.cl.uiControl);
				jS.obj.fx().addClass(jS.cl.uiControl);
				jS.obj.label().addClass(jS.cl.uiControl);
				jS.obj.formula().addClass(jS.cl.uiControlTextBox);
			},
			cell: {
				setActive: function() {
					this.clearActive();
					this.clearHighlighted();
					jS.cellLast.td
						.addClass(jS.cl.cellActive + ' ' + jS.cl.uiCellActive + ' ' + jS.cl.cellHighlighted + ' ' + jS.cl.uiCellHighlighted);
				},
				setHighlighted: function(td) {
					jQuery(td)
						.addClass(jS.cl.cellHighlighted + ' ' + jS.cl.uiCellHighlighted);
				},
				clearActive: function() {
					jS.obj.cellActive()
						.removeClass(jS.cl.cellActive + ' ' + jS.cl.uiCellActive + ' ' + jS.cl.cellHighlighted + ' ' + jS.cl.uiCellHighlighted);
				},
				clearHighlighted: function() {
					jS.obj.cellHighlighted()
						.removeClass(jS.cl.cellHighlighted + ' ' + jS.cl.uiCellHighlighted);
				}
			},
			bar: {
				style: function(o) {
					jQuery(o).addClass(jS.cl.uiBar);
				},
				setActive: function(direction, i) {
					//We don't clear here because we can have multi active bars
					switch(direction) {
						case 'top': jS.obj.barTop().find('div').eq(i).addClass(jS.cl.uiActive);
							break;
						case 'left': jS.obj.barLeft().find('div').eq(i).addClass(jS.cl.uiActive);
							break;
					}
				},
				clearActive: function() {
					jS.obj.barTop().add(jS.obj.barLeft()).find('div.' + jS.cl.uiActive)
						.removeClass(jS.cl.uiActive);
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
			resize: function() {
				// add resizable jquery.ui if available
				if (jQuery.ui) {
					// resizable container div
					var o;
					var barTop;
					var barLeft;
					var controlsHeight;
					var parent = s.parent;
					
					parent.resizable('destroy').resizable({
						minWidth: s.width * 0.5,
						minHeight: s.height * 0.5,
						start: function() {
							jS.obj.ui().hide();
						},
						stop: function() {
							jS.obj.ui().show();
							s.width = parent.width();
							s.height = parent.height();
							jS.sheetSyncSize();
						}
					});
					// resizable formula area - a bit hard to grab the handle but is there!
					var formulaResizeParent = jQuery('<span />');
					jS.obj.formula().wrap(formulaResizeParent).parent().resizable({
						minHeight: jS.obj.formula().height(), 
						maxHeight: 78,
						handles: 's',
						resize: function(e, ui) {
							jS.obj.formula().height(ui.size.height);
							jS.sheetSyncSize();
						}
					});
				}
			}
		},
		manageHtmlToText: function(v) {
			v = jQuery.trim(v);
			if (v.charAt(0) != "=") {
				v = v.replace(/&nbsp;/g, ' ')
					.replace(/&gt;/g, '>')
					.replace(/&lt;/g, '<')
					.replace(/\t/g, '')
					.replace(/\n/g, '')
					.replace(/<br>/g, '\r')
					.replace(/<BR>/g, '\n');

				//jS.log("from html to text");
			}
			return v;
		},
		manageTextToHtml: function(v) {	
			v = jQuery.trim(v);
			if (v.charAt(0) != "=") {
				v = v.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
					.replace(/ /g, '&nbsp;')
					.replace(/>/g, '&gt;')
					.replace(/</g, '&lt;')
					.replace(/\n/g, '<br>')
					.replace(/\r/g, '<br>');
				
				//jS.log("from text to html");
			}
			return v;
		},
		sheetDecorateRemove: function(makeClone) {
			var o = (makeClone ? jS.obj.sheetAll().clone() : jS.obj.sheetAll());
			
			//Get rid of highlighted cells and active cells
			jQuery(o).find('td.' + jS.cl.cellActive)
				.removeClass(jS.cl.cellActive + ' ' + jS.cl.uiCellActive);
				
			jQuery(o).find('td.' + jS.cl.cellHighlighted)
				.removeClass(jS.cl.cellHighlighted + ' ' + jS.cl.uiCellHighlighted);
				
			//IE Bug, match width with css width
			jQuery(o).find('col').each(function(i) {
				var v = jQuery(this).css('width');
				v = ((v + '').match('px') ? v : v + 'px');
				jQuery(o).find('col').eq(i).attr('width', v);
			});
			
			return o;
		},
		fxUpdate: function(v, setDirect) {
			if (!setDirect) {
				jS.obj.label().html(cE.columnLabelString(v[1] + 1) + (v[0] + 1));
			} else {
				jS.obj.label().html(v);
			}
		},
		cellEdit: function(td) {
			//This finished up the edit of the last cell
			jS.evt.cellEditDone();
			jS.followMe(td);
			var loc = jS.getTdLocation(td);
			
			//Show where we are to the user
			jS.fxUpdate(loc);
			
			var v = td.attr('formula');
			if (!v) {
				v = jS.manageHtmlToText(td.html());
			}
			
			jS.obj.formula()
				.val(v)
				.focus()
				.select();
			jS.cellSetActive(td, loc);
		},
		cellSetActive: function(td, loc) {
			jS.cellLast.td = td; //save the current cell/td
			jS.cellLast.row = jS.rowLast = loc[0];
			jS.cellLast.col = jS.colLast = loc[1];
			
			jS.themeRoller.bar.clearActive();
			
			jS.themeRoller.cell.setActive(); //themeroll the cell and bars
			jS.themeRoller.bar.setActive('left', jS.cellLast.row);
			jS.themeRoller.bar.setActive('top', jS.cellLast.col);
		},
		colLast: 0,
		rowLast: 0,
		cellLast: {
			td: jQuery('<td />'), //this is a dud td, so that we don't get errors
			row: -1,
			col: -1,
			isEdit: false
		},
		cellStyleToggle: function(setClass, removeClass) {
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
			
			jS.obj.formula()
				.focus()
				.select();
			return false;
		},
		context: {},
		calc: function(tableI, fuel) {
			jS.log('Calculation Started');
			if (!s.calcOff) {
				cE.calc(new jS.tableCellProvider(tableI), jS.context, fuel);
				jS.isSheetEdit = false;
			}
			jS.log('Calculation Ended');
		},
		refreshLabelsColumns: function(){
			var w = 0;
			jS.obj.barTop().find('div').each(function(i) {
				jQuery(this).text(cE.columnLabelString(i+1));
				w += jQuery(this).width();
			});
			return w;
		},
		refreshLabelsRows: function(){
			jS.obj.barLeft().find('div').each(function(i) {
				jQuery(this).text((i + 1));
			});
		},
		addSheet: function(size) {
			size = (size ? size : prompt(jS.newSheetDialog));
			if (size) {
				jS.evt.cellEditAbandon();
				jS.setDirty(true);
				var newSheetControl = jS.controlFactory.sheetUI(jS.controlFactory.sheet(size), jS.sheetCount + 1, function() { 
					jS.setActiveSheet(newSheetControl, jS.sheetCount + 1);
				}, true);
			}
		},
		deleteSheet: function() {
			jS.obj.tableControl().remove();
			jS.obj.tabContainer().children().eq(jS.i).remove();
			jS.i = 0;
			jS.sheetCount--;
			
			jS.setControlIds();
			
			jS.setActiveSheet(jS.obj.tableControl(), jS.i);
		},
		deleteRow: function() {
			var v = confirm("Are you sure that you want to delete that row?");
			if (v) {
				jS.obj.barLeft().find('div').eq(jS.rowLast).remove();
				jS.obj.sheet().find('tr').eq(jS.rowLast).remove();
				
				jS.evt.cellEditAbandon();
				
				jS.setTdIds();
				jS.refreshLabelsRows();
				jS.obj.pane().scroll();
				
				jS.rowLast = -1;
				
				jS.offsetFormulaRange(jS.rowLast, 0, -1, 0);
			}		
		},
		deleteColumn: function() {
			var v = confirm("Are you sure that you want to delete that column?");
			if (v) {
				jS.obj.barTop().find('div').eq(jS.colLast).remove();
				jS.obj.sheet().find('colgroup col').eq(jS.colLast).remove();
				jS.obj.sheet().find('tr').each(function(i) {
						jQuery(this).find('td').eq(jS.colLast).remove();
				});
				
				jS.evt.cellEditAbandon();
				
				var w = jS.refreshLabelsColumns();
				jS.setTdIds();
				jS.obj.sheet().width(w);
				jS.obj.pane().scroll();
				
				jS.colLast = -1;
				
				jS.offsetFormulaRange(0, jS.colLast, 0, -1);
			}		
		},
		sheetTab: function(get) {
			var sheetTab = '';
			if (get) {
				sheetTab = jS.obj.sheet().attr('title');
				sheetTab = (sheetTab ? sheetTab : 'Spreadsheet ' + (jS.i + 1));
			} else if (s.editable) { //ensure that the sheet is editable, then let them change the sheet's name
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
			return sheetTab;
		},
		print: function(o) {
			var w = window.open();
			w.document.write("<html><body><xmp>" + o + "\n</xmp></body></html>");
			w.document.close();
		},
		viewSource: function(pretty) {
			var sheetClone = jS.sheetDecorateRemove(true);
			
			var s = "";
			if (pretty) {
				jQuery(sheetClone).each(function() {
					s += jS.HTMLtoPrettySource(this);
				});
			} else {
				s += jQuery('<div />').html(sheetClone).html();
			}
			
			jS.print(s);
			
			return false;
		},
		saveSheet: function() {
			var v = jS.sheetDecorateRemove(true);
			var d = jQuery('<div />').html(v).html();

			jQuery.ajax({
				url: s.urlSave,
				type: 'POST',
				data: 's=' + d,
				dataType: 'html',
				success: function(data) {
					jS.setDirty(false);
					alert('Success! - ' + data);
				}
			});
		},
		HTMLtoCompactSource: function(node) {
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

				if (node.tagName == "TABLE" && !hasClass) {
					// IE hack, where class doesn't appear in attributes.
					result += ' class="jSheet"';
				}
				if (node.tagName == "COL") {
					// IE hack, which doesn't like <COL..></COL>.
					result += '/>';
				} else {
					result += ">";
					var childResult = "";
					jQuery(node.childNodes).each(function() {
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
		HTMLtoPrettySource: function(node, prefix) {
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
		followMe: function(td) {
			var pane = jS.obj.pane();
			var panePos = pane.position();
			var paneWidth = pane.width();
			var paneHeight = pane.height();
			
			var tdPos = td.position();
			var tdWidth = td.width();
			var tdHeight = td.height();
			
			var margin = 20;
			
			if ((tdPos.left + tdWidth + margin) > (panePos.left + paneWidth)) { //right
				pane.stop().scrollTo(td, {
					axis: 'x',
					duration: 50,
					offset: - ((paneWidth - tdWidth) - margin)
				});
			} else if (tdPos.left < panePos.left) { //left
				pane.stop().scrollTo(td, {
					axis: 'x',
					duration: 50
				});
			}
			
			if ((tdPos.top + tdHeight + margin) > (panePos.top + paneHeight)) { //bottom
				pane.stop().scrollTo(td, {
					axis: 'y',
					duration: 50,
					offset: - ((paneHeight - tdHeight) - margin)
				});
			} else if (tdPos.top < panePos.top) { //top
				pane.stop().scrollTo(td, {
					axis: 'y',
					duration: 50
				});
			}
		},
		count: {
			rows: function() {
				return jS.getBarLeftIndex(jS.obj.barLeft().find('div:last').text());
			},
			columns: function() {
				return jS.getBarTopLocatoin(jS.obj.barTop().find('div:last').text());
			}
		},
		isRowHeightSync: [],
		setActiveSheet: function(o, i) {
			
			
			if (o) {
				o.show().siblings().hide();
				jS.i = i;			
			} else {
				jS.obj.tableControl().siblings().not('div').hide();
				i = 0;
			}
			
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
			
			jS.sheetSyncSize();
			jS.replaceWithSafeImg(jS.obj.sheet().find('img'));
		},
		openSheetURL: function ( url ) {
			s.urlGet = url;
			return jS.openSheet();
		},
		openSheet: function(o) {
			if (!jS.isDirty ? true : confirm("Are you sure you want to open a different sheet?  All unsaved changes will be lost.")) {
				jS.controlFactory.header();
				
				var fnAfter = function(i, l) {
					if (i == (l - 1)) {
						jS.i = 0;
						jS.setActiveSheet();
						jS.themeRoller.resize();
						for (var i = 0; i <= jS.sheetCount; i++) {
							jS.calc(i);
						}
						
						s.fnAfter();
					}
				};
				
				if (!o) {
					jQuery('<div />').load(s.urlGet, function() {
						var sheets = jQuery(this).find('table');
						sheets.each(function(i) {
							jS.controlFactory.sheetUI(jQuery(this), i, function() { 
								fnAfter(i, sheets.length);
							}, true);
						});
					});
				} else {
					var sheets = jQuery('<div />').html(o).find('table');
					sheets.show().each(function(i) {
						jS.controlFactory.sheetUI(jQuery(this), i,  function() { 
							fnAfter(i, sheets.length);
						}, false);
					});
				}
				
				jS.setDirty(false);
				
				return true;
			} else {
				return false;
			}
		},
		newSheetDialog: "What size would you like to make your spreadsheet? Example: '5x10' creates a sheet that is 5 columns by 10 rows.",
		newSheet: function() {
			var size = prompt(jS.newSheetDialog);
			if (size) {
				jS.openSheet(jS.controlFactory.sheet(size));
			}
		},
		importRow: function(rowArray) {
			jS.controlFactory.addRow(null, null, ':last');

			var error = "";
			jS.obj.sheet().find('tr:last td').each(function(i) {
				jQuery(this).removeAttr('formula');
				try {
					//To test this, we need to first make sure it's a string, so converting is done by adding an empty character.
					if ((rowArray[i] + '').charAt(0) == "=") {
						jQuery(this).attr('formula', rowArray[i]);					
					} else {
						jQuery(this).html(rowArray[i]);
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
			jS.calc(jS.i);
		},
		importColumn: function(columnArray) {
			jS.controlFactory.addColumn();

			var error = "";
			jS.obj.sheet().find('tr').each(function(i) {
				var o = jQuery(this).find('td:last');
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
			jS.calc(jS.i);
		},
		importSheet: {
			xml: function (data) { //Will not accept CDATA tags
				var table = jQuery('<table />');
				var tbody = jQuery('<tbody />').appendTo(table);
				
				jQuery(data).find('document').each(function() { //document
					var metaData = jQuery(this).find('metadata');
					var columnCount = metaData.find('columns').text();
					var rowCount = metaData.find('rows').text();
					var title = metaData.find('title').html();
					jQuery(this).find('data').children().each(function(i) { //rows
						var thisRow = jQuery('<tr />');
						jQuery(this).children().each(function(j) { //columns
							var o = jQuery(this).html();
							var style = jQuery(this).attr('style');
							if (o.charAt(0) == '=') {
								thisRow.append('<td formula="' + o + '"' + (style ? ' style=\"' + style + '\"' : '') + ' />');
							} else {
								thisRow.append('<td>' + o + '</td>');
							}
						});
						tbody.append(thisRow);
					});
				});
				
				return table;
			},
			json: function(data, makeEval) {
				sheet = (makeEval == true ? eval('(' + data + ')') : data);
				
				var tables = jQuery('<div />');
				
				for (var i = 0; i < sheet.length; i++) {
					jS.i = jS.sheetCount + 1;
					size_c = parseInt(sheet[i].metadata.columns) - 1;
					size_r = parseInt(sheet[i].metadata.rows) - 1;
					title = sheet[i].metadata.title;
					title = (title ? title : "Sreadsheet " + jS.i);
				
					var table = jQuery("<table id='" + jS.id.sheet + jS.i + "' class='" + jS.cl.sheet + "' title='" + title + "' />");
					
					for (var x = 0; x <= size_r; x++) {				
						var cur_row = jQuery('<tr />').appendTo(table);
						
						for(var y = 0; y <= size_c; y++) {	
							var cur_val = sheet[i].data["r" + (x + 1)]["c" + (y + 1)].value;
							var style = sheet[i].data["r" + (x + 1)]["c" + (y + 1)].style;
							
							var cur_td = jQuery('<td id="' + 'table' + jS.i + '_' + 'cell_c' + y + '_r' + x + '" ' + (style ? ' style=\"' + style + '\"' : '' ) + ' />');
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
						
							cur_row.append(cur_td);

						}
					}
					
					tables.append(table);
				}
				return tables.children();
			}
		},
		exportSheet: {
			xml: function (skipCData) {
				var sheetClone = jS.sheetDecorateRemove(true);			
				var result = "";
				
				var cdata = ['<![CDATA[',']]>'];
				
				if (skipCData) {
					cdata = ['',''];
				}
				
				jQuery(sheetClone).each(function() {
					var x = '';
					var title = jQuery(this).attr('title');
					
					var count = 0;
					var cur_column = cur_row = '';
					var max_column = max_row = 0;
					jQuery(this).find('tr').each(function(i){
						count = 0;
						max_row = i;
						jQuery(this).find('td').each(function(){
							count++;
							
							var id = jQuery(this).attr('id');
							var txt = jQuery.trim(jQuery(this).text());
							var pos = id.search(/cell_c/i);
							var pos2 = id.search(/_r/i);
							
							if (txt != '' && pos != -1 && pos2 != -1) {
								cur_column = id.substr(pos+6, pos2-(pos+6));
								cur_row = id.substr(pos2+2);
								
								if (max_column < cur_column) max_column = cur_column;
								
								if (max_row < cur_row) max_row = cur_row;
								
								if (count == 1) x += '<r'+cur_row+'>';
								
								var formula = jQuery(this).attr('formula');
								if (formula)
								{
									txt = formula;
								}
								
								var style = jQuery(this).attr('style');
								
								x += '<c' + cur_column + '' + (style ? ' style=\"' + style + '\"' : '') + '>' + cdata[0] + txt + cdata[1] + '</c' + cur_column + '>';
							}
						});
						
						if (cur_row != '')
							x += '</r'+cur_row+'>';
						cur_column = cur_row = '';
					});
					
					result += '<document>' + 
								'<metadata>' + 
									'<columns>' + (parseInt(max_column) + 1) + '</columns>' +  //length is 1 based, index is 0 based
									'<rows>' + (parseInt(max_row) + 1) + '</rows>' +  //length is 1 based, index is 0 based
									'<title>' + title + '</title>' + 
								'</metadata>' + 
								'<data>' + x + '</data>' + 
							'</document>';
				});
				
				return '<documents>' + result + '</documents>';
			},
			json: function() {
				var sheetClone = jS.sheetDecorateRemove(true);
				var docs = []; //documents
				
				jQuery(sheetClone).each(function() {
					var doc = { //document
						metadata:{},
						data:{}
					};
					
					var count = 0;
					var cur_column = cur_row = '';
					var max_column = max_row = 0;
					jQuery(this).find('tr').each(function(){
						count = 0;
						jQuery(this).find('td').each(function(){
							count++;
							
							var id = jQuery(this).attr('id');
							var txt = jQuery.trim(jQuery(this).text());
							var pos = id.search(/cell_c/i);
							var pos2 = id.search(/_r/i);
							
							if (txt != '' && pos != -1 && pos2 != -1) {
								cur_column = id.substr(pos+6, pos2-(pos+6));
								cur_row = id.substr(pos2+2);
								
								if (max_column < cur_column) max_column = cur_column;
								
								if (max_row < cur_row) max_row = cur_row;
								
								if (count == 1) doc['data']['r' + cur_row] = {};
								
								var formula = jQuery(this).attr('formula');
								if (formula)
								{
									txt = formula;
								}
								
								var style = jQuery(this).attr('style');
								
								try {
									doc['data']['r'+cur_row]['c'+cur_column] = {
										value: txt,
										style: style
									};
								} catch (e) {}
							}
						});
						
						
						cur_column = cur_row = '';
					});
					doc['metadata'] = {
						columns: parseInt(max_column) + 1, //length is 1 based, index is 0 based
						rows: parseInt(max_row) + 1, //length is 1 based, index is 0 based
						title: jQuery(this).attr('title')
					};
					docs.push(doc); //append to documents
				});
				return docs;
			},
			html: function() {
				return jS.sheetDecorateRemove(true);
			}
		},
		sheetSyncSizeToDivs: function() {
			var newSheetWidth = 0;
			jS.obj.barTop().find('div').each(function() {
				newSheetWidth += parseInt(jQuery(this).outerWidth());
			});
			jS.obj.sheet().width(newSheetWidth);
		},
		sheetSyncSizeToCols: function(o) {
			var newSheetWidth = 0;
			o.find('colgroup col').each(function() {
				newSheetWidth += jQuery(this).width();
			});
			o.width(newSheetWidth);
		},
		sheetSyncSize: function() {
			var h = s.height;
			if (!h) {
				h = 400; //Height really needs to be set by the parent
			} else if (h < 200) {
				h = 200;
			}
			
			jS.obj.parent().height(h);
			
			var w = s.width - jS.attrH.width(jS.obj.barLeftParent()) - (s.boxModelCorrection);
			
			h = h - jS.attrH.height(jS.obj.controls()) - jS.attrH.height(jS.obj.barTopParent()) - (s.boxModelCorrection * 2);
			
			jS.obj.pane()
				.height(h)
				.width(w)
				.parent()
					.width(w);
			
			jS.obj.ui()
				.width(w + jS.attrH.width(jS.obj.barLeftParent()));
					
			jS.obj.barLeftParent()
				.height(h);
			
			jS.obj.barTopParent()
				.width(w)
				.parent()
					.width(w);
		},
		cellFind: function(v) {
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
					o.click();
				} else {
					alert('No results found.');
				}
			}
		},
		cellSetActiveMulti: function(e) {
			var o = {
				startRow: e.target.parentNode.rowIndex,
				startColumn: e.target.cellIndex
			};//These are the events used to selected multiple rows.
			jS.obj.sheet()
				.mousemove(function(e) {
					jS.themeRoller.cell.clearHighlighted();
					
					o.endRow = e.target.parentNode.rowIndex;
					o.endColumn = e.target.cellIndex;
					
					for (var i = (o.startRow < o.endRow ? o.startRow : o.endRow) ; i <= (o.startRow > o.endRow ? o.startRow : o.endRow); i++) {
						for (var j = (o.startColumn < o.endColumn ? o.startColumn : o.endColumn); j <= (o.startColumn > o.endColumn ? o.startColumn : o.endColumn); j++) {
							jS.themeRoller.cell.setHighlighted(jS.getTd(jS.i, i, j));
						}
					}
				})
				.mouseup(function() {
					jS.obj.sheet()
						.unbind('mousemove')
						.unbind('mouseup');
				});
				
				//this helps with multi select so that when you are selecting cells you don't select the text within them
				if (jQuery(e.target).attr('id') != jS.cellLast.td.attr('id') && jQuery(e.target).hasClass('clickable') == false) {
					jS.themeRoller.cell.clearHighlighted();
					return false;
				}
		},
		cellSetActiveAll: function() {
			if (s.editable) {
				var rowCount = 0;
				var colCount = 0;
				
				jS.obj.barLeft().find('div').each(function(i) {
					jS.cellSetActiveMultiRow(i, i);
					rowCount++;
				});
				jS.obj.barTop().find('div').each(function(i) {
					jS.themeRoller.bar.setActive('top', i);
					colCount++;
				});
				
				jS.fxUpdate('A1:' + cE.columnLabelString(colCount) + rowCount, true);
			}
		},
		cellSetActiveMultiColumn: function(colStart, colEnd) {
			var loc = jS.sheetSize();
			for (var i = (colStart < colEnd ? colStart : colEnd); i <= (colEnd > colStart ? colEnd : colStart); i++) {
				for (var j = 0; j <= loc[0]; j++) {
					jS.themeRoller.cell.setHighlighted(jS.getTd(jS.i, j, i));
				}
				jS.themeRoller.bar.setActive('top', i);
			}
		},
		cellSetActiveMultiRow: function(rowStart, rowEnd) {
			for (var i = (rowStart < rowEnd ? rowStart : rowEnd); i <= (rowEnd > rowStart ? rowEnd : rowStart); i++) {
				jS.themeRoller.cell.setHighlighted(jS.obj.sheet().find('tr').eq(i).find('td'));
				jS.themeRoller.bar.setActive('left', i);
			}
		},
		sheetClearActive: function() {
			jS.obj.formula().val('');
			jS.obj.barSelected().removeClass(jS.cl.barSelected);
		},
		getTdRange: function() {
			//three steps here,
			//Get td's
			//Get locations
			//Get labels for locationa and return them
			
			var cells = jS.obj.cellHighlighted();
			
			if (cells.length) {
				var loc = { //tr/td column and row index
					first: jS.getTdLocation(cells.first()),
					last: jS.getTdLocation(cells.last())
				};
				
				//Adjust 0 based tr/td to cell/column/row index
				loc.first[0]++;
				loc.first[1]++;
				loc.last[0]++;
				loc.last[1]++;
				
				var label = {
					first: cE.columnLabelString(loc.first[1]) + loc.first[0],
					last: cE.columnLabelString(loc.last[1]) + loc.last[0]
				};
				
				return label.first + ":" + label.last;
			} else {
				return '';
			}
		},
		getTdId: function(tableI, row, col) {
			return I + '_table' + tableI + '_cell_c' + col + '_r' + row;
		},
		getTd: function(tableI, row, col) {
			return document.getElementById(jS.getTdId(tableI, row, col));
		},
		getTdLocation: function(td) {
			var col = parseInt(td[0].cellIndex);
			var row = parseInt(td[0].parentNode.rowIndex);
			return [row, col];
			// The row and col are 1-based.
		},
		getBarLeftIndex: function(o) {
			var i = jQuery.trim(jQuery(o).text());
			return parseInt(i) - 1;
		},
		getBarTopIndex: function(o) {
			var i = cE.columnLabelIndex(jQuery.trim(jQuery(o).text()));
			return parseInt(i) - 1;
		},
		tableCellProvider: function(tableI) {
			this.tableBodyId = 'jSheet' + tableI;
			this.tableI = tableI;
			this.cells = {};
		},
		tableCell: function(tableI, row, col) {
			this.tableBodyId = 'jSheet' + tableI;
			this.tableI = tableI;
			this.row = row;
			this.col = col;
			this.value = jS.EMPTY_VALUE;
			
			//this.prototype = new cE.cell();
		},
		EMPTY_VALUE: {},
		time: {
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
			jS.obj.log().prepend(jS.time.get() + ', ' + jS.time.diff() + '; ' + msg + '<br />\n');
		},
		replaceWithSafeImg: function(o) {  //ensures all pictures will load and keep their respective bar the same size.
			o.each(function() {			
				var src = jQuery(this).attr('src');
				jQuery(this).replaceWith(jS.controlFactory.safeImg(src, jS.getTdLocation(jQuery(this).parent())[0]));
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
		cellUndoable: {
			undoOrRedo: function(undo) {
				if (!undo && this.i > 0) {
					this.i--;
				} else if (undo && this.i < this.stack.length) {
					this.i++;
				}
				
				this.get().clone().each(function() {
					var o = jQuery(this);
					var id = o.attr('undoable');
					if (id) {
						jQuery('#' + id).replaceWith(
							o
								.removeAttr('undoable')
								.attr('id', id)
						);
					} else {
						jS.log('Not available.');
					}
				});
				
				jS.themeRoller.cell.setActive(jS.cellLast.td);
			},
			get: function() { //gets the current cell
				return jQuery(this.stack[this.i]);
			},
			add: function(tds) {
				var oldTds = tds.clone().each(function() {
					var o = jQuery(this);
					var id = o.attr('id');
					o.removeAttr('id'); //id can only exist in one location, on the sheet, so here we use the id as the attr 'undoable'
					o.attr('undoable', id);
				});
				if (this.stack.length > 0) {
					this.stack.unshift(oldTds);
				} else {
					this.stack = [oldTds];
				}
				this.i = -1;
				if (this.stack.length > 20) { //undoable count, we want to be careful of too much memory consumption
					this.stack.pop(); //drop the last value
				}
			},
			i: 0,
			stack: []
		},
		sheetSize: function() {
			return jS.getTdLocation(jS.obj.sheet().find('td:last'));
		}
	};

	jS.tableCellProvider.prototype = {
		getCell: function(tableI, row, col) {
			if (typeof(col) == "string") {
				col = cE.columnLabelIndex(col);
			}
			var key = tableI + "," + row + "," + col;
			var cell = this.cells[key];
			if (!cell) {
				var td = jS.getTd(tableI, row - 1, col - 1);
				if (td) {
					cell = this.cells[key] = new jS.tableCell(tableI, row, col);
				}
			}
			return cell;
		},
		getNumberOfColumns: function(row) {
			var tableBody = document.getElementById(this.tableBodyId);
			if (tableBody) {
				var tr = tableBody.rows[row];
				if (tr) {
					return tr.cells.length;
				}
			}
			return 0;
		},
		toString: function() {
			result = "";
			jQuery('#' + (this.tableBodyId) + ' tr').each(function() {
				result += this.innerHTML.replace(/\n/g, "") + "\n";
			});
			return result;
		}
	};

	jS.tableCell.prototype = {
		getTd: function() {
			return document.getElementById(jS.getTdId(this.tableI, this.row - 1, this.col - 1));
		},
		setValue: function(v, e) {
			this.error = e;
			this.value = v;
			jQuery(this.getTd()).html(v ? v: ""); //I know this is slower than innerHTML = '', but sometimes stability just rules!
		},
		getValue: function() {
			var v = this.value;
			if (v === jS.EMPTY_VALUE && !this.getFormula()) {
				v = this.getTd().innerHTML;
				v = this.value = (v.length > 0 ? cE.parseFormulaStatic(v) : null);

			}
			return (v === jS.EMPTY_VALUE ? null: v);
		},
		getFormat: function() {
			return jQuery(this.getTd()).attr("format");
		},
		setFormat: function(v) {
			jQuery(this.getTd()).attr("format", v);
		},
		getFormulaFunc: function() {
			return this.formulaFunc;
		},
		setFormulaFunc: function(v) {
			this.formulaFunc = v;
		},
		getFormula: function() {
			return jQuery(this.getTd()).attr('formula');
		},
		setFormula: function(v) {
			if (v && v.length > 0) {
				jQuery(this.getTd()).attr('formula', v);
			} else {
				jQuery(this.getTd()).removeAttr('formula');
			}
		}
	};

	var cE = { //Calculations Engine
		TEST: {},
		ERROR: "#VALUE!",
		cFN: {//cFN = compiler functions, usually mathmatical
			sum: 	function(x, y) { return x + y; },
			max: 	function(x, y) { return x > y ? x: y; },
			min: 	function(x, y) { return x < y ? x: y; },
			count: 	function(x, y) { return (y != null) ? x + 1: x; },
			clean: function(v) {
				if (typeof(v) == 'string') {
					v = v.replace(cE.regEx.amp, '&')
							.replace(cE.regEx.nbsp, ' ')
							.replace(/\n/g,'')
							.replace(/\r/g,'');
				}
				return v;
			},
			input: {
				select: {
					obj: function() { return jQuery('<select style="width: 100%;" onchange="cE.cFN.input.setValue(jQuery(this).val(), jQuery(this).parent());" class="clickable" />'); }
				},
				radio: {
					obj: function(v) {
						var radio = jQuery('<span class="clickable" />');
						var name = cE.cFN.input.radio.name();
						for (var i = 0; i < (v.length <= 25 ? v.length : 25); i++) {
							if (v[i]) {
								radio.append('<input onchange="cE.cFN.input.setValue(jQuery(this).val(), jQuery(this).parent().parent());" type="radio" value="' + v[i] + '" name="' + name + '" />' + v[i] + '<br />');
							}
						}
						return radio;
					},
					name: function() {
						return 'table' + cE.thisCell.tableI + '_cell_c' + (cE.thisCell.col - 1) + '_r' + (cE.thisCell.row - 1) + 'radio';
					}
				},
				checkbox: {
					obj: function(v) {
						return jQuery('<input onclick="cE.cFN.input.setValue(jQuery(this).is(\':checked\') + \'\', jQuery(this).parent());" type="checkbox" value="' + v + '" />' + v + '<br />');
					}
				},
				setValue: function(v, p) {
					p.attr('selectedvalue', v);
					jS.calc(cE.calcState.i);
				},
				getValue: function() {
					return jQuery(jS.getTd(cE.thisCell.tableI, cE.thisCell.row - 1, cE.thisCell.col - 1)).attr('selectedvalue');
				}
			}
		},
		fn: {//fn = standard functions used in cells
			HTML: function(v) {
				return jQuery(v);
			},
			IMG: function(v) {
				return jS.controlFactory.safeImg(v, cE.calcState.row, cE.calcState.col);
			},
			AVERAGE:	function(values) { 
				var arr = cE.foldPrepare(values, arguments);
				return cE.fn.SUM(arr) / cE.fn.COUNT(arr); 
			},
			AVG: 		function(values) { 
				return cE.fn.AVERAGE(values);
			},
			COUNT: 		function(values) { return cE.fold(cE.foldPrepare(values, arguments), cE.cFN.count, 0); },
			SUM: 		function(values) { return cE.fold(cE.foldPrepare(values, arguments), cE.cFN.sum, 0, true); },
			MAX: 		function(values) { return cE.fold(cE.foldPrepare(values, arguments), cE.cFN.max, Number.MIN_VALUE, true); },
			MIN: 		function(values) { return cE.fold(cE.foldPrepare(values, arguments), cE.cFN.min, Number.MAX_VALUE, true); },
			ABS	: 		function(v) { return Math.abs(cE.fn.N(v)); },
			CEILING: 	function(v) { return Math.ceil(cE.fn.N(v)); },
			FLOOR: 		function(v) { return Math.floor(cE.fn.N(v)); },
			INT: 		function(v) { return Math.floor(cE.fn.N(v)); },
			ROUND: 		function(v, decimals) {
				return cE.fn.FIXED(v, (decimals ? decimals : 0), false);
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
			IF:			function(v, t, f){
				t = cE.cFN.clean(t);
				f = cE.cFN.clean(f);
				
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
				var n = String(Math.round(cE.fn.N(v) * x) / x); 
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
				
				var r = cE.fn.FIXED(v, decimals, false);
				
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
							  if (typeof(v) == 'string') {v = parseFloat(v.replace(cE.regEx.n, ''));}
							  if (isNaN(v))		   {return 0;}
							  if (typeof(v) == 'number') {return v;}
							  if (v == true)			 {return 1;}
							  return 0; },
			PI: 		function() { return Math.PI; },
			POWER: 		function(x, y) {
				return Math.pow(x, y);
			},
			
			//Note, form objects are experimental, they don't work always as expected
			INPUT: {
				SELECT:	function(v, noBlank) {
					v = cE.foldPrepare(v, arguments);
					
					var selectObj = cE.cFN.input.select.obj();
					
					if (!noBlank) {
						selectObj.append('<option value="">Select a value</option>');
					}
					
					for (var i = 0; i < (v.length <= 50 ? v.length : 50); i++) {
						if (v[i]) {
							selectObj.append('<option value="' + v[i] + '">' + v[i] + '</option>');
						}
					}
					
					selectObj.val(cE.cFN.input.getValue());
					
					return selectObj;
				},
				SELECTVAL:	function(v) {
					return jQuery(v).val();
				},
				RADIO: function(v) {
					v = cE.foldPrepare(v, arguments);
					var o = cE.cFN.input.radio.obj(v);
					
					o.find('input[value="' + cE.cFN.input.getValue() + '"]').attr('CHECKED', 'true');
					
					return o;
				},
				RADIOVAL: function(v) {
					v = cE.foldPrepare(v, arguments);
					return jQuery(v).find('input:checked').val();
				},
				CHECKBOX: function(v) {
					v = cE.foldPrepare(v, arguments)[0];
					var o = cE.cFN.input.checkbox.obj(v);
					var checked = cE.cFN.input.getValue();
					if (checked == 'true' || checked == true) {
						o.attr('CHECKED', 'TRUE');
					} else {
						o.removeAttr('CHECKED');
					}
					return o;
				},
				CHECKBOXVAL: function(v) {
					v = cE.foldPrepare(v, arguments);
					return jQuery(v).val();
				},
				ISCHECKED:		function(v) {
					var checked = jQuery(v).is(":checked");
					if (checked) {
						return 'TRUE';
					} else {
						return 'FALSE';
					}
				}
			},
			CHART: {
				BAR:	function(v, legend, axisLabels, w, h) {
					return jS.controlFactory.chart(null, cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
				},
				BARH:	function(v, legend, axisLabels, w, h) {
					return jS.controlFactory.chart('bhg', cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
				},
				SBAR:	function(v, legend, axisLabels, w, h) {
					return jS.controlFactory.chart('bvs', cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
				},
				SBARH:	function(v, legend, axisLabels, w, h) {
					return jS.controlFactory.chart('bhs', cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
				},
				LINE:	function(v, legend, axisLabels, w, h) {
					return jS.controlFactory.chart('lc', cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
				},
				PIE:	function(v, legend, axisLabels, w, h) {
					return jS.controlFactory.chart('p', cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
				},
				PIETHREED:	function(v, legend, axisLabels, w, h) {
					return jS.controlFactory.chart('p3', cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
				},
				CUSTOM:	function(type, v, legend, axisLabels, w, h) {
					return jS.controlFactory.chart(type, cE.foldPrepare(v, arguments), legend, axisLabels,  w, h, cE.calcState.row - 1);
				}
			}
		},
		calcState: {},
		calc: function(cellProvider, context, startFuel) {
			// Returns null if all done with a complete calc() run.
			// Else, returns a non-null continuation function if we ran out of fuel.  
			// The continuation function can then be later invoked with more fuel value.
			// The fuelStart is either null (which forces a complete calc() to the finish) 
			// or is an integer > 0 to slice up long calc() runs.  A fuelStart number
			// is roughly matches the number of cells to visit per calc() run.
			cE.calcState = { 
				cellProvider:	cellProvider, 
				context: 		(context != null ? context: {}),
				row: 			1, 
				col: 			1,
				i:				cellProvider.tableI,
				done:			false,
				stack:			[],
				calcMore: 		function(moreFuel) {
									cE.calcState.fuel = moreFuel;
									return cE.calcLoop();
								}
			};
			return cE.calcState.calcMore(startFuel);
		},
		cell: function() {
			prototype: {// Cells don't know their coordinates, to make shifting easier.
				getError = 			function()	 { return this.error; },
				getValue = 			function()	 { return this.value; },
				setValue = 			function(v, e) { this.value = v; this.error = e; },
				getFormula	 = 		function()  { return this.formula; },	 // Like "=1+2+3" or "'hello" or "1234.5"
				setFormula	 = 		function(v) { this.formula = v; },
				getFormulaFunc = 	function()  { return this.formulaFunc; },
				setFormulaFunc = 	function(v) { this.formulaFunc = v; },
				toString = 			function() { return "Cell:[" + this.getFormula() + ": " + this.getValue() + ": " + this.getError() + "]"; };
			}
		}, // Prototype setup is later.
		columnLabelIndex: function(str) {
			// Converts A to 1, B to 2, Z to 26, AA to 27.
			var num = 0;
			for (var i = 0; i < str.length; i++) {
				var digit = str.charCodeAt(i) - 65 + 1;	   // 65 == 'A'.
				num = (num * 26) + digit;
			}
			return num;
		},
		parseLocation: function(locStr) { // With input of "A1", "B4", "F20",
			if (locStr != null &&								  // will return [1,1], [4,2], [20,6].
				locStr.length > 0 &&
				locStr != "&nbsp;") {
				for (var firstNum = 0; firstNum < locStr.length; firstNum++) {
					if (locStr.charCodeAt(firstNum) <= 57) {// 57 == '9'
						break;
					}
				}
				return [ parseInt(locStr.substring(firstNum)),
						 cE.columnLabelIndex(locStr.substring(0, firstNum)) ];
			} else {
				return null;
			}
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
		regEx: {
			n: 					/[\$,\s]/g,
			cell: 				/\$?([a-zA-Z]+)\$?([0-9]+)/g, //A1
			range: 				/\$?([a-zA-Z]+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+)/g, //A1:B4
			remoteCell:			/\$?(SHEET+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+)/g, //SHEET1:A1
			remoteCellRange: 	/\$?(SHEET+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+)/g, //SHEET1:A1:B4
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
			if (cE.calcState.cellProvider != null) {
				nrows = cE.calcState.cellProvider.nrows;
				ncols = cE.calcState.cellProvider.ncols;
			}
			
			//Cell References Range - Other Tables
			formula = formula.replace(cE.regEx.remoteCellRange, 
				function(ignored, TableStr, tableI, startColStr, startRowStr, endColStr, endRowStr) {
					var res = [];
					var startCol = cE.columnLabelIndex(startColStr);
					var startRow = parseInt(startRowStr);
					var endCol   = cE.columnLabelIndex(endColStr);
					var endRow   = parseInt(endRowStr);
					if (ncols != null) {
						endCol = Math.min(endCol, ncols);
					}
					if (nrows != null) {
						endRow = Math.min(endRow, nrows);
					}
					for (var r = startRow; r <= endRow; r++) {
						for (var c = startCol; c <= endCol; c++) {
							res.push("SHEET" + (tableI) + ":" + cE.columnLabelString(c) + r);
						}
					}
					return "[" + res.join(",") + "]";
				}
			);
			
			//Cell References Fixed - Other Tables
			formula = formula.replace(cE.regEx.remoteCell, 
				function(ignored, tableStr, tableI, colStr, rowStr) {
					tableI = parseInt(tableI) - 1;
					colStr = colStr.toUpperCase();
					if (dependencies != null) {
						dependencies['SHEET' + (tableI) + ':' + colStr + rowStr] = [parseInt(rowStr), cE.columnLabelIndex(colStr), tableI];
					}
					return "(cE.calcState.cellProvider.getCell((" + (tableI) + "),(" + (rowStr) + "),\"" + (colStr) + "\").getValue())";
				}
			);
			
			//Cell References Range
			formula = formula.replace(cE.regEx.range, 
				function(ignored, startColStr, startRowStr, endColStr, endRowStr) {
					var res = [];
					var startCol = cE.columnLabelIndex(startColStr);
					var startRow = parseInt(startRowStr);
					var endCol   = cE.columnLabelIndex(endColStr);
					var endRow   = parseInt(endRowStr);
					if (ncols != null) {
						endCol = Math.min(endCol, ncols);
					}
					if (nrows != null) {
						endRow = Math.min(endRow, nrows);
					}
					for (var r = startRow; r <= endRow; r++) {
						for (var c = startCol; c <= endCol; c++) {
							res.push(cE.columnLabelString(c) + r);
						}
					}
					return "[" + res.join(",") + "]";
				}
			);
			
			//Cell References Fixed
			formula = formula.replace(cE.regEx.cell, 
				function(ignored, colStr, rowStr) {
					colStr = colStr.toUpperCase();
					if (dependencies != null) {
						dependencies['SHEET' + thisTableI + ':' + colStr + rowStr] = [parseInt(rowStr), cE.columnLabelIndex(colStr), thisTableI];
					}
					return "(cE.calcState.cellProvider.getCell((" + thisTableI + "),(" + (rowStr) + "),\"" + (colStr) + "\").getValue())";
				}
			);
			return formula;
		},	
		parseFormulaStatic: function(formula) { // Parse static formula value like "123.0" or "hello" or "'hello world" into JavaScript value.
			if (formula == null) {
				return null;
			} else {
				var formulaNum = formula.replace(cE.regEx.n, '');
				var value = parseFloat(formulaNum);
				if (isNaN(value)) {
					value = parseInt(formulaNum);
				}
				if (isNaN(value)) {
					value = (formula.charAt(0) == "\'" ? formula.substring(1): formula);
				}
				return value;
			}
		},
		calcLoop: function() {
			if (cE.calcState.done == true) {
				return null;
			} else {
				while (cE.calcState.fuel == null || cE.calcState.fuel > 0) {
					if (cE.calcState.stack.length > 0) {
						var workFunc = cE.calcState.stack.pop();
						if (workFunc != null) {
							workFunc(cE.calcState);
						}
					} else if (cE.calcState.cellProvider.formulaCells != null) {
						if (cE.calcState.cellProvider.formulaCells.length > 0) {
							var loc = cE.calcState.cellProvider.formulaCells.shift();
							cE.visitCell(cE.calcState.i, loc[0], loc[1]);
						} else {
							cE.calcState.done = true;
							return null;
						}
					} else {
						if (cE.visitCell(cE.calcState.i, cE.calcState.row, cE.calcState.col) == true) {
							cE.calcState.done = true;
							return null;
						}

						if (cE.calcState.col >= cE.calcState.cellProvider.getNumberOfColumns(cE.calcState.row - 1)) {
							cE.calcState.row++;
							cE.calcState.col =  1;
						} else {
							cE.calcState.col++; // Sweep through columns first.
						}
					}
					
					if (cE.calcState.fuel != null) {
						cE.calcState.fuel -= 1;
					}
				}
				return cE.calcState.calcMore;
			}
		},
		formula: null,
		formulaFunc: null,
		visitCell: function(tableI, r, c) { // Returns true if done with all cells.
			var cell = cE.calcState.cellProvider.getCell(tableI, r, c);
			if (cell == null) {
				return true;
			} else {
				var value = cell.getValue();
				if (value == null) {
					this.formula = cell.getFormula();
					if (this.formula) {
						if (this.formula.charAt(0) == '=') {
							this.formulaFunc = cell.getFormulaFunc();
							if (this.formulaFunc == null ||
								this.formulaFunc.formula != this.formula) {
								this.formulaFunc = null;
								try {
									var dependencies = {};
									var body = cE.parseFormula(this.formula.substring(1), dependencies, tableI);
									this.formulaFunc = function() {
										with (cE.fn) {
											return eval(body);
										}
									};
									
									this.formulaFunc.formula = this.formula;
									this.formulaFunc.dependencies = dependencies;
									cell.setFormulaFunc(this.formulaFunc);
								} catch (e) {
									cell.setValue(cE.ERROR + ': ' + e);
								}
							}
							if (this.formulaFunc) {
								cE.calcState.stack.push(cE.makeFormulaEval(cell, r, c, this.formulaFunc));

								// Push the cell's dependencies, first checking for any cycles. 
								var dependencies = this.formulaFunc.dependencies;
								for (var k in dependencies) {
									if (dependencies[k] instanceof Array &&
										(cE.checkCycles(dependencies[k][0], dependencies[k][1], dependencies[k][2]) == true) //same cell on same sheet
									) {
										cell.setValue(cE.ERROR + ': cycle detected');
										cE.calcState.stack.pop();
										return false;
									}
								}
								for (var k in dependencies) {
									if (dependencies[k] instanceof Array) {
										cE.calcState.stack.push(cE.makeCellVisit(dependencies[k][2], dependencies[k][0], dependencies[k][1]));
									}
								}
							}
						} else {
							cell.setValue(cE.parseFormulaStatic(this.formula));
						}
					}
				}
				return false;
			}
		},
		makeCellVisit: function(tableI, row, col) {
			var fn = function() { 
				return cE.visitCell(tableI, row, col);
			};
			fn.row = row;
			fn.col = col;
			return fn;
		},
		thisCell: null,
		makeFormulaEval: function(cell, row, col, formulaFunc) {
			cE.thisCell = cell;
			var fn = function() {
				var v = "";
				
				try {
					v = formulaFunc();

					switch(typeof(v)) {
						case "string":
							v = v
								.replace(cE.regEx.amp, cE.str.amp)
								.replace(cE.regEx.lt, cE.str.lt)
								.replace(cE.regEx.gt, cE.str.gt)
								.replace(cE.regEx.nbsp, cE.str.nbsp);
					}

					cell.setValue(v);
					
				} catch (e) {
					cE.makeError(cell, e);
				}
			};
			fn.row = row;
			fn.col = col;
			return fn;
		},
		makeError: function(cell, e) {
			var msg = cE.ERROR + ': ' + msg;
			e.message.replace(/\d+\.?\d*, \d+\.?\d*/, function(v, i) {
				try {
					v = v.split(', ');
					msg = ('Cell:' + cE.columnLabelString(parseInt(v[0]) + 1) + (parseInt(v[1])) + ' not found');
				} catch (e) {}
			});
			cell.setValue(msg);
		},
		checkCycles: function(row, col, tableI) {
			for (var i = 0; i < cE.calcState.stack.length; i++) {
				var item = cE.calcState.stack[i];
				if (item.row != null && 
					item.col != null &&
					item.row == row  &&
					item.col == col &&
					tableI == cE.calcState.i
				) {
					return true;
				}
			}
			return false;
		},
		foldPrepare: function(firstArg, theArguments) { // Computes the best array-like arguments for calling fold().
			if (firstArg != null &&
				firstArg instanceof Object &&
				firstArg["length"] != null) {
				return firstArg;
			} else {
				return theArguments;
			}
		},
		fold: function(arr, funcOfTwoArgs, result, castToN) {
			for (var i = 0; i < arr.length; i++) {
				result = funcOfTwoArgs(result, (castToN == true ? cE.fn.N(arr[i]): arr[i]));
			}
			return result;
		}
	};
	
	
	//initialize this instance of sheet
	jS.s = s;
	
	s.fnBefore();
	
	var o; var emptyFN = function() {};
	if (s.buildSheet) {//override urlGet, this has some effect on how the topbar is sized
		if (typeof(s.buildSheet) == 'object') {
			o = s.buildSheet;
		} else if (s.buildSheet == true || s.buildSheet == 'true') {
			o = jQuery(s.parent.html());
		} else if (s.buildSheet.match(/x/i)) {
			o = jS.controlFactory.sheet(s.buildSheet);
		}
	}
	
	//We need to take the sheet out of the parent in order to get an accurate reading of it's height and width
	//jQuery(this).html(s.loading);
	s.parent.html('');
	
	s.width = s.parent.width();
	s.height = s.parent.height();
	
	
	// Drop functions if they are not needed & save time in recursion
	if (s.log) {
		s.parent.after('<textarea id="' + jS.id.log + '" class="' + jS.cl.log + '" />');
	} else {
		jS.log = emptyFN;
	}
	
	if (!s.showErrors) {
		cE.makeError = emptyFN;
	}
	
	if (!jQuery.support.boxModel) {
		s.boxModelCorrection = 0;
	}
	
	if (!jQuery.scrollTo) {
		jS.followMe = emptyFN;
	}
	
	jS.log('Startup');
	

	//Make functions upper and lower case compatible
	for (var k in cE.fn) {
		var kLower = k.toLowerCase();
		if (kLower != k) {
			cE.fn[kLower] = cE.fn[k];
		}
	}
	
	jQuery(window).resize(function() {
		s.width = s.parent.width();
		s.height = s.parent.height();
		jS.sheetSyncSize();
	});
	
	jS.openSheet(o);
	
	return jS;
}

jQuery.sheet = {
	makeTable : {
		xml: function (data) { //Will not accept CDATA tags
			var table = jQuery('<table />');
			var tbody = jQuery('<tbody />').appendTo(table);
			
			jQuery(data).find('document').each(function() { //document
				var metaData = jQuery(this).find('metadata');
				var columnCount = metaData.find('columns').text();
				var rowCount = metaData.find('rows').text();
				var title = metaData.find('title').html();
				jQuery(this).find('data').children().each(function(i) { //rows
					var thisRow = jQuery('<tr />');
					jQuery(this).children().each(function(j) { //columns
						var o = jQuery(this).html();
						var style = jQuery(this).attr('style');
						if (o.charAt(0) == '=') {
							thisRow.append('<td formula="' + o + '"' + (style ? ' style=\"' + style + '\"' : '') + ' />');
						} else {
							thisRow.append('<td>' + o + '</td>');
						}
					});
					tbody.append(thisRow);
				});
			});
			
			return table;
		},
		json: function(data, makeEval) {
			sheet = (makeEval == true ? eval('(' + data + ')') : data);
			
			var tables = jQuery('<div />');
			
			for (var i = 0; i < sheet.length; i++) {
				size_c = parseInt(sheet[i].metadata.columns) - 1;
				size_r = parseInt(sheet[i].metadata.rows) - 1;
				title = sheet[i].metadata.title;
				title = (title ? title : "Sreadsheet " + i);
			
				var table = jQuery("<table title='" + title + "' />");
				
				for (var x = 0; x <= size_r; x++) {				
					var cur_row = jQuery('<tr />').appendTo(table);
					
					for(var y = 0; y <= size_c; y++) {	
						var cur_val = sheet[i].data["r" + (x + 1)]["c" + (y + 1)].value;
						var style = sheet[i].data["r" + (x + 1)]["c" + (y + 1)].style;
						
						var cur_td = jQuery('<td' + (style ? ' style=\"' + style + '\"' : '' ) + ' />');
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
					
						cur_row.append(cur_td);

					}
				}
				
				tables.append(table);
			}
			return tables.children();
		},
		fromSize: function(size, h, w) {
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

			var standardTr = '<tr' + (h ? 'height="' + h + 'px" style="height: ' + h + 'px;"' : '') + '>' + tds + '</tr>';
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
	}
};

var key = {
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
	V:					86,
	Y:					89,
	Z:					90
};