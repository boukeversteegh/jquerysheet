/* description: Parses end evaluates mathematical expressions. */

/* lexical grammar */
%lex
%%
\s+									{/* skip whitespace */}
'"'("\\"["]|[^"])*'"'				{return 'STRING';}
"'"('\\'[']|[^'])*"'"				{return 'STRING';}
'SHEET'[0-9]+
%{
	if (yy.lexer.obj.cell) return 'SHEET'; //js
	return 'VARIABLE'; //js
%}
'$'[A-Za-z]+'$'[0-9]+
%{
	if (yy.lexer.obj.cell) return 'FIXEDCELL'; //js
	return 'VARIABLE';
%}
[A-Za-z]+[0-9]+
%{
	if (yy.lexer.obj.cell) return 'CELL'; //js
	return 'VARIABLE';
%}
[A-Za-z]+(?=[(])    				{return 'FUNCTION';}
[A-Za-z]+           				{return 'VARIABLE';}
[0-9]+([.][0-9])?			  		{return 'NUMBER';}
"$"									{/* skip whitespace */}
" "									{return ' ';}
[.]									{return 'DECIMAL';}
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
	variableSequence
		{
			$$ = yy.lexer.handler.variable.apply(yy.lexer.obj, $1);//js
            //php $$ = $this->variable($1);
		}
	| NUMBER
		{$$ = $1 * 1;}
	| STRING
		{
			$$ = $1.substring(1, $1.length - 1);//js
			//php $$ = substr($1, 1, -1);
		}
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
		{
			$$ = Math.pow(($1 * 1), ($3 * 1));//js
			//php $$ = pow(($1 * 1), ($3 * 1));
		}
	| '-' expression
		{$$ = $2 * -1;}
	| '+' expression
		{$$ = $2 * 1;}
	| NUMBER '%'
		{$$ = $1 * 0.01;}
	| E
		{/*$$ = Math.E;*/;}
	| FUNCTION '(' ')'
		{
			$$ = yy.lexer.handler.callFunction($1, '', yy.lexer.obj);//js
			//php $$ = $this->callFunction($1);
		}
	| FUNCTION '(' expseq ')'
		{
			$$ = yy.lexer.handler.callFunction($1, $3, yy.lexer.obj);//js
			//php $$ = $this->callFunction($1, $3);
		}
	| cell
;

cell :
	FIXEDCELL
		{
			$$ = yy.lexer.handler.fixedCellValue.apply(yy.lexer.obj, new Array($1));//js
			//php $$ = $this->fixedCellValue($1);
		}
	| FIXEDCELL ':' FIXEDCELL
		{
			$$ = yy.lexer.handler.fixedCellRangeValue.apply(yy.lexer.obj, new Array($1, $3));//js
			//php $$ = $this->fixedCellRangeValue($1, $3);
		}
	| CELL
		{
			$$ = yy.lexer.handler.cellValue.apply(yy.lexer.obj, new Array($1));//js
			//php $$ = $this->cellValue($1);
		}
	| CELL ':' CELL
		{
			$$ = yy.lexer.handler.cellRangeValue.apply(yy.lexer.obj, new Array($1, $3));//js
			//php $$ = $this->cellRangeValue($1, $3);
		}
	| SHEET '!' CELL
		{
			$$ = yy.lexer.handler.remoteCellValue.apply(yy.lexer.obj, new Array($1, $3));//js
			//php $$ = $this->remoteCellValue($1, $3);
		}
	| SHEET '!' CELL ':' CELL
		{
			$$ = yy.lexer.handler.remoteCellRangeValue.apply(yy.lexer.obj, new Array($1, $3, $5));//js
			//php $$ = $this->remoteCellRangeValue($1, $3, $5);
		}
;

expseq : 
	expression
		{
			$$ = [$1];//js
			//php $$ = array($1);
		}
	| expression ';' expseq
	    {
	        $$ = ($.isArray($3) ? $3 : [$3]);//js
		    $$.push($1);//js

			//php $$ = (is_array($3) ? $3 : array());
			//php $$[] = $1;
	    }
 	| expression ',' expseq
		{
	        $$ = ($.isArray($3) ? $3 : [$3]);//js
		    $$.push($1);//js

			//php $$ = (is_array($3) ? $3 : array());
			//php $$[] = $1;
	    }
 ;


variableSequence :
	VARIABLE
		{
			$$ = [$1]; //js
			//php $$ = array($1);
		}
	| variableSequence DECIMAL VARIABLE
		{
			$$ = ($.isArray($1) ? $1 : [$1]);//js
            $$.push($3);//js

            //php $$ = (is_array($1) ? $1 : array());
            //php $$[] = $3;
		}
;