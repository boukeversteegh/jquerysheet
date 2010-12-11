/* description: Parses end evaluates mathematical expressions. */

/* lexical grammar */
%lex
%%
\s+				{/* skip whitespace */}
[A-Z][0-9][:][A-Z][0-9]+	{return 'CELL';}
[A-Z][0-9]+			{return 'CELL';}
["](\\.|[^"])*["]		{return 'STRINGLITERAL';}
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
%left '"' "'"

%start expressions

%% /* language grammar */

expressions
 : '=' e EOF
     {return $2;}
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
		{
			var d = new Date($1).toString();
		}
	| NUMBER
		{$$ = Number(yytext);}
	| E
		{$$ = Math.E;}
	| CELL
		{$$ = arguments[6].cellValue($1);}
	| STRINGLITERAL
		{$$ = $1.substring(1, $1.length - 1);}	
	| IDENTIFIER '(' ')'
		{$$ = jQuery.sheet.fn[$1]();}
	| IDENTIFIER '(' expseq ')'
		{$$ = jQuery.sheet.fn[$1]($3);}
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
