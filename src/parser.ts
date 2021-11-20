import { Token, TokenStream, Expression } from './types';
import { Operator } from './tokens';

const createStream = (tokens: Token[]): TokenStream => {
  let current = 0;
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

export const parse = (tokens: Token[]): Expression => {
  const { next, isEOF } = createStream(tokens);

  const parseArgs = () => {
    const args: Expression[] = [];

    // Get the next value
    let current = next();

    while (!isEOF() && current.value !== Operator.CloseParen) {
      if (current.value === Operator.OpenParen) {
        args.push(parseForm());
      } else {
        args.push(<Expression>current);
      }
      current = next();
    }

    // Consume the close paren token
    next();

    return args;
  };

  const parseForm = (): Expression => {
    // Get rid of the opening paren
    let nameToken = next();
    if (nameToken.kind !== 'Identifier') {
      throw new Error('Invalid first argument');
    }
    const node = {
      kind: 'Function',
      name: <string>nameToken.value,
      value: nameToken.value,
      position: nameToken.position,
      args: parseArgs()
    };

    return node;
  }

  const startToken = next();

  switch (startToken.value) {
    case Operator.OpenParen:
      return parseForm();
    default:
      throw new Error('wtf happened');
  }
};
