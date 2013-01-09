(function($) {
	jQuery.sheet.dts = {
		toTables: {
			json: function(json) {

				var tables = $([]);

				$.each(json, function() {
					var table = $('<table />').attr('title', this.title || '');

					tables = tables.add(table);

					$.each(this.rows, function() {
						var tr = $('<tr />')
							.attr('height', this.height)
							.css('height', this.height)
							.appendTo(table);
						$.each(this.columns, function() {
							var td = $('<td />')
								.attr('class', this.class || '')
								.attr('style', this.style || '')
								.attr('formula', this.formula || '')
								.html(this.value || '')
								.appendTo(tr);
						});
					});

					if (!this.metadata) return;
					if (!this.metadata.width) return;

					var colgroup = $('<colgroup />');
					$.each(this.metadata.widths, function() {
						var col = $('<col />')
							.attr('width', this.width)
							.css('width', this.width);
					});
				});

				return tables;
			},
			xml: function(xml) {
				xml = $(xml);

				var tables = $([]);

				xml.each(function(spreadsheet) { //spreadsheets
					$(this).children().each(function() { //spreadsheet
						var table = $('<table />').attr('title', $(this).attr('title') || ''),
							colgroup = $('<colgroup/>').appendTo(table),
							tbody = $('<tbody />').appendTo(table);

						tables = tables.add(table);
						$(this).children().each(function(){ //rows
							switch (this.nodeName.toLowerCase()) {
								case 'rows':
									$(this).children().each(function() { //row
										switch (this.nodeName.toLowerCase()) {
											case 'row':
												var tr = $('<tr/>').appendTo(tbody);
												tr
													.css('height', $(this).attr('height'))
													.attr('height', $(this).attr('height'));
												$(this).children().each(function() {
													switch (this.nodeName.toLowerCase()) {
														case 'columns':
															$(this).children().each(function() {
																switch (this.nodeName.toLowerCase()) {
																	case 'column':
																		//console.log(this.nodeName.toLowerCase());
																		var td = $('<td />').appendTo(tr);
																		$(this).children().each(function() { //formula or value or style
																			switch (this.nodeName.toLowerCase()) {
																				case 'formula':
																					td.attr('formula', $(this).html());
																					break
																				case 'value':
																					td.html($(this).html());
																					break;
																				case 'style':
																					td.attr('style', $(this).html());
																					break;
																				case 'class':
																					td.attr('class', $(this).html());
																			}
																		});
																		break;
																}
															});
													}
												});

												break;

										}
									});
									break;
								case 'metadata':
									$(this).children().each(function() {
										switch (this.nodeName.toLowerCase()) {
											case 'widths':
												$(this).children().each(function() {
													switch (this.nodeName.toLowerCase()) {
														case 'width':
															$('<col/>')
																.attr('width', $(this).text())
																.css('width', $(this).text())
																.appendTo(colgroup);
															break;
													}
												});
												break;
										}
									});
									break;
							}
						});
					});
				});

				return tables;
			},
			size: function() {}
		},
		fromTables: {
			json: function(jS) {
				var output = [], i = 1 * jS.i;

				$.each(jS.spreadsheets, function(sheet) {
					jS.i = sheet;
					var metadata = [];
					var spreadsheet = {
						"title": (jS.obj.sheet().attr('title') || ''),
						"rows": [],
						"metadata": {
							"widths": []
						}
					};
					output.push(spreadsheet);

					$.each(jS.spreadsheets[sheet], function (row) {
						if (row == 0) return;
						var Row = {
							"height": (jS.spreadsheets[sheet][row][1].td.parent().attr('height') || jS.s.colMargin + 'px'),
							"columns": []
						};
						spreadsheet.rows.push(Row);

						$.each(jS.spreadsheets[sheet][row], function(column) {
							if (column == 0) return;
							var Column = {};
							Row.columns.push(Column);

							if (this.formula) Column.formula = '=' + this.formula;
							if (this.value) Column.value = this.value;
							if (this.td.attr('style')) Column.style = this.td.attr('style');
							if (this.td.attr('class')) Column.class = this.td.attr('class');

							if (row * 1 == 1) {
								spreadsheet.metadata.widths.push($(jS.col(null, column)).css('width'));
							}
						});
					});
				});
				jS.i = i;

				return output;
			},
			xml: function(jS) {
				var output = '<spreadsheets>', i = 1 * jS.i;

				$.each(jS.spreadsheets, function(sheet) {
					jS.i = sheet;
					var widths = [];
					output += '<spreadsheet title="' + (jS.obj.sheet().attr('title') || '') + '">';

					output += '<rows>';
					$.each(jS.spreadsheets[sheet], function (row) {
						if (row == 0) return;

						output += '<row height="' + (jS.spreadsheets[sheet][row][1].td.parent().attr('height') || jS.s.colMargin + 'px') + '">';
						output += '<columns>';
						$.each(jS.spreadsheets[sheet][row], function(column) {
							if (column == 0) return;

							output += '<column>';

							if (this.formula) output += '<formula>=' + this.formula + '</formula>';
							if (this.value) output += '<value>' + this.value + '</value>';
							if (this.td.attr('style')) output += '<style>' + this.td.attr('style') + '</style>';
							if (this.td.attr('class')) output += '<class>' + this.td.attr('class') + '</class>';
							output += '</column>';

							if (row * 1 == 1) {
								widths[column] = '<width>' + $(jS.col(null, column)).css('width') + '</width>';
							}
						});
						output += '</columns>';
						output += '</row>';
					});
					output += '</rows>';

					output += '<metadata><widths>' + widths.join('') + '</widths></metadata>';

					output += '</spreadsheet>';
				});

				output += '</spreadsheets>';

				jS.i = i;
				return output;
			}
		}
	};
})(jQuery);