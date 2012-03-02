jQuery.sheet.financefn = {
	NPV: function(rate) {
		rate = rate * 1;
		var factor = 1;
		var sum = 0;
		
		for(var i = 1; i < arguments.length; i++) {
			var factor = factor * (1 + rate);
			sum += arguments[i] / factor;
		}
		
		return sum;
	},
	PMT: function(rate, nper, pv, fv, type){
		fv = (fv ? fv : 0);
		type = (type ? type : 0);
		var invert = (pv < 0 ? true : false);
		pv = Math.abs(pv);
		
		var v = ((-rate * (pv * Math.pow(1.0 + rate, nper) + fv)) /
				((1.0 + rate * type) * (Math.pow(1.0 + rate, nper) - 1))
			);
		
		return (invert ? -v : v);
	},
	NPER: function(rate, payment, pv, fv, type) { //not working yet
		fv = (fv ? fv : 0);
		type = (type ? type : 0);
		var invert = (payment < 0 ? true : false);
		payment = Math.abs(payment);
		
		var v = (
			Math.log(
				(-payment * (1.0 + rate * type) + (-1.0 / rate) * fv) /
				(pv * rate + -payment * (1.0 + rate * type))
			) /
			Math.log(1.0 + rate)
		);

		return (invert ? v : -v);
	},
	FV: function(rate, nper, pmt, pv, type) { //not working yet
		pv = (pv ? pv : 0);
		type = (type ? type : 0);
		return -(
			pv*Math.pow(1.0+rate, nper)
			+ pmt * (1.0 + rate*type)
				* (Math.pow(1.0+rate, nper) - 1.0) / rate
		);
	}
}; 
