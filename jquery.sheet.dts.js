(function($) {
	jQuery.sheet.dts = {
		toTable: {
			json: function(jS) {},
			xml: function(xml) {
				xml = $(xml);


			},
			size: function() {}
		},
		fromTable: {
			json: function(jS) {
			},
			xml: function(jS) {
				var output = '<spreadsheets>';

				$.each(jS.spreadsheets, function(sheet) {
					jS.i = sheet;
					var metadata = [];
					output += '<spreadsheet>';

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

							if (row == 1) {
								metadata[column] = '<width>' + $(jS.col(null, column)).css('width') + '</width>'
							}
						});
						output += '</row>';
					});

					output += '<metadata>' +
						'<title>' + jS.s.title + '</title>'
					metadata.join('') + '</metadata>';

					output += '</spreadsheet>';
				});

				output += '</spreadsheets>';

				return output;
			}
		}
	};
})(jQuery);