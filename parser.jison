/* description: Parses end evaluates mathematical expressions. */

/* lexical grammar */
%lex
%%
\s+				{/* skip whitespace */}
'TABLE'[0-9][:][A-Z][0-9][:][A-Z][0-9]+ 	{return 'REMOTECELLRANGE';}
'TABLE'[0-9][:][A-Z][0-9]+ 	{return 'REMOTECELL';}
[A-Z][0-9][:][A-Z][0-9]+	{return 'CELLRANGE';}
[A-Z][0-9]+			{return 'CELL';}
'"'("\\"["]|[^"])*'"'		{return 'STRINGL';}
"'"('\\'[']|[^'])*"'"		{return 'STRING';}
[A-Za-z]+ 			{return 'IDENTIFIER';}
[0-9]([0-9]?)[-/][0-9]([0-9]?)[-/][0-9]([0-9]?)([0-9]?)([0-9]?) {return 'DATE';}
[0-9]+("."[0-9]+)?  		{return 'NUMBER';}
"$"				{/* skip whitespace */}
" "				{return ' ';}
"."				{return '.';}
":"				{return ':';}
";"				{return ';';}
","				{return ',';}
"*" 				{return '*';}
"/" 				{return '/';}
"-" 				{return '-';}
"+" 				{return '+';}
"^" 				{return '^';}
"(" 				{return '(';}
")" 				{return ')';}
">" 				{return '>';}
"<" 				{return '<';}
">=" 				{return '>=';}
"<=" 				{return '<=';}
"<>"				{return '<>';}
"NOT"				{return 'NOT';}
"PI"				{return 'PI';}
"E"				{return 'E';}
'"'				{return '"';}
"'"				{return "'";}
<<EOF>>				{return 'EOF';}
"="				{return '=';}


/lex

/* operator associations and precedence (low-top, high- bottom) */
%left '<=' '>=' '<>' 'NOT' '||'
%left '>' '<'
%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
 : e EOF
     {return $1;}
 ;

e
	: e '<=' e
		{$$ = $1 <= $3;}
	| e '>=' e
		{$$ = $1 >= $3;}
	| e '<>' e
		{$$ = $1 != $3;}
	| e NOT e
		{$$ = $1 != $3;}
	| e '>' e
		{$$ = $1 > $3;}
	| e '<' e
		{$$ = $1 < $3;}
	| e '+' e
		{$$ = $1 + $3;}
	| e '-' e
		{$$ = $1 - $3;}
	| e '*' e
		{$$ = $1 * $3;}
	| e '/' e
		{$$ = $1 / $3;}
	| e '^' e
		{$$ = Math.pow($1, $3);}
	| '-' e %prec UMINUS
		{$$ = -$2;}
	| '(' e ')'
		{$$ = $2;}
	| DATE
		{/*$$ = new Date($1).toString();*/}
	| NUMBER
		{$$ = Number(yytext);}
	| E
		{$$ = Math.E;}
	| CELL
		{$$ = arguments[6].cellValue($1);}
	| CELLRANGE
		{$$ = arguments[6].cellRangeValue($1);}
	| REMOTECELL
		{$$ = arguments[6].remoteCellValue($1);}
	| REMOTECELLRANGE
		{$$ = arguments[6].remoteCellRangeValue($1);}
	| STRING
		{$$ = $1.substring(1, $1.length - 1);}	
	| IDENTIFIER '(' ')'
		{$$ = jQuery.sheet.fn[$1]();}
	| IDENTIFIER '(' expseq ')'
		{
			if (jQuery.isArray($3))
		 		$3.reverse();
			$$ = jQuery.sheet.fn[$1](arguments = $3);
		}
 ;

expseq
 : e
	| e ';' expseq
 	{
 		$$ = ($.isArray($3) ? $3 : [$3]);
	 	$$.push($1);
 	}
 	| e ',' expseq
	{
 		$$ = ($.isArray($3) ? $3 : [$3]);
	 	$$.push($1);
 	}
 ;