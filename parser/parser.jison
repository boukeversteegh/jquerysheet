/* description: Parses end evaluates mathematical expressions. */

/* lexical grammar */
%lex
%%
\s+									{/* skip whitespace */}
'"'("\\"["]|[^"])*'"'				{return 'STRING';}
"'"('\\'[']|[^'])*"'"				{return 'STRING';}
'SHEET'[0-9]+						{return 'SHEET';}
'$'[A-Za-z]+'$'[0-9]+				{return 'FIXEDCELL';}
[A-Za-z]+[0-9]+						{return 'CELL';}
[A-Za-z]+ 							{return 'IDENTIFIER';}
[0-9]+(\.[0-9])?			  		{return 'NUMBER';}
"$"									{/* skip whitespace */}
" "									{return ' ';}
"."									{return '.';}
":"									{return ':';}
";"									{return ';';}
","									{return ',';}
"*" 								{return '*';}
"/" 								{return '/';}
"-" 								{return '-';}
"+" 								{return '+';}
"^" 								{return '^';}
"(" 								{return '(';}
")" 								{return ')';}
">" 								{return '>';}
"<" 								{return '<';}
"NOT"								{return 'NOT';}
"PI"								{return 'PI';}
"E"									{return 'E';}
'"'									{return '"';}
"'"									{return "'";}
"!"									{return "!";}
"="									{return '=';}
"%"									{return '%';}
<<EOF>>								{return 'EOF';}


/lex

/* operator associations and precedence (low-top, high- bottom) */
%left '='
%left '<=' '>=' '<>' 'NOT' '||'
%left '>' '<'
%left '+' '-'
%left '*' '/'
%left '^'
%left '%'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
: expression EOF
     {return $1;}
 ;

expression :
	NUMBER
		{$$ = $1 * 1;}
	| STRING
		{$$ = $1.substring(1, $1.length - 1);}
	| expression '=' expression
		{$$ = $1 == $3;}
	| expression '+' expression
		{$$ = $1 + $3;}
	| '(' expression ')'
		{$$ = $2 * 1;}
	| expression '<' '=' expression
		{$$ = ($1 * 1) <= ($4 * 1);}
	| expression '>' '=' expression
		{$$ = ($1 * 1) >= ($4 * 1);}
	| expression '<' '>' expression
		{$$ = ($1 * 1) != ($4 * 1);}
	| expression NOT expression
		{$$ = $1 != $3;}
	| expression '>' expression
		{$$ = ($1 * 1) > ($3 * 1);}
	| expression '<' expression
		{$$ = ($1 * 1) < ($3 * 1);}
	| expression '-' expression
		{$$ = ($1 * 1) - ($3 * 1);}
	| expression '*' expression
		{$$ = ($1 * 1) * ($3 * 1);}
	| expression '/' expression
		{$$ = ($1 * 1) / ($3 * 1);}
	| expression '^' expression
		{$$ = Math.pow(($1 * 1), ($3 * 1));}
	| '-' expression
		{$$ = $2 * -1;}
	| '+' expression
		{$$ = $2 * 1;}
	| NUMBER '%'
		{$$ = $1 * 0.01;}
	| E
		{/*$$ = Math.E;*/;}
	| IDENTIFIER '(' ')'
		{$$ = yy.lexer.cellHandlers.callFunction($1, '', yy.lexer.cell);}
	| IDENTIFIER '(' expseq ')'
		{$$ = yy.lexer.cellHandlers.callFunction($1, $3, yy.lexer.cell);}
	| cell
;

cell :
	FIXEDCELL
		{$$ = yy.lexer.cellHandlers.fixedCellValue.apply(yy.lexer.cell, new Array($1));}
	| FIXEDCELL ':' FIXEDCELL
		{$$ = yy.lexer.cellHandlers.fixedCellRangeValue.apply(yy.lexer.cell, new Array($1, $3));}
	| CELL
		{$$ = yy.lexer.cellHandlers.cellValue.apply(yy.lexer.cell, new Array($1));}
	| CELL ':' CELL
		{$$ = yy.lexer.cellHandlers.cellRangeValue.apply(yy.lexer.cell, new Array($1, $3));}
	| SHEET '!' CELL
		{$$ = yy.lexer.cellHandlers.remoteCellValue.apply(yy.lexer.cell, new Array($1, $3));}
	| SHEET '!' CELL ':' CELL
		{$$ = yy.lexer.cellHandlers.remoteCellRangeValue.apply(yy.lexer.cell, new Array($1, $3, $5));}
;

expseq : 
	expression
	| expression ';' expseq
 	{
 		$$ = (jQuery.isArray($3) ? $3 : [$3]);
	 	$$.push($1);
 	}
 	| expression ',' expseq
	{
 		$$ = (jQuery.isArray($3) ? $3 : [$3]);
	 	$$.push($1);
 	}
 ;