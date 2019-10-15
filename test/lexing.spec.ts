import { expect } from 'chai';
import { readWhile, readUntil, readUntilNext, readString} from '../src/lexing';
import { createStream } from '../src/input-stream';

describe('Lexing', function() {
  describe('readUntilNext', function() {
    it('returns only up until unescaped matching character', function() {
      const stream = createStream('"foo" one two');

      const result = readUntilNext(stream.next(), stream);

      expect(result).to.equal('foo');
    });

    it('returns string with escaped matching character', function() {
      // Need to double escape because javascript
      const stream = createStream('"foo \\"one\\"" two');

      const result = readUntilNext(stream.next(), stream);

      expect(result).to.equal('foo \\"one\\"');
      expect(stream.positionInfo().column).to.equal(12);
    });

    it('returns nothing when first token matches', function() {
      // Need to double escape because javascript
      const stream = createStream('boof');

      const result = readUntilNext('b', stream);

      expect(result).to.equal('');
      expect(stream.peek()).to.equal('b');
      expect(stream.positionInfo().column).to.equal(0);
    });
  });

  describe("Lexing strings", function() {
    it('returns only up until unescaped matching character', function() {
      const stream = createStream('"foo" one two');
      const result = readString(stream.next(), stream);

      expect(result).to.equal('"foo"');
    });

    it('returns string with escaped matching character', function() {
      // Need to double escape because javascript
      const stream = createStream('"foo \\"one\\"" two');
      const result = readString(stream.next(), stream);

      expect(result).to.equal('"foo \\"one\\""');
      expect(stream.positionInfo().column).to.equal(13);
    });

    it('returns nothing when first token matches', function() {
      // Need to double escape because javascript
      const stream = createStream('boof');
      expect(function() {
        readString('"', stream);
      }).to.throw(/EOF/);
    });
  });

  describe('reading with predicate', function() {
    it('keeps reading while predicate is true', function() {
      const stream = createStream('(+ 1 2 3)');
      const match = readWhile((currentChar) => currentChar !== '3', stream);

      expect(match).to.equal('(+ 1 2 ');
    });

    it('keeps reading until predicate is true', function() {
      const stream = createStream('(+ 1 2 3)');
      const match = readUntil((currentChar) => currentChar === '2', stream);

      expect(match).to.equal('(+ 1 ');
    });
  });
});
