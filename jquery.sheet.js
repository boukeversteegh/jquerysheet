/*
jQuery.sheet() Spreadsheet with Calculations Plugin
Version: 0.54
http://code.google.com/p/jquerysheet/
		
Copyright (C) 2009 Robert Plummer
Dual licensed under the LGPL and GPL licenses.
http://www.gnu.org/licenses/
*/

/*
	Dimensions Info:
		When dealing with size, it seems that outerHeight is generally the most stable cross browser
		attribute to use for bar sizing.  We try to use this as much as possible.  But because col's
		don't have boarders, we subtract or add jS.attrH.boxModelCorrection() for those browsers.
	
	If vs Switch:
		I try to use case over If as much as possible, especially on loops, because it's faster, even on try false, not much,
		but a little (100ms in some cases).  So if you have 10 if statements firing at the same time,
		the difference is notable.
		
	'with' statement:
		SPEED HOG!  they are only used for shorthand on the jQuery.calculationEngine.fn objects
*/

jQuery.fn.extend({
	sheet: function(settings) {
		settings = jQuery.extend({
			urlGet: 		"documentation.html",
			urlSave: 		"save.html",
			editable: 		true,
			urlBaseCss: 	'jquery.sheet.css',
			urlTheme: 		"theme/jquery-ui-1.7.2.custom.css",
			urlMenu: 		"menu.html",
			urlMenuJs: 		"plugins/mbMenu.min.js", 			//set to bool false if you don't want to use
			urlMenuCss: 	"plugins/menu.css", 				//set to bool false if you don't want to use
			urlMetaData: 	"plugins/jquery.metadata.js", 		//set to bool false if you don't want to use
			urlScrollTo: 	"plugins/jquery.scrollTo-min.js", 	//set to bool false if you don't want to use
			urlJGCharts: 	'plugins/jgcharts.pack.js', 		//set to bool false if you don't want to use
			loading: 		'Loading Spreadsheet...',
			newColumnWidth: 120,
			buildSheet: 	false,	//'10x30', this can be slow
			calcOff: 		false,
			log: 			false,
			lockFormulas: 	false,
			parent: 		this, 	//don't change
			colMargin: 		18, 	//If text size make cell bigger than this number the bars will be off on loadtime
			fnBefore: 		function() {},
			fnAfter: 			function() { jS.obj.formula().focus().select(); },
			fnSave: 		function() { jS.saveSheet(); },
			fnOpen: 		function() { 
				var t = prompt('Paste your table html here');
				if (t) {
					jS.obj.pane().html(t);
					jS.openSheet('', false, true);
				}
			},
			fnClose: 		function() {},
			joinedResizing: false, //this joins the column/row with the resize bar
			boxModelCorrection: 2 //this little guy can have a massive impact on viewing a sheet correctly or not
		}, settings);
		jQuery.fn.sheet.settings = jS.s = settings;
		jS.s.fnBefore();
		
		if (jS.s.buildSheet) {//override urlGet, this has some effect on how the topbar is sized
			jS.s.urlGet = null;
		}
		
		jS.getCss(jS.s.urlBaseCss);
		
		//We need to take the sheet out of the parent in order to get an accurate reading of it's height and width
		var tempSheet = jQuery(this).find('table').hide();
		jQuery(this).html(jS.s.loading);

		jS.s.width = jQuery(jS.s.parent).width();
		jS.s.height = jQuery(jS.s.parent).height();
		
		if (jS.s.log) {
			jQuery(jS.s.parent).after('<textarea id="' + jS.id.log + '" />');
		} else {
			jS.log = function() {}; //save time in recursion
		}
		
		if (!jS.s.urlScrollTo) {
			jS.followMe = function() {};
		}
		
		jS.log('Startup');
			
		//Make functions upper and lower case compatible
		for (var k in cE.fn) {
			var kLower = k.toLowerCase();
			if (kLower != k) {
				cE.fn[kLower] = cE.fn[k];
			}
		}
		
		if (tempSheet) {
			jS.obj.pane().html(tempSheet);
		}
		
		jS.s.ajaxCallsCount = (jS.s.urlBaseCss ? 1 : 0);
		jS.s.ajaxCallsCount += (jS.s.urlTheme ? 1 : 0);
		jS.s.ajaxCallsCount += (jS.s.urlMenu ? 1 : 0);
		jS.s.ajaxCallsCount += (jS.s.urlMenuJs ? 1 : 0);
		jS.s.ajaxCallsCount += (jS.s.urlMetaData ? 1 : 0);
		jS.s.ajaxCallsCount += (jS.s.urlJGCharts ? 1 : 0);
		jS.s.afterAjax = function() {
			jS.sheetSyncSize();
		};
		
		jS.openSheet(jS.s.urlGet, jS.s.buildSheet, true);
	}
});

var jS = jQuery.sheet = {
	version: 0.54,
	i: 0,
	sheetCount: 0,
	s: {},//s = settings object, used for shorthand, populated from jQuery.sheet
	obj: {//obj = object references
		parent: 		function() { return jQuery(jS.s.parent); },
		ui:				function() { return jQuery('#' + jS.id.ui); },
		sheet: 			function() { return jQuery('#' + jS.id.sheet + jS.i); },
		sheetAll: 		function() { return jQuery('.' + jS.cl.sheet); },
		barTop: 		function() { return jQuery('#' + jS.id.barTop + jS.i); },
		barTopParent: 	function() { return jQuery('#' + jS.id.barTopParent + jS.i); },
		barLeft: 		function() { return jQuery('#' + jS.id.barLeft + jS.i); },
		barLeftParent: 	function() { return jQuery('#' + jS.id.barLeftParent + jS.i); },
		barCorner:		function() { return jQuery('#' + jS.id.barCorner + jS.i); },
		barCornerParent:function() { return jQuery('#' + jS.id.barCornerParent + jS.i); },
		barSelected:	function() { return jQuery('.' + jS.cl.barSelected); },
		cell: 			function() { return jQuery('.' + jS.cl.cell); },
		controls:		function() { return jQuery('#' + jS.id.controls); },
		formula: 		function() { return jQuery('#' + jS.id.formula); },
		label: 			function() { return jQuery('#' + jS.id.label); },
		fx:				function() { return jQuery('#' + jS.id.fx); },
		pane: 			function() { return jQuery('#' + jS.id.pane + jS.i); },
		log: 			function() { return jQuery('#' + jS.id.log); },
		menu:			function() { return jQuery('#' + jS.id.menu); },
		uiDefault:		function() { return jQuery('.' + jS.cl.uiDefault); },
		uiActive:		function() { return jQuery('.' + jS.cl.uiActive); },
		uiBase:			function() { return jQuery('.' + jS.cl.uiBase); },
		uiCell:			function() { return jQuery('.' + jS.cl.uiCell); },
		toggle:			function() { return jQuery('.' + jS.cl.toggle); },
		tableBody: 		function() { return document.getElementById(jS.id.sheet + jS.i); },
		tableControl:	function() { return jQuery('#' + jS.cl.tableControl + jS.i); },
		tab:			function() { return jQuery('#' + jS.id.tab + jS.i); },
		tabContainer:	function() { return jQuery('#' + jS.id.tabContainer); }
	},
	id: {//id = id's references
		sheet: 			'jSheet',//This con probably be just about any value as long as it's not a duplicated id
		ui:				'jSheetUI',
		barTop: 		'jSheetBarTop',
		barTopParent: 	'jSheetBarTopParent',
		barLeft: 		'jSheetBarLeft',
		barLeftParent: 	'jSheetBarLeftParent',
		barCorner:		'jSheetBarCorner',
		barCornerParent:'jSheetBarCornerParent',
		controls:		'jSheetControls',
		formula: 		'jSheetControls_formula',
		label: 			'jSheetControls_loc',
		fx:				'jSheetControls_fx',
		pane: 			'jSheetEditPane',
		log: 			'jSheetLog',
		menu:			'jSheetMenu',
		tableControl:	'tableControl',
		tab:			'jSheetTab',
		tabContainer:	'jSheetTabContainer'
	},
	cl: {//cl = class references
		sheet: 			'jSheet',
		cell: 			'jSheetCellActive',
		calcOff: 		'jSheetCalcOff',
		barSelected: 	'jSheetBarItemSelected',
		uiDefault:		'ui-state-default',
		uiActive:		'ui-state-active',
		uiBase:			'ui-widget-content',
		uiParent: 		'ui-widget-content ui-corner-all',
		uiBar: 			'ui-widget-header',
		uiPane: 		'ui-widget-content',
		uiMenuUl: 		'ui-widget-header',
		uiMenuLi: 		'ui-widget-header',
		uiMenuHighlighted: 'ui-state-highlight',
		uiControl: 		'ui-widget-header ui-corner-top',
		uiControlTextBox:'ui-widget-content',
		uiCell:			'themeRoller_activeCell',
		uiCellHighlighted: 'ui-state-highlight',
		toggle:			'cellStyleToggle',
		tab:			'jSheetTab'
	},
	ERROR: function() { return cE.ERROR; },
	sheetUI: function(isAppend) {
		return jQuery(
			(!isAppend ? '<div id="' + jS.id.ui + '" class="' + jS.id.ui + '">' : "") +
				'<table cellpadding="0" cellspacing="0" border="0" id="' + jS.id.tableControl + jS.i + '" class="' + jS.id.tableControl + ' ui-corner-bottom">' +
					'<tbody>' +
						'<tr>' + 
							'<td id="' + jS.id.barCornerParent + jS.i + '" class="' + jS.id.barCornerParent + '">' + //corner
								'<div style="height: ' + jS.s.colMargin + '; width: ' + jS.s.colMargin + ';" id="' + jS.id.barCorner + jS.i + '" class="ui-icon ui-icon-refresh ' + jS.id.barCorner +'" onClick="jS.cellEditAbandon();" onDblclick="jS.cellSetActiveAll();">&nbsp;</div>' +
							'</td>' + 
							'<td>' + //barTop
								'<div style="overflow: hidden;" id="' + jS.id.barTopParent + jS.i + '" class="' + jS.id.barTopParent + '"></div>' +
							'</td>' +
						'</tr>' +
						'<tr>' +
							'<td>' + //barLeft
								'<div style="overflow: hidden;width: ' + jS.s.colMargin + ';" id="' + jS.id.barLeftParent + jS.i + '"></div>' +
							'</td>' +
							'<td>' + //pane
								'<div id="' + jS.id.pane + jS.i + '" class="' + jS.id.pane + '"></div>' +
							'</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' +
			(!isAppend ? '</div>' : "")
		);
	},
	tuneTableForSheetUse: function(obj) {
		obj
			.addClass(jS.cl.sheet)
			.attr('id', jS.id.sheet + jS.i)
			.attr('border', '1px');
		obj.find('.' + jS.cl.uiCell).removeClass(jS.cl.uiCell);
		obj.find('td')
			.css('background-color', '')
			.css('color', '')
			.css('height', '')
			.attr('height', '');
	},
	attrH: {//Attribute Helpers
	//I created this object so I could see, quickly, which attribute was most stable.
	//As it turns out, all browsers are different, thus this has evolved to a much uglier beast
		width: function(obj, skipCorrection) {
			return jQuery(obj).outerWidth() - jS.attrH.boxModelCorrection(skipCorrection);
		},
		widthReverse: function(obj, skipCorrection) {
			return jQuery(obj).outerWidth() + jS.attrH.boxModelCorrection(skipCorrection);
		},
		height: function(obj, skipCorrection) {
			return jQuery(obj).outerHeight() - jS.attrH.boxModelCorrection(skipCorrection);
		},
		heightReverse: function(obj, skipCorrection) {
			return jQuery(obj).outerHeight() + jS.attrH.boxModelCorrection(skipCorrection);
		},
		syncSheetWidthFromTds: function(obj) {
			var entireWidth = 0;
			obj = (obj ? obj : jS.obj.sheet());
			obj.find('tr:first').find('td').each(function() {
				entireWidth += jQuery(this).width();
			});
			obj.width(entireWidth);
		},
		boxModelCorrection: function(skipCorrection) {
			var correction = 0;
			if (jQuery.support.boxModel && !skipCorrection) {
				correction = jS.s.boxModelCorrection;
			}
			return correction;
		},
		setHeight: function(i, from, skipCorrection, obj) {
			var correction = 0;
			var h = 0;
			var fn;
			
			switch(from) {
				case 'cell':
					obj = (obj ? obj : jS.obj.barLeft().find('div').eq(i))
					h = jS.attrH.height(jQuery(jS.getTd(i, 0)).parent().andSelf(), skipCorrection);
					break;
				case 'bar':
					obj = (obj ? obj : jQuery(jS.getTd(i, 0)).parent().andSelf());
					h = jS.attrH.heightReverse(jS.obj.barLeft().find('div').eq(i), skipCorrection);
					break;
			}
			
			if (h) {
				jQuery(obj)
					.height(h)
					.css('height', h)
					.attr('height', h);
			}

			return obj;
		}
	},
	makeBarItemLeft: function(reload, o) {//Works great!
		jS.obj.barLeft().remove();
		var barLeft = jQuery('<div border="1px" id="' + jS.id.barLeft + jS.i + '" class="' + jS.id.barLeft + '" />').height('10000px');
		var heightFn;
		if (reload) { //This is our standard way of detecting height when a sheet loads from a url
			heightFn = function(i, objSource, objBar) {
				objBar.height(parseInt(objSource.outerHeight()) - jS.attrH.boxModelCorrection());
			};
		} else { //This way of detecting height is used becuase the object has some problems getting
				//height because both tr and td have height set
				//This corrects the problem
				//This is only used when a sheet is already loaded in the pane
			heightFn = function(i, objSource, objBar) {
				objBar.height(parseInt(objSource.css('height').replace('px','')) - jS.attrH.boxModelCorrection());
			};
		}
		
		jS.resizeFn.height(barLeft);
		
		o.find('tr').each(function(i) {
			var child = jQuery('<div>' + (i + 1) + '</div>');
			jQuery(barLeft).append(child);
			heightFn(i, jQuery(this), child);
		});
		barLeft.appendTo(jS.obj.barLeftParent());
	},
	makeBarItemTop: function(reload, o) { //Works great!
		jS.obj.barTop().remove();
		var barTop = jQuery('<div id="' + jS.id.barTop + jS.i + '" class="' + jS.id.barTop + '" />').width('10000px');
		barTop.height(jS.s.colMargin);
		
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
				return parseInt(jQuery(obj).css('width').replace('px','')) - jS.attrH.boxModelCorrection();
			};
		}
		
		jS.resizeFn.width(barTop);
		
		parents.each(function(i) {
			var v = cE.columnLabelString(i + 1);
			var w = widthFn(this);
			
			var child = jQuery("<div>" + v + "</div>")
				.width(w)
				.height(jS.s.colMargin);
			barTop.append(child);
		});
		
		// Prepend one colgroup/col element that covers the new row headers.
		//jS.attrH.syncSheetWidthFromTds();
		
		jS.obj.barTopParent().append(barTop);
	},
	setTdIds: function(o) {
		o = (o ? o : jS.obj.sheet());
		o.find('tr').each(function(row) {
			jQuery(this).find('td').each(function(col) {
				jQuery(this).attr('id', jS.getTdId(row, col));
			});
		});
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
	resizeFn: {
		select: function(o, e, selectFn, resizeFn) {
			var isResizing = jS.barResizer(e, resizeFn);
					
			if (!isResizing) {
				selectFn(e.target);
				o
					.unbind('mouseover')
					.mouseover(function(e) {
						selectFn(e.target, true);
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
					jS.resizeFn.first = jS.resizeFn.last = jS.getBarLeftIndex(e.target);
					jS.resizeFn.select(o, e, selectRow, jS.rowResizer);
					
					return false;
				})
			if (jS.s.editable) { //only let editable select
				selectRow = function(o, keepCurrent) {
					if (!keepCurrent) { 
						jS.cellEditAbandon();
					}
					
					var i = jS.getBarLeftIndex(o);
					jS.resizeFn.last = (i > jS.resizeFn.last ? i : jS.resizeFn.last);
					
					jS.fxUpdate((jS.resizeFn.first + 1) + ':' + (jS.resizeFn.last + 1), true);
					
					jS.cellSetActiveMultiRow(jS.resizeFn.last);
				};
			}
		},
		width: function(o) {
			var selectColumn = function() {};
			
			o //let any user resize
				.unbind('mousedown')
				.mousedown(function(e) {
					jS.resizeFn.first = jS.resizeFn.last = jS.getBarTopIndex(e.target);
					jS.resizeFn.select(o, e, selectColumn, jS.columnResizer);
					
					return false;
				})
			if (jS.s.editable) { //only let editable select
				selectColumn = function(o, keepCurrent) {
					if (!keepCurrent) { 
						jS.cellEditAbandon();
					}
					var i = jS.getBarTopIndex(o);
					jS.resizeFn.last = (i > jS.resizeFn.last ? i : jS.resizeFn.last);
					
					jS.fxUpdate(cE.columnLabelString(jS.resizeFn.first + 1) + ':' + cE.columnLabelString(jS.resizeFn.last + 1), true);
					
					jS.cellSetActiveMultiColumn(jS.resizeFn.last);
				};
			}
		}
	},
	addTitle: function() {
		return jQuery('<span class="ui-corner-top ui-state-default"><a class="' + jS.cl.tab + '" id="' + jS.id.tab + jS.i + '" OnDblClick="jS.sheetTitle(); return false;" onclick="jS.setActiveSheet(jQuery(\'#' + jS.id.tableControl + jS.i + '\'), ' + jS.i + ', this); return false;">' + jS.sheetTitle(true) + '</a></span>')
			.appendTo(jS.obj.tabContainer());
	},
	makeControls: function(parent) {
		jS.obj.controls().remove();	
		var controls = jQuery('<div id="' + jS.id.controls + '"><table cellpadding="0" cellspacing="0" border="0"><tbody><tr id="topContainer" /></tbody></table></div>');
		if (jS.s.editable) {
			//Page Menu Control	
			if (jS.s.urlMenuJs && jS.s.urlMenuCss && jS.s.urlMetaData && jS.s.urlMenu) {
				jQuery.getScript(jS.s.urlMetaData, function() {
					jQuery.getScript(jS.s.urlMenuJs, function() {
						jS.getCss(jS.s.urlMenuCss);
						var menuObj = jQuery('<div />').load(jS.s.urlMenu, function() {
							controls.find('#topContainer').prepend(jQuery('<td />').append(menuObj.html()));
							jS.obj.menu()
								.buildMenu({
									additionalData:"pippo=1",
									menuWidth: 100,
									openOnRight:false,
									menuSelector: ".menuContainer",
									hasImages:false,
									fadeInTime: 0,
									fadeOutTime:0,
									adjustLeft:2,
									minZindex:"auto",
									adjustTop:10,
									opacity:.95,
									shadow:true,
									closeOnMouseOut:false,
									closeAfter:1000
								});
							//there are 3 ajax calls here
							jS.ajaxCalled(3);
						});
					});
				});
			}
			
			//Edit box menu
			controls.append('<table cellpadding="0" cellspacing="0" border="0">' +
					'<tr>' +
						'<td style="width: 35px; text-align: right;" id="' + jS.id.label + '"></td>' +
						'<td style="width: 10px;" id="' + jS.id.fx + '">fx</td>' + 
						'<td>' +
							'<textarea id="' + jS.id.formula + '"></textarea>' +
						'</td>' +
					'</tr>' +
				'</table>');
			controls.keydown(function(e) {
				return jS.formulaKeyDown(e);
			});
		}

		//Get the scrollTo Pluggin
		if (jS.s.urlScrollTo) {
			jQuery.getScript(jS.s.urlScrollTo);
		}
		
		//Tabs control
		controls.find('#topContainer').append(jQuery('<td id="' + jS.id.tabContainer + '"/>').append(jS.addTitle(false)));
		
		jS.sheetSyncSize();
		
		jS.obj.ui().prepend(controls);
	},
	sheetDecorate: function(o) {	
		jS.formatSheet(o);
		jS.sheetSyncSizeToCols(o);
		jS.sheetDecorateRemove();
	},
	formatSheet: function(o) {
		if (o.find('tbody').length < 1) {
			o.wrap('<tbody />');
		}
		
		if (o.find('colgroup').length < 1) {
			var colgroup = jQuery('<colgroup />');
			o.find('tr:first').find('td').each(function() {
				//var w = jQuery(this).width();
				//jQuery(this)
				//	.width(w)
				//	.css('width', w)
				//	.attr('width', w);
				jQuery('<col />')
					.width(jS.s.newColumnWidth)
					.css('width', jS.s.newColumnWidth)
					.attr('width', jS.s.newColumnWidth)
					.appendTo(colgroup);
			});
			colgroup.prependTo(o);
		}
	},
	getCss: function(url, id) {
		jQuery('head').append('<link rel="stylesheet" type="text/css" href="' + url + '"></link>');
	},
	themeRoller: {
		start: function(isAppend) {
			if (!isAppend) { jS.getCss(jS.s.urlTheme); }
			//Style sheet			
			jS.obj.parent().addClass(jS.cl.uiParent);
			jS.obj.sheet().addClass(jS.cl.uiParent);
			//Style bars
			jS.obj.barLeft().find('div').addClass(jS.cl.uiBar);
			jS.obj.barTop().find('div').addClass(jS.cl.uiBar);
			jS.obj.barCornerParent().addClass(jS.cl.uiBar);
			
			jS.obj.controls().addClass(jS.cl.uiControl);
			jS.obj.fx().addClass(jS.cl.uiControl);
			jS.obj.label().addClass(jS.cl.uiControl);
			jS.obj.formula().addClass(jS.cl.uiControlTextBox);
		},
		cell: function(td) {
			jS.themeRoller.clearCell();
			if (td) {
				jQuery(td)
					.addClass(jS.cl.uiCellHighlighted)
					.addClass(jS.cl.uiCell);;
			}
		},
		clearCell: function() {
			jS.obj.uiActive().removeClass(jS.cl.uiActive);
			jS.obj.uiCell()
				.removeAttr('style')
				.removeClass(jS.cl.uiCellHighlighted)
				.removeClass(jS.cl.uiCell);
		},
		newBar: function(obj) {//This is for a tr
			jQuery(obj).addClass(jS.cl.uiBar);
		},
		barTop: function(i) {
			jS.obj.barTop().find('div').eq(i).addClass(jS.cl.uiActive);
		},
		barLeft: function(i) {
			jS.obj.barLeft().find('div').eq(i).addClass(jS.cl.uiActive);
		},
		barObj: function(obj) {
			jQuery(obj).addClass(jS.cl.uiActive);
		},
		clearBar: function() {
			jS.obj.barTop().find('.' + jS.cl.uiActive).removeClass(jS.cl.uiActive);
			jS.obj.barLeft().find('.' + jS.cl.uiActive).removeClass(jS.cl.uiActive);
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

			jS.log("from html to text");
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
			
			jS.log("from text to html");
		}
		return v;
	},
	sheetDecorateRemove: function(makeClone) {
		var obj = (makeClone ? jS.obj.sheet().clone()[0] : jS.obj.sheet()[0]);
		
		//remove class jSheetCellActive
		jQuery(obj).find('.' + jS.cl.cell).removeClass(jS.cl.cell);
		//remove class ui-state-highlight
		jQuery(obj).find('.' + jS.cl.uiCellHighlighted).removeClass(jS.cl.uiCellHighlighted);
		//remove class themeRoller_activeCell
		
		jQuery(obj).find('.' + jS.cl.uiCell).removeClass(jS.cl.uiCell);
		//IE Bug, match width with css width
		jQuery(obj).find('col').each(function(i) {
			var v = jQuery(this).css('width');
			v = ((v + '').match('px') ? v : v + 'px');
			jQuery(obj).find('col').eq(i).attr('width', v);
		});
		
		return obj;
	},
	fxUpdate: function(v, setDirect) {
		if (!setDirect) {
			jS.obj.label().html(cE.columnLabelString(v[1] + 1) + (v[0] + 1));
		} else {
			jS.obj.label().html(v);
		}
	},
	cellClick: function(keyCode) { //invoces a click on next/prev cell
		var h = 0;
		var v = 0;
		switch (keyCode) {
			case key.UP: 		v--; break;
			case key.DOWN: 		v++; break;
			case key.LEFT: 		h--; break;
			case key.RIGHT: 	h++; break;
		}
		jQuery(jS.getTd(jS.cellLast.row + v, jS.cellLast.col + h)).click();
		
		return false;
	},
	cellOnMouseDown: function(e) {
		if (e.altKey) {
			jS.cellSetActiveMulti(e);
			jQuery(document).mouseup(function() {
				jQuery(this).unbind('mouseup');
				var v = jS.obj.formula().val();
				jS.obj.formula().val(v + jS.getTdRange());
			});
		} else {
			jS.cellSetActiveMulti(e);
		}
	},
	cellOnClickLocked: function(e) {
		if (!isNaN(e.target.cellIndex)) {
			if (!jQuery(e.target).attr('formula')) {
				jS.cellOnClickManage(jQuery(e.target));
			}
		} else {
			jS.cellEditAbandon();
			jS.obj.formula().focus().select();
		}
	},
	cellOnClickReg: function(e) {
		if (!isNaN(e.target.cellIndex)) {		
			jS.cellOnClickManage(jQuery(e.target));
		} else { //this won't be a cell
			var clickable = jQuery(e.target).hasClass('clickable');
			if (!clickable) {
				jS.obj.formula().focus().select();
			} else { //this is an inline control
				//jS.cellEditAbandon(true);
			}
		}
	},
	cellOnClickManage: function(td) {
		if (!td.hasClass(jS.cl.cell)) { //initial click
			jS.cellEdit(td);
			jS.log('click cell');
		} else { //inline edit, 2nd click
			jS.cellLast.isEdit = jS.isSheetEdit = true;
			jS.cellTextArea(td, false, true);
			jS.log('click, textarea over table activated');
		}
		jS.followMe(td);
	},
	cellEdit: function(td) {
		//This finished up the edit of the last cell
		jS.cellEditDone();
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
		jS.cellLast.row = loc[0];
		jS.cellLast.col = loc[1];
		
		jS.themeRoller.cell(td); //themeroll the cell and bars
		jS.themeRoller.barLeft(jS.cellLast.row);
		jS.themeRoller.barTop(jS.cellLast.col);
		
		td.addClass(jS.cl.cell); //add classes
		jS.obj.barLeft().find('div').eq(jS.cellLast.row).addClass(jS.cl.barSelected);
		jS.obj.barTop().find('div').eq(jS.cellLast.col).addClass(jS.cl.barSelected);
	},
	cellLast: {
		td: null,
		row: null,
		col: null,
		isEdit: false
	},
	cellEditDone: function(bsheetClearActive) {
		switch (jS.cellLast.isEdit) {
			case true:
				// Any changes to the input controls are stored back into the table, with a recalc.
				var td = jS.cellLast.td;
				var recalc = false;
				
				//Lets ensure that the cell being edited is actually active
				if (td && td.hasClass(jS.cl.cell)) { 
					//This should return either a val from textbox or formula, but if fails it tries once more from formula.
					var v = jS.cellTextArea(td, true);

					//inputFormula.value;
					var noEditFormula = false;
					var noEditNumber = false;
					var noEditNull = false;
					var editedFormulaToFormula = false;
					var editedFormulaToReg = false;
					var editedRegToFormula = false;
					var editedRegToReg = false;
					var editedToNull = false;
					var editedNumberToNumber = false;
					var editedNullToNumber = false;
					
					var tdFormula = td.attr('formula');
					var tdPrevVal = td.attr('prevVal');

					if (v) {
						if (v.charAt(0) == '=') { //This is now a formula
							if (v != tdFormula) { //Didn't have a formula before but now does
								editedFormulaToFormula = true;
								jS.log('edit, new formula, possibly had formula');
							} else if (tdFormula) { //Updated using inline edit
								noEditFormula = true;
								jS.log('no edit, has formula');
							} else {
								jS.log('no edit, has formula, unknown action');
							}
						} else if (tdFormula) { //Updated out of formula
							editedRegToFormula = true;
							jS.log('edit, new value, had formula');
						} else if (!isNaN(parseInt(v))) {
							if ((v != tdPrevVal && v != jS.obj.formula().val()) || (td.text() != v)) {
								editedNumberToNumber = true;
								jS.log('edit, from number to number, possibly in function');
							} else {
								noEditNumber = true;
								jS.log('no edit, is a number');
							}
						} else { //Didn't have a formula before of after edit
							editedRegToReg = true;
							jS.log('possible edit from textarea, has value');
						}
					} else { //No length value
						if (td.html().length > 0 && tdFormula) {
							editedFormulaToReg = true;
							jS.log('edit, null value from formula');
						} else if (td.html().length > 0 && tdFormula) {
							editedToNull = true;
							jS.log('edit, null value from formula');
						
						} else {
							noEditNull = true;
							jS.log('no edit, null value');
						}
					}
					
					td.removeAttr('prevVal');
					v = jS.manageTextToHtml(v);
					if (noEditFormula) {
						td.html(tdPrevVal);
					} else if (editedFormulaToFormula) {
						recalc = true;
						td.attr('formula', v).html('');
					} else if (editedFormulaToReg) {
						recalc = true;
						td.removeAttr('formula').html(v);
					} else if (editedRegToFormula) {
						recalc = true;
						td.removeAttr('formula').html(v);
					} else if (editedRegToReg) {
						td.html(v);
					} else if (noEditNumber) {
						td.html(v); 
					} else if (noEditNull) {
						td.html(v);
					} else if (editedNumberToNumber) {
						recalc = true;
						td.html(v);
					} else if (editedToNull) {
						recalc = true;
						td.removeAttr('formula').html('');
					}
					
					if (recalc) {
						jS.calc(jS.obj.sheet());
					}
					
					if (bsheetClearActive != false) {
						// Treats null == true.
						jS.sheetClearActive();
					}
					
					jS.attrH.setHeight(jS.cellLast.row, 'cell');
					
					jS.obj.formula().focus().select();
					jS.cellLast.isEdit = false;
				}
				break;
			default:
				jS.attrH.setHeight(jS.cellLast.row, 'cell', false);
				jS.sheetClearActive();
		}
	},
	cellEditAbandon: function(skipCalc) {
		jS.themeRoller.clearCell();
		jS.themeRoller.clearBar();
		if (!skipCalc) {
			var v = jS.cellTextArea(jS.cellLast.td, true);
			if (v) {
				jS.cellLast.td.html(jS.manageTextToHtml(v));
				jS.sheetClearActive();
				if (v.charAt(0) == '=') {
					jS.calc(jS.obj.sheet());
				}
			} else { //Even if the cell is blank, that doesn't mean it's not active
				jS.sheetClearActive();
				jS.calc(jS.obj.sheet());
			}
		}
		jS.cellLast.td = jS.obj.sheet().find('td:first');
		jS.cellLast.row = 0;
		jS.cellLast.col = 0;
		
		jS.fxUpdate('', true);

		return false;
	},
	keyDownHandler: {
		enterOnTextArea: function(e) {
			if (!e.shiftKey) {
				return jS.cellClick(key.DOWN);
			} else {
				return true;
			}
		},
		enter: function(e) {
			if (!jS.cellLast.isEdit && !e.ctrlKey) {
				return jS.cellClick();
			} else {
				return jS.cellClick(key.DOWN);
			}
		},
		tab: function(e) {
			if (e.shiftKey) {
				return jS.cellClick(key.LEFT);
			} else {
				return jS.cellClick(key.RIGHT);
			}
		},
		textAreaKeyDown: function(e) {
			switch (e.keyCode) {
				case key.ENTER: 	return jS.keyDownHandler.enterOnTextArea(e);
					break;
				case key.TAB: 		return jS.keyDownHandler.tab(e);
					break;
			}
		},
		formulaKeyDown: function(e) {
			switch (e.keyCode) {
				case key.ESCAPE: 	jS.cellEditAbandon();					break;
				case key.TAB: 		return jS.keyDownHandler.tab(e);		break;
				case key.ENTER: 	return jS.keyDownHandler.enter(e);	break;
				case key.LEFT:
				case key.UP:
				case key.RIGHT:
				case key.DOWN:		return jS.cellClick(e.keyCode);		break;
				default: 			jS.cellLast.isEdit = true;
			}
		}
	},
	formulaKeyDown: function(e, isTextArea) {
		//Switch is much faster than if statements
		//I found that it's much easier to go from the origin key (up, down, left, right, tab, enter) and then detect if the ctrl key or shift keys are down.
		//It's just difficult to look at later on and it's probably faster overall
		return (isTextArea ? jS.keyDownHandler.textAreaKeyDown(e) : jS.keyDownHandler.formulaKeyDown(e));
	},
	cellStyleToggle: function(setClass, removeClass) {
		//Lets check to remove any style classes
		if (removeClass) {
			removeClass = removeClass.split(',');
			
			jQuery(removeClass).each(function() {
				jS.obj.uiCell().removeClass(this);
			});
		}
		//Now lets add some style
		if (jS.obj.uiCell().hasClass(setClass)) {
			jS.obj.uiCell().removeClass(setClass);
		} else {
			jS.obj.uiCell().addClass(setClass);
		}
		jS.obj.formula()
			.focus()
			.select();
		return false;
	},
	context: {},
	calc: function(fuel) {
		jS.log('Calculation Started');
		if (!jS.s.calcOff) {
			cE.calc(new jS.tableCellProvider(), jS.context, fuel);
			jS.isSheetEdit = false;
		}
		jS.log('Calculation Ended');
	},
	cellTextArea: function(td, returnVal, makeEdit, setVal) {
		//Remove Textarea and transfer value.
		var v;
		if (td) {
			if (!makeEdit) {
				var textArea = td.find('textarea');
				var textAreaVal = textArea.val();
				if (textAreaVal || jS.obj.formula().attr('disabled')) {
					jS.log('Textarea value used');
					v = textAreaVal;
					textArea.remove();
					//td
					//	.css('text-align', '')
					//	.css('vertical-align', '');
				} else {
					jS.log('Formula value used');
					v = jS.obj.formula().val();
				}
				jS.obj.formula().removeAttr('disabled');
			} else {
				if (setVal) {
					v = setVal;
				} else {
					v = jS.obj.formula().val();
				}
				
				jS.obj.formula().attr('disabled', 'true');
				
				var textArea = jQuery('<textarea id="tempText" />');
				var h = jS.attrH.height(td);
				
				//There was an error in some browsers where they would mess this up.
				td.parent().height(h + jS.attrH.boxModelCorrection());
				//create text area.  Agian, strings are faster than DOM.
				textArea
					.height(h < 75 ? 75 : h)
					.val(v)
					.click(function(){
						return false;
					})
					.keydown(function(e) {
						return jS.formulaKeyDown(e, true);
					});
				
				//Se we can look at the past value after edit.
				if (td.attr('formula')) {
					td.attr('prevVal', td.text()).removeAttr('formula');
				}
				//add it to cell
				td.html(textArea);
				//focus textarea
				textArea
					.focus()
					.select();
			}
			if (returnVal) {
				return v;
			}
		}
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
			jS.obj.tableControl().hide();
			jS.initSheet(true, jS.buildSheet(size), true);
		}
	},
	addRowMulti: function(qty) {
		if (!qty) {
			qty = prompt('How many rows would you like to add?');
		}
		if (qty) {
			for (var i = 0; i <= qty; i++) {
				jS.addRow();
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
				jS.addColumn();
			}
		}
		jS.setTdIds();
	},
	addRow: function(atRow, insertBefore) {
		if (!atRow || jS.cellLast.row < 1) {
			//if atRow has no value, lets just add it to the end.
			atRowQ = ':last';
			atRow = false;
		} else if (atRow == true) {//if atRow is boolean, then lets add it just after the currently selected row.
			atRowQ = ':eq(' + (jS.cellEditLastLoc[1] - 1) + ')';
		} else {
			//If atRow is a number, lets add it at that row
			atRowQ = ':eq(' + (atRow - 1) + ')';
		}
		
		jS.cellEditAbandon();
		var currentRow = jS.obj.sheet().find('tr' + atRowQ);
		var newRow = currentRow.clone();
		newRow.find('td').andSelf().height(currentRow.find('td:first').height());
		
		jQuery(newRow).find('td')
			.html('')
			.attr('class', '')
			.removeAttr('function')
			.keydown(function(e) {
				return jS.formulaKeyDown(e, true);
			});
		if (insertBefore) {
			newRow.insertBefore(currentRow);
		} else {
			newRow.insertAfter(currentRow);
		}
		
		var currentBar = jS.obj.barLeft().find('div' + atRowQ);
		var newBar = currentBar.clone();
		
		jS.themeRoller.newBar(newBar);
		
		newBar
			.html(parseInt(currentBar.text()) + 1)
			.removeClass(jS.cl.uiActive)
			.height(jS.attrH.height(newRow, true));
		
		jS.log('New row at: ' + (parseInt(currentBar.text()) + 1));
		
		if (insertBefore) {
			newBar.insertBefore(currentBar);
		} else {
			newBar.insertAfter(currentBar);
		}
		
		if (atRow) {//If atRow equals anything it means that we inserted at a point, because of this we need to update the labels
			jS.obj.barLeft().find('div').each(function(i) {
				jQuery(this).text(i + 1);
			});
		}

		jS.setTdIds();
		jS.obj.pane().scroll();
	},
	addColumn: function(atColumn, insertBefore) {
		if (!atColumn) {
			//if atColumn has no value, lets just add it to the end.
			atColumn = ':last';
		} else if (atColumn == true) {
			//if atColumn is boolean, then lets add it just after the currently selected row.
			atColumn = ':eq(' + (jS.cellEditLastLoc[2] - 1) + ')';
		} else {
			//If atColumn is a number, lets add it at that row
			atColumn = ':eq(' + (atColumn - 1) + ')';
		}

		jS.cellEditAbandon();
		
		//there are 3 obj that need managed here div, col, and each tr's td
		//Lets get the current div & col, then later we go through each row
		var currentBar = jS.obj.barTop().find('div' + atColumn);
		var currentCol = jS.obj.sheet().find('col' + atColumn);
		
		//Lets create our new bar, cell, and col
		var newBar = currentBar.clone().width(jS.s.newColumnWidth - jS.attrH.boxModelCorrection());
		var newCol = currentCol.clone().width(jS.s.newColumnWidth);
		var newCell = jQuery('<td></td>');
		
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
			addNewCellFn = function(obj) {
				jQuery(obj).find('td' + atColumn).before(
					newCell.clone()
				);
			};
		} else {
			addNewCellFn = function(obj) {
				jQuery(obj).find('td' + atColumn).after(
					newCell.clone()
				);
			};
		}
		
		jS.obj.sheet().find('tr').each(function(i) {
			addNewCellFn(this);
			j++;
		});
		
		jS.log('Sheet length: ' + j);		
		
		if (atColumn) {//If atColumn equals anything it means that we inserted at a point, because of this we need to update the labels
			jS.obj.barTop().find('div').each(function(i) {
				jQuery(this).text(cE.columnLabelString(i + 1));
			});
		}
		
		jS.attrH.syncSheetWidthFromTds();
		
		jS.setTdIds();
		jS.obj.pane().scroll();
	},
	deleteRow: function() {
		if (jS.obj.cell()[0]) {
			var v = confirm("Are you sure that you want to delete that row? Fomulas will not be updated.");
			if (v) {
				var loc = jS.cellLast.row - 1;
				jS.obj.barLeft().find('div').eq(loc).remove();
				jS.obj.sheet().find('tr').eq(loc).remove();
				jS.obj.formula().val('');
				jS.setTdIds();
				jS.refreshLabelsRows();
			}
		}
		jS.obj.pane().scroll();
	},
	deleteColumn: function() {
		if (jS.obj.cell()[0]) {
			var v = confirm("Are you sure that you want to delete that column? Fomulas will not be updated.");
			if (v) {
				var loc = jS.cellLast.col - 1;

				jS.obj.barTop().find('div').eq(loc).remove();
				jS.obj.sheet().find('colgroup col').eq(loc).remove();
				jS.obj.sheet().find('tr').each(function(i) {
						jQuery(this).find('td').eq(loc).remove();
				});
				
				jS.obj.formula().val('');
				
				var w = jS.refreshLabelsColumns();
				jS.setTdIds();
				jS.obj.sheet().width(w);
			}
		}
		jS.obj.pane().scroll();
	},
	sheetTitle: function(get) {
		var sheetTitle = '';
		if (get) {
			sheetTitle = jS.obj.sheet().attr('sheettitle');
			sheetTitle = (sheetTitle ? sheetTitle : 'Spreadsheet ' + jS.i);
		} else {
			var newTitle = prompt("What would you like the sheet's title to be?", jS.sheetTitle(true));
			if (!newTitle) {
				newTitle = 'Spreadsheet' + jS.i;
			}
			jS.obj.sheet().attr('sheettitle', newTitle);
			jS.obj.tab().html(newTitle);
			
			sheetTitle = newTitle;
		}
		return sheetTitle;
	},
	viewSource: function(pretty) {
		var sheetClone = jS.sheetDecorateRemove(true);

		if (pretty) {
			var s = jS.HTMLtoPrettySource(sheetClone);
		} else {
			var s = jQuery('<div />').html(sheetClone).html();
		}
		var w = window.open();
		w.document.write("<html><body><xmp>" + s + "\n</xmp></body></html>");
		w.document.close();
		return false;
	},
	saveSheet: function() {
		var v = jS.sheetDecorateRemove(true);
		var s = jQuery('<div />').html(v).html();

		jQuery.ajax({
			url: jS.s.urlSave,
			type: 'POST',
			data: 's=' + s,
			dataType: 'html',
			success: function(data) {
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
						jQuery(val).removeClass(jS.cl.cell);
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
	barAdjustor: function(killTimer) {
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
	followMe: function(td) {
		jS.obj.pane().stop().scrollTo(td, {
			margin: true,
			axis: 'xy',
			duration: 100,
			offset: {
				top: - jS.s.height / 3,
				left: - jS.s.width / 5
			}
		});
	},
	count: {
		rows: function() {
			return jS.getBarLeftIndex(jS.obj.barLeft().find('div:last').text());
		},
		columns: function() {
			return jS.getBarTopLocatoin(jS.obj.barTop().find('div:last').text());
		}
	},
	initSheet: function(reloadBars, obj, isAppend) {
		if (!isAppend) {
			if (obj) {
				jS.obj.pane().html(jQuery(obj).show());
			} else {
				obj = jS.obj.pane().find('table').show();
			}
		} else {
			jS.sheetCount++;
			jS.i = jS.sheetCount;
			jS.sheetUI(true).appendTo(jS.obj.ui());
			jS.obj.pane().append(obj);
		}
		
		jS.replaceWithSafeImg(obj.find('img')); //correct height issue
		
		jS.tuneTableForSheetUse(obj);
					
		jS.sheetDecorate(obj);
		
		jS.makeBarItemTop(reloadBars, obj);
		jS.makeBarItemLeft(reloadBars, obj);
	
		jS.sheetTitle(true);
		
		if (jS.s.editable) {
			jS.obj.pane()
				.mousedown(jS.cellOnMouseDown)
				.click(jS.s.lockFormulas ? jS.cellOnClickLocked : jS.cellOnClickReg);
		}
		
		jS.themeRoller.start(isAppend);

		jS.setTdIds(obj);
		
		jS.barAdjustor();
		
		//We load the plugins
		if (jS.s.urlJGCharts) { //When loading the charts, we need to make sure that the namespace exists before we fire fnAfter();
			jQuery.getScript(jS.s.urlJGCharts, function() {		
				jS.ajaxCalled(1);
				jS.calc(jS.obj.sheet());
				jS.s.fnAfter();
			});
		} else {
			jS.calc(jS.obj.sheet());
			jS.s.fnAfter();
		}

		jS.addTitle();
		
		jS.setActiveSheet();
		
		jS.log('Sheet Initialized');
	},
	setActiveSheet: function(control, i, o) {
		if (control) {
			jS.obj.ui().children('table').hide();
			control.show();
			jS.obj.tabContainer().find('.ui-state-highlight').removeClass('ui-state-highlight');
			jS.i = i;
			jS.obj.tab().parent().addClass('ui-state-highlight');
			jS.sheetSyncSize();
		} else {
			jS.obj.ui().children('table').not(':last').hide();
			jS.obj.tabContainer().find('.ui-state-highlight').removeClass('ui-state-highlight');
			jS.obj.tab().parent().addClass('ui-state-highlight');
		}
	},
	openSheet: function(url, size, skipNotify) {
		jS.obj.parent().html(jS.sheetUI());
		jS.makeControls();
		jS.sheetSyncSize();

		if (skipNotify ? true : confirm("Are you sure you want to open a different sheet?  All unsaved changes will be lost.")) {
			jS.cellEditAbandon(true);
			if (!size) {
				if (url) {
					jQuery('<div />').load(url, function() {
						jQuery(this).find('table').each(function(i) {
							jS.i = i;
							jS.initSheet(true, jQuery(this), i);
						});
					});
				} else {
					jS.initSheet();
				}
			} else if (size.toLowerCase().match('x')) {
				jS.s.title = '';
				jS.initSheet(false, jS.buildSheet(size));
			} else {
				jS.initSheet();
			}
		}
	},
	newSheetDialog: "What size would you like to make your spreadsheet? Example: '5x10' creates a sheet that is 5 columns by 10 rows.",
	newSheet: function() {
		var size = prompt(jS.newSheetDialog);
		if (size) {
			jS.openSheet('', size);
		}
	},
	importRow: function(rowArray) {
		jS.addRow();

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
		jS.calc(jS.obj.sheet());
	},
	importColumn: function(columnArray) {
		jS.addColumn();

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
		jS.calc(jS.obj.sheet());
	},
	importSheet: {
		json: function() {
			sheet = eval('('+data+')');
			size_c = sheet["metadata"]["columns"]*1+5;
			size_r = sheet["metadata"]["rows"]*1+1;
			var div = jQuery("<div />").append("<table />");
			var table = div.find("table:first").attr("id", "jSheet").addClass("jSheet");
			
			for(var x = 1; x <= size_r; x++)
			{
				cur_row = table.append('<tr height="18" />').find("tr:last");
				for(var y = 1; y <= size_c; y++)
				{
					cur_column = jQuery('<td />').attr("id", 'cell_c'+y+'_r'+x);
					cur_row.append(cur_column);
				}
			}
			
			for (row in sheet["data"])
			{
				for (column in sheet["data"][row])
				{
					cur_val = sheet["data"][row][column];
					cur_column = table.find("td#cell_"+column+"_"+row).text(cur_val);
					
					if (cur_val.substr(0,1) == '=')
					{
						cur_column.attr("formula", cur_val);
					}
				}
			}
			
			return div.html();
		}
	},
	exportSheet: {
		xml: function () {
			var sheetClone = jS.sheetDecorateRemove(true);
			var s = jQuery('<div />').html(sheetClone).html();
			
			var x = '';
			var count = 0;
			var cur_column = cur_row = '';
			var max_column = max_row = 0;
			$(s).find('tr').each(function(){
				count = 0;
				$(this).find('td').each(function(){
					count++;
					
					var id = $(this).attr('id');
					var txt = $.trim($(this).text());
					var pos = id.search(/cell_c/i);
					var pos2 = id.search(/_r/i);
					
					if (txt != '' && pos != -1 && pos2 != -1) {
						cur_column = id.substr(pos+6, pos2-(pos+6));
						cur_row = id.substr(pos2+2);
						
						if (max_column < cur_column) max_column = cur_column;
						
						if (max_row < cur_row) max_row = cur_row;
						
						if (count == 1) x += '<r'+cur_row+'>';
						
						formula = $(this).attr('formula');
						if (formula != undefined)
						{
							txt = formula;
						}
						
						x += '<c'+cur_column+'><![CDATA['+txt+']]></c'+cur_column+'>';
					}
				});
				
				if (cur_row != '')
					x += '</r'+cur_row+'>';
				cur_column = cur_row = '';
			});
			
			return '<document><metadata><columns>'+max_column+'</columns><rows>'+max_row+'</rows></metadata><data>'+x+'</data></document>';
		},
		json: function() {
			var sheetClone = jS.sheetDecorateRemove(true);
			var s = jQuery('<div />').html(sheetClone).html();
			var x = {metadata:{},data:{}};
			var count = 0;
			var cur_column = cur_row = '';
			var max_column = max_row = 0;
			$(s).find('tr').each(function(){
				count = 0;
				$(this).find('td').each(function(){
					count++;
					
					var id = $(this).attr('id');
					var txt = $.trim($(this).text());
					var pos = id.search(/cell_c/i);
					var pos2 = id.search(/_r/i);
					
					if (txt != '' && pos != -1 && pos2 != -1) {
						cur_column = id.substr(pos+6, pos2-(pos+6));
						cur_row = id.substr(pos2+2);
						
						if (max_column < cur_column) max_column = cur_column;
						
						if (max_row < cur_row) max_row = cur_row;
						
						if (count == 1) x['data']['r'+cur_row] = {};
						
						formula = $(this).attr('formula');
						if (formula != undefined)
						{
							txt = formula;
						}
						
						x['data']['r'+cur_row]['c'+cur_column] = txt;
					}
				});
				
				cur_column = cur_row = '';
			});
			
			x['metadata'] = {
				"columns": max_column,
				"rows": max_row
			};
			return x;
		}
	},
	buildSheet: function(size) {
		if (!size) {
			size = jS.s.buildSheet;
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

		var standardTr = '<tr height="' + jS.s.colMargin + '" style="height: ' + jS.s.colMarg + ';">' + tds + '</tr>';
		var trs = '';
		for (var i = rowsCount; i >= 1; i--) {
			trs += standardTr;
		}
		
		newSheet.html('<tbody>' + trs + '</tbody>');
		
		newSheet.width(columnsCount * jS.s.newColumnWidth);
		//jS.attrH.syncSheetWidthFromTds(newSheet);
		
		return newSheet;
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
	ajaxCallCount: null,
	ajaxCalled: function() {
		jS.s.ajaxCallsCount--;
		if (!jS.s.ajaxCallsCount) {
			jS.s.afterAjax();
		}
	},
	sheetSyncSize: function(isAppend) {
		var h = jS.s.height;
		if (!h) {
			h = 400; //Height really needs to be set by the parent
		} else if (h < 200) {
			h = 200;
		}
		var w = jS.s.width;
		
		jS.obj.pane()
			.height(
				(h - jS.attrH.height(jS.obj.controls())) -
				(jS.s.colMargin + 6)
			)
			.width(w)
			.parent().width(w);
		
		jS.obj.ui().width(w + jS.s.colMargin - jS.s.boxModelCorrection);
				
		jS.obj.barLeftParent()
			.height(jS.obj.pane().height());
		
		jS.obj.barTopParent()
			.height(jS.s.colMargin)
			.width(w).parent().width(w);
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
	barResizer: function(e, o) {
		//Resize Column & Row & Prototype functions are private under class jSheet		
		var target = jQuery(e.target);
		var barResizer = {
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
				
				if (jS.s.joinedResizing) {
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
						.mousemove(barResizer.drag)
						.mouseup(barResizer.stop);
					
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
				
				jQuery(e.target).parent().css('cursor', 'pointer');
				
				jS.log('stop resizing');
			}
		};
		
		return barResizer.start(e);
	},
	cellFind: function(v) {
		if(!v) {
			v = prompt("What are you looking for in this spreadsheet?");
		}
		if (v) {//We just do a simple uppercase/lowercase search.
			var obj = jS.obj.sheet().find('td:contains("' + v + '")');
			
			if (obj.length < 1) {
				obj = jS.obj.sheet().find('td:contains("' + v.toLowerCase() + '")');
			}
			
			if (obj.length < 1) {
				obj = jS.obj.sheet().find('td:contains("' + v.toUpperCase() + '")');
			}
			
			obj = obj.eq(0);
			if (obj.length > 0) {
				obj.click();
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
				o.endRow = e.target.parentNode.rowIndex;
				o.endColumn = e.target.cellIndex;
				for (var i = o.startRow; i <= o.endRow; i++) {
					for (var j = o.startColumn; j <= o.endColumn; j++) {
						var td = jS.getTd(i, j);
						jQuery(td)
							.addClass(jS.cl.uiCell)
							.addClass(jS.cl.uiCellHighlighted);
					}
				}
			})
			.mouseup(function() {
				jS.obj.sheet()
					.unbind('mousemove')
					.unbind('mouseup');
			});
		return false;
	},
	cellSetActiveAll: function() {
		var rowCount = 0;
		var colCount = 0;
		
		jS.obj.barLeft().find('div').each(function(i) {
			jS.cellSetActiveMultiRow(i);
			rowCount++;
		});
		jS.obj.barTop().find('div').each(function(i) {
			jS.themeRoller.barTop(i);
			colCount++;
		});
		
		jS.fxUpdate('A1:' + cE.columnLabelString(colCount) + rowCount, true);
	},
	cellSetActiveMultiColumn: function(i) {
		jS.obj.sheet().find('tr').each(function() {
			var o = jQuery(this).find('td').eq(i);
			o
				.addClass(jS.cl.uiCell)
				.addClass(jS.cl.uiCellHighlighted);
		});
		
		jS.themeRoller.barTop(i);
	},
	cellSetActiveMultiRow: function(i) {
		jS.obj.sheet().find('tr').eq(i).find('td')
			.addClass(jS.cl.uiCell)
			.addClass(jS.cl.uiCellHighlighted);
		
		jS.themeRoller.barLeft(i);
	},
	sheetClearActive: function() {
		jS.obj.formula().val('');
		jS.obj.cell().removeClass(jS.cl.cell);
		jS.obj.barSelected().removeClass(jS.cl.barSelected);
	},
	getTdRange: function() {
		//three steps here,
		//Get td's
		//Get locations
		//Get labels for locationa and return them
		
		var cells = jS.obj.uiCell().not('.' + jS.cl.cell);
		var firstCellLoc = jS.getTdLocation(cells.eq(0));
		var firstLabel = cE.columnLabelString(firstCellLoc[1]) + firstCellLoc[0];
		var lastCellLoc = jS.getTdLocation(cells.eq(cells.length - 1));
		var lastLabel = cE.columnLabelString(lastCellLoc[1]) + lastCellLoc[0];
		return firstLabel + ":" + lastLabel;
	},
	getTdId: function(row, col) {
		return 'table_' + jS.i + '_cell_c' + col + '_r' + row;
	},
	getTd: function(row, col) {
		return document.getElementById(jS.getTdId(row, col));
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
	tableCellProvider: function() {
		this.tableBodyId = jS.id.sheet + jS.i;
		this.cells = {};
	},
	tableCell: function(row, col) {
		this.tableBodyId = jS.id.sheet + jS.i;
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
	getChart: function(type, data, legend, axisLabels, w, h, row) {
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
			data = data.filter(function(v) { return (v ? v : 0) }); //remove nulls
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
		
		return jS.safeImg(api.make(o), row);
	},
	replaceWithSafeImg: function(o) {  //ensures all pictures will load and keep their respective bar the same size.
		o.each(function() {			
			var src = jQuery(this).attr('src');
			jQuery(this).replaceWith(jS.safeImg(src, jS.getTdLocation(jQuery(this).parent())[0]));
		});
	},
	safeImg: function(src, row) {
		return jQuery('<img />')
			.hide()
			.load(function() { //prevent the image from being too big for the row
				jQuery(this).fadeIn(function() {
					jQuery(this).addClass('safeImg');
					jS.attrH.setHeight(parseInt(row), 'cell');
					jS.attrH.setHeight(parseInt(row), 'bar', true);
				});
			})
			.attr('src', src);
	},
	isDirty:  false,
	setDirty: function(dirty) { jS.isDirty = dirty; }
}

jS.tableCellProvider.prototype = {
	getTd: function() {
		return document.getElementById(jS.getTdId(this.row - 1, this.col - 1));
	},
	getCell: function(row, col) {
		if (typeof(col) == "string") {
			col = cE.columnLabelIndex(col);
		}
		var key = row + "," + col;
		var cell = this.cells[key];
		if (!cell) {
			var tableBody = jS.obj.tableBody();
			if (tableBody) {
				var td = this.getTd(row - 1, col - 1);
				if (td) {
					cell = this.cells[key] = new jS.tableCell(row, col);
				}
			}
		}
		return cell;
	},
	getNumberOfColumns: function(row) {
		var tableBody = jS.obj.tableBody();
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
		jS.obj.sheet().find('tr').each(function() {
			result += this.innerHTML.replace(/\n/g, "") + "\n";
		});
		return result;
	}
};

jS.tableCell.prototype = {
	getTd: function() {
		return document.getElementById(jS.getTdId(this.row - 1, this.col - 1));
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

var key = {
	BACKSPACE: 			8,
	CAPS_LOCK: 			20,
	COMMA: 				188,
	CONTROL: 			17,
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
	UP: 				38
};

var cE = jQuery.calculationEngine = {
	TEST: {},
	ERROR: "#VALUE!",
	cFN: {//cFN = compiler functions, usually mathmatical
		SUM: 	function(x, y) { return x + y; },
		MAX: 	function(x, y) { return x > y ? x: y; },
		MIN: 	function(x, y) { return x < y ? x: y; },
		COUNT: 	function(x, y) { return (y != null) ? x + 1: x; },
		CLEAN: function(v) {
			if (typeof(v) == 'string') {
				v = v.replace(cE.regEx.amp, '&')
						.replace(cE.regEx.nbsp, ' ')
						.replace(/\n/g,'')
						.replace(/\r/g,'');
			}
			return v;
		}
	},
	fn: {//fn = standard functions used in cells
		HTML: function(v) {
			return jQuery(v);
		},
		IMG: function(v) {
			return jS.safeImg(v, cE.calcState.row, cE.calcState.col);
;
		},
		AVERAGE:	function(values) { 
			var arr = cE.foldPrepare(values, arguments);
			return cE.fn.SUM(arr) / cE.fn.COUNT(arr); 
		},
		AVG: 		function(values) { 
			return cE.fn.AVERAGE(values);
		},
		COUNT: 		function(values) { return cE.fold(cE.foldPrepare(values, arguments), cE.cFN.COUNT, 0); },
		SUM: 		function(values) { return cE.fold(cE.foldPrepare(values, arguments), cE.cFN.SUM, 0, true); },
		MAX: 		function(values) { return cE.fold(cE.foldPrepare(values, arguments), cE.cFN.MAX, Number.MIN_VALUE, true); },
		MIN: 		function(values) { return cE.fold(cE.foldPrepare(values, arguments), cE.cFN.MIN, Number.MAX_VALUE, true); },
		ABS	: 		function(v) { return Math.abs(cE.fn.N(v)); },
		CEILING: 	function(v) { return Math.ceil(cE.fn.N(v)); },
		FLOOR: 		function(v) { return Math.floor(cE.fn.N(v)); },
		INT: 		function(v) { return Math.floor(cE.fn.N(v)); },
		ROUND: 		function(v) { return Math.round(cE.fn.N(v)); },
		RAND: 		function(v) { return Math.random(); },
		RND: 		function(v) { return Math.random(); },
		TRUE: 		function() { return true; },
		FALSE: 		function() { return false; },
		NOW: 		function() { return new Date ( ); },
		TODAY: 		function() { return Date( Math.floor( new Date ( ) ) ); },
		DAYSFROM: 	function(year, month, day) { 
			return Math.floor( (new Date() - new Date (year, (month - 1), day)) / 86400000);
		},
		IF:			function(v, t, f){
			t = cE.cFN.CLEAN(t);
			f = cE.cFN.CLEAN(f);
			
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
			var s = String(Math.round(cE.fn.N(v) * x) / x); 
			var p = s.indexOf('.');
			if (p < 0) {
				p = s.length;
				s += '.';
			}
			for (var i = s.length - p - 1; i < decimals; i++) {
				s += '0';
			}
			if (noCommas == true) {// Treats null as false.
				return s;
			}
			var arr	= s.replace('-', '').split('.');
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
		LIST:		function(v, noBlank) {
			var cell = jQuery(jS.getTd(cE.calcState.row, cE.calcState.col - 1));	
			var cellValues = cE.foldPrepare(v, arguments);
			var cellSelectedValue = cell.find('select').val();
			var selectObj = jQuery('<select style="width: 100%;" onchange="jS.calc(jS.obj.sheet());" class="clickable">' + (!noBlank ? '<option value="empty">Select a value</option>' : '') + '</select>');
			var selected = '';
			for (var i = 0; i < (cellValues.length <= 25 ? cellValues.length : 25); i++) {
				var v = '';
				if (selected != 'SELECTED' && cellValues[i] == cellSelectedValue) {
					v = selected = 'SELECTED';
				}
				if (cellValues[i]) {
					selectObj.append('<option ' + v + ' value="' + cellValues[i] + '">' + cellValues[i] + '</option>');
				}
			}
			
			return selectObj;
		},
		INPUTVAL:	function(v) {
			return jQuery(v).val();
		},
		ISCHECKED:		function(v) {
			return v.match("checked");
		},
		RADIO: function() {	
			var cellValues = cE.foldPrepare(v, arguments);
			var cellSelectedValue = jQuery(cE.calcState.cell).find(':checked').val();
			var radioContainer = jQuery('<div />');
			var checked = '';
			for (var i = 0; i < (cellValues.length <= 25 ? cellValues.length : 25); i++) {
				var v = '';
				if (checked != 'CHECKED' && cellValues[i] == cellSelectedValue) {
					v = checked = 'CHECKED';
				}
				radioContainer.append('<input type="radio" ' + v + ' value="' + cellValues[i] + '" name="radioGroup' + jS.getTdId(cE.calcState.row, cE.calcState.col) + '" />Test');
			}
			
			return jQuery(radioContainer);
		},
		CHECKBOX:		function(v) {
			var cell = jQuery(jS.getTd(cE.calcState.row, cE.calcState.col - 1));
			var cellValues = cE.foldPrepare(v, arguments);
			var checkbox = cell.find('input');
			jS.log('Cell html' + cell.html());
			if (checkbox.attr('type') == "checkbox") {
				return checkbox;
			} else {
				return jQuery('<input type="checkbox" ' + (checkbox.is(':checked') ? "CHECKED" : "") + ' value="' + v + '" class="clickable" />');
			}
			
			var cell = jQuery(jS.getTd(cE.calcState.row, cE.calcState.col - 1));	
			var cellValues = cE.foldPrepare(v, arguments);
			var cellSelectedValue = cell.find('select').val();
			var selectObj = jQuery('<select style="width: 100%;" onchange="jS.calc(jS.obj.sheet());" class="clickable">' + (!noBlank ? '<option value="empty">Select a value</option>' : '') + '</select>');
			var selected = '';
			for (var i = 0; i < (cellValues.length <= 25 ? cellValues.length : 25); i++) {
				var v = '';
				if (selected != 'SELECTED' && cellValues[i] == cellSelectedValue) {
					v = selected = 'SELECTED';
				}
				selectObj.append('<option ' + v + ' value="' + cellValues[i] + '">' + cellValues[i] + '</option>');
			}
			
			return selectObj;
		},
		CHART: {
			BAR:	function(v, legend, axisLabels, w, h) {
				return jS.getChart(null, cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
			},
			BARH:	function(v, legend, axisLabels, w, h) {
				return jS.getChart('bhg', cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
			},
			SBAR:	function(v, legend, axisLabels, w, h) {
				return jS.getChart('bvs', cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
			},
			SBARH:	function(v, legend, axisLabels, w, h) {
				return jS.getChart('bhs', cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
			},
			LINE:	function(v, legend, axisLabels, w, h) {
				return jS.getChart('lc', cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
			},
			PIE:	function(v, legend, axisLabels, w, h) {
				return jS.getChart('p', cE.foldPrepare(v, arguments), legend, axisLabels, w, h, cE.calcState.row - 1);
			},
			CUSTOM:	function(type, v, legend, axisLabels, w, h) {
				return jS.getChart(type, cE.foldPrepare(v, arguments), legend, axisLabels,  w, h, cE.calcState.row - 1);
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
			done:			false,
			stack:			[],
			calcMore: 		function(moreFuel) {
								cE.calcState.fuel = moreFuel;
								return cE.calcLoop(cE.calcState);
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
		n: 		/[\$,\s]/g,
		cell: 	/\$?([a-zA-Z]+)\$?([0-9]+)/g,
		range: 	/\$?([a-zA-Z]+)\$?([0-9]+):\$?([a-zA-Z]+)\$?([0-9]+)/g,
		amp: 	/&/g,
		gt: 	/</g,
		lt: 	/>/g,
		nbsp: 	/&nbsp;/g
	},
	str: {
		amp: 	'&amp;',
		lt: 	'&lt;',
		gt: 	'&gt;',
		nbsp: 	'&nbps;'
	},
	parseFormula: function(formula, dependencies) { // Parse formula (without "=" prefix) like "123+SUM(A1:A6)/D5" into JavaScript expression string.
		var nrows = null;
		var ncols = null;
		if (cE.calcState.cellProvider != null) {
			nrows = cE.calcState.cellProvider.nrows;
			ncols = cE.calcState.cellProvider.ncols;
		}
		var arrayReferencesFixed = formula.replace(cE.regEx.range, 
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
		var result = arrayReferencesFixed.replace(cE.regEx.cell, 
			function(ignored, colStr, rowStr) {
				colStr = colStr.toUpperCase();
				if (dependencies != null) {
					dependencies[colStr + rowStr] = [parseInt(rowStr), cE.columnLabelIndex(colStr)]; 
				}
				return "(getCell((" + (rowStr) + "),\"" + (colStr) + "\").getValue())";
			}
		);
		return result;
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
						cE.visitCell(loc[0], loc[1]);
					} else {
						cE.calcState.done = true;
						return null;
					}
				} else {
					if (cE.visitCell(cE.calcState.row, cE.calcState.col) == true) {
						cE.calcState.done = true;
						return null;
					}

					if (cE.calcState.col >= cE.calcState.cellProvider.getNumberOfColumns(cE.calcState.row)) {
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
	visitCell: function(r, c) { // Returns true if done with all cells.
		var cell = cE.calcState.cell = cE.calcState.cellProvider.getCell(r, c);
		if (cell == null) {
			return true;
		} else {
			var value = cell.getValue();
			if (value == null) {
				var formula = cell.getFormula();
				if (formula) {
					var firstChar = formula.charAt(0);
					if (firstChar == '=') {
						var formulaFunc = cell.getFormulaFunc();
						if (formulaFunc == null ||
							formulaFunc.formula != formula) {
							formulaFunc = null;
							try {
								var dependencies = {};
								var body = cE.parseFormula(formula.substring(1), dependencies);
								formulaFunc = function() {
													with (cE.calcState.cellProvider) {
														with (cE.fn) {
															with (cE.calcState.context) {
																return eval(body);
															}
														}
													}
												};
								
								formulaFunc.formula = formula;
								formulaFunc.dependencies = dependencies;
								cell.setFormulaFunc(formulaFunc);
							} catch (e) {
								cell.setValue(cE.ERROR + ': ' + e);
							}
						}
						if (formulaFunc) {
							cE.calcState.stack.push(cE.makeFormulaEval(cell, r, c, formulaFunc));

							// Push the cell's dependencies, first checking for any cycles. 
							var dependencies = formulaFunc.dependencies;
							for (var k in dependencies) {
								if (dependencies[k] instanceof Array &&
									cE.checkCycles(dependencies[k][0], dependencies[k][1]) == true) {
									cell.setValue(cE.ERROR + ': cycle detected');
									cE.calcState.stack.pop();
									return false;
								}
							}
							for (var k in dependencies) {
								if (dependencies[k] instanceof Array) {
									cE.calcState.stack.push(cE.makeCellVisit(dependencies[k][0], dependencies[k][1]));
								}
							}
						}
					} else {
						cell.setValue(cE.parseFormulaStatic(formula));
					}
				}
			}
			return false;
		}
	},
	makeCellVisit: function(row, col) {
		var fn = function() { 
			return cE.visitCell(row, col);
		};
		fn.row = row;
		fn.col = col;
		return fn;
	},
	makeFormulaEval: function(cell, row, col, formulaFunc) {
		var fn = function() {
			try {
				var v = formulaFunc();

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
				//This shouldn't need to be used, usually throws an error when a cell is empty
				//cell.setValue(cE.ERROR + ': ' + e);
			}
		};
		fn.row = row;
		fn.col = col;
		return fn;
	},
	checkCycles: function(row, col) {
		for (var i = 0; i < cE.calcState.stack.length; i++) {
			var item = cE.calcState.stack[i];
			if (item.row != null && 
				item.col != null &&
				item.row == row  &&
				item.col == col) {
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