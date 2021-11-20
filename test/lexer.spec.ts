import { expect } from 'chai';
import { lex } from '../src/lexer';
import { createStream } from '../src/input-stream';

describe('Lexer', function() {
  const basicExpression = '(+ 1 2 305)';
  const basicProgram = '(module "foo"\n  (concat "foo" "bar" (toString (+ 10.3 5))';

  describe('Lexing a program', function() {
    it('tokenizes a basic string', function() {
      const stream = createStream(basicExpression);

      const result = lex(stream);

      //expect(result).to.have.lengthOf(5);
      expect(result.map(token => token.kind)).to.deep.eq([
        'OpenParen',
        'Identifier',
        'Integer',
        'Integer',
        'Integer',
        'CloseParen'
      ]);
    });

    it('tokenizes a complex string', function() {
      //const basicProgram = '(module "foo"\n  (concat "foo" "bar" (toString (+ 10.3 5))';
      const stream = createStream(basicProgram);

      const result = lex(stream);

      expect(result.map(token => token.kind)).to.deep.eq([
        'OpenParen',
        'Identifier',
        'String',
        'OpenParen',
        'Identifier',
        'String',
        'String',
        'OpenParen',
        'Identifier',
        'OpenParen',
        'Identifier',
        'Float',
        'Integer',
        'CloseParen',
        'CloseParen'
      ]);
    });

    it('tokenizes quoted lists', function() {
      const stream = createStream("'(1 2 3 4 5)");

      const result = lex(stream);

      expect(result.map(token => token.kind)).to.deep.eq([
        'SingleQuote',
        'OpenParen',
        'Integer',
        'Integer',
        'Integer',
        'Integer',
        'Integer',
        'CloseParen',
      ]);
    });
  });
});
