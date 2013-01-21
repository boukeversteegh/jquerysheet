/* description: Parses a tab separated value to an array */

/* lexical grammar */
%lex
%s DOUBLE_QUOTATION_ON SINGLE_QUOTATION_ON
%%
<DOUBLE_QUOTATION_ON>'"' {
	this.popState('d');
	return 'DOUBLE_QUOTATION';
'"' {
	this.begin('d');
	return 'DOUBLE_QUOTATION';
}
<SINGLE_QUOTATION_ON>"'" {
	this.popState('s');
	return 'SINGLE_QUOTATION';
}
"'" {
	this.begin('s');
	return 'SINGLE_QUOTATION';
}
<DOUBLE_QUOTATION_ON>(\n|"\n")      {return 'CHAR';}
<SINGLE_QUOTATION_ON>(\n|"\n")      {return 'CHAR';}
(\n|"\n")                           {return 'END_OF_LINE';}
(\t)                                {return 'COLUMN';}
(\s)								{return 'CHAR';}
.                                   {return 'CHAR';}
<<EOF>>								{return 'EOF';}


/lex

%start cells

%% /* language grammar */

cells :
	rows EOF {
        return $1;
    }
;

rows :
	row {
		$$ = [$1];
	}
	| rows row {
		$1 = $1 || [];
		$1.push($2);
	}
;

row :
	END_OF_LINE {
		$$ = [];
	}
	| columns {
		$$ = [$1];
	}
	| row columns {
		$1 = $1 || [];
		$1.push($2);
		$$ = $1;
	}
;

columns :
	COLUMN {
		$$ = '';
	}
	| string {
		$$ = $1;
    }
	| columns string {
		$$ = $2;
	}
;

string :
	DOUBLE_QUOTATION chars DOUBLE_QUOTATION {
		$$ = $2;
	}
	| SINGLE_QUOTATION chars SINGLE_QUOTATION {
		$$ = $2;
	}
	| chars {
		$$ = $1;
	}
;

chars :
	CHAR {
		$$ = $1;
	}
	| chars CHAR {
		$$ = $1 + $2;
	}
;