/* description: Parses end evaluates mathematical expressions. */

/* lexical grammar */
%lex
%%
\s+				{/* skip whitespace */}
[0-9]+("."[0-9]+)?\b		{return 'NUMBER';}
[A-Z][0-9][":"][A-Z][0-9]+	{return 'CELLS';}
[A-Z][0-9]+			{return 'CELL';}
(\w)+["("]+			{return 'FN';}
"*"				{return '*';}
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
     {return $1;}
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
 | CELLS
     {$$ = cellValue($1);}
 | FN e ')'
     {$$ = FN([$1,$2,$3]);}
 ;
