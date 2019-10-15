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
        'O_PAREN',
        'IDENT',
        'INTEGER',
        'INTEGER',
        'INTEGER',
        'C_PAREN'
      ]);
    });

    it('tokenizes a complex string', function() {
      //const basicProgram = '(module "foo"\n  (concat "foo" "bar" (toString (+ 10.3 5))';
      const stream = createStream(basicProgram);

      const result = lex(stream);

      expect(result.map(token => token.kind)).to.deep.eq([
        'O_PAREN',
        'IDENT',
        'STRING',
        'O_PAREN',
        'IDENT',
        'STRING',
        'STRING',
        'O_PAREN',
        'IDENT',
        'O_PAREN',
        'IDENT',
        'FLOAT',
        'INTEGER',
        'C_PAREN',
        'C_PAREN'
      ]);
    });
  });
});
