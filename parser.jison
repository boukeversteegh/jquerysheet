/* description: Parses end evaluates mathematical expressions. */

/* lexical grammar */
%lex
%%
\s+				{/* skip whitespace */}
[A-Z][0-9][:][A-Z][0-9]+	{return 'CELL';}
[A-Z][0-9]+	{return 'CELL';}
[A-Za-z]+                   	{return 'IDENTIFIER';}
[0-9]+("."[0-9]+)?  		{return 'NUMBER';}
";"			{return ';';}
"*"		      {return '*';}
"/"                   {return '/';}
"-"                   {return '-';}
"+"                   {return '+';}
"^"                   {return '^';}
"("                   {return '(';}
")"                   {return ')';}
"PI"                  {return 'PI';}
"E"                   {return 'E';}
<<EOF>>               {return 'EOF';}
"="                   {return '=';}


/lex

/* operator associations and precedence (low-top, high- bottom) */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
 : '=' e EOF
     {return $2;}
 ;

e
 : e '+' e
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
 | NUMBER
     {$$ = Number(yytext);}
 | E
     {$$ = Math.E;}
 | PI
     {$$ = Math.PI;}
 | CELL
     {$$ = cellValue($1);}
 | IDENTIFIER '(' expseq ')'
     {$$ = FN($1,$3);}
 ;
 
expseq
 : e
 | e ';' expseq
 	{
 		$$ = ($.isArray($3) ? $3 : [$3]);
	 	$$.push($1);
 	}
 ;
