/* description: Parses a tab separated value to an array */

/* lexical grammar */
%lex
%%
\s+									{/* skip whitespace */}
'"'				                    {return 'DOUBLE_PARENTHESES';}
"'"				                    {return 'SINGLE_PARENTHESES';}
\n                                  {return 'END_OF_LINE';}
\t                                  {return 'TAB';}
.                                   {return 'VALUE';}
<<EOF>>								{return 'EOF';}


/lex

%start cells

%% /* language grammar */

cells
: cells EOF
     {return $1;}
;

cells :
	rows
		{
			$$ = yy.lexer.handler.variable.apply(yy.lexer.obj, $1);//js
            //php $$ = $this->variable($1);
		}
	| cells rows
		{

		}
;

rows :
	END_OF_LINE
		{
			$$ = [$1]; //js
			//php $$ = array($1);
		}
	| columns END_OF_LINE
		{
			$$ = ($.isArray($1) ? $1 : [$1]);//js
            $$.push($3);//js

            //php $$ = (is_array($1) ? $1 : array());
            //php $$[] = $3;
		}
;

columns :
	COLUMN
		{
			$$ = [$1]; //js
			//php $$ = array($1);
		}
	| columns COLUMN
		{
			$$ = ($.isArray($1) ? $1 : [$1]);//js
            $$.push($3);//js

            //php $$ = (is_array($1) ? $1 : array());
            //php $$[] = $3;
		}
;