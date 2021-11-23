import { expect } from 'chai';
import { lex } from '../src/lexer';
import { parse } from '../src/parser';
import { generate } from '../src/generator';
import { createStream } from '../src/input-stream';
import { Expression, Program } from '../src/types';

describe('Generator', function() {
  const basicExpression = '(some-func 1 3.14 405 "foo")';
  const nestedExpression = '(some-func 1.4\n  (concat "foo" "bar"))';

  const parseExpr = (input: string): Program => parse(lex(createStream(input)));

  describe('Compiling a program', function() {
    it('Compiles a basic ast', function() {
      const ast = parseExpr('(some-func 1 3.14 405 "foo")');

      const targetLang = generate(ast);

      expect(targetLang).to.eq(`fn_some_func(1, 3.14, 405, "foo")`);
    });

    it('Compiles operators to infix binary expressions', function() {
      const ast = parseExpr('(+ 2 3 (/ 5 4))');

      const targetLang = generate(ast);

      expect(targetLang).to.eq(`(2 + 3 + (5 / 4))`);
    });

    it('Compiles equality correctly', function() {
      const ast = parseExpr('(= 2 3 (/ 5 4))');

      const targetLang = generate(ast);

      expect(targetLang).to.eq(`2 === 3 && 2 === (5 / 4)`);
    });

    it('Compiles multiple argument comparison correctly', function() {
      const ast = parseExpr('(> 5 4 (+ 2 3))');

      const targetLang = generate(ast);

      expect(targetLang).to.eq(`5 > 4 && 4 > (2 + 3)`);
    });


    it('Compiles nested instructions', function() {
      const ast = parseExpr('(some-func 1.4\n  (concat "foo" "bar"))');

      const targetLang = generate(ast);

      expect(targetLang).to.eq(`fn_some_func(1.4, fn_concat("foo", "bar"))`);
    });

    describe('Macros', function() {
      it('Compiles basic lambdas', function() {
        const ast = parseExpr('(lambda (x) (+ 1 x))');

        const targetLang = generate(ast);

        expect(targetLang).to.eq(`(x) => { return (1 + x); }`);
      });

      it('Compiles basic define blocks', function() {
        const ast = parseExpr('(define add1 (lambda (x) (+ 1 x)))');

        const targetLang = generate(ast);

        expect(targetLang).to.eq(`const add1 = (x) => { return (1 + x); };`);
      });
    });
  });
});
