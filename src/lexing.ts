// Grab all including ending char
// Super imperative right now
import { InputStream } from './types';

const ESCAPE_CHAR = '\\';

const matchesEndChar = (boundaryChar : string, escaped : boolean, currentChar : string) =>
  boundaryChar === currentChar && escaped === false;

type ReadPredicate = (currentChar : string) => boolean;

export const readWhile = (predicate : ReadPredicate, input : InputStream) => {
  let chars = [];

  while (!input.isEOF() && predicate(input.peek())) {
    chars.push(input.next());
  }

  return chars.join('');
};

export const readUntil = (predicate : ReadPredicate, input : InputStream) => {
  const invertedPredicate : ReadPredicate = (currentChar) => !predicate(currentChar);

  return readWhile(invertedPredicate, input);
};

export const readUntilNext = (boundaryChar : string, input : InputStream) => {
  const chars = [];
  let escaped = false;
  let current = input.peek();

  while (!matchesEndChar(boundaryChar, escaped, current)) {
    input.next();
    if (input.isEOF()) {
      throw new Error('Tried to read from EOF');
    }

    if (current === ESCAPE_CHAR) {
      escaped = true;
    } else {
      escaped = false;
    }

    chars.push(current);

    current = input.peek();
  }

  //chars.push(current);

  return chars.join('');
};

export const readString = (boundaryChar : string, input : InputStream) => {
  return boundaryChar + readUntilNext(boundaryChar, input) + input.next();
}
