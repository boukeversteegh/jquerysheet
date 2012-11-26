jQuery.fn.extend({
	pseudoSheet: function(settings) {
		settings = jQuery.extend({}, settings);

		var jP = jQuery.pseudoSheet.createInstance(this);
		jP.calc();

		return this;
	}
});

jQuery.pseudoSheet = { //jQuery.pseudoSheet
	createInstance: function(obj) {
		var jP = {
			obj: obj,
			calc: function() {
				jP.calcLast = new Date();
				jPE.calc(jP, jP.updateObjectValue);
			},
			calcLast: 0,
			callStack: 0,
			fn: {
				OBJVAL: function (selector) {
					var values = [];
					jQuery(selector).each(function() {
						var value = jP.updateObjectValue(this);
						if (!isNaN(value)) {
							value *= 1;
						}
						values.push(value ? value : '');
					});

					return (values.length > 1 ? values : values[0]);
				}
			},
			updateObjectValue: function(obj) {
				//first detect if the object exists if not return nothing
				if (!obj) return 'Error: Object not found';

				var	$obj = jQuery(obj),
					isInput = $obj.is(':input');

				if (isInput) {
					if ($obj.is(':radio,:checkbox')) {
						if ($obj.is(':checked')) {
							obj.val = $obj.val();
						} else {
							obj.val = '';
						}
					} else {
						obj.val = $obj.val();
					}
				} else {
					obj.val = $obj.html();
				}

				$obj.data('oldValue', obj.val); //we detect the last value, so that we don't have to update all objects, thus saving resources

				if ($obj.data('state')) {
					throw("Error: Loop Detected");
				}

				$obj.data('state', 'red');
				obj.html = [];
				obj.fnCount = 0;
				obj.calcCount = (obj.calcCount ? obj.calcCount : 0);
				obj.calcLast = (obj.calcLast ? obj.calcLast : 0);

				if (obj.calcCount < 1 && obj.calcLast != jP.calcLast) {
					obj.calcLast = jP.calcLast;
					obj.calcCount++;
					var Parser;
					if (jP.callStack) { //we prevent parsers from overwriting each other
						if (!obj.parser) { //cut down on un-needed parser creation
							obj.parser = (new jP.parser);
						}
						Parser = obj.parser
					} else {//use the sheet's parser if there aren't many calls in the callStack
						Parser = jP.Parser;
					}

					jP.callStack++
					Parser.lexer.obj = {
						obj: obj,
						type: 'object',
						jP: jP
					};
					Parser.lexer.handler = jP.objHandler;

					var data = $obj.data();
					jQuery.each(data, function(i) {
						switch(i) {
							case 'visible':
								if (data[i].charAt(0) == '=') {
									var visible = data[i].substring(1, data[i].length);
									visible = Parser.parse(visible);
									if (visible) {
										$obj.show();
									} else {
										$obj.hide();
									}
								}
								break;
							case 'enabled':
								if (data[i].charAt(0) == '=') {
									var enabled = data[i].substring(1, data[i].length);
									enabled = Parser.parse(enabled);
									if (enabled) {
										$obj.removeAttr('disabled');
									} else {
										$obj.attr('disabled', true);
									}
								}
								break;
						}
					});

					obj.formula = $obj.data('formula');
					if (obj.formula) {
						try {
							if (obj.formula.charAt(0) == '=') {
								obj.formula = obj.formula.substring(1, obj.formula.length);
							}

							obj.result = Parser.parse(obj.formula);
						} catch(e) {
							console.log(e);
							obj.val = e.toString().replace(/\n/g, '<br />'); //error
						}
						jP.callStack--;

						if (typeof obj.result != 'undefined') {
							if (obj.result.value) {
								obj.val = obj.result.value;
							} else {
								obj.val = obj.result;
							}
							if (!obj.result.html && !obj.result.value) {
								obj.result = {val: obj.result, html: obj.result};
							} else {
								obj.result.html = obj.val;
							}
						} else {
							obj.result = {html: obj.val};
						}

						if (isInput) {
							$obj.val(obj.val);
						} else {
							$obj.html(obj.result.html);
						}
					}
				}

				$obj.removeData('state');

				return obj.val;
			},
			objHandler: {
				callFunction: function(fn, args, obj) {
					if (!args) {
						args = [''];
					} else if (jQuery.isArray(args)) {
						args = args.reverse();
					} else {
						args = [args];
					}

					if (jP.fn[fn]) {
						obj.obj.fnCount++;
						var values = [],
							html = [];

						for(i in args) {
							if (args[i].value && args[i].html) {
								values.push(args[i].value);
								html.push(args[i].html);
							} else {
								values.push(args[i]);
								html.push(args[i]);
							}
						}

						obj.html = html;

						return jP.fn[fn].apply(obj, values);
					} else {
						return "Error: Function Not Found";
					}
				},
				variable: function() {
					var varName = arguments;

					if (varName.length == 1) {
						switch (varName[0].toLowerCase()) {
							case "true" :   return true;
							case "false":   return false;
						}
					}

					var $obj = jQuery('#' + varName[0]);
					if (!$obj.length) $obj = jQuery('[name="' + varName[0] + '"]');
					if (!$obj.length) throw("Error: Object not found");

					if (varName.length > 1) {
						switch (varName[1]) {
							case "visible": return ($obj.is(':visible') ? true : false);
							case "enabled": return ($obj.is(':enabled') ? true : false);
							case "value":   return jP.objHandler.getObjectValue($obj);
							default:        throw("Error: Attribute not found");
						}
					}

					return jP.objHandler.getObjectValue($obj);
				},
				getObjectValue: function($obj) {
					if ($obj.is(':radio,:checkbox')) {
						$obj = $obj.filter(':checked');
					}

					//We don't throw an error here if the item doesn't exist, because we have ensured it does, it is most likely filtered at this point
					if (!$obj[0]) {
						$obj[0] = jQuery('<div />');
					}

					return jP.updateObjectValue($obj[0]);
				}
			}
		};

		if (jQuery.sheet.fn) { //If the new calculations engine is alive, fill it too, we will remove above when no longer needed.
			//Extend the calculation engine plugins
			jP.fn = jQuery.extend(jQuery.sheet.fn, jP.fn);

			//Extend the calculation engine with advanced functions
			if (jQuery.sheet.advancedfn) {
				jP.fn = jQuery.extend(jP.fn, jQuery.sheet.advancedfn);
			}

			//Extend the calculation engine with finance functions
			if (jQuery.sheet.financefn) {
				jP.fn = jQuery.extend(jP.fn, jQuery.sheet.financefn);
			}
		}

		//ready the sheet's parser
		jP.lexer = function() {};
		jP.lexer.prototype = parser.lexer;
		jP.parser = function() {
			this.lexer = new jP.lexer();
			this.yy = {};
		};
		jP.parser.prototype = parser;

		jP.Parser = new jP.parser;

		return jP;
	}
};


var jPE = jQuery.pseudoSheetEngine = {//Pseudo Sheet Formula Engine
	calc: function(jP, ignite) {
		for (var i = 0; i < jP.obj.length; i++) {
			jP.obj[i].calcCount = 0;
		}

		for (var i = 0; i < jP.obj.length; i++) {
			ignite(jP.obj[i]);
		}
	}
};