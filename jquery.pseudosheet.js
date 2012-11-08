jQuery.fn.extend({
	pseudoSheet: function(settings) {
		settings = jQuery.extend({}, settings);

		var jP = jQuery.pseudoSheet.createInstance(this);
		jP.calc();

		return this;
	}
});

jQuery.pseudoSheet = { //jQuery.pseudoSheet
	createInstance: function(objs) {
		var jP = {
			obj: objs,
			calc: function() {
				jP.calcLast = new Date();
				jPE.calc(objs, jP.updateObjectValue);
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

				var	$obj = jQuery(obj);

				if ($obj.is(':input')) {
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

				if (obj.calcCount < 1 && obj.calcLast != jP.calcLast) {
					obj.calcLast = jP.calcLast;
					obj.calcCount++;
					obj.formula = $obj.data('formula');
					if (obj.formula) {
						try {
							if (obj.formula.charAt(0) == '=') {
								obj.formula = obj.formula.substring(1, obj.formula.length);
							}

							var Parser;
							if (jP.callStack) { //we prevent parsers from overwriting each other
								if (!object.parser) { //cut down on un-needed parser creation
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
							obj.value = Parser.parse(obj.formula);
						} catch(e) {
							console.log(e);
							obj.value = e.toString().replace(/\n/g, '<br />'); //error
						}
						jP.callStack--;
					}

					if (obj.fnCount == obj.html.length && obj.html.length > 0) { //if object has an html front bring that to the value but preserve it's value
						$obj.html(obj.html[0]);
					} else {
						$obj.html(obj.value);
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
						obj.fnCount++;
						return jP.fn[fn].apply(obj, args);
					} else {
						return "Error: Function Not Found";
					}
				},
				variable: function() {
					switch (name.toLowerCase()) {
						case "true" :   return 'TRUE';
						case "false":   return 'TRUE';
					}

					var varName = arguments;
					if (varName.length > 1) {
						var $obj = $('#' + varName[0]);

						if ($obj.length) {
							switch (varName[1]) {
								case "visible": return ($obj.is(':visible') ? 'TRUE' : 'FALSE');
								case "enabled": return ($obj.is(':enabled') ? 'TRUE' : 'FALSE');
								case "value": return jP.updateObjectValue($obj[0]);
								default:
									return jP.updateObjectValue($obj[0]);
							}
						}
					} else {
						var $obj = $('#' + varName[0]);
						if ($obj.length) {

							return jP.updateObjectValue($obj[0]);
						}
					}

					throw("Error: Variable not found");
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
	calc: function(elements, ignite, freshCalc) {
		for (var i = 0; i < elements.length; i++) {
			elements[i].calcCount = 0;
		}

		for (var i = 0; i < elements.length; i++) {
			ignite(elements[i]);
		}
	}
});