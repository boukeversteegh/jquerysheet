jQuery.sheet.financefn = {
	NPV: function(i, v) {
		var values =arrHelpers.foldPrepare(v, arguments);
		var result = 0;
		
		for (var t = 0; t < values.length; t++) {
			result += values[t] / Math.pow((i / 100) + 1, t + 1);
		}
		
		return result;
	},
	PMT: function(rate, nper, pv, fv){
		var pmt_value = 0;
		rate = rate / 100;
		fv = parseFloat(fv ? fv : 0); //optional
	
		if ( rate == 0 ) {
			pmt_value = - (fv + pv)/nper;	
		} else {
			x = Math.pow(1 + rate,nper);
			pmt_value = -((rate * (fv + x * pv))/(-1 + x));
		}
		
		return this.ROUND(pmt_value, 2);
	},
	NPER: function(rate, payment, pv, fv, type) { //not working yet
		return Math.log(
				(payment*(1.0+rate*type) + (-1.0/rate)*fv)
				/
				(pv*rate + payment*(1.0 + rate*type))
			)
			/ Math.log(1.0+rate);
	},
	FV: function(rate, nper, pmt, pv, type) { //not working yet
		return -(
			pv*Math.pow(1.0+rate, nper)
			+ pmt * (1.0 + rate*type)
				* (Math.pow(1.0+rate, nper) - 1.0) / rate
		);
	}
}; 
