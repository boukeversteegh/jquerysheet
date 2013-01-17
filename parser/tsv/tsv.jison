/* description: Parses a tab separated value to an array */

/* lexical grammar */
%lex
%s d s
%%
<d>'"' {
	this.popState('d');
	return 'DOUBLE_PARENTHESES';
}
'"' {
	this.begin('d');
	return 'DOUBLE_PARENTHESES';
}
<s>"'" {
	this.popState('s');
	return 'SINGLE_PARENTHESES';
}
"'" {
	this.begin('s');
	return 'SINGLE_PARENTHESES';
}
<s>(\n|"\n")                        {return 'CHAR';}
<d>(\n|"\n")                        {return 'CHAR';}
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
	DOUBLE_PARENTHESES chars DOUBLE_PARENTHESES {
		$$ = $2;
	}
	| SINGLE_PARENTHESES chars SINGLE_PARENTHESES {
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