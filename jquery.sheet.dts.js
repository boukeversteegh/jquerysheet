(function($) {
	jQuery.sheet.dts = {
		toTable: {
			json: function(jS) {},
			xml: function(xml) {
				xml = $(xml);

				var tables = $([]);

				xml.each(function(spreadsheet) { //spreadsheets
					$(this).children().each(function() {
						var table = $('<table />').attr('title', $(this).attr('title') || ''),
							colgroup = $('<colgroup/>').appendTo(table),
							tbody = $('<tbody />').appendTo(table);

						tables = tables.add(table);
						$(this).children().each(function(row) {
							switch (this.nodeName.toLowerCase()) {
								case 'row':
									var tr = $('<tr/>').appendTo(tbody);
									tr
										.css('height', $(this).attr('height'))
										.attr('height', $(this).attr('height'));

									$(this).children().each(function() { //column
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
									});
									break;
								case 'metadata':
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
					});
				});

				return tables;
			},
			size: function() {}
		},
		fromTable: {
			json: function(jS) {
			},
			xml: function(jS) {
				var output = '<spreadsheets title="' + (jS.s.title || '') + '">';

				$.each(jS.spreadsheets, function(sheet) {
					jS.i = sheet;
					var metadata = [];
					output += '<spreadsheet title="' + (jS.obj.sheet().attr('title') || '') + '">';

					$.each(jS.spreadsheets[sheet], function (row) {
						if (row == 0) return;

						output += '<row height="' + (this[1].td.parent().css('height') || jS.s.colMargin) + '">';
						$.each(jS.spreadsheets[sheet][row], function(column) {
							if (column == 0) return;

							output += '<column>';

							if (this.formula) output += '<formula>=' + this.formula + '</formula>';
							if (this.value) output += '<value>' + this.value + '</value>'
							if (this.td.attr('style')) output += '<style>' + this.td.attr('style') + '</style>'
							output += '</column>';

							if (row * 1 == 1) {
								metadata[column] = '<width>' + $(jS.col(null, column)).css('width') + '</width>'
							}
						});
						output += '</row>';
					});

					output += '<metadata>' + metadata.join('') + '</metadata>';

					output += '</spreadsheet>';
				});

				output += '</spreadsheets>';

				return output;
			}
		}
	};
})(jQuery);