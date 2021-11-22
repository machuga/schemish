import { Token, TokenStream, Expression, Program } from './types';
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

export const parse = (tokens: Token[]): Program => {
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


    return args;
  };

  const parseForm = (): Expression => {
    // Get rid of the opening paren
    let nameToken = next();

    if (nameToken.kind !== 'Identifier') {
      throw new Error('Invalid first argument');
    }

    const node = {
      kind: 'Call',
      name: <string>nameToken.value,
      value: nameToken.value,
      position: nameToken.position,
      args: parseArgs()
    };

    return node;
  }

  const nodes: Expression[] = [];

  while (!isEOF()) {
    let token = next();

    switch (token.value) {
      case Operator.OpenParen:
        nodes.push(parseForm());
        break;
      default:
        console.error("This is bad", token, token.value === Operator.OpenParen);
        throw new Error('oh no');
    }
  }

  return {
    name: 'Program',
    body: nodes,
    position: {
      line: 0,
      column: 0,
    }
  };
}
