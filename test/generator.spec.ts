import { expect } from 'chai';
import { lex } from '../src/lexer';
import { parse } from '../src/parser';
import { generate } from '../src/generator';
import { createStream } from '../src/input-stream';
import { Expression, Program } from '../src/types';

describe('Generator', function() {
  const basicExpression = '(some-func 1 3.14 405 "foo")';
  const nestedExpression = '(some-func 1.4\n  (concat "foo" "bar"))';
  const arrayExpression = '(some-func 1.4 (list 1 2 3 4 5))';

  const parseExpr = (input: string): Program => parse(lex(createStream(input)));

  describe('Compiling a program', function() {
    it('Compiles a basic ast', function() {
      const ast = parseExpr(basicExpression);

      const targetLang = generate(ast);

      expect(targetLang).to.eq(`fn_some_func(1, 3.14, 405, "foo")`);
    });

    it('Compiles operators to infix binary expressions', function() {
      const ast = parseExpr('(+ 2 3 (/ 5 4))');

      const targetLang = generate(ast);

      expect(targetLang).to.eq(`(2 + 3 + (5 / 4))`);
    });

    it('Compiles multiple instructions', function() {
      const ast = parseExpr(nestedExpression);

      const targetLang = generate(ast);

      expect(targetLang).to.eq(`fn_some_func(1.4, fn_concat("foo", "bar"))`);
    });
  });
});
