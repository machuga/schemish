import { expect } from 'chai';
import { lex } from '../src/lexer';
import { parse } from '../src/parser';
import { createStream } from '../src/input-stream';

describe('Parser', function() {
  describe('Parsing a program', function() {
    it('Parses into a program', function() {
      const tokens = lex(createStream('(some-func 1 3.14 405 "foo")\n(another one two three)'));

      const ast = parse(tokens);

      expect(ast.name).to.eq('Program');
    });

    it('Parses a basic token stream', function() {
      const tokens = lex(createStream('(some-func 1 3.14 405 "foo")'));

      const ast = parse(tokens);

      const [node] = ast.body;

      expect(node.name).to.eq('some-func');
      expect(node.args).to.have.lengthOf(4);
      expect(node.args[0].kind).to.eq('Integer');
      expect(node.args[1].kind).to.eq('Float');
      expect(node.args[2].kind).to.eq('Integer');
      expect(node.args[3].kind).to.eq('String');
    });

    it('Parses a nested token stream', function() {
      const tokens = lex(createStream('(some-func 1.4\n  (concat "foo" "bar"))'));

      const ast = parse(tokens);
      const [node] = ast.body;

      const expr = node.args[1];

      expect(node.name).to.eq('some-func');
      expect(node.args).to.have.lengthOf(2);
      expect(node.args[0].kind).to.eq('Float');
      expect(expr.kind).to.eq('Call');
      expect(expr.name).to.eq('concat');
      expect(expr.args).to.have.lengthOf(2);
      expect(expr.args[0].kind).to.eq('String');
      expect(expr.args[1].kind).to.eq('String');
    });
  });
});
