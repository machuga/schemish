import { expect } from 'chai';
import { lex } from '../src/lexer';
import { parse } from '../src/parser';
import { createStream } from '../src/input-stream';

describe('Parser', function() {
  const basicExpression = '(some-func 1 3.14 405 "foo")';
  const nestedExpression = '(some-func 1.4\n  (concat "foo" "bar"))';
  const arrayExpression = '(some-func 1.4 (list 1 2 3 4 5))';

  describe('Parsing a program', function() {
    it('Parses a basic token stream', function() {
      const tokens = lex(createStream(basicExpression));

      const ast = parse(tokens);

      expect(ast.name).to.eq('some-func');
      expect(ast.args).to.have.lengthOf(4);
      expect(ast.args[0].kind).to.eq('Integer');
      expect(ast.args[1].kind).to.eq('Float');
      expect(ast.args[2].kind).to.eq('Integer');
      expect(ast.args[3].kind).to.eq('String');
    });

    it('Parses a nested token stream', function() {
      const tokens = lex(createStream(nestedExpression));

      const ast = parse(tokens);
      const expr = ast.args[1];

      expect(ast.name).to.eq('some-func');
      expect(ast.args).to.have.lengthOf(2);
      expect(ast.args[0].kind).to.eq('Float');
      expect(expr.kind).to.eq('Function');
      expect(expr.name).to.eq('concat');
      expect(expr.args).to.have.lengthOf(2);
      expect(expr.args[0].kind).to.eq('String');
      expect(expr.args[1].kind).to.eq('String');
    });
  });
});
