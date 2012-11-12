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
				OBJVAL: function (selector, getAll) {
					if (getAll) {
						var values = [];
						jQuery(selector).each(function() {
							values.push(jP.fn.OBJVAL(this));
						});
						return values;
					}

					var val = jP.updateObjectValue(jQuery(selector)[0]);

					if (!isNaN(val)) {
						val *= 1;
					}

					return val;
				}
			},
			updateObjectValue: function(obj) {
				//first detect if the object exists if not return nothing
				if (!obj) return 'Error: Object not found';

				var	$obj = jQuery(obj),
					isInput = $obj.is(':input');

				if (isInput) {
					obj.value = $obj.val();
				} else {
					obj.value = $obj.html();
				}

				$obj.data('oldValue', obj.value); //we detect the last value, so that we don't have to update all objects, thus saving resources

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

							obj.value = Parser.parse(obj.formula);
						} catch(e) {
							console.log(e);
							obj.value = e.toString().replace(/\n/g, '<br />'); //error
						}
						jP.callStack--;
					}

					if (obj.fnCount == obj.html.length && obj.html.length > 0) { //if object has an html front bring that to the value but preserve it's value
						if (isInput) {
							$obj.val(obj.html[0]);
						} else {
							$obj.html(obj.html[0]);
						}
					} else {
						if (isInput) {
							$obj.val(obj.value);
						} else {
							$obj.html(obj.value);
						}
					}
				}

				$obj.data('state', null);

				if (jQuery.isPlainObject(obj.value)) {
					obj.value = "object";
				}

				if (jQuery.isArray(obj.value)) {
					obj.value = "array";
				}

				return obj.value;
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
						return jP.fn[fn].apply(obj, args);
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
					if (!$obj.length) throw("Error: Variable not found");

					if (varName.length > 1) {
						switch (varName[1]) {
							case "visible": return ($obj.is(':visible') ? 'TRUE' : 'FALSE');
							case "enabled": return ($obj.is(':enabled') ? 'TRUE' : 'FALSE');
							case "value":   return this.getObjectValue($obj);
							default:        throw("Error: Attribute not found");
						}
					}

					return jP.objHandler.getObjectValue($obj);
				},
				getObjectValue: function($obj) {
					if ($obj.is(':radio,:checkbox:checked')) {
						console.log($obj);
						console.log($obj.filter(':checked')[0]);
						return jP.updateObjectValue($obj.filter(':checked')[0]);
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


var jPE = jQuery.pseudoSheetEngine = jQuery.extend(jSE, {//Pseudo Sheet Formula Engine
	calc: function(jP, ignite) {
		for (var i = 0; i < jP.obj.length; i++) {
			jP.obj[i].calcCount = 0;
		}

		for (var i = 0; i < jP.obj.length; i++) {
			ignite(jP.obj[i]);
		}
	}
});