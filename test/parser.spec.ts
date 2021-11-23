import { expect } from 'chai';
import { lex } from '../src/lexer';
import { parse } from '../src/parser';
import { Atom, Element, SExpression } from '../src/types';
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
      const args: Element[] = (node as SExpression).elements || [];

      expect(args).to.have.lengthOf(5);
      expect((args[0] as Atom).value).to.eq('some-func');
      expect(args[1].type).to.eq('Integer');
      expect(args[2].type).to.eq('Float');
      expect(args[3].type).to.eq('Integer');
      expect(args[4].type).to.eq('String');
    });

    it('Parses a nested token stream', function() {
      const tokens = lex(createStream('(some-func 1.4\n  (concat "foo" "bar"))'));

      const ast = parse(tokens);
      const [node] = ast.body;

      const args: Element[] = (node as SExpression).elements || [];
      const nestedExpr = (args[2] as SExpression);

      expect(args).to.have.lengthOf(3);
      expect((args[0] as Atom).value).to.eq('some-func');
      expect(args[1].type).to.eq('Float');
      expect(args[2].type).to.eq('SExpression');

      expect(nestedExpr.elements).to.have.lengthOf(3);
      expect((nestedExpr.elements[0] as Atom).value).to.eq('concat');
      expect(nestedExpr.elements[1].type).to.eq('String');
      expect(nestedExpr.elements[2].type).to.eq('String');
    });
  });
});
