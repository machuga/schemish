import { expect } from 'chai';
import { lex } from '../src/lexer';
import { parse } from '../src/parser';
import { generate } from '../src/generator';
import { createStream } from '../src/input-stream';
import {Expression} from '../src/types';

describe('Generator', function() {
  const basicExpression = '(some-func 1 3.14 405 "foo")';
  const nestedExpression = '(some-func 1.4\n  (concat "foo" "bar"))';
  const arrayExpression = '(some-func 1.4 (1 2 3 4 5))';

  describe('Compiling a program', function() {
    it('Compiles a basic ast', function() {
      const ast = parse(lex(createStream(basicExpression)));

      const targetLang = generate(ast);

      expect(targetLang).to.eq(`function () { return fn_some_func(1, 3.14, 405, "foo"); };`);
    });
  });
});
