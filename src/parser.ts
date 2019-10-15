import { Token, TokenStream } from './types';
import {Operator} from './tokens';

const createStream = (tokens : Token[]) : TokenStream => {
  let current = 0;
  const lastTokenIndex = tokens.length - 1;

  const peek = (offset = 0) => tokens[current + offset];
  const next = () => {
    const token = peek();

    current += 1;

    return token;
  };

  const isEOF = () => peek() === undefined;

  const positionInfo = () => tokens[current].position;

  return {
    next, peek, isEOF, positionInfo
  };
};

export const parse = (tokens : Token[]) => {
  const { next, isEOF } = createStream(tokens);

  const parseArgs = () => {
    const args = [];

    // Get the next value
    let current = next();

    while (!isEOF() && current.value !== Operator.C_PAREN) {
      if (current.value === Operator.O_PAREN) {
        args.push(parseForm());
      } else {
        args.push(current);
      }
      current = next();
    }

    // Consume the close paren token
    next();

    return args;
  };

  const parseForm = () => {
    // Get rid of the opening paren
    let nameToken = next();
    const node = {
      kind: 'FUNCTION',
      name: nameToken.value,
      position: nameToken.position,
      args: parseArgs()
    };

    return node;
  }

  const startToken = next();

  switch(startToken.value) {
    case Operator.O_PAREN:
      return parseForm();
    default:
      throw new Error('wtf happened');
   }
};
