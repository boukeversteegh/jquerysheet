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
				OBJVAL: function (selector) {
					var val = jQuery.trim(jQuery(selector).text());

					if (!isNaN(val)) {
						val *= 1;
					}

					return val;
				}
			},
			updateObjectValue: function(i) {
				//first detect if the object exists if not return nothing
				if (!jP.obj[i]) return 'Error: Object not found';

				var obj = jP.obj[i],
					$obj = jQuery(jP.obj[i]);

				$obj.data('oldValue', $obj.html()); //we detect the last value, so that we don't have to update all objects, thus saving resources

				if ($obj.data('state')) {
					throw("Error: Loop Detected");
				}

				obj.state = 'red';
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
							Parser.lexer.cell = {
								i: i,
								cell: obj,
								jP: jP
							};
							Parser.lexer.cellHandlers = jP.objHandlers;
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

				obj.state = null;

				return obj.value;
			},
			objHandlers: {
				callFunction: function(fn, args, obj) {
					if (!args) {
						args = [''];
					} else if (jQuery.isArray(args)) {
						args = args.reverse();
					} else {
						args = [args];
					}

					if (jP.fn[fn]) {
						jP.obj[obj.i].fnCount++;
						return jP.fn[fn].apply(obj, args);
					} else {
						return "Error: Function Not Found";
					}
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
			ignite(i);
		}
	}
});